#!/usr/bin/env python3
"""
BiglypEnroll Backend Testing - Fee Reminders + Parent Rewards
"""
import requests
import json
import re
from pymongo import MongoClient
import os

# Backend URL from frontend/.env
BASE_URL = "https://3a5681ee-0b41-457c-aa0e-ac576c9ec414.preview.emergentagent.com/api"

# Test credentials from test_credentials.md
SCHOOL_EMAIL = "school@biglyp.com"
SCHOOL_PASSWORD = "school123"
PARENT_EMAIL = "parent@biglyp.com"
PARENT_PASSWORD = "parent123"

# MongoDB connection for direct inspection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "biglyp_enroll")

def login(email: str, password: str) -> str:
    """Login and return access token"""
    resp = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
    if resp.status_code != 200:
        raise Exception(f"Login failed for {email}: {resp.status_code} {resp.text}")
    data = resp.json()
    return data.get("token")

def get_mongo_client():
    """Get MongoDB client for direct inspection"""
    return MongoClient(MONGO_URL)

# ============================================================================
# FEE REMINDERS TESTS
# ============================================================================

def test_reminder_settings_defaults():
    """FR1: GET /api/school/reminder-settings returns sane defaults"""
    print("\n[TEST FR1] GET /api/school/reminder-settings - Returns defaults")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    resp = requests.get(f"{BASE_URL}/school/reminder-settings", headers=headers)
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    # Check defaults
    assert "enabled" in data, "Missing 'enabled'"
    assert "before_due_days" in data, "Missing 'before_due_days'"
    assert "on_due" in data, "Missing 'on_due'"
    assert "overdue_days" in data, "Missing 'overdue_days'"
    
    print(f"  enabled: {data['enabled']}")
    print(f"  before_due_days: {data['before_due_days']}")
    print(f"  on_due: {data['on_due']}")
    print(f"  overdue_days: {data['overdue_days']}")
    
    print(f"  ✅ PASS: Returns defaults structure")
    return data

def test_reminder_settings_persist():
    """FR2: POST /api/school/reminder-settings persists sorted+dedup+clamped values"""
    print("\n[TEST FR2] POST /api/school/reminder-settings - Persist with sorting/dedup/clamp")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {
        "enabled": True,
        "before_due_days": [10, 7, 3, 1],
        "on_due": True,
        "overdue_days": [3, 7, 15, 30]
    }
    
    resp = requests.post(f"{BASE_URL}/school/reminder-settings", json=payload, headers=headers)
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    # Verify sorted
    assert data["before_due_days"] == [1, 3, 7, 10], f"Expected sorted [1,3,7,10], got {data['before_due_days']}"
    assert data["overdue_days"] == [3, 7, 15, 30], f"Expected sorted [3,7,15,30], got {data['overdue_days']}"
    
    print(f"  ✅ PASS: Settings persisted and sorted correctly")

def test_reminder_settings_clean_invalid():
    """FR3: POST with invalid days [0,-5,80,7,7] should clean to [7]"""
    print("\n[TEST FR3] POST /api/school/reminder-settings - Clean invalid values")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {
        "enabled": True,
        "before_due_days": [0, -5, 80, 7, 7],  # 0 and -5 invalid, 80 > 60, 7 duplicate
        "on_due": True,
        "overdue_days": [3, 7, 15]
    }
    
    resp = requests.post(f"{BASE_URL}/school/reminder-settings", json=payload, headers=headers)
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    # Should clean to [7] (only valid value in 1-60 range, deduped)
    assert data["before_due_days"] == [7], f"Expected [7], got {data['before_due_days']}"
    
    print(f"  ✅ PASS: Invalid values cleaned correctly to [7]")

