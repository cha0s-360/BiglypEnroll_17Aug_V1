'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { CreditLayout } from "@/components/CreditLayout";
import api, { inr } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  User, Users, GraduationCap, Banknote, ArrowRight, ArrowLeft, ShieldCheck, Check,
} from "lucide-react";

const STEPS = [
  { key: "student", label: "Student & School", icon: GraduationCap },
  { key: "applicant", label: "Parent / Applicant", icon: User },
  { key: "co", label: "Co-applicant", icon: Users },
  { key: "loan", label: "Loan & Subvention", icon: Banknote },
];
const GEO = ["Metro", "Urban", "Semi-Urban", "Rural"];
const EMP = [{ v: "salaried", l: "Salaried" }, { v: "self_employed", l: "Self-employed" }];
const SUBV = [
  { v: "school_100", l: "100% School Subvention (0% EMI for parent)" },
  { v: "parent_100", l: "100% Parent Pays Interest" },
  { v: "shared", l: "Shared Subvention (split %)" },
];

export default function NewApplication() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [student, setStudent] = useState({ name: "", grade: "Grade 10", school_name: "Horizon International School" });
  const [applicant, setApplicant] = useState({ name: "", mobile: "", email: "", pan: "", aadhaar: "", age: 38, employment_type: "salaried", occupation: "", monthly_income: 60000, geography: "Metro" });
  const [co, setCo] = useState({ name: "", pan: "", monthly_income: 0, relation: "Spouse" });
  const [loan, setLoan] = useState({ total_fee: 163000, loan_amount: 150000, tenure_months: 12, subvention_model: "parent_100", subvention_split: 50 });
  const [consent, setConsent] = useState(false);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    if (!consent) return toast.error("Bureau & DPDP consent is required to proceed");
    if (!applicant.name || !applicant.pan) return toast.error("Applicant name and PAN are required");
    try {
      const { data } = await api.post("/credit/applications", {
        student, applicant, co_applicant: co.name ? co : {}, fee: loan,
      });
      await api.post(`/credit/applications/${data.id}/consent`, { bureau_consent: true, dpdp_consent: true });
      toast.success(`Application ${data.app_no} created`);
      router.push(`/credit/app/${data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not create application");
    }
  };

  const StepIcon = STEPS[step].icon;

  return (
    <CreditLayout title="New Loan Application" subtitle="Capture applicant details for pre-credit assessment">
      <Box className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <Box key={s.key} className="flex items-center gap-2 shrink-0">
              <Box className={`flex items-center gap-2 px-4 py-2.5 rounded-sm border text-sm font-medium ${
                i === step ? "bg-brand-navy text-white border-brand-navy" : i < step ? "bg-brand-tint text-brand-navy border-brand-tint" : "bg-white text-muted-foreground border-border"}`}>
                {i < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />} {s.label}
              </Box>
              {i < STEPS.length - 1 && <Box className="h-px w-6 bg-border" />}
            </Box>
          );
        })}
      </Box>

      <Box className="max-w-3xl bg-white border border-border rounded-sm p-8">
        <Box className="flex items-center gap-3 mb-6">
          <Box className="h-10 w-10 rounded-sm bg-brand-blue flex items-center justify-center"><StepIcon className="h-5 w-5 text-white" /></Box>
          <Typography variant="inherit" component="h2" className="font-head text-xl font-bold text-brand-navy">{STEPS[step].label}</Typography>
        </Box>

        {step === 0 && (
          <Box className="grid md:grid-cols-2 gap-4">
            <Field label="Student name" v={student.name} set={(v) => setStudent({ ...student, name: v })} testid="f-student-name" />
            <Box>
              <Label>Grade</Label>
              <Select value={student.grade} onValueChange={(v) => setStudent({ ...student, grade: v })}>
                <SelectTrigger className="rounded-sm mt-1.5" data-testid="f-grade"><SelectValue /></SelectTrigger>
                <SelectContent>{["Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </Box>
            <Field label="School name" v={student.school_name} set={(v) => setStudent({ ...student, school_name: v })} testid="f-school" full />
          </Box>
        )}

        {step === 1 && (
          <Box className="grid md:grid-cols-2 gap-4">
            <Field label="Full name" v={applicant.name} set={(v) => setApplicant({ ...applicant, name: v })} testid="f-name" />
            <Field label="Mobile" v={applicant.mobile} set={(v) => setApplicant({ ...applicant, mobile: v })} testid="f-mobile" />
            <Field label="Email" v={applicant.email} set={(v) => setApplicant({ ...applicant, email: v })} testid="f-email" />
            <Field label="PAN" v={applicant.pan} set={(v) => setApplicant({ ...applicant, pan: v.toUpperCase() })} testid="f-pan" />
            <Field label="Aadhaar" v={applicant.aadhaar} set={(v) => setApplicant({ ...applicant, aadhaar: v })} testid="f-aadhaar" />
            <Field label="Age" type="number" v={applicant.age} set={(v) => setApplicant({ ...applicant, age: Number(v) })} testid="f-age" />
            <Box>
              <Label>Employment</Label>
              <Select value={applicant.employment_type} onValueChange={(v) => setApplicant({ ...applicant, employment_type: v })}>
                <SelectTrigger className="rounded-sm mt-1.5" data-testid="f-emp"><SelectValue /></SelectTrigger>
                <SelectContent>{EMP.map((e) => <SelectItem key={e.v} value={e.v}>{e.l}</SelectItem>)}</SelectContent>
              </Select>
            </Box>
            <Field label="Occupation" v={applicant.occupation} set={(v) => setApplicant({ ...applicant, occupation: v })} testid="f-occ" />
            <Field label="Monthly income (₹)" type="number" v={applicant.monthly_income} set={(v) => setApplicant({ ...applicant, monthly_income: Number(v) })} testid="f-income" />
            <Box>
              <Label>Geography</Label>
              <Select value={applicant.geography} onValueChange={(v) => setApplicant({ ...applicant, geography: v })}>
                <SelectTrigger className="rounded-sm mt-1.5" data-testid="f-geo"><SelectValue /></SelectTrigger>
                <SelectContent>{GEO.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </Box>
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Typography variant="inherit" component="p" className="text-sm text-muted-foreground mb-4">Optional — a co-applicant can improve eligibility. Leave blank to skip.</Typography>
            <Box className="grid md:grid-cols-2 gap-4">
              <Field label="Co-applicant name" v={co.name} set={(v) => setCo({ ...co, name: v })} testid="f-co-name" />
              <Field label="Relation" v={co.relation} set={(v) => setCo({ ...co, relation: v })} testid="f-co-rel" />
              <Field label="PAN" v={co.pan} set={(v) => setCo({ ...co, pan: v.toUpperCase() })} testid="f-co-pan" />
              <Field label="Monthly income (₹)" type="number" v={co.monthly_income} set={(v) => setCo({ ...co, monthly_income: Number(v) })} testid="f-co-income" />
            </Box>
          </Box>
        )}

        {step === 3 && (
          <Box className="space-y-4">
            <Box className="grid md:grid-cols-3 gap-4">
              <Field label="Total fee (₹)" type="number" v={loan.total_fee} set={(v) => setLoan({ ...loan, total_fee: Number(v) })} testid="f-totalfee" />
              <Field label="Loan amount (₹)" type="number" v={loan.loan_amount} set={(v) => setLoan({ ...loan, loan_amount: Number(v) })} testid="f-loanamt" />
              <Box>
                <Label>Tenure (months)</Label>
                <Select value={String(loan.tenure_months)} onValueChange={(v) => setLoan({ ...loan, tenure_months: Number(v) })}>
                  <SelectTrigger className="rounded-sm mt-1.5" data-testid="f-tenure"><SelectValue /></SelectTrigger>
                  <SelectContent>{[3, 6, 9, 12, 18, 24].map((t) => <SelectItem key={t} value={String(t)}>{t} months</SelectItem>)}</SelectContent>
                </Select>
              </Box>
            </Box>
            <Box>
              <Label>School subvention model</Label>
              <Select value={loan.subvention_model} onValueChange={(v) => setLoan({ ...loan, subvention_model: v })}>
                <SelectTrigger className="rounded-sm mt-1.5" data-testid="f-subv"><SelectValue /></SelectTrigger>
                <SelectContent>{SUBV.map((s) => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}</SelectContent>
              </Select>
            </Box>
            {loan.subvention_model === "shared" && (
              <Field label="School share (%)" type="number" v={loan.subvention_split} set={(v) => setLoan({ ...loan, subvention_split: Number(v) })} testid="f-split" />
            )}
            <Box component="label" className="flex items-start gap-3 border border-border rounded-sm p-4 cursor-pointer">
              <Box component="input" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" data-testid="f-consent" />
              <Box component="span" className="text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 inline text-brand-blue mr-1" />
                I authorise Biglyp to pull the applicant&apos;s credit bureau report and process personal data
                in line with RBI Digital Lending Guidelines and the DPDP Act.
              </Box>
            </Box>
          </Box>
        )}

        <Box className="flex justify-between pt-6 mt-6 border-t border-border">
          <Button variant="outline" onClick={back} disabled={step === 0} className="rounded-sm"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
          {step < 3 ? (
            <Button onClick={next} className="rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="wizard-next">Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
          ) : (
            <Button onClick={submit} className="rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="wizard-submit">Create & assess <ArrowRight className="h-4 w-4 ml-2" /></Button>
          )}
        </Box>
      </Box>
    </CreditLayout>
  );
}

function Field({ label, v, set, type = "text", testid, full }) {
  return (
    <Box className={full ? "md:col-span-2" : ""}>
      <Label>{label}</Label>
      <Input type={type} value={v} onChange={(e) => set(e.target.value)} className="rounded-sm mt-1.5" data-testid={testid} />
    </Box>
  );
}
