import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard, Wallet, GraduationCap, Users, Settings, LogOut, School,
} from "lucide-react";

const ADMIN_NAV = [
  { to: "/dashboard", label: "Analytics", icon: LayoutDashboard, testid: "nav-analytics" },
  { to: "/dashboard/fees", label: "Fee Structure", icon: Wallet, testid: "nav-fees" },
  { to: "/dashboard/students", label: "Students", icon: Users, testid: "nav-students" },
  { to: "/dashboard/onboarding", label: "School Setup", icon: School, testid: "nav-onboarding" },
];

export function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-brand-navy text-white flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <img
            src="https://customer-assets-7cd3h4nn.emergentagent.net/job_23527a80-73ab-45d1-b929-e06ee4f59fc4/artifacts/4bloappr_BigLyp_Logo.webp"
            alt="Biglyp"
            className="h-8 bg-white rounded-sm px-2 py-1"
          />
          <p className="mt-3 text-[10px] tracking-[0.3em] uppercase text-white/50">
            Institute Console
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_NAV.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                data-testid={item.testid}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-blue text-white"
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
          <div className="px-2 mb-3">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-white/50 capitalize">{user?.role?.replace("_", " ")}</p>
          </div>
          <button
            data-testid="logout-btn"
            onClick={() => { logout(); navigate("/login"); }}
            className="flex items-center gap-2 px-4 py-2 w-full rounded-sm text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="font-head text-xl font-bold tracking-tight text-brand-navy" data-testid="page-title">
            {title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1.5 rounded-sm bg-brand-tint text-brand-navy font-semibold">
              AY 2025-26
            </span>
            <div className="h-8 w-8 rounded-sm bg-brand-blue text-white flex items-center justify-center text-sm font-bold">
              {user?.name?.[0] || "U"}
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
