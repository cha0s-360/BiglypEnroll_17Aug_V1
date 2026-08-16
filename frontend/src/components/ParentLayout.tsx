'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Wallet, LayoutGrid, Brain, Settings, LifeBuoy, Bell, LogOut, Gift, CheckCheck,
  Briefcase, FileText, Wrench, Sparkles,
} from "lucide-react";

// Sidebar navigation — "Fee Payment" is the live screen; others are placeholders.
const SIDEBAR = [
  { section: "Explore" },
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid, to: "/app/discover", active: true, testid: "snav-dashboard" },
  { key: "psychometry", label: "Psychometry", icon: Brain, to: "/app/psychometry", active: true, testid: "snav-psychometry" },
  { key: "career-goals", label: "Career goals", icon: Briefcase, to: "/app/programs", active: true, testid: "snav-programs" },
  { key: "admissions", label: "Admissions", icon: FileText, testid: "snav-admissions" },
  { key: "other-services", label: "Other services", icon: Wrench, testid: "snav-services" },
  { section: "Payments" },
  { key: "fees", label: "Fee Payment", icon: Wallet, to: "/app", active: true, testid: "snav-fees" },
  { key: "rewards", label: "Rewards", icon: Gift, to: "/app/rewards", active: true, testid: "snav-rewards" },
  { section: "Account" },
  { key: "settings", label: "Settings", icon: Settings, testid: "snav-settings" },
  { key: "support", label: "Support", icon: LifeBuoy, testid: "snav-support" },
];

