import { useEffect, useMemo, useRef, useState } from "react";
import api, { inr } from "@/lib/api";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ShieldCheck, Check, ArrowRight, ArrowLeft, Fingerprint, ScanFace,
  Camera, Landmark, Smartphone, CreditCard, Lock, BadgeCheck, Zap,
  CheckCircle2, Loader2, Calendar, FileSignature, ShieldQuestion,
} from "lucide-react";

const STEPS = [
  { n: 1, label: "Plan" },
  { n: 2, label: "Eligibility" },
  { n: 3, label: "Digital KYC" },
  { n: 4, label: "Bank Setup" },
  { n: 5, label: "e-Sign" },
];
const SUBTITLES = {
  1: "Choose Your 0% EMI Plan",
  2: "Instant Eligibility Pre-Check",
  3: "Digital Identity Verification (KYC)",
  4: "Auto-Debit Bank Setup",
  5: "Review & e-Sign Agreement",
};
const BANKS = [
  "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank",
  "Punjab National Bank", "Bank of Baroda", "Yes Bank", "IndusInd Bank", "Canara Bank",
];
const RAILS = [
  { key: "UPI AutoPay", title: "UPI AutoPay (Google Pay, PhonePe, Paytm)", icon: Smartphone, badge: "Recommended" },
  { key: "Net Banking eNACH", title: "Net Banking eNACH", icon: Landmark },
  { key: "Debit Card Mandate", title: "Debit Card Mandate", icon: CreditCard },
];
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function FinancingWizard({ open, onOpenChange, studentId, feeHeadIds, academicTotal, onSuccess }) {
  const [step, setStep] = useState(1);

  // Step 1 — plan
  const [down, setDown] = useState(0);
  const [tenure, setTenure] = useState(12);
  const [preview, setPreview] = useState(null);

  // Step 2 — eligibility
  const [eligConsent, setEligConsent] = useState(false);

  // Step 3 — KYC
  const [pan, setPan] = useState("");
  const [dob, setDob] = useState("");
  const [income, setIncome] = useState("");
  const [employment, setEmployment] = useState("Salaried");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [liveness, setLiveness] = useState("idle"); // idle | checking | done
  const [camOn, setCamOn] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Step 4 — bank
  const [rail, setRail] = useState("UPI AutoPay");
  const [bankName, setBankName] = useState("");
  const [holder, setHolder] = useState("");
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");

  // Step 5 — esign
  const [esignSent, setEsignSent] = useState(false);
  const [esignOtp, setEsignOtp] = useState("");
  const [agree, setAgree] = useState(false);

  const [processing, setProcessing] = useState(false);

  // reset on open
  useEffect(() => {
    if (open) {
      setStep(1); setDown(0); setTenure(12); setPreview(null);
      setEligConsent(false);
      setPan(""); setDob(""); setIncome(""); setEmployment("Salaried");
      setOtpSent(false); setOtp(""); setAadhaarVerified(false); setLiveness("idle");
      setRail("UPI AutoPay"); setBankName(""); setHolder(""); setAccount(""); setIfsc("");
      setEsignSent(false); setEsignOtp(""); setAgree(false); setProcessing(false);
    }
  }, [open]);

  // plan preview
  useEffect(() => {
    if (!open || !academicTotal) return;
    api.post("/parent/financing/preview", { amount: academicTotal, down_payment: down, tenure })
      .then(({ data }) => setPreview(data));
  }, [open, down, tenure, academicTotal]);

  // camera lifecycle
  const stopCam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCamOn(false);
  };
  useEffect(() => () => stopCam(), []);
  useEffect(() => { if (step !== 3) stopCam(); }, [step]);

  const startCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCamOn(true);
    } catch {
      toast.info("Camera unavailable — using simulated liveness check.");
      setCamOn(false);
    }
  };
  const captureLiveness = () => {
    setLiveness("checking");
    setTimeout(() => { setLiveness("done"); stopCam(); }, 1600);
  };
  const sendOtp = () => { setOtpSent(true); toast.success("OTP sent to Aadhaar-linked mobile (simulated)"); };
  const verifyOtp = () => {
    if (otp.trim().length < 4) { toast.error("Enter the 6-digit code"); return; }
    setAadhaarVerified(true); toast.success("Aadhaar identity verified");
  };
  const sendEsign = () => { setEsignSent(true); toast.success("e-Sign OTP sent (simulated)"); };

  // per-step validity
  const canContinue = useMemo(() => {
    if (step === 1) return !!preview;
    if (step === 2) return eligConsent;
    if (step === 3) return PAN_RE.test(pan) && dob && Number(income) > 0 && employment && aadhaarVerified && liveness === "done";
    if (step === 4) return bankName && holder.trim() && account.trim().length >= 6 && ifsc.trim().length >= 6;
    if (step === 5) return agree && esignSent && esignOtp.trim().length >= 4;
    return false;
  }, [step, preview, eligConsent, pan, dob, income, employment, aadhaarVerified, liveness, bankName, holder, account, ifsc, agree, esignSent, esignOtp]);

  const next = () => {
    if (!canContinue) { toast.error("Please complete this step to continue."); return; }
    if (step < 5) setStep((s) => s + 1);
    else activate();
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const activate = async () => {
    setProcessing(true);
    try {
      const { data } = await api.post("/parent/pay-financing", {
        student_id: studentId, fee_head_ids: feeHeadIds, tenure, down_payment: down,
      });
      onOpenChange(false);
      onSuccess?.(data);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not activate financing");
    } finally {
      setProcessing(false);
    }
  };

  const employmentIsSelf = employment === "Self-Employed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-2xl p-0 overflow-hidden gap-0">
        {/* Header */}
        <DialogHeader className="px-6 md:px-8 pt-6 pb-5 border-b border-border">
          <DialogTitle className="font-head text-lg text-brand-navy flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#2563EB]" /> 0% Interest Fee Financing Application
          </DialogTitle>
          {/* step progress bar */}
          <div className="mt-5 flex items-center" data-testid="wizard-stepper">
            {STEPS.map((s, i) => {
              const done = s.n < step;
              const active = s.n === step;
              return (
                <div key={s.n} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      done ? "bg-[#2563EB] text-white" : active ? "bg-[#2563EB] text-white ring-4 ring-[#EFF6FF]" : "bg-slate-100 text-slate-400"
                    }`}>
                      {done ? <Check className="h-4 w-4" /> : s.n}
                    </span>
                    <span className={`text-xs font-semibold hidden sm:inline ${active ? "text-[#2563EB]" : done ? "text-brand-navy" : "text-slate-400"}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 rounded-full ${done ? "bg-[#2563EB]" : "bg-slate-100"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-brand-navy font-semibold" data-testid="wizard-subtitle">
            Step {step}: {SUBTITLES[step]}
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 md:px-8 py-6 max-h-[58vh] overflow-y-auto">
          {/* ---------- Step 1: Plan ---------- */}
          {step === 1 && (
            <div className="space-y-5" data-testid="step-plan">
              <p className="text-sm text-slate-500">Split <b className="text-brand-navy">{inr(academicTotal)}</b> of academic fees into zero-interest monthly EMIs. Your school is paid 100% upfront.</p>
              <div>
                <Label className="text-sm text-brand-navy">Down payment (optional)</Label>
                <Input type="number" value={down} data-testid="wiz-down"
                  onChange={(e) => setDown(Math.max(0, Math.min(academicTotal, Number(e.target.value))))}
                  className="rounded-lg mt-1.5" />
              </div>
              <div>
                <Label className="text-sm text-brand-navy flex justify-between"><span>Tenure</span><span>{tenure} months</span></Label>
                <Slider value={[tenure]} min={3} max={12} step={1} onValueChange={(v) => setTenure(v[0])} className="mt-3" data-testid="wiz-tenure" />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1"><span>3 months</span><span>12 months</span></div>
              </div>
              {preview && (
                <div className="bg-[#EFF6FF] rounded-xl p-4 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Financed amount</span><span className="font-semibold">{inr(preview.financed_amount)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Monthly EMI</span><span className="font-head font-bold text-[#2563EB] text-lg">{inr(preview.emi)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Interest</span><span className="font-semibold text-green-600">0%</span></div>
                </div>
              )}
            </div>
          )}

          {/* ---------- Step 2: Eligibility ---------- */}
          {step === 2 && (
            <div className="space-y-5" data-testid="step-eligibility">
              <div className="rounded-xl bg-[#EFF6FF] border border-[#2563EB]/15 p-4 flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0"><Zap className="h-4 w-4" /></div>
                <div>
                  <p className="font-semibold text-brand-navy text-sm">You are pre-qualified for 0% EMI</p>
                  <p className="text-xs text-slate-500 mt-0.5">A soft eligibility check with no impact on your credit score.</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {["Zero interest, zero hidden charges", "No impact on credit score for eligibility check", "Instant digital approval — no paperwork", "Powered by RBI-regulated NBFC lending partners"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <label className="flex items-start gap-3 cursor-pointer" data-testid="elig-consent-label">
                <Checkbox checked={eligConsent} onCheckedChange={(v) => setEligConsent(!!v)} className="mt-0.5" data-testid="elig-consent" />
                <span className="text-sm text-slate-600 leading-relaxed">I consent to a soft eligibility check and to sharing my details with the Biglyp NBFC lending partner.</span>
              </label>
            </div>
          )}

          {/* ---------- Step 3: Digital KYC ---------- */}
          {step === 3 && (
            <div className="space-y-5" data-testid="step-kyc">
              {/* PAN & income */}
              <div className="rounded-xl border border-border p-4">
                <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><Fingerprint className="h-4 w-4 text-[#2563EB]" /> PAN &amp; Income Pre-Approval</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-brand-navy">PAN Card Number</Label>
                    <Input value={pan} onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))} placeholder="ABCDE1234F"
                      className="rounded-lg mt-1.5 uppercase" data-testid="kyc-pan" />
                    {pan && !PAN_RE.test(pan) && <p className="text-[11px] text-red-500 mt-1">Format: ABCDE1234F</p>}
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Date of Birth</Label>
                    <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="rounded-lg mt-1.5" data-testid="kyc-dob" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Net Monthly Income</Label>
                    <Input type="number" value={income} onChange={(e) => setIncome(e.target.value.replace(/[^0-9]/g, ""))} placeholder="60000"
                      className="rounded-lg mt-1.5" inputMode="numeric" data-testid="kyc-income" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Employment Type</Label>
                    <Select value={employment} onValueChange={setEmployment}>
                      <SelectTrigger className="rounded-lg mt-1.5" data-testid="kyc-employment"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Salaried">Salaried</SelectItem>
                        <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      </SelectContent>
                    </Select>
                    {employmentIsSelf && <p className="text-[11px] text-slate-400 mt-1">Business vintage may be verified.</p>}
                  </div>
                </div>
              </div>

              {/* Aadhaar */}
              <div className="rounded-xl border border-border p-4">
                <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><ScanFace className="h-4 w-4 text-[#2563EB]" /> Instant Digital Identity Check</p>
                <p className="text-xs text-slate-500 mt-1">Authorize fast identity verification via Aadhaar-linked OTP / DigiLocker.</p>
                {aadhaarVerified ? (
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-600" data-testid="aadhaar-verified">
                    <CheckCircle2 className="h-5 w-5" /> Aadhaar identity verified
                  </div>
                ) : !otpSent ? (
                  <Button variant="outline" onClick={sendOtp} data-testid="send-otp-btn"
                    className="mt-3 h-10 rounded-lg border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] font-semibold">
                    Send Verification Code
                  </Button>
                ) : (
                  <div className="mt-3 flex items-end gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-brand-navy">Enter OTP</Label>
                      <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} placeholder="6-digit code"
                        className="rounded-lg mt-1.5" inputMode="numeric" data-testid="otp-input" />
                    </div>
                    <Button onClick={verifyOtp} data-testid="verify-otp-btn" className="h-10 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] font-semibold">Verify</Button>
                  </div>
                )}
              </div>

              {/* Liveness */}
              <div className="rounded-xl border border-border p-4">
                <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><Camera className="h-4 w-4 text-[#2563EB]" /> Live Liveness Verification</p>
                <div className="mt-4 flex flex-col items-center">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-dashed border-[#2563EB]/40 bg-slate-50 flex items-center justify-center" data-testid="liveness-frame">
                    {camOn && liveness !== "done" ? (
                      <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                    ) : liveness === "done" ? (
                      <div className="flex flex-col items-center text-green-600">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                    ) : liveness === "checking" ? (
                      <Loader2 className="h-10 w-10 text-[#2563EB] animate-spin" />
                    ) : (
                      <ScanFace className="h-12 w-12 text-slate-300" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    {liveness === "done" ? "Liveness verified" : "Position face within the frame"}
                  </p>
                  {liveness !== "done" && (
                    <div className="mt-3 flex gap-2">
                      {!camOn && liveness === "idle" && (
                        <Button variant="outline" onClick={startCam} data-testid="start-cam-btn" className="h-9 rounded-lg border-border text-slate-600 font-semibold">
                          <Camera className="h-4 w-4 mr-1.5" /> Start Camera
                        </Button>
                      )}
                      <Button onClick={captureLiveness} disabled={liveness === "checking"} data-testid="capture-liveness-btn"
                        className="h-9 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] font-semibold">
                        {liveness === "checking" ? "Verifying..." : "Capture Selfie & Verify"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Compliance note */}
              <div className="flex items-start gap-2 text-xs text-slate-500 rounded-lg bg-slate-50 p-3" data-testid="kyc-compliance">
                <Lock className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                Data transmitted via encrypted RBI-regulated NBFC lending partner rails. Zero manual paperwork.
              </div>
            </div>
          )}

          {/* ---------- Step 4: Bank Setup ---------- */}
          {step === 4 && (
            <div className="space-y-5" data-testid="step-bank">
              <p className="text-sm text-slate-500">Set up auto-debit for your monthly EMIs. Pre-debit reminders sent 5 days prior.</p>
              <RadioGroup value={rail} onValueChange={setRail} className="space-y-3" data-testid="wiz-rail-group">
                {RAILS.map((r) => {
                  const Icon = r.icon; const active = rail === r.key;
                  return (
                    <label key={r.key} data-testid={`wiz-rail-${r.key.split(" ")[0].toLowerCase()}`}
                      className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${active ? "border-[#2563EB] bg-[#EFF6FF]" : "border-border hover:border-[#2563EB]/40"}`}>
                      <RadioGroupItem value={r.key} />
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${active ? "bg-[#2563EB] text-white" : "bg-slate-100 text-slate-500"}`}><Icon className="h-4 w-4" /></div>
                      <span className="flex-1 text-sm font-medium text-brand-navy">{r.title}</span>
                      {r.badge && <span className="rounded-full bg-[#2563EB] text-white text-[10px] font-bold px-2 py-0.5">{r.badge}</span>}
                    </label>
                  );
                })}
              </RadioGroup>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-brand-navy">Bank Name</Label>
                  <Select value={bankName} onValueChange={setBankName}>
                    <SelectTrigger className="rounded-lg mt-1.5" data-testid="wiz-bank"><SelectValue placeholder="Select bank" /></SelectTrigger>
                    <SelectContent>{BANKS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-brand-navy">Account Holder Name</Label>
                  <Input value={holder} onChange={(e) => setHolder(e.target.value)} className="rounded-lg mt-1.5" data-testid="wiz-holder" />
                </div>
                <div>
                  <Label className="text-sm text-brand-navy">Bank Account Number</Label>
                  <Input value={account} onChange={(e) => setAccount(e.target.value.replace(/[^0-9]/g, ""))} className="rounded-lg mt-1.5" inputMode="numeric" data-testid="wiz-account" />
                </div>
                <div>
                  <Label className="text-sm text-brand-navy">IFSC Code</Label>
                  <Input value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} className="rounded-lg mt-1.5" data-testid="wiz-ifsc" />
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-500 rounded-lg bg-[#EFF6FF] p-3">
                <ShieldCheck className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" /> <b className="text-brand-navy">₹1 Penny Drop</b>&nbsp;validation confirms bank account ownership.
              </div>
            </div>
          )}

          {/* ---------- Step 5: e-Sign ---------- */}
          {step === 5 && (
            <div className="space-y-5" data-testid="step-esign">
              <div className="rounded-xl border border-border p-4 text-sm space-y-2">
                <p className="font-head font-bold text-brand-navy flex items-center gap-2"><FileSignature className="h-4 w-4 text-[#2563EB]" /> Loan Agreement Summary</p>
                <div className="flex justify-between"><span className="text-slate-500">Financed amount</span><span className="font-semibold">{inr(preview?.financed_amount || 0)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Tenure</span><span className="font-semibold">{tenure} months</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Monthly EMI</span><span className="font-semibold text-[#2563EB]">{inr(preview?.emi || 0)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Interest</span><span className="font-semibold text-green-600">0%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Repayment</span><span className="font-semibold">{rail}</span></div>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><ShieldQuestion className="h-4 w-4 text-[#2563EB]" /> Aadhaar e-Sign</p>
                <p className="text-xs text-slate-500 mt-1">Digitally sign the loan agreement via Aadhaar OTP e-Sign.</p>
                {!esignSent ? (
                  <Button variant="outline" onClick={sendEsign} data-testid="send-esign-btn" className="mt-3 h-10 rounded-lg border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] font-semibold">
                    Send e-Sign OTP
                  </Button>
                ) : (
                  <div className="mt-3">
                    <Label className="text-xs text-brand-navy">e-Sign OTP</Label>
                    <Input value={esignOtp} onChange={(e) => setEsignOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} placeholder="6-digit code"
                      className="rounded-lg mt-1.5 max-w-[200px]" inputMode="numeric" data-testid="esign-otp" />
                  </div>
                )}
              </div>
              <label className="flex items-start gap-3 cursor-pointer" data-testid="esign-agree-label">
                <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} className="mt-0.5" data-testid="esign-agree" />
                <span className="text-sm text-slate-600 leading-relaxed">I have read and agree to the 0% EMI loan agreement, repayment schedule and auto-debit mandate.</span>
              </label>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 border-t border-border pt-4">
                <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-[#2563EB]" /> RBI-regulated NBFC</span>
                <span className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-[#2563EB]" /> 256-Bit Encryption</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 md:px-8 py-4 border-t border-border flex items-center justify-between gap-3 bg-white">
          <Button variant="outline" onClick={back} disabled={step === 1 || processing} data-testid="wiz-back"
            className="h-11 rounded-lg border-border text-slate-600 font-semibold">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
          </Button>
          <Button onClick={next} disabled={!canContinue || processing} data-testid="wiz-next"
            className="h-11 px-6 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold">
            {processing ? "Activating..."
              : step === 3 ? <>Continue to Bank Setup <ArrowRight className="h-4 w-4 ml-1.5" /></>
              : step === 5 ? <><ShieldCheck className="h-4 w-4 mr-1.5" /> Authorize &amp; Activate 0% EMI</>
              : <>Continue <ArrowRight className="h-4 w-4 ml-1.5" /></>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
