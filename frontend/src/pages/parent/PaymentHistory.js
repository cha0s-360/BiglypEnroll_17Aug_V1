import { useEffect, useState } from "react";
import { ParentLayout } from "@/components/ParentLayout";
import api, { inr } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Receipt, ShieldCheck, CalendarClock, Calendar, ChevronDown, ChevronUp, CheckCircle2, Clock,
} from "lucide-react";

export default function PaymentHistory() {
  const [children, setChildren] = useState([]);
  const [active, setActive] = useState(null);
  const [payments, setPayments] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    api.get("/parent/children").then(({ data }) => {
      setChildren(data);
      if (data[0]) setActive(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    api.get(`/parent/payments/${active}`).then(({ data }) => setPayments(data));
  }, [active]);

  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return "—"; }
  };

  const toggle = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const planPayments = payments.filter((p) => p.schedule && p.schedule.length);
  const totalUpcoming = planPayments.reduce(
    (sum, p) => sum + (p.schedule || []).filter((s) => s.status !== "paid").reduce((a, s) => a + (s.amount || 0), 0),
    0,
  );

  const planLabel = (p) => {
    if (p.plan_type === "EMI") return `0% EMI · ${p.tenure} months`;
    if (p.plan_type === "AutoDebit") return `Auto-Debit · ${p.installments} installments`;
    return p.mode;
  };

  return (
    <ParentLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#5548D1] font-semibold">Payment History</p>
          <h1 className="font-head text-3xl font-black tracking-tight text-brand-navy mt-1">Transactions &amp; Schedule</h1>
        </div>
        {children.length > 1 && (
          <Select value={active || ""} onValueChange={setActive}>
            <SelectTrigger className="w-56 rounded-lg"><SelectValue /></SelectTrigger>
            <SelectContent>{children.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        )}
      </div>

      {/* Upcoming schedule summary */}
      {planPayments.length > 0 && (
        <div className="mb-6 rounded-2xl bg-[#EEF0FF] border border-[#5548D1]/15 p-5 flex items-center gap-4" data-testid="upcoming-summary">
          <div className="h-11 w-11 rounded-xl bg-[#5548D1] text-white flex items-center justify-center shrink-0">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-brand-navy">Upcoming scheduled dues</p>
            <p className="text-xs text-slate-500 mt-0.5">Across your EMI &amp; auto-debit plans. Reminders sent before each debit.</p>
          </div>
          <span className="font-head text-2xl font-black text-[#5548D1]">{inr(totalUpcoming)}</span>
        </div>
      )}

      <div className="space-y-3">
        {payments.map((p) => {
          const hasSchedule = p.schedule && p.schedule.length;
          const isOpen = !!expanded[p.id];
          return (
            <div key={p.id} className="bg-white border border-border rounded-2xl overflow-hidden" data-testid={`payment-${p.id}`}>
              <div className="flex items-center gap-4 p-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${p.financing ? "bg-brand-navy" : p.auto_debit ? "bg-[#5548D1]" : "bg-[#EEF0FF]"}`}>
                  {p.financing ? <ShieldCheck className="h-5 w-5 text-white" />
                    : p.auto_debit ? <CalendarClock className="h-5 w-5 text-white" />
                    : <Receipt className="h-5 w-5 text-[#5548D1]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-navy text-sm truncate">
                    {p.items?.map((i) => i.name).join(", ")}
                  </p>
                  <p className="text-xs text-slate-500">{p.receipt_no} · {fmtDate(p.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-head font-bold text-brand-navy">{inr(p.amount)}</p>
                  <Badge variant="secondary" className="rounded-full text-[10px] mt-1">{planLabel(p)}</Badge>
                </div>
                {hasSchedule ? (
                  <button
                    onClick={() => toggle(p.id)}
                    data-testid={`toggle-schedule-${p.id}`}
                    className="ml-1 h-9 w-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                    title="View schedule"
                  >
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                ) : <span className="w-9" />}
              </div>

              {/* EMI / installment schedule */}
              {hasSchedule && isOpen && (
                <div className="border-t border-border bg-[#F8FAFC] px-4 py-3" data-testid={`schedule-${p.id}`}>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-2">
                    {p.plan_type === "EMI" ? "Monthly EMI Schedule" : "Installment Schedule"}
                  </p>
                  <div className="rounded-xl border border-border divide-y divide-border bg-white">
                    {p.schedule.map((s) => {
                      const paid = s.status === "paid";
                      return (
                        <div key={s.month} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                          <span className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${paid ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}>
                            {paid ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          </span>
                          <span className="w-14 text-xs font-semibold text-brand-navy">{s.label || `#${s.month}`}</span>
                          <span className="flex-1 flex items-center gap-1.5 text-slate-500 text-xs">
                            <Calendar className="h-3.5 w-3.5" /> {s.due_date}
                          </span>
                          <span className="font-semibold text-brand-navy">{inr(s.amount)}</span>
                          <Badge className={`rounded-full text-[10px] ${paid ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}`}>
                            {paid ? "Paid" : "Upcoming"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {payments.length === 0 && (
          <div className="bg-white border border-border rounded-2xl p-12 text-center">
            <Receipt className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="mt-3 text-slate-500 text-sm">No transactions yet.</p>
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
