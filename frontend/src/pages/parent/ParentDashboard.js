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
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Wallet, CheckCircle2, CreditCard, ShieldCheck, Download, Calendar,
  GraduationCap, Zap, Bus, Plane, ArrowRight, Sparkles,
} from "lucide-react";

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

  // pay dialog
  const [payOpen, setPayOpen] = useState(false);
  const [payHeadIds, setPayHeadIds] = useState([]);
  const [mode, setMode] = useState("UPI");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // financing dialog
  const [finOpen, setFinOpen] = useState(false);
  const [finHeadIds, setFinHeadIds] = useState([]);
  const [finAmount, setFinAmount] = useState(0);
  const [down, setDown] = useState(0);
  const [tenure, setTenure] = useState(12);
  const [finPreview, setFinPreview] = useState(null);

  useEffect(() => {
    api.get("/parent/children").then(({ data }) => {
      setChildren(data);
      if (data[0]) setActiveChild(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!activeChild) return;
    api.get(`/parent/fees/${activeChild}`).then(({ data }) => setFeeData(data));
  }, [activeChild]);

  const child = children.find((c) => c.id === activeChild);
  const items = feeData?.items || [];
  const pending = items.filter((i) => !i.paid);

  const academicPending = pending.filter((i) => !isAddon(i.name));
  const addonPending = pending.filter((i) => isAddon(i.name));
  const academicTotal = academicPending.reduce((a, i) => a + i.amount, 0);
  const academicIds = academicPending.map((i) => i.fee_head_id);

  const freqOptions = useMemo(() => ([
    { key: "yearly", label: "Yearly", amount: academicTotal, unit: "/year" },
    { key: "semi", label: "Semi-Annually", amount: Math.round(academicTotal / 2), unit: "/term" },
    { key: "quarterly", label: "Quarterly", amount: Math.round(academicTotal / 4), unit: "/qtr" },
    { key: "monthly", label: "Monthly (Via Fee Financing)", amount: Math.ceil(academicTotal / 12), unit: "/mo", financing: true },
  ]), [academicTotal]);

  const dueDate = useMemo(() => {
    const yr = (feeData?.academic_year || "2026-27").slice(0, 4);
    return `15th September ${yr}`;
  }, [feeData]);

  const refresh = () => api.get(`/parent/fees/${activeChild}`).then(({ data }) => setFeeData(data));

  // ---------- payment ----------
  const payItems = pending.filter((i) => payHeadIds.includes(i.fee_head_id));
  const payTotal = payItems.reduce((a, i) => a + i.amount, 0);
  const payGst = Math.round(payTotal * 0.18);

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

  // ---------- financing ----------
  const startFinancing = (headIds) => {
    if (!headIds.length) return;
    const amt = pending.filter((i) => headIds.includes(i.fee_head_id)).reduce((a, i) => a + i.amount, 0);
    setFinHeadIds(headIds);
    setFinAmount(amt);
    setDown(0);
    setTenure(12);
    setFinPreview(null);
    setFinOpen(true);
  };

  useEffect(() => {
    if (!finOpen || !finAmount) return;
    api.post("/parent/financing/preview", { amount: finAmount, down_payment: down, tenure })
      .then(({ data }) => setFinPreview(data));
  }, [down, tenure, finOpen, finAmount]);

  const payFinancing = async () => {
    setProcessing(true);
    try {
      const { data } = await api.post("/parent/pay-financing", { student_id: activeChild, fee_head_ids: finHeadIds, tenure, down_payment: down });
      setReceipt(data);
      setFinOpen(false);
      refresh();
      toast.success("Financing approved — school paid in full");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Financing failed");
    } finally {
      setProcessing(false);
    }
  };

  const proceedAcademic = () => {
    if (freq === "monthly") { startFinancing(academicIds); return; }
    if (freq === "yearly") { startPay(academicIds); return; }
    // quarterly / semi -> auto-debit mandate setup for installment plan
    navigate("/app/mandate", {
      state: {
        studentId: activeChild,
        studentName: child?.name,
        feeHeadIds: academicIds,
        academicTotal,
        frequency: freq,
      },
    });
  };

  return (
    <ParentLayout>
      {/* page heading + child selector */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#2563EB] font-semibold">Fee Payment</p>
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
          <GraduationCap className="h-10 w-10 text-[#2563EB] mx-auto" />
          <p className="mt-4 font-head font-bold text-brand-navy text-lg">No students linked yet</p>
          <p className="text-sm text-slate-500 mt-1">Ask your school to link your child to this email.</p>
        </div>
      )}

      {child && (
        <div className="space-y-10">
          {/* ============ Section 1: Academic Core Fees ============ */}
          <section>
            <h2 className="font-head text-xl font-bold text-brand-navy">Academic Fee Dues</h2>
            <p className="text-sm text-slate-500 mt-0.5">Your core tuition &amp; academic charges for the year.</p>

            {academicTotal > 0 ? (
              <div className="mt-4 bg-white border border-border rounded-2xl p-6 md:p-8 hard-shadow-sm" data-testid="academic-card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold px-3 py-1" data-testid="status-badge">
                    Pending Collection
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                    <Calendar className="h-4 w-4" /> Due {dueDate}
                  </span>
                </div>

                {/* frequency pill bar */}
                <div className="mt-6 grid sm:grid-cols-2 gap-3" data-testid="freq-pill-bar">
                  {freqOptions.map((o) => {
                    const active = freq === o.key;
                    return (
                      <button
                        key={o.key}
                        data-testid={`freq-${o.key}`}
                        onClick={() => setFreq(o.key)}
                        className={`text-left rounded-xl border p-4 transition-colors ${
                          active
                            ? o.financing
                              ? "border-[#2563EB] bg-[#EFF6FF] ring-1 ring-[#2563EB]"
                              : "border-[#2563EB] bg-[#EFF6FF]"
                            : "border-border bg-white hover:border-[#2563EB]/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold ${o.financing ? "text-[#2563EB]" : "text-brand-navy"}`}>
                            {o.label}
                          </span>
                          {o.financing && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5">
                              <Zap className="h-3 w-3" /> 0% Interest EMI
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className={`font-head text-2xl font-black ${o.financing ? "text-[#2563EB]" : "text-brand-navy"}`}>
                            {inr(o.amount)}
                          </span>
                          <span className="text-xs text-slate-500">{o.unit}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* dynamic callout for monthly */}
                {freq === "monthly" && (
                  <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/15 p-4" data-testid="emi-callout">
                    <div className="h-8 w-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                      <Zap className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-brand-navy leading-relaxed">
                      Convert bulky academic fees into zero-interest monthly EMIs. Upfront 100% payment
                      cleared directly to school.
                    </p>
                  </div>
                )}

                <Button
                  onClick={proceedAcademic}
                  data-testid="proceed-breakdown-btn"
                  className="mt-6 h-12 px-6 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold"
                >
                  Proceed to Fee Breakdown <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                {feeData?.scholarships?.length > 0 && (
                  <div className="mt-5 flex items-start gap-2 text-xs text-slate-500">
                    <Sparkles className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>
                      Scholarships available: {feeData.scholarships.map((s) => `${s.name} (${s.type === "percentage" ? s.value + "%" : inr(s.value)})`).join(" · ")}. Contact your counsellor to apply.
                    </span>
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

          {/* ============ Section 2: Add-On School Modules ============ */}
          <section>
            <h2 className="font-head text-xl font-bold text-brand-navy">Add-On School Modules</h2>
            <p className="text-sm text-slate-500 mt-0.5">Optional &amp; one-time collections. Paid upfront.</p>

            {addonPending.length > 0 ? (
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                {addonPending.map((i) => {
                  const Icon = i.name.toLowerCase().includes("trip") || i.name.toLowerCase().includes("excursion") ? Plane : Bus;
                  return (
                    <div key={i.fee_head_id} className="bg-white border border-border rounded-2xl p-5" data-testid={`addon-${i.fee_head_id}`}>
                      <div className="flex items-start justify-between">
                        <div className="h-10 w-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-1">
                          Direct Payment Only
                        </span>
                      </div>
                      <p className="mt-4 font-semibold text-brand-navy">{i.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{i.frequency}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-head text-2xl font-black text-brand-navy">{inr(i.amount)}</span>
                        <Button
                          onClick={() => startPay([i.fee_head_id])}
                          data-testid={`pay-upfront-${i.fee_head_id}`}
                          className="h-10 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold"
                        >
                          Pay Upfront
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 bg-white border border-border rounded-2xl p-8 text-center">
                <Wallet className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="mt-3 text-sm text-slate-500">No add-on modules pending.</p>
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
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="rounded-lg" data-testid="mode-select"><SelectValue /></SelectTrigger>
              <SelectContent>{MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#2563EB]" /> Simulated gateway — no real charge is made.
            </div>
            <Button onClick={pay} disabled={processing} data-testid="confirm-pay-btn"
              className="w-full h-11 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] font-semibold">
              <CreditCard className="h-4 w-4 mr-2" />
              {processing ? "Processing..." : `Pay ${inr(payTotal + payGst)}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Financing dialog */}
      <Dialog open={finOpen} onOpenChange={setFinOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle className="font-head flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#2563EB]" /> 0% Fee Financing</DialogTitle></DialogHeader>
          <div className="space-y-4 py-1">
            <p className="text-sm text-slate-500">Split academic fees into zero-interest monthly EMIs. Your school is paid <b>100% upfront</b>.</p>
            <div>
              <label className="text-sm font-medium text-brand-navy">Down payment</label>
              <Input type="number" value={down} onChange={(e) => setDown(Math.max(0, Math.min(finAmount, Number(e.target.value))))}
                className="rounded-lg mt-1.5" data-testid="down-input" />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-navy flex justify-between"><span>Tenure</span><span>{tenure} months</span></label>
              <Slider value={[tenure]} min={3} max={12} step={1} onValueChange={(v) => setTenure(v[0])} className="mt-3" data-testid="tenure-slider" />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1"><span>3 months</span><span>12 months</span></div>
            </div>
            {finPreview && (
              <div className="bg-[#EFF6FF] rounded-xl p-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Financed amount</span><span className="font-semibold">{inr(finPreview.financed_amount)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Monthly EMI</span><span className="font-head font-bold text-[#2563EB] text-lg">{inr(finPreview.emi)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Interest</span><span className="font-semibold text-green-600">0%</span></div>
              </div>
            )}
            {finPreview && (
              <div className="max-h-32 overflow-y-auto border border-border rounded-lg divide-y divide-border">
                {finPreview.schedule.map((s) => (
                  <div key={s.month} className="flex items-center justify-between px-3 py-2 text-xs">
                    <span className="flex items-center gap-2 text-slate-500"><Calendar className="h-3 w-3" /> {s.due_date}</span>
                    <span className="font-semibold text-brand-navy">{inr(s.amount)}</span>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={payFinancing} disabled={processing} data-testid="confirm-finance-btn"
              className="w-full h-11 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] font-semibold">
              {processing ? "Setting up..." : "Confirm plan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
            <Button onClick={() => setReceipt(null)} className="w-full mt-5 h-11 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8]" data-testid="receipt-close">
              <Download className="h-4 w-4 mr-2" /> Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ParentLayout>
  );
}
