import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ParentLayout } from "@/components/ParentLayout";
import api, { inr } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Wallet, CalendarClock, Percent, Search, FileDown, Download,
  ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight, Banknote,
} from "lucide-react";

const STATUS_META = {
  paid: { label: "Paid", cls: "bg-[#DCFCE7] text-[#166534]" },
  scheduled: { label: "Auto-Debit Scheduled", cls: "bg-[#DBEAFE] text-[#1E40AF]" },
  upcoming: { label: "Upcoming", cls: "bg-slate-100 text-[#374151]" },
  failed: { label: "Failed", cls: "bg-red-100 text-red-700" },
};

function StatusPill({ status }) {
  const m = STATUS_META[status] || STATUS_META.upcoming;
  return <span className={`inline-flex items-center rounded-full text-[11px] font-semibold px-2.5 py-1 ${m.cls}`}>{m.label}</span>;
}

function printDoc(title, bodyHtml) {
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) { toast.error("Please allow pop-ups to download the document."); return; }
  w.document.write(`<html><head><title>${title}</title>
    <style>body{font-family:Arial,Helvetica,sans-serif;color:#0A0F2C;padding:40px;}
    h1{color:#1E2A78;font-size:22px;margin-bottom:4px;} .muted{color:#64748b;font-size:12px;}
    table{width:100%;border-collapse:collapse;margin-top:16px;font-size:13px;}
    td,th{border:1px solid #E2E8F0;padding:8px 10px;text-align:left;}
    .badge{display:inline-block;background:#EEF0FF;color:#5548D1;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;}
    .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eef2f7;font-size:13px;}
    </style></head><body>${bodyHtml}</body></html>`);
  w.document.close(); w.focus();
  setTimeout(() => { try { w.print(); } catch (e) { /* noop */ } }, 350);
}

