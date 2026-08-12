'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from "react";
import { useParams } from 'next/navigation';
import { CreditLayout } from "@/components/CreditLayout";
import api, { inr } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Zap, ShieldCheck, Upload, FileText, Gauge, Landmark, AlertTriangle, GitBranch,
  CheckCircle2, XCircle, Send, Loader2, User, CreditCard, TrendingUp, Percent, ScrollText,
} from "lucide-react";

const DEC_STYLE = {
  Approved: "bg-green-100 text-green-700", "Conditional Approval": "bg-blue-100 text-blue-700",
  Refer: "bg-amber-100 text-amber-700", Reject: "bg-red-100 text-red-700",
};
const RISK_STYLE = { Low: "bg-green-100 text-green-700", Medium: "bg-amber-100 text-amber-700", High: "bg-red-100 text-red-700" };
const SCORE_COLOR = (s) => (s >= 750 ? "#16a34a" : s >= 650 ? "#2540E8" : s >= 550 ? "#f59e0b" : "#dc2626");

function Row({ k, v, strong }) {
  return (
    <Box className="flex justify-between py-2 border-b border-border last:border-0 text-sm">
      <Box component="span" className="text-muted-foreground">{k}</Box>
      <Box component="span" className={strong ? "font-head font-bold text-brand-navy" : "font-medium text-brand-navy"}>{v}</Box>
    </Box>
  );
}