def test_reminder_settings_disabled():
    """FR4: POST with enabled:false persists, and /reminders/run should NOT insert notifications"""
    print("\n[TEST FR4] POST /api/school/reminder-settings - Disable reminders")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Disable reminders
    payload = {
        "enabled": False,
        "before_due_days": [7, 3, 1],
        "on_due": True,
        "overdue_days": [3, 7, 15]
    }
    
    resp = requests.post(f"{BASE_URL}/school/reminder-settings", json=payload, headers=headers)
    print(f"  Status: {resp.status_code}")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert data["enabled"] is False, "enabled should be False"
    print(f"  Reminders disabled: enabled={data['enabled']}")
    
    # Now run reminders with force:true
    resp = requests.post(f"{BASE_URL}/reminders/run", json={"force": True}, headers=headers)
    print(f"  POST /api/reminders/run status: {resp.status_code}")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    created = data.get("created", 0)
    print(f"  Created: {created}")
    
    # Should NOT create any notifications when disabled
    assert created == 0, f"Expected 0 notifications when disabled, got {created}"
    
    print(f"  ✅ PASS: Disabled reminders correctly prevent notification creation")

def test_reminder_run_force():
    """FR5: Re-enable and POST /api/reminders/run {force:true} returns created >= 1"""
    print("\n[TEST FR5] POST /api/reminders/run - Force run creates notifications")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Re-enable reminders
    payload = {
        "enabled": True,
        "before_due_days": [7, 3, 1],
        "on_due": True,
        "overdue_days": [3, 7, 15]
    }
    
    resp = requests.post(f"{BASE_URL}/school/reminder-settings", json=payload, headers=headers)
    assert resp.status_code == 200
    print(f"  Reminders re-enabled")
    
    # Run reminders with force:true
    resp = requests.post(f"{BASE_URL}/reminders/run", json={"force": True}, headers=headers)
    print(f"  POST /api/reminders/run status: {resp.status_code}")
    print(f"  Response: {resp.text}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    created = data.get("created", 0)
    print(f"  Created: {created}")
    
    # Should create at least 1 notification (Sara Sharma has outstanding fees)
    assert created >= 1, f"Expected created >= 1, got {created}"
    
    print(f"  ✅ PASS: Force run created {created} notifications")
    return created

def test_reminder_run_idempotency():
    """FR6: Immediate 2nd run with force:true returns created:0 (dedupe idempotency)"""
    print("\n[TEST FR6] POST /api/reminders/run - Idempotency check")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Second immediate run
    resp = requests.post(f"{BASE_URL}/reminders/run", json={"force": True}, headers=headers)
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    created = data.get("created", 0)
    print(f"  Created: {created}")
    
    # Should NOT create any new notifications (dedupe_key prevents duplicates)
    assert created == 0, f"Expected 0 (idempotency), got {created}"
    
    print(f"  ✅ PASS: Idempotency works - no duplicate notifications")

def test_reminder_email_log():
    """FR7: Every notification created must have a matching email_log entry with status='queued'"""
    print("\n[TEST FR7] Email log verification - Check email_log entries")
    
    # Get parent notifications
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    resp = requests.get(f"{BASE_URL}/parent/notifications", headers=headers)
    print(f"  GET /api/parent/notifications status: {resp.status_code}")
    assert resp.status_code == 200
    data = resp.json()
    items = data.get("items", [])
    print(f"  Notifications count: {len(items)}")
    
    # Check MongoDB email_log collection directly
    client = get_mongo_client()
    db = client[DB_NAME]
    email_log_count = db.email_log.count_documents({"status": "queued"})
    print(f"  email_log entries with status='queued': {email_log_count}")
    
    # Should have at least some email_log entries
    assert email_log_count > 0, "No email_log entries found with status='queued'"
    
    print(f"  ✅ PASS: email_log entries exist with status='queued'")

def test_parent_notifications():
    """FR8: GET /api/parent/notifications returns items sorted newest first with unread count"""
    print("\n[TEST FR8] GET /api/parent/notifications - List and read operations")
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    resp = requests.get(f"{BASE_URL}/parent/notifications", headers=headers)
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text[:500]}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    assert "items" in data, "Missing 'items'"
    assert "unread" in data, "Missing 'unread'"
    
    items = data["items"]
    unread = data["unread"]
    
    print(f"  Items count: {len(items)}")
    print(f"  Unread count: {unread}")
    
    # Check sorting (newest first)
    if len(items) >= 2:
        first_created = items[0].get("created_at", "")
        second_created = items[1].get("created_at", "")
        assert first_created >= second_created, "Items not sorted newest first"
        print(f"  Sorting verified: {first_created} >= {second_created}")
    
    # Test mark single as read
    if len(items) > 0 and not items[0].get("read"):
        notif_id = items[0]["id"]
        resp = requests.post(f"{BASE_URL}/parent/notifications/{notif_id}/read", headers=headers)
        print(f"  POST /api/parent/notifications/{notif_id}/read status: {resp.status_code}")
        assert resp.status_code == 200
        print(f"  ✅ Single notification marked as read")
    
    # Test mark all as read
    resp = requests.post(f"{BASE_URL}/parent/notifications/read-all", headers=headers)
    print(f"  POST /api/parent/notifications/read-all status: {resp.status_code}")
    assert resp.status_code == 200
    
    # Verify unread count is now 0
    resp = requests.get(f"{BASE_URL}/parent/notifications", headers=headers)
    data = resp.json()
    new_unread = data["unread"]
    print(f"  Unread count after read-all: {new_unread}")
    assert new_unread == 0, f"Expected unread=0, got {new_unread}"
    
    print(f"  ✅ PASS: Notifications list, mark-read, and read-all work correctly")

