import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";
import { LayoutGrid, Receipt, LogOut } from "lucide-react";

export function ParentLayout({ children }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();

  const nav = [
    { to: "/app", label: "My Fees", icon: LayoutGrid, testid: "pnav-fees" },
    { to: "/app/history", label: "History", icon: Receipt, testid: "pnav-history" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo className="h-8" />
          <nav className="flex items-center gap-1">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = loc.pathname === n.to;
              return (
                <Link key={n.to} to={n.to} data-testid={n.testid}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                    active ? "bg-brand-navy text-white" : "text-muted-foreground hover:bg-muted"
                  }`}>
                  <Icon className="h-4 w-4" /> <span className="hidden sm:inline">{n.label}</span>
                </Link>
              );
            })}
            <div className="ml-2 pl-2 border-l border-border flex items-center gap-2">
              <div className="h-8 w-8 rounded-sm bg-brand-blue text-white flex items-center justify-center text-sm font-bold">
                {user?.name?.[0] || "P"}
              </div>
              <button onClick={() => { logout(); navigate("/login"); }} data-testid="parent-logout"
                className="text-muted-foreground hover:text-destructive p-2"><LogOut className="h-4 w-4" /></button>
            </div>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
