'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowRight, Sparkles, ChevronDown, Star, Check, GraduationCap, Wallet,
  Brain, Search, FileCheck2, BookOpenCheck, Award, Landmark, Calculator, ShieldCheck,
  Gauge, LineChart, Globe, Building2, Rocket, Mail, PlayCircle, Quote,
  Users, TrendingUp, Bell, CreditCard, QrCode, Zap, Layers, X,
} from 'lucide-react';

/* ---- Indigo / violet palette (aligned with reference mockups) ---- */
const INDIGO = '#4F46E5';
const INDIGO_DEEP = '#4338CA';
const VIOLET = '#6366F1';
const NAVY = '#1E1B4B';
const YELLOW = '#FBBF24';
const TINT = '#EEF2FF';

const HERO_IMG = 'https://images.pexels.com/photos/6238120/pexels-photo-6238120.jpeg?auto=compress&cs=tinysrgb&w=1100';
const LEARN_IMG = 'https://images.unsplash.com/photo-1583037825390-a23eee53f6ef?auto=format&fit=crop&q=80&w=900';
const FEE_IMG = 'https://images.pexels.com/photos/5538000/pexels-photo-5538000.jpeg?auto=compress&cs=tinysrgb&w=1000';

const grad = `linear-gradient(135deg, ${VIOLET}, ${INDIGO_DEEP})`;
const darkGrad = `linear-gradient(150deg, ${NAVY} 0%, ${INDIGO_DEEP} 100%)`;

/* =================== NAV =================== */
function HomeNav() {
  const NAV = [{ label: 'Homepage', href: '/', active: true }, { label: 'BiglypEnroll', href: '/biglypenroll', active: false }];
  return (
    <Box component="header" className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-indigo-100">
      <Box className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2"><Logo className="h-7" /></Link>
        <Box component="nav" className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} data-testid={`homenav-${n.label.toLowerCase()}`}
              className={`px-4 py-2 rounded-full text-[13.5px] font-semibold transition-colors ${n.active ? 'text-white' : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50'}`}
              style={n.active ? { background: grad } : undefined}>{n.label}</Link>
          ))}
        </Box>
        <Box className="flex items-center gap-2.5">
          <Link href="/login"><Button variant="outline" className="h-9 px-5 rounded-full text-sm font-semibold border-indigo-200 text-indigo-700 hover:bg-indigo-50">Sign in</Button></Link>
          <Box component="a" href="#platform"><Button className="h-9 px-5 rounded-full text-sm font-semibold text-white shadow-lg shadow-indigo-600/25" style={{ background: grad }}>Become a partner</Button></Box>
        </Box>
      </Box>
    </Box>
  );
}

/* =================== HERO (more prominent) =================== */
function Hero() {
  return (
    <Box component="section" className="relative overflow-hidden" style={{ background: `linear-gradient(165deg, #DED9F7 0%, #EBE8FB 48%, #FBFAFF 100%)` }}>
      {/* ambient blobs + grid */}
      <Box className="absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-60" style={{ background: 'radial-gradient(circle, #C7D2FE, transparent 70%)' }} />
      <Box className="absolute top-52 -left-28 h-96 w-96 rounded-full blur-3xl opacity-50" style={{ background: 'radial-gradient(circle, #DDD6FE, transparent 70%)' }} />
      <Box className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(${INDIGO} 1px, transparent 1px)`, backgroundSize: '26px 26px' }} />

      <Box className="relative max-w-7xl mx-auto px-5 pt-12 pb-14 sm:pt-20 sm:pb-20 grid lg:grid-cols-[1.08fr_0.92fr] gap-10 lg:gap-14 items-center">
        <Box>
          <Box component="span" className="reveal inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ background: 'white', color: INDIGO_DEEP, border: '1px solid #C7D2FE', boxShadow: '0 8px 24px -12px rgba(79,70,229,0.4)' }}>
            <Sparkles className="h-3.5 w-3.5" /> Biglyp · Student Success Platform
          </Box>

          <Typography variant="inherit" component="h1" className="reveal-1 font-head mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black tracking-tight leading-[1.04] lg:leading-[1.02]" style={{ color: NAVY }}>
            Building{' '}
            <span className="italic bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(120deg, ${VIOLET}, ${INDIGO_DEEP})` }}>future-ready</span>{' '}
            <span className="relative inline-block">
              students
              <Box component="span" className="absolute left-0 -bottom-1 h-3 w-full -z-0 rounded-sm" style={{ background: YELLOW, opacity: 0.55 }} />
            </span>
          </Typography>

          <Typography variant="inherit" component="p" className="reveal-2 mt-4 font-head text-xl md:text-2xl font-bold" style={{ color: INDIGO }}>
            Where every student discovers, enrols and thrives.
          </Typography>
          <Typography variant="inherit" component="p" className="reveal-3 mt-5 text-[17px] max-w-xl leading-relaxed text-slate-600">
            One institutional OS unifying AI career discovery, 2,50,000+ global courses and 0% EMI fee collection — end-to-end support powered by technology and expert guidance.
          </Typography>

          <Box className="reveal-4 mt-9 flex flex-wrap gap-3">
            <Box component="a" href="#journey"><Button className="h-13 px-7 py-3.5 rounded-full font-semibold text-[15px] text-white shadow-xl shadow-indigo-600/30" style={{ background: grad }}>Take Assessment <ArrowRight className="h-4 w-4 ml-2" /></Button></Box>
            <Box component="a" href="#platform"><Button variant="outline" className="h-13 px-7 py-3.5 rounded-full font-semibold text-[15px] border-indigo-200 text-indigo-700 hover:bg-indigo-50 bg-transparent"><PlayCircle className="h-4 w-4 mr-2" /> Explore Platform</Button></Box>
          </Box>

          {/* trust row */}
          <Box className="reveal-5 mt-9 flex items-center gap-5 flex-wrap">
            <Box className="flex -space-x-2.5">
              {['#4F46E5', '#6366F1', '#0EA5E9', '#F59E0B', '#EC4899'].map((c, i) => (
                <Box key={i} className="h-9 w-9 rounded-full ring-2 ring-white flex items-center justify-center text-white font-head font-bold text-xs" style={{ background: c }}>{String.fromCharCode(65 + i)}</Box>
              ))}
            </Box>
            <Box>
              <Box className="flex items-center gap-1">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="h-3.5 w-3.5" style={{ color: YELLOW, fill: YELLOW }} />)}</Box>
              <Typography variant="inherit" component="p" className="text-[12.5px] text-slate-500 mt-0.5">Trusted by <b style={{ color: NAVY }}>6,500+ institutions</b> &amp; 50 Lakh+ students</Typography>
            </Box>
          </Box>
        </Box>

        {/* Hero visual */}
        <Box className="reveal-2 relative">
          <Box className="relative rounded-[30px] overflow-hidden shadow-2xl aspect-[4/3]" style={{ boxShadow: '0 50px 90px -30px rgba(79,70,229,0.5)' }}>
            <Box component="img" src={HERO_IMG} alt="Future-ready students" className="w-full h-full object-cover" />
            <Box className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(30,27,75,0.4))' }} />
          </Box>
          <Box className="hidden sm:flex absolute -left-6 top-12 rounded-2xl bg-white shadow-xl p-3 pr-4 items-center gap-3" style={{ boxShadow: '0 20px 40px -15px rgba(79,70,229,0.35)' }}>
            <Box className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: TINT, color: INDIGO_DEEP }}><Brain className="h-5 w-5" /></Box>
            <Box><Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-400">AI Psychometrics</Typography><Typography variant="inherit" component="p" className="text-sm font-head font-bold" style={{ color: NAVY }}>60+ traits mapped</Typography></Box>
          </Box>
          <Box className="hidden sm:flex absolute -right-4 bottom-10 rounded-2xl bg-white shadow-xl p-3 pr-4 items-center gap-3" style={{ boxShadow: '0 20px 40px -15px rgba(79,70,229,0.35)' }}>
            <Box className="h-10 w-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600"><Globe className="h-5 w-5" /></Box>
            <Box><Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Study abroad</Typography><Typography variant="inherit" component="p" className="text-sm font-head font-bold" style={{ color: NAVY }}>42 countries</Typography></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* =================== STATS (animated counters) =================== */