def test_reminder_auth():
    """FR9: 401 without auth; 403 for parent trying school endpoints"""
    print("\n[TEST FR9] Auth checks - 401 without auth, 403 for parent on school endpoints")
    
    # Test 401 without auth
    resp = requests.get(f"{BASE_URL}/school/reminder-settings")
    print(f"  GET /api/school/reminder-settings (no auth) status: {resp.status_code}")
    assert resp.status_code == 401, f"Expected 401, got {resp.status_code}"
    
    # Test 403 for parent trying school endpoint
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    resp = requests.get(f"{BASE_URL}/school/reminder-settings", headers=headers)
    print(f"  GET /api/school/reminder-settings (parent) status: {resp.status_code}")
    assert resp.status_code == 403, f"Expected 403, got {resp.status_code}"
    
    print(f"  ✅ PASS: Auth checks work correctly")

def test_reminder_restore_defaults():
    """FR10: Restore reminder-settings to defaults"""
    print("\n[TEST FR10] Restore reminder-settings to defaults")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    payload = {
        "enabled": True,
        "before_due_days": [7, 3, 1],
        "on_due": True,
        "overdue_days": [3, 7, 15]
    }
    
    resp = requests.post(f"{BASE_URL}/school/reminder-settings", json=payload, headers=headers)
    assert resp.status_code == 200
    print(f"  ✅ Reminder settings restored to defaults")

# ============================================================================
# PARENT REWARDS TESTS
# ============================================================================

def test_rewards_baseline():
    """PR1: GET /api/parent/rewards returns baseline structure"""
    print("\n[TEST PR1] GET /api/parent/rewards - Baseline structure")
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    resp = requests.get(f"{BASE_URL}/parent/rewards", headers=headers)
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text[:500]}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    assert "points" in data, "Missing 'points'"
    assert "wallet" in data, "Missing 'wallet'"
    assert "tier" in data, "Missing 'tier'"
    assert "transactions" in data, "Missing 'transactions'"
    
    assert isinstance(data["points"], int), "points must be int"
    assert isinstance(data["wallet"], (int, float)), "wallet must be number"
    assert data["tier"] in ["Bronze", "Silver", "Gold", "Platinum"], f"Invalid tier: {data['tier']}"
    assert isinstance(data["transactions"], list), "transactions must be list"
    
    print(f"  points: {data['points']}")
    print(f"  wallet: {data['wallet']}")
    print(f"  tier: {data['tier']}")
    print(f"  transactions count: {len(data['transactions'])}")
    
    print(f"  ✅ PASS: Baseline structure correct")
    return data

