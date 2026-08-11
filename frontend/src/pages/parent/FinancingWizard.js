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
  Gauge, TrendingUp, XCircle, RefreshCw,
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

export function FinancingWizard({ open, onOpenChange, studentId, studentName, studentGrade, feeHeadIds, academicTotal, onSuccess }) {
  const [step, setStep] = useState(1);

  // Step 1 — plan
  const [payMode, setPayMode] = useState("emi"); // emi | lump
  const [down, setDown] = useState(0);
  const [tenure, setTenure] = useState(12);
  const [preview, setPreview] = useState(null);

  // Step 2 — eligibility + CIBIL check
  const [eligConsent, setEligConsent] = useState(false);
  const [cibilPan, setCibilPan] = useState("");
  const [cibilChecking, setCibilChecking] = useState(false);
  const [cibilResult, setCibilResult] = useState(null); // {score, band, band_color, approved, max_eligible, factors, decision, pan_masked}
  const [scoreAnim, setScoreAnim] = useState(0);

  // Step 3 — KYC — Applicant Basic Details (GrayQuest Step 1)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [email, setEmail] = useState("");
  const [pan, setPan] = useState("");
  const [dob, setDob] = useState("");
  // Step 3 — Applicant Residential Details (GrayQuest Step 2)
  const [residenceType, setResidenceType] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [locality, setLocality] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [addrState, setAddrState] = useState("");
  // Step 3 — Employment Details (GrayQuest Step 3)
  const [income, setIncome] = useState("");
  const [employment, setEmployment] = useState("Salaried");
  const [companyName, setCompanyName] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  // Step 3 — Student Details (GrayQuest Step 4)
  const [studFirstName, setStudFirstName] = useState("");
  const [studLastName, setStudLastName] = useState("");
  const [studType, setStudType] = useState("");
  const [studClass, setStudClass] = useState("");
  // Aadhaar + liveness
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
      setStep(1); setPayMode("emi"); setDown(0); setTenure(12); setPreview(null);
      setEligConsent(false);
      setCibilPan(""); setCibilChecking(false); setCibilResult(null); setScoreAnim(0);
      setFirstName(""); setLastName(""); setFatherName(""); setGender(""); setMaritalStatus(""); setEmail("");
      setPan(""); setDob("");
      setResidenceType(""); setAddressLine1(""); setLocality(""); setPincode(""); setCity(""); setAddrState("");
      setIncome(""); setEmployment("Salaried"); setCompanyName(""); setWorkExperience("");
      // Prefill student first/last from parent-provided name
      const parts = (studentName || "").trim().split(/\s+/);
      setStudFirstName(parts[0] || "");
      setStudLastName(parts.slice(1).join(" ") || "");
      setStudType(""); setStudClass(studentGrade || "");
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

  // CIBIL check (Step 2)
  const runCibilCheck = async () => {
    if (!PAN_RE.test(cibilPan)) { toast.error("Enter a valid PAN (e.g. ABCDE1234F)"); return; }
    if (!eligConsent) { toast.error("Please provide consent for the soft credit check"); return; }
    setCibilChecking(true);
    setCibilResult(null);
    setScoreAnim(0);
    try {
      // small delay so user sees the check happening
      const [{ data }] = await Promise.all([
        api.post("/parent/cibil-check", { pan: cibilPan.toUpperCase(), consent: true }),
        new Promise((r) => setTimeout(r, 1400)),
      ]);
      setCibilResult(data);
      // Prefill the KYC PAN with the CIBIL-verified PAN so the parent doesn't retype it.
      setPan(cibilPan.toUpperCase());
      toast.success(data.approved ? "Pre-approved for 0% EMI" : "Eligibility check completed");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not run the eligibility check");
    } finally {
      setCibilChecking(false);
    }
  };

  // animate the CIBIL score meter from 0 -> score whenever a new result arrives
  useEffect(() => {
    if (!cibilResult) { setScoreAnim(0); return; }
    const target = cibilResult.score;
    let start = 0;
    const step = Math.max(4, Math.round(target / 40));
    const id = setInterval(() => {
      start = Math.min(target, start + step);
      setScoreAnim(start);
      if (start >= target) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [cibilResult]);

  // Pincode auto-fill (deterministic mock — pincode-first-3 maps to city/state)
  useEffect(() => {
    if (!/^\d{6}$/.test(pincode)) return;
    // Deterministic simulated PIN → City/State — covers common ranges
    const p = parseInt(pincode.slice(0, 3), 10);
    let c = "Mumbai", s = "Maharashtra";
    if (p >= 110 && p <= 140) { c = "New Delhi"; s = "Delhi"; }
    else if (p >= 400 && p <= 445) { c = "Mumbai"; s = "Maharashtra"; }
    else if (p >= 500 && p <= 535) { c = "Hyderabad"; s = "Telangana"; }
    else if (p >= 560 && p <= 583) { c = "Bengaluru"; s = "Karnataka"; }
    else if (p >= 600 && p <= 643) { c = "Chennai"; s = "Tamil Nadu"; }
    else if (p >= 700 && p <= 743) { c = "Kolkata"; s = "West Bengal"; }
    else if (p >= 380 && p <= 396) { c = "Ahmedabad"; s = "Gujarat"; }
    else if (p >= 411 && p <= 415) { c = "Pune"; s = "Maharashtra"; }
    setCity(c);
    setAddrState(s);
  }, [pincode]);

  // per-step validity
  const canContinue = useMemo(() => {
    if (step === 1) return !!preview;
    if (step === 2) return eligConsent && cibilResult && cibilResult.approved;
    if (step === 3) return (
      // Applicant Basic
      firstName.trim() && lastName.trim() && fatherName.trim() && gender && maritalStatus &&
      email.trim() && /^\S+@\S+\.\S+$/.test(email) &&
      PAN_RE.test(pan) && dob &&
      // Residential
      residenceType && addressLine1.trim() && locality.trim() && /^\d{6}$/.test(pincode) && city && addrState &&
      // Employment
      companyName.trim() && workExperience && Number(income) > 0 && employment &&
      // Student
      studFirstName.trim() && studLastName.trim() && studType && studClass &&
      // Aadhaar + liveness
      aadhaarVerified && liveness === "done"
    );
    if (step === 4) return bankName && holder.trim() && account.trim().length >= 6 && ifsc.trim().length >= 6;
    if (step === 5) return agree && esignSent && esignOtp.trim().length >= 4;
    return false;
  }, [step, preview, eligConsent, cibilResult, firstName, lastName, fatherName, gender, maritalStatus, email, pan, dob, residenceType, addressLine1, locality, pincode, city, addrState, companyName, workExperience, income, employment, studFirstName, studLastName, studType, studClass, aadhaarVerified, liveness, bankName, holder, account, ifsc, agree, esignSent, esignOtp]);

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

  // (employmentIsSelf was previously used in the KYC step's employment note; retained as reference)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-2xl p-0 overflow-hidden gap-0">
        {/* Header */}
        <DialogHeader className="px-6 md:px-8 pt-6 pb-5 border-b border-border">
          <DialogTitle className="font-head text-lg text-brand-navy flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#5548D1]" /> 0% Interest Fee Financing Application
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
                      done ? "bg-[#5548D1] text-white" : active ? "bg-[#5548D1] text-white ring-4 ring-[#EEF0FF]" : "bg-slate-100 text-slate-400"
                    }`}>
                      {done ? <Check className="h-4 w-4" /> : s.n}
                    </span>
                    <span className={`text-xs font-semibold hidden sm:inline ${active ? "text-[#5548D1]" : done ? "text-brand-navy" : "text-slate-400"}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 rounded-full ${done ? "bg-[#5548D1]" : "bg-slate-100"}`} />
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
              <p className="text-sm text-slate-500">Choose how you want to pay <b className="text-brand-navy">{inr(academicTotal)}</b>. Your school is paid 100% upfront either way.</p>

              {/* EMI vs Lumpsum plan chooser (GrayQuest parity) */}
              <div className="grid sm:grid-cols-2 gap-3" data-testid="plan-mode-chooser">
                <button type="button" onClick={() => setPayMode("emi")} data-testid="plan-mode-emi"
                  className={`text-left rounded-xl border p-4 transition-colors ${payMode === "emi" ? "border-[#5548D1] bg-[#EEF0FF] ring-1 ring-[#5548D1]" : "border-border bg-white hover:border-[#5548D1]/40"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-[#5548D1]">Option A</p>
                      <p className="font-head text-[15px] font-black text-brand-navy leading-tight mt-1">Pay full-year fees in EMIs</p>
                      <p className="text-[11.5px] text-slate-500 mt-1">Small, convenient monthly payments</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">0% Interest</span>
                  </div>
                  {preview && (
                    <p className="mt-3 font-head text-2xl font-black text-brand-navy">
                      {inr(preview.emi)}
                      <span className="text-[11px] font-semibold text-slate-500 ml-1">/ month</span>
                    </p>
                  )}
                </button>
                <button type="button" onClick={() => setPayMode("lump")} data-testid="plan-mode-lump"
                  className={`text-left rounded-xl border p-4 transition-colors ${payMode === "lump" ? "border-[#5548D1] bg-[#EEF0FF] ring-1 ring-[#5548D1]" : "border-border bg-white hover:border-[#5548D1]/40"}`}>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#5548D1]">Option B</p>
                    <p className="font-head text-[15px] font-black text-brand-navy leading-tight mt-1">Pay full year upfront</p>
                    <p className="text-[11.5px] text-slate-500 mt-1">UPI, Credit/Debit Card or Net Banking</p>
                  </div>
                  <p className="mt-3 font-head text-2xl font-black text-brand-navy">
                    {inr(academicTotal)}
                    <span className="text-[11px] font-semibold text-slate-500 ml-1">today</span>
                  </p>
                </button>
              </div>
              {payMode === "lump" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2.5 text-xs text-amber-800" data-testid="plan-lump-note">
                  <Zap className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>Full upfront pay is available on the standard checkout. Close this wizard and use the &quot;Pay Full Amount&quot; option to continue via UPI / Card / Net Banking.</span>
                </div>
              )}

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
                <div className="bg-[#EEF0FF] rounded-xl p-4 space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Financed amount</span><span className="font-semibold">{inr(preview.financed_amount)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Monthly EMI</span><span className="font-head font-bold text-[#5548D1] text-lg">{inr(preview.emi)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Interest</span><span className="font-semibold text-green-600">0%</span></div>
                </div>
              )}
            </div>
          )}

          {/* ---------- Step 2: Eligibility (with CIBIL check) ---------- */}
          {step === 2 && (
            <div className="space-y-5" data-testid="step-eligibility">
              <div className="rounded-xl bg-[#EEF0FF] border border-[#5548D1]/15 p-4 flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#5548D1] text-white flex items-center justify-center shrink-0"><Zap className="h-4 w-4" /></div>
                <div>
                  <p className="font-semibold text-brand-navy text-sm">Instant CIBIL Eligibility Pre-Check</p>
                  <p className="text-xs text-slate-500 mt-0.5">Soft credit pull via CIBIL (TransUnion) — no impact on your credit score.</p>
                </div>
              </div>

              {/* PAN input for CIBIL pull */}
              <div className="rounded-xl border border-border p-4">
                <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-[#5548D1]" /> Verify your CIBIL Score
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Enter the PAN of the primary applicant. We fetch your CIBIL score securely from the bureau.
                </p>
                <div className="mt-4 grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                  <div>
                    <Label className="text-sm text-brand-navy">PAN Card Number</Label>
                    <Input
                      value={cibilPan}
                      onChange={(e) => { setCibilPan(e.target.value.toUpperCase().slice(0, 10)); setCibilResult(null); }}
                      placeholder="ABCDE1234F"
                      className="rounded-lg mt-1.5 uppercase tracking-wider"
                      data-testid="cibil-pan"
                      disabled={cibilChecking}
                    />
                    {cibilPan && !PAN_RE.test(cibilPan) && (
                      <p className="text-[11px] text-red-500 mt-1">Format: ABCDE1234F</p>
                    )}
                  </div>
                  <Button
                    onClick={runCibilCheck}
                    disabled={!PAN_RE.test(cibilPan) || !eligConsent || cibilChecking}
                    data-testid="cibil-check-btn"
                    className="h-10 rounded-lg bg-[#5548D1] hover:bg-[#3F35A8] font-semibold px-4"
                  >
                    {cibilChecking ? (
                      <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Checking...</>
                    ) : cibilResult ? (
                      <><RefreshCw className="h-4 w-4 mr-1.5" /> Re-check</>
                    ) : (
                      <><Gauge className="h-4 w-4 mr-1.5" /> Check CIBIL Score</>
                    )}
                  </Button>
                </div>

                {/* Consent (must be checked before running) */}
                <label className="flex items-start gap-3 cursor-pointer mt-4" data-testid="elig-consent-label">
                  <Checkbox
                    checked={eligConsent}
                    onCheckedChange={(v) => setEligConsent(!!v)}
                    className="mt-0.5"
                    data-testid="elig-consent"
                    disabled={cibilChecking}
                  />
                  <span className="text-sm text-slate-600 leading-relaxed">
                    I authorize Biglyp &amp; its NBFC lending partner to fetch my CIBIL score via a <b>soft pull</b> for eligibility.
                    This will <b>not</b> impact my credit score.
                  </span>
                </label>
              </div>

              {/* CIBIL Result */}
              {cibilChecking && !cibilResult && (
                <div className="rounded-xl border border-dashed border-[#5548D1]/40 p-6 flex items-center gap-4" data-testid="cibil-checking">
                  <Loader2 className="h-8 w-8 text-[#5548D1] animate-spin" />
                  <div>
                    <p className="font-head font-bold text-brand-navy text-sm">Fetching your CIBIL score…</p>
                    <p className="text-xs text-slate-500 mt-0.5">Securely connecting to CIBIL (TransUnion) via RBI-regulated NBFC rails.</p>
                  </div>
                </div>
              )}

              {cibilResult && (
                <div
                  className={`rounded-xl border p-5 space-y-4 ${cibilResult.approved ? "border-emerald-200 bg-emerald-50/40" : "border-red-200 bg-red-50/40"}`}
                  data-testid="cibil-result"
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-center">
                    {/* Score gauge */}
                    <CibilGauge score={scoreAnim} target={cibilResult.score} band={cibilResult.band} color={cibilResult.band_color} />
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        {cibilResult.approved
                          ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          : <XCircle className="h-5 w-5 text-red-500" />}
                        <p className={`font-head font-bold text-base ${cibilResult.approved ? "text-emerald-700" : "text-red-600"}`}>
                          {cibilResult.approved ? "Pre-approved for 0% EMI" : "Not eligible right now"}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{cibilResult.decision}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-white border border-border px-2.5 py-2">
                          <p className="text-slate-400">PAN</p>
                          <p className="font-mono font-semibold text-brand-navy tracking-wider">{cibilResult.pan_masked}</p>
                        </div>
                        <div className="rounded-lg bg-white border border-border px-2.5 py-2">
                          <p className="text-slate-400">Max eligible</p>
                          <p className="font-head font-bold text-brand-navy">
                            {cibilResult.max_eligible > 0 ? inr(cibilResult.max_eligible) : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score factors */}
                  <div className="grid grid-cols-2 gap-2">
                    {cibilResult.factors.map((f) => (
                      <div key={f.label} className="flex items-center gap-2 rounded-lg bg-white border border-border px-2.5 py-2">
                        {f.status === "positive"
                          ? <TrendingUp className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          : <Gauge className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
                        <span className="text-[11px] text-slate-600 truncate">{f.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 border-t border-border/60 pt-3">
                    <span className="flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5 text-[#5548D1]" /> {cibilResult.bureau}</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-[#5548D1]" /> {cibilResult.pull_type}</span>
                  </div>
                </div>
              )}

              <ul className="space-y-2 pt-1">
                {["Zero interest, zero hidden charges", "Powered by RBI-regulated NBFC lending partners", "Instant digital approval — no paperwork"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ---------- Step 3: Digital KYC ---------- */}
          {step === 3 && (
            <div className="space-y-5" data-testid="step-kyc">
              {/* Section A — Applicant Basic Details */}
              <div className="rounded-xl border border-border p-4">
                <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><Fingerprint className="h-4 w-4 text-[#5548D1]" /> Applicant / Parent Basic Details</p>
                <p className="text-[11px] text-slate-500 mt-0.5">As per PAN card records.</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-brand-navy">First Name</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Sachin" className="rounded-lg mt-1.5" data-testid="kyc-first-name" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Last Name</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Tendulkar" className="rounded-lg mt-1.5" data-testid="kyc-last-name" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Father&apos;s First Name</Label>
                    <Input value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Ramesh" className="rounded-lg mt-1.5" data-testid="kyc-father-name" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Date of Birth</Label>
                    <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="rounded-lg mt-1.5" data-testid="kyc-dob" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="rounded-lg mt-1.5" data-testid="kyc-gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Marital Status</Label>
                    <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                      <SelectTrigger className="rounded-lg mt-1.5" data-testid="kyc-marital"><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-sm text-brand-navy">Email Address</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-lg mt-1.5" data-testid="kyc-email" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-sm text-brand-navy flex items-center gap-2">
                      PAN Card Number
                      {cibilResult && cibilResult.approved && pan === cibilPan.toUpperCase() && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" data-testid="kyc-pan-verified-chip">
                          <BadgeCheck className="h-3 w-3" /> Verified via CIBIL
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <Input
                        value={pan}
                        onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))}
                        placeholder="ABCDE1234F"
                        className={`rounded-lg mt-1.5 uppercase ${cibilResult && cibilResult.approved ? "bg-emerald-50/40 border-emerald-200 pr-9" : ""}`}
                        data-testid="kyc-pan"
                        readOnly={!!(cibilResult && cibilResult.approved)}
                      />
                      {cibilResult && cibilResult.approved && (
                        <BadgeCheck className="h-4 w-4 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2 mt-[3px]" />
                      )}
                    </div>
                    {pan && !PAN_RE.test(pan) && <p className="text-[11px] text-red-500 mt-1">Format: ABCDE1234F</p>}
                    {cibilResult && cibilResult.approved && pan === cibilPan.toUpperCase() && (
                      <p className="text-[11px] text-emerald-700 mt-1">Auto-filled from your CIBIL pre-check.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section B — Applicant Residential Details */}
              <div className="rounded-xl border border-border p-4">
                <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><Landmark className="h-4 w-4 text-[#5548D1]" /> Applicant Residential Details</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label className="text-sm text-brand-navy">Residence Type</Label>
                    <Select value={residenceType} onValueChange={setResidenceType}>
                      <SelectTrigger className="rounded-lg mt-1.5" data-testid="kyc-residence-type"><SelectValue placeholder="Select residence type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Self Owned">Self Owned</SelectItem>
                        <SelectItem value="Rented">Rented</SelectItem>
                        <SelectItem value="Company Provided">Company Provided</SelectItem>
                        <SelectItem value="Paying Guest">Paying Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-sm text-brand-navy">Flat / House No. / Floor / Building</Label>
                    <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="12, Prince Street" className="rounded-lg mt-1.5" data-testid="kyc-address1" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Colony / Street / Locality</Label>
                    <Input value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="Carter Road" className="rounded-lg mt-1.5" data-testid="kyc-locality" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Pincode</Label>
                    <Input value={pincode} onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                      placeholder="400012" inputMode="numeric" className="rounded-lg mt-1.5" data-testid="kyc-pincode" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy flex items-center gap-1.5">
                      City {city && <span className="text-[10px] text-emerald-700 font-bold">Auto-filled</span>}
                    </Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="From pincode" className="rounded-lg mt-1.5 bg-slate-50" data-testid="kyc-city" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy flex items-center gap-1.5">
                      State {addrState && <span className="text-[10px] text-emerald-700 font-bold">Auto-filled</span>}
                    </Label>
                    <Input value={addrState} onChange={(e) => setAddrState(e.target.value)} placeholder="From pincode" className="rounded-lg mt-1.5 bg-slate-50" data-testid="kyc-state" />
                  </div>
                </div>
              </div>

              {/* Section C — Employment Details */}
              <div className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#5548D1]" /> Applicant Employment Details</p>
                  <span className={`rounded-full text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest ${employment === "Salaried" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{employment}</span>
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-brand-navy">Employment Type</Label>
                    <Select value={employment} onValueChange={setEmployment}>
                      <SelectTrigger className="rounded-lg mt-1.5" data-testid="kyc-employment"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Salaried">Salaried</SelectItem>
                        <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Full Name of Current Company</Label>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="MRF Tyres" className="rounded-lg mt-1.5" data-testid="kyc-company" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Work Experience at Current Company</Label>
                    <Select value={workExperience} onValueChange={setWorkExperience}>
                      <SelectTrigger className="rounded-lg mt-1.5" data-testid="kyc-experience"><SelectValue placeholder="Select experience" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Less Than 2 Years">Less than 2 years</SelectItem>
                        <SelectItem value="2-5 Years">2–5 years</SelectItem>
                        <SelectItem value="5-10 Years">5–10 years</SelectItem>
                        <SelectItem value="Greater Than 10 Years">Greater than 10 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Monthly Household Income</Label>
                    <Input type="number" value={income} onChange={(e) => setIncome(e.target.value.replace(/[^0-9]/g, ""))} placeholder="75000"
                      className="rounded-lg mt-1.5" inputMode="numeric" data-testid="kyc-income" />
                    <p className="text-[10.5px] text-slate-400 mt-1">Including spouse salary, rent/lease, pension, deposit interest etc.</p>
                  </div>
                </div>
              </div>

              {/* Section D — Student Details */}
              <div className="rounded-xl border border-border p-4">
                <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><ShieldQuestion className="h-4 w-4 text-[#5548D1]" /> Student Details</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Confirm the child this fee is being paid for.</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-brand-navy">Student First Name</Label>
                    <Input value={studFirstName} onChange={(e) => setStudFirstName(e.target.value)} className="rounded-lg mt-1.5" data-testid="kyc-stud-first" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Student Last Name</Label>
                    <Input value={studLastName} onChange={(e) => setStudLastName(e.target.value)} className="rounded-lg mt-1.5" data-testid="kyc-stud-last" />
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Student Type</Label>
                    <Select value={studType} onValueChange={setStudType}>
                      <SelectTrigger className="rounded-lg mt-1.5" data-testid="kyc-stud-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New Admission">New Admission</SelectItem>
                        <SelectItem value="Existing">Existing / Renewal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm text-brand-navy">Class / Standard / Year</Label>
                    <Input value={studClass} onChange={(e) => setStudClass(e.target.value)} placeholder="Class 10" className="rounded-lg mt-1.5" data-testid="kyc-stud-class" />
                    <p className="text-[10.5px] text-slate-400 mt-1">Select the class/standard/year for which fees are being paid.</p>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-sm text-brand-navy">Student Unique ID</Label>
                    <Input value={studentId || ""} readOnly className="rounded-lg mt-1.5 bg-slate-50" data-testid="kyc-stud-id" />
                  </div>
                </div>
              </div>

              {/* Aadhaar */}
              <div className="rounded-xl border border-border p-4">
                <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><ScanFace className="h-4 w-4 text-[#5548D1]" /> Instant Digital Identity Check</p>
                <p className="text-xs text-slate-500 mt-1">Authorize fast identity verification via Aadhaar-linked OTP / DigiLocker.</p>
                {aadhaarVerified ? (
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-600" data-testid="aadhaar-verified">
                    <CheckCircle2 className="h-5 w-5" /> Aadhaar identity verified
                  </div>
                ) : !otpSent ? (
                  <Button variant="outline" onClick={sendOtp} data-testid="send-otp-btn"
                    className="mt-3 h-10 rounded-lg border-[#5548D1] text-[#5548D1] hover:bg-[#EEF0FF] font-semibold">
                    Send Verification Code
                  </Button>
                ) : (
                  <div className="mt-3 flex items-end gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-brand-navy">Enter OTP</Label>
                      <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} placeholder="6-digit code"
                        className="rounded-lg mt-1.5" inputMode="numeric" data-testid="otp-input" />
                    </div>
                    <Button onClick={verifyOtp} data-testid="verify-otp-btn" className="h-10 rounded-lg bg-[#5548D1] hover:bg-[#3F35A8] font-semibold">Verify</Button>
                  </div>
                )}
              </div>

              {/* Liveness */}
              <div className="rounded-xl border border-border p-4">
                <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><Camera className="h-4 w-4 text-[#5548D1]" /> Live Liveness Verification</p>
                <div className="mt-4 flex flex-col items-center">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-dashed border-[#5548D1]/40 bg-slate-50 flex items-center justify-center" data-testid="liveness-frame">
                    {camOn && liveness !== "done" ? (
                      <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                    ) : liveness === "done" ? (
                      <div className="flex flex-col items-center text-green-600">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                    ) : liveness === "checking" ? (
                      <Loader2 className="h-10 w-10 text-[#5548D1] animate-spin" />
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
                        className="h-9 rounded-lg bg-[#5548D1] hover:bg-[#3F35A8] font-semibold">
                        {liveness === "checking" ? "Verifying..." : "Capture Selfie & Verify"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Compliance note */}
              <div className="flex items-start gap-2 text-xs text-slate-500 rounded-lg bg-slate-50 p-3" data-testid="kyc-compliance">
                <Lock className="h-4 w-4 text-[#5548D1] shrink-0 mt-0.5" />
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
                      className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${active ? "border-[#5548D1] bg-[#EEF0FF]" : "border-border hover:border-[#5548D1]/40"}`}>
                      <RadioGroupItem value={r.key} />
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${active ? "bg-[#5548D1] text-white" : "bg-slate-100 text-slate-500"}`}><Icon className="h-4 w-4" /></div>
                      <span className="flex-1 text-sm font-medium text-brand-navy">{r.title}</span>
                      {r.badge && <span className="rounded-full bg-[#5548D1] text-white text-[10px] font-bold px-2 py-0.5">{r.badge}</span>}
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
              <div className="flex items-start gap-2 text-xs text-slate-500 rounded-lg bg-[#EEF0FF] p-3">
                <ShieldCheck className="h-4 w-4 text-[#5548D1] shrink-0 mt-0.5" /> <b className="text-brand-navy">₹1 Penny Drop</b>&nbsp;validation confirms bank account ownership.
              </div>
            </div>
          )}

          {/* ---------- Step 5: e-Sign ---------- */}
          {step === 5 && (
            <div className="space-y-5" data-testid="step-esign">
              {/* Confirm Details — sectioned review with Edit chips */}
              <div className="rounded-xl border border-border" data-testid="confirm-details">
                <div className="px-4 py-3 border-b border-border bg-slate-50/50 rounded-t-xl">
                  <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><FileSignature className="h-4 w-4 text-[#5548D1]" /> Confirm your details</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Please review everything below carefully — you cannot change these details after e-Sign.</p>
                </div>

                {/* Plan Details */}
                <ConfirmSection title="Plan Details" onEdit={() => setStep(1)} testid="cd-plan"
                  rows={[
                    ["Fee Amount", inr(academicTotal)],
                    ["Down payment", inr(down || 0)],
                    ["Financed Amount", inr(preview?.financed_amount || 0)],
                    ["Monthly EMI", inr(preview?.emi || 0)],
                    ["Interest", "0% p.a."],
                    ["Plan Tenure", `${tenure} months`],
                  ]} />

                {/* Applicant Basic Details */}
                <ConfirmSection title="Applicant Basic Details" onEdit={() => setStep(3)} testid="cd-basic"
                  rows={[
                    ["Full Name", `${firstName} ${lastName}`.trim() || "—"],
                    ["Father's Name", fatherName || "—"],
                    ["Date of Birth", dob || "—"],
                    ["Gender", (gender || "—").toUpperCase()],
                    ["Marital Status", (maritalStatus || "—").toUpperCase()],
                    ["Email", email || "—"],
                    ["PAN", pan || "—"],
                  ]} />

                {/* Residential Details */}
                <ConfirmSection title="Applicant Residential Details" onEdit={() => setStep(3)} testid="cd-address"
                  rows={[
                    ["Residence Type", (residenceType || "—").toUpperCase()],
                    ["Address", [addressLine1, locality].filter(Boolean).join(", ") || "—"],
                    ["Pincode", pincode || "—"],
                    ["City", city || "—"],
                    ["State", addrState || "—"],
                  ]} />

                {/* Employment Details */}
                <ConfirmSection title="Applicant Employment Details" onEdit={() => setStep(3)} testid="cd-employment"
                  rows={[
                    ["Employment Type", (employment || "—").toUpperCase()],
                    ["Current Company", companyName || "—"],
                    ["Work Experience", workExperience || "—"],
                    ["Monthly Household Income", income ? inr(Number(income)) : "—"],
                  ]} />

                {/* Student Details */}
                <ConfirmSection title="Student Details" onEdit={() => setStep(3)} testid="cd-student" last
                  rows={[
                    ["Full Name", `${studFirstName} ${studLastName}`.trim() || "—"],
                    ["Student Type", (studType || "—").toUpperCase()],
                    ["Class / Standard / Year", studClass || "—"],
                    ["Student Unique ID", studentId || "—"],
                  ]} />
              </div>

              <div className="rounded-xl border border-border p-4 text-sm space-y-2">
                <p className="font-head font-bold text-brand-navy flex items-center gap-2"><FileSignature className="h-4 w-4 text-[#5548D1]" /> Loan Agreement Summary</p>
                <div className="flex justify-between"><span className="text-slate-500">Financed amount</span><span className="font-semibold">{inr(preview?.financed_amount || 0)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Tenure</span><span className="font-semibold">{tenure} months</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Monthly EMI</span><span className="font-semibold text-[#5548D1]">{inr(preview?.emi || 0)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Interest</span><span className="font-semibold text-green-600">0%</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Repayment</span><span className="font-semibold">{rail}</span></div>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><ShieldQuestion className="h-4 w-4 text-[#5548D1]" /> Aadhaar e-Sign</p>
                <p className="text-xs text-slate-500 mt-1">Digitally sign the loan agreement via Aadhaar OTP e-Sign.</p>
                {!esignSent ? (
                  <Button variant="outline" onClick={sendEsign} data-testid="send-esign-btn" className="mt-3 h-10 rounded-lg border-[#5548D1] text-[#5548D1] hover:bg-[#EEF0FF] font-semibold">
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
                <span className="text-sm text-slate-600 leading-relaxed">
                  I accept the <b className="text-brand-navy">Terms &amp; Conditions</b> and hereby declare all information provided by me is correct. I consent to allow Biglyp / Banks / NBFCs to fetch my bureau records and KYC details in order to process the EMI facility.
                </span>
              </label>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 border-t border-border pt-4">
                <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-[#5548D1]" /> RBI-regulated NBFC</span>
                <span className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-[#5548D1]" /> 256-Bit Encryption</span>
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
            className="h-11 px-6 rounded-lg bg-[#5548D1] hover:bg-[#3F35A8] text-white font-semibold">
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


/* -------- CIBIL Score Gauge (SVG semi-circle meter) -------- */
function ConfirmSection({ title, rows, onEdit, testid, last = false }) {
  return (
    <div className={`px-4 py-3 ${last ? "" : "border-b border-border"}`} data-testid={testid}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-widest font-bold text-slate-500">{title}</p>
        <button type="button" onClick={onEdit} className="text-[11px] font-bold text-[#5548D1] hover:underline" data-testid={`${testid}-edit`}>
          Edit
        </button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-col">
            <span className="text-[10.5px] text-slate-400">{k}</span>
            <span className="text-[13px] font-semibold text-brand-navy break-words">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CibilGauge({ score, target, band, color = "blue" }) {
  // Score band 300..900 -> 0..1
  const min = 300, max = 900;
  const clamped = Math.max(min, Math.min(max, score));
  const pct = (clamped - min) / (max - min);
  // Semi-circle from angle 180deg -> 0deg
  const angle = Math.PI * (1 - pct);
  const cx = 90, cy = 90, r = 72;
  const x = cx + r * Math.cos(angle);
  const y = cy - r * Math.sin(angle);
  const stroke = {
    emerald: "#10B981",
    blue: "#5548D1",
    amber: "#F59E0B",
    red: "#EF4444",
  }[color] || "#5548D1";
  // Arc path
  const startX = cx - r, startY = cy;
  const large = 0; // always small arc for semi-circle segment
  const sweep = 1;
  const arcPath = `M ${startX} ${startY} A ${r} ${r} 0 ${large} ${sweep} ${x} ${y}`;
  const bgPath = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  return (
    <div className="flex flex-col items-center shrink-0" data-testid="cibil-gauge">
      <svg width="180" height="110" viewBox="0 0 180 110">
        <path d={bgPath} stroke="#E5E7EB" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d={arcPath} stroke={stroke} strokeWidth="12" fill="none" strokeLinecap="round" />
        <text x={cx} y={cy - 4} textAnchor="middle" className="font-head" fontSize="26" fontWeight="800" fill="#0B1F44">
          {Math.round(score)}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#64748B" letterSpacing="1">
          / 900
        </text>
      </svg>
      <span
        className="mt-1 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
        style={{ color: stroke, backgroundColor: stroke + "1A" }}
      >
        {band}
      </span>
    </div>
  );
}
