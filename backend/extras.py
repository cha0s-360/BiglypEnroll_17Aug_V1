"""BiglypEnroll — extra features: Rewards, Reminders/Notifications, PDF receipts, Cashflow forecast.

Wired into server.py via create_extras_router(db, deps). Uses a factory so we avoid
circular imports (server.py owns the auth/helper functions and passes them in).
"""
import asyncio
import io
import logging
import os
import uuid
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from bson import ObjectId

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.pdfgen import canvas as pdfcanvas

logger = logging.getLogger("biglyp.extras")

# ---------------------------------------------------------------- email (Resend)
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev").strip()

_resend_ready = False
try:
    import resend as _resend_sdk
    if RESEND_API_KEY:
        _resend_sdk.api_key = RESEND_API_KEY
        _resend_ready = True
except Exception:  # pragma: no cover - defensive
    _resend_sdk = None


def _render_reminder_html(title: str, body: str, cta_label: str = "View in Biglyp") -> str:
    return f"""<!doctype html>
<html><body style="margin:0;padding:0;background:#F5F6FB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F6FB;padding:24px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(20,20,50,0.06);">
        <tr><td style="background:#5548D1;padding:20px 28px;color:#ffffff;">
          <div style="font-size:20px;font-weight:800;letter-spacing:-0.02em;">BiglypEnroll</div>
          <div style="font-size:12px;opacity:0.85;margin-top:2px;">Student Fee Reminder</div>
        </td></tr>
        <tr><td style="padding:28px;color:#1E2A44;">
          <div style="font-size:18px;font-weight:800;margin-bottom:8px;">{title}</div>
          <div style="font-size:14px;line-height:1.6;color:#4a5169;">{body}</div>
          <div style="margin-top:20px;">
            <span style="display:inline-block;background:#5548D1;color:#ffffff;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:700;">{cta_label}</span>
          </div>
        </td></tr>
        <tr><td style="padding:14px 28px;background:#F8F8FC;color:#9198a8;font-size:11px;">
          You&apos;re receiving this because your child&apos;s school uses BiglypEnroll for fee management.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>"""


async def send_email_via_resend(to_email: str, subject: str, html: str):
    """Send an email via Resend (non-blocking). Returns (status, provider_id_or_error)."""
    if not _resend_ready or not _resend_sdk:
        return ("queued", "resend_not_configured")
    if not to_email:
        return ("failed", "no_recipient")
    params = {"from": SENDER_EMAIL, "to": [to_email], "subject": subject, "html": html}
    try:
        result = await asyncio.to_thread(_resend_sdk.Emails.send, params)
        return ("sent", (result or {}).get("id") or "")
    except Exception as e:  # pragma: no cover - network
        logger.warning(f"Resend send failed to {to_email}: {e}")
        return ("failed", str(e)[:240])

# ---------------------------------------------------------------- defaults ----
DEFAULT_REMINDER_SETTINGS = {
    "enabled": True,
    "before_due_days": [7, 3, 1],
    "on_due": True,
    "overdue_days": [3, 7, 15],
}

BRAND = colors.HexColor("#5548D1")
NAVY = colors.HexColor("#1E2A44")


def academic_due_date() -> datetime:
    """Primary fee due date for the running academic year (15 Sep, rolls to next year if passed)."""
    now = datetime.now(timezone.utc)
    due = datetime(now.year, 9, 15, tzinfo=timezone.utc)
    if now.date() > due.date():
        due = datetime(now.year + 1, 9, 15, tzinfo=timezone.utc)
    return due


