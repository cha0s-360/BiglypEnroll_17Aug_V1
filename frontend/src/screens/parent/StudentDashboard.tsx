'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { ParentLayout } from '@/components/ParentLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Brain, Compass, Sparkles, School, CreditCard, ArrowRight, Wallet,
  Flame, CheckCircle2, Circle, TrendingUp, GraduationCap, Rocket, Star,
} from 'lucide-react';

const INDIGO = '#5548D1';
const INDIGO_DEEP = '#4F46E5';
const VIOLET = '#7C3AED';
const NAVY = '#1E1B4B';
const YELLOW = '#FBBF24';
const TINT = '#EEF0FF';

/* -------- Profile Completion (fixed alignment + richer content) -------- */
function ProfileCompletion({ pct = 23 }: { pct?: number }) {
  const r = 52, c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const steps = [
    { label: 'Basic details', done: true },
    { label: 'Class & school', done: true },
    { label: 'Interests', done: false },
    { label: 'Career goals', done: false },
    { label: 'Guardian info', done: false },
    { label: 'Verify email', done: false },
  ];
  const doneCount = steps.filter(s => s.done).length;
  return (
    <Box className="rounded-3xl bg-white border border-indigo-100 overflow-hidden shadow-[0_24px_60px_-30px_rgba(85,72,209,0.4)]" data-testid="profile-completion">
      {/* Header */}
      <Box className="px-6 pt-6 pb-4 relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${TINT} 0%, #ffffff 90%)` }}>
        <Box className="absolute -top-8 -right-6 h-24 w-24 rounded-full opacity-40 blur-xl" style={{ background: VIOLET }} />
        <Typography variant="inherit" component="h3" className="font-head text-base font-black tracking-tight relative" style={{ color: NAVY }}>Profile Completion</Typography>
        <Typography variant="inherit" component="p" className="text-[11.5px] mt-0.5 relative" style={{ color: '#64748B' }}>Level up your recommendations</Typography>

        <Box className="mt-4 flex items-center justify-center relative">
          <Box className="relative h-36 w-36">
            <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
              <defs>
                <linearGradient id="pc-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={INDIGO} />
                  <stop offset="100%" stopColor={VIOLET} />
                </linearGradient>
              </defs>
              <circle cx="70" cy="70" r={r} fill="none" stroke="#E0E7FF" strokeWidth="10" />
              <circle cx="70" cy="70" r={r} fill="none" stroke="url(#pc-grad)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${dash} ${c}`} />
            </svg>
            <Box className="absolute inset-0 flex flex-col items-center justify-center">
              <Box className="flex items-baseline">
                <Typography variant="inherit" component="span" className="font-head text-[42px] leading-none font-black" style={{ color: NAVY }}>{pct}</Typography>
                <Typography variant="inherit" component="span" className="text-lg font-black ml-0.5" style={{ color: INDIGO }}>%</Typography>
              </Box>
              <Typography variant="inherit" component="span" className="text-[10.5px] uppercase tracking-widest font-bold mt-1" style={{ color: '#94A3B8' }}>Complete</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Checklist */}
      <Box className="px-6 pb-5">
        <Box className="flex items-center justify-between mb-2.5">
          <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold" style={{ color: '#94A3B8' }}>Checklist</Typography>
          <Box component="span" className="text-[11px] font-bold" style={{ color: INDIGO }}>{doneCount}/{steps.length} done</Box>
        </Box>
        <Box className="space-y-1.5">
          {steps.map((s) => (
            <Box key={s.label} className="flex items-center gap-2 text-[12.5px]">
              {s.done
                ? <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#10B981' }} />
                : <Circle className="h-4 w-4 shrink-0" style={{ color: '#CBD5E1' }} />}
              <Box component="span" className={s.done ? 'line-through' : ''} style={{ color: s.done ? '#94A3B8' : '#334155' }}>{s.label}</Box>
            </Box>
          ))}
        </Box>
        <Button data-testid="complete-profile-cta" className="mt-5 w-full h-11 rounded-xl font-bold text-white text-[13px] shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${YELLOW} 0%, #F59E0B 100%)` }}>
          <Sparkles className="h-4 w-4" /> Complete Profile
        </Button>
      </Box>
    </Box>
  );
}

