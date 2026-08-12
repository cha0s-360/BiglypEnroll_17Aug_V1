'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAuth } from '@/context/AuthContext';
import { formatApiErrorDetail } from '@/lib/api';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  ArrowRight, ShieldCheck, Sparkle, BadgeCheck, MessageCircle,
  Building2, Users, Landmark,
} from 'lucide-react';

const DEMO = [
  { label: 'School Admin', email: 'school@biglyp.com', pw: 'school123', icon: Building2, color: '#5548D1' },
  { label: 'Parent', email: 'parent@biglyp.com', pw: 'parent123', icon: Users, color: '#F59E0B' },
  { label: 'Finance', email: 'finance@biglyp.com', pw: 'finance123', icon: Landmark, color: '#10B981' },
  { label: 'Biglyp Ops', email: 'admin@biglyp.com', pw: 'admin123', icon: ShieldCheck, color: '#EC4899' },
];

const HERO_IMG = 'https://images.unsplash.com/photo-1659352787906-f809a3b9e86e?auto=format&fit=crop&q=80&w=1000';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const routeFor = (role: string) => (role === 'parent' ? '/app' : role === 'lender' ? '/credit' : '/dashboard');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}`);
      router.push(routeFor(user.role));
    } catch (err: any) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  const quick = async (d: typeof DEMO[number]) => {
    setEmail(d.email); setPassword(d.pw); setLoading(true);
    try {
      const user = await login(d.email, d.pw);
      router.push(routeFor(user.role));
    } catch (err: any) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally { setLoading(false); }
  };

  return (
    <Box className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-white">
      {/* Left brand panel */}
      <Box className="hidden lg:flex relative overflow-hidden text-white p-12" style={{ background: 'linear-gradient(180deg, #5548D1 0%, #3F35A8 100%)' }}>
        <Box className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <Box className="relative flex flex-col justify-between w-full">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <Box className="bg-white rounded-xl px-3 py-2">
              <Logo className="h-6" />
            </Box>
          </Link>

          <Box className="max-w-md">
            <Box component="span" className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold rounded-full px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.14)' }}>
              <Sparkle className="h-3.5 w-3.5" /> BiglypEnroll · one platform
            </Box>
            <Typography variant="inherit" component="h2" className="font-head mt-5 text-4xl xl:text-5xl font-black tracking-tight leading-[1.05]">
              The leap that <br /> defines you.
            </Typography>
            <Typography variant="inherit" component="p" className="mt-4 text-white/80 max-w-md leading-relaxed">
              Sign in to run admissions, collect fees on 8+ rails and offer 0% EMIs — or track your child&apos;s fees and pay in a tap.
            </Typography>

            <Box className="mt-8 flex flex-wrap gap-3">
              <Box component="span" className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold flex items-center gap-2">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" /> 6,500+ institutes
              </Box>
              <Box component="span" className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-300" /> RBI-regulated
              </Box>
              <Box component="span" className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold flex items-center gap-2">
                <Sparkle className="h-3.5 w-3.5 text-pink-300" /> 0% EMI · No score impact
              </Box>
            </Box>
          </Box>

          <Box className="relative mt-10 max-w-md">
            <Box className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/9]">
              <Box component="img" src={HERO_IMG} alt="Parent and child" className="w-full h-full object-cover" />
              <Box className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(15,26,91,0.4) 100%)' }} />
            </Box>
            <Box className="absolute -left-4 -top-3 rounded-2xl bg-white shadow-xl p-3 pr-4 flex items-center gap-3 min-w-[210px]">
              <Box className="h-9 w-9 rounded-lg flex items-center justify-center bg-emerald-100 text-emerald-600">
                <BadgeCheck className="h-5 w-5" />
              </Box>
              <Box>
                <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Pre-approved</Typography>
                <Typography variant="inherit" component="p" className="text-sm font-head font-bold text-brand-navy">0% EMI · ₹1,20,000</Typography>
              </Box>
            </Box>
            <Box className="absolute -right-4 -bottom-3 rounded-2xl bg-white shadow-xl p-3 pr-4 flex items-center gap-3">
              <Box className="h-9 w-9 rounded-lg flex items-center justify-center bg-brand-tint text-brand-blue">
                <MessageCircle className="h-5 w-5" />
              </Box>
              <Box>
                <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-500">WhatsApp</Typography>
                <Typography variant="inherit" component="p" className="text-sm font-head font-bold text-brand-navy">Reminder sent</Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="inherit" component="p" className="text-xs text-white/50 mt-8">© 2026 Biglyp Education Finance Pvt. Ltd.</Typography>
        </Box>
      </Box>

      {/* Right form */}
      <Box className="flex items-center justify-center p-6 md:p-12 bg-white">
        <Box className="w-full max-w-md">
          <Box className="lg:hidden mb-8"><Logo className="h-8" /></Box>
          <Typography variant="inherit" component="h1" className="font-head text-3xl md:text-4xl font-black tracking-tight text-brand-navy">Sign in</Typography>
          <Typography variant="inherit" component="p" className="text-muted-foreground mt-2 text-sm">Welcome back to BiglypEnroll.</Typography>

          <Box component="form" onSubmit={submit} className="mt-8 space-y-4">
            <Box>
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</Label>
              <Input id="email" type="email" required value={email} data-testid="login-email"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 rounded-full h-12 px-5 border-slate-200 focus:border-brand-blue" placeholder="you@school.edu" />
            </Box>
            <Box>
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</Label>
              <Input id="password" type="password" required value={password} data-testid="login-password"
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 rounded-full h-12 px-5 border-slate-200 focus:border-brand-blue" placeholder="••••••••" />
            </Box>
            <Button type="submit" disabled={loading} data-testid="login-submit"
              className="w-full h-12 rounded-full font-semibold text-sm bg-brand-blue hover:bg-brand-indigo-deep text-white shadow-lg shadow-brand-blue/25">
              {loading ? 'Signing in...' : 'Sign in'} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Box>

          <Box className="mt-8">
            <Typography variant="inherit" component="p" className="text-[11px] tracking-[0.2em] uppercase text-slate-400 font-bold">Quick demo login</Typography>
            <Box className="mt-3 grid grid-cols-2 gap-2.5">
              {DEMO.map((d) => {
                const Icon = d.icon;
                return (
                  <Box
                    component="button"
                    type="button"
                    key={d.email}
                    onClick={() => quick(d)}
                    data-testid={`demo-${d.label.replace(/\s/g, '-').toLowerCase()}`}
                    className="text-left border border-slate-200 rounded-xl px-3 py-2.5 hover:border-brand-blue hover:bg-brand-tint transition-colors flex items-center gap-2.5 bg-transparent cursor-pointer"
                  >
                    <Box className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: d.color + '1A', color: d.color }}>
                      <Icon className="h-4 w-4" />
                    </Box>
                    <Box className="min-w-0">
                      <Typography variant="inherit" component="p" className="text-sm font-semibold text-brand-navy leading-tight">{d.label}</Typography>
                      <Typography variant="inherit" component="p" className="text-[11px] text-muted-foreground truncate">{d.email}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Typography variant="inherit" component="p" className="mt-8 text-sm text-muted-foreground">
            New here?{' '}
            <Link href="/register" className="text-brand-blue font-semibold hover:underline" data-testid="link-register">
              Create an account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
