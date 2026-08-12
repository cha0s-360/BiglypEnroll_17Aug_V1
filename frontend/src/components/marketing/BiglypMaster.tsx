'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  MarketingNav, MarketingFooter,
  INDIGO, INDIGO_DEEP, INDIGO_TINT, NAVY, TEXT, SUBTLE,
} from '@/components/MarketingShell';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, GraduationCap, Wallet, Sparkle, Users, School, IndianRupee,
  Shield, ShieldCheck, Lock, Globe, Server, Plug, Layers,
  BadgeCheck, Sparkles, Check, Boxes, LockKeyhole,
  Building2, Fingerprint, HeartHandshake, BarChart3, Rocket, Zap, Award, PlayCircle,
} from 'lucide-react';

const HERO_IMG = 'https://images.unsplash.com/photo-1642140027867-e5983a32119c?auto=format&fit=crop&q=80&w=1200';

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

const STATS = [
  { icon: School, value: '6,500+', label: 'Partner institutions', color: '#F59E0B' },
  { icon: Users, value: '50 Lakh+', label: 'Students served', color: '#EC4899' },
  { icon: Globe, value: '42', label: 'Countries navigated', color: '#10B981' },
  { icon: IndianRupee, value: '₹4,200 Cr+', label: 'Fees processed', color: INDIGO },
];

const B2B_BENEFITS = [
  {
    icon: HeartHandshake, color: '#EC4899',
    title: 'Enhanced Parent Satisfaction',
    desc: 'Solve fee stress while providing world-class career guidance for their children — all under one institutional roof.',
  },
  {
    icon: Zap, color: '#F59E0B',
    title: 'Zero Operational Friction',
    desc: 'Reduce admin follow-ups for overdue fees by 80% while automating your entire counselling administration.',
  },
  {
    icon: Award, color: '#10B981',
    title: 'Brand Elevation',
    desc: 'Upgrade your school&apos;s value offering to prospective parents during admissions and stand out from every competitor.',
  },
];

const SECURITY = [
  { icon: Shield, t: 'ISO-27001 Certified', d: 'Independently audited information security controls.' },
  { icon: Lock, t: 'DPDP Compliant', d: 'Full compliance with India&apos;s Digital Personal Data Protection Act.' },
  { icon: LockKeyhole, t: 'Bank-Grade 256-bit SSL', d: 'Every financial transaction is end-to-end encrypted.' },
  { icon: ShieldCheck, t: 'RBI-Regulated Rails', d: 'Lending, disbursals and mandates through licensed NBFC partners.' },
];

