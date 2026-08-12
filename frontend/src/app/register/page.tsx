'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiSelect from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '@/context/AuthContext';
import { formatApiErrorDetail } from '@/lib/api';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowRight, Sparkle, ShieldCheck, BadgeCheck, MessageCircle } from 'lucide-react';

const ROLE_OPTS = [
  { v: 'parent', l: 'Parent / Student' },
  { v: 'school_admin', l: 'School Admin' },
  { v: 'finance', l: 'Finance' },
  { v: 'counsellor', l: 'Counsellor' },
];

const HERO_IMG = 'https://images.unsplash.com/photo-1659352787906-f809a3b9e86e?auto=format&fit=crop&q=80&w=1000';

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'parent' });
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target ? e.target.value : e });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created!');
      router.push(user.role === 'parent' ? '/app' : '/dashboard');
    } catch (err: any) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-white">
      {/* Left brand panel */}
      <Box className="hidden lg:flex relative overflow-hidden text-white p-12" style={{ background: 'linear-gradient(180deg, #5548D1 0%, #3F35A8 100%)' }}>
        <Box className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <Box className="relative flex flex-col justify-between w-full">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <Box className="bg-white rounded-xl px-3 py-2"><Logo className="h-6" /></Box>
          </Link>

          <Box className="max-w-md">
            <Box component="span" className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold rounded-full px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.14)' }}>
              <Sparkle className="h-3.5 w-3.5" /> Join 6,500+ institutions
            </Box>
            <Typography variant="inherit" component="h2" className="font-head mt-5 text-4xl xl:text-5xl font-black tracking-tight leading-[1.05]">
              Enrol easier. <br /> Get paid faster.
            </Typography>
            <Typography variant="inherit" component="p" className="mt-4 text-white/80 max-w-md leading-relaxed">
              Create your BiglypEnroll account and start managing enrolment, collecting fees on 8+ rails and offering 0% EMIs — go live in 24 hours.
            </Typography>
            <Box className="mt-8 flex flex-wrap gap-3">
              <Box component="span" className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold flex items-center gap-2">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" /> No setup fee
              </Box>
              <Box component="span" className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-300" /> RBI-regulated
              </Box>
            </Box>
          </Box>

          <Box className="relative mt-10 max-w-md">
            <Box className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/9]">
              <Box component="img" src={HERO_IMG} alt="Parent and child" className="w-full h-full object-cover" />
              <Box className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(15,26,91,0.4) 100%)' }} />
            </Box>
            <Box className="absolute -right-4 -bottom-3 rounded-2xl bg-white shadow-xl p-3 pr-4 flex items-center gap-3">
              <Box className="h-9 w-9 rounded-lg flex items-center justify-center bg-brand-tint text-brand-blue">
                <MessageCircle className="h-5 w-5" />
              </Box>
              <Box>
                <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Welcome</Typography>
                <Typography variant="inherit" component="p" className="text-sm font-head font-bold text-brand-navy">Live in 24 hours</Typography>
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
          <Typography variant="inherit" component="h1" className="font-head text-3xl md:text-4xl font-black tracking-tight text-brand-navy">Create account</Typography>
          <Typography variant="inherit" component="p" className="text-muted-foreground mt-2 text-sm">It only takes a moment.</Typography>

          <Box component="form" onSubmit={submit} className="mt-8 space-y-4">
            <Box>
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Full name</Label>
              <Input id="name" required value={form.name} data-testid="reg-name"
                onChange={set('name')} className="mt-1.5 rounded-full h-12 px-5 border-slate-200 focus:border-brand-blue" placeholder="Jane Doe" />
            </Box>
            <Box>
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</Label>
              <Input id="email" type="email" required value={form.email} data-testid="reg-email"
                onChange={set('email')} className="mt-1.5 rounded-full h-12 px-5 border-slate-200 focus:border-brand-blue" placeholder="you@email.com" />
            </Box>
            <Box>
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</Label>
              <Input id="password" type="password" required value={form.password} data-testid="reg-password"
                onChange={set('password')} className="mt-1.5 rounded-full h-12 px-5 border-slate-200 focus:border-brand-blue" placeholder="Min 6 characters" />
            </Box>
            <Box>
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">I am a</Label>
              <MuiSelect
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as string })}
                data-testid="reg-role"
                fullWidth
                className="mt-1.5"
                MenuProps={{ disableScrollLock: true }}
                sx={{
                  borderRadius: '9999px',
                  height: 48,
                  fontSize: '0.875rem',
                  backgroundColor: 'transparent',
                  '& .MuiSelect-select': { padding: '0 20px', display: 'flex', alignItems: 'center', minHeight: '48px', boxSizing: 'border-box' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#5548D1', borderWidth: '1px' },
                }}
              >
                {ROLE_OPTS.map((r) => (
                  <MenuItem key={r.v} value={r.v}>{r.l}</MenuItem>
                ))}
              </MuiSelect>
            </Box>
            <Button type="submit" disabled={loading} data-testid="reg-submit"
              className="w-full h-12 rounded-full font-semibold text-sm bg-brand-blue hover:bg-brand-indigo-deep text-white shadow-lg shadow-brand-blue/25">
              {loading ? 'Creating...' : 'Create account'} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Box>

          <Typography variant="inherit" component="p" className="mt-8 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-blue font-semibold hover:underline" data-testid="link-login">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
