import { useEffect, useState } from "react";
import { ParentLayout } from "@/components/ParentLayout";
import api, { inr, formatApiErrorDetail } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Gift, Wallet, Sparkles, Ticket, GraduationCap, Star, Copy, CheckCircle2,
} from "lucide-react";

const TIER_STYLE = {
  Bronze: "from-amber-700 to-amber-500",
  Silver: "from-slate-400 to-slate-300",
  Gold: "from-yellow-500 to-amber-400",
  Platinum: "from-indigo-600 to-[#5548D1]",
};

export default function Rewards() {
  const [data, setData] = useState(null);
  const [catalog, setCatalog] = useState({ coupons: [], courses: [] });
  const [redemptions, setRedemptions] = useState([]);
  const [children, setChildren] = useState([]);
  const [tab, setTab] = useState("coupons");
  const [enrollFor, setEnrollFor] = useState(null); // course pending enroll
  const [enrollChild, setEnrollChild] = useState("");
  const [voucher, setVoucher] = useState(null); // last redeemed coupon
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [r, c, red, ch] = await Promise.all([
      api.get("/parent/rewards"),
      api.get("/rewards/catalog"),
      api.get("/parent/rewards/redemptions"),
      api.get("/parent/children"),
    ]);
    setData(r.data);
    setCatalog(c.data);
    setRedemptions(red.data);
    setChildren(ch.data);
    if (ch.data[0]) setEnrollChild(ch.data[0].id);
  };

  useEffect(() => { load(); }, []);

  const points = data?.points || 0;

  const redeemCoupon = async (coupon) => {
    setBusy(true);
    try {
      const { data: res } = await api.post("/parent/rewards/redeem-coupon", { coupon_id: coupon.id });
      setVoucher({ ...res.redemption });
      toast.success(`Redeemed ${coupon.title}!`);
      await load();
    } catch (e) {
      toast.error(formatApiErrorDetail(e?.response?.data?.detail));
    } finally { setBusy(false); }
  };

  const doEnroll = async () => {
    if (!enrollFor || !enrollChild) return;
    setBusy(true);
    try {
      await api.post("/parent/rewards/enroll-course", { course_id: enrollFor.id, student_id: enrollChild });
      toast.success(`Enrolled in ${enrollFor.title}!`);
      setEnrollFor(null);
      await load();
    } catch (e) {
      toast.error(formatApiErrorDetail(e?.response?.data?.detail));
    } finally { setBusy(false); }
  };

  return (
    <ParentLayout>
      <div className="mb-6">
        <p className="text-xs tracking-[0.2em] uppercase text-[#5548D1] font-semibold">Rewards</p>
        <h1 className="font-head text-3xl font-black tracking-tight text-brand-navy mt-1">Biglyp Rewards</h1>
        <p className="text-sm text-slate-500 mt-1">Earn points & cashback on fee payments — redeem for brand coupons or enrichment courses.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className={`rounded-2xl p-5 text-white bg-gradient-to-br ${TIER_STYLE[data?.tier] || TIER_STYLE.Bronze}`} data-testid="rewards-points">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-widest font-bold opacity-90">Reward Points</p>
            <Sparkles className="h-5 w-5 opacity-90" />
          </div>
          <p className="font-head text-4xl font-black mt-2">{points.toLocaleString("en-IN")}</p>
          <p className="text-xs mt-1 opacity-90 flex items-center gap-1"><Star className="h-3 w-3 fill-white" /> {data?.tier || "Bronze"} tier</p>
        </div>
        <div className="rounded-2xl p-5 border-2 border-emerald-200 bg-emerald-50" data-testid="rewards-wallet">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-widest font-bold text-emerald-700">Cashback Wallet</p>
            <Wallet className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="font-head text-4xl font-black text-emerald-700 mt-2">{inr(data?.wallet || 0)}</p>
          <p className="text-xs mt-1 text-emerald-700/80">Auto-applies to your next fee payment</p>
        </div>
        <div className="rounded-2xl p-5 border-2 border-border bg-white" data-testid="rewards-redeemed">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-widest font-bold text-[#5548D1]">Redeemed</p>
            <Gift className="h-5 w-5 text-[#5548D1]" />
          </div>
          <p className="font-head text-4xl font-black text-brand-navy mt-2">{redemptions.length}</p>
          <p className="text-xs mt-1 text-slate-500">coupons & courses claimed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-5">
        {[
          { k: "coupons", label: "Brand Coupons", icon: Ticket },
          { k: "courses", label: "Enrichment Courses", icon: GraduationCap },
          { k: "activity", label: "My Rewards", icon: Gift },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.k;
          return (
            <button key={t.k} data-testid={`rewards-tab-${t.k}`} onClick={() => setTab(t.k)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                active ? "bg-[#5548D1] text-white" : "bg-white border border-border text-slate-500 hover:text-brand-navy"
              }`}>
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Coupons */}
      {tab === "coupons" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="coupon-grid">
          {catalog.coupons.map((c) => {
            const afford = points >= c.points_cost;
            return (
              <div key={c.id} className="rounded-2xl border-2 border-border bg-white p-5 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#5548D1] bg-[#EEF0FF] px-2.5 py-1 rounded-full">{c.brand}</span>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">{c.category}</span>
                </div>
                <p className="font-head text-[16px] font-black text-brand-navy mt-3 leading-snug flex-1">{c.title}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-head text-lg font-black text-[#5548D1]">{c.points_cost.toLocaleString("en-IN")} <span className="text-[11px] text-slate-400 font-semibold">pts</span></span>
                  <Button size="sm" disabled={!afford || busy} onClick={() => redeemCoupon(c)} data-testid={`redeem-${c.id}`}
                    className="rounded-lg bg-[#5548D1] hover:bg-[#3F35A8] disabled:opacity-40">
                    {afford ? "Redeem" : "Need more"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Courses */}
      {tab === "courses" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="course-grid">
          {catalog.courses.map((c) => {
            const afford = points >= c.points_cost;
            return (
              <div key={c.id} className="rounded-2xl border-2 border-border bg-white p-5 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{c.category}</span>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">{c.duration}</span>
                </div>
                <p className="font-head text-[16px] font-black text-brand-navy mt-3 leading-snug">{c.title}</p>
                <p className="text-[12.5px] text-slate-500 mt-1 flex-1">{c.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-head text-lg font-black text-[#5548D1]">{c.points_cost.toLocaleString("en-IN")} <span className="text-[11px] text-slate-400 font-semibold">pts</span></span>
                  <Button size="sm" disabled={!afford || busy} onClick={() => setEnrollFor(c)} data-testid={`enroll-${c.id}`}
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40">
                    {afford ? "Enroll" : "Need more"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Activity */}
      {tab === "activity" && (
        <div className="space-y-6" data-testid="rewards-activity">
          <div>
            <p className="font-head text-lg font-black text-brand-navy mb-3">Redemptions</p>
            {redemptions.length === 0 && <p className="text-sm text-slate-400">No redemptions yet. Redeem a coupon or enroll in a course!</p>}
            <div className="space-y-2">
              {redemptions.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
                  <div className="flex items-center gap-3">
                    {r.kind === "coupon" ? <Ticket className="h-4 w-4 text-[#5548D1]" /> : <GraduationCap className="h-4 w-4 text-emerald-600" />}
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">{r.title}</p>
                      <p className="text-xs text-slate-500">
                        {r.kind === "coupon" ? `Code: ${r.code}` : `For ${r.student_name} · ${r.status}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-red-500">-{r.points_spent} pts</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-head text-lg font-black text-brand-navy mb-3">Points Activity</p>
            <div className="space-y-2">
              {(data?.transactions || []).map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
                  <p className="text-sm text-brand-navy">{t.description}</p>
                  <div className="text-right">
                    {t.points_delta !== 0 && <span className={`text-xs font-bold ${t.points_delta > 0 ? "text-emerald-600" : "text-red-500"}`}>{t.points_delta > 0 ? "+" : ""}{t.points_delta} pts</span>}
                    {t.wallet_delta !== 0 && <span className="block text-[11px] text-slate-500">{t.wallet_delta > 0 ? "+" : ""}{inr(t.wallet_delta)} wallet</span>}
                  </div>
                </div>
              ))}
              {(data?.transactions || []).length === 0 && <p className="text-sm text-slate-400">Pay fees upfront to start earning points & cashback.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Enroll dialog */}
      <Dialog open={!!enrollFor} onOpenChange={(o) => !o && setEnrollFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enroll in {enrollFor?.title}</DialogTitle></DialogHeader>
          <p className="text-sm text-slate-500">This will use <b className="text-[#5548D1]">{enrollFor?.points_cost} points</b>. Choose which child to enroll.</p>
          <Select value={enrollChild} onValueChange={setEnrollChild}>
            <SelectTrigger className="rounded-lg mt-2" data-testid="enroll-child-select"><SelectValue /></SelectTrigger>
            <SelectContent>
              {children.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} · {c.grade}</SelectItem>)}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollFor(null)}>Cancel</Button>
            <Button disabled={busy} onClick={doEnroll} data-testid="confirm-enroll" className="bg-emerald-600 hover:bg-emerald-700">Confirm enrollment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Voucher dialog */}
      <Dialog open={!!voucher} onOpenChange={(o) => !o && setVoucher(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" /> Coupon Redeemed!</DialogTitle></DialogHeader>
          <p className="text-sm text-slate-500">{voucher?.title}</p>
          <div className="rounded-xl border-2 border-dashed border-[#5548D1]/40 bg-[#EEF0FF] p-4 flex items-center justify-between">
            <span className="font-mono font-bold text-lg text-[#5548D1] tracking-wider">{voucher?.code}</span>
            <button onClick={() => { navigator.clipboard?.writeText(voucher?.code || ""); toast.success("Copied!"); }}
              className="text-[#5548D1] hover:text-[#3F35A8]" data-testid="copy-voucher"><Copy className="h-4 w-4" /></button>
          </div>
          <DialogFooter><Button onClick={() => setVoucher(null)} className="bg-[#5548D1] hover:bg-[#3F35A8]">Done</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </ParentLayout>
  );
}
