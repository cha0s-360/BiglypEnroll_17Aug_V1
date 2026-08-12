'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
  LifeBuoy, MessageCircle, TrendingUp, FileCheck, Clock, BadgeCheck, UserCheck,
  Lock, Timer,
} from "lucide-react";

const TIER_STYLE = {
  Bronze: "from-amber-700 to-amber-500",
  Silver: "from-slate-400 to-slate-300",
  Gold: "from-yellow-500 to-amber-400",
  Platinum: "from-indigo-600 to-[#5548D1]",
};

const PERK_ICONS = {
  "life-buoy": LifeBuoy,
  "message-circle": MessageCircle,
  "trending-up": TrendingUp,
  "file-check": FileCheck,
  "clock": Clock,
  "badge-check": BadgeCheck,
  "user-check": UserCheck,
  "sparkles": Sparkles,
};

const TIER_ACCENT = {
  Bronze: "text-amber-600 bg-amber-50 border-amber-200",
  Silver: "text-slate-600 bg-slate-100 border-slate-200",
  Gold: "text-yellow-700 bg-yellow-50 border-yellow-200",
  Platinum: "text-[#5548D1] bg-[#EEF0FF] border-[#5548D1]/30",
};

function daysBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

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
      <Box className="mb-6">
        <Typography variant="inherit" component="p" className="text-xs tracking-[0.2em] uppercase text-[#5548D1] font-semibold">Rewards</Typography>
        <Typography variant="inherit" component="h1" className="font-head text-3xl font-black tracking-tight text-brand-navy mt-1">Biglyp Rewards</Typography>
        <Typography variant="inherit" component="p" className="text-sm text-slate-500 mt-1">Earn points & cashback on fee payments — redeem for brand coupons or enrichment courses.</Typography>
      </Box>

      {/* Summary cards */}
      <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Box className={`rounded-2xl p-5 text-white bg-gradient-to-br ${TIER_STYLE[data?.tier] || TIER_STYLE.Bronze}`} data-testid="rewards-points">
          <Box className="flex items-center justify-between">
            <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold opacity-90">Reward Points</Typography>
            <Sparkles className="h-5 w-5 opacity-90" />
          </Box>
          <Typography variant="inherit" component="p" className="font-head text-4xl font-black mt-2">{points.toLocaleString("en-IN")}</Typography>
          <Typography variant="inherit" component="p" className="text-xs mt-1 opacity-90 flex items-center gap-1"><Star className="h-3 w-3 fill-white" /> {data?.tier || "Bronze"} tier</Typography>
          {data?.next_tier && (
            <Box className="mt-3">
              <Box className="h-1.5 bg-white/25 rounded-full overflow-hidden">
                <Box className="h-full bg-white/90 rounded-full transition-all" style={{ width: `${data.progress_pct || 0}%` }} />
              </Box>
              <Typography variant="inherit" component="p" className="text-[11px] mt-1.5 opacity-90">
                {data.points_to_next?.toLocaleString("en-IN")} pts to <b>{data.next_tier}</b>
              </Typography>
            </Box>
          )}
          {!data?.next_tier && (
            <Typography variant="inherit" component="p" className="text-[11px] mt-3 opacity-90">Highest tier unlocked ✨</Typography>
          )}
        </Box>
        <Box className="rounded-2xl p-5 border-2 border-emerald-200 bg-emerald-50" data-testid="rewards-wallet">
          <Box className="flex items-center justify-between">
            <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-emerald-700">Cashback Wallet</Typography>
            <Wallet className="h-5 w-5 text-emerald-600" />
          </Box>
          <Typography variant="inherit" component="p" className="font-head text-4xl font-black text-emerald-700 mt-2">{inr(data?.wallet || 0)}</Typography>
          <Typography variant="inherit" component="p" className="text-xs mt-1 text-emerald-700/80">Auto-applies to your next fee payment</Typography>
        </Box>
        <Box className="rounded-2xl p-5 border-2 border-border bg-white" data-testid="rewards-redeemed">
          <Box className="flex items-center justify-between">
            <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-[#5548D1]">Redeemed</Typography>
            <Gift className="h-5 w-5 text-[#5548D1]" />
          </Box>
          <Typography variant="inherit" component="p" className="font-head text-4xl font-black text-brand-navy mt-2">{redemptions.length}</Typography>
          <Typography variant="inherit" component="p" className="text-xs mt-1 text-slate-500">coupons & courses claimed</Typography>
        </Box>
      </Box>

      {/* Tier perks */}
      {data?.perks && data.perks.length > 0 && (
        <Box className="mb-8" data-testid="tier-perks">
          <Box className="flex items-center justify-between mb-3">
            <Box>
              <Typography variant="inherit" component="p" className="font-head text-lg font-black text-brand-navy">Your Tier Perks</Typography>
              <Typography variant="inherit" component="p" className="text-xs text-slate-500">
                Unlocked at your current <b className="text-[#5548D1]">{data.tier}</b> tier
                {data.next_tier ? <> · more unlock at <b>{data.next_tier}</b> ({data.points_to_next?.toLocaleString("en-IN")} pts away)</> : <> · you&apos;ve reached the top!</>}
              </Typography>
            </Box>
          </Box>
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.perks.map((p, i) => {
              const Icon = PERK_ICONS[p.icon] || Sparkles;
              const accent = TIER_ACCENT[p.tier] || TIER_ACCENT.Bronze;
              return (
                <Box key={`${p.tier}-${i}`}
                  data-testid={`perk-${p.tier.toLowerCase()}-${i}`}
                  className={`rounded-xl border-2 p-4 flex gap-3 transition-opacity ${p.unlocked ? "bg-white border-border" : "bg-slate-50 border-dashed border-slate-200 opacity-60"}`}>
                  <Box className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center border ${accent}`}>
                    {p.unlocked ? <Icon className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </Box>
                  <Box className="min-w-0">
                    <Box className="flex items-center gap-2 flex-wrap">
                      <Typography variant="inherit" component="p" className="font-semibold text-brand-navy text-sm">{p.title}</Typography>
                      <Box component="span" className={`text-[10px] uppercase tracking-widest font-bold rounded-full px-2 py-0.5 border ${accent}`}>{p.tier}</Box>
                    </Box>
                    <Typography variant="inherit" component="p" className="text-xs text-slate-500 mt-1 leading-relaxed">{p.desc}</Typography>
                    {!p.unlocked && (
                      <Typography variant="inherit" component="p" className="text-[10.5px] mt-1.5 font-semibold text-slate-400">Locked · reach {p.tier} to unlock</Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Tabs */}
      <Box className="flex items-center gap-2 mb-5">
        {[
          { k: "coupons", label: "Brand Coupons", icon: Ticket },
          { k: "courses", label: "Enrichment Courses", icon: GraduationCap },
          { k: "activity", label: "My Rewards", icon: Gift },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.k;
          return (
            <Box component="button" key={t.k} data-testid={`rewards-tab-${t.k}`} onClick={() => setTab(t.k)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                active ? "bg-[#5548D1] text-white" : "bg-white border border-border text-slate-500 hover:text-brand-navy"
              }`}>
              <Icon className="h-4 w-4" /> {t.label}
            </Box>
          );
        })}
      </Box>

      {/* Coupons */}
      {tab === "coupons" && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="coupon-grid">
          {catalog.coupons.map((c) => {
            const afford = points >= c.points_cost;
            return (
              <Box key={c.id} className="rounded-2xl border-2 border-border bg-white p-5 flex flex-col">
                <Box className="flex items-center justify-between">
                  <Box component="span" className="text-[10px] uppercase tracking-widest font-bold text-[#5548D1] bg-[#EEF0FF] px-2.5 py-1 rounded-full">{c.brand}</Box>
                  <Box component="span" className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">{c.category}</Box>
                </Box>
                <Typography variant="inherit" component="p" className="font-head text-[16px] font-black text-brand-navy mt-3 leading-snug flex-1">{c.title}</Typography>
                <Box className="mt-4 flex items-center justify-between">
                  <Box component="span" className="font-head text-lg font-black text-[#5548D1]">{c.points_cost.toLocaleString("en-IN")} <Box component="span" className="text-[11px] text-slate-400 font-semibold">pts</Box></Box>
                  <Button size="sm" disabled={!afford || busy} onClick={() => redeemCoupon(c)} data-testid={`redeem-${c.id}`}
                    className="rounded-lg bg-[#5548D1] hover:bg-[#3F35A8] disabled:opacity-40">
                    {afford ? "Redeem" : "Need more"}
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Courses */}
      {tab === "courses" && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="course-grid">
          {catalog.courses.map((c) => {
            const afford = points >= c.points_cost;
            return (
              <Box key={c.id} className="rounded-2xl border-2 border-border bg-white p-5 flex flex-col">
                <Box className="flex items-center justify-between">
                  <Box component="span" className="text-[10px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{c.category}</Box>
                  <Box component="span" className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">{c.duration}</Box>
                </Box>
                <Typography variant="inherit" component="p" className="font-head text-[16px] font-black text-brand-navy mt-3 leading-snug">{c.title}</Typography>
                <Typography variant="inherit" component="p" className="text-[12.5px] text-slate-500 mt-1 flex-1">{c.desc}</Typography>
                <Box className="mt-4 flex items-center justify-between">
                  <Box component="span" className="font-head text-lg font-black text-[#5548D1]">{c.points_cost.toLocaleString("en-IN")} <Box component="span" className="text-[11px] text-slate-400 font-semibold">pts</Box></Box>
                  <Button size="sm" disabled={!afford || busy} onClick={() => setEnrollFor(c)} data-testid={`enroll-${c.id}`}
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40">
                    {afford ? "Enroll" : "Need more"}
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Activity */}
      {tab === "activity" && (
        <Box className="space-y-6" data-testid="rewards-activity">
          <Box>
            <Typography variant="inherit" component="p" className="font-head text-lg font-black text-brand-navy mb-3">Redemptions</Typography>
            {redemptions.length === 0 && <Typography variant="inherit" component="p" className="text-sm text-slate-400">No redemptions yet. Redeem a coupon or enroll in a course!</Typography>}
            <Box className="space-y-2">
              {redemptions.map((r) => {
                const now = new Date();
                const created = r.created_at ? new Date(r.created_at) : null;
                const expires = r.expires_at ? new Date(r.expires_at) : null;
                const isCoupon = r.kind === "coupon";
                const isRecent = isCoupon && created && daysBetween(created, now) <= 7;
                const isExpired = isCoupon && expires && expires < now;
                const isExpiringSoon = isCoupon && expires && !isExpired && daysBetween(now, expires) <= 14;
                return (
                  <Box key={r.id} data-testid={`redemption-${r.id}`}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 ${isExpired ? "bg-slate-50 border-slate-200 opacity-70" : "bg-white border-border"}`}>
                    <Box className="flex items-center gap-3 min-w-0">
                      {isCoupon ? <Ticket className={`h-4 w-4 ${isExpired ? "text-slate-400" : "text-[#5548D1]"}`} />
                        : <GraduationCap className="h-4 w-4 text-emerald-600" />}
                      <Box className="min-w-0">
                        <Box className="flex items-center gap-2 flex-wrap">
                          <Typography variant="inherit" component="p" className={`text-sm font-semibold ${isExpired ? "text-slate-500 line-through" : "text-brand-navy"}`}>{r.title}</Typography>
                          {isRecent && !isExpired && (
                            <Box component="span" data-testid={`recent-${r.id}`}
                              className="text-[10px] uppercase tracking-widest font-bold rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <Sparkles className="h-2.5 w-2.5" /> Recently redeemed
                            </Box>
                          )}
                          {isExpired && (
                            <Box component="span" className="text-[10px] uppercase tracking-widest font-bold rounded-full px-2 py-0.5 bg-slate-200 text-slate-600">Expired</Box>
                          )}
                          {isExpiringSoon && !isExpired && (
                            <Box component="span" className="text-[10px] uppercase tracking-widest font-bold rounded-full px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200">Use soon</Box>
                          )}
                        </Box>
                        <Typography variant="inherit" component="p" className="text-xs text-slate-500 mt-0.5">
                          {isCoupon ? <>Code: <Box component="span" className={`font-mono font-semibold ${isExpired ? "text-slate-400" : "text-brand-navy"}`}>{r.code}</Box></> : <>For {r.student_name} · {r.status}</>}
                          {isCoupon && expires && (
                            <Box component="span" className={`inline-flex items-center gap-1 ml-2 ${isExpired ? "text-slate-400" : isExpiringSoon ? "text-amber-600" : "text-slate-500"}`}>
                              <Timer className="h-3 w-3" /> {isExpired ? "Expired" : "Valid till"} {formatDate(r.expires_at)}
                            </Box>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    <Box component="span" className="text-xs font-bold text-red-500 shrink-0">-{r.points_spent} pts</Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
          <Box>
            <Typography variant="inherit" component="p" className="font-head text-lg font-black text-brand-navy mb-3">Points Activity</Typography>
            <Box className="space-y-2">
              {(data?.transactions || []).map((t) => (
                <Box key={t.id} className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
                  <Typography variant="inherit" component="p" className="text-sm text-brand-navy">{t.description}</Typography>
                  <Box className="text-right">
                    {t.points_delta !== 0 && <Box component="span" className={`text-xs font-bold ${t.points_delta > 0 ? "text-emerald-600" : "text-red-500"}`}>{t.points_delta > 0 ? "+" : ""}{t.points_delta} pts</Box>}
                    {t.wallet_delta !== 0 && <Box component="span" className="block text-[11px] text-slate-500">{t.wallet_delta > 0 ? "+" : ""}{inr(t.wallet_delta)} wallet</Box>}
                  </Box>
                </Box>
              ))}
              {(data?.transactions || []).length === 0 && <Typography variant="inherit" component="p" className="text-sm text-slate-400">Pay fees upfront to start earning points & cashback.</Typography>}
            </Box>
          </Box>
        </Box>
      )}

      {/* Enroll dialog */}
      <Dialog open={!!enrollFor} onOpenChange={(o) => !o && setEnrollFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enroll in {enrollFor?.title}</DialogTitle></DialogHeader>
          <Typography variant="inherit" component="p" className="text-sm text-slate-500">This will use <b className="text-[#5548D1]">{enrollFor?.points_cost} points</b>. Choose which child to enroll.</Typography>
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
          <Typography variant="inherit" component="p" className="text-sm text-slate-500">{voucher?.title}</Typography>
          <Box className="rounded-xl border-2 border-dashed border-[#5548D1]/40 bg-[#EEF0FF] p-4 flex items-center justify-between">
            <Box component="span" className="font-mono font-bold text-lg text-[#5548D1] tracking-wider">{voucher?.code}</Box>
            <Box component="button" onClick={() => { navigator.clipboard?.writeText(voucher?.code || ""); toast.success("Copied!"); }}
              className="text-[#5548D1] hover:text-[#3F35A8]" data-testid="copy-voucher"><Copy className="h-4 w-4" /></Box>
          </Box>
          <DialogFooter><Button onClick={() => setVoucher(null)} className="bg-[#5548D1] hover:bg-[#3F35A8]">Done</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </ParentLayout>
  );
}