export function ParentLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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

  const firstName = (user?.name || "Parent").split(" ")[0];

  return (
    <Box className="min-h-screen bg-[#F6F8FE] flex">
      {/* ---------------- Left Sidebar ---------------- */}
      <Box component="aside" className="hidden md:flex w-[264px] shrink-0 flex-col bg-white border-r border-border sticky top-0 h-screen">
        <Box className="h-16 flex items-center px-6">
          <Logo className="h-8" />
        </Box>
        <Box component="nav" className="flex-1 px-3 pb-4 pt-2 space-y-0.5 overflow-y-auto">
          {SIDEBAR.map((n, idx) => {
            if (n.section) {
              return (
                <Typography key={`sec-${idx}`} variant="inherit" component="p"
                  className={`px-4 pb-1.5 text-[10px] uppercase tracking-[0.22em] font-bold text-slate-400 ${idx === 0 ? "pt-1" : "pt-5"}`}>
                  {n.section}
                </Typography>
              );
            }
            const Icon = n.icon;
            if (n.active) {
              const isCur = pathname === n.to;
              return (
                <Link
                  key={n.key}
                  href={n.to}
                  data-testid={n.testid}
                  className={`sidebar-item group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm ${
                    isCur
                      ? "nav-active-pill font-bold text-white"
                      : "font-semibold text-slate-500 hover:bg-brand-tint/70 hover:text-brand-navy"
                  }`}
                >
                  <Box component="span" className={`h-8 w-8 -my-1 rounded-lg flex items-center justify-center transition-colors ${
                    isCur ? "bg-white/15 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-brand-blue"
                  }`}>
                    <Icon className="h-[17px] w-[17px]" />
                  </Box>
                  {n.label}
                  {isCur && <Box component="span" className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />}
                </Link>
              );
            }
            return (
              <Box component="button"
                key={n.key}
                data-testid={n.testid}
                onClick={() => toast.info(`${n.label} — coming soon`)}
                className="sidebar-item group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              >
                <Box component="span" className="h-8 w-8 -my-1 rounded-lg flex items-center justify-center bg-slate-50 text-slate-300 group-hover:text-slate-400 transition-colors">
                  <Icon className="h-[17px] w-[17px]" />
                </Box>
                {n.label}
                <Box component="span" className="ml-auto text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 rounded-full px-1.5 py-0.5">
                  Soon
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* user mini-card */}
        <Box className="p-3 border-t border-border">
          <Box className="flex items-center gap-2.5 rounded-xl bg-[#F6F8FE] border border-border/70 px-3 py-2.5">
            <Box className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-[#5548D1] to-[#7C6FF5] text-white flex items-center justify-center text-sm font-bold shadow-[0_6px_14px_-6px_rgba(85,72,209,0.6)]">
              {user?.name?.[0] || "P"}
            </Box>
            <Box className="min-w-0 flex-1">
              <Typography variant="inherit" component="p" className="text-[13px] font-bold text-brand-navy truncate leading-tight">{user?.name || "Parent"}</Typography>
              <Typography variant="inherit" component="p" className="text-[11px] text-slate-400 truncate">{user?.email}</Typography>
            </Box>
            <Box component="button"
              onClick={() => { logout(); router.push("/login"); }}
              data-testid="parent-logout"
              className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-destructive hover:bg-red-50 transition-colors"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ---------------- Right column ---------------- */}
      <Box className="flex-1 min-w-0 flex flex-col">
        {/* Universal header */}
        <Box component="header" className="sticky top-0 z-40 glass-bar border-b border-border h-16 flex items-center justify-between px-4 md:px-8">
          <Box className="flex items-center gap-3">
            <Box className="md:hidden"><Logo className="h-7" /></Box>
            <Box className="hidden md:block">
              <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy leading-none">
                Welcome back, {firstName}
              </Typography>
              <Typography variant="inherit" component="p" className="text-[11px] text-slate-400 mt-0.5">Biglyp SaaS · Student Fee Portal</Typography>
            </Box>
          </Box>

          <Box className="flex items-center gap-2.5 md:gap-3">
            <Select defaultValue="2026-2027">
              <SelectTrigger
                data-testid="fy-selector"
                className="h-9 w-[150px] rounded-full bg-white border-border text-[13px] font-semibold text-brand-navy shadow-none hover:border-brand-blue/40 transition-colors"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026-2027">FY 2026 - 2027</SelectItem>
                <SelectItem value="2025-2026">FY 2025 - 2026</SelectItem>
                <SelectItem value="2024-2025">FY 2024 - 2025</SelectItem>
              </SelectContent>
            </Select>

            <Box className="relative">
              <Box component="button"
                data-testid="notif-bell"
                onClick={() => { setShowNotifs((v) => !v); }}
                className="relative h-9 w-9 rounded-full bg-white border border-border flex items-center justify-center text-slate-500 hover:text-brand-blue hover:border-brand-blue/40 transition-colors"
              >
                <Bell className="h-[17px] w-[17px]" />
                {unread > 0 && (
                  <Box component="span" className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#5548D1] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white" data-testid="notif-count">
                    {unread}
                  </Box>
                )}
              </Box>
              {showNotifs && (
                <>
                  <Box className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                  <Box className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-auto rounded-2xl border border-border bg-white soft-shadow-lg z-50 animate-float-up" data-testid="notif-panel">
                    <Box className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-white/95 backdrop-blur">
                      <Typography variant="inherit" component="p" className="font-head font-black text-brand-navy text-sm">Notifications</Typography>
                      {unread > 0 && (
                        <Box component="button" onClick={markAllRead} data-testid="notif-mark-all" className="text-[11px] font-semibold text-[#5548D1] hover:underline flex items-center gap-1">
                          <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                        </Box>
                      )}
                    </Box>
                    {notifs.length === 0 && (
                      <Box className="px-4 py-10 text-center">
                        <Sparkles className="h-6 w-6 text-slate-200 mx-auto" />
                        <Typography variant="inherit" component="p" className="mt-2 text-sm text-slate-400">You&apos;re all caught up</Typography>
                      </Box>
                    )}
                    {notifs.map((n) => (
                      <Box key={n.id} className={`row-hover px-4 py-3 border-b border-border/60 ${n.read ? "" : "bg-[#EEF0FF]/50"}`}>
                        <Box className="flex items-start gap-2">
                          {!n.read && <Box component="span" className="mt-1.5 h-2 w-2 rounded-full bg-[#5548D1] shrink-0" />}
                          <Box className={n.read ? "pl-4" : ""}>
                            <Typography variant="inherit" component="p" className="text-[13px] font-semibold text-brand-navy leading-tight">{n.title}</Typography>
                            <Typography variant="inherit" component="p" className="text-xs text-slate-500 mt-0.5 leading-snug">{n.body}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>

            <Box className="h-9 w-9 rounded-full bg-gradient-to-br from-[#5548D1] to-[#7C6FF5] text-white flex items-center justify-center text-sm font-bold ring-2 ring-[#EEF0FF]">
              {user?.name?.[0] || "P"}
            </Box>

            {/* mobile-only logout (desktop logout lives in the sidebar card) */}
            <Box component="button"
              onClick={() => { logout(); router.push("/login"); }}
              data-testid="parent-logout-mobile"
              className="md:hidden h-9 w-9 rounded-full border border-border flex items-center justify-center text-slate-400 hover:text-destructive transition-colors"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Box>
          </Box>
        </Box>

        {/* Sub-tab header bar — only visible on fee-related routes */}
        {(pathname === '/app' || pathname === '/app/history' || pathname === '/app/financing' || pathname === '/app/rewards' || pathname === '/app/mandate') && (
        <Box className="glass-bar border-b border-border px-4 md:px-8 sticky top-16 z-30">
          <Box component="nav" className="flex items-center gap-1 overflow-x-auto">
            {subTabs.map((t) => {
              const active = pathname === t.to;
              return (
                <Link
                  key={t.to}
                  href={t.to}
                  data-testid={t.testid}
                  className={`relative whitespace-nowrap px-3.5 py-3.5 text-[13.5px] font-semibold transition-colors rounded-t-lg ${
                    active ? "text-[#5548D1]" : "text-slate-500 hover:text-brand-navy hover:bg-brand-tint/50"
                  }`}
                >
                  {t.label}
                  {active && <Box component="span" className="absolute left-3 right-3 -bottom-px h-[2.5px] bg-gradient-to-r from-[#5548D1] to-[#7C6FF5] rounded-full" />}
                </Link>
              );
            })}
          </Box>
        </Box>
        )}

        <Box component="main" className="flex-1 px-4 md:px-8 py-6 md:py-8 w-full">{children}</Box>
      </Box>
    </Box>
  );
}
