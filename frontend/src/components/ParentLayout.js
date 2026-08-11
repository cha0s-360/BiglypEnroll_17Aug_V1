import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Wallet, LayoutGrid, Brain, Settings, LifeBuoy, Bell, LogOut, Gift, CheckCheck,
} from "lucide-react";

// Sidebar navigation — "Fee Payment" is the live screen; others are placeholders.
const SIDEBAR = [
  { key: "fees", label: "Fee Payment", icon: Wallet, to: "/app", active: true, testid: "snav-fees" },
  { key: "rewards", label: "Rewards", icon: Gift, to: "/app/rewards", active: true, testid: "snav-rewards" },
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid, testid: "snav-dashboard" },
  { key: "psychometry", label: "Psychometry", icon: Brain, testid: "snav-psychometry" },
  { key: "settings", label: "Settings", icon: Settings, testid: "snav-settings" },
  { key: "support", label: "Support", icon: LifeBuoy, testid: "snav-support" },
];

export function ParentLayout({ children }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();

  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);

  const loadNotifs = async () => {
    try {
      const { data } = await api.get("/parent/notifications");
      setNotifs(data.items || []);
      setUnread(data.unread || 0);
    } catch { /* ignore */ }
  };
  useEffect(() => { loadNotifs(); }, []);

  const markAllRead = async () => {
    await api.post("/parent/notifications/read-all");
    loadNotifs();
  };

  const subTabs = [
    { label: "Pay Fees", to: "/app", testid: "subtab-pay" },
    { label: "Payment History", to: "/app/history", testid: "subtab-history" },
    { label: "Active Financing Schedule", to: "/app/financing", testid: "subtab-financing" },
    { label: "Rewards", to: "/app/rewards", testid: "subtab-rewards" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* ---------------- Left Sidebar ---------------- */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-border sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Logo className="h-8" />
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {SIDEBAR.map((n) => {
            const Icon = n.icon;
            if (n.active) {
              const isCur = loc.pathname === n.to;
              return (
                <Link
                  key={n.key}
                  to={n.to}
                  data-testid={n.testid}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-sm transition-colors ${
                    isCur ? "font-bold bg-brand-tint text-brand-blue" : "font-semibold text-slate-500 hover:bg-slate-50 hover:text-brand-navy"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isCur ? "text-brand-blue" : ""}`} />
                  {n.label}
                </Link>
              );
            }
            return (
              <button
                key={n.key}
                data-testid={n.testid}
                onClick={() => toast.info(`${n.label} — coming soon`)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-brand-navy transition-colors"
              >
                <Icon className="h-5 w-5" />
                {n.label}
              </button>
            );
          })}
        </nav>
        <div className="px-6 py-4 border-t border-border">
          <p className="text-[11px] tracking-[0.2em] uppercase text-slate-400 font-semibold">Biglyp SaaS</p>
          <p className="text-xs text-slate-400 mt-1">Student Fee Portal</p>
        </div>
      </aside>

      {/* ---------------- Right column ---------------- */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Universal header */}
        <header className="sticky top-0 z-40 bg-white border-b border-border h-16 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="md:hidden"><Logo className="h-7" /></div>
            <div className="hidden md:block">
              <p className="font-head font-bold text-brand-navy leading-none">Biglyp SaaS</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Student Fee Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <Select defaultValue="2026-2027">
              <SelectTrigger
                data-testid="fy-selector"
                className="h-9 w-[150px] rounded-lg border-border text-sm font-medium text-brand-navy"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026-2027">FY 2026 - 2027</SelectItem>
                <SelectItem value="2025-2026">FY 2025 - 2026</SelectItem>
                <SelectItem value="2024-2025">FY 2024 - 2025</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <button
                data-testid="notif-bell"
                onClick={() => { setShowNotifs((v) => !v); }}
                className="relative h-9 w-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#5548D1] text-white text-[10px] font-bold flex items-center justify-center" data-testid="notif-count">
                    {unread}
                  </span>
                )}
              </button>
              {showNotifs && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                  <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-auto rounded-xl border border-border bg-white shadow-xl z-50" data-testid="notif-panel">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-white">
                      <p className="font-head font-black text-brand-navy text-sm">Notifications</p>
                      {unread > 0 && (
                        <button onClick={markAllRead} data-testid="notif-mark-all" className="text-[11px] font-semibold text-[#5548D1] hover:underline flex items-center gap-1">
                          <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                        </button>
                      )}
                    </div>
                    {notifs.length === 0 && <p className="px-4 py-8 text-center text-sm text-slate-400">No notifications yet</p>}
                    {notifs.map((n) => (
                      <div key={n.id} className={`px-4 py-3 border-b border-border/60 ${n.read ? "" : "bg-[#EEF0FF]/50"}`}>
                        <div className="flex items-start gap-2">
                          {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-[#5548D1] shrink-0" />}
                          <div className={n.read ? "pl-4" : ""}>
                            <p className="text-[13px] font-semibold text-brand-navy leading-tight">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{n.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 pl-2 md:pl-3 border-l border-border">
              <div className="h-9 w-9 rounded-full bg-[#5548D1] text-white flex items-center justify-center text-sm font-bold">
                {user?.name?.[0] || "P"}
              </div>
              <button
                onClick={() => { logout(); navigate("/login"); }}
                data-testid="parent-logout"
                className="text-slate-400 hover:text-destructive p-2 transition-colors"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Sub-tab header bar */}
        <div className="bg-white border-b border-border px-4 md:px-8">
          <nav className="flex items-center gap-6">
            {subTabs.map((t) => {
              const active = loc.pathname === t.to;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  data-testid={t.testid}
                  className={`relative py-4 text-sm font-semibold transition-colors ${
                    active ? "text-[#5548D1]" : "text-slate-500 hover:text-brand-navy"
                  }`}
                >
                  {t.label}
                  {active && <span className="absolute left-0 -bottom-px h-0.5 w-full bg-[#5548D1] rounded-full" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <main className="flex-1 px-4 md:px-8 py-8 max-w-5xl w-full">{children}</main>
      </div>
    </div>
  );
}
