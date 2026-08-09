import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ParentLayout } from "@/components/ParentLayout";
import api, { inr } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ChevronRight, ShieldCheck, Landmark, Smartphone, CreditCard, Zap,
  BadgeCheck, Lock, Calendar, CheckCircle2, ArrowLeft,
} from "lucide-react";

const BANKS = [
  "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank",
  "Punjab National Bank", "Bank of Baroda", "Yes Bank", "IndusInd Bank", "Canara Bank",
];

const RAILS = [
  { key: "UPI AutoPay", title: "UPI AutoPay (Google Pay, PhonePe, Paytm)", icon: Smartphone, badge: "Recommended · Instant Setup" },
  { key: "Net Banking eNACH", title: "Net Banking eNACH", icon: Landmark },
  { key: "Debit Card Mandate", title: "Debit Card Mandate", icon: CreditCard },
];

export default function MandateSetup() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const studentId = state?.studentId;
  const feeHeadIds = state?.feeHeadIds || [];
  const academicTotal = state?.academicTotal || 0;
  const frequency = state?.frequency || "quarterly";

  const isQuarterly = frequency === "quarterly";
  const n = isQuarterly ? 4 : 2;
  const per = Math.round(academicTotal / n);
  const upfront = academicTotal - per * (n - 1);

  // schedule (upfront + future debits)
  const schedule = useMemo(() => {
    const base = new Date();
    const out = [];
    for (let i = 1; i < n; i++) {
      const d = new Date(base);
      d.setMonth(d.getMonth() + (isQuarterly ? 3 : 6) * i);
      d.setDate(10);
      out.push({
        label: isQuarterly ? `Q${i + 1}` : `Term ${i + 1}`,
        date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        amount: per,
      });
    }
    return out;
  }, [n, per, isQuarterly]);

  const [rail, setRail] = useState("UPI AutoPay");
  const [bankName, setBankName] = useState("");
  const [holder, setHolder] = useState("");
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(null);

  const valid = bankName && holder.trim() && account.trim().length >= 6 && ifsc.trim().length >= 6 && authorized;

  const authorize = async () => {
    if (!studentId || feeHeadIds.length === 0) {
      toast.error("Session expired — please reselect your fees.");
      navigate("/app");
      return;
    }
    if (!valid) {
      toast.error("Please complete bank details and authorization.");
      return;
    }
    setProcessing(true);
    try {
      const { data } = await api.post("/parent/mandate", {
        student_id: studentId,
        fee_head_ids: feeHeadIds,
        frequency,
        rail,
        bank_name: bankName,
        account_holder: holder,
        account_number: account,
        ifsc,
        upfront_mode: "UPI",
      });
      setDone(data);
      toast.success("Mandate authorized — Q1 paid, auto-debits scheduled");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not set up mandate");
    } finally {
      setProcessing(false);
    }
  };

  const freqLabel = isQuarterly
    ? "Quarterly Installment Plan (4 Payments)"
    : "Semi-Annual Installment Plan (2 Payments)";

  return (
    <ParentLayout>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" data-testid="mandate-breadcrumb">
        <button onClick={() => navigate("/app")} className="hover:text-[#2563EB] transition-colors">Fee Payment</button>
        <ChevronRight className="h-4 w-4 text-slate-300" />
        <span>Schedule Selection</span>
        <ChevronRight className="h-4 w-4 text-slate-300" />
        <span className="text-brand-navy font-semibold">Auto-Debit Authorization</span>
      </nav>

      <div className="max-w-2xl">
        {/* Header */}
        <h1 className="font-head text-3xl font-black tracking-tight text-brand-navy">Setup Auto-Debit for Term Payments</h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Authorize eNACH / UPI AutoPay for upcoming term dues. Pre-debit reminders sent 5 days prior to deduction.
        </p>

        {/* Summary container */}
        <div className="mt-6 rounded-2xl bg-[#EFF6FF] border border-[#2563EB]/15 p-6" data-testid="mandate-summary">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
            <p className="font-head font-bold text-brand-navy">{freqLabel}</p>
          </div>

          <div className="mt-5 rounded-xl bg-white border border-[#2563EB]/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[#2563EB] font-semibold">Pay today · {isQuarterly ? "Q1" : "Term 1"}</p>
                <p className="text-xs text-slate-500 mt-1">Payable via UPI / Card now</p>
              </div>
              <span className="font-head text-2xl font-black text-brand-navy">{inr(upfront)}</span>
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.15em] text-slate-500 font-semibold mt-5">
            Scheduled auto-debits · {schedule.length} deduction{schedule.length > 1 ? "s" : ""}
          </p>
          <div className="mt-2 space-y-2">
            {schedule.map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-lg bg-white/70 px-4 py-2.5 text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4 text-[#2563EB]" /> {s.date}
                </span>
                <span className="font-semibold text-brand-navy">{inr(s.amount)}</span>
              </div>
            ))}
            {schedule.length === 0 && <p className="text-sm text-slate-500">No future debits — single payment plan.</p>}
          </div>
        </div>

        {/* Mandate configuration card */}
        <div className="mt-6 bg-white border border-border rounded-2xl p-6 md:p-8 hard-shadow-sm">
          {/* 1. Payment rail selection */}
          <div>
            <p className="font-head font-bold text-brand-navy">Auto-Debit Payment Rail</p>
            <RadioGroup value={rail} onValueChange={setRail} className="mt-4 space-y-3" data-testid="rail-group">
              {RAILS.map((r) => {
                const Icon = r.icon;
                const active = rail === r.key;
                return (
                  <label
                    key={r.key}
                    data-testid={`rail-${r.key.split(" ")[0].toLowerCase()}`}
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                      active ? "border-[#2563EB] bg-[#EFF6FF]" : "border-border hover:border-[#2563EB]/40"
                    }`}
                  >
                    <RadioGroupItem value={r.key} id={r.key} />
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${active ? "bg-[#2563EB] text-white" : "bg-slate-100 text-slate-500"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-brand-navy">{r.title}</span>
                    {r.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5">
                        <Zap className="h-3 w-3" /> {r.badge}
                      </span>
                    )}
                  </label>
                );
              })}
            </RadioGroup>
          </div>

          {/* 2. Bank details */}
          <div className="mt-8">
            <p className="font-head font-bold text-brand-navy">Bank Account Details</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <Label className="text-sm text-brand-navy">Bank Name</Label>
                <Select value={bankName} onValueChange={setBankName}>
                  <SelectTrigger className="rounded-lg mt-1.5" data-testid="bank-select"><SelectValue placeholder="Select bank" /></SelectTrigger>
                  <SelectContent>
                    {BANKS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-1">
                <Label className="text-sm text-brand-navy">Account Holder Name</Label>
                <Input value={holder} onChange={(e) => setHolder(e.target.value)} placeholder="As per bank records"
                  className="rounded-lg mt-1.5" data-testid="holder-input" />
              </div>
              <div className="sm:col-span-1">
                <Label className="text-sm text-brand-navy">Bank Account Number</Label>
                <Input value={account} onChange={(e) => setAccount(e.target.value.replace(/[^0-9]/g, ""))} placeholder="000000000000"
                  className="rounded-lg mt-1.5" inputMode="numeric" data-testid="account-input" />
              </div>
              <div className="sm:col-span-1">
                <Label className="text-sm text-brand-navy">IFSC Code</Label>
                <Input value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} placeholder="HDFC0001234"
                  className="rounded-lg mt-1.5" data-testid="ifsc-input" />
              </div>
            </div>
          </div>

          {/* 3. Penny drop callout */}
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/15 p-4" data-testid="penny-drop-callout">
            <div className="h-8 w-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <p className="text-sm text-brand-navy leading-relaxed">
              <b>₹1 Penny Drop</b> validation will be initiated to confirm bank account ownership.
            </p>
          </div>

          {/* 4. Authorization checkbox */}
          <label className="mt-5 flex items-start gap-3 cursor-pointer" data-testid="authorize-checkbox-label">
            <Checkbox checked={authorized} onCheckedChange={(v) => setAuthorized(!!v)} className="mt-0.5" data-testid="authorize-checkbox" />
            <span className="text-sm text-slate-600 leading-relaxed">
              I authorize Biglyp to initiate scheduled term debits as per the academic fee calendar.
            </span>
          </label>

          {/* 5. CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={authorize}
              disabled={!valid || processing}
              data-testid="authorize-mandate-btn"
              className="h-12 px-6 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold flex-1"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              {processing ? "Authorizing..." : `Authorize Mandate & Pay ${isQuarterly ? "Q1" : "Term 1"} Fees`}
            </Button>
            <Button
              onClick={() => navigate("/app")}
              variant="outline"
              data-testid="mandate-cancel-btn"
              className="h-12 px-6 rounded-lg border-border text-slate-600 font-semibold"
            >
              Cancel
            </Button>
          </div>

          {/* 6. Trust badges */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 border-t border-border pt-5">
            <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-[#2563EB]" /> NPCI Certified</span>
            <span className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-[#2563EB]" /> 256-Bit Bank Grade Security</span>
          </div>
        </div>

        <button onClick={() => navigate("/app")} className="mt-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#2563EB] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Fee Payment
        </button>
      </div>

      {/* Success dialog */}
      <Dialog open={!!done} onOpenChange={() => { setDone(null); navigate("/app/history"); }}>
        <DialogContent className="rounded-2xl">
          <DialogHeader className="sr-only"><DialogTitle>Mandate authorized</DialogTitle></DialogHeader>
          <div className="text-center py-4">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-head font-bold text-brand-navy text-xl mt-4">Mandate authorized</h3>
            <p className="text-sm text-slate-500 mt-1">Mandate {done?.mandate?.id}</p>
            <div className="bg-slate-50 rounded-xl p-4 mt-5 text-left text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-500">Rail</span><span className="font-medium">{done?.mandate?.rail}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Paid now</span><span className="font-medium">{inr(done?.mandate?.upfront_amount)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Upcoming debits</span><span className="font-medium">{(done?.mandate?.installments || 1) - 1} × {inr(done?.mandate?.installment_amount)}</span></div>
            </div>
            <Button onClick={() => { setDone(null); navigate("/app/history"); }} className="w-full mt-5 h-11 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8]" data-testid="mandate-done-btn">
              View in Payment History
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ParentLayout>
  );
}
