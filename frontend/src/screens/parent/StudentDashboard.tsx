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
const NAVY = '#1E1B4B';
const TINT = '#EEF0FF';

function ProfileCompletion({ pct = 23 }: { pct?: number }) {
  const r = 46, c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <Box className="rounded-3xl bg-white border border-slate-200 p-6 shadow-[0_20px_50px_-30px_rgba(15,26,91,0.35)]" data-testid="profile-completion">
      <Typography variant="inherit" component="h3" className="font-head text-lg font-black" style={{ color: NAVY }}>Profile Completion</Typography>
      <Box className="mt-5 flex items-center justify-center">
        <Box className="relative h-32 w-32">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={r} fill="none" stroke="#EEF0FF" strokeWidth="10" />
            <circle cx="60" cy="60" r={r} fill="none" stroke={INDIGO} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`} />
          </svg>
          <Box className="absolute inset-0 flex items-baseline justify-center gap-0.5">
            <Typography variant="inherit" component="span" className="font-head text-3xl font-black" style={{ color: NAVY }}>{pct}</Typography>
            <Typography variant="inherit" component="span" className="text-sm font-bold" style={{ color: '#94A3B8' }}>%</Typography>
          </Box>
        </Box>
      </Box>
      <Typography variant="inherit" component="p" className="mt-5 text-center text-[13px] leading-relaxed" style={{ color: '#64748B' }}>
        Complete your profile to get better recommendations and a personalised experience.
      </Typography>
      <Button data-testid="complete-profile-cta" className="mt-5 w-full h-11 rounded-full font-bold text-white text-[13px]" style={{ background: '#F59E0B' }}>
        Complete Profile
      </Button>
    </Box>
  );
}

function ProductRow({ icon: Icon, title, desc, href, testid, tint = TINT }: any) {
  return (
    <Link href={href} data-testid={testid} className="group block rounded-2xl border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all p-4" style={{ background: tint }}>
      <Box className="flex items-center gap-3">
        <Box className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm" style={{ color: INDIGO }}>
          <Icon className="h-5 w-5" />
        </Box>
        <Box className="min-w-0 flex-1">
          <Typography variant="inherit" component="p" className="font-head font-black text-[15px]" style={{ color: NAVY }}>{title}</Typography>
          <Typography variant="inherit" component="p" className="text-[12px] leading-snug mt-0.5" style={{ color: '#64748B' }}>{desc}</Typography>
        </Box>
        <ArrowRight className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ color: INDIGO }} />
      </Box>
    </Link>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const name = user?.name?.split(' ')[0] || 'there';
  return (
    <ParentLayout>
      <Box className="max-w-6xl mx-auto" data-testid="student-dashboard">
        <Box className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Main column */}
          <Box>
            {/* Welcome hero */}
            <Box className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white" style={{ background: `linear-gradient(135deg, ${INDIGO} 0%, #7C3AED 100%)` }} data-testid="welcome-hero">
              <Box className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <Box className="absolute top-6 right-8 h-16 w-16 rounded-full bg-white/10" />
              <Typography variant="inherit" component="h1" className="relative font-head text-2xl md:text-3xl font-black tracking-tight">
                Welcome back, {name}!
              </Typography>
              <Typography variant="inherit" component="p" className="relative mt-2 text-white/85 text-[14px] md:text-[15px] max-w-lg">
                Your future is full of possibilities.
              </Typography>
              <Typography variant="inherit" component="p" className="relative text-white/85 text-[14px] md:text-[15px]">
                Explore, plan and take the next step with Biglyp.
              </Typography>
            </Box>

            {/* Choose a Product */}
            <Box className="mt-8">
              <Typography variant="inherit" component="h2" className="font-head text-xl md:text-2xl font-black tracking-tight" style={{ color: NAVY }}>
                Choose a Product to Get Started
              </Typography>
              <Typography variant="inherit" component="p" className="mt-1 text-[13.5px]" style={{ color: '#64748B' }}>
                Everything you need for your academic journey and school fee payments – in one place.
              </Typography>

              <Box className="mt-5 grid md:grid-cols-2 gap-5">
                {/* Career Hub product */}
                <Box className="rounded-3xl border border-slate-200 p-5 bg-white shadow-[0_20px_50px_-30px_rgba(15,26,91,0.25)]" data-testid="product-career-hub">
                  <Box className="flex items-start gap-3">
                    <Box className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: TINT, color: INDIGO }}>
                      <Compass className="h-6 w-6" />
                    </Box>
                    <Box>
                      <Typography variant="inherit" component="h3" className="font-head text-lg font-black" style={{ color: NAVY }}>Biglyp Career Hub</Typography>
                      <Typography variant="inherit" component="p" className="text-[12.5px] leading-snug mt-0.5" style={{ color: '#64748B' }}>Plan your career. Make informed academic decisions.</Typography>
                    </Box>
                  </Box>
                  <Box className="mt-4 space-y-2.5">
                    <ProductRow icon={Brain} title="Psychometry" desc="Discover your strengths, personality and potential." href="/app/psychometry" testid="prod-psychometry" />
                    <ProductRow icon={Compass} title="Navigator" desc="Explore 12,000+ programs and find your perfect academic path." href="/app/programs" testid="prod-navigator" />
                    <ProductRow icon={Sparkles} title="Career Recommendation" desc="Get AI-powered career suggestions tailored just for you." href="/app/programs" testid="prod-recommendation" />
                  </Box>
                </Box>

                {/* Fee Collection product */}
                <Box className="rounded-3xl border border-slate-200 p-5 bg-white shadow-[0_20px_50px_-30px_rgba(15,26,91,0.25)]" data-testid="product-fee-collection">
                  <Box className="flex items-start gap-3">
                    <Box className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: TINT, color: INDIGO }}>
                      <Wallet className="h-6 w-6" />
                    </Box>
                    <Box>
                      <Typography variant="inherit" component="h3" className="font-head text-lg font-black" style={{ color: NAVY }}>Biglyp Fee Collection</Typography>
                      <Typography variant="inherit" component="p" className="text-[12.5px] leading-snug mt-0.5" style={{ color: '#64748B' }}>Simplify, automate and manage school fee collections.</Typography>
                    </Box>
                  </Box>
                  <Box className="mt-4 space-y-2.5">
                    <ProductRow icon={School} title="School Fee Payment" desc="We pay the full fee upfront to schools. You get assured collections." href="/app" testid="prod-fee-payment" />
                    <ProductRow icon={CreditCard} title="Fee Financing" desc="Offer 0% interest EMIs to parents. Flexible. Affordable. Accessible." href="/app/financing" testid="prod-fee-financing" />
                  </Box>
                </Box>
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
