import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditLayout } from "@/components/CreditLayout";
import api, { inr } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";

const DECISION_STYLE = {
  Approved: "bg-green-100 text-green-700",
  "Conditional Approval": "bg-blue-100 text-blue-700",
  Refer: "bg-amber-100 text-amber-700",
  Reject: "bg-red-100 text-red-700",
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => { api.get("/credit/applications").then(({ data }) => setApps(data)).catch(() => {}); }, []);

  const filtered = apps.filter((a) =>
    [a.app_no, a.applicant?.name, a.student?.name].join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <CreditLayout title="Loan Applications" subtitle={`${apps.length} applications`}>
      <div className="relative mb-4 max-w-sm">
        <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or app no."
          className="pl-9 rounded-sm" data-testid="app-search" />
      </div>
      <div className="bg-white border border-border rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
              <th className="p-4 font-medium">Application</th>
              <th className="p-4 font-medium">Applicant / Student</th>
              <th className="p-4 font-medium">Loan</th>
              <th className="p-4 font-medium">Score</th>
              <th className="p-4 font-medium">Decision</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer"
                onClick={() => navigate(`/credit/app/${a.id}`)} data-testid={`app-row-${a.id}`}>
                <td className="p-4"><span className="font-mono text-xs font-semibold text-brand-navy">{a.app_no}</span></td>
                <td className="p-4">
                  <p className="font-medium text-brand-navy">{a.applicant?.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{a.student?.name} {a.student?.grade && `· ${a.student.grade}`}</p>
                </td>
                <td className="p-4 font-semibold text-brand-navy">{inr(a.fee?.loan_amount)}</td>
                <td className="p-4">{a.internal_score?.score ? <span className="font-head font-bold text-brand-navy">{a.internal_score.score}</span> : <span className="text-muted-foreground text-xs">—</span>}</td>
                <td className="p-4">
                  {a.decision?.status ? <Badge className={`rounded-sm ${DECISION_STYLE[a.decision.status] || "bg-muted"}`}>{a.decision.status}</Badge>
                    : <span className="text-muted-foreground text-xs">Pending</span>}
                </td>
                <td className="p-4"><span className="text-xs capitalize text-muted-foreground">{(a.status || "").replace(/_/g, " ")}</span></td>
                <td className="p-4"><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">No applications found.</td></tr>}
          </tbody>
        </table>
      </div>
    </CreditLayout>
  );
}