function CountUp({ end, prefix = '', suffix = '', decimals = 0, duration = 1500 }: { end: number; prefix?: string; suffix?: string; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(end * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);
  const disp = val.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={ref} data-testid="stat-counter">{prefix}{disp}{suffix}</span>;
}

const STATS = [
  { icon: Globe, end: 42, suffix: '+', label: 'Countries', color: VIOLET },
  { icon: Building2, end: 1200, suffix: '+', label: 'Partner Universities', color: '#7C3AED' },
  { icon: Award, end: 250000, suffix: '+', label: 'Career Programs', color: '#F59E0B' },
];
function Stats() {
  return (
    <Box component="section" className="bg-white">
      <Box className="max-w-6xl mx-auto px-5 -mt-2 pb-16">
        <Box className="rounded-3xl border border-indigo-100 shadow-[0_20px_50px_-30px_rgba(79,70,229,0.4)] px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <Box key={s.label} className="flex items-center gap-4 justify-center sm:justify-start">
                <Box className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: s.color + '18', color: s.color }}><Icon className="h-6 w-6" /></Box>
                <Box><Typography variant="inherit" component="p" className="font-head text-2xl font-black" style={{ color: NAVY }}><CountUp end={s.end} suffix={s.suffix} /></Typography><Typography variant="inherit" component="p" className="text-[12px] font-medium text-slate-500">{s.label}</Typography></Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

/* =================== PRODUCT MOCKUP VISUALS =================== */
/* -- 01 · BiglypEnroll: dual-engine dashboard -- */
function EnrollVisual() {
  const bars = [
    { l: 'APTITUDE', v: 82, c: INDIGO },
    { l: 'INTEREST', v: 74, c: '#F59E0B' },
    { l: 'EQ', v: 91, c: '#10B981' },
    { l: 'STYLE', v: 68, c: '#EC4899' },
  ];
  const chart = [40, 68, 34, 82, 52, 92, 58, 78, 44, 72, 88];
  return (
    <Box className="mockup-hover relative">
      {/* Career hub — light card */}
      <Box className="rounded-3xl bg-white border border-indigo-100 p-5 shadow-[0_30px_60px_-30px_rgba(79,70,229,0.4)]">
        <Box className="flex items-center gap-3">
          <Box className="h-10 w-10 rounded-2xl flex items-center justify-center" style={{ background: TINT, color: INDIGO_DEEP }}><GraduationCap className="h-5 w-5" /></Box>
          <Box>
            <Typography variant="inherit" component="p" className="text-[10px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>Sub-product · 01</Typography>
            <Typography variant="inherit" component="p" className="font-head font-black text-[15px]" style={{ color: NAVY }}>Biglyp Career Hub</Typography>
          </Box>
        </Box>
        <Box className="mt-4 rounded-2xl border border-indigo-50 bg-indigo-50/40 p-3.5">
          <Box className="flex items-center justify-between">
            <Typography variant="inherit" component="p" className="text-[9.5px] font-bold uppercase tracking-widest text-slate-500">Psychometric report</Typography>
            <Typography variant="inherit" component="p" className="text-[9.5px] font-medium text-slate-400">Class 10 · Aarav Sharma</Typography>
          </Box>
          <Box className="mt-3 grid grid-cols-4 gap-2.5">
            {bars.map((b) => (
              <Box key={b.l} className="text-center">
                <Typography variant="inherit" component="p" className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400">{b.l}</Typography>
                <Typography variant="inherit" component="p" className="font-head font-black text-[15px] mt-0.5" style={{ color: b.c }}>{b.v}%</Typography>
                <Box className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden"><Box className="h-full rounded-full" style={{ width: `${b.v}%`, background: b.c }} /></Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Fee collection — dark card offset */}
      <Box className="mt-4 rounded-3xl p-5 text-white shadow-[0_30px_60px_-28px_rgba(30,27,75,0.6)]" style={{ background: darkGrad }}>
        <Box className="flex items-center gap-3">
          <Box className="h-10 w-10 rounded-2xl flex items-center justify-center bg-white/12"><Wallet className="h-5 w-5" /></Box>
          <Box>
            <Typography variant="inherit" component="p" className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Sub-product · 02</Typography>
            <Typography variant="inherit" component="p" className="font-head font-black text-[15px]">Biglyp Fee Collection</Typography>
          </Box>
        </Box>
        <Box className="mt-4 rounded-2xl bg-white/8 border border-white/10 p-3.5">
          <Box className="flex items-center justify-between">
            <Typography variant="inherit" component="p" className="text-[9.5px] font-bold uppercase tracking-widest text-white/60">Live dashboard</Typography>
            <Typography variant="inherit" component="p" className="text-[9.5px] font-medium text-white/50">AY 2025-26</Typography>
          </Box>
          <Box className="mt-3 grid grid-cols-3 gap-2">
            {[{ l: 'COLLECTED', v: '₹18.4L', c: '#A5B4FC' }, { l: 'DUE', v: '₹2.6L', c: YELLOW }, { l: 'ON EMI', v: '142', c: '#fff' }].map((s) => (
              <Box key={s.l}>
                <Typography variant="inherit" component="p" className="text-[8.5px] font-bold uppercase tracking-wider text-white/50">{s.l}</Typography>
                <Typography variant="inherit" component="p" className="font-head font-black text-[17px]" style={{ color: s.c }}>{s.v}</Typography>
              </Box>
            ))}
          </Box>
          <Box className="mt-3.5 flex items-end justify-between gap-1 h-14">
            {chart.map((h, i) => (
              <Box key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: i % 3 === 0 ? YELLOW : i % 3 === 1 ? '#818CF8' : '#4F46E5' }} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* -- 02 · Career Hub: psychometrics radar + discovery -- */
function CareerVisual() {
  const axes = ['APTITUDE', 'INTERESTS', 'PERSONALITY', 'VALUES', 'SKILLS'];
  const PROFILES = [
    { key: 'Ananya', name: "Ananya's profile", meta: 'Class 11 · Science stream', vals: [0.72, 0.9, 0.85, 0.55, 0.68], readiness: 72, rec: 'Design & Product Engineering', fit: '92% fit', color: INDIGO },
    { key: 'Rahul', name: "Rahul's profile", meta: 'Class 12 · Science stream', vals: [0.92, 0.6, 0.7, 0.84, 0.9], readiness: 81, rec: 'Data Science & AI Research', fit: '95% fit', color: '#7C3AED' },
  ];
  const [pi, setPi] = useState(0);
  const p = PROFILES[pi];
  const cx = 120, cy = 110, R = 82;
  const pt = (i: number, f: number) => {
    const a = (-90 + i * 72) * Math.PI / 180;
    return [cx + Math.cos(a) * R * f, cy + Math.sin(a) * R * f];
  };
  const ring = (f: number) => axes.map((_, i) => pt(i, f).join(',')).join(' ');
  const data = p.vals.map((v, i) => pt(i, v).join(',')).join(' ');
  const unis = [
    { n: 'U of Toronto', c: 'B.Sc. Computer Science', f: '#21', fee: '₹32L / yr' },
    { n: 'UBC Vancouver', c: 'B.Sc. Data Science', f: '#38', fee: '₹28L / yr' },
    { n: 'McGill', c: 'B.Eng. Software', f: '#42', fee: '₹24L / yr' },
  ];
  return (
    <Box className="mockup-hover relative">
      {/* Radar profile card */}
      <Box className="rounded-[26px] bg-white p-5 sm:p-6 shadow-[0_36px_70px_-34px_rgba(79,70,229,0.5)] ring-1 ring-indigo-100/70">
        <Box className="flex items-center justify-between gap-2">
          <Box component="span" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white" style={{ background: grad }}><Brain className="h-3.5 w-3.5" /> Psychometrics</Box>
          {/* Compare toggle */}
          <Box className="flex items-center gap-0.5 rounded-full bg-slate-100 p-0.5">
            {PROFILES.map((pf, i) => (
              <Box component="button" key={pf.key} onClick={() => setPi(i)} data-testid={`radar-profile-${i}`}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
                style={i === pi ? { background: '#fff', color: NAVY, boxShadow: '0 1px 3px rgba(15,23,42,0.15)' } : { color: '#94A3B8', background: 'transparent' }}>
                {pf.key}
              </Box>
            ))}
          </Box>
        </Box>
        <Box className="mt-4 flex items-end justify-between">
          <Box>
            <Typography variant="inherit" component="p" className="font-head font-black text-[20px] leading-none" style={{ color: NAVY }}>{p.name}</Typography>
            <Typography variant="inherit" component="p" className="text-[12px] text-slate-500 mt-1">{p.meta}</Typography>
          </Box>
          <Box className="text-right">
            <Typography variant="inherit" component="p" className="font-head font-black text-[22px] leading-none" style={{ color: p.color }}><CountUp key={p.readiness} end={p.readiness} duration={900} /></Typography>
            <Typography variant="inherit" component="p" className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Readiness</Typography>
          </Box>
        </Box>
        <Box className="mt-1 flex justify-center">
          <Box component="svg" viewBox="0 0 240 210" className="w-full max-w-[260px]">
            <defs>
              <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={p.color} stopOpacity="0.45" />
                <stop offset="100%" stopColor={INDIGO_DEEP} stopOpacity="0.28" />
              </linearGradient>
            </defs>
            {[0.4, 0.7, 1].map((f) => (<polygon key={f} points={ring(f)} fill="none" stroke="#E9E7FB" strokeWidth="1" />))}
            {axes.map((_, i) => { const [x, y] = pt(i, 1); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E9E7FB" strokeWidth="1" />; })}
            <motion.g key={p.key} initial={{ opacity: 0, scale: 0.15 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false, amount: 0.5 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'view-box' as any }}>
              <polygon points={data} fill="url(#radarFill)" stroke={p.color} strokeWidth="2.5" strokeLinejoin="round" />
              {p.vals.map((v, i) => { const [x, y] = pt(i, v); return <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" stroke={p.color} strokeWidth="2" />; })}
            </motion.g>
            {axes.map((ax, i) => { const [x, y] = pt(i, 1.18); return <text key={ax} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fontWeight="700" fill="#94A3B8">{ax}</text>; })}
          </Box>
        </Box>
        <Box className="mt-2 rounded-2xl p-3.5 flex items-center justify-between gap-3" style={{ background: TINT }}>
          <Box className="min-w-0">
            <Typography variant="inherit" component="p" className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Top recommendation</Typography>
            <Typography variant="inherit" component="p" className="font-head font-bold text-[13.5px] mt-0.5 truncate" style={{ color: NAVY }}>{p.rec}</Typography>
          </Box>
          <Box component="span" className="rounded-full px-2.5 py-1 text-[11px] font-bold text-white shrink-0" style={{ background: '#10B981' }}>{p.fit}</Box>
        </Box>
      </Box>

      {/* Course discovery card */}
      <Box className="mt-4 rounded-[26px] bg-white p-5 sm:p-6 shadow-[0_36px_70px_-34px_rgba(79,70,229,0.5)] ring-1 ring-indigo-100/70">
        <Box className="flex items-center justify-between">
          <Box component="span" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ background: TINT, color: INDIGO_DEEP }}><Globe className="h-3.5 w-3.5" /> Course discovery</Box>
          <Typography variant="inherit" component="p" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">2.5L+ programs</Typography>
        </Box>
        <Box className="mt-3.5 flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200/70 px-3.5 py-2.5">
          <Search className="h-4 w-4 text-slate-400" />
          <Typography variant="inherit" component="p" className="text-[12px] text-slate-500">Computer Science · Canada · 2026 intake</Typography>
        </Box>
        <Box className="mt-3 grid gap-2">
          {unis.map((u) => (
            <Box key={u.n} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-2.5 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40">
              <Box className="h-9 w-9 rounded-xl flex items-center justify-center text-[14px] shrink-0" style={{ background: TINT }}>🇨🇦</Box>
              <Box className="min-w-0 flex-1">
                <Typography variant="inherit" component="p" className="font-head font-bold text-[13px] truncate" style={{ color: NAVY }}>{u.n}</Typography>
                <Typography variant="inherit" component="p" className="text-[11px] text-slate-500 truncate">{u.c}</Typography>
              </Box>
              <Box className="text-right shrink-0">
                <Typography variant="inherit" component="p" className="text-[10px] font-bold" style={{ color: INDIGO }}>{u.f}</Typography>
                <Typography variant="inherit" component="p" className="text-[11.5px] font-semibold text-slate-700">{u.fee}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* -- 03 · Fee Collection: parents / institutions + payment options -- */
function FeeVisual() {
  const parents = [
    { icon: CreditCard, t: 'Easy Monthly Payments', d: 'Split fees into affordable installments.' },
    { icon: Landmark, t: 'Auto Debit', d: 'Deducted on time — no late fees.' },
    { icon: Bell, t: 'Smart Reminders', d: 'Track payments, stay updated always.' },
  ];
  const inst = [
    { icon: Wallet, t: 'Better Cash Flow', d: 'Full year fees upfront, single payment.' },
    { icon: Users, t: 'Hassle-Free', d: 'Eliminate follow-ups & manual chasing.' },
    { icon: TrendingUp, t: 'Higher Conversions', d: 'Flexible options improve admissions.' },
  ];
  const pay = [
    { icon: Zap, t: 'Auto-Collect', d: 'Recurring NACH / UPI', c: INDIGO },
    { icon: QrCode, t: 'Instant', d: 'QR & payment links', c: '#0EA5E9' },
    { icon: Layers, t: '0% EMI', d: 'No-cost financing', c: '#F59E0B' },
  ];
  const Col = ({ title, items, accent }: any) => (
    <Box className="rounded-2xl bg-white border border-indigo-100 p-4">
      <Box className="flex justify-center">
        <Box component="span" className="rounded-full px-3.5 py-1.5 text-[12px] font-extrabold uppercase tracking-widest" style={{ background: accent + '18', color: accent }}>{title}</Box>
      </Box>
      <Box className="mt-3.5 grid gap-3.5">
        {items.map((it: any) => {
          const Icon = it.icon;
          return (
            <Box key={it.t} className="flex items-start gap-2.5">
              <Box className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: accent + '16', color: accent }}><Icon className="h-4 w-4" /></Box>
              <Box>
                <Typography variant="inherit" component="p" className="font-head font-extrabold text-[13.5px] leading-tight" style={{ color: NAVY }}>{it.t}</Typography>
                <Typography variant="inherit" component="p" className="text-[11.5px] text-slate-500 leading-snug mt-0.5">{it.d}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
  return (
    <Box className="mockup-hover relative rounded-3xl p-5 shadow-[0_36px_70px_-34px_rgba(79,70,229,0.5)]" style={{ background: grad }}>
      <Box className="grid grid-cols-2 gap-3">
        <Col title="Parents" items={parents} accent={INDIGO_DEEP} />
        <Col title="Institutions" items={inst} accent={'#0EA5E9'} />
      </Box>
      <Box className="mt-3 grid grid-cols-3 gap-3">
        {pay.map((p) => {
          const Icon = p.icon;
          return (
            <Box key={p.t} className="rounded-2xl bg-white p-3.5 text-center">
              <Box className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: p.c + '18', color: p.c }}><Icon className="h-[18px] w-[18px]" /></Box>
              <Typography variant="inherit" component="p" className="font-head font-extrabold text-[13.5px] mt-2" style={{ color: NAVY }}>{p.t}</Typography>
              <Typography variant="inherit" component="p" className="text-[11px] text-slate-500 mt-0.5">{p.d}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

/* =================== TABBED FEATURE SECTION =================== */
function TabbedSection({ id, eyebrow, title, subtitle, tabs, footer, bg }: any) {
  const [active, setActive] = useState(0);
  const cur = tabs[active];
  const CurIcon = cur.icon;
  return (
    <Box component="section" id={id} className="py-20" style={bg ? { background: bg } : undefined}>
      <Box className="max-w-7xl mx-auto px-5">
        <Box className="text-center max-w-3xl mx-auto">
          {eyebrow && (
            <Box component="span" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest bg-white" style={{ color: INDIGO_DEEP, border: '1px solid #C7D2FE' }}>
              <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
            </Box>
          )}
          <Typography variant="inherit" component="h2" className="font-head mt-4 text-3xl md:text-4xl font-black tracking-tight leading-tight" style={{ color: NAVY }}>{title}</Typography>
          <Typography variant="inherit" component="p" className="mt-4 text-[15px] text-slate-600">{subtitle}</Typography>
        </Box>

        <Box className="mt-10 grid lg:grid-cols-[300px_1fr] gap-6 items-stretch">
          <Box className="flex lg:flex-col gap-2 overflow-x-auto pb-1">
            {tabs.map((t: any, i: number) => {
              const Icon = t.icon;
              const on = i === active;
              return (
                <Box component="button" key={t.label} onClick={() => setActive(i)} data-testid={`tab-${id}-${i}`}
                  className={`shrink-0 lg:w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl text-[13.5px] font-semibold transition-all border ${on ? 'text-white border-transparent shadow-lg shadow-indigo-600/20' : 'bg-white text-slate-600 border-indigo-100 hover:border-indigo-300'}`}
                  style={on ? { background: grad } : undefined}>
                  <Box className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: on ? 'rgba(255,255,255,0.2)' : TINT, color: on ? '#fff' : INDIGO_DEEP }}><Icon className="h-4 w-4" /></Box>
                  {t.label}
                </Box>
              );
            })}
          </Box>

          <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="rounded-3xl bg-white border border-indigo-100 overflow-hidden shadow-[0_24px_60px_-30px_rgba(79,70,229,0.4)] grid md:grid-cols-2 items-stretch">
            <Box className="p-5 md:p-6 flex flex-col">
              <Box className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: TINT, color: INDIGO_DEEP }}><CurIcon className="h-5 w-5" /></Box>
              <Typography variant="inherit" component="h3" className="font-head text-xl md:text-2xl font-black mt-3" style={{ color: NAVY }}>{cur.cardTitle}</Typography>
              {cur.desc.map((d: string, k: number) => (
                <Typography key={k} variant="inherit" component="p" className="mt-1.5 text-[13px] leading-snug text-slate-600">{d}</Typography>
              ))}
              <Box component="ul" className="mt-3 grid gap-1.5">
                {cur.points?.map((p: string) => (
                  <Box component="li" key={p} className="flex items-start gap-2 text-[12.5px] leading-snug text-slate-700">
                    <Box className="h-4 w-4 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ background: TINT, color: INDIGO_DEEP }}><Check className="h-3 w-3" /></Box>{p}
                  </Box>
                ))}
              </Box>
              <Box className="mt-4 flex flex-wrap gap-2.5">
                <Button className="h-10 px-4 rounded-full font-semibold text-[13px] text-white shadow-lg shadow-indigo-600/20" style={{ background: grad }}>{cur.primary} <ArrowRight className="h-4 w-4 ml-2" /></Button>
                {cur.secondary && (<Button variant="outline" className="h-10 px-4 rounded-full font-semibold text-[13px] border-indigo-200 text-indigo-700 hover:bg-indigo-50 bg-transparent">{cur.secondary}</Button>)}
              </Box>
            </Box>
            <Box className="relative hidden md:block">
              <Box component="img" src={cur.img} alt={cur.cardTitle} className="absolute inset-0 w-full h-full object-cover" />
              <Box className="absolute inset-0" style={{ background: 'linear-gradient(160deg, transparent 55%, rgba(30,27,75,0.28))' }} />
            </Box>
          </motion.div>
        </Box>

        {footer && (
          <Box className="mt-10 text-center">
            <Typography variant="inherit" component="p" className="text-[14px] text-slate-600">{footer.text}</Typography>
            <Box className="mt-4"><Button className="h-11 px-7 rounded-full font-semibold text-sm text-white shadow-lg shadow-indigo-600/20" style={{ background: grad }}>{footer.cta}</Button></Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* =================== PRODUCT SECTION (mockup visuals) =================== */
function ProductSection({ theme = 'light', reverse = false, index, icon, tag, title, tagline, desc, points, href, accent, visual, note, stats }: any) {
  const Icon = icon;
  const dark = theme === 'dark';
  const bg = dark ? darkGrad : theme === 'tint' ? TINT : '#ffffff';
  const titleColor = dark ? '#fff' : NAVY;
  const bodyColor = dark ? 'rgba(255,255,255,0.82)' : '#475569';
  const chipBg = dark ? 'rgba(255,255,255,0.12)' : TINT;
  const chipText = dark ? '#fff' : INDIGO_DEEP;
  return (
    <Box component="section" className="py-14 sm:py-20 relative overflow-hidden" style={{ background: bg }}>
      {dark && <Box className="absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #6366F1, transparent 70%)' }} />}
      <Box className="relative max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        {/* Media / mockup */}
        <Box className={`relative ${reverse ? 'lg:order-2' : ''}`}>{visual}</Box>
        {/* Copy */}
        <Box className={reverse ? 'lg:order-1' : ''}>
          <Box className="flex items-center gap-3">
            <Box className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: dark ? 'rgba(255,255,255,0.14)' : accent + '16', color: dark ? '#fff' : accent }}><Icon className="h-6 w-6" /></Box>
            <Box component="span" className="text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1" style={{ background: chipBg, color: chipText }}>{tag}</Box>
            <Box component="span" className="ml-auto text-[11px] font-bold" style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#94A3B8' }}>0{index} / 03</Box>
          </Box>
          <Typography variant="inherit" component="h2" className="font-head mt-5 text-3xl md:text-4xl font-black tracking-tight leading-tight" style={{ color: titleColor }}>{title}</Typography>
          <Typography variant="inherit" component="p" className="mt-1.5 font-head text-lg font-bold" style={{ color: dark ? '#A5B4FC' : accent }}>{tagline}</Typography>
          <Typography variant="inherit" component="p" className="mt-4 text-[14.5px] leading-relaxed" style={{ color: bodyColor }}>{desc}</Typography>
          <Box component="ul" className="mt-6 grid sm:grid-cols-2 gap-2.5">
            {points.map((p: string) => (
              <Box component="li" key={p} className="flex items-start gap-2 text-[13px]" style={{ color: dark ? 'rgba(255,255,255,0.9)' : '#334155' }}>
                <Box className="h-4 w-4 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ background: dark ? 'rgba(255,255,255,0.16)' : accent + '18', color: dark ? '#fff' : accent }}><Check className="h-3 w-3" /></Box>{p}
              </Box>
            ))}
          </Box>
          {stats && (
            <Box className="mt-7 grid grid-cols-3 gap-3 rounded-2xl p-4" style={{ background: dark ? 'rgba(255,255,255,0.08)' : accent + '0F', border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : accent + '22'}` }}>
              {stats.map((st: any) => (
                <Box key={st.label} className="text-center sm:text-left">
                  <Typography variant="inherit" component="p" className="font-head font-black text-xl sm:text-2xl leading-none" style={{ color: dark ? '#fff' : accent }}>
                    <CountUp end={st.end} prefix={st.prefix || ''} suffix={st.suffix || ''} decimals={st.decimals || 0} />
                  </Typography>
                  <Typography variant="inherit" component="p" className="text-[10.5px] font-medium mt-1 leading-tight" style={{ color: dark ? 'rgba(255,255,255,0.65)' : '#64748B' }}>{st.label}</Typography>
                </Box>
              ))}
            </Box>
          )}
          <Box className="mt-7">
            <Link href={href}>
              <Button className="h-11 px-6 rounded-full font-semibold text-sm text-white shadow-lg" style={{ background: dark ? '#fff' : grad, color: dark ? NAVY : '#fff', boxShadow: '0 10px 30px -8px rgba(79,70,229,0.4)' }}>
                Explore {title} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </Box>
          {note && (
            <Typography variant="inherit" component="p" data-testid="fee-emi-footnote" className="mt-4 text-[12.5px] italic" style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#94A3B8' }}>{note}</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

/* =================== DARK CTA BAND =================== */
function DarkCta() {
  return (
    <Box component="section" id="book-demo" className="relative overflow-hidden" style={{ background: darkGrad }}>
      <Box className="absolute -top-20 -left-16 h-72 w-72 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #6366F1, transparent 70%)' }} />
      <Box className="relative max-w-4xl mx-auto px-5 py-16 text-center text-white">
        <Box component="span" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest bg-white/12"><Rocket className="h-3.5 w-3.5" /> Start today</Box>
        <Typography variant="inherit" component="h2" className="font-head mt-4 text-3xl md:text-4xl font-black tracking-tight">Ready to build a future-ready journey?</Typography>
        <Typography variant="inherit" component="p" className="mt-3 text-white/80 max-w-xl mx-auto text-[15px]">Take the AI psychometric assessment, discover your best-fit courses across 42 countries, and finance it all with 0% EMIs — in one place.</Typography>
        <Box className="mt-7 flex flex-wrap gap-3 justify-center">
          <Box component="a" href="#journey"><Button className="h-12 px-7 rounded-full font-semibold text-sm" style={{ background: '#fff', color: NAVY }}>Take Assessment <ArrowRight className="h-4 w-4 ml-2" /></Button></Box>
          <Box component="a" href="#platform"><Button variant="outline" className="h-12 px-7 rounded-full font-semibold text-sm border-white/40 text-white hover:bg-white/10 bg-transparent">Talk to our team</Button></Box>
        </Box>
      </Box>
    </Box>
  );
}

/* =================== TESTIMONIALS =================== */
const REVIEWS = [
  { name: 'Saransh Waghela', role: 'Student', tag: 'DiscoverU', color: VIOLET, text: 'This assessment was very helpful to identify and acknowledge my career goals, and gave insight about my weakness and strengths. I really liked the way everything was so organized and direct. Everything written in the report — about my strengths and weaknesses — was exactly the obstacles I was facing to organize, plan, and simplify my goals.' },
  { name: 'Divakar Shetty', role: 'Father of Ageithya · Creative Consultant', tag: 'Explored', color: '#7C3AED', text: 'As parents, we were a little skeptical before taking the psychometric assessment for our son. But when we received the report (DiscoverU), we were pleasantly surprised by how accurately it described him. Many observations about his interests, learning style, strengths and personality matched what we see at home. It also highlighted a few areas we hadn\u2019t thought about before — a very useful experience that gave us greater confidence in understanding his potential and future direction.' },
  { name: 'Ritika Menon', role: 'Student', tag: 'Discovery', color: '#EC4899', text: 'Biglyp made my study-abroad journey feel simple. From shortlisting the right universities to sorting out my education loan, everything was in one place — with guidance at every single step.' },
];
function Testimonials() {
  return (
    <Box component="section" className="py-20" style={{ background: `linear-gradient(180deg, #fff, ${TINT})` }}>
      <Box className="max-w-7xl mx-auto px-5">
        <Box className="text-center">
          <Typography variant="inherit" component="h2" className="font-head text-3xl md:text-4xl font-black tracking-tight" style={{ color: NAVY }}>What our customers say</Typography>
          <Typography variant="inherit" component="p" className="mt-3 text-[15px] text-slate-600">Trusted experiences shared by the people who matter most.</Typography>
        </Box>
        <Box className="mt-12 grid md:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-3xl bg-white border border-indigo-100 p-6 shadow-[0_20px_50px_-34px_rgba(79,70,229,0.45)] flex flex-col">
              <Box className="flex items-center justify-between">
                <Quote className="h-8 w-8" style={{ color: r.color, opacity: 0.35 }} />
                <Box component="span" className="text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1" style={{ background: r.color + '16', color: r.color }}>{r.tag}</Box>
              </Box>
              <Box className="flex gap-0.5 mt-3">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="h-4 w-4" style={{ color: YELLOW, fill: YELLOW }} />)}</Box>
              <Typography variant="inherit" component="p" className="mt-3 text-[13.5px] leading-relaxed text-slate-600 flex-1">{r.text}</Typography>
              <Box className="mt-5 flex items-center gap-3 pt-4 border-t border-indigo-50">
                <Box className="h-11 w-11 rounded-full flex items-center justify-center font-head font-black text-white" style={{ background: `linear-gradient(135deg, ${r.color}, ${INDIGO_DEEP})` }}>{r.name[0]}</Box>
                <Box><Typography variant="inherit" component="p" className="font-head font-bold text-[14px]" style={{ color: NAVY }}>{r.name}</Typography><Typography variant="inherit" component="p" className="text-[11.5px] text-slate-500">{r.role}</Typography></Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* =================== FAQ =================== */
const FAQS = [
  { q: 'What is Biglyp?', a: 'Biglyp is an end-to-end student success platform — from AI career discovery and course/university matching to admissions support and education financing — all in one place.' },
  { q: 'How do you help students choose the right career?', a: 'Our AI-powered psychometric assessment analyses 60+ personality traits across aptitude, interest, EQ and personality to recommend careers and courses that match your strengths and passions.' },
  { q: 'What types of assessments do you offer?', a: 'We offer a 4-dimensional psychometric assessment (Aptitude, Interest, EQ and Personality) plus career-readiness and course-fit evaluations.' },
  { q: 'How is Biglyp different from other platforms?', a: 'Biglyp unifies career discovery, 2,50,000+ global courses, admissions assistance and education financing under one roof — powered by AI and backed by expert counsellors.' },
  { q: 'Do you support students planning to study abroad?', a: 'Yes. We cover 42 countries with course discovery, admissions guidance, visa and travel support, and financing for studying in the USA, UK, Canada, Australia, Germany and more.' },
  { q: "Can you help parents plan their child's education?", a: "Absolutely. Parents get transparent guidance, financial planning tools and 0% EMI options to plan and fund their child's education with confidence." },
];
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Box component="section" className="py-20 bg-white">
      <Box className="max-w-4xl mx-auto px-5">
        <Box className="text-center"><Typography variant="inherit" component="h2" className="font-head text-3xl md:text-4xl font-black tracking-tight" style={{ color: NAVY }}>Frequently asked questions</Typography></Box>
        <Box className="mt-10 space-y-3">
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <Box key={f.q} className="rounded-2xl border border-indigo-100 bg-white overflow-hidden transition-shadow" style={on ? { boxShadow: '0 20px 40px -28px rgba(79,70,229,0.4)' } : undefined}>
                <Box component="button" onClick={() => setOpen(on ? null : i)} data-testid={`faq-${i}`} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                  <Typography variant="inherit" component="span" className="font-head font-bold text-[15px]" style={{ color: NAVY }}>{f.q}</Typography>
                  <Box className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-transform" style={{ background: TINT, color: INDIGO_DEEP, transform: on ? 'rotate(180deg)' : 'none' }}><ChevronDown className="h-4 w-4" /></Box>
                </Box>
                {on && <Typography variant="inherit" component="p" className="px-5 pb-5 -mt-1 text-[13.5px] leading-relaxed text-slate-600">{f.a}</Typography>}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

/* =================== FOOTER =================== */
function HomeFooter() {
  return (
    <Box component="footer" style={{ background: darkGrad }} className="text-white">
      <Box className="max-w-7xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <Box>
          <Logo className="h-7 grayscale invert brightness-200" />
          <Typography variant="inherit" component="p" className="mt-3 text-[13px] text-white/60 leading-relaxed max-w-xs">Building future-ready students — from early career discovery to the right course, university and beyond.</Typography>
          <Box className="mt-5">
            <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-white/70">Subscribe to our newsletter</Typography>
            <Box component="form" className="mt-2 flex items-center gap-2 max-w-sm">
              <Input placeholder="Enter your email address" className="bg-white/10 border-white/15 text-white placeholder:text-white/50 rounded-full h-10 text-sm" />
              <Button type="button" className="h-10 rounded-full px-4 text-sm font-semibold text-white" style={{ background: VIOLET }}>Subscribe</Button>
            </Box>
          </Box>
        </Box>
        <Box>
          <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-white/70">Platform</Typography>
          <Box component="ul" className="mt-4 space-y-2 text-[13px] text-white/80">
            <Box component="li"><Box component="a" href="#journey" className="hover:text-white">Psychometric Assessment</Box></Box>
            <Box component="li"><Link href="/biglypenroll" className="hover:text-white">BiglypEnroll</Link></Box>
            <Box component="li"><Link href="/career-hub" className="hover:text-white">Biglyp Career Hub</Link></Box>
            <Box component="li"><Link href="/fee-collection" className="hover:text-white">Biglyp Fee Collection</Link></Box>
          </Box>
        </Box>
        <Box>
          <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-white/70">Study destinations</Typography>
          <Box component="ul" className="mt-4 space-y-2 text-[13px] text-white/80">
            {['Study in USA', 'Study in UK', 'Study in Canada', 'Study in Australia', 'Study in Germany', 'Study in India'].map((d) => (<Box component="li" key={d}>{d}</Box>))}
          </Box>
        </Box>
        <Box>
          <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-white/70">Contact us</Typography>
          <Box component="ul" className="mt-4 space-y-3 text-[13px] text-white/80"><Box component="li" className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@biglyp.com</Box></Box>
        </Box>
      </Box>
      <Box className="border-t border-white/10">
        <Box className="max-w-7xl mx-auto px-5 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-white/50">
          <Typography variant="inherit" component="p">© 2026 Biglyp · All Rights Reserved</Typography>
          <Box className="flex items-center gap-5">
            <Box component="a" href="#" className="hover:text-white">Terms and Conditions</Box>
            <Box component="a" href="#" className="hover:text-white">Privacy Policy</Box>
            <Box component="a" href="#" className="hover:text-white">Refund Policy</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* =================== STICKY DEMO BAR =================== */
function DemoBar() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (dismissed) return null;
  return (
    <motion.div initial={{ y: 130, opacity: 0 }} animate={show ? { y: 0, opacity: 1 } : { y: 130, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 bottom-4 z-50 px-4 pointer-events-none">
      <Box className="pointer-events-auto max-w-3xl mx-auto rounded-2xl flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3" style={{ background: darkGrad, boxShadow: '0 24px 50px -18px rgba(30,27,75,0.65)' }} data-testid="demo-bar">
        <Box className="hidden sm:flex h-10 w-10 rounded-xl items-center justify-center bg-white/12 text-white shrink-0"><Rocket className="h-5 w-5" /></Box>
        <Box className="min-w-0 flex-1">
          <Typography variant="inherit" component="p" className="font-head font-bold text-white text-[14px] leading-tight truncate">See Biglyp in action for your institution</Typography>
          <Typography variant="inherit" component="p" className="text-white/60 text-[11.5px] leading-tight truncate">Career readiness + fee collection, in one 20-min demo.</Typography>
        </Box>
        <Box component="a" href="#book-demo" className="shrink-0"><Button data-testid="demo-bar-cta" className="h-10 px-4 sm:px-5 rounded-full font-semibold text-[13px]" style={{ background: '#fff', color: NAVY }}>Book a demo</Button></Box>
        <Box component="button" onClick={() => setDismissed(true)} data-testid="demo-bar-close" className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"><X className="h-4 w-4" /></Box>
      </Box>
    </motion.div>
  );
}

/* =================== PAGE =================== */
export default function Homepage() {
  return (
    <Box className="min-h-screen bg-white text-slate-800 font-sans">
      <HomeNav />
      <Hero />
      <Stats />
      <TabbedSection
        id="journey" eyebrow="Complete education journey"
        title="Your complete education journey starts here"
        subtitle="From career discovery to university enrollment – we provide end-to-end support with cutting-edge technology and expert guidance."
        bg={TINT}
        tabs={[
          { label: 'Psychometric Assessment', icon: Brain, cardTitle: 'Biglyp Discovery', img: LEARN_IMG, primary: 'Take Assessment', secondary: 'Learn more', desc: ['Take our AI-powered psychometric assessment to uncover your strengths, interests, and ideal career paths. Get personalized recommendations based on 60+ personality traits, and discover careers that match your passions and future goals.'], points: ['60+ personality traits analysed', 'Aptitude · Interest · EQ · Personality', 'Personalised career recommendations', 'Clear, easy-to-read reports'] },
          { label: 'AI Career Search', icon: Search, cardTitle: 'AI Career Search', img: LEARN_IMG, primary: 'Search Careers', secondary: 'Learn more', desc: ['Search across 2,50,000+ courses and programs in 42 countries. Our AI matches your profile to the best-fit careers and universities in seconds.'], points: ['2,50,000+ courses worldwide', '42 countries in one search', 'AI best-fit matching', 'Compare programs side by side'] },
          { label: 'Admission Assistance', icon: FileCheck2, cardTitle: 'Admission Assistance', img: LEARN_IMG, primary: 'Get Started', secondary: 'Learn more', desc: ['End-to-end application support — shortlisting, documentation, SOPs and interview prep — so you never miss a deadline or a dream college.'], points: ['Shortlisting & documentation', 'SOPs and interview prep', 'Deadline tracking, done for you', 'Expert counsellor support'] },
          { label: 'Exam Preparation', icon: BookOpenCheck, cardTitle: 'Exam Preparation', img: LEARN_IMG, primary: 'Start Prep', secondary: 'Learn more', desc: ['Structured prep for competitive and entrance exams with expert-curated content, mock tests and real-time progress tracking.'], points: ['Expert-curated study content', 'Full-length mock tests', 'Real-time progress tracking', 'Personalised study plans'] },
          { label: 'Scholarships', icon: Award, cardTitle: 'Scholarships', img: LEARN_IMG, primary: 'Find Scholarships', secondary: 'Learn more', desc: ['Discover and apply to scholarships you actually qualify for, with guided applications and smart deadline reminders.'], points: ['Scholarships you qualify for', 'Guided applications', 'Smart deadline reminders', 'Merit & need-based options'] },
        ]}
      />
      <TabbedSection
        id="financing" eyebrow="Smart financial solutions"
        title="Empowering your education journey with smart, reliable financial solutions"
        subtitle="Get access to 20+ trusted banks, NBFCs, and fintechs — compare, calculate, and secure the right loan with ease."
        footer={{ text: 'Your education loan simplified with Biglyp, powered by CreduPe.', cta: 'Apply Now' }}
        tabs={[
          { label: 'Education Financing', icon: Landmark, cardTitle: 'Education Financing', img: FEE_IMG, primary: 'Know more', desc: ['Explore the best education loan options, compare lenders, check eligibility, estimate EMIs, and receive expert guidance to finance your higher education journey with confidence and ease. Compare education loans from trusted financial institutions.'], points: ['Compare 20+ banks & NBFCs', 'Check eligibility instantly', 'Estimate EMIs upfront', 'Expert guidance end-to-end'] },
          { label: 'EMI Calculator', icon: Calculator, cardTitle: 'EMI Calculator', img: FEE_IMG, primary: 'Calculate EMI', desc: ['Estimate your monthly EMIs instantly. Adjust loan amount, tenure and interest rate to plan repayments that fit your budget.'], points: ['Instant EMI estimates', 'Adjust amount, tenure & rate', 'Plan a budget that fits', 'No sign-up required'] },
          { label: 'Check Your Loan Eligibility', icon: Gauge, cardTitle: 'Check Your Loan Eligibility', img: FEE_IMG, primary: 'Check Eligibility', desc: ['Check how much you can borrow in minutes — a soft check that never impacts your credit score.'], points: ['Know your borrowing limit', 'Soft check in minutes', 'Zero credit-score impact', 'Matched to right lenders'] },
          { label: 'Repayment Calculator', icon: LineChart, cardTitle: 'Repayment Calculator', img: FEE_IMG, primary: 'Plan Repayment', desc: ['Visualise your full repayment schedule, interest breakup and moratorium options before you commit.'], points: ['Full repayment schedule', 'Interest & principal breakup', 'Moratorium options', 'Plan before you commit'] },
          { label: 'Check Your CIBIL Score', icon: ShieldCheck, cardTitle: 'Check Your CIBIL Score', img: FEE_IMG, primary: 'Check CIBIL Score', desc: ['Check your CIBIL score for free and get personalised tips to improve it before you apply for education finance.'], points: ['Free CIBIL score check', 'Personalised improvement tips', 'Track your progress', 'Get application-ready'] },
        ]}
      />

      {/* Platform anchor + 3 dedicated engine sections with custom mockups */}
      <Box id="platform">
        <ProductSection index={1} theme="light" reverse={false} icon={GraduationCap} accent={INDIGO_DEEP}
          tag="For Institutions" title="BiglypEnroll" tagline="Two powerful engines. One institutional platform." href="/biglypenroll"
          visual={<EnrollVisual />}
          desc="Career readiness and fee collection — the two things every parent cares about most — unified into a single OS for your institution, trusted by schools, colleges and skilling institutes."
          points={['Admissions & enrolment, end-to-end', 'Career-readiness + fee-collection engines', 'Plug into your ERP or launch a white-labeled portal', 'ISO 27001 · DPDP · RBI-regulated']}
          stats={[{ end: 6500, suffix: '+', label: 'Institutions' }, { end: 50, suffix: ' L+', label: 'Students' }, { end: 4200, prefix: '₹', suffix: ' Cr+', label: 'Fees processed' }]} />

        <ProductSection index={2} theme="dark" reverse={true} icon={Brain} accent="#A5B4FC"
          tag="For Students" title="Biglyp Career Hub" tagline="Discover the right career. Then the right university." href="/career-hub"
          visual={<CareerVisual />}
          desc="AI-driven 4-dimensional psychometrics paired with a live index of 2,50,000+ courses across 42 countries — built for counsellors, loved by students."
          points={['4-D psychometrics: Aptitude · Interest · EQ · Personality', '2,50,000+ courses across 42 countries', 'Personalised career & university matches', 'Counsellor dashboards, workflows & reports']}
          stats={[{ end: 250000, suffix: '+', label: 'Courses' }, { end: 42, label: 'Countries' }, { end: 60, suffix: '+', label: 'Traits mapped' }]} />

        <ProductSection index={3} theme="tint" reverse={false} icon={Wallet} accent="#4F46E5"
          tag="For Parents" title="Biglyp Fee Collection" tagline="Fees upfront. EMIs for parents. Reconciled live." href="/fee-collection"
          visual={<FeeVisual />}
          desc="India's most advanced fee payment platform for schools, colleges and skilling institutes — 8+ payment rails, 0% EMIs for parents and live analytics, with schools paid 100% upfront."
          points={['8+ payment rails (UPI, cards, netbanking, NACH…)', '0% EMIs* for parents · 100% upfront to schools', 'Automated reconciliation & live dashboards', 'RBI-regulated NBFC lending partners']}
          stats={[{ end: 8, suffix: '+', label: 'Payment rails' }, { end: 0, suffix: '%', label: 'EMI interest' }, { end: 100, suffix: '%', label: 'Upfront to schools' }]}
          note="* 0% EMI subject to partnership." />
      </Box>

      <DarkCta />
      <Testimonials />
      <Faq />
      <HomeFooter />
      <DemoBar />
    </Box>
  );
}
