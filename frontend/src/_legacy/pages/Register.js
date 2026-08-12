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
import { ArrowRight, Sparkle, ShieldCheck, BadgeCheck, MessageCircle } from "lucide-react";

const ROLE_OPTS = [
  { v: "parent", l: "Parent / Student" },
  { v: "school_admin", l: "School Admin" },
  { v: "finance", l: "Finance" },
  { v: "counsellor", l: "Counsellor" },
];

const HERO_IMG = "https://images.unsplash.com/photo-1719559519182-698f9bfc4e2f?crop=entropy&cs=srgb&fm=jpg&q=80&w=900";

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
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-white">
      {/* Left brand panel */}
      <div className="hidden lg:flex relative overflow-hidden text-white p-12"
        style={{ background: "linear-gradient(180deg, #5548D1 0%, #3F35A8 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="relative flex flex-col justify-between w-full">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="bg-white rounded-xl px-3 py-2"><Logo className="h-6" /></div>
          </Link>

          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold rounded-full px-3 py-1.5" style={{ background: "rgba(255,255,255,0.14)" }}>
              <Sparkle className="h-3.5 w-3.5" /> Join 6,500+ institutions
            </span>
            <h2 className="font-head mt-5 text-4xl xl:text-5xl font-black tracking-tight leading-[1.05]">
              Enrol easier. <br /> Get paid faster.
            </h2>
            <p className="mt-4 text-white/80 max-w-md leading-relaxed">
              Create your BiglypEnroll account and start managing enrolment,
              collecting fees on 8+ rails and offering 0% EMIs — go live in 24 hours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold flex items-center gap-2">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" /> No setup fee
              </span>
              <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-300" /> RBI-regulated
              </span>
            </div>
          </div>

          <div className="relative mt-10 max-w-md">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/9]">
              <img src={HERO_IMG} alt="Parent and child" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(15,26,91,0.4) 100%)" }} />
            </div>
            <div className="absolute -right-4 -bottom-3 rounded-2xl bg-white shadow-xl p-3 pr-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-brand-tint text-brand-blue">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Welcome</p>
                <p className="text-sm font-head font-bold text-brand-navy">Live in 24 hours</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/50 mt-8">© 2026 Biglyp Education Finance Pvt. Ltd.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo className="h-8" /></div>
          <h1 className="font-head text-3xl md:text-4xl font-black tracking-tight text-brand-navy">Create account</h1>
          <p className="text-muted-foreground mt-2 text-sm">It only takes a moment.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Full name</Label>
              <Input id="name" required value={form.name} data-testid="reg-name"
                onChange={set("name")} className="mt-1.5 rounded-full h-12 px-5 border-slate-200 focus:border-brand-blue" placeholder="Jane Doe" />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</Label>
              <Input id="email" type="email" required value={form.email} data-testid="reg-email"
                onChange={set("email")} className="mt-1.5 rounded-full h-12 px-5 border-slate-200 focus:border-brand-blue" placeholder="you@email.com" />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</Label>
              <Input id="password" type="password" required value={form.password} data-testid="reg-password"
                onChange={set("password")} className="mt-1.5 rounded-full h-12 px-5 border-slate-200 focus:border-brand-blue" placeholder="Min 6 characters" />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">I am a</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger className="mt-1.5 rounded-full h-12 px-5 border-slate-200" data-testid="reg-role">
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
              className="w-full h-12 rounded-full font-semibold text-sm bg-brand-blue hover:bg-brand-indigo-deep text-white shadow-lg shadow-brand-blue/25">
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