export default function ActiveFinancing() {
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(null);
  const [plans, setPlans] = useState([]);
  const [planId, setPlanId] = useState(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyMonth, setBusyMonth] = useState(null);

  useEffect(() => {
    api.get("/parent/children").then(({ data }) => {
      setChildren(data);
      if (data[0]) setActiveChild(data[0].id);
    });
  }, []);

  const loadPlans = (childId) => api.get(`/parent/financing/active/${childId}`).then(({ data }) => {
    setPlans(data);
    setPlanId(data[0]?.id || null);
  });

  useEffect(() => { if (activeChild) loadPlans(activeChild); }, [activeChild]);

  const plan = plans.find((p) => p.id === planId) || plans[0];
  const schedule = useMemo(() => plan?.schedule || [], [plan]);

  const financed = plan?.financed_amount ?? plan?.amount ?? 0;
  const emi = plan?.emi ?? 0;
  const tenure = plan?.tenure ?? schedule.length;
  const nextDebit = schedule.find((s) => s.status === "scheduled") || schedule.find((s) => s.status !== "paid");
  const failedRows = schedule.filter((s) => s.status === "failed");

  const rows = useMemo(() => {
    return schedule.filter((s) => {
      const matchQ = !q || String(s.month).includes(q.replace(/[^0-9]/g, "")) || (s.label || "").toLowerCase().includes(q.toLowerCase());
      const matchS =
        statusFilter === "all" ? true
          : statusFilter === "paid" ? s.status === "paid"
          : statusFilter === "failed" ? s.status === "failed"
          : /* upcoming */ (s.status === "upcoming" || s.status === "scheduled");
      return matchQ && matchS;
    });
  }, [schedule, q, statusFilter]);

  const payEmi = async (month) => {
    setBusyMonth(month);
    try {
      await api.post("/parent/financing/pay-emi", { payment_id: plan.id, month, mode: "UPI" });
      await loadPlans(activeChild);
      toast.success(`EMI #${month} paid successfully`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Payment failed");
    } finally {
      setBusyMonth(null);
    }
  };

  const downloadAgreement = () => {
    const rowsHtml = schedule.map((s) => `<tr><td>${s.label}</td><td>${s.due_date}</td><td>${inr(s.amount)}</td><td>${s.rail || "-"}</td><td>${(STATUS_META[s.status] || {}).label || s.status}</td></tr>`).join("");
    printDoc("Loan Agreement", `
      <h1>0% Interest Fee Financing — Loan Agreement</h1>
      <p class="muted">Plan ${plan.receipt_no} · ${plan.student_name} · ${plan.academic_year}</p>
      <span class="badge">RBI-regulated NBFC lending partner</span>
      <div style="margin-top:16px">
        <div class="row"><span>Total financed amount</span><b>${inr(financed)}</b></div>
        <div class="row"><span>Tenure</span><b>${tenure} months</b></div>
        <div class="row"><span>Monthly EMI</span><b>${inr(emi)}</b></div>
        <div class="row"><span>Interest rate</span><b>0% p.a.</b></div>
      </div>
      <h3 style="margin-top:20px">Repayment Schedule</h3>
      <table><thead><tr><th>Installment</th><th>Due Date</th><th>Amount</th><th>Rail</th><th>Status</th></tr></thead><tbody>${rowsHtml}</tbody></table>
      <p class="muted" style="margin-top:24px">This is a system-generated agreement summary. School is paid 100% upfront. Simulated for demo.</p>
    `);
  };

  const downloadReceipt = (s) => {
    printDoc("EMI Receipt", `
      <h1>EMI Payment Receipt</h1>
      <p class="muted">Receipt ${s.receipt_no || plan.receipt_no}</p>
      <div style="margin-top:16px">
        <div class="row"><span>Student</span><b>${plan.student_name}</b></div>
        <div class="row"><span>Installment</span><b>${s.label}</b></div>
        <div class="row"><span>Due date</span><b>${s.due_date}</b></div>
        <div class="row"><span>Amount</span><b>${inr(s.amount)}</b></div>
        <div class="row"><span>Payment rail</span><b>${s.rail || "-"}</b></div>
        <div class="row"><span>Status</span><b>Paid</b></div>
      </div>
      <p class="muted" style="margin-top:24px">Simulated receipt for demo purposes.</p>
    `);
  };

  return (
    <ParentLayout>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#5548D1] font-semibold">Active Financing Schedule</p>
          <h1 className="font-head text-3xl font-black tracking-tight text-brand-navy mt-1">0% EMI Repayment</h1>
        </div>
        <div className="flex items-center gap-2">
          {children.length > 1 && (
            <Select value={activeChild || ""} onValueChange={setActiveChild}>
              <SelectTrigger className="w-48 rounded-lg" data-testid="fin-child-select"><SelectValue /></SelectTrigger>
              <SelectContent>{children.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          )}
          {plans.length > 1 && (
            <Select value={planId || ""} onValueChange={setPlanId}>
              <SelectTrigger className="w-52 rounded-lg" data-testid="fin-plan-select"><SelectValue /></SelectTrigger>
              <SelectContent>{plans.map((p) => <SelectItem key={p.id} value={p.id}>{p.receipt_no} · {inr(p.amount)}</SelectItem>)}</SelectContent>
            </Select>
          )}
        </div>
      </div>

      {!plan ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center" data-testid="no-financing">
          <Wallet className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="mt-4 font-head font-bold text-brand-navy text-lg">No active financing plan</p>
          <p className="text-sm text-slate-500 mt-1">Split academic fees into 0% EMIs from the Pay Fees tab.</p>
          <Link to="/app" className="inline-flex items-center gap-1.5 mt-4 text-sm text-[#5548D1] font-semibold hover:underline">
            Go to Pay Fees <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid sm:grid-cols-3 gap-4" data-testid="fin-kpis">
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-[0.12em]"><Wallet className="h-4 w-4 text-[#5548D1]" /> Total Financed Fee</div>
              <p className="font-head text-3xl font-black text-brand-navy mt-3">{inr(financed)}</p>
              <p className="text-xs text-slate-500 mt-1">100% Disbursed to School</p>
            </div>
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-[0.12em]"><Percent className="h-4 w-4 text-[#5548D1]" /> Monthly EMI Amount</div>
              <p className="font-head text-3xl font-black text-brand-navy mt-3">{inr(emi)}<span className="text-base font-bold text-slate-400">/mo</span></p>
              <p className="text-xs text-slate-500 mt-1">Tenure: {tenure} Months @ 0% Interest</p>
            </div>
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-[0.12em]"><CalendarClock className="h-4 w-4 text-[#5548D1]" /> Next Auto-Debit</div>
              <p className="font-head text-3xl font-black text-brand-navy mt-3">{nextDebit ? nextDebit.due_date : "—"}</p>
              {nextDebit
                ? <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] text-[#166534] text-[11px] font-semibold px-2.5 py-1 mt-2"><ShieldCheck className="h-3 w-3" /> UPI AutoPay Active</span>
                : <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] text-[#166534] text-[11px] font-semibold px-2.5 py-1 mt-2"><CheckCircle2 className="h-3 w-3" /> Fully Repaid</span>}
            </div>
          </div>

          {/* Failed fail-safe callout */}
          {failedRows.length > 0 && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 flex items-start gap-3" data-testid="failed-callout">
              <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0"><AlertTriangle className="h-5 w-5" /></div>
              <div className="flex-1">
                <p className="font-semibold text-red-700">Auto-debit failed for {failedRows.length} installment{failedRows.length > 1 ? "s" : ""}</p>
                <p className="text-sm text-red-600/90 mt-0.5">Clear the overdue instalment now via manual UPI — <b>no late penalty</b> is charged.</p>
              </div>
              <Button onClick={() => payEmi(failedRows[0].month)} disabled={busyMonth === failedRows[0].month}
                data-testid="failsafe-pay-btn" className="h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold">
                <Banknote className="h-4 w-4 mr-1.5" /> Pay {failedRows[0].label} Now
              </Button>
            </div>
          )}

          {/* Ledger */}
          <div className="mt-6 bg-white border border-border rounded-2xl overflow-hidden">
            {/* actions bar */}
            <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by EMI #"
                  className="rounded-lg pl-9" data-testid="emi-search" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 rounded-lg" data-testid="status-filter"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={downloadAgreement} data-testid="download-agreement-btn"
                className="h-10 rounded-lg border-[#5548D1] text-[#5548D1] hover:bg-[#EEF0FF] font-semibold">
                <FileDown className="h-4 w-4 mr-1.5" /> Download Loan Agreement (PDF)
              </Button>
            </div>

            {/* table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="ledger-table">
                <thead>
                  <tr className="bg-[#F8FAFC] text-slate-500 text-xs uppercase tracking-[0.1em]">
                    <th className="text-left font-semibold px-4 py-3">Installment No.</th>
                    <th className="text-left font-semibold px-4 py-3">Scheduled Due Date</th>
                    <th className="text-left font-semibold px-4 py-3">Amount</th>
                    <th className="text-left font-semibold px-4 py-3">Payment Rail</th>
                    <th className="text-left font-semibold px-4 py-3">Status</th>
                    <th className="text-right font-semibold px-4 py-3">Action / Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((s) => (
                    <tr key={s.month} className="hover:bg-slate-50/60" data-testid={`emi-row-${s.month}`}>
                      <td className="px-4 py-3 font-semibold text-brand-navy">{s.label}</td>
                      <td className="px-4 py-3 text-slate-600">{s.due_date}</td>
                      <td className="px-4 py-3 font-semibold text-brand-navy">{inr(s.amount)}</td>
                      <td className="px-4 py-3 text-slate-600">{s.rail || "—"}</td>
                      <td className="px-4 py-3"><StatusPill status={s.status} /></td>
                      <td className="px-4 py-3 text-right">
                        {s.status === "paid" ? (
                          <button onClick={() => downloadReceipt(s)} data-testid={`receipt-${s.month}`}
                            className="inline-flex items-center gap-1.5 text-[#5548D1] font-semibold hover:underline">
                            <Download className="h-4 w-4" /> Download Receipt
                          </button>
                        ) : s.status === "scheduled" || s.status === "failed" ? (
                          <Button variant="outline" onClick={() => payEmi(s.month)} disabled={busyMonth === s.month}
                            data-testid={`paynow-${s.month}`}
                            className="h-9 rounded-lg border-[#5548D1] text-[#5548D1] hover:bg-[#EEF0FF] font-semibold">
                            {busyMonth === s.month ? "Paying..." : "Pay Now Upfront"}
                          </Button>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No installments match your filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </ParentLayout>
  );
}
