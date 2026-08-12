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

  return (
    <Box className="min-h-screen bg-[#F8FAFC] flex">
      {/* ---------------- Left Sidebar ---------------- */}
      <Box component="aside" className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-border sticky top-0 h-screen">
        <Box className="h-16 flex items-center px-6 border-b border-border">
          <Logo className="h-8" />
        </Box>
        <Box component="nav" className="flex-1 px-3 py-6 space-y-1">
          {SIDEBAR.map((n) => {
            const Icon = n.icon;
            if (n.active) {
              const isCur = pathname === n.to;
              return (
                <Link
                  key={n.key}
                  href={n.to}
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
              <Box component="button"
                key={n.key}
                data-testid={n.testid}
                onClick={() => toast.info(`${n.label} — coming soon`)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-brand-navy transition-colors"
              >
                <Icon className="h-5 w-5" />
                {n.label}
              </Box>
            );
          })}
        </Box>
        <Box className="px-6 py-4 border-t border-border">
          <Typography variant="inherit" component="p" className="text-[11px] tracking-[0.2em] uppercase text-slate-400 font-semibold">Biglyp SaaS</Typography>
          <Typography variant="inherit" component="p" className="text-xs text-slate-400 mt-1">Student Fee Portal</Typography>
        </Box>
      </Box>

      {/* ---------------- Right column ---------------- */}
      <Box className="flex-1 min-w-0 flex flex-col">
        {/* Universal header */}
        <Box component="header" className="sticky top-0 z-40 bg-white border-b border-border h-16 flex items-center justify-between px-4 md:px-8">
          <Box className="flex items-center gap-3">
            <Box className="md:hidden"><Logo className="h-7" /></Box>
            <Box className="hidden md:block">
              <Typography variant="inherit" component="p" className="font-head font-bold text-brand-navy leading-none">Biglyp SaaS</Typography>
              <Typography variant="inherit" component="p" className="text-[11px] text-slate-400 mt-0.5">Student Fee Portal</Typography>
            </Box>
          </Box>

          <Box className="flex items-center gap-3 md:gap-4">
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

            <Box className="relative">
              <Box component="button"
                data-testid="notif-bell"
                onClick={() => { setShowNotifs((v) => !v); }}
                className="relative h-9 w-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <Box component="span" className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#5548D1] text-white text-[10px] font-bold flex items-center justify-center" data-testid="notif-count">
                    {unread}
                  </Box>
                )}
              </Box>
              {showNotifs && (
                <>
                  <Box className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
                  <Box className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-auto rounded-xl border border-border bg-white shadow-xl z-50" data-testid="notif-panel">
                    <Box className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-white">
                      <Typography variant="inherit" component="p" className="font-head font-black text-brand-navy text-sm">Notifications</Typography>
                      {unread > 0 && (
                        <Box component="button" onClick={markAllRead} data-testid="notif-mark-all" className="text-[11px] font-semibold text-[#5548D1] hover:underline flex items-center gap-1">
                          <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                        </Box>
                      )}
                    </Box>
                    {notifs.length === 0 && <Typography variant="inherit" component="p" className="px-4 py-8 text-center text-sm text-slate-400">No notifications yet</Typography>}
                    {notifs.map((n) => (
                      <Box key={n.id} className={`px-4 py-3 border-b border-border/60 ${n.read ? "" : "bg-[#EEF0FF]/50"}`}>
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

            <Box className="flex items-center gap-2 pl-2 md:pl-3 border-l border-border">
              <Box className="h-9 w-9 rounded-full bg-[#5548D1] text-white flex items-center justify-center text-sm font-bold">
                {user?.name?.[0] || "P"}
              </Box>
              <Box component="button"
                onClick={() => { logout(); router.push("/login"); }}
                data-testid="parent-logout"
                className="text-slate-400 hover:text-destructive p-2 transition-colors"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Sub-tab header bar */}
        <Box className="bg-white border-b border-border px-4 md:px-8">
          <Box component="nav" className="flex items-center gap-6">
            {subTabs.map((t) => {
              const active = pathname === t.to;
              return (
                <Link
                  key={t.to}
                  href={t.to}
                  data-testid={t.testid}
                  className={`relative py-4 text-sm font-semibold transition-colors ${
                    active ? "text-[#5548D1]" : "text-slate-500 hover:text-brand-navy"
                  }`}
                >
                  {t.label}
                  {active && <Box component="span" className="absolute left-0 -bottom-px h-0.5 w-full bg-[#5548D1] rounded-full" />}
                </Link>
              );
            })}
          </Box>
        </Box>

        <Box component="main" className="flex-1 px-4 md:px-8 py-8 max-w-5xl w-full">{children}</Box>
      </Box>
    </Box>
  );
}