def _parse_sched_date(s: str):
    for fmt in ("%d %b %Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(s, fmt).replace(tzinfo=timezone.utc)
        except Exception:
            continue
    return None


def tier_for(points: int) -> str:
    if points >= 6000:
        return "Platinum"
    if points >= 3000:
        return "Gold"
    if points >= 1000:
        return "Silver"
    return "Bronze"


# --------------------------------------------------------- tier perks catalog --
TIER_PERKS = [
    {"tier": "Bronze", "icon": "life-buoy", "title": "Standard Support",
     "desc": "Email + chat support during business hours."},
    {"tier": "Bronze", "icon": "sparkles", "title": "Welcome Bonus",
     "desc": "Kick off with a Rs 100 wallet credit on first upfront payment."},

    {"tier": "Silver", "icon": "trending-up", "title": "5% Bonus Points",
     "desc": "Earn 5% extra reward points on every fee payment."},
    {"tier": "Silver", "icon": "message-circle", "title": "Priority Support",
     "desc": "Skip the queue with priority chat support."},

    {"tier": "Gold", "icon": "trending-up", "title": "10% Bonus Points",
     "desc": "Earn 10% extra reward points on every fee payment."},
    {"tier": "Gold", "icon": "file-check", "title": "Free Fee Certificates",
     "desc": "Download annual fee certificates anytime, no charges."},
    {"tier": "Gold", "icon": "clock", "title": "Early-bird EMI Slots",
     "desc": "Access premium 0% EMI slots before general release."},

    {"tier": "Platinum", "icon": "trending-up", "title": "20% Bonus Points",
     "desc": "Earn 20% extra reward points on every fee payment."},
    {"tier": "Platinum", "icon": "badge-check", "title": "Zero Processing Fee",
     "desc": "All financing plans processed with waived fees."},
    {"tier": "Platinum", "icon": "user-check", "title": "Dedicated Relationship Manager",
     "desc": "A personal RM handles queries within 4 business hours."},
]

TIER_ORDER = ["Bronze", "Silver", "Gold", "Platinum"]
TIER_THRESHOLDS = {"Bronze": 0, "Silver": 1000, "Gold": 3000, "Platinum": 6000}
COUPON_VALIDITY_DAYS = 90
RECENT_REDEMPTION_DAYS = 7


def tier_summary(points: int):
    """Return the current tier + progress info + which perks are unlocked/upcoming."""
    current = tier_for(points)
    cur_idx = TIER_ORDER.index(current)
    next_tier = TIER_ORDER[cur_idx + 1] if cur_idx < len(TIER_ORDER) - 1 else None
    next_at = TIER_THRESHOLDS[next_tier] if next_tier else None
    unlocked_tiers = set(TIER_ORDER[: cur_idx + 1])
    perks = [
        {**p, "unlocked": p["tier"] in unlocked_tiers}
        for p in TIER_PERKS
    ]
    return {
        "tier": current,
        "next_tier": next_tier,
        "next_at_points": next_at,
        "points_to_next": (next_at - points) if next_at else 0,
        "progress_pct": (
            min(100, int((points - TIER_THRESHOLDS[current]) * 100 /
                         max(1, (next_at - TIER_THRESHOLDS[current]))))
            if next_at else 100
        ),
        "perks": perks,
    }


def inr(n) -> str:
    try:
        n = int(round(float(n)))
    except Exception:
        return str(n)
    s = str(abs(n))
    if len(s) > 3:
        last3 = s[-3:]
        rest = s[:-3]
        parts = []
        while len(rest) > 2:
            parts.insert(0, rest[-2:])
            rest = rest[:-2]
        if rest:
            parts.insert(0, rest)
        s = ",".join(parts) + "," + last3
    return ("-" if n < 0 else "") + "Rs " + s


# ---------------------------------------------------------------- catalog seed -
COUPON_CATALOG = [
    {"id": "cp_amazon", "brand": "Amazon", "title": "Rs 500 Amazon Gift Card", "points_cost": 2000, "category": "Shopping"},
    {"id": "cp_flipkart", "brand": "Flipkart", "title": "Rs 500 Flipkart Voucher", "points_cost": 2000, "category": "Shopping"},
    {"id": "cp_myntra", "brand": "Myntra", "title": "Rs 400 Myntra Coupon", "points_cost": 1500, "category": "Fashion"},
    {"id": "cp_swiggy", "brand": "Swiggy", "title": "Rs 300 Swiggy Credits", "points_cost": 1200, "category": "Food"},
    {"id": "cp_bms", "brand": "BookMyShow", "title": "Buy 1 Get 1 Movie Ticket", "points_cost": 1000, "category": "Entertainment"},
    {"id": "cp_croma", "brand": "Croma", "title": "Rs 750 Croma Electronics Voucher", "points_cost": 2500, "category": "Electronics"},
]

COURSE_CATALOG = [
    {"id": "co_python", "title": "Young Coders — Python Basics", "duration": "8 weeks", "points_cost": 1500, "category": "Technology", "desc": "Beginner-friendly coding for school kids."},
    {"id": "co_abacus", "title": "Abacus & Mental Math", "duration": "12 weeks", "points_cost": 1200, "category": "Academics", "desc": "Boost calculation speed & concentration."},
    {"id": "co_speaking", "title": "Public Speaking Lab", "duration": "6 weeks", "points_cost": 1000, "category": "Life Skills", "desc": "Confident stage presence & communication."},
    {"id": "co_robotics", "title": "Robotics Starter Kit Course", "duration": "10 weeks", "points_cost": 1800, "category": "Technology", "desc": "Hands-on robotics & electronics basics."},
    {"id": "co_writing", "title": "Creative Writing Workshop", "duration": "6 weeks", "points_cost": 900, "category": "Arts", "desc": "Storytelling, poetry & imagination."},
    {"id": "co_french", "title": "Spoken French for Beginners", "duration": "10 weeks", "points_cost": 1600, "category": "Language", "desc": "Conversational French foundations."},
]


async def seed_extras(db):
    """Seed reward catalogs + a couple of demo notifications for the demo parent."""
    if await db.reward_coupons.count_documents({}) == 0:
        await db.reward_coupons.insert_many([dict(c) for c in COUPON_CATALOG])
    if await db.enrichment_courses.count_documents({}) == 0:
        await db.enrichment_courses.insert_many([dict(c) for c in COURSE_CATALOG])

    # demo notifications for the seeded parent so the bell isn't empty
    parent = await db.users.find_one({"email": "parent@biglyp.com"})
    if parent:
        pid = str(parent["_id"])
        if await db.notifications.count_documents({"parent_id": pid}) == 0:
            child = await db.students.find_one({"parent_id": pid})
            sname = child["name"] if child else "your child"
            sid = str(child["_id"]) if child else None
            due = academic_due_date()
            now = datetime.now(timezone.utc)
            samples = [
                {"category": "before", "title": "Fee payment reminder",
                 "body": f"{sname}'s school fees are due on {due.strftime('%d %b %Y')}. Pay early to earn bonus reward points!",
                 "read": False},
                {"category": "reward", "title": "You earned reward points",
                 "body": "Great news! Reward points are now active on your account. Redeem them for brand coupons or enrichment courses.",
                 "read": True},
            ]
            for i, s in enumerate(samples):
                await db.notifications.insert_one({
                    "id": str(uuid.uuid4()),
                    "school_id": parent.get("school_id"),
                    "parent_id": pid, "student_id": sid,
                    "category": s["category"], "title": s["title"], "body": s["body"],
                    "read": s["read"],
                    "dedupe_key": f"seed:{i}",
                    "created_at": (now - timedelta(hours=i * 5)).isoformat(),
                })


# ---------------------------------------------------------------- factory -----
def create_extras_router(db, deps):
    get_current_user = deps["get_current_user"]
    require_roles = deps["require_roles"]
    resolve_student = deps["resolve_student"]
    compute_pending = deps["compute_pending"]
    get_user_school_id = deps["get_user_school_id"]
    STAFF_ROLES = deps["STAFF_ROLES"]
    ACADEMIC_YEAR = deps["ACADEMIC_YEAR"]

    router = APIRouter(prefix="/api")

    # ============================================================ REWARDS ======
    async def _get_account(parent_id, school_id):
        acc = await db.rewards_accounts.find_one({"parent_id": parent_id})
        if not acc:
            acc = {"id": str(uuid.uuid4()), "parent_id": parent_id, "school_id": school_id,
                   "points": 0, "wallet": 0.0,
                   "updated_at": datetime.now(timezone.utc).isoformat()}
            await db.rewards_accounts.insert_one(dict(acc))
        acc.pop("_id", None)
        return acc

    async def award_rewards(parent_id, school_id, amount, kind_label):
        """kind_label: 'full' | 'financing' | 'autodebit'. Returns points/wallet awarded."""
        if not parent_id or amount <= 0:
            return {"points": 0, "wallet": 0}
        base = int(amount // 100)
        if kind_label == "full":
            points, wallet = base * 2, round(amount * 0.01)
            desc = "Upfront payment bonus (2x points + 1% cashback)"
        elif kind_label == "financing":
            points, wallet = base, round(amount * 0.005)
            desc = "0% EMI plan reward (points + 0.5% cashback)"
        else:
            points, wallet = base, 0
            desc = "Auto-debit setup reward"
        await _get_account(parent_id, school_id)
        await db.rewards_accounts.update_one(
            {"parent_id": parent_id},
            {"$inc": {"points": points, "wallet": wallet},
             "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
        )
        await db.rewards_txns.insert_one({
            "id": str(uuid.uuid4()), "parent_id": parent_id, "school_id": school_id,
            "kind": "earn", "points_delta": points, "wallet_delta": wallet,
            "description": desc, "created_at": datetime.now(timezone.utc).isoformat(),
        })
        return {"points": points, "wallet": wallet}

    async def spend_wallet(parent_id, amount):
        """Deduct up to `amount` from wallet; returns amount actually applied."""
        acc = await db.rewards_accounts.find_one({"parent_id": parent_id})
        if not acc or acc.get("wallet", 0) <= 0:
            return 0.0
        applied = min(float(acc["wallet"]), float(amount))
        if applied <= 0:
            return 0.0
        await db.rewards_accounts.update_one(
            {"parent_id": parent_id},
            {"$inc": {"wallet": -applied},
             "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
        )
        await db.rewards_txns.insert_one({
            "id": str(uuid.uuid4()), "parent_id": parent_id, "school_id": acc.get("school_id"),
            "kind": "apply_wallet", "points_delta": 0, "wallet_delta": -applied,
            "description": "Wallet credit applied to fee payment",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        return applied

    @router.get("/parent/rewards")
    async def get_rewards(user: dict = Depends(get_current_user)):
        if user["role"] != "parent":
            raise HTTPException(status_code=403, detail="Parents only")
        acc = await _get_account(user["id"], user.get("school_id"))
        txns = []
        async for t in db.rewards_txns.find({"parent_id": user["id"]}).sort("created_at", -1).limit(30):
            t.pop("_id", None)
            txns.append(t)
        summary = tier_summary(acc["points"])
        return {"points": acc["points"], "wallet": round(acc["wallet"], 2),
                "tier": summary["tier"], "next_tier": summary["next_tier"],
                "next_at_points": summary["next_at_points"],
                "points_to_next": summary["points_to_next"],
                "progress_pct": summary["progress_pct"],
                "perks": summary["perks"],
                "transactions": txns}

    @router.get("/rewards/catalog")
    async def rewards_catalog(user: dict = Depends(get_current_user)):
        coupons, courses = [], []
        async for c in db.reward_coupons.find({}):
            c.pop("_id", None)
            coupons.append(c)
        async for c in db.enrichment_courses.find({}):
            c.pop("_id", None)
            courses.append(c)
        coupons.sort(key=lambda x: x["points_cost"])
        courses.sort(key=lambda x: x["points_cost"])
        return {"coupons": coupons, "courses": courses}

    class RedeemCouponIn(BaseModel):
        coupon_id: str

    @router.post("/parent/rewards/redeem-coupon")
    async def redeem_coupon(body: RedeemCouponIn, user: dict = Depends(get_current_user)):
        if user["role"] != "parent":
            raise HTTPException(status_code=403, detail="Parents only")
        coupon = await db.reward_coupons.find_one({"id": body.coupon_id})
        if not coupon:
            raise HTTPException(status_code=404, detail="Coupon not found")
        acc = await _get_account(user["id"], user.get("school_id"))
        cost = coupon["points_cost"]
        if acc["points"] < cost:
            raise HTTPException(status_code=400, detail=f"Not enough points. Need {cost}, have {acc['points']}.")
        code = coupon["brand"][:4].upper() + "-" + uuid.uuid4().hex[:8].upper()
        await db.rewards_accounts.update_one(
            {"parent_id": user["id"]},
            {"$inc": {"points": -cost}, "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
        )
        await db.rewards_txns.insert_one({
            "id": str(uuid.uuid4()), "parent_id": user["id"], "school_id": user.get("school_id"),
            "kind": "redeem_coupon", "points_delta": -cost, "wallet_delta": 0,
            "description": f"Redeemed: {coupon['title']}", "created_at": datetime.now(timezone.utc).isoformat(),
        })
        now = datetime.now(timezone.utc)
        red = {"id": str(uuid.uuid4()), "parent_id": user["id"], "kind": "coupon",
               "item_id": coupon["id"], "title": coupon["title"], "brand": coupon["brand"],
               "code": code, "points_spent": cost,
               "created_at": now.isoformat(),
               "expires_at": (now + timedelta(days=COUPON_VALIDITY_DAYS)).isoformat()}
        await db.rewards_redemptions.insert_one(dict(red))
        red.pop("_id", None)
        return {"ok": True, "voucher_code": code, "redemption": red}

    class EnrollCourseIn(BaseModel):
        course_id: str
        student_id: str

    @router.post("/parent/rewards/enroll-course")
    async def enroll_course(body: EnrollCourseIn, user: dict = Depends(get_current_user)):
        if user["role"] != "parent":
            raise HTTPException(status_code=403, detail="Parents only")
        student = await resolve_student(body.student_id, user)
        course = await db.enrichment_courses.find_one({"id": body.course_id})
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        acc = await _get_account(user["id"], user.get("school_id"))
        cost = course["points_cost"]
        if acc["points"] < cost:
            raise HTTPException(status_code=400, detail=f"Not enough points. Need {cost}, have {acc['points']}.")
        await db.rewards_accounts.update_one(
            {"parent_id": user["id"]},
            {"$inc": {"points": -cost}, "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}},
        )
        await db.rewards_txns.insert_one({
            "id": str(uuid.uuid4()), "parent_id": user["id"], "school_id": user.get("school_id"),
            "kind": "redeem_course", "points_delta": -cost, "wallet_delta": 0,
            "description": f"Enrolled {student['name']} in {course['title']}",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        red = {"id": str(uuid.uuid4()), "parent_id": user["id"], "kind": "course",
               "item_id": course["id"], "title": course["title"], "student_id": student["id"],
               "student_name": student["name"], "points_spent": cost, "status": "Enrolled",
               "created_at": datetime.now(timezone.utc).isoformat()}
        await db.rewards_redemptions.insert_one(dict(red))
        red.pop("_id", None)
        return {"ok": True, "redemption": red}

    @router.get("/parent/rewards/redemptions")
    async def list_redemptions(user: dict = Depends(get_current_user)):
        if user["role"] != "parent":
            raise HTTPException(status_code=403, detail="Parents only")
        out = []
        async for r in db.rewards_redemptions.find({"parent_id": user["id"]}).sort("created_at", -1):
            r.pop("_id", None)
            out.append(r)
        return out

    # ============================================ REMINDERS / NOTIFICATIONS =====
    @router.get("/school/reminder-settings")
    async def get_reminder_settings(user: dict = Depends(require_roles(*STAFF_ROLES))):
        sid = await get_user_school_id(user)
        school = await db.schools.find_one({"_id": ObjectId(sid)})
        rs = (school or {}).get("reminder_settings") or DEFAULT_REMINDER_SETTINGS
        return {**DEFAULT_REMINDER_SETTINGS, **rs}

    class ReminderSettingsIn(BaseModel):
        enabled: bool = True
        before_due_days: list = [7, 3, 1]
        on_due: bool = True
        overdue_days: list = [3, 7, 15]

    @router.post("/school/reminder-settings")
    async def save_reminder_settings(body: ReminderSettingsIn, user: dict = Depends(require_roles(*STAFF_ROLES))):
        sid = await get_user_school_id(user)
        clean_before = sorted({int(d) for d in body.before_due_days if 0 < int(d) <= 60})
        clean_overdue = sorted({int(d) for d in body.overdue_days if 0 < int(d) <= 120})
        rs = {"enabled": bool(body.enabled), "before_due_days": clean_before,
              "on_due": bool(body.on_due), "overdue_days": clean_overdue}
        await db.schools.update_one({"_id": ObjectId(sid)}, {"$set": {"reminder_settings": rs}})
        return rs

    async def generate_reminders(school_id=None, force=False):
        today = datetime.now(timezone.utc).date()
        due = academic_due_date()
        days_to = (due.date() - today).days
        query = {} if school_id is None else {"_id": ObjectId(school_id)}
        created = 0
        async for school in db.schools.find(query):
            sid = str(school["_id"])
            rs = {**DEFAULT_REMINDER_SETTINGS, **(school.get("reminder_settings") or {})}
            if not rs.get("enabled", True):
                continue
            before_days = sorted(rs.get("before_due_days", []), reverse=True)
            overdue_days = sorted(rs.get("overdue_days", []))
            async for student in db.students.find({"school_id": sid, "parent_id": {"$ne": None}}):
                stu = {"id": str(student["_id"]), **{k: v for k, v in student.items() if k != "_id"}}
                if not stu.get("parent_id"):
                    continue
                pending = await compute_pending(sid, student and stu)
                total = sum(i["amount"] for i in pending if not i["paid"])
                if total <= 0:
                    continue
                triggers = []
                if force:
                    if days_to >= 0:
                        triggers.append(("due", 0) if (days_to == 0 and rs.get("on_due", True)) else ("before", days_to))
                    else:
                        triggers.append(("overdue", -days_to))
                else:
                    for d in before_days:
                        if days_to == d:
                            triggers.append(("before", d))
                    if rs.get("on_due", True) and days_to == 0:
                        triggers.append(("due", 0))
                    for d in overdue_days:
                        if days_to == -d:
                            triggers.append(("overdue", d))
                for cat, off in triggers:
                    dedupe = f"{stu['id']}:{cat}:{off}:{due.date()}"
                    if await db.notifications.find_one({"dedupe_key": dedupe}):
                        continue
                    if cat == "before":
                        title = "Upcoming fee payment reminder"
                        body = f"{stu['name']}'s fees of {inr(total)} are due on {due.strftime('%d %b %Y')} ({off} day{'s' if off != 1 else ''} to go). Pay upfront to earn bonus reward points."
                    elif cat == "due":
                        title = "Fees due today"
                        body = f"{stu['name']}'s fees of {inr(total)} are due today ({due.strftime('%d %b %Y')}). Please pay to avoid late fees."
                    else:
                        title = "Overdue fee notice"
                        body = f"{stu['name']}'s fees of {inr(total)} are overdue by {off} day{'s' if off != 1 else ''}. Kindly clear the dues at the earliest."
                    await db.notifications.insert_one({
                        "id": str(uuid.uuid4()), "school_id": sid,
                        "parent_id": stu["parent_id"], "student_id": stu["id"],
                        "category": cat, "title": title, "body": body,
                        "amount": total, "due_date": due.isoformat(), "read": False,
                        "dedupe_key": dedupe, "created_at": datetime.now(timezone.utc).isoformat(),
                    })
                    # send email via Resend (if configured); log status either way
                    parent = await db.users.find_one({"_id": ObjectId(stu["parent_id"])})
                    if parent:
                        html = _render_reminder_html(title, body)
                        status, provider_ref = await send_email_via_resend(
                            parent.get("email") or "", title, html
                        )
                        await db.email_log.insert_one({
                            "id": str(uuid.uuid4()), "to": parent.get("email"),
                            "subject": title, "body": body, "status": status,
                            "provider": "resend" if _resend_ready else "none",
                            "provider_ref": provider_ref,
                            "school_id": sid, "created_at": datetime.now(timezone.utc).isoformat(),
                        })
                    created += 1
        return created

    class RunRemindersIn(BaseModel):
        force: bool = False

    @router.post("/reminders/run")
    async def run_reminders(body: RunRemindersIn, user: dict = Depends(require_roles(*STAFF_ROLES))):
        sid = await get_user_school_id(user)
        n = await generate_reminders(school_id=sid, force=body.force)
        return {"created": n}

    @router.get("/parent/notifications")
    async def parent_notifications(user: dict = Depends(get_current_user)):
        if user["role"] != "parent":
            raise HTTPException(status_code=403, detail="Parents only")
        items = []
        async for n in db.notifications.find({"parent_id": user["id"]}).sort("created_at", -1).limit(50):
            n.pop("_id", None)
            items.append(n)
        unread = sum(1 for n in items if not n.get("read"))
        return {"items": items, "unread": unread}

    @router.post("/parent/notifications/{notif_id}/read")
    async def mark_read(notif_id: str, user: dict = Depends(get_current_user)):
        await db.notifications.update_one(
            {"id": notif_id, "parent_id": user["id"]}, {"$set": {"read": True}})
        return {"ok": True}

    @router.post("/parent/notifications/read-all")
    async def mark_all_read(user: dict = Depends(get_current_user)):
        await db.notifications.update_many(
            {"parent_id": user["id"], "read": False}, {"$set": {"read": True}})
        return {"ok": True}

    # ==================================================== CASHFLOW FORECAST =====
    @router.get("/analytics/cashflow")
    async def cashflow(user: dict = Depends(require_roles(*STAFF_ROLES))):
        sid = await get_user_school_id(user)
        today = datetime.now(timezone.utc).date()
        due = academic_due_date()

        month_buckets = {}  # "YYYY-MM" -> amount
        aging = {"0-30 days": 0.0, "31-60 days": 0.0, "61-90 days": 0.0, "90+ days": 0.0}
        aging_count = {k: 0 for k in aging}
        planned_students = set()

        # 1) committed installment schedules (Auto-Debit + EMI)
        async for p in db.payments.find({"school_id": sid, "status": "success"}):
            sched = p.get("schedule")
            if not sched:
                continue
            planned_students.add(p.get("student_id"))
            for ins in sched:
                if ins.get("status") == "paid":
                    continue
                dt = _parse_sched_date(ins.get("due_date", ""))
                amt = float(ins.get("amount", 0) or 0)
                if not dt or amt <= 0:
                    continue
                if dt.date() >= today:
                    key = dt.strftime("%Y-%m")
                    month_buckets[key] = month_buckets.get(key, 0) + amt
                else:
                    d = (today - dt.date()).days
                    b = "0-30 days" if d <= 30 else "31-60 days" if d <= 60 else "61-90 days" if d <= 90 else "90+ days"
                    aging[b] += amt
                    aging_count[b] += 1

        # 2) unplanned outstanding (students with dues but no active plan) -> due month
        async for s in db.students.find({"school_id": sid}):
            sid_str = str(s["_id"])
            stu = {"id": sid_str, **{k: v for k, v in s.items() if k != "_id"}}
            if sid_str in planned_students:
                continue
            pending = await compute_pending(sid, s and stu)
            out = sum(i["amount"] for i in pending if not i["paid"])
            if out <= 0:
                continue
            if due.date() >= today:
                key = due.strftime("%Y-%m")
                month_buckets[key] = month_buckets.get(key, 0) + out
            else:
                d = (today - due.date()).days
                b = "0-30 days" if d <= 30 else "31-60 days" if d <= 60 else "61-90 days" if d <= 90 else "90+ days"
                aging[b] += out
                aging_count[b] += 1

        # build next-6-months series (starting current month)
        upcoming = []
        cur = datetime(today.year, today.month, 1, tzinfo=timezone.utc)
        for _ in range(6):
            key = cur.strftime("%Y-%m")
            upcoming.append({"month": cur.strftime("%b %Y"),
                             "amount": round(month_buckets.get(key, 0))})
            cur = (cur.replace(day=28) + timedelta(days=7)).replace(day=1)

        overdue_aging = [{"bucket": k, "amount": round(v), "count": aging_count[k]} for k, v in aging.items()]
        total_upcoming = round(sum(b["amount"] for b in upcoming))
        total_overdue = round(sum(aging.values()))
        this_month_key = datetime(today.year, today.month, 1).strftime("%Y-%m")

        return {
            "upcoming": upcoming,
            "overdue_aging": overdue_aging,
            "total_upcoming": total_upcoming,
            "total_overdue": total_overdue,
            "expected_this_month": round(month_buckets.get(this_month_key, 0)),
            "due_date": due.strftime("%d %b %Y"),
        }

    # ========================================================= PDF RECEIPTS =====
    def _pdf_header(c, w, h, title):
        c.setFillColor(BRAND)
        c.rect(0, h - 28 * mm, w, 28 * mm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 20)
        c.drawString(18 * mm, h - 15 * mm, "BiglypEnroll")
        c.setFont("Helvetica", 10)
        c.drawString(18 * mm, h - 22 * mm, "Student Fee Management")
        c.setFont("Helvetica-Bold", 13)
        c.drawRightString(w - 18 * mm, h - 16 * mm, title)

    async def _load_payment(payment_id, user):
        p = await db.payments.find_one({"_id": ObjectId(payment_id)})
        if not p:
            raise HTTPException(status_code=404, detail="Payment not found")
        if user["role"] == "parent":
            await resolve_student(p["student_id"], user)
        else:
            if p.get("school_id") != await get_user_school_id(user):
                raise HTTPException(status_code=403, detail="Not your school")
        return p

    @router.get("/parent/receipt/{payment_id}")
    async def receipt_pdf(payment_id: str, user: dict = Depends(get_current_user)):
        p = await _load_payment(payment_id, user)
        buf = io.BytesIO()
        w, h = A4
        c = pdfcanvas.Canvas(buf, pagesize=A4)
        _pdf_header(c, w, h, "FEE RECEIPT")

        y = h - 42 * mm
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(18 * mm, y, f"Receipt No: {p.get('receipt_no', '-')}")
        c.setFont("Helvetica", 10)
        c.setFillColor(colors.HexColor("#555555"))
        created = p.get("created_at", "")[:10]
        c.drawRightString(w - 18 * mm, y, f"Date: {created}")
        y -= 9 * mm
        c.drawString(18 * mm, y, f"Student: {p.get('student_name', '-')}")
        y -= 6 * mm
        c.drawString(18 * mm, y, f"Academic Year: {p.get('academic_year', ACADEMIC_YEAR)}")
        y -= 6 * mm
        c.drawString(18 * mm, y, f"Payment Mode: {p.get('mode', '-')}")

        # table
        y -= 14 * mm
        c.setFillColor(BRAND)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(18 * mm, y, "Fee Head")
        c.drawRightString(w - 18 * mm, y, "Amount")
        c.setStrokeColor(colors.HexColor("#DDDDDD"))
        c.line(18 * mm, y - 2 * mm, w - 18 * mm, y - 2 * mm)
        y -= 9 * mm
        c.setFillColor(NAVY)
        c.setFont("Helvetica", 10)
        for it in p.get("items", []):
            c.drawString(18 * mm, y, str(it.get("name", "-")))
            c.drawRightString(w - 18 * mm, y, inr(it.get("amount", 0)))
            y -= 7 * mm
        c.line(18 * mm, y, w - 18 * mm, y)
        y -= 8 * mm
        gst = p.get("gst", 0)
        c.setFont("Helvetica", 10)
        c.drawString(18 * mm, y, "GST (incl.)")
        c.drawRightString(w - 18 * mm, y, inr(gst))
        y -= 9 * mm
        c.setFont("Helvetica-Bold", 13)
        c.setFillColor(BRAND)
        c.drawString(18 * mm, y, "Total Paid")
        c.drawRightString(w - 18 * mm, y, inr(p.get("amount", 0)))

        if p.get("plan_type") == "EMI":
            y -= 12 * mm
            c.setFillColor(colors.HexColor("#555555"))
            c.setFont("Helvetica-Oblique", 9)
            c.drawString(18 * mm, y, f"0% EMI plan: {p.get('tenure')} months x {inr(p.get('emi', 0))} (school paid 100% upfront)")

        c.setFillColor(colors.HexColor("#999999"))
        c.setFont("Helvetica", 8)
        c.drawString(18 * mm, 15 * mm, "This is a system-generated receipt from BiglypEnroll. Thank you for your payment.")
        c.showPage()
        c.save()
        buf.seek(0)
        fname = f"receipt-{p.get('receipt_no', payment_id)}.pdf"
        return StreamingResponse(buf, media_type="application/pdf",
                                 headers={"Content-Disposition": f'attachment; filename="{fname}"'})

    @router.get("/parent/fee-certificate/{student_id}")
    async def fee_certificate(student_id: str, year: str = None, user: dict = Depends(get_current_user)):
        student = await resolve_student(student_id, user)
        ay = year or ACADEMIC_YEAR
        rows = []
        total = 0.0
        async for p in db.payments.find({"student_id": student["id"], "status": "success"}).sort("created_at", 1):
            if p.get("academic_year") and ay and p["academic_year"] != ay:
                continue
            rows.append({"receipt_no": p.get("receipt_no", "-"),
                         "date": p.get("created_at", "")[:10],
                         "mode": p.get("mode", "-"),
                         "amount": p.get("amount", 0)})
            total += float(p.get("amount", 0) or 0)

        buf = io.BytesIO()
        w, h = A4
        c = pdfcanvas.Canvas(buf, pagesize=A4)
        _pdf_header(c, w, h, "FEE CERTIFICATE")
        y = h - 42 * mm
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(18 * mm, y, f"Annual Fee Payment Certificate — AY {ay}")
        y -= 9 * mm
        c.setFont("Helvetica", 10)
        c.drawString(18 * mm, y, f"Student: {student.get('name', '-')}  |  Grade: {student.get('grade', '-')}")
        y -= 6 * mm
        c.setFillColor(colors.HexColor("#555555"))
        c.drawString(18 * mm, y, "This certifies the total education fees paid, for income-tax / reimbursement purposes.")

        y -= 14 * mm
        c.setFillColor(BRAND)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(18 * mm, y, "Date")
        c.drawString(50 * mm, y, "Receipt No")
        c.drawString(110 * mm, y, "Mode")
        c.drawRightString(w - 18 * mm, y, "Amount")
        c.setStrokeColor(colors.HexColor("#DDDDDD"))
        c.line(18 * mm, y - 2 * mm, w - 18 * mm, y - 2 * mm)
        y -= 8 * mm
        c.setFillColor(NAVY)
        c.setFont("Helvetica", 9)
        for r in rows:
            if y < 30 * mm:
                c.showPage()
                y = h - 30 * mm
            c.drawString(18 * mm, y, str(r["date"]))
            c.drawString(50 * mm, y, str(r["receipt_no"]))
            c.drawString(110 * mm, y, str(r["mode"])[:22])
            c.drawRightString(w - 18 * mm, y, inr(r["amount"]))
            y -= 7 * mm
        if not rows:
            c.setFont("Helvetica-Oblique", 10)
            c.setFillColor(colors.HexColor("#999999"))
            c.drawString(18 * mm, y, "No payments recorded for this academic year yet.")
            y -= 7 * mm
        c.line(18 * mm, y, w - 18 * mm, y)
        y -= 9 * mm
        c.setFont("Helvetica-Bold", 13)
        c.setFillColor(BRAND)
        c.drawString(18 * mm, y, "Total Fees Paid")
        c.drawRightString(w - 18 * mm, y, inr(total))
        c.setFillColor(colors.HexColor("#999999"))
        c.setFont("Helvetica", 8)
        c.drawString(18 * mm, 15 * mm, "System-generated certificate from BiglypEnroll. Valid without signature.")
        c.showPage()
        c.save()
        buf.seek(0)
        fname = f"fee-certificate-{student.get('name', 'student').replace(' ', '_')}-{ay}.pdf"
        return StreamingResponse(buf, media_type="application/pdf",
                                 headers={"Content-Disposition": f'attachment; filename="{fname}"'})

    return {"router": router, "award_rewards": award_rewards,
            "spend_wallet": spend_wallet, "generate_reminders": generate_reminders}
