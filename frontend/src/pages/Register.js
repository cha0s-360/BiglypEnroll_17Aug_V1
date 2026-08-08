import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiErrorDetail } from "@/lib/api";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

const ROLE_OPTS = [
  { v: "parent", l: "Parent / Student" },
  { v: "school_admin", l: "School Admin" },
  { v: "finance", l: "Finance" },
  { v: "counsellor", l: "Counsellor" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "parent" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target ? e.target.value : e });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success("Account created!");
      navigate(user.role === "parent" ? "/app" : "/dashboard");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-brand-navy text-white p-12 grid-bg">
        <Logo className="h-9 bg-white rounded-sm px-3 py-2 w-fit" />
        <div>
          <h2 className="font-head text-4xl font-black tracking-tight leading-tight">
            Join the platform built for the next generation.
          </h2>
          <p className="mt-4 text-white/60 max-w-md">
            Create your BiglypEnroll account and start managing enrollment and fees today.
          </p>
        </div>
        <p className="text-xs text-white/40">© 2026 Biglyp</p>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo className="h-8" /></div>
          <h1 className="font-head text-3xl font-black tracking-tight text-brand-navy">Create account</h1>
          <p className="text-muted-foreground mt-2">It only takes a moment.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={form.name} data-testid="reg-name"
                onChange={set("name")} className="mt-1.5 rounded-sm h-11" placeholder="Jane Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} data-testid="reg-email"
                onChange={set("email")} className="mt-1.5 rounded-sm h-11" placeholder="you@email.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={form.password} data-testid="reg-password"
                onChange={set("password")} className="mt-1.5 rounded-sm h-11" placeholder="Min 6 characters" />
            </div>
            <div>
              <Label>I am a</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger className="mt-1.5 rounded-sm h-11" data-testid="reg-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTS.map((r) => (
                    <SelectItem key={r.v} value={r.v}>{r.l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} data-testid="reg-submit"
              className="w-full h-11 bg-brand-blue hover:bg-brand-navy text-white rounded-sm font-semibold">
              {loading ? "Creating..." : "Create account"} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-blue font-semibold hover:underline" data-testid="link-login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