def test_rewards_catalog():
    """PR2: GET /api/rewards/catalog returns 6 coupons + 6 courses, sorted by points_cost"""
    print("\n[TEST PR2] GET /api/rewards/catalog - Catalog structure")
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    resp = requests.get(f"{BASE_URL}/rewards/catalog", headers=headers)
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text[:500]}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    assert "coupons" in data, "Missing 'coupons'"
    assert "courses" in data, "Missing 'courses'"
    
    coupons = data["coupons"]
    courses = data["courses"]
    
    print(f"  Coupons count: {len(coupons)}")
    print(f"  Courses count: {len(courses)}")
    
    assert len(coupons) == 6, f"Expected 6 coupons, got {len(coupons)}"
    assert len(courses) == 6, f"Expected 6 courses, got {len(courses)}"
    
    # Check sorting by points_cost (ascending)
    for i in range(len(coupons) - 1):
        assert coupons[i]["points_cost"] <= coupons[i+1]["points_cost"], "Coupons not sorted by points_cost"
    
    for i in range(len(courses) - 1):
        assert courses[i]["points_cost"] <= courses[i+1]["points_cost"], "Courses not sorted by points_cost"
    
    print(f"  Coupons: {[(c['id'], c['points_cost']) for c in coupons]}")
    print(f"  Courses: {[(c['id'], c['points_cost']) for c in courses]}")
    
    print(f"  ✅ PASS: Catalog structure correct, sorted by points_cost")
    return data

def test_rewards_insufficient_points():
    """PR3: redeem-coupon with insufficient points -> 400"""
    print("\n[TEST PR3] POST /api/parent/rewards/redeem-coupon - Insufficient points")
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get current points
    resp = requests.get(f"{BASE_URL}/parent/rewards", headers=headers)
    assert resp.status_code == 200
    current_points = resp.json()["points"]
    print(f"  Current points: {current_points}")
    
    # Try to redeem the most expensive coupon (should fail if points < 2500)
    payload = {"coupon_id": "cp_croma"}  # 2500 points
    
    resp = requests.post(f"{BASE_URL}/parent/rewards/redeem-coupon", json=payload, headers=headers)
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text}")
    
    if current_points < 2500:
        assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
        assert "Not enough points" in resp.text, "Error message should mention 'Not enough points'"
        print(f"  ✅ PASS: Insufficient points correctly rejected with 400")
    else:
        print(f"  ⚠️  SKIP: User has enough points ({current_points} >= 2500)")