export default function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [app, setApp] = useState(null);
  const [busy, setBusy] = useState("");
  const [audit, setAudit] = useState([]);
  const bankRef = useRef();
  const docRef = useRef();
  const isAdmin = ["super_admin", "credit_ops"].includes(user?.role);

  const load = () => api.get(`/credit/applications/${id}`).then(({ data }) => setApp(data));
  const loadAudit = () => api.get(`/credit/applications/${id}/audit`).then(({ data }) => setAudit(data)).catch(() => {});
  useEffect(() => { load(); loadAudit(); }, [id]);

  const act = async (label, fn) => {
    setBusy(label);
    try { await fn(); await load(); await loadAudit(); }
    catch (err) { toast.error(err.response?.data?.detail || "Action failed"); }
    finally { setBusy(""); }
  };

  const runAll = () => act("run", async () => {
    await api.post(`/credit/applications/${id}/run-all`);
    toast.success("Full pre-credit assessment complete");
  });

  const uploadBank = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    await act("bank", async () => {
      const fd = new FormData(); fd.append("file", f);
      await api.post(`/credit/applications/${id}/bank-statement`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Bank statement analysed");
    });
    if (bankRef.current) bankRef.current.value = "";
  };

  const uploadDoc = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    await act("doc", async () => {
      const fd = new FormData(); fd.append("file", f);
      await api.post(`/credit/applications/${id}/documents?doc_type=KYC/Income`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Document uploaded & OCR attempted");
    });
    if (docRef.current) docRef.current.value = "";
  };

  const makerSubmit = () => act("maker", async () => { await api.post(`/credit/applications/${id}/maker-submit`); toast.success("Sent to checker"); });
  const checker = (decision) => act("checker", async () => { await api.post(`/credit/applications/${id}/checker-decision`, { decision }); toast.success(`Checker ${decision}d`); });
  const submitLender = (lid) => act("lender", async () => { await api.post(`/credit/applications/${id}/submit-lender?lender_id=${lid}`); toast.success("Submitted to lender"); });

  if (!app) return <CreditLayout title="Application"><Box className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-blue" /></Box></CreditLayout>;

  const dec = app.decision || {};
  const score = app.internal_score?.score;
  const pr = app.pricing || {};
  const wf = app.workflow || {};

  return (
    <CreditLayout title={app.app_no} subtitle={`${app.applicant?.name || ""} · ${app.student?.name || ""}`}>
      {/* action bar */}
      <Box className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <Box className="flex items-center gap-2">
          {dec.status && <Badge className={`rounded-sm text-sm ${DEC_STYLE[dec.status] || "bg-muted"}`}>{dec.status}</Badge>}
          <Box component="span" className="text-xs capitalize text-muted-foreground px-2 py-1 rounded-sm bg-muted">{(app.status || "").replace(/_/g, " ")}</Box>
        </Box>
        <Button onClick={runAll} disabled={busy} className="rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="run-assessment-btn">
          {busy === "run" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
          Run full pre-credit assessment
        </Button>
      </Box>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="kyc" data-testid="tab-kyc">KYC & Docs</TabsTrigger>
          <TabsTrigger value="bureau" data-testid="tab-bureau">Credit Bureau</TabsTrigger>
          <TabsTrigger value="bank" data-testid="tab-bank">Bank & Income</TabsTrigger>
          <TabsTrigger value="score" data-testid="tab-score">Score & FOIR</TabsTrigger>
          <TabsTrigger value="decision" data-testid="tab-decision">Decision & Lenders</TabsTrigger>
          <TabsTrigger value="pricing" data-testid="tab-pricing">Pricing</TabsTrigger>
          <TabsTrigger value="fraud" data-testid="tab-fraud">Fraud & Risk</TabsTrigger>
          <TabsTrigger value="workflow" data-testid="tab-workflow">Workflow</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="mt-4 grid lg:grid-cols-3 gap-4">
          <Card title="Applicant" icon={User}>
            <Row k="Name" v={app.applicant?.name || "—"} />
            <Row k="PAN" v={app.applicant?.pan || "—"} />
            <Row k="Mobile" v={app.applicant?.mobile || "—"} />
            <Row k="Employment" v={app.applicant?.employment_type || "—"} />
            <Row k="Monthly income" v={inr(app.applicant?.monthly_income)} />
            <Row k="Geography" v={app.applicant?.geography || "—"} />
          </Card>
          <Card title="Student & School" icon={FileText}>
            <Row k="Student" v={app.student?.name || "—"} />
            <Row k="Grade" v={app.student?.grade || "—"} />
            <Row k="School" v={app.student?.school_name || "—"} />
            <Row k="Total fee" v={inr(app.fee?.total_fee)} />
          </Card>
          <Card title="Loan request" icon={CreditCard}>
            <Row k="Loan amount" v={inr(app.fee?.loan_amount)} strong />
            <Row k="Tenure" v={`${app.fee?.tenure_months} months`} />
            <Row k="Subvention" v={(app.fee?.subvention_model || "").replace(/_/g, " ")} />
            {score && <Row k="Internal score" v={`${score}/1000 (${app.internal_score.band})`} strong />}
          </Card>
        </TabsContent>

        {/* KYC & DOCS */}
        <TabsContent value="kyc" className="mt-4 grid lg:grid-cols-2 gap-4">
          <Card title="Digital KYC" icon={ShieldCheck}>
            {app.kyc?.status ? (
              <Box className="grid grid-cols-2 gap-2 text-sm">
                {[["PAN", app.kyc.pan_verified], ["Aadhaar", app.kyc.aadhaar_verified], ["DigiLocker", app.kyc.digilocker], ["Selfie/Liveness", app.kyc.selfie_liveness], ["CKYC", !!app.kyc.ckyc_ref], ["e-Sign ready", app.kyc.esign_ready]].map(([l, ok]) => (
                  <Box key={l} className="flex items-center gap-2 border border-border rounded-sm px-3 py-2">
                    {ok ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <Box component="span" className="text-brand-navy">{l}</Box>
                  </Box>
                ))}
                {app.kyc.ckyc_ref && <Typography variant="inherit" component="p" className="col-span-2 text-xs text-muted-foreground">CKYC Ref: {app.kyc.ckyc_ref}</Typography>}
              </Box>
            ) : <Empty text="Run assessment to verify KYC (PAN, Aadhaar, CKYC, DigiLocker)." />}
          </Card>
          <Card title="Document management (OCR)" icon={Upload}>
            <Box component="input" ref={docRef} type="file" hidden accept=".pdf,.png,.jpg,.jpeg" onChange={uploadDoc} data-testid="doc-input" />
            <Button variant="outline" className="rounded-sm mb-3" disabled={busy} onClick={() => docRef.current?.click()} data-testid="upload-doc-btn">
              {busy === "doc" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload doc (AI OCR)
            </Button>
            <Box className="space-y-2">
              {(app.documents || []).map((d) => (
                <Box key={d.id} className="border border-border rounded-sm p-3 text-sm">
                  <Typography variant="inherit" component="p" className="font-medium text-brand-navy">{d.type} · {d.filename}</Typography>
                  {d.ocr_data && Object.keys(d.ocr_data).length > 0 && (
                    <Typography variant="inherit" component="p" className="text-xs text-muted-foreground mt-1">OCR: {Object.entries(d.ocr_data).map(([k, v]) => `${k}: ${v}`).join(" · ")}</Typography>
                  )}
                </Box>
              ))}
              {(app.documents || []).length === 0 && <Empty text="No documents uploaded yet." />}
            </Box>
          </Card>
        </TabsContent>

        {/* BUREAU */}
        <TabsContent value="bureau" className="mt-4">
          {app.bureau?.score ? (
            <Box className="grid lg:grid-cols-3 gap-4">
              <Card title={`Bureau — ${app.bureau.provider}`} icon={Gauge}>
                <Box className="text-center py-4">
                  <Typography variant="inherit" component="p" className="font-head text-5xl font-black" style={{ color: SCORE_COLOR(app.bureau.score) }}>{app.bureau.score}</Typography>
                  <Typography variant="inherit" component="p" className="text-xs text-muted-foreground mt-1">Bureau score (300–900)</Typography>
                </Box>
                <Row k="Repayment history" v={`${app.bureau.repayment_history_pct}%`} />
                <Row k="Credit utilization" v={`${app.bureau.utilization_pct}%`} />
                <Row k="Credit mix" v={app.bureau.credit_mix} />
              </Card>
              <Card title="Obligations & conduct" icon={AlertTriangle}>
                <Row k="Active loans" v={app.bureau.active_loans} />
                <Row k="Total EMI" v={inr(app.bureau.total_emi)} />
                <Row k="Max DPD" v={`${app.bureau.dpd_max} days`} />
                <Row k="Enquiries (6m)" v={app.bureau.enquiries_6m} />
                <Row k="Written-off" v={app.bureau.written_off ? "Yes" : "No"} />
              </Card>
              <Card title="Trade lines" icon={FileText}>
                {(app.bureau.accounts || []).length ? app.bureau.accounts.map((a, i) => (
                  <Box key={i} className="border-b border-border last:border-0 py-2 text-sm">
                    <Box className="flex justify-between"><Box component="span" className="text-brand-navy font-medium">{a.type}</Box><Box component="span" className="text-muted-foreground">DPD {a.dpd}</Box></Box>
                    <Typography variant="inherit" component="p" className="text-xs text-muted-foreground">O/s {inr(a.outstanding)} · EMI {inr(a.emi)}</Typography>
                  </Box>
                )) : <Typography variant="inherit" component="p" className="text-sm text-muted-foreground">No active trade lines.</Typography>}
              </Card>
            </Box>
          ) : <Empty text="Bureau not pulled. Consent is captured on creation — run the assessment to fetch the CIBIL report." />}
        </TabsContent>

        {/* BANK & INCOME */}
        <TabsContent value="bank" className="mt-4 grid lg:grid-cols-2 gap-4">
          <Card title="Bank statement analyzer" icon={Landmark}>
            <Box component="input" ref={bankRef} type="file" hidden accept=".pdf,.csv,.txt" onChange={uploadBank} data-testid="bank-input" />
            <Button variant="outline" className="rounded-sm mb-3" disabled={busy} onClick={() => bankRef.current?.click()} data-testid="upload-bank-btn">
              {busy === "bank" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />} Upload statement (AI)
            </Button>
            {app.bank_analysis?.avg_monthly_balance !== undefined && Object.keys(app.bank_analysis).length ? (
              <>
                <Row k="Source" v={app.bank_analysis.source} />
                <Row k="Salary" v={inr(app.bank_analysis.salary)} />
                <Row k="Business income" v={inr(app.bank_analysis.business_income)} />
                <Row k="Existing EMIs" v={inr(app.bank_analysis.existing_emi)} />
                <Row k="Cheque bounces" v={app.bank_analysis.cheque_bounces} />
                <Row k="Avg monthly balance" v={inr(app.bank_analysis.avg_monthly_balance)} />
                <Row k="Income consistency" v={`${app.bank_analysis.income_consistency}%`} />
                <Row k="Repayment behaviour" v={app.bank_analysis.repayment_behaviour} />
              </>
            ) : <Empty text="Upload a statement or run assessment to auto-analyse income & conduct." />}
          </Card>
          <Card title="Income assessment engine" icon={TrendingUp}>
            {app.income_assessment?.eligible_income ? (
              <>
                <Row k="Eligible income" v={inr(app.income_assessment.eligible_income)} strong />
                <Row k="Existing obligations" v={inr(app.income_assessment.existing_obligations)} />
                <Row k="Disposable income" v={inr(app.income_assessment.disposable_income)} />
                <Row k="Repayment capacity" v={inr(app.income_assessment.repayment_capacity)} strong />
                {app.foir?.monthly_surplus !== undefined && <Row k="Monthly surplus (post-EMI)" v={inr(app.foir.monthly_surplus)} />}
              </>
            ) : <Empty text="Run assessment to compute eligible income & repayment capacity." />}
          </Card>
        </TabsContent>

        {/* SCORE & FOIR */}
        <TabsContent value="score" className="mt-4 grid lg:grid-cols-2 gap-4">
          <Card title="Biglyp Internal Credit Score" icon={Gauge}>
            {score ? (
              <>
                <Box className="text-center py-4">
                  <Typography variant="inherit" component="p" className="font-head text-6xl font-black" style={{ color: SCORE_COLOR(score) }}>{score}</Typography>
                  <Typography variant="inherit" component="p" className="text-xs text-muted-foreground">out of 1000 · <Box component="span" className="font-semibold">{app.internal_score.band}</Box></Typography>
                </Box>
                <Box className="space-y-2">
                  {Object.entries(app.internal_score.breakdown).map(([k, v]) => (
                    <Box key={k}>
                      <Box className="flex justify-between text-xs mb-1">
                        <Box component="span" className="capitalize text-muted-foreground">{k.replace(/_/g, " ")} <Box component="span" className="text-[10px]">({Math.round((app.internal_score.weights[k] || 0) * 100)}% wt)</Box></Box>
                        <Box component="span" className="text-brand-navy font-medium">{v}/100</Box>
                      </Box>
                      <Progress value={v} className="h-2" />
                    </Box>
                  ))}
                </Box>
              </>
            ) : <Empty text="Run assessment to compute the 0–1000 internal score." />}
          </Card>
          <Card title="FOIR calculator" icon={Percent}>
            {app.foir?.foir_pct !== undefined ? (
              <>
                <Box className="text-center py-4">
                  <Typography variant="inherit" component="p" className="font-head text-5xl font-black text-brand-navy">{app.foir.foir_pct}%</Typography>
                  <Typography variant="inherit" component="p" className="text-xs text-muted-foreground">Fixed Obligation to Income Ratio</Typography>
                </Box>
                <Row k="Monthly income" v={inr(app.foir.monthly_income)} />
                <Row k="Existing EMIs" v={inr(app.foir.existing_emi)} />
                <Row k="Proposed EMI" v={inr(app.foir.proposed_emi)} />
                <Row k="Monthly surplus" v={inr(app.foir.monthly_surplus)} strong />
              </>
            ) : <Empty text="Run assessment to compute FOIR." />}
          </Card>
        </TabsContent>

        {/* DECISION & LENDERS */}
        <TabsContent value="decision" className="mt-4 space-y-4">
          {dec.status ? (
            <>
              <Box className="bg-white border border-border rounded-sm p-6">
                <Box className="flex items-center justify-between">
                  <Box>
                    <Typography variant="inherit" component="p" className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Eligibility decision</Typography>
                    <Typography variant="inherit" component="p" className="font-head text-2xl font-black text-brand-navy mt-1">{dec.status}</Typography>
                  </Box>
                  <Badge className={`rounded-sm text-sm ${DEC_STYLE[dec.status]}`}>{dec.status}</Badge>
                </Box>
                <Box component="ul" className="mt-4 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  {(dec.reasons || []).map((r, i) => <Box component="li" key={i}>{r}</Box>)}
                </Box>
                {dec.recommended_lender_name && (
                  <Box className="mt-4 bg-brand-tint rounded-sm p-4 flex items-center gap-3">
                    <Landmark className="h-5 w-5 text-brand-blue" />
                    <Typography variant="inherit" component="p" className="text-sm text-brand-navy">Best lender recommendation: <b>{dec.recommended_lender_name}</b> (highest approval probability)</Typography>
                  </Box>
                )}
              </Box>
              <Box className="bg-white border border-border rounded-sm overflow-hidden">
                <Box className="p-4 border-b border-border bg-muted/30"><Typography variant="inherit" component="h3" className="font-head font-bold text-brand-navy">Lender-by-lender policy match</Typography></Box>
                <Box component="table" className="w-full text-sm">
                  <Box component="thead"><tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                    <Box component="th" className="p-3">Lender</Box><Box component="th" className="p-3">Rate</Box><Box component="th" className="p-3">Result</Box><Box component="th" className="p-3">Approval prob.</Box><Box component="th" className="p-3">Failed rules</Box><Box component="th" className="p-3"></Box>
                  </Box></Box>
                  <Box component="tbody">
                    {(dec.per_lender || []).map((e) => (
                      <Box component="tr" key={e.lender_id} className="border-b border-border last:border-0" data-testid={`lender-${e.lender_id}`}>
                        <Box component="td" className="p-3"><Box component="span" className="font-medium text-brand-navy">{e.lender_name}</Box> <Box component="span" className="text-xs text-muted-foreground">({e.lender_type})</Box></Box>
                        <Box component="td" className="p-3">{e.interest_rate}%</Box>
                        <Box component="td" className="p-3">{e.passed ? <Badge className="bg-green-100 text-green-700 rounded-sm">Pass</Badge> : <Badge className="bg-red-100 text-red-700 rounded-sm">Fail</Badge>}</Box>
                        <Box component="td" className="p-3">
                          <Box className="flex items-center gap-2">
                            <Box className="w-16 h-2 bg-muted rounded-sm overflow-hidden"><Box className="h-full bg-brand-blue" style={{ width: `${e.approval_probability * 100}%` }} /></Box>
                            <Box component="span" className="text-xs">{Math.round(e.approval_probability * 100)}%</Box>
                          </Box>
                        </Box>
                        <Box component="td" className="p-3 text-xs text-muted-foreground max-w-xs">{e.failed_rules?.length ? e.failed_rules.join("; ") : "—"}</Box>
                        <Box component="td" className="p-3">
                          {wf.stage === "lender_submission" && !isLenderView(user) && (
                            <Button size="sm" variant="outline" className="rounded-sm" disabled={busy} onClick={() => submitLender(e.lender_id)} data-testid={`submit-lender-${e.lender_id}`}>Submit</Button>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </>
          ) : <Empty text="Run assessment to classify (Approved / Conditional / Refer / Reject) and rank lenders." />}
        </TabsContent>

        {/* PRICING */}
        <TabsContent value="pricing" className="mt-4 grid lg:grid-cols-2 gap-4">
          {pr.loan_amount ? (
            <>
              <Card title="Loan pricing engine" icon={CreditCard}>
                <Row k="Recommended lender" v={pr.recommended_lender || "—"} />
                <Row k="Interest rate (IIR)" v={`${pr.interest_rate}% p.a.`} />
                <Row k="Full EMI (at rate)" v={inr(pr.full_emi)} />
                <Row k="Parent EMI (after subvention)" v={inr(pr.parent_emi)} strong />
                <Row k="Total interest" v={inr(pr.total_interest)} />
                <Row k="Processing fee" v={inr(pr.processing_fee)} />
              </Card>
              <Card title="Subvention & payouts" icon={Landmark}>
                <Row k="Subvention model" v={`${(pr.subvention_model || "").replace(/_/g, " ")} (${pr.school_share_pct}% school)`} />
                <Row k="School subvention cost" v={inr(pr.subvention_cost)} />
                <Row k="Parent contribution (interest)" v={inr(pr.parent_contribution)} />
                <Row k="School payout" v={inr(pr.school_payout)} strong />
                <Row k="Lender yield" v={inr(pr.lender_yield)} />
                <Row k="Biglyp revenue" v={inr(pr.biglyp_revenue)} strong />
              </Card>
            </>
          ) : <Empty text="Run assessment to compute EMI, IIR, subvention, payouts and revenue." />}
        </TabsContent>

        {/* FRAUD */}
        <TabsContent value="fraud" className="mt-4">
          <Card title="Fraud & risk engine" icon={AlertTriangle}>
            {app.fraud?.risk_level ? (
              <>
                <Box className="flex items-center gap-3 mb-4">
                  <Box component="span" className="text-sm text-muted-foreground">Risk level</Box>
                  <Badge className={`rounded-sm ${RISK_STYLE[app.fraud.risk_level]}`}>{app.fraud.risk_level}</Badge>
                </Box>
                {app.fraud.flags?.length ? (
                  <Box component="ul" className="space-y-2">
                    {app.fraud.flags.map((f, i) => (
                      <Box component="li" key={i} className="flex items-start gap-2 text-sm border border-red-100 bg-red-50 rounded-sm px-3 py-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" /> <Box component="span" className="text-red-700">{f}</Box>
                      </Box>
                    ))}
                  </Box>
                ) : <Typography variant="inherit" component="p" className="text-sm text-green-700 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> No fraud signals detected (duplicate PAN/mobile, tampering, velocity, statement anomalies).</Typography>}
              </>
            ) : <Empty text="Run assessment to screen for fraud & risk signals." />}
          </Card>
        </TabsContent>

        {/* WORKFLOW */}
        <TabsContent value="workflow" className="mt-4 grid lg:grid-cols-2 gap-4">
          <Card title="Maker-Checker workflow" icon={GitBranch}>
            <Row k="Stage" v={(wf.stage || "maker").replace(/_/g, " ")} />
            <Row k="Maker" v={wf.maker || "—"} />
            <Row k="Checker" v={wf.checker || "—"} />
            {wf.checker_decision && <Row k="Checker decision" v={wf.checker_decision} />}
            {wf.submitted_lender_name && <Row k="Submitted to" v={wf.submitted_lender_name} />}
            {wf.lender_status && <Row k="Lender status" v={wf.lender_status} strong />}
            <Box className="flex flex-wrap gap-2 mt-4">
              {(!wf.stage || wf.stage === "maker") && (
                <Button disabled={busy || !dec.status} onClick={makerSubmit} className="rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="maker-submit-btn">
                  <Send className="h-4 w-4 mr-2" /> Maker: submit to checker
                </Button>
              )}
              {wf.stage === "checker" && isAdmin && (
                <>
                  <Button disabled={busy} onClick={() => checker("approve")} className="rounded-sm bg-green-600 hover:bg-green-700" data-testid="checker-approve-btn"><CheckCircle2 className="h-4 w-4 mr-2" /> Approve</Button>
                  <Button disabled={busy} onClick={() => checker("reject")} variant="outline" className="rounded-sm text-red-600 border-red-300" data-testid="checker-reject-btn"><XCircle className="h-4 w-4 mr-2" /> Reject</Button>
                </>
              )}
              {wf.stage === "checker" && !isAdmin && <Typography variant="inherit" component="p" className="text-xs text-muted-foreground">Awaiting checker (credit ops / admin) review.</Typography>}
              {wf.stage === "lender_submission" && <Typography variant="inherit" component="p" className="text-xs text-muted-foreground">Approved by checker — submit to a lender from the Decision tab.</Typography>}
            </Box>
          </Card>
          <Card title="Audit trail" icon={ScrollText}>
            <Box className="space-y-2 max-h-80 overflow-y-auto">
              {audit.map((e) => (
                <Box key={e.id} className="text-xs border-b border-border pb-2">
                  <Typography variant="inherit" component="p" className="font-medium text-brand-navy capitalize">{e.action.replace(/_/g, " ")}</Typography>
                  <Typography variant="inherit" component="p" className="text-muted-foreground">{e.actor} · {new Date(e.timestamp).toLocaleString("en-IN")}</Typography>
                </Box>
              ))}
              {audit.length === 0 && <Empty text="No activity yet." />}
            </Box>
          </Card>
        </TabsContent>
      </Tabs>
    </CreditLayout>
  );
}

function isLenderView(user) { return user?.role === "lender"; }

function Card({ title, icon: Icon, children }) {
  return (
    <Box className="bg-white border border-border rounded-sm p-6">
      <Box className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-brand-blue" />
        <Typography variant="inherit" component="h3" className="font-head font-bold text-brand-navy">{title}</Typography>
      </Box>
      {children}
    </Box>
  );
}
function Empty({ text }) {
  return <Typography variant="inherit" component="p" className="text-sm text-muted-foreground py-6 text-center">{text}</Typography>;
}
