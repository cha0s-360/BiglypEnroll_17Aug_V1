'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { ParentLayout } from '@/components/ParentLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Brain, Compass, Sparkles, School, CreditCard, ArrowRight, Wallet,
} from 'lucide-react';

const INDIGO = '#5548D1';
const VIOLET = '#7C3AED';
const NAVY = '#1E1B4B';

/* -------- Profile Completion (compact, per design) -------- */
function ProfileCompletion({ pct = 25 }: { pct?: number }) {
  const r = 42, c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <Box className="rounded-2xl bg-white border border-border/70 soft-shadow p-5" data-testid="profile-completion">
      <Typography variant="inherit" component="h3" className="font-head text-[15px] font-black tracking-tight" style={{ color: NAVY }}>
        Profile Completion
      </Typography>

      <Box className="mt-3 flex items-center justify-center">
        <Box className="relative h-28 w-28">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="pc-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={INDIGO} />
                <stop offset="100%" stopColor={VIOLET} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r={r} fill="none" stroke="#E7EAFB" strokeWidth="8" />
            <circle cx="50" cy="50" r={r} fill="none" stroke="url(#pc-grad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`} />
          </svg>
          <Box className="absolute inset-0 flex items-center justify-center">
            <Box className="flex items-baseline">
              <Typography variant="inherit" component="span" className="font-head text-[30px] leading-none font-black" style={{ color: NAVY }}>{pct}</Typography>
              <Typography variant="inherit" component="span" className="text-sm font-black ml-0.5" style={{ color: INDIGO }}>%</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Typography variant="inherit" component="p" className="mt-3 text-center text-[12px] leading-relaxed" style={{ color: '#64748B' }}>
        Complete your profile to get better recommendations and a personalised experience.
      </Typography>

      <Button data-testid="complete-profile-cta"
        className="mt-4 w-full h-10 rounded-full font-bold text-white text-[13px] transition-all duration-300 hover:-translate-y-0.5 shadow-[0_10px_22px_-10px_rgba(245,158,11,0.7)]"
        style={{ background: 'linear-gradient(135deg, #F5A50B 0%, #F59E0B 100%)' }}>
        Complete Profile
      </Button>
    </Box>
  );
}

/* -------- Product sub-row (compact lavender row, per design) -------- */
function ProductRow({ icon: Icon, title, desc, href, testid }: any) {
  return (
    <Link href={href} data-testid={testid}
      className="group block rounded-xl p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-14px_rgba(85,72,209,0.45)]"
      style={{ background: '#EEF0FF' }}>
      <Box className="flex items-center gap-3">
        <Box className="h-9 w-9 rounded-lg bg-white flex items-center justify-center shrink-0" style={{ color: INDIGO }}>
          <Icon className="h-[17px] w-[17px]" />
        </Box>
        <Box className="min-w-0 flex-1">
          <Typography variant="inherit" component="p" className="font-head font-black text-[13.5px] leading-tight" style={{ color: NAVY }}>{title}</Typography>
          <Typography variant="inherit" component="p" className="text-[11.5px] leading-snug mt-0.5" style={{ color: '#64748B' }}>{desc}</Typography>
        </Box>
        <ArrowRight className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ color: INDIGO }} />
      </Box>
    </Link>
  );
}

/* -------- Product Card container (compact, per design) -------- */
function ProductCard({ icon: Icon, title, desc, children, testid }: any) {
  return (
    <Box className="rounded-2xl border border-border/70 bg-white soft-shadow p-4 md:p-5" data-testid={testid}>
      <Box className="flex items-start gap-3">
        <Box className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF0FF', color: INDIGO }}>
          <Icon className="h-5 w-5" />
        </Box>
        <Box className="flex-1 min-w-0">
          <Typography variant="inherit" component="h3" className="font-head text-[16px] font-black tracking-tight leading-tight" style={{ color: NAVY }}>{title}</Typography>
          <Typography variant="inherit" component="p" className="text-[12px] leading-snug mt-0.5" style={{ color: '#64748B' }}>{desc}</Typography>
        </Box>
      </Box>
      <Box className="mt-3.5 space-y-2.5">
        {children}
      </Box>
    </Box>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] || 'there';
  return (
    <ParentLayout>
      <Box className="max-w-6xl mx-auto" data-testid="student-dashboard">
        <Box className="grid lg:grid-cols-[1fr_300px] gap-5 items-start">
          {/* Main column */}
          <Box>
            {/* Welcome banner — compact gradient, per design */}
            <Box className="relative overflow-hidden rounded-2xl px-6 py-5 md:px-7 md:py-6 text-white reveal"
              style={{ background: `linear-gradient(110deg, ${INDIGO} 0%, #6D28D9 60%, ${VIOLET} 100%)` }}
              data-testid="welcome-hero">
              <Box className="absolute top-1/2 -translate-y-1/2 right-8 h-14 w-14 rounded-full bg-white/10" />
              <Box className="absolute -top-10 -right-16 h-40 w-40 rounded-full bg-white/5 blur-xl" />
              <Typography variant="inherit" component="h1" className="relative font-head text-[26px] md:text-[28px] font-black tracking-tight leading-tight">
                Welcome back, {name}!
              </Typography>
              <Typography variant="inherit" component="p" className="relative mt-1.5 text-white/85 text-[13px] leading-relaxed max-w-md">
                Your future is full of possibilities.<br />Explore, plan and take the next step with Biglyp.
              </Typography>
            </Box>

            {/* Choose a Product */}
            <Box className="mt-6 reveal-1">
              <Typography variant="inherit" component="h2" className="font-head text-[20px] md:text-[22px] font-black tracking-tight" style={{ color: NAVY }}>
                Choose a Product to Get Started
              </Typography>
              <Typography variant="inherit" component="p" className="mt-0.5 text-[12.5px]" style={{ color: '#64748B' }}>
                Everything you need for your academic journey and school fee payments – in one place.
              </Typography>

              <Box className="mt-4 grid md:grid-cols-2 gap-4 items-start">
                <ProductCard icon={Compass} title="Biglyp Career Hub" desc="Plan your career. Make informed academic decisions." testid="product-career-hub">
                  <ProductRow icon={Brain} title="Psychometry" desc="Discover your strengths, personality and potential." href="/app/psychometry" testid="prod-psychometry" />
                  <ProductRow icon={Compass} title="Navigator" desc="Explore 12,000+ programs and find your perfect academic path." href="/app/programs" testid="prod-navigator" />
                  <ProductRow icon={Sparkles} title="Career Recommendation" desc="Get AI-powered career suggestions tailored just for you." href="/app/programs" testid="prod-recommendation" />
                </ProductCard>

                <ProductCard icon={Wallet} title="Biglyp Fee Collection" desc="Simplify, automate and manage school fee collections." testid="product-fee-collection">
                  <ProductRow icon={School} title="School Fee Payment" desc="We pay the full fee upfront to schools. You get assured collections." href="/app" testid="prod-fee-payment" />
                  <ProductRow icon={CreditCard} title="Fee Financing" desc="Offer 0% interest EMIs to parents. Flexible. Affordable. Accessible." href="/app/financing" testid="prod-fee-financing" />
                </ProductCard>
              </Box>
            </Box>
          </Box>

          {/* Right column */}
          <Box className="lg:sticky lg:top-24 reveal-2">
            <ProfileCompletion pct={25} />
          </Box>
        </Box>
      </Box>
    </ParentLayout>
  );
}