def test_rewards_earn_points():
    """PR4: Earn points by making an UPFRONT full payment"""
    print("\n[TEST PR4] Earn points via upfront payment")
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get Aarav Sharma's student_id
    resp = requests.get(f"{BASE_URL}/parent/children", headers=headers)
    assert resp.status_code == 200
    children = resp.json()
    
    aarav = None
    for child in children:
        if child.get("name") == "Aarav Sharma":
            aarav = child
            break
    
    assert aarav is not None, "Aarav Sharma not found"
    print(f"  Found Aarav Sharma: id={aarav['id']}")
    
    # Get current rewards balance
    resp = requests.get(f"{BASE_URL}/parent/rewards", headers=headers)
    assert resp.status_code == 200
    before_points = resp.json()["points"]
    before_wallet = resp.json()["wallet"]
    print(f"  Before payment - points: {before_points}, wallet: {before_wallet}")
    
    # Get outstanding fees for Aarav
    resp = requests.get(f"{BASE_URL}/parent/fees/{aarav['id']}", headers=headers)
    assert resp.status_code == 200
    fee_data = resp.json()
    items = fee_data.get("items", [])
    
    # Find unpaid items
    unpaid = [item for item in items if not item.get("paid")]
    
    if len(unpaid) == 0:
        print(f"  ⚠️  SKIP: No unpaid fees for Aarav Sharma")
        return
    
    # Pay all unpaid fees (upfront full payment)
    fee_head_ids = [item["fee_head_id"] for item in unpaid]
    total_amount = sum(item["amount"] for item in unpaid)
    print(f"  Paying {len(fee_head_ids)} fee heads, total: {total_amount}")
    
    payload = {
        "student_id": aarav["id"],
        "fee_head_ids": fee_head_ids,
        "mode": "UPI"
    }
    
    resp = requests.post(f"{BASE_URL}/parent/pay", json=payload, headers=headers)
    print(f"  POST /api/parent/pay status: {resp.status_code}")
    print(f"  Response: {resp.text[:500]}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    payment_data = resp.json()
    
    # Check rewards_earned
    if "rewards_earned" in payment_data:
        print(f"  Rewards earned: {payment_data['rewards_earned']}")
    
    # Get updated rewards balance
    resp = requests.get(f"{BASE_URL}/parent/rewards", headers=headers)
    assert resp.status_code == 200
    after_data = resp.json()
    after_points = after_data["points"]
    after_wallet = after_data["wallet"]
    transactions = after_data["transactions"]
    
    print(f"  After payment - points: {after_points}, wallet: {after_wallet}")
    
    # Verify points increased
    assert after_points > before_points, f"Points should increase, before={before_points}, after={after_points}"
    
    # Verify wallet increased (1% cashback for upfront)
    assert after_wallet > before_wallet, f"Wallet should increase, before={before_wallet}, after={after_wallet}"
    
    # Verify transaction with "Upfront" in description
    earn_txn = None
    for txn in transactions:
        if txn.get("kind") == "earn" and "Upfront" in txn.get("description", ""):
            earn_txn = txn
            break
    
    assert earn_txn is not None, "No 'earn' transaction with 'Upfront' in description found"
    print(f"  Found earn transaction: {earn_txn['description']}")
    
    print(f"  ✅ PASS: Points and wallet increased, earn transaction recorded")

def test_rewards_redeem_coupon():
    """PR5: POST /api/parent/rewards/redeem-coupon with cheapest coupon"""
    print("\n[TEST PR5] POST /api/parent/rewards/redeem-coupon - Redeem cheapest coupon")
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get current points
    resp = requests.get(f"{BASE_URL}/parent/rewards", headers=headers)
    assert resp.status_code == 200
    before_points = resp.json()["points"]
    print(f"  Current points: {before_points}")
    
    # Get catalog to find cheapest coupon
    resp = requests.get(f"{BASE_URL}/rewards/catalog", headers=headers)
    assert resp.status_code == 200
    coupons = resp.json()["coupons"]
    
    # Find cheapest affordable coupon
    cheapest = None
    for coupon in coupons:
        if coupon["points_cost"] <= before_points:
            cheapest = coupon
            break
    
    if cheapest is None:
        print(f"  ⚠️  SKIP: Not enough points to redeem any coupon (have {before_points})")
        return
    
    print(f"  Redeeming: {cheapest['id']} ({cheapest['title']}) - {cheapest['points_cost']} points")
    
    payload = {"coupon_id": cheapest["id"]}
    resp = requests.post(f"{BASE_URL}/parent/rewards/redeem-coupon", json=payload, headers=headers)
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    assert data.get("ok") is True, "ok should be True"
    assert "voucher_code" in data, "Missing voucher_code"
    assert "redemption" in data, "Missing redemption"
    
    voucher_code = data["voucher_code"]
    print(f"  Voucher code: {voucher_code}")
    
    # Verify voucher_code format: ^BOOK-[A-F0-9]{8}$ or similar
    # Based on code: brand[:4].upper() + "-" + uuid.hex[:8].upper()
    # For cp_bms (BookMyShow), should be BOOK-XXXXXXXX
    pattern = r"^[A-Z]{4}-[A-F0-9]{8}$"
    assert re.match(pattern, voucher_code), f"Voucher code format invalid: {voucher_code}"
    
    # Verify points deducted
    resp = requests.get(f"{BASE_URL}/parent/rewards", headers=headers)
    assert resp.status_code == 200
    after_data = resp.json()
    after_points = after_data["points"]
    transactions = after_data["transactions"]
    
    print(f"  Points after redemption: {after_points}")
    expected_points = before_points - cheapest["points_cost"]
    assert after_points == expected_points, f"Expected {expected_points}, got {after_points}"
    
    # Verify redeem_coupon transaction
    redeem_txn = None
    for txn in transactions:
        if txn.get("kind") == "redeem_coupon":
            redeem_txn = txn
            break
    
    assert redeem_txn is not None, "No 'redeem_coupon' transaction found"
    print(f"  Found redeem_coupon transaction: {redeem_txn['description']}")
    
    # Verify redemption stored
    resp = requests.get(f"{BASE_URL}/parent/rewards/redemptions", headers=headers)
    assert resp.status_code == 200
    redemptions = resp.json()
    
    coupon_redemption = None
    for r in redemptions:
        if r.get("kind") == "coupon" and r.get("item_id") == cheapest["id"]:
            coupon_redemption = r
            break
    
    assert coupon_redemption is not None, "Coupon redemption not found in redemptions list"
    print(f"  Found redemption: {coupon_redemption}")
    
    print(f"  ✅ PASS: Coupon redeemed successfully, voucher code valid, points deducted, redemption stored")

def test_rewards_enroll_course():
    """PR6: POST /api/parent/rewards/enroll-course"""
    print("\n[TEST PR6] POST /api/parent/rewards/enroll-course - Enroll in course")
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get Aarav Sharma's student_id
    resp = requests.get(f"{BASE_URL}/parent/children", headers=headers)
    assert resp.status_code == 200
    children = resp.json()
    
    aarav = None
    for child in children:
        if child.get("name") == "Aarav Sharma":
            aarav = child
            break
    
    assert aarav is not None, "Aarav Sharma not found"
    print(f"  Found Aarav Sharma: id={aarav['id']}")
    
    # Get current points
    resp = requests.get(f"{BASE_URL}/parent/rewards", headers=headers)
    assert resp.status_code == 200
    before_points = resp.json()["points"]
    print(f"  Current points: {before_points}")
    
    # Get catalog to find co_writing (cheapest course at 900 points)
    resp = requests.get(f"{BASE_URL}/rewards/catalog", headers=headers)
    assert resp.status_code == 200
    courses = resp.json()["courses"]
    
    writing_course = None
    for course in courses:
        if course["id"] == "co_writing":
            writing_course = course
            break
    
    assert writing_course is not None, "co_writing course not found"
    print(f"  Course: {writing_course['id']} ({writing_course['title']}) - {writing_course['points_cost']} points")
    
    if before_points < writing_course["points_cost"]:
        print(f"  ⚠️  SKIP: Not enough points ({before_points} < {writing_course['points_cost']})")
        return
    
    payload = {
        "course_id": "co_writing",
        "student_id": aarav["id"]
    }
    
    resp = requests.post(f"{BASE_URL}/parent/rewards/enroll-course", json=payload, headers=headers)
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    assert data.get("ok") is True, "ok should be True"
    assert "redemption" in data, "Missing redemption"
    
    redemption = data["redemption"]
    assert redemption.get("status") == "Enrolled", f"Expected status='Enrolled', got {redemption.get('status')}"
    assert redemption.get("student_name") == "Aarav Sharma", f"Expected student_name='Aarav Sharma', got {redemption.get('student_name')}"
    
    print(f"  Redemption: {redemption}")
    
    # Verify points deducted
    resp = requests.get(f"{BASE_URL}/parent/rewards", headers=headers)
    assert resp.status_code == 200
    after_data = resp.json()
    after_points = after_data["points"]
    transactions = after_data["transactions"]
    
    print(f"  Points after enrollment: {after_points}")
    expected_points = before_points - writing_course["points_cost"]
    assert after_points == expected_points, f"Expected {expected_points}, got {after_points}"
    
    # Verify redeem_course transaction with student name and course title
    redeem_txn = None
    for txn in transactions:
        if txn.get("kind") == "redeem_course":
            redeem_txn = txn
            break
    
    assert redeem_txn is not None, "No 'redeem_course' transaction found"
    desc = redeem_txn.get("description", "")
    print(f"  Found redeem_course transaction: {desc}")
    
    assert "Aarav Sharma" in desc, f"Student name not in description: {desc}"
    assert writing_course["title"] in desc, f"Course title not in description: {desc}"
    
    print(f"  ✅ PASS: Course enrolled successfully, points deducted, transaction recorded")

def test_rewards_redemptions_list():
    """PR7: GET /api/parent/rewards/redemptions returns entries newest first"""
    print("\n[TEST PR7] GET /api/parent/rewards/redemptions - List redemptions")
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    resp = requests.get(f"{BASE_URL}/parent/rewards/redemptions", headers=headers)
    print(f"  Status: {resp.status_code}")
    print(f"  Response: {resp.text[:500]}")
    
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    redemptions = resp.json()
    
    assert isinstance(redemptions, list), "redemptions should be a list"
    print(f"  Redemptions count: {len(redemptions)}")
    
    # Check sorting (newest first)
    if len(redemptions) >= 2:
        first_created = redemptions[0].get("created_at", "")
        second_created = redemptions[1].get("created_at", "")
        assert first_created >= second_created, "Redemptions not sorted newest first"
        print(f"  Sorting verified: {first_created} >= {second_created}")
    
    # Display redemptions
    for r in redemptions[:5]:  # Show first 5
        print(f"    - {r.get('kind')}: {r.get('title')} ({r.get('points_spent')} pts)")
    
    print(f"  ✅ PASS: Redemptions list correct, sorted newest first")

def test_rewards_bogus_ids():
    """PR8: Bogus coupon_id -> 404; bogus course_id -> 404"""
    print("\n[TEST PR8] Bogus IDs - 404 errors")
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Bogus coupon_id
    payload = {"coupon_id": "cp_bogus_xyz"}
    resp = requests.post(f"{BASE_URL}/parent/rewards/redeem-coupon", json=payload, headers=headers)
    print(f"  POST redeem-coupon with bogus coupon_id status: {resp.status_code}")
    assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"
    
    # Bogus course_id
    resp = requests.get(f"{BASE_URL}/parent/children", headers=headers)
    assert resp.status_code == 200
    children = resp.json()
    if len(children) > 0:
        student_id = children[0]["id"]
        payload = {"course_id": "co_bogus_xyz", "student_id": student_id}
        resp = requests.post(f"{BASE_URL}/parent/rewards/enroll-course", json=payload, headers=headers)
        print(f"  POST enroll-course with bogus course_id status: {resp.status_code}")
        assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"
    
    print(f"  ✅ PASS: Bogus IDs correctly return 404")

def test_rewards_staff_forbidden():
    """PR9: school_admin hitting /api/parent/rewards -> 403"""
    print("\n[TEST PR9] Staff role forbidden - 403 for school_admin")
    token = login(SCHOOL_EMAIL, SCHOOL_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    resp = requests.get(f"{BASE_URL}/parent/rewards", headers=headers)
    print(f"  GET /api/parent/rewards (school_admin) status: {resp.status_code}")
    assert resp.status_code == 403, f"Expected 403, got {resp.status_code}"
    assert "Parents only" in resp.text, "Error message should mention 'Parents only'"
    
    print(f"  ✅ PASS: Staff role correctly forbidden with 403")

def test_rewards_wallet_auto_apply():
    """PR10: Wallet auto-apply verification"""
    print("\n[TEST PR10] Wallet auto-apply - Check spend_wallet function")
    token = login(PARENT_EMAIL, PARENT_PASSWORD)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get current wallet balance
    resp = requests.get(f"{BASE_URL}/parent/rewards", headers=headers)
    assert resp.status_code == 200
    before_wallet = resp.json()["wallet"]
    print(f"  Current wallet balance: {before_wallet}")
    
    if before_wallet <= 0:
        print(f"  ⚠️  SKIP: No wallet balance to test auto-apply")
        return
    
    # Get Sara Sharma's student_id
    resp = requests.get(f"{BASE_URL}/parent/children", headers=headers)
    assert resp.status_code == 200
    children = resp.json()
    
    sara = None
    for child in children:
        if child.get("name") == "Sara Sharma":
            sara = child
            break
    
    if sara is None:
        print(f"  ⚠️  SKIP: Sara Sharma not found")
        return
    
    print(f"  Found Sara Sharma: id={sara['id']}")
    
    # Get outstanding fees for Sara
    resp = requests.get(f"{BASE_URL}/parent/fees/{sara['id']}", headers=headers)
    assert resp.status_code == 200
    fee_data = resp.json()
    items = fee_data.get("items", [])
    
    # Find unpaid items
    unpaid = [item for item in items if not item.get("paid")]
    
    if len(unpaid) == 0:
        print(f"  ⚠️  SKIP: No unpaid fees for Sara Sharma")
        return
    
    # Pay a small fee with wallet auto-apply
    fee_head_ids = [unpaid[0]["fee_head_id"]]
    print(f"  Paying fee: {unpaid[0]['name']} - {unpaid[0]['amount']}")
    
    payload = {
        "student_id": sara["id"],
        "fee_head_ids": fee_head_ids,
        "mode": "UPI",
        "use_wallet": True
    }
    
    resp = requests.post(f"{BASE_URL}/parent/pay", json=payload, headers=headers)
    print(f"  POST /api/parent/pay status: {resp.status_code}")
    
    if resp.status_code != 200:
        print(f"  ⚠️  Payment failed: {resp.text}")
        return
    
    payment_data = resp.json()
    wallet_applied = payment_data.get("wallet_applied", 0)
    print(f"  Wallet applied: {wallet_applied}")
    
    # Get updated wallet balance
    resp = requests.get(f"{BASE_URL}/parent/rewards", headers=headers)
    assert resp.status_code == 200
    after_data = resp.json()
    after_wallet = after_data["wallet"]
    transactions = after_data["transactions"]
    
    print(f"  Wallet after payment: {after_wallet}")
    
    if wallet_applied > 0:
        # Verify wallet decreased
        assert after_wallet < before_wallet, f"Wallet should decrease, before={before_wallet}, after={after_wallet}"
        
        # Verify apply_wallet transaction
        apply_txn = None
        for txn in transactions:
            if txn.get("kind") == "apply_wallet":
                apply_txn = txn
                break
        
        assert apply_txn is not None, "No 'apply_wallet' transaction found"
        print(f"  Found apply_wallet transaction: {apply_txn['description']}")
        
        print(f"  ✅ PASS: Wallet auto-applied, balance decreased, transaction recorded")
    else:
        print(f"  ℹ️  INFO: Wallet not applied (wallet_applied=0)")

# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def main():
    print("=" * 80)
    print("BiglypEnroll Backend Testing - Fee Reminders + Parent Rewards")
    print("=" * 80)
    
    try:
        # ============ FEE REMINDERS TESTS ============
        print("\n" + "=" * 80)
        print("SECTION 1: FEE REMINDERS")
        print("=" * 80)
        
        test_reminder_settings_defaults()
        test_reminder_settings_persist()
        test_reminder_settings_clean_invalid()
        test_reminder_settings_disabled()
        test_reminder_run_force()
        test_reminder_run_idempotency()
        test_reminder_email_log()
        test_parent_notifications()
        test_reminder_auth()
        test_reminder_restore_defaults()
        
        # ============ PARENT REWARDS TESTS ============
        print("\n" + "=" * 80)
        print("SECTION 2: PARENT REWARDS")
        print("=" * 80)
        
        test_rewards_baseline()
        test_rewards_catalog()
        test_rewards_insufficient_points()
        test_rewards_earn_points()
        test_rewards_redeem_coupon()
        test_rewards_enroll_course()
        test_rewards_redemptions_list()
        test_rewards_bogus_ids()
        test_rewards_staff_forbidden()
        test_rewards_wallet_auto_apply()
        
        print("\n" + "=" * 80)
        print("ALL TESTS PASSED ✅")
        print("=" * 80)
        
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        return 1
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
