import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ParentLayout } from "@/components/ParentLayout";
import api, { inr } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Wallet, CheckCircle2, CreditCard, ShieldCheck, Download, Calendar,
  GraduationCap, Zap, Bus, Plane, ArrowRight, Sparkles,
} from "lucide-react";
import { FinancingWizard } from "./FinancingWizard";

const MODES = ["UPI", "Cards", "Net Banking", "Wallets", "AutoPay/eNACH"];
const ADDON_KEYWORDS = ["transport", "bus", "trip", "excursion", "meal", "uniform", "activity", "field", "sport"];
const isAddon = (name = "") => ADDON_KEYWORDS.some((k) => name.toLowerCase().includes(k));

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(null);
  const [feeData, setFeeData] = useState(null);

  // academic frequency selection
  const [freq, setFreq] = useState("yearly");
  const [clubbed, setClubbed] = useState([]); // quarterly "other fee" ids clubbed with tuition

  // pay dialog
  const [payOpen, setPayOpen] = useState(false);
  const [payHeadIds, setPayHeadIds] = useState([]);
  const [mode, setMode] = useState("UPI");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // financing wizard
  const [finOpen, setFinOpen] = useState(false);
  const [finHeadIds, setFinHeadIds] = useState([]);
  const [finAmount, setFinAmount] = useState(0);

  useEffect(() => {
    api.get("/parent/children").then(({ data }) => {
      setChildren(data);
      if (data[0]) setActiveChild(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!activeChild) return;
    setClubbed([]);
    api.get(`/parent/fees/${activeChild}`).then(({ data }) => setFeeData(data));
  }, [activeChild]);

  const child = children.find((c) => c.id === activeChild);
  const items = feeData?.items || [];
  const pending = items.filter((i) => !i.paid);

  const isOneTime = (f = "") => /one.?time/i.test(f);
  const isQuarterly = (f = "") => /quarter/i.test(f);

  const academicPending = pending.filter((i) => !isAddon(i.name));
  const otherPending = pending.filter((i) => isAddon(i.name));

  // "Other fees" that are quarterly can be clubbed with tuition and paid on the academic plan
  const clubbedItems = otherPending.filter((i) => clubbed.includes(i.fee_head_id));

  // One-time academic fees must be paid in full (no EMI / auto-debit)
  const academicOneTime = academicPending.filter((i) => isOneTime(i.frequency));
  const academicRecurring = academicPending.filter((i) => !isOneTime(i.frequency));

  const academicItems = [...academicPending, ...clubbedItems];          // full breakup
  const academicTotal = academicItems.reduce((a, i) => a + i.amount, 0); // full total
  const fullIds = academicItems.map((i) => i.fee_head_id);

  // installment plans (semi / quarterly / monthly) exclude one-time fees
  const installItems = [...academicRecurring, ...clubbedItems];
  const installTotal = installItems.reduce((a, i) => a + i.amount, 0);
  const installIds = installItems.map((i) => i.fee_head_id);

  const hasOneTimeInAcademic = academicOneTime.length > 0;

  const toggleClub = (id) =>
    setClubbed((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const freqOptions = useMemo(() => ([
    { key: "yearly", label: "Full Payment", amount: academicTotal, unit: "one-time" },
    { key: "semi", label: "Semi-Annual", amount: Math.round(installTotal / 2), unit: "/term" },
    { key: "quarterly", label: "Quarterly", amount: Math.round(installTotal / 4), unit: "/qtr" },
    { key: "monthly", label: "Monthly", amount: Math.ceil(installTotal / 12), unit: "/mo", financing: true },
  ]), [academicTotal, installTotal]);

  const dueDate = useMemo(() => {
    const yr = (feeData?.academic_year || "2026-27").slice(0, 4);
    return `15th September ${yr}`;
  }, [feeData]);

  const refresh = () => api.get(`/parent/fees/${activeChild}`).then(({ data }) => setFeeData(data));

  // ---------- payment ----------
  const payItems = pending.filter((i) => payHeadIds.includes(i.fee_head_id));
  const payTotal = payItems.reduce((a, i) => a + i.amount, 0);
  const payGst = Math.round(payTotal * 0.18);
  const payHasOneTime = payItems.some((i) => isOneTime(i.frequency));
  const availableModes = payHasOneTime ? MODES.filter((m) => m !== "AutoPay/eNACH") : MODES;

  const startPay = (headIds) => {
    if (!headIds.length) return;
    setPayHeadIds(headIds);
    setMode("UPI");
    setPayOpen(true);
  };

  const pay = async () => {
    setProcessing(true);
    try {
      const { data } = await api.post("/parent/pay", { student_id: activeChild, fee_head_ids: payHeadIds, mode });
      setReceipt(data);
      setPayOpen(false);
      refresh();
      toast.success("Payment successful");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  // ---------- financing (5-step wizard) ----------
  const startFinancing = (headIds) => {
    if (!headIds.length) return;
    const amt = pending.filter((i) => headIds.includes(i.fee_head_id)).reduce((a, i) => a + i.amount, 0);
    setFinHeadIds(headIds);
    setFinAmount(amt);
    setFinOpen(true);
  };

  const onFinancingSuccess = (data) => {
    setReceipt(data);
    refresh();
    toast.success("Financing approved — school paid in full");
  };


  const proceedAcademic = () => {
    if (freq === "yearly") { startPay(fullIds); return; }
    if (freq === "monthly") { startFinancing(installIds); return; }
    // quarterly / semi -> auto-debit mandate setup (one-time fees excluded)
    navigate("/app/mandate", {
      state: {
        studentId: activeChild,
        studentName: child?.name,
        feeHeadIds: installIds,
        academicTotal: installTotal,
        frequency: freq,
      },
    });
  };

  return (
    <ParentLayout>
      {/* page heading + child selector */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#5548D1] font-semibold">Fee Payment</p>
          <h1 className="font-head text-3xl font-black tracking-tight text-brand-navy mt-1">
            {child ? `${child.name.split(" ")[0]}'s Fees` : "Fee Payment"}
          </h1>
          {child && <p className="text-sm text-slate-500 mt-1">{child.grade} · {feeData?.academic_year}</p>}
        </div>
        {children.length > 1 && (
          <Select value={activeChild || ""} onValueChange={setActiveChild}>
            <SelectTrigger className="w-56 rounded-lg" data-testid="child-select"><SelectValue /></SelectTrigger>
            <SelectContent>
              {children.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} · {c.grade}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      {children.length === 0 && (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <GraduationCap className="h-10 w-10 text-[#5548D1] mx-auto" />
          <p className="mt-4 font-head font-bold text-brand-navy text-lg">No students linked yet</p>
          <p className="text-sm text-slate-500 mt-1">Ask your school to link your child to this email.</p>
        </div>
      )}

      {child && (
        <div className="space-y-10">
          {/* ============ Section 1: Academic Fee Dues (compact) ============ */}
          <section>
            <h2 className="font-head text-xl font-bold text-brand-navy">Academic Fee Dues</h2>
            <p className="text-sm text-slate-500 mt-0.5">Your core tuition &amp; academic charges for the year.</p>

            {academicTotal > 0 ? (
              <div className="mt-4 bg-white border border-border rounded-2xl p-5 md:p-6 hard-shadow-sm" data-testid="academic-card">
                {/* total + due date */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-[0.14em] text-slate-500 font-semibold">Total dues</span>
                      <span className="inline-flex items-center rounded-full bg-[#FEF3C7] text-[#92400E] text-[10px] font-semibold px-2 py-0.5" data-testid="status-badge">Pending Collection</span>
                    </div>
                    <p className="font-head text-3xl font-black text-brand-navy mt-1">{inr(academicTotal)}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                    <Calendar className="h-4 w-4" /> Due {dueDate}
                  </span>
                </div>

                {/* breakup */}
                <div className="mt-4 rounded-xl border border-border divide-y divide-border" data-testid="academic-breakup">
                  {academicItems.map((i) => (
                    <div key={i.fee_head_id} className="flex items-center justify-between px-3.5 py-2 text-sm">
                      <span className="text-slate-600 flex items-center gap-2">
                        {i.name}
                        {clubbed.includes(i.fee_head_id) && <span className="text-[10px] font-semibold text-[#5548D1] bg-[#EEF0FF] rounded-full px-1.5 py-0.5">clubbed</span>}
                        {isOneTime(i.frequency) && <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 rounded-full px-1.5 py-0.5">one-time</span>}
                      </span>
                      <span className="font-semibold text-brand-navy">{inr(i.amount)}</span>
                    </div>
                  ))}
                </div>

                {/* compact payment options */}
                <p className="mt-5 text-xs uppercase tracking-[0.14em] text-slate-500 font-semibold">Choose how to pay</p>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2" data-testid="freq-pill-bar">
                  {freqOptions.map((o) => {
                    const active = freq === o.key;
                    return (
                      <button key={o.key} data-testid={`freq-${o.key}`} onClick={() => setFreq(o.key)}
                        className={`text-left rounded-xl border px-3 py-2.5 transition-colors ${
                          active ? "border-[#5548D1] bg-[#EEF0FF] ring-1 ring-[#5548D1]" : "border-border bg-white hover:border-[#5548D1]/40"
                        }`}>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-semibold ${o.financing ? "text-[#5548D1]" : "text-brand-navy"}`}>{o.label}</span>
                          {o.financing && <Zap className="h-3 w-3 text-[#5548D1]" />}
                        </div>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className={`font-head text-lg font-black ${o.financing ? "text-[#5548D1]" : "text-brand-navy"}`}>{inr(o.amount)}</span>
                          <span className="text-[10px] text-slate-400">{o.unit}</span>
                        </div>
                        {o.financing && <span className="text-[9px] font-bold text-[#5548D1]">0% EMI</span>}
                      </button>
                    );
                  })}
                </div>

                {freq === "monthly" && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#EEF0FF] border border-[#5548D1]/15 p-3" data-testid="emi-callout">
                    <Zap className="h-4 w-4 text-[#5548D1] shrink-0 mt-0.5" />
                    <p className="text-xs text-brand-navy leading-relaxed">Convert bulky academic fees into zero-interest monthly EMIs. School is paid 100% upfront.</p>
                  </div>
                )}

                {freq !== "yearly" && hasOneTimeInAcademic && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3" data-testid="onetime-note">
                    <p className="text-xs text-amber-800 leading-relaxed">
                      One-time fees ({academicOneTime.map((i) => i.name).join(", ")}) can&apos;t be auto-debited — pay them in full separately.
                    </p>
                    <Button onClick={() => startPay(academicOneTime.map((i) => i.fee_head_id))} data-testid="pay-onetime-btn"
                      variant="outline" className="h-8 rounded-lg border-amber-400 text-amber-800 hover:bg-amber-100 font-semibold text-xs">
                      Pay one-time now
                    </Button>
                  </div>
                )}

                <Button onClick={proceedAcademic} data-testid="proceed-breakdown-btn"
                  className="mt-5 h-11 px-6 rounded-lg bg-[#5548D1] hover:bg-[#3F35A8] text-white font-semibold">
                  {freq === "monthly" ? "Start 0% EMI Application" : freq === "yearly" ? "Pay Full Amount" : "Set Up Auto-Debit Plan"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                {feeData?.scholarships?.length > 0 && (
                  <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-500">
                    <Sparkles className="h-3.5 w-3.5 text-[#5548D1] shrink-0 mt-0.5" />
                    <span>Scholarships available: {feeData.scholarships.map((s) => `${s.name} (${s.type === "percentage" ? s.value + "%" : inr(s.value)})`).join(" · ")}.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 bg-white border border-border rounded-2xl p-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
                <p className="mt-3 font-semibold text-brand-navy">All academic dues cleared</p>
                <p className="text-sm text-slate-500 mt-1">No pending core academic fees for this year.</p>
              </div>
            )}
          </section>

          {/* ============ Section 2: Other Fees ============ */}
          <section>
            <h2 className="font-head text-xl font-bold text-brand-navy">Other Fees</h2>
            <p className="text-sm text-slate-500 mt-0.5">Transport, activities &amp; one-time collections. Quarterly items can be clubbed with tuition.</p>

            {otherPending.length > 0 ? (
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                {otherPending.map((i) => {
                  const Icon = i.name.toLowerCase().includes("trip") || i.name.toLowerCase().includes("excursion") ? Plane : Bus;
                  const quarterly = isQuarterly(i.frequency);
                  const oneTime = isOneTime(i.frequency);
                  const isClubbed = clubbed.includes(i.fee_head_id);
                  return (
                    <div key={i.fee_head_id} className={`bg-white border rounded-2xl p-5 ${isClubbed ? "border-[#5548D1] ring-1 ring-[#5548D1]/30" : "border-border"}`} data-testid={`addon-${i.fee_head_id}`}>
                      <div className="flex items-start justify-between">
                        <div className="h-10 w-10 rounded-lg bg-[#EEF0FF] text-[#5548D1] flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                        <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-1">
                          {oneTime ? "One-Time · No Auto-Debit" : "Direct Payment"}
                        </span>
                      </div>
                      <p className="mt-4 font-semibold text-brand-navy">{i.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{i.frequency}</p>

                      {quarterly && (
                        <label className="mt-3 flex items-center gap-2.5 cursor-pointer rounded-lg bg-[#EEF0FF]/60 px-3 py-2" data-testid={`club-label-${i.fee_head_id}`}>
                          <Checkbox checked={isClubbed} onCheckedChange={() => toggleClub(i.fee_head_id)} data-testid={`club-${i.fee_head_id}`} />
                          <span className="text-xs text-brand-navy font-medium">Club with tuition fee &amp; pay on the plan above</span>
                        </label>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-head text-2xl font-black text-brand-navy">{inr(i.amount)}</span>
                        {isClubbed ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5548D1]"><CheckCircle2 className="h-4 w-4" /> Clubbed above</span>
                        ) : (
                          <Button onClick={() => startPay([i.fee_head_id])} data-testid={`pay-upfront-${i.fee_head_id}`}
                            className="h-10 rounded-lg bg-[#5548D1] hover:bg-[#3F35A8] text-white font-semibold">
                            Pay Upfront
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 bg-white border border-border rounded-2xl p-8 text-center">
                <Wallet className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="mt-3 text-sm text-slate-500">No other fees pending.</p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Pay dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle className="font-head">Fee breakdown</DialogTitle></DialogHeader>
          <div className="space-y-3 py-1">
            <div className="rounded-xl border border-border divide-y divide-border">
              {payItems.map((i) => (
                <div key={i.fee_head_id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-slate-600">{i.name}</span>
                  <span className="font-semibold text-brand-navy">{inr(i.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-slate-500">GST (18%)</span>
                <span className="text-slate-600">{inr(payGst)}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC]">
                <span className="font-head font-bold text-brand-navy">Total payable</span>
                <span className="font-head font-black text-brand-navy text-lg">{inr(payTotal + payGst)}</span>
              </div>
            </div>
            <Select value={availableModes.includes(mode) ? mode : availableModes[0]} onValueChange={setMode}>
              <SelectTrigger className="rounded-lg" data-testid="mode-select"><SelectValue /></SelectTrigger>
              <SelectContent>{availableModes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
            {payHasOneTime && (
              <p className="text-[11px] text-slate-400 px-1">One-time fees must be paid in full — AutoPay / eNACH is not available.</p>
            )}
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#5548D1]" /> Simulated gateway — no real charge is made.
            </div>
            <Button onClick={pay} disabled={processing} data-testid="confirm-pay-btn"
              className="w-full h-11 rounded-lg bg-[#5548D1] hover:bg-[#3F35A8] font-semibold">
              <CreditCard className="h-4 w-4 mr-2" />
              {processing ? "Processing..." : `Pay ${inr(payTotal + payGst)}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Financing wizard (5-step) */}
      <FinancingWizard
        open={finOpen}
        onOpenChange={setFinOpen}
        studentId={activeChild}
        feeHeadIds={finHeadIds}
        academicTotal={finAmount}
        onSuccess={onFinancingSuccess}
      />

      {/* Receipt dialog */}
      <Dialog open={!!receipt} onOpenChange={() => setReceipt(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader className="sr-only"><DialogTitle>Payment receipt</DialogTitle></DialogHeader>
          <div className="text-center py-4">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-head font-bold text-brand-navy text-xl mt-4">Payment successful</h3>
            <p className="text-sm text-slate-500 mt-1">Receipt {receipt?.receipt_no}</p>
            <div className="bg-slate-50 rounded-xl p-4 mt-5 text-left text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-500">Student</span><span className="font-medium">{receipt?.student_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Mode</span><span className="font-medium">{receipt?.mode}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-medium">{inr(receipt?.amount)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">GST</span><span className="font-medium">{inr(receipt?.gst)}</span></div>
            </div>
            <Button onClick={() => setReceipt(null)} className="w-full mt-5 h-11 rounded-lg bg-[#5548D1] hover:bg-[#3F35A8]" data-testid="receipt-close">
              <Download className="h-4 w-4 mr-2" /> Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ParentLayout>
  );
}
