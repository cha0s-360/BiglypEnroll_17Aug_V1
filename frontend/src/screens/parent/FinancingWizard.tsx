'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
  Gauge, TrendingUp, XCircle, RefreshCw, BookOpen, Sparkle,
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

  const draftKey = studentId ? `biglyp_wiz_draft_${studentId}` : null;

  // reset on open + hydrate from local draft
  useEffect(() => {
    if (open) {
      setStep(1); setDown(0); setTenure(12); setPreview(null);
      setEligConsent(false);
      setCibilPan(""); setCibilChecking(false); setCibilResult(null); setScoreAnim(0);
      setFirstName(""); setLastName(""); setFatherName(""); setGender(""); setMaritalStatus(""); setEmail("");
      setPan(""); setDob("");
      setResidenceType(""); setAddressLine1(""); setLocality(""); setPincode(""); setCity(""); setAddrState("");
      setIncome(""); setEmployment("Salaried"); setCompanyName(""); setWorkExperience("");
      const parts = (studentName || "").trim().split(/\s+/);
      setStudFirstName(parts[0] || "");
      setStudLastName(parts.slice(1).join(" ") || "");
      setStudType(""); setStudClass(studentGrade || "");
      setOtpSent(false); setOtp(""); setAadhaarVerified(false); setLiveness("idle");
      setRail("UPI AutoPay"); setBankName(""); setHolder(""); setAccount(""); setIfsc("");
      setEsignSent(false); setEsignOtp(""); setAgree(false); setProcessing(false);

      // Restore locally-cached draft (auto-save)
      try {
        if (draftKey) {
          const raw = localStorage.getItem(draftKey);
          if (raw) {
            const d = JSON.parse(raw);
            d.tenure && setTenure(d.tenure);
            d.down && setDown(d.down);
            d.firstName && setFirstName(d.firstName);
            d.lastName && setLastName(d.lastName);
            d.fatherName && setFatherName(d.fatherName);
            d.gender && setGender(d.gender);
            d.maritalStatus && setMaritalStatus(d.maritalStatus);
            d.email && setEmail(d.email);
            d.pan && setPan(d.pan);
            d.dob && setDob(d.dob);
            d.residenceType && setResidenceType(d.residenceType);
            d.addressLine1 && setAddressLine1(d.addressLine1);
            d.locality && setLocality(d.locality);
            d.pincode && setPincode(d.pincode);
            d.city && setCity(d.city);
            d.addrState && setAddrState(d.addrState);
            d.income && setIncome(d.income);
            d.employment && setEmployment(d.employment);
            d.companyName && setCompanyName(d.companyName);
            d.workExperience && setWorkExperience(d.workExperience);
            d.studFirstName && setStudFirstName(d.studFirstName);
            d.studLastName && setStudLastName(d.studLastName);
            d.studType && setStudType(d.studType);
            d.studClass && setStudClass(d.studClass);
            if (d.hasDraft) toast.info("Restored your saved progress");
          }
        }
      } catch { /* ignore parse errors */ }
    }
  }, [open]);

  // Auto-save draft (throttled by React re-renders — persists non-sensitive form data)
  useEffect(() => {
    if (!open || !draftKey) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify({
          hasDraft: true,
          tenure, down,
          firstName, lastName, fatherName, gender, maritalStatus, email, pan, dob,
          residenceType, addressLine1, locality, pincode, city, addrState,
          income, employment, companyName, workExperience,
          studFirstName, studLastName, studType, studClass,
          savedAt: Date.now(),
        }));
      } catch { /* quota / private mode — ignore */ }
    }, 400);
    return () => clearTimeout(t);
  }, [open, draftKey, tenure, down, firstName, lastName, fatherName, gender, maritalStatus, email, pan, dob,
      residenceType, addressLine1, locality, pincode, city, addrState,
      income, employment, companyName, workExperience,
      studFirstName, studLastName, studType, studClass]);

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
      // Clear the auto-saved draft on successful submission
      try { if (draftKey) localStorage.removeItem(draftKey); } catch { /* ignore */ }
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
          <Box className="mt-5 flex items-center" data-testid="wizard-stepper">
            {STEPS.map((s, i) => {
              const done = s.n < step;
              const active = s.n === step;
              return (
                <Box key={s.n} className="flex items-center flex-1 last:flex-none">
                  <Box className="flex items-center gap-2">
                    <Box component="span" className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      done ? "bg-[#5548D1] text-white" : active ? "bg-[#5548D1] text-white ring-4 ring-[#EEF0FF]" : "bg-slate-100 text-slate-400"
                    }`}>
                      {done ? <Check className="h-4 w-4" /> : s.n}
                    </Box>
                    <Box component="span" className={`text-xs font-semibold hidden sm:inline ${active ? "text-[#5548D1]" : done ? "text-brand-navy" : "text-slate-400"}`}>{s.label}</Box>
                  </Box>
                  {i < STEPS.length - 1 && (
                    <Box className={`h-0.5 flex-1 mx-2 rounded-full ${done ? "bg-[#5548D1]" : "bg-slate-100"}`} />
                  )}
                </Box>
              );
            })}
          </Box>
          <Typography variant="inherit" component="p" className="mt-4 text-sm text-brand-navy font-semibold" data-testid="wizard-subtitle">
            Step {step}: {SUBTITLES[step]}
          </Typography>
        </DialogHeader>

        {/* Body */}
        <Box className="px-6 md:px-8 py-6 max-h-[58vh] overflow-y-auto">
          {/* ---------- Step 1: Plan ---------- */}
          {step === 1 && (
            <Box className="space-y-5" data-testid="step-plan">
              <Typography variant="inherit" component="p" className="text-sm text-slate-500">Set up your 0% EMI plan for <b className="text-brand-navy">{inr(academicTotal)}</b>. Your school is paid 100% upfront.</Typography>

              {/* 0% EMI summary banner */}
              <Box className="rounded-xl border border-[#5548D1]/20 bg-[#EEF0FF] p-4" data-testid="plan-emi-banner">
                <Box className="flex items-start justify-between gap-2">
                  <Box>
                    <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-[#5548D1]">Pay full-year fees in EMIs</Typography>
                    <Typography variant="inherit" component="p" className="text-[11.5px] text-slate-500 mt-1">Small, convenient monthly payments</Typography>
                  </Box>
                  <Box component="span" className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">0% Interest</Box>
                </Box>
                {preview && (
                  <Typography variant="inherit" component="p" className="mt-3 font-head text-2xl font-black text-brand-navy">
                    {inr(preview.emi)}
                    <Box component="span" className="text-[11px] font-semibold text-slate-500 ml-1">/ month</Box>
                  </Typography>
                )}
              </Box>

              <Box>
                <Label className="text-sm text-brand-navy">Down payment (optional)</Label>
                <Input type="number" value={down} data-testid="wiz-down"
                  onChange={(e) => setDown(Math.max(0, Math.min(academicTotal, Number(e.target.value))))}
                  className="rounded-lg mt-1.5" />
              </Box>
              <Box>
                <Label className="text-sm text-brand-navy flex justify-between"><Box component="span">Tenure</Box><Box component="span">{tenure} months</Box></Label>
                <Slider value={[tenure]} min={3} max={12} step={1} onValueChange={(v) => setTenure(v[0])} className="mt-3" data-testid="wiz-tenure" />
                <Box className="flex justify-between text-[11px] text-slate-400 mt-1"><Box component="span">3 months</Box><Box component="span">12 months</Box></Box>
              </Box>
              {preview && (
                <Box className="bg-[#EEF0FF] rounded-xl p-4 space-y-1.5 text-sm">
                  <Box className="flex justify-between"><Box component="span" className="text-slate-500">Financed amount</Box><Box component="span" className="font-semibold">{inr(preview.financed_amount)}</Box></Box>
                  <Box className="flex justify-between"><Box component="span" className="text-slate-500">Monthly EMI</Box><Box component="span" className="font-head font-bold text-[#5548D1] text-lg">{inr(preview.emi)}</Box></Box>
                  <Box className="flex justify-between"><Box component="span" className="text-slate-500">Interest</Box><Box component="span" className="font-semibold text-green-600">0%</Box></Box>
                </Box>
              )}
            </Box>
          )}

          {/* ---------- Step 2: Eligibility (with CIBIL check) ---------- */}
          {step === 2 && (
            <Box className="space-y-5" data-testid="step-eligibility">
              <Box className="rounded-xl bg-[#EEF0FF] border border-[#5548D1]/15 p-4 flex items-start gap-3">
                <Box className="h-9 w-9 rounded-lg bg-[#5548D1] text-white flex items-center justify-center shrink-0"><Zap className="h-4 w-4" /></Box>
                <Box>
                  <Typography variant="inherit" component="p" className="font-semibold text-brand-navy text-sm">Instant CIBIL Eligibility Pre-Check</Typography>
                  <Typography variant="inherit" component="p" className="text-xs text-slate-500 mt-0.5">Soft credit pull via CIBIL (TransUnion) — no impact on your credit score.</Typography>
                </Box>
              </Box>

              {/* PAN input for CIBIL pull */}
              <Box className="rounded-xl border border-border p-4">
                <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy text-sm flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-[#5548D1]" /> Verify your CIBIL Score
                </Typography>
                <Typography variant="inherit" component="p" className="text-xs text-slate-500 mt-1">
                  Enter the PAN of the primary applicant. We fetch your CIBIL score securely from the bureau.
                </Typography>
                <Box className="mt-4 grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                  <Box>
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
                      <Typography variant="inherit" component="p" className="text-[11px] text-red-500 mt-1">Format: ABCDE1234F</Typography>
                    )}
                  </Box>
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
                </Box>

                {/* Consent (must be checked before running) */}
                <Box component="label" className="flex items-start gap-3 cursor-pointer mt-4" data-testid="elig-consent-label">
                  <Checkbox
                    checked={eligConsent}
                    onCheckedChange={(v) => setEligConsent(!!v)}
                    className="mt-0.5"
                    data-testid="elig-consent"
                    disabled={cibilChecking}
                  />
                  <Box component="span" className="text-sm text-slate-600 leading-relaxed">
                    I authorize Biglyp &amp; its NBFC lending partner to fetch my CIBIL score via a <b>soft pull</b> for eligibility.
                    This will <b>not</b> impact my credit score.
                  </Box>
                </Box>
              </Box>

              {/* CIBIL Result — with delightful trivia while fetching */}
              {cibilChecking && !cibilResult && (
                <TriviaLoader
                  title="Fetching your CIBIL score…"
                  subtitle="Securely connecting to CIBIL (TransUnion) via RBI-regulated NBFC rails."
                  data-testid="cibil-checking"
                />
              )}

              {cibilResult && (
                <Box
                  className={`rounded-xl border p-5 space-y-4 ${cibilResult.approved ? "border-emerald-200 bg-emerald-50/40" : "border-red-200 bg-red-50/40"}`}
                  data-testid="cibil-result"
                >
                  <Box className="flex flex-col sm:flex-row gap-5 items-center">
                    {/* Score gauge */}
                    <CibilGauge score={scoreAnim} target={cibilResult.score} band={cibilResult.band} color={cibilResult.band_color} />
                    <Box className="flex-1 min-w-0 text-center sm:text-left">
                      <Box className="flex items-center gap-2 justify-center sm:justify-start">
                        {cibilResult.approved
                          ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          : <XCircle className="h-5 w-5 text-red-500" />}
                        <Typography variant="inherit" component="p" className={`font-head font-bold text-base ${cibilResult.approved ? "text-emerald-700" : "text-red-600"}`}>
                          {cibilResult.approved ? "Pre-approved for 0% EMI" : "Not eligible right now"}
                        </Typography>
                      </Box>
                      <Typography variant="inherit" component="p" className="text-xs text-slate-500 mt-1">{cibilResult.decision}</Typography>
                      <Box className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <Box className="rounded-lg bg-white border border-border px-2.5 py-2">
                          <Typography variant="inherit" component="p" className="text-slate-400">PAN</Typography>
                          <Typography variant="inherit" component="p" className="font-mono font-semibold text-brand-navy tracking-wider">{cibilResult.pan_masked}</Typography>
                        </Box>
                        <Box className="rounded-lg bg-white border border-border px-2.5 py-2">
                          <Typography variant="inherit" component="p" className="text-slate-400">Max eligible</Typography>
                          <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy">
                            {cibilResult.max_eligible > 0 ? inr(cibilResult.max_eligible) : "—"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Score factors */}
                  <Box className="grid grid-cols-2 gap-2">
                    {cibilResult.factors.map((f) => (
                      <Box key={f.label} className="flex items-center gap-2 rounded-lg bg-white border border-border px-2.5 py-2">
                        {f.status === "positive"
                          ? <TrendingUp className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          : <Gauge className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
                        <Box component="span" className="text-[11px] text-slate-600 truncate">{f.label}</Box>
                      </Box>
                    ))}
                  </Box>

                  <Box className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 border-t border-border/60 pt-3">
                    <Box component="span" className="flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5 text-[#5548D1]" /> {cibilResult.bureau}</Box>
                    <Box component="span" className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-[#5548D1]" /> {cibilResult.pull_type}</Box>
                  </Box>
                </Box>
              )}

              <Box component="ul" className="space-y-2 pt-1">
                {["Zero interest, zero hidden charges", "Powered by RBI-regulated NBFC lending partners", "Instant digital approval — no paperwork"].map((t) => (
                  <Box component="li" key={t} className="flex items-center gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" /> {t}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* ---------- Step 3: Digital KYC ---------- */}
          {step === 3 && (
            <Box className="space-y-5" data-testid="step-kyc">
              {/* Section A — Applicant Basic Details */}
              <Box className="rounded-xl border border-border p-4">
                <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><Fingerprint className="h-4 w-4 text-[#5548D1]" /> Applicant / Parent Basic Details</Typography>
                <Typography variant="inherit" component="p" className="text-[11px] text-slate-500 mt-0.5">As per PAN card records.</Typography>
                <Box className="mt-4 grid sm:grid-cols-2 gap-4">
                  <Box>
                    <Label className="text-sm text-brand-navy">First Name</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Sachin" className="rounded-lg mt-1.5" data-testid="kyc-first-name" />
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy">Last Name</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Tendulkar" className="rounded-lg mt-1.5" data-testid="kyc-last-name" />
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy">Father&apos;s First Name</Label>
                    <Input value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Ramesh" className="rounded-lg mt-1.5" data-testid="kyc-father-name" />
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy">Date of Birth</Label>
                    <DobPicker value={dob} onChange={setDob} data-testid="kyc-dob" />
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="rounded-lg mt-1.5" data-testid="kyc-gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy">Marital Status</Label>
                    <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                      <SelectTrigger className="rounded-lg mt-1.5" data-testid="kyc-marital"><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Box>
                  <Box className="sm:col-span-2">
                    <Label className="text-sm text-brand-navy">Email Address</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-lg mt-1.5" data-testid="kyc-email" />
                  </Box>
                  <Box className="sm:col-span-2">
                    <Label className="text-sm text-brand-navy flex items-center gap-2">
                      PAN Card Number
                      {cibilResult && cibilResult.approved && pan === cibilPan.toUpperCase() && (
                        <Box component="span" className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" data-testid="kyc-pan-verified-chip">
                          <BadgeCheck className="h-3 w-3" /> Verified via CIBIL
                        </Box>
                      )}
                    </Label>
                    <Box className="relative">
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
                    </Box>
                    {pan && !PAN_RE.test(pan) && <Typography variant="inherit" component="p" className="text-[11px] text-red-500 mt-1">Format: ABCDE1234F</Typography>}
                    {cibilResult && cibilResult.approved && pan === cibilPan.toUpperCase() && (
                      <Typography variant="inherit" component="p" className="text-[11px] text-emerald-700 mt-1">Auto-filled from your CIBIL pre-check.</Typography>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Section B — Applicant Residential Details */}
              <Box className="rounded-xl border border-border p-4">
                <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><Landmark className="h-4 w-4 text-[#5548D1]" /> Applicant Residential Details</Typography>
                <Box className="mt-4 grid sm:grid-cols-2 gap-4">
                  <Box className="sm:col-span-2">
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
                  </Box>
                  <Box className="sm:col-span-2">
                    <Label className="text-sm text-brand-navy">Flat / House No. / Floor / Building</Label>
                    <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="12, Prince Street" className="rounded-lg mt-1.5" data-testid="kyc-address1" />
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy">Colony / Street / Locality</Label>
                    <Input value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="Carter Road" className="rounded-lg mt-1.5" data-testid="kyc-locality" />
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy">Pincode</Label>
                    <Input value={pincode} onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                      placeholder="400012" inputMode="numeric" className="rounded-lg mt-1.5" data-testid="kyc-pincode" />
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy flex items-center gap-1.5">
                      City {city && <Box component="span" className="text-[10px] text-emerald-700 font-bold">Auto-filled</Box>}
                    </Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="From pincode" className="rounded-lg mt-1.5 bg-slate-50" data-testid="kyc-city" />
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy flex items-center gap-1.5">
                      State {addrState && <Box component="span" className="text-[10px] text-emerald-700 font-bold">Auto-filled</Box>}
                    </Label>
                    <Input value={addrState} onChange={(e) => setAddrState(e.target.value)} placeholder="From pincode" className="rounded-lg mt-1.5 bg-slate-50" data-testid="kyc-state" />
                  </Box>
                </Box>
              </Box>

              {/* Section C — Employment Details */}
              <Box className="rounded-xl border border-border p-4">
                <Box className="flex items-center justify-between">
                  <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#5548D1]" /> Applicant Employment Details</Typography>
                  <Box component="span" className={`rounded-full text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest ${employment === "Salaried" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{employment}</Box>
                </Box>
                <Box className="mt-4 grid sm:grid-cols-2 gap-4">
                  <Box>
                    <Label className="text-sm text-brand-navy">Employment Type</Label>
                    <Select value={employment} onValueChange={setEmployment}>
                      <SelectTrigger className="rounded-lg mt-1.5" data-testid="kyc-employment"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Salaried">Salaried</SelectItem>
                        <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      </SelectContent>
                    </Select>
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy">Full Name of Current Company</Label>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="MRF Tyres" className="rounded-lg mt-1.5" data-testid="kyc-company" />
                  </Box>
                  <Box>
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
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy">Monthly Household Income</Label>
                    <Input type="number" value={income} onChange={(e) => setIncome(e.target.value.replace(/[^0-9]/g, ""))} placeholder="75000"
                      className="rounded-lg mt-1.5" inputMode="numeric" data-testid="kyc-income" />
                    <Typography variant="inherit" component="p" className="text-[10.5px] text-slate-400 mt-1">Including spouse salary, rent/lease, pension, deposit interest etc.</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Section D — Student Details */}
              <Box className="rounded-xl border border-border p-4">
                <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><ShieldQuestion className="h-4 w-4 text-[#5548D1]" /> Student Details</Typography>
                <Typography variant="inherit" component="p" className="text-[11px] text-slate-500 mt-0.5">Confirm the child this fee is being paid for.</Typography>
                <Box className="mt-4 grid sm:grid-cols-2 gap-4">
                  <Box>
                    <Label className="text-sm text-brand-navy">Student First Name</Label>
                    <Input value={studFirstName} onChange={(e) => setStudFirstName(e.target.value)} className="rounded-lg mt-1.5" data-testid="kyc-stud-first" />
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy">Student Last Name</Label>
                    <Input value={studLastName} onChange={(e) => setStudLastName(e.target.value)} className="rounded-lg mt-1.5" data-testid="kyc-stud-last" />
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy">Student Type</Label>
                    <Select value={studType} onValueChange={setStudType}>
                      <SelectTrigger className="rounded-lg mt-1.5" data-testid="kyc-stud-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New Admission">New Admission</SelectItem>
                        <SelectItem value="Existing">Existing / Renewal</SelectItem>
                      </SelectContent>
                    </Select>
                  </Box>
                  <Box>
                    <Label className="text-sm text-brand-navy">Class / Standard / Year</Label>
                    <Input value={studClass} onChange={(e) => setStudClass(e.target.value)} placeholder="Class 10" className="rounded-lg mt-1.5" data-testid="kyc-stud-class" />
                    <Typography variant="inherit" component="p" className="text-[10.5px] text-slate-400 mt-1">Select the class/standard/year for which fees are being paid.</Typography>
                  </Box>
                  <Box className="sm:col-span-2">
                    <Label className="text-sm text-brand-navy">Student Unique ID</Label>
                    <Input value={studentId || ""} readOnly className="rounded-lg mt-1.5 bg-slate-50" data-testid="kyc-stud-id" />
                  </Box>
                </Box>
              </Box>

              {/* Aadhaar */}
              <Box className="rounded-xl border border-border p-4">
                <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><ScanFace className="h-4 w-4 text-[#5548D1]" /> Instant Digital Identity Check</Typography>
                <Typography variant="inherit" component="p" className="text-xs text-slate-500 mt-1">Authorize fast identity verification via Aadhaar-linked OTP / DigiLocker.</Typography>
                {aadhaarVerified ? (
                  <Box className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-600" data-testid="aadhaar-verified">
                    <CheckCircle2 className="h-5 w-5" /> Aadhaar identity verified
                  </Box>
                ) : !otpSent ? (
                  <Button variant="outline" onClick={sendOtp} data-testid="send-otp-btn"
                    className="mt-3 h-10 rounded-lg border-[#5548D1] text-[#5548D1] hover:bg-[#EEF0FF] font-semibold">
                    Send Verification Code
                  </Button>
                ) : (
                  <Box className="mt-3 flex items-end gap-2">
                    <Box className="flex-1">
                      <Label className="text-xs text-brand-navy">Enter OTP</Label>
                      <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} placeholder="6-digit code"
                        className="rounded-lg mt-1.5" inputMode="numeric" data-testid="otp-input" />
                    </Box>
                    <Button onClick={verifyOtp} data-testid="verify-otp-btn" className="h-10 rounded-lg bg-[#5548D1] hover:bg-[#3F35A8] font-semibold">Verify</Button>
                  </Box>
                )}
              </Box>

              {/* Liveness */}
              <Box className="rounded-xl border border-border p-4">
                <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><Camera className="h-4 w-4 text-[#5548D1]" /> Live Liveness Verification</Typography>
                <Box className="mt-4 flex flex-col items-center">
                  <Box className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-dashed border-[#5548D1]/40 bg-slate-50 flex items-center justify-center" data-testid="liveness-frame">
                    {camOn && liveness !== "done" ? (
                      <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                    ) : liveness === "done" ? (
                      <Box className="flex flex-col items-center text-green-600">
                        <CheckCircle2 className="h-10 w-10" />
                      </Box>
                    ) : liveness === "checking" ? (
                      <Loader2 className="h-10 w-10 text-[#5548D1] animate-spin" />
                    ) : (
                      <ScanFace className="h-12 w-12 text-slate-300" />
                    )}
                  </Box>
                  <Typography variant="inherit" component="p" className="text-xs text-slate-500 mt-3">
                    {liveness === "done" ? "Liveness verified" : "Position face within the frame"}
                  </Typography>
                  {liveness !== "done" && (
                    <Box className="mt-3 flex gap-2">
                      {!camOn && liveness === "idle" && (
                        <Button variant="outline" onClick={startCam} data-testid="start-cam-btn" className="h-9 rounded-lg border-border text-slate-600 font-semibold">
                          <Camera className="h-4 w-4 mr-1.5" /> Start Camera
                        </Button>
                      )}
                      <Button onClick={captureLiveness} disabled={liveness === "checking"} data-testid="capture-liveness-btn"
                        className="h-9 rounded-lg bg-[#5548D1] hover:bg-[#3F35A8] font-semibold">
                        {liveness === "checking" ? "Verifying..." : "Capture Selfie & Verify"}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Compliance note */}
              <Box className="flex items-start gap-2 text-xs text-slate-500 rounded-lg bg-slate-50 p-3" data-testid="kyc-compliance">
                <Lock className="h-4 w-4 text-[#5548D1] shrink-0 mt-0.5" />
                Data transmitted via encrypted RBI-regulated NBFC lending partner rails. Zero manual paperwork.
              </Box>
            </Box>
          )}

          {/* ---------- Step 4: Bank Setup ---------- */}
          {step === 4 && (
            <Box className="space-y-5" data-testid="step-bank">
              <Typography variant="inherit" component="p" className="text-sm text-slate-500">Set up auto-debit for your monthly EMIs. Pre-debit reminders sent 5 days prior.</Typography>
              <RadioGroup value={rail} onValueChange={setRail} className="space-y-3" data-testid="wiz-rail-group">
                {RAILS.map((r) => {
                  const Icon = r.icon; const active = rail === r.key;
                  return (
                    <Box component="label" key={r.key} data-testid={`wiz-rail-${r.key.split(" ")[0].toLowerCase()}`}
                      className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${active ? "border-[#5548D1] bg-[#EEF0FF]" : "border-border hover:border-[#5548D1]/40"}`}>
                      <RadioGroupItem value={r.key} />
                      <Box className={`h-8 w-8 rounded-lg flex items-center justify-center ${active ? "bg-[#5548D1] text-white" : "bg-slate-100 text-slate-500"}`}><Icon className="h-4 w-4" /></Box>
                      <Box component="span" className="flex-1 text-sm font-medium text-brand-navy">{r.title}</Box>
                      {r.badge && <Box component="span" className="rounded-full bg-[#5548D1] text-white text-[10px] font-bold px-2 py-0.5">{r.badge}</Box>}
                    </Box>
                  );
                })}
              </RadioGroup>
              <Box className="grid sm:grid-cols-2 gap-4">
                <Box>
                  <Label className="text-sm text-brand-navy">Bank Name</Label>
                  <Select value={bankName} onValueChange={setBankName}>
                    <SelectTrigger className="rounded-lg mt-1.5" data-testid="wiz-bank"><SelectValue placeholder="Select bank" /></SelectTrigger>
                    <SelectContent>{BANKS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </Box>
                <Box>
                  <Label className="text-sm text-brand-navy">Account Holder Name</Label>
                  <Input value={holder} onChange={(e) => setHolder(e.target.value)} className="rounded-lg mt-1.5" data-testid="wiz-holder" />
                </Box>
                <Box>
                  <Label className="text-sm text-brand-navy">Bank Account Number</Label>
                  <Input value={account} onChange={(e) => setAccount(e.target.value.replace(/[^0-9]/g, ""))} className="rounded-lg mt-1.5" inputMode="numeric" data-testid="wiz-account" />
                </Box>
                <Box>
                  <Label className="text-sm text-brand-navy">IFSC Code</Label>
                  <Input value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} className="rounded-lg mt-1.5" data-testid="wiz-ifsc" />
                </Box>
              </Box>
              <Box className="flex items-start gap-2 text-xs text-slate-500 rounded-lg bg-[#EEF0FF] p-3">
                <ShieldCheck className="h-4 w-4 text-[#5548D1] shrink-0 mt-0.5" /> <b className="text-brand-navy">₹1 Penny Drop</b>&nbsp;validation confirms bank account ownership.
              </Box>
            </Box>
          )}

          {/* ---------- Step 5: e-Sign ---------- */}
          {step === 5 && (
            <Box className="space-y-5" data-testid="step-esign">
              {/* Confirm Details — sectioned review with Edit chips */}
              <Box className="rounded-xl border border-border" data-testid="confirm-details">
                <Box className="px-4 py-3 border-b border-border bg-slate-50/50 rounded-t-xl">
                  <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><FileSignature className="h-4 w-4 text-[#5548D1]" /> Confirm your details</Typography>
                  <Typography variant="inherit" component="p" className="text-[11px] text-slate-500 mt-0.5">Please review everything below carefully — you cannot change these details after e-Sign.</Typography>
                </Box>

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
              </Box>

              <Box className="rounded-xl border border-border p-4 text-sm space-y-2">
                <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy flex items-center gap-2"><FileSignature className="h-4 w-4 text-[#5548D1]" /> Loan Agreement Summary</Typography>
                <Box className="flex justify-between"><Box component="span" className="text-slate-500">Financed amount</Box><Box component="span" className="font-semibold">{inr(preview?.financed_amount || 0)}</Box></Box>
                <Box className="flex justify-between"><Box component="span" className="text-slate-500">Tenure</Box><Box component="span" className="font-semibold">{tenure} months</Box></Box>
                <Box className="flex justify-between"><Box component="span" className="text-slate-500">Monthly EMI</Box><Box component="span" className="font-semibold text-[#5548D1]">{inr(preview?.emi || 0)}</Box></Box>
                <Box className="flex justify-between"><Box component="span" className="text-slate-500">Interest</Box><Box component="span" className="font-semibold text-green-600">0%</Box></Box>
                <Box className="flex justify-between"><Box component="span" className="text-slate-500">Repayment</Box><Box component="span" className="font-semibold">{rail}</Box></Box>
              </Box>
              <Box className="rounded-xl border border-border p-4">
                <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy text-sm flex items-center gap-2"><ShieldQuestion className="h-4 w-4 text-[#5548D1]" /> Aadhaar e-Sign</Typography>
                <Typography variant="inherit" component="p" className="text-xs text-slate-500 mt-1">Digitally sign the loan agreement via Aadhaar OTP e-Sign.</Typography>
                {!esignSent ? (
                  <Button variant="outline" onClick={sendEsign} data-testid="send-esign-btn" className="mt-3 h-10 rounded-lg border-[#5548D1] text-[#5548D1] hover:bg-[#EEF0FF] font-semibold">
                    Send e-Sign OTP
                  </Button>
                ) : (
                  <Box className="mt-3">
                    <Label className="text-xs text-brand-navy">e-Sign OTP</Label>
                    <Input value={esignOtp} onChange={(e) => setEsignOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))} placeholder="6-digit code"
                      className="rounded-lg mt-1.5 max-w-[200px]" inputMode="numeric" data-testid="esign-otp" />
                  </Box>
                )}
              </Box>
              <Box component="label" className="flex items-start gap-3 cursor-pointer" data-testid="esign-agree-label">
                <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} className="mt-0.5" data-testid="esign-agree" />
                <Box component="span" className="text-sm text-slate-600 leading-relaxed">
                  I accept the <b className="text-brand-navy">Terms &amp; Conditions</b> and hereby declare all information provided by me is correct. I consent to allow Biglyp / Banks / NBFCs to fetch my bureau records and KYC details in order to process the EMI facility.
                </Box>
              </Box>
              <Box className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 border-t border-border pt-4">
                <Box component="span" className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-[#5548D1]" /> RBI-regulated NBFC</Box>
                <Box component="span" className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-[#5548D1]" /> 256-Bit Encryption</Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Footer actions */}
        <Box className="px-6 md:px-8 py-4 border-t border-border flex items-center justify-between gap-3 bg-white">
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
        </Box>
      </DialogContent>
    </Dialog>
  );
}


/* -------- Sectioned Confirm-Details panel (used in Step 5) -------- */
function ConfirmSection({ title, rows, onEdit, testid, last = false }) {
  return (
    <Box className={`px-4 py-3 ${last ? "" : "border-b border-border"}`} data-testid={testid}>
      <Box className="flex items-center justify-between">
        <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-slate-500">{title}</Typography>
        <Box component="button" type="button" onClick={onEdit} className="text-[11px] font-bold text-[#5548D1] hover:underline" data-testid={`${testid}-edit`}>
          Edit
        </Box>
      </Box>
      <Box className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {rows.map(([k, v]) => (
          <Box key={k} className="flex flex-col">
            <Box component="span" className="text-[10.5px] text-slate-400">{k}</Box>
            <Box component="span" className="text-[13px] font-semibold text-brand-navy break-words">{v}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/* -------- Delightful "Did you know?" loader (shown during CIBIL soft-pull) -------- */
const TRIVIA = [
  "The first rupee in India was introduced by Sher Shah Suri in the 16th century.",
  "A soft pull check never impacts your credit score — banks do it thousands of times a day.",
  "0% EMI = the school gets 100% of the fee upfront; you just spread your payments — no interest.",
  "Your CIBIL score updates once every 30-45 days, so back-to-back checks show the same number.",
  "eNACH mandates take under 60 seconds to set up — nothing like the paper mandates of 2015.",
  "India's UPI processes more transactions per day than Visa in most weeks.",
];

function TriviaLoader({ title, subtitle, ...rest }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % TRIVIA.length), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <Box className="rounded-2xl border border-dashed border-[#5548D1]/40 bg-white p-6 flex items-center gap-5" {...rest}>
      <Box className="relative h-16 w-16 shrink-0">
        <Box className="absolute inset-0 rounded-2xl bg-[#EEF0FF] flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-[#5548D1]" />
        </Box>
        <Box className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#5548D1] text-white flex items-center justify-center animate-pulse">
          <Sparkle className="h-3 w-3" />
        </Box>
      </Box>
      <Box className="min-w-0 flex-1">
        <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy text-sm flex items-center gap-2">
          {title || "Just a moment…"}
          <Loader2 className="h-3.5 w-3.5 text-[#5548D1] animate-spin" />
        </Typography>
        {subtitle && <Typography variant="inherit" component="p" className="text-xs text-slate-500 mt-0.5">{subtitle}</Typography>}
        <Box className="mt-3 rounded-lg bg-slate-50 border border-slate-100 p-3">
          <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-[#5548D1] flex items-center gap-1.5">
            <Sparkle className="h-3 w-3" /> Did you know?
          </Typography>
          <Typography variant="inherit" component="p" key={idx} className="mt-1 text-[13px] text-slate-700 leading-relaxed animate-in fade-in duration-500">
            {TRIVIA[idx]}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

/* -------- Grandparent-friendly Date-of-Birth picker (Day / Month / Year) -------- */
const DOB_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function DobPicker({ value, onChange, ...rest }) {
  // value is ISO 'YYYY-MM-DD' — parse to parts
  const parseParts = (v) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    return m ? { y: m[1], mo: m[2], d: m[3] } : { y: "", mo: "", d: "" };
  };
  const [parts, setParts] = useState(parseParts(value));
  useEffect(() => { setParts(parseParts(value)); }, [value]);

  const now = new Date();
  const years = useMemo(() => {
    const arr = [];
    for (let y = now.getFullYear(); y >= 1930; y--) arr.push(String(y));
    return arr;
  }, [now]);
  const daysInMonth = useMemo(() => {
    const y = parseInt(parts.y || "2000", 10);
    const mo = parseInt(parts.mo || "1", 10);
    return new Date(y, mo, 0).getDate();
  }, [parts.y, parts.mo]);
  const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, "0"));

  const commit = (p) => {
    setParts(p);
    if (p.y && p.mo && p.d) onChange(`${p.y}-${p.mo}-${p.d}`);
  };

  return (
    <Box className="grid grid-cols-3 gap-2 mt-1.5" {...rest}>
      <Select value={parts.d} onValueChange={(v) => commit({ ...parts, d: v })}>
        <SelectTrigger className="rounded-lg" data-testid="dob-day"><SelectValue placeholder="Day" /></SelectTrigger>
        <SelectContent className="max-h-64">
          {days.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={parts.mo} onValueChange={(v) => commit({ ...parts, mo: v })}>
        <SelectTrigger className="rounded-lg" data-testid="dob-month"><SelectValue placeholder="Month" /></SelectTrigger>
        <SelectContent className="max-h-64">
          {DOB_MONTHS.map((mo, i) => (
            <SelectItem key={mo} value={String(i + 1).padStart(2, "0")}>{mo}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={parts.y} onValueChange={(v) => commit({ ...parts, y: v })}>
        <SelectTrigger className="rounded-lg" data-testid="dob-year"><SelectValue placeholder="Year" /></SelectTrigger>
        <SelectContent className="max-h-64">
          {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
        </SelectContent>
      </Select>
    </Box>
  );
}

/* -------- CIBIL Score Gauge (SVG semi-circle meter) -------- */
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
    <Box className="flex flex-col items-center shrink-0" data-testid="cibil-gauge">
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
      <Box component="span"
        className="mt-1 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
        style={{ color: stroke, backgroundColor: stroke + "1A" }}
      >
        {band}
      </Box>
    </Box>
  );
}
