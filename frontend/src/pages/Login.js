import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiErrorDetail } from "@/lib/api";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

const DEMO = [
  { label: "School Admin", email: "school@biglyp.com", pw: "school123" },
  { label: "Parent", email: "parent@biglyp.com", pw: "parent123" },
  { label: "Finance", email: "finance@biglyp.com", pw: "finance123" },
  { label: "Biglyp Ops", email: "admin@biglyp.com", pw: "admin123" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const routeFor = (role) => (role === "parent" ? "/app" : role === "lender" ? "/credit" : "/dashboard");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}`);
      navigate(routeFor(user.role));
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  const quick = async (d) => {
    setEmail(d.email);
    setPassword(d.pw);
    setLoading(true);
    try {
      const user = await login(d.email, d.pw);
      navigate(routeFor(user.role));
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-brand-navy text-white p-12 grid-bg">
        <Logo className="h-9 bg-white rounded-sm px-3 py-2 w-fit" />
        <div>
          <h2 className="font-head text-4xl font-black tracking-tight leading-tight">
            The leap that defines you, shapes your career.
          </h2>
          <p className="mt-4 text-white/60 max-w-md">
            Sign in to manage enrollment, fees and analytics — or track your child's
            fees and pay in a tap.
          </p>
        </div>
        <p className="text-xs text-white/40">© 2026 Biglyp</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo className="h-8" /></div>
          <h1 className="font-head text-3xl font-black tracking-tight text-brand-navy">Sign in</h1>
          <p className="text-muted-foreground mt-2">Welcome back to BiglypEnroll.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email" type="email" required value={email} data-testid="login-email"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 rounded-sm h-11" placeholder="you@school.edu"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password" type="password" required value={password} data-testid="login-password"
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 rounded-sm h-11" placeholder="••••••••"
              />
            </div>
            <Button
              type="submit" disabled={loading} data-testid="login-submit"
              className="w-full h-11 bg-brand-blue hover:bg-brand-navy text-white rounded-sm font-semibold"
            >
              {loading ? "Signing in..." : "Sign in"} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Quick demo login</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {DEMO.map((d) => (
                <button
                  key={d.email}
                  onClick={() => quick(d)}
                  data-testid={`demo-${d.label.replace(/\s/g, "-").toLowerCase()}`}
                  className="text-left border border-border rounded-sm px-3 py-2 hover:border-brand-blue hover:bg-brand-tint transition-colors"
                >
                  <p className="text-sm font-semibold text-brand-navy">{d.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{d.email}</p>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="text-brand-blue font-semibold hover:underline" data-testid="link-register">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
