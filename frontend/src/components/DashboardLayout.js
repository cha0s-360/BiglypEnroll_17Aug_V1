import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard, Wallet, GraduationCap, Users, Settings, LogOut, School, UserCog, Landmark, Bell,
} from "lucide-react";

const ADMIN_NAV = [
  { to: "/dashboard", label: "Analytics", icon: LayoutDashboard, testid: "nav-analytics" },
  { to: "/dashboard/fees", label: "Fee Structure", icon: Wallet, testid: "nav-fees" },
  { to: "/dashboard/students", label: "Students", icon: Users, testid: "nav-students" },
  { to: "/dashboard/reminders", label: "Fee Reminders", icon: Bell, testid: "nav-reminders" },
  { to: "/dashboard/team", label: "Team", icon: UserCog, testid: "nav-team" },
  { to: "/credit", label: "Fee Financing", icon: Landmark, testid: "nav-credit" },
  { to: "/dashboard/onboarding", label: "School Setup", icon: School, testid: "nav-onboarding" },
];

export function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-brand-navy text-white flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-white/95 flex items-center justify-center">
              <School className="h-5 w-5" style={{ color: "#5548D1" }} />
            </div>
            <div>
              <p className="font-head font-extrabold text-white leading-none text-lg">Biglyp</p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/50 mt-1">Institute Console</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {ADMIN_NAV.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                data-testid={item.testid}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-colors ${
                  active
                    ? "bg-brand-blue text-white shadow-md shadow-black/20"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="px-2 mb-3 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-brand-blue flex items-center justify-center font-head font-bold text-sm">
              {user?.name?.[0] || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-[11px] text-white/50 capitalize">{user?.role?.replace("_", " ")}</p>
            </div>
          </div>
          <button
            data-testid="logout-btn"
            onClick={() => { logout(); navigate("/login"); }}
            className="flex items-center gap-2 px-4 py-2 w-full rounded-full text-[13px] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="font-head text-xl font-black tracking-tight text-brand-navy" data-testid="page-title">
            {title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[11px] px-3 py-1.5 rounded-full bg-brand-tint text-brand-blue font-bold uppercase tracking-widest">
              AY 2025-26
            </span>
            <div className="h-9 w-9 rounded-full bg-brand-blue text-white flex items-center justify-center text-sm font-bold">
              {user?.name?.[0] || "U"}
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
