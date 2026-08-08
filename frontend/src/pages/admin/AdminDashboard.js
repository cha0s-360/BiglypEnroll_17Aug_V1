import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import api, { inr } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import {
  Wallet, TrendingUp, AlertTriangle, Users, ArrowUpRight, Landmark,
} from "lucide-react";

const COLORS = ["#2540E8", "#1E2A78", "#3B82F6", "#8B5CF6", "#06B6D4"];

function Kpi({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white border border-border rounded-sm p-5" data-testid={`kpi-${label.replace(/\s/g, "-").toLowerCase()}`}>
      <div className="flex items-center justify-between">
        <div className={`h-10 w-10 rounded-sm flex items-center justify-center ${accent}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-4 font-head text-2xl font-extrabold text-brand-navy">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics/overview").then(({ data }) => setData(data)).catch(() => {});
  }, []);

  if (!data) {
    return (
      <DashboardLayout title="Analytics">
        <div className="h-64 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const k = data.kpis;

  return (
    <DashboardLayout title="Analytics">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={Wallet} label="Total collected" value={inr(k.total_collected)} accent="bg-brand-blue" />
        <Kpi icon={Landmark} label="Financed disbursals" value={inr(k.financed_disbursals)} accent="bg-brand-navy" />
        <Kpi icon={AlertTriangle} label="Outstanding dues" value={inr(k.outstanding)} accent="bg-brand-sky" />
        <Kpi icon={Users} label="Students enrolled" value={k.total_students} accent="bg-brand-navy" />
      </div>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        {/* Monthly trend */}
        <div className="lg:col-span-2 bg-white border border-border rounded-sm p-6" data-testid="chart-trend">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-head font-bold text-brand-navy text-lg">Collection velocity</h3>
              <p className="text-xs text-muted-foreground">Fees collected over the last 6 months</p>
            </div>
            <TrendingUp className="h-5 w-5 text-brand-blue" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.monthly_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => inr(v)} />
              <Line type="monotone" dataKey="collected" stroke="#2540E8" strokeWidth={3} dot={{ r: 4, fill: "#1E2A78" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mode split */}
        <div className="bg-white border border-border rounded-sm p-6" data-testid="chart-modes">
          <h3 className="font-head font-bold text-brand-navy text-lg mb-1">Payment modes</h3>
          <p className="text-xs text-muted-foreground mb-4">Split by collection channel</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.mode_split} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {data.mode_split.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => inr(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {data.mode_split.map((m, i) => (
              <div key={m.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                  {m.name}
                </span>
                <span className="font-semibold text-brand-navy">{inr(m.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        {/* Aging */}
        <div className="bg-white border border-border rounded-sm p-6" data-testid="chart-aging">
          <h3 className="font-head font-bold text-brand-navy text-lg mb-1">Outstanding aging</h3>
          <p className="text-xs text-muted-foreground mb-4">Dues bucketed by days overdue</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.aging}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => inr(v)} />
              <Bar dataKey="amount" fill="#2540E8" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel */}
        <div className="bg-white border border-border rounded-sm p-6" data-testid="chart-funnel">
          <h3 className="font-head font-bold text-brand-navy text-lg mb-1">Admission funnel</h3>
          <p className="text-xs text-muted-foreground mb-4">Lead to enrollment conversion</p>
          <div className="space-y-3 mt-6">
            {data.funnel.map((f, i) => {
              const max = data.funnel[0].count || 1;
              const pct = Math.round((f.count / max) * 100);
              return (
                <div key={f.stage}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-brand-navy font-medium">{f.stage}</span>
                    <span className="text-muted-foreground">{f.count}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-sm overflow-hidden">
                    <div className="h-full rounded-sm transition-all" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