/* -------- Product sub-row -------- */
function ProductRow({ icon: Icon, title, desc, href, testid, iconBg, iconColor }: any) {
  return (
    <Link href={href} data-testid={testid} className="group block rounded-2xl border border-slate-100 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-all p-3.5 bg-white">
      <Box className="flex items-center gap-3">
        <Box className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: iconBg, color: iconColor }}>
          <Icon className="h-5 w-5" />
        </Box>
        <Box className="min-w-0 flex-1">
          <Typography variant="inherit" component="p" className="font-head font-black text-[14px]" style={{ color: NAVY }}>{title}</Typography>
          <Typography variant="inherit" component="p" className="text-[12px] leading-snug mt-0.5" style={{ color: '#64748B' }}>{desc}</Typography>
        </Box>
        <Box className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:bg-indigo-50" style={{ color: INDIGO }}>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Box>
      </Box>
    </Link>
  );
}

/* -------- Product Card container -------- */
function ProductCard({ icon: Icon, title, desc, accent, tint, children, testid }: any) {
  return (
    <Box className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-[0_24px_60px_-30px_rgba(15,26,91,0.28)]" data-testid={testid}>
      <Box className="p-5 md:p-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${tint} 0%, #ffffff 85%)` }}>
        <Box className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-30 blur-2xl" style={{ background: accent }} />
        <Box className="relative flex items-start gap-3">
          <Box className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`, color: '#fff' }}>
            <Icon className="h-6 w-6" />
          </Box>
          <Box className="flex-1">
            <Typography variant="inherit" component="h3" className="font-head text-lg font-black tracking-tight" style={{ color: NAVY }}>{title}</Typography>
            <Typography variant="inherit" component="p" className="text-[12.5px] leading-snug mt-1" style={{ color: '#64748B' }}>{desc}</Typography>
          </Box>
        </Box>
      </Box>
      <Box className="p-4 md:p-5 space-y-2.5" style={{ background: '#F8FAFF' }}>
        {children}
      </Box>
    </Box>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] || 'there';
  const initial = name[0]?.toUpperCase() || 'A';
  return (
    <ParentLayout>
      <Box className="max-w-6xl mx-auto" data-testid="student-dashboard">
        <Box className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* Main column */}
          <Box>
            {/* Welcome hero */}
            <Box className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-[0_30px_70px_-30px_rgba(85,72,209,0.6)]" style={{ background: `linear-gradient(135deg, ${INDIGO} 0%, ${VIOLET} 55%, #C026D3 100%)` }} data-testid="welcome-hero">
              {/* Decorative orbs */}
              <Box className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
              <Box className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full opacity-40 blur-2xl" style={{ background: YELLOW }} />
              <Box className="absolute top-8 right-10 h-2 w-2 rounded-full bg-white/60" />
              <Box className="absolute top-16 right-24 h-1.5 w-1.5 rounded-full bg-white/40" />
              <Box className="absolute top-24 right-16 h-1 w-1 rounded-full bg-white/50" />

              <Box className="relative flex flex-wrap items-start justify-between gap-4">
                <Box className="min-w-0">
                  <Box className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                    <Sparkles className="h-3.5 w-3.5" style={{ color: YELLOW }} /> Your Biglyp journey
                  </Box>
                  <Typography variant="inherit" component="h1" className="font-head mt-3 text-3xl md:text-4xl font-black tracking-tight">
                    Welcome back, {name}! <Box component="span" className="inline-block animate-pulse">✨</Box>
                  </Typography>
                  <Typography variant="inherit" component="p" className="mt-2 text-white/90 text-[14.5px] max-w-lg leading-relaxed">
                    Your future is full of possibilities. Explore, plan and take the next step with Biglyp.
                  </Typography>

                  {/* Mini stat chips */}
                  <Box className="mt-5 flex flex-wrap gap-2">
                    <Box className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-[12px] font-semibold">
                      <Flame className="h-3.5 w-3.5" style={{ color: YELLOW }} /> 7-day streak
                    </Box>
                    <Box className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-[12px] font-semibold">
                      <GraduationCap className="h-3.5 w-3.5" /> Class 11 · Science
                    </Box>
                    <Box className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-[12px] font-semibold">
                      <TrendingUp className="h-3.5 w-3.5" style={{ color: '#86EFAC' }} /> Level 3
                    </Box>
                  </Box>
                </Box>
                {/* Big avatar */}
                <Box className="hidden md:flex h-20 w-20 rounded-3xl items-center justify-center font-head text-3xl font-black shrink-0" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)' }}>
                  {initial}
                </Box>
              </Box>
            </Box>

            {/* Choose a Product */}
            <Box className="mt-8">
              <Box className="flex items-end justify-between gap-4 flex-wrap">
                <Box>
                  <Typography variant="inherit" component="h2" className="font-head text-xl md:text-2xl font-black tracking-tight" style={{ color: NAVY }}>
                    Choose a Product to Get Started
                    <Box component="span" className="ml-2" aria-hidden>🚀</Box>
                  </Typography>
                  <Typography variant="inherit" component="p" className="mt-1 text-[13.5px]" style={{ color: '#64748B' }}>
                    Everything you need for your academic journey and school fee payments – in one place.
                  </Typography>
                </Box>
                <Box className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ background: '#FEF3C7', color: '#B45309' }}>
                  <Star className="h-3 w-3" fill="#F59E0B" strokeWidth={0} /> Recommended for you
                </Box>
              </Box>

              <Box className="mt-5 grid md:grid-cols-2 gap-5">
                <ProductCard icon={Compass} title="Biglyp Career Hub" desc="Plan your career. Make informed academic decisions." accent={INDIGO} tint="#EEF0FF" testid="product-career-hub">
                  <ProductRow icon={Brain} iconBg="#EEF0FF" iconColor={INDIGO} title="Psychometry" desc="Discover your strengths, personality and potential." href="/app/psychometry" testid="prod-psychometry" />
                  <ProductRow icon={Compass} iconBg="#FEF3C7" iconColor="#B45309" title="Navigator" desc="Explore 12,000+ programs and find your perfect academic path." href="/app/programs" testid="prod-navigator" />
                  <ProductRow icon={Sparkles} iconBg="#FCE7F3" iconColor="#DB2777" title="Career Recommendation" desc="Get AI-powered career suggestions tailored just for you." href="/app/programs" testid="prod-recommendation" />
                </ProductCard>

                <ProductCard icon={Wallet} title="Biglyp Fee Collection" desc="Simplify, automate and manage school fee collections." accent={VIOLET} tint="#F3E8FF" testid="product-fee-collection">
                  <ProductRow icon={School} iconBg="#DCFCE7" iconColor="#059669" title="School Fee Payment" desc="We pay the full fee upfront to schools. You get assured collections." href="/app" testid="prod-fee-payment" />
                  <ProductRow icon={CreditCard} iconBg="#DBEAFE" iconColor="#2563EB" title="Fee Financing" desc="Offer 0% interest EMIs to parents. Flexible. Affordable. Accessible." href="/app/financing" testid="prod-fee-financing" />
                  <Box className="rounded-2xl border border-dashed border-slate-300 p-3.5 flex items-center gap-3">
                    <Box className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F1F5F9', color: '#94A3B8' }}>
                      <Rocket className="h-5 w-5" />
                    </Box>
                    <Box className="min-w-0 flex-1">
                      <Typography variant="inherit" component="p" className="font-head font-black text-[14px]" style={{ color: '#64748B' }}>More coming soon</Typography>
                      <Typography variant="inherit" component="p" className="text-[12px] leading-snug mt-0.5" style={{ color: '#94A3B8' }}>Scholarships, wallet cashback and more.</Typography>
                    </Box>
                  </Box>
                </ProductCard>
              </Box>
            </Box>
          </Box>

          {/* Right column */}
          <Box className="lg:sticky lg:top-24">
            <ProfileCompletion pct={23} />
          </Box>
        </Box>
      </Box>
    </ParentLayout>
  );
}
