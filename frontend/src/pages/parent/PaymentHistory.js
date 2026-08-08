import { useEffect, useState } from "react";
import { ParentLayout } from "@/components/ParentLayout";
import api, { inr } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Receipt, ShieldCheck } from "lucide-react";

export default function PaymentHistory() {
  const [children, setChildren] = useState([]);
  const [active, setActive] = useState(null);
  const [payments, setPayments] = useState([]);

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

  return (
    <ParentLayout>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-brand-blue font-semibold">Payment History</p>
          <h1 className="font-head text-3xl font-black tracking-tight text-brand-navy mt-1">Transactions</h1>
        </div>
        {children.length > 1 && (
          <Select value={active || ""} onValueChange={setActive}>
            <SelectTrigger className="w-56 rounded-sm"><SelectValue /></SelectTrigger>
            <SelectContent>{children.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        )}
      </div>

      <div className="bg-white border border-border rounded-sm overflow-hidden">
        <div className="divide-y divide-border">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-muted/30" data-testid={`payment-${p.id}`}>
              <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${p.financing ? "bg-brand-navy" : "bg-brand-tint"}`}>
                {p.financing ? <ShieldCheck className="h-5 w-5 text-white" /> : <Receipt className="h-5 w-5 text-brand-navy" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-brand-navy text-sm truncate">
                  {p.items?.map((i) => i.name).join(", ")}
                </p>
                <p className="text-xs text-muted-foreground">{p.receipt_no} · {fmtDate(p.created_at)}</p>
              </div>
              <div className="text-right">
                <p className="font-head font-bold text-brand-navy">{inr(p.amount)}</p>
                <Badge variant="secondary" className="rounded-sm text-[10px] mt-1">{p.mode}</Badge>
              </div>
            </div>
          ))}
          {payments.length === 0 && (
            <div className="p-12 text-center">
              <Receipt className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="mt-3 text-muted-foreground text-sm">No transactions yet.</p>
            </div>
          )}
        </div>
      </div>
    </ParentLayout>
  );
}
