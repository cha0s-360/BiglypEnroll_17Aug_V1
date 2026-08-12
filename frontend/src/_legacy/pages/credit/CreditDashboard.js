import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditLayout } from "@/components/CreditLayout";
import api, { inr } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  FileText, CheckCircle2, XCircle, Clock, Wallet, Gauge, FilePlus2, TrendingUp,
} from "lucide-react";

const COLORS = { Approved: "#16a34a", "Conditional Approval": "#2540E8", Refer: "#f59e0b", Reject: "#dc2626", Pending: "#94a3b8" };
const PIE = ["#2540E8", "#1E2A78", "#16a34a", "#f59e0b", "#dc2626", "#06b6d4"];

function Kpi({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white border border-border rounded-sm p-5" data-testid={`ckpi-${label.replace(/\s/g, "-").toLowerCase()}`}>
      <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${accent}`}><Icon className="h-5 w-5 text-white" /></div>
      <p className="mt-4 font-head text-2xl font-extrabold text-brand-navy">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export default function CreditDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { api.get("/credit/dashboard").then(({ data }) => setData(data)).catch(() => {}); }, []);

  if (!data) return <CreditLayout title="Credit Dashboard"><div className="h-64 flex items-center justify-center"><div className="h-8 w-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" /></div></CreditLayout>;
  const k = data.kpis;

  return (
    <CreditLayout title="Credit Dashboard" subtitle="Pre-credit assessment & loan origination performance">
      <div className="flex justify-end mb-4">
        <Button onClick={() => navigate("/credit/new")} className="rounded-sm bg-brand-blue hover:bg-brand-navy" data-testid="dash-new-app">
          <FilePlus2 className="h-4 w-4 mr-2" /> New loan application
        </Button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={FileText} label="Total applications" value={k.total} accent="bg-brand-navy" />
        <Kpi icon={CheckCircle2} label="Approval rate" value={`${k.approval_rate}%`} accent="bg-green-600" />
        <Kpi icon={Wallet} label="Sanctioned amount" value={inr(k.sanction_amount)} accent="bg-brand-blue" />
        <Kpi icon={Gauge} label="Avg internal score" value={`${k.avg_internal_score}/1000`} accent="bg-brand-sky" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Kpi icon={CheckCircle2} label="Approved" value={k.approved} accent="bg-green-600" />
        <Kpi icon={Clock} label="Referred" value={k.referred} accent="bg-amber-500" />
        <Kpi icon={XCircle} label="Rejected" value={k.rejected} accent="bg-red-600" />
        <Kpi icon={TrendingUp} label="Requested amount" value={inr(k.requested_amount)} accent="bg-brand-navy" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="bg-white border border-border rounded-sm p-6" data-testid="chart-decision">
          <h3 className="font-head font-bold text-brand-navy mb-4">Decision distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.decision_dist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                {data.decision_dist.map((d, i) => <Cell key={i} fill={COLORS[d.name] || PIE[i % PIE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {data.decision_dist.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[d.name] || PIE[i % PIE.length] }} />{d.name}</span>
                <span className="font-semibold text-brand-navy">{d.value}</span>
              </div>
            ))}
            {data.decision_dist.length === 0 && <p className="text-xs text-muted-foreground">No decisions yet.</p>}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-border rounded-sm p-6" data-testid="chart-lender">
          <h3 className="font-head font-bold text-brand-navy mb-1">Lender-wise recommendations</h3>
          <p className="text-xs text-muted-foreground mb-4">Times recommended & avg approval probability</p>
          {data.lender_performance.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.lender_performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="lender" tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="recommended" name="Recommended" fill="#2540E8" radius={[2, 2, 0, 0]} />
                <Bar dataKey="avg_prob" name="Avg prob %" fill="#1E2A78" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground py-10 text-center">Run an assessment to populate lender analytics.</p>}
        </div>
      </div>

      {data.school_distribution.length > 0 && (
        <div className="bg-white border border-border rounded-sm p-6 mt-4">
          <h3 className="font-head font-bold text-brand-navy mb-4">School-wise applications</h3>
          <div className="flex flex-wrap gap-3">
            {data.school_distribution.map((s) => (
              <div key={s.school} className="border border-border rounded-sm px-4 py-3">
                <p className="font-head font-bold text-brand-navy text-lg">{s.applications}</p>
                <p className="text-xs text-muted-foreground">{s.school}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </CreditLayout>
  );
}
