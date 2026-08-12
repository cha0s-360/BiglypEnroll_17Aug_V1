import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import api, { inr, formatApiErrorDetail } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import {
  Wallet, TrendingUp, AlertTriangle, Users, ArrowUpRight, Landmark, CalendarClock,
  RotateCcw, Loader2, FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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
  const [cf, setCf] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const loadAll = () => {
    api.get("/analytics/overview").then(({ data }) => setData(data)).catch(() => {});
    api.get("/analytics/cashflow").then(({ data }) => setCf(data)).catch(() => {});
  };

  useEffect(() => { loadAll(); }, []);

  const runReset = async () => {
    setResetting(true);
    try {
      const { data: res } = await api.post("/school/reset-demo");
      const r = res.reset || {};
      toast.success(
        `Demo reset · ${r.payments_deleted || 0} payment(s), ${r.rewards_txns_deleted || 0} reward txn(s) cleared`
      );
      setConfirmReset(false);
      loadAll();
    } catch (e) {
      toast.error(formatApiErrorDetail(e?.response?.data?.detail));
    } finally { setResetting(false); }
  };

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
      {/* Demo utilities — one-click reset for wallet/reminders/rewards demos */}
      <div className="mb-4 flex items-center justify-between rounded-sm border border-dashed border-brand-blue/40 bg-brand-tint/40 px-5 py-3" data-testid="demo-utilities">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-sm bg-brand-blue/10 text-brand-blue flex items-center justify-center">
            <FlaskConical className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-navy">Demo utilities</p>
            <p className="text-xs text-muted-foreground">Reset the demo parent so pending fees, cashback wallet toggle & reminder flows can be re-demoed.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setConfirmReset(true)} data-testid="reset-demo-btn"
          className="rounded-sm border-brand-blue text-brand-blue hover:bg-brand-tint">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset demo state
        </Button>
      </div>

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

      {/* Cashflow forecast */}
      {cf && (
        <div className="mt-4" data-testid="cashflow-section">
          <div className="flex items-center gap-2 mb-3 mt-8">
            <CalendarClock className="h-5 w-5 text-brand-blue" />
            <h2 className="font-head font-black text-brand-navy text-xl">Cashflow Forecast</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Kpi icon={TrendingUp} label="Expected next 6 months" value={inr(cf.total_upcoming)} accent="bg-brand-blue" />
            <Kpi icon={Wallet} label={`Expected this month`} value={inr(cf.expected_this_month)} accent="bg-brand-navy" />
            <Kpi icon={AlertTriangle} label="Total overdue" value={inr(cf.total_overdue)} accent="bg-brand-sky" />
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Upcoming collections */}
            <div className="lg:col-span-2 bg-white border border-border rounded-sm p-6" data-testid="chart-cashflow-upcoming">
              <div className="mb-6">
                <h3 className="font-head font-bold text-brand-navy text-lg">Upcoming collections</h3>
                <p className="text-xs text-muted-foreground">Projected fee inflows over the next 6 months (due {cf.due_date})</p>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={cf.upcoming}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => inr(v)} />
                  <Bar dataKey="amount" fill="#5548D1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Overdue aging */}
            <div className="bg-white border border-border rounded-sm p-6" data-testid="chart-cashflow-aging">
              <h3 className="font-head font-bold text-brand-navy text-lg mb-1">Overdue aging</h3>
              <p className="text-xs text-muted-foreground mb-4">Outstanding dues by days overdue</p>
              <div className="space-y-3 mt-6">
                {cf.overdue_aging.map((a, i) => {
                  const max = Math.max(...cf.overdue_aging.map((x) => x.amount), 1);
                  const pct = Math.round((a.amount / max) * 100);
                  const tones = ["#F59E0B", "#F97316", "#EF4444", "#B91C1C"];
                  return (
                    <div key={a.bucket}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-brand-navy font-medium">{a.bucket}</span>
                        <span className="text-muted-foreground">{inr(a.amount)}{a.count ? ` · ${a.count}` : ""}</span>
                      </div>
                      <div className="h-3 bg-muted rounded-sm overflow-hidden">
                        <div className="h-full rounded-sm transition-all" style={{ width: `${pct}%`, background: tones[i % tones.length] }} />
                      </div>
                    </div>
                  );
                })}
                {cf.total_overdue === 0 && (
                  <p className="text-sm text-emerald-600 font-medium mt-4">✓ No overdue dues — collections are on track!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset demo state?</AlertDialogTitle>
            <AlertDialogDescription>
              This clears the demo parent&apos;s payments, cashback wallet, points, redemptions and notifications
              — so pending fees appear again and the wallet toggle can be re-demoed. Real parents are not affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm" data-testid="reset-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={runReset} disabled={resetting} data-testid="reset-confirm"
              className="rounded-sm bg-brand-blue hover:bg-brand-navy">
              {resetting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RotateCcw className="h-4 w-4 mr-2" />}
              Reset now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