/* --------- Hero ---------- */
function Hero() {
  return (
    <Box component="section" className="relative overflow-hidden">
      <Box className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INDIGO} 0%, ${INDIGO_DEEP} 55%, ${INDIGO_DEEP} 100%)` }} />
      <Box className="absolute inset-0 opacity-[0.09]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      <Box className="relative max-w-7xl mx-auto px-6 pt-14 pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <motion.div initial="hidden" animate="show" variants={fade}>
          <Box component="span" className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold rounded-full px-3 py-1.5 text-white" style={{ background: 'rgba(255,255,255,0.14)' }}>
            <Sparkle className="h-3.5 w-3.5" /> BiglypEnroll · Master Platform
          </Box>
          <motion.h1 custom={1} variants={fade}
            className="font-head mt-5 text-4xl md:text-5xl lg:text-[52px] font-black text-white leading-[1.05] tracking-tight">
            Empower Students.<br />
            Simplify Collections.<br />
            <span className="relative inline-block">
              <span className="relative z-10">The all-in-one OS</span>
              <span className="absolute left-0 right-0 bottom-1 h-3 rounded-sm" style={{ background: '#FBBF24', opacity: 0.85 }} />
            </span>{' '}
            for modern institutions.
          </motion.h1>
          <motion.p custom={2} variants={fade}
            className="mt-5 text-white/85 text-[16px] md:text-[17px] max-w-xl leading-relaxed">
            BiglypEnroll bridges career readiness and institutional fee collection —
            giving schools the digital infrastructure to better serve parents and students.
          </motion.p>
          <motion.div custom={3} variants={fade} className="mt-8 flex flex-wrap gap-3">
            <Box component="a" href="#demo">
              <Button className="h-12 px-6 rounded-full font-semibold text-sm shadow-lg" style={{ background: '#FFFFFF', color: INDIGO }}>
                Schedule School Demo <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Box>
            <Box component="a" href="#products">
              <Button variant="outline" className="h-12 px-6 rounded-full font-semibold text-sm border-white/60 text-white hover:bg-white/10 bg-transparent">
                Explore Sub-Products
              </Button>
            </Box>
          </motion.div>

          {/* Trust chip strip */}
          <motion.div custom={4} variants={fade} className="mt-8 flex flex-wrap gap-2">
            {['ISO 27001', 'DPDP compliant', 'RBI-regulated', '50 Lakh+ parents'].map((t) => (
              <Box component="span" key={t} className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold text-white">
                {t}
              </Box>
            ))}
          </motion.div>
        </motion.div>

        {/* Ecosystem visual */}
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="relative">
          <Box className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-[440px] mx-auto"
            style={{ boxShadow: '0 40px 80px -30px rgba(0,0,0,0.45)' }}>
            <Box component="img" src={HERO_IMG} alt="Parent and student" className="w-full h-full object-cover" />
            <Box className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(15,26,91,0.4) 100%)' }} />
          </Box>
          {/* Floating product cards */}
          <Box className="hidden md:flex absolute -left-6 top-14 rounded-2xl bg-white shadow-xl p-3 pr-4 items-center gap-3 min-w-[220px]" style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.25)' }}>
            <Box className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
              <GraduationCap className="h-5 w-5" />
            </Box>
            <Box>
              <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Career Hub</Typography>
              <Typography variant="inherit" component="p" className="text-sm font-head font-bold" style={{ color: NAVY }}>2.5L courses · 42 countries</Typography>
            </Box>
          </Box>
          <Box className="hidden md:flex absolute -right-4 bottom-16 rounded-2xl bg-white shadow-xl p-3 pr-4 items-center gap-3 min-w-[220px]" style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.25)' }}>
            <Box className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: '#FEF3C7', color: '#B45309' }}>
              <Wallet className="h-5 w-5" />
            </Box>
            <Box>
              <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Fee Collection</Typography>
              <Typography variant="inherit" component="p" className="text-sm font-head font-bold" style={{ color: NAVY }}>0% EMI · 100% upfront</Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>

      <Box component="svg" viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full h-[46px] relative -mb-px" aria-hidden>
        <path d="M0 60 L1440 60 L1440 0 C 1080 60, 360 60, 0 0 Z" fill="#ffffff" />
      </Box>
    </Box>
  );
}

/* --------- Stats strip ---------- */
function StatStrip() {
  return (
    <Box component="section" className="bg-white">
      <Box className="max-w-7xl mx-auto px-6 pt-6 pb-14">
        <Box className="rounded-2xl bg-white border border-slate-100 shadow-[0_20px_50px_-30px_rgba(15,26,91,0.35)] px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <Box key={s.label} className="flex items-center gap-3">
                <Box className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.color + '1A', color: s.color }}>
                  <Icon className="h-5 w-5" />
                </Box>
                <Box>
                  <Typography variant="inherit" component="p" className="font-head text-xl font-black" style={{ color: NAVY }}>{s.value}</Typography>
                  <Typography variant="inherit" component="p" className="text-[11px] font-medium" style={{ color: SUBTLE }}>{s.label}</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Dual-Engine Core ---------- */
function DualEngineCore() {
  return (
    <Box component="section" id="products" className="py-20" style={{ background: `linear-gradient(to bottom, #ffffff 0%, ${INDIGO_TINT} 100%)` }}>
      <Box className="max-w-7xl mx-auto px-6">
        <Box className="text-center max-w-3xl mx-auto">
          <Box component="span" className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Layers className="h-3.5 w-3.5" /> Dual-engine core
          </Box>
          <Typography variant="inherit" component="h2" className="font-head mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            Two powerful engines.<br />One institutional platform.
          </Typography>
          <Typography variant="inherit" component="p" className="mt-5 text-[15px] md:text-base" style={{ color: SUBTLE }}>
            Career readiness and fee collection — the two things every parent cares about most —
            unified into a single OS for your institution.
          </Typography>
        </Box>

        <Box className="mt-14 grid lg:grid-cols-2 gap-6">
          {/* Card 1 — Career Hub */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl bg-white border border-slate-100 p-8 shadow-sm flex flex-col">
            <Box className="flex items-start gap-4">
              <Box className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: INDIGO_TINT, color: INDIGO }}>
                <GraduationCap className="h-7 w-7" />
              </Box>
              <Box>
                <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold" style={{ color: INDIGO }}>Sub-product · 01</Typography>
                <Typography variant="inherit" component="h3" className="font-head text-2xl font-black mt-1" style={{ color: NAVY }}>Biglyp Career Hub</Typography>
                <Typography variant="inherit" component="p" className="text-[13.5px] mt-2 leading-relaxed" style={{ color: SUBTLE }}>
                  Scientific career guidance and global university discovery for every student.
                </Typography>
              </Box>
            </Box>
            <Box component="ul" className="mt-6 space-y-2.5">
              {[
                'AI Psychometrics — Aptitude, Interest, EQ, Personality',
                '2,50,000+ courses across 42 countries in one search',
                'Structured counselling workflows for your team',
                'Actionable, easy-to-read student career reports',
              ].map((t) => (
                <Box component="li" key={t} className="flex items-start gap-2 text-[13.5px]" style={{ color: TEXT }}>
                  <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: INDIGO }} /> {t}
                </Box>
              ))}
            </Box>
            {/* Mini mockup */}
            <Box className="mt-6 rounded-2xl border border-slate-100 p-4" style={{ background: 'linear-gradient(to bottom right, #f8fafc, #ffffff)' }}>
              <Box className="flex items-center gap-2">
                <Box component="span" className="text-[10px] uppercase tracking-widest font-bold" style={{ color: INDIGO }}>Psychometric report</Box>
                <Box component="span" className="ml-auto text-[10px] text-slate-400">Class 10 · Aarav Sharma</Box>
              </Box>
              <Box className="mt-3 grid grid-cols-4 gap-2">
                {[
                  { l: 'Aptitude', v: 82, c: INDIGO },
                  { l: 'Interest', v: 74, c: '#F59E0B' },
                  { l: 'EQ', v: 91, c: '#10B981' },
                  { l: 'Style', v: 68, c: '#EC4899' },
                ].map((k) => (
                  <Box key={k.l} className="rounded-lg bg-white border border-slate-100 p-2 text-center">
                    <Typography variant="inherit" component="p" className="text-[9.5px] uppercase tracking-widest text-slate-400 font-bold">{k.l}</Typography>
                    <Typography variant="inherit" component="p" className="font-head font-black text-sm mt-0.5" style={{ color: k.c }}>{k.v}%</Typography>
                    <Box className="h-1 mt-1 bg-slate-100 rounded-full overflow-hidden">
                      <Box className="h-full rounded-full" style={{ width: `${k.v}%`, background: k.c }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <Link href="/career-hub" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: INDIGO }}>
              Explore Career Hub <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Card 2 — Fee Collection */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-3xl p-8 shadow-sm flex flex-col text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${INDIGO} 0%, ${INDIGO_DEEP} 100%)` }}>
            <Box className="absolute -right-8 -top-8 h-40 w-40 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <Box className="absolute -left-6 -bottom-8 h-32 w-32 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <Box className="flex items-start gap-4 relative">
              <Box className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 bg-white/15">
                <Wallet className="h-7 w-7" />
              </Box>
              <Box>
                <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-white/80">Sub-product · 02</Typography>
                <Typography variant="inherit" component="h3" className="font-head text-2xl font-black mt-1">Biglyp Fee Collection</Typography>
                <Typography variant="inherit" component="p" className="text-[13.5px] mt-2 text-white/85 leading-relaxed">
                  0% EMI fee financing, automated collections, custom module billing.
                </Typography>
              </Box>
            </Box>
            <Box component="ul" className="mt-6 space-y-2.5 relative">
              {[
                '0% EMI fee financing — 100% upfront to schools',
                'Automated auto-debit collections via NACH/UPI',
                'Custom modules — Tuition, Transport, Trips, Meals',
                'Live dashboards & reconciliation for finance teams',
              ].map((t) => (
                <Box component="li" key={t} className="flex items-start gap-2 text-[13.5px] text-white">
                  <Check className="h-4 w-4 mt-0.5 shrink-0 text-amber-300" /> {t}
                </Box>
              ))}
            </Box>
            {/* Mini mockup */}
            <Box className="mt-6 rounded-2xl bg-white/95 p-4 text-slate-800 relative">
              <Box className="flex items-center gap-2">
                <Box component="span" className="text-[10px] uppercase tracking-widest font-bold" style={{ color: INDIGO }}>Live dashboard</Box>
                <Box component="span" className="ml-auto text-[10px] text-slate-400">AY 2025-26</Box>
              </Box>
              <Box className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { l: 'Collected', v: '₹18.4L', c: '#10B981' },
                  { l: 'Due', v: '₹2.6L', c: '#F59E0B' },
                  { l: 'On EMI', v: '142', c: INDIGO },
                ].map((k) => (
                  <Box key={k.l} className="rounded-lg border border-slate-100 p-2">
                    <Typography variant="inherit" component="p" className="text-[9.5px] uppercase tracking-widest text-slate-400 font-bold">{k.l}</Typography>
                    <Typography variant="inherit" component="p" className="font-head font-black text-sm" style={{ color: k.c }}>{k.v}</Typography>
                  </Box>
                ))}
              </Box>
              <Box className="mt-3 rounded-lg bg-slate-50 p-2 flex items-end gap-1 h-12">
                {[40, 65, 30, 75, 55, 90, 70, 85, 50, 78, 68, 92].map((h, i) => (
                  <Box key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i % 2 ? INDIGO : '#FBBF24', opacity: i % 3 ? 1 : 0.7 }} />
                ))}
              </Box>
            </Box>
            <Link href="/fee-collection" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white">
              Explore Fee Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Deployment Flexibility ---------- */
function DeploymentFlex() {
  return (
    <Box component="section" id="deploy" className="py-20 bg-white">
      <Box className="max-w-7xl mx-auto px-6">
        <Box className="text-center max-w-3xl mx-auto">
          <Box component="span" className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Plug className="h-3.5 w-3.5" /> Deployment flexibility
          </Box>
          <Typography variant="inherit" component="h2" className="font-head mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            Plug into your ERP.<br />Or run stand-alone.
          </Typography>
          <Typography variant="inherit" component="p" className="mt-5 text-[15px] md:text-base" style={{ color: SUBTLE }}>
            Whether you already have a school ERP or need a fresh, branded portal —
            BiglypEnroll works exactly the way your institution wants it to.
          </Typography>
        </Box>

        <Box className="mt-14 grid lg:grid-cols-2 gap-6">
          {/* ERP */}
          <Box className="rounded-3xl border border-slate-100 p-8" style={{ background: 'linear-gradient(to bottom right, #f8fafc, #ffffff)' }}>
            <Box className="flex items-center gap-3">
              <Box className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
                <Server className="h-6 w-6" />
              </Box>
              <Typography variant="inherit" component="p" className="font-head font-black text-xl" style={{ color: NAVY }}>Seamless ERP Integration</Typography>
            </Box>
            <Typography variant="inherit" component="p" className="mt-4 text-[14px] leading-relaxed" style={{ color: SUBTLE }}>
              Native APIs connect with existing school management software — <b>Skolaro, Fedena, Entab, MyClassCampus</b>
              and more — with zero data duplication.
            </Typography>
            <Box className="mt-6 grid grid-cols-2 gap-2">
              {['Skolaro', 'Fedena', 'Entab', 'MyClassCampus'].map((e) => (
                <Box key={e} className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 flex items-center gap-2">
                  <Box className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
                    <Boxes className="h-3.5 w-3.5" />
                  </Box>
                  <Box component="span" className="text-[12.5px] font-semibold" style={{ color: NAVY }}>{e}</Box>
                  <BadgeCheck className="ml-auto h-4 w-4 text-emerald-500" />
                </Box>
              ))}
            </Box>
            <Box className="mt-6 rounded-xl bg-white border border-slate-100 p-3">
              <Box className="flex items-center gap-2">
                <Box className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <Typography variant="inherit" component="p" className="text-[11px] font-mono text-slate-500">POST /api/v1/webhook/payment.success</Typography>
              </Box>
              <Typography variant="inherit" component="p" className="text-[10.5px] font-mono text-slate-400 mt-1">{'→ ERP reconciled · student_id=BLP-1042 · ₹18,000'}</Typography>
            </Box>
          </Box>

          {/* White-labeled */}
          <Box className="rounded-3xl p-8 text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${INDIGO} 0%, ${INDIGO_DEEP} 100%)` }}>
            <Box className="absolute -right-10 -top-10 h-48 w-48 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <Box className="relative">
              <Box className="flex items-center gap-3">
                <Box className="h-12 w-12 rounded-2xl flex items-center justify-center bg-white/15">
                  <Globe className="h-6 w-6" />
                </Box>
                <Typography variant="inherit" component="p" className="font-head font-black text-xl">White-Labeled Web Portal</Typography>
              </Box>
              <Typography variant="inherit" component="p" className="mt-4 text-[14px] leading-relaxed text-white/85">
                Get an independent, fully branded web environment with your school&apos;s own logo, colours and a dedicated URL.
              </Typography>
              {/* URL preview */}
              <Box className="mt-6 rounded-xl bg-white/95 p-3 flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                <Box component="span" className="text-[13px] font-mono" style={{ color: NAVY }}>
                  your-school<Box component="span" style={{ color: INDIGO }}>.biglypenroll.com</Box>
                </Box>
                <BadgeCheck className="ml-auto h-4 w-4" style={{ color: INDIGO }} />
              </Box>
              {/* Sub-features */}
              <Box className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { i: Sparkles, t: 'Custom branding' },
                  { i: Users, t: 'SSO for parents' },
                  { i: Rocket, t: 'Live in 24 hrs' },
                  { i: BarChart3, t: 'Owned analytics' },
                ].map((s) => {
                  const Icon = s.i;
                  return (
                    <Box key={s.t} className="rounded-lg bg-white/10 border border-white/15 p-2.5 flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <Box component="span" className="text-[12.5px] font-semibold">{s.t}</Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* --------- B2B Institutional Value Prop ---------- */
function InstitutionalValue() {
  return (
    <Box component="section" className="py-20" style={{ background: INDIGO_TINT }}>
      <Box className="max-w-7xl mx-auto px-6">
        <Box className="text-center max-w-3xl mx-auto">
          <Box component="span" className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Building2 className="h-3.5 w-3.5" /> Built for institutions
          </Box>
          <Typography variant="inherit" component="h2" className="font-head mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            What your institution unlocks
          </Typography>
          <Typography variant="inherit" component="p" className="mt-5 text-[15px] md:text-base" style={{ color: SUBTLE }}>
            Measurable, board-level outcomes — not just software.
          </Typography>
        </Box>

        <Box className="mt-12 grid md:grid-cols-3 gap-5">
          {B2B_BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div key={b.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-white border border-white p-6 shadow-sm">
                <Box className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: b.color + '1A', color: b.color }}>
                  <Icon className="h-6 w-6" />
                </Box>
                <Typography variant="inherit" component="p" className="font-head font-black text-lg mt-4" style={{ color: NAVY }}>{b.title}</Typography>
                <Typography variant="inherit" component="p" className="text-[13.5px] mt-2 leading-relaxed" style={{ color: SUBTLE }}>{b.desc}</Typography>
              </motion.div>
            );
          })}
        </Box>

        {/* KPI ribbon */}
        <Box className="mt-10 rounded-3xl bg-white border border-white p-6 grid md:grid-cols-4 gap-4">
          {[
            { v: '80%', l: 'fewer admin follow-ups' },
            { v: '3.2×', l: 'counselling capacity' },
            { v: '24 hrs', l: 'to go live' },
            { v: '100%', l: 'school payout upfront' },
          ].map((k) => (
            <Box key={k.l} className="text-center">
              <Typography variant="inherit" component="p" className="font-head font-black text-3xl" style={{ color: INDIGO }}>{k.v}</Typography>
              <Typography variant="inherit" component="p" className="text-[12px] mt-0.5" style={{ color: SUBTLE }}>{k.l}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Enterprise Trust & Security ---------- */
function EnterpriseTrust() {
  return (
    <Box component="section" className="py-20 bg-white">
      <Box className="max-w-7xl mx-auto px-6">
        <Box className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <Box>
            <Box component="span" className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
              <ShieldCheck className="h-3.5 w-3.5" /> Enterprise trust & security
            </Box>
            <Typography variant="inherit" component="h2" className="font-head mt-5 text-3xl md:text-4xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
              Built with the same rigor as your school&apos;s finance office.
            </Typography>
            <Typography variant="inherit" component="p" className="mt-4 text-[15px] leading-relaxed" style={{ color: SUBTLE }}>
              ISO-certified security, DPDP-compliant data protection and bank-grade SSL encryption
              for every financial transaction — audited by third-party partners you already trust.
            </Typography>
            <Box className="mt-6 flex flex-wrap gap-2">
              {['ISO 27001', 'DPDP 2023', 'PCI DSS', 'TLS 1.3'].map((c) => (
                <Box component="span" key={c} className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-[11.5px] font-bold" style={{ color: NAVY }}>
                  {c}
                </Box>
              ))}
            </Box>
          </Box>

          <Box className="grid sm:grid-cols-2 gap-4">
            {SECURITY.map((s) => {
              const Icon = s.icon;
              return (
                <Box key={s.t} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <Box className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
                    <Icon className="h-5 w-5" />
                  </Box>
                  <Typography variant="inherit" component="p" className="font-head font-black mt-3 text-[15px]" style={{ color: NAVY }}>{s.t}</Typography>
                  <Box component="p" className="text-[12.5px] mt-1 leading-relaxed" style={{ color: SUBTLE }} dangerouslySetInnerHTML={{ __html: s.d }} />
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Final CTA ---------- */
function FinalCTA() {
  return (
    <Box component="section" id="demo" className="py-20">
      <Box className="max-w-6xl mx-auto px-6">
        <Box className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-white"
          style={{ background: `linear-gradient(120deg, ${INDIGO} 0%, ${INDIGO_DEEP} 100%)` }}>
          <Box className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20" style={{ background: '#FBBF24' }} />
          <Box className="absolute -left-12 -bottom-14 h-48 w-48 rounded-full opacity-10 bg-white" />
          <Box className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <Box>
              <Box component="span" className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold rounded-full px-3 py-1 bg-white/15 border border-white/20">
                <Zap className="h-3.5 w-3.5" /> Ready when you are
              </Box>
              <Typography variant="inherit" component="h2" className="font-head mt-4 text-3xl md:text-4xl font-black leading-tight">
                Give your institution<br />the OS of tomorrow.
              </Typography>
              <Typography variant="inherit" component="p" className="mt-3 text-white/85 text-sm md:text-base">
                One 30-minute call — we&apos;ll map both engines to your existing workflows and get you live in 24 hours.
              </Typography>
              <Box className="mt-6 flex flex-wrap gap-3">
                <Button className="h-11 px-6 rounded-full font-semibold text-sm" style={{ background: '#FBBF24', color: NAVY }}>
                  Schedule School Demo <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" className="h-11 px-6 rounded-full font-semibold text-sm border-white/50 bg-transparent text-white hover:bg-white/10">
                  <PlayCircle className="h-4 w-4 mr-2" /> Watch 90-sec tour
                </Button>
              </Box>
            </Box>
            <Box className="rounded-2xl bg-white/95 p-5 text-slate-800 shadow-2xl">
              <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-400">One institution, two engines</Typography>
              <Box className="mt-3 space-y-2">
                {[
                  { i: GraduationCap, l: 'Career Hub · Live', c: '#10B981' },
                  { i: Wallet, l: 'Fee Collection · Live', c: INDIGO },
                  { i: Server, l: 'ERP synced (Skolaro)', c: '#F59E0B' },
                  { i: Fingerprint, l: 'SSO enabled', c: '#EC4899' },
                ].map((r) => {
                  const Icon = r.i;
                  return (
                    <Box key={r.l} className="flex items-center gap-3 rounded-lg border border-slate-100 p-2.5">
                      <Box className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: r.c + '1A', color: r.c }}>
                        <Icon className="h-4 w-4" />
                      </Box>
                      <Box component="span" className="text-[13px] font-semibold" style={{ color: NAVY }}>{r.l}</Box>
                      <BadgeCheck className="ml-auto h-4 w-4 text-emerald-500" />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Page shell ---------- */
export default function BiglypMaster() {
  return (
    <Box className="min-h-screen bg-white text-slate-800 font-sans">
      <MarketingNav />
      <Hero />
      <StatStrip />
      <DualEngineCore />
      <DeploymentFlex />
      <InstitutionalValue />
      <EnterpriseTrust />
      <FinalCTA />
      <MarketingFooter />
    </Box>
  );
}
