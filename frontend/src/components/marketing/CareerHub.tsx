'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import {
  MarketingNav, MarketingFooter,
  INDIGO, INDIGO_DEEP, INDIGO_TINT, NAVY, TEXT, SUBTLE,
} from "@/components/MarketingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight, Sparkle, Globe, GraduationCap, Search, MapPin,
  BadgeCheck, ShieldCheck, Users, School, Compass, Brain,
  Heart, Puzzle, Sparkles, ChevronRight, Star, Award,
  BookOpen, Trophy, Target, Rocket, LineChart, Filter,
  Play, PlayCircle, Check, Clock, Calendar, TrendingUp,
  FileCheck2, Radar, ChevronDown, Zap, Eye,
} from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1719559519182-698f9bfc4e2f?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200";

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

const STATS = [
  { icon: BookOpen, value: "2.5L+", label: "Courses indexed", color: INDIGO },
  { icon: Globe, value: "42", label: "Countries", color: "#F59E0B" },
  { icon: Users, value: "50 Lakh+", label: "Students guided", color: "#EC4899" },
  { icon: Award, value: "6,500+", label: "Partner schools", color: "#10B981" },
];

/* --------- Hero (Career Hub · editorial mosaic) ---------- */
function Hero() {
  return (
    <Box component="section" className="relative overflow-hidden" style={{ background: "#EFF6FF" }}>
      {/* Soft blue gradient tiles */}
      <Box className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(circle at 15% 20%, #BFDBFE66 0%, transparent 45%), radial-gradient(circle at 85% 80%, ${INDIGO}22 0%, transparent 45%)`,
      }} />

      <Box className="relative max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Overline row */}
        <Box className="flex flex-wrap items-center justify-between gap-3">
          <Box component="span" className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: NAVY }}>
            <GraduationCap className="h-3.5 w-3.5" style={{ color: INDIGO }} /> Biglyp Career Hub · Issue No. 01
          </Box>
          <Box className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: SUBTLE }}>
            <Box component="span" className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Discovery · Psychometrics · Applications
          </Box>
        </Box>

        {/* Big editorial headline — centered magazine cover style */}
        <motion.div initial="hidden" animate="show" variants={fade} className="mt-6 text-center max-w-5xl mx-auto">
          <motion.h1 custom={1} variants={fade}
            className="font-head text-[34px] md:text-[52px] lg:text-[64px] leading-[0.95] font-black tracking-tight"
            style={{ color: NAVY }}>
            Discover the{" "}
            <Box component="span" className="relative inline-block">
              <Box component="span" className="italic font-light" style={{ color: INDIGO }}>right</Box>
            </Box>{" "}
            <br className="hidden md:block" />
            career.{" "}
            <Box component="span" className="relative inline-block">
              <Box component="span" className="relative z-10">Then the</Box>
              <Box component="span" className="absolute inset-x-0 bottom-1 h-2.5" style={{ background: "#FBBF24", opacity: 0.75, zIndex: 0 }} />
            </Box>{" "}
            right{" "}
            <Box component="span" className="underline decoration-[5px] underline-offset-[8px]" style={{ textDecorationColor: INDIGO }}>university</Box>.
          </motion.h1>
          <motion.p custom={2} variants={fade}
            className="mt-4 max-w-2xl mx-auto text-[14px] md:text-[15px] leading-relaxed" style={{ color: SUBTLE }}>
            AI-driven 4-dimensional psychometrics paired with a live index of <b style={{ color: NAVY }}>2,50,000+ courses</b> across <b style={{ color: NAVY }}>42 countries</b> — built for counsellors, loved by students.
          </motion.p>
          <motion.div custom={3} variants={fade} className="mt-5 inline-flex items-center gap-3 flex-wrap justify-center">
            <Box component="a" href="#demo">
              <Button className="h-11 px-5 rounded-full font-bold text-white text-[13px] tracking-wide shadow-lg"
                style={{ background: NAVY }}>
                See it in action <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Box>
            <Box component="a" href="#pillars">
              <Button variant="outline" className="h-11 px-5 rounded-full font-bold text-[13px] border-2 bg-white"
                style={{ borderColor: NAVY, color: NAVY }}>
                Explore capabilities
              </Button>
            </Box>
          </motion.div>
        </motion.div>

        {/* Mosaic — 3 asymmetric editorial cards */}
        <Box className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          {/* Card 1: Psychometric radar (tall) */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
            className="md:col-span-5 md:row-span-2 rounded-3xl bg-white border border-slate-200 p-4 md:p-5 relative overflow-hidden"
            style={{ boxShadow: "0 30px 60px -35px rgba(15,26,91,0.35)" }}>
            <Box className="flex items-center justify-between">
              <Box component="span" className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
                <Brain className="h-3 w-3" /> Psychometrics
              </Box>
              <Box component="span" className="text-[10px] uppercase tracking-widest font-bold" style={{ color: SUBTLE }}>Live scan</Box>
            </Box>
            <Typography variant="inherit" component="h3" className="font-head mt-3 text-xl md:text-2xl font-black tracking-tight" style={{ color: NAVY }}>
              Ananya&apos;s profile
            </Typography>
            <Typography variant="inherit" component="p" className="text-[12px] mt-0.5" style={{ color: SUBTLE }}>Class 11 · Science stream</Typography>

            {/* Radar visual — simple polygon rings */}
            <Box className="mt-3 relative h-40 md:h-44 flex items-center justify-center">
              <svg viewBox="-110 -110 220 220" className="h-full">
                {[100, 75, 50, 25].map((r) => (
                  <polygon key={r}
                    points={[0,1,2,3,4].map((i) => {
                      const a = (Math.PI * 2 / 5) * i - Math.PI / 2;
                      return `${Math.cos(a) * r},${Math.sin(a) * r}`;
                    }).join(" ")}
                    fill="none" stroke="#E2E8F0" strokeWidth="1" />
                ))}
                <polygon
                  points={[85, 70, 92, 60, 78].map((r, i) => {
                    const a = (Math.PI * 2 / 5) * i - Math.PI / 2;
                    return `${Math.cos(a) * r},${Math.sin(a) * r}`;
                  }).join(" ")}
                  fill={INDIGO} fillOpacity="0.25" stroke={INDIGO} strokeWidth="2" />
                {[85, 70, 92, 60, 78].map((r, i) => {
                  const a = (Math.PI * 2 / 5) * i - Math.PI / 2;
                  return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r="3.5" fill={INDIGO} />;
                })}
              </svg>
              {["Aptitude","Interests","Personality","Values","Skills"].map((l, i) => {
                const a = (Math.PI * 2 / 5) * i - Math.PI / 2;
                const R = 96;
                const style = { left: `calc(50% + ${Math.cos(a) * R}px)`, top: `calc(50% + ${Math.sin(a) * R}px)` };
                return (
                  <Box component="span" key={l} className="absolute text-[10px] font-bold uppercase tracking-widest -translate-x-1/2 -translate-y-1/2"
                    style={{ ...style, color: NAVY }}>{l}</Box>
                );
              })}
            </Box>

            <Box className="mt-2 rounded-xl bg-slate-50 border border-slate-100 p-2.5">
              <Typography variant="inherit" component="p" className="text-[10.5px] uppercase tracking-widest font-bold" style={{ color: SUBTLE }}>Top recommendation</Typography>
              <Typography variant="inherit" component="p" className="font-head text-[14px] font-black tracking-tight mt-0.5" style={{ color: NAVY }}>
                Design &amp; Product Engineering
              </Typography>
              <Typography variant="inherit" component="p" className="text-[11px] mt-0.5" style={{ color: SUBTLE }}>92% fit · 14 matching programs</Typography>
            </Box>
          </motion.div>

          {/* Card 2: Course search */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }}
            className="md:col-span-7 rounded-3xl bg-white border border-slate-200 p-4 md:p-5 relative overflow-hidden">
            <Box className="flex items-center justify-between">
              <Box component="span" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                style={{ background: INDIGO }}>
                <Globe className="h-3 w-3" /> Course discovery
              </Box>
              <Box component="span" className="text-[10px] uppercase tracking-widest font-bold" style={{ color: SUBTLE }}>2.5L+ programs</Box>
            </Box>

            <Box className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5">
              <Search className="h-4 w-4 text-slate-400" />
              <Box component="span" className="text-[12.5px] text-slate-500">Computer Science · Canada · 2026 intake</Box>
            </Box>
            <Box className="mt-2 flex flex-wrap gap-1.5">
              {["🇨🇦 Canada", "IELTS 7.0", "≤ ₹25L tuition", "Sep 2026", "QS Top 200"].map((c) => (
                <Box component="span" key={c} className="rounded-full text-[10.5px] font-semibold px-2 py-0.5"
                  style={{ background: INDIGO_TINT, color: INDIGO }}>{c}</Box>
              ))}
            </Box>
            <Box className="mt-3 grid sm:grid-cols-3 gap-2">
              {[
                { n: "U of Toronto", p: "B.Sc. Computer Science", fee: "₹32L / yr", rank: "#21", flag: "🇨🇦" },
                { n: "UBC Vancouver", p: "B.Sc. Data Science", fee: "₹28L / yr", rank: "#38", flag: "🇨🇦" },
                { n: "McGill", p: "B.Eng. Software", fee: "₹24L / yr", rank: "#42", flag: "🇨🇦" },
              ].map((r) => (
                <Box key={r.n} className="rounded-xl border border-slate-100 p-2.5">
                  <Box className="flex items-center justify-between">
                    <Box className="h-7 w-7 rounded-lg flex items-center justify-center text-base"
                      style={{ background: INDIGO_TINT }}>{r.flag}</Box>
                    <Box component="span" className="text-[10px] font-bold" style={{ color: INDIGO }}>{r.rank}</Box>
                  </Box>
                  <Typography variant="inherit" component="p" className="mt-1.5 text-[12px] font-head font-black truncate" style={{ color: NAVY }}>{r.n}</Typography>
                  <Typography variant="inherit" component="p" className="text-[10.5px] text-slate-500 truncate">{r.p}</Typography>
                  <Typography variant="inherit" component="p" className="mt-0.5 text-[11px] font-bold" style={{ color: NAVY }}>{r.fee}</Typography>
                </Box>
              ))}
            </Box>
          </motion.div>

          {/* Card 3: Readiness meter */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.3 }}
            className="md:col-span-4 rounded-3xl p-4 md:p-5 relative overflow-hidden text-white"
            style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${INDIGO_DEEP} 100%)` }}>
            <Box component="span" className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
              <Radar className="h-3 w-3" /> Readiness Radar
            </Box>
            <Typography variant="inherit" component="p" className="mt-3 font-head text-[36px] leading-none font-black tracking-tight">72<Box component="span" className="text-base align-top ml-0.5 opacity-80">/100</Box></Typography>
            <Typography variant="inherit" component="p" className="text-[11.5px] text-white/80 mt-0.5">Application readiness score</Typography>
            <Box className="mt-3 space-y-1.5">
              {[
                { k: "Grades", v: 88 },
                { k: "SoP", v: 60 },
                { k: "LORs", v: 55 },
              ].map((r) => (
                <Box key={r.k}>
                  <Box className="flex items-center justify-between text-[11px] font-semibold">
                    <Box component="span" className="text-white/85">{r.k}</Box><Box component="span">{r.v}%</Box>
                  </Box>
                  <Box className="mt-1 h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <Box className="h-full bg-white" style={{ width: `${r.v}%` }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </motion.div>

          {/* Card 4: Counsellor summary */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.4 }}
            className="md:col-span-3 rounded-3xl bg-white border border-slate-200 p-4 relative overflow-hidden">
            <Box component="span" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3" /> Counsellor
            </Box>
            <Typography variant="inherit" component="p" className="mt-2 font-head text-lg font-black tracking-tight" style={{ color: NAVY }}>28 students</Typography>
            <Typography variant="inherit" component="p" className="text-[11.5px]" style={{ color: SUBTLE }}>on track this quarter</Typography>
            <Box className="mt-2.5 flex -space-x-2">
              {["#F59E0B", "#EC4899", "#10B981", "#38BDF8", "#5548D1"].map((c) => (
                <Box component="span" key={c} className="h-7 w-7 rounded-full border-2 border-white" style={{ background: c }} />
              ))}
              <Box component="span" className="h-7 w-7 rounded-full bg-slate-100 border-2 border-white text-[10px] font-bold flex items-center justify-center" style={{ color: NAVY }}>+23</Box>
            </Box>
          </motion.div>
        </Box>
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
                <Box className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.color + "1A", color: s.color }}>
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

/* --------- Pillar 1: AI Psychometric Assessments ---------- */
function PillarPsychometrics() {
  const dims = [
    { icon: Target, l: "Aptitude", v: 82, c: INDIGO, d: "Logical, verbal & spatial reasoning" },
    { icon: Heart, l: "Interest Traits", v: 74, c: "#F59E0B", d: "What motivates & engages the student" },
    { icon: Sparkles, l: "Emotional Intelligence", v: 91, c: "#10B981", d: "Self-awareness, empathy & resilience" },
    { icon: Puzzle, l: "Personality Style", v: 68, c: "#EC4899", d: "Working, learning & leadership traits" },
  ];
  return (
    <Box component="section" id="pillars" className="py-20 bg-gradient-to-b from-white to-[color:var(--tint)]" style={{ ["--tint"]: INDIGO_TINT }}>
      <Box className="max-w-7xl mx-auto px-6">
        <Box className="text-center max-w-3xl mx-auto">
          <Box component="span" className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Brain className="h-3.5 w-3.5" /> Pillar 01
          </Box>
          <Typography variant="inherit" component="h2" className="font-head mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            AI-powered psychometric assessments
          </Typography>
          <Typography variant="inherit" component="p" className="mt-5 text-[15px] md:text-base" style={{ color: SUBTLE }}>
            Multi-dimensional evaluation that goes beyond marks — assessing aptitude,
            interest traits, emotional intelligence and personality style in under 45 minutes.
          </Typography>
        </Box>

        <Box className="mt-14 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-stretch">
          {/* Left — 4 dimension cards */}
          <Box className="grid sm:grid-cols-2 gap-4">
            {dims.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={d.l}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
                  <Box className="flex items-center gap-3">
                    <Box className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: d.c + "1A", color: d.c }}>
                      <Icon className="h-5 w-5" />
                    </Box>
                    <Typography variant="inherit" component="p" className="font-head font-black text-[15px]" style={{ color: NAVY }}>{d.l}</Typography>
                    <Box component="span" className="ml-auto font-head font-black text-lg" style={{ color: d.c }}>{d.v}%</Box>
                  </Box>
                  <Box className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} whileInView={{ width: `${d.v}%` }} viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.1 + i * 0.08 }}
                      className="h-full rounded-full" style={{ background: d.c }} />
                  </Box>
                  <Typography variant="inherit" component="p" className="text-[12px] mt-3" style={{ color: SUBTLE }}>{d.d}</Typography>
                </motion.div>
              );
            })}
          </Box>

          {/* Right — sample report */}
          <Box className="rounded-3xl p-6 text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${INDIGO} 0%, ${INDIGO_DEEP} 100%)` }}>
            <Box className="absolute -right-10 -top-10 h-40 w-40 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
            <Box className="relative">
              <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-white/80">Auto-generated report</Typography>
              <Typography variant="inherit" component="h3" className="font-head font-black text-xl mt-1">Aarav&apos;s career report</Typography>
              <Typography variant="inherit" component="p" className="text-[12px] text-white/70 mt-1">Class 10 · Horizon International · 24 Sep 2025</Typography>

              <Box className="mt-5 rounded-2xl bg-white/95 p-4 text-slate-800">
                <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Recommended streams</Typography>
                <Box className="mt-2 flex flex-wrap gap-1.5">
                  {["🧪 Science (PCM)", "💻 Computer Science", "📊 Data Analytics"].map((s) => (
                    <Box component="span" key={s} className="rounded-full bg-brand-tint text-[11.5px] font-semibold px-2.5 py-1" style={{ color: INDIGO }}>{s}</Box>
                  ))}
                </Box>
                <Box className="mt-4 rounded-lg border border-slate-100 p-3">
                  <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Top matched career</Typography>
                  <Typography variant="inherit" component="p" className="font-head font-black text-[15px] mt-1" style={{ color: NAVY }}>Software Engineer / ML Scientist</Typography>
                  <Box className="mt-2 flex items-center gap-2">
                    <Box className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <Box className="h-full rounded-full" style={{ width: "89%", background: INDIGO }} />
                    </Box>
                    <Box component="span" className="text-[11px] font-bold" style={{ color: INDIGO }}>89%</Box>
                  </Box>
                </Box>
                <Box component="button" className="mt-4 w-full h-9 rounded-full text-white font-semibold text-[13px] flex items-center justify-center gap-2" style={{ background: INDIGO }}>
                  Download PDF report <FileCheck2 className="h-4 w-4" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Pillar 2: Global Career Navigator ---------- */
function PillarNavigator() {
  return (
    <Box component="section" className="py-20 bg-white">
      <Box className="max-w-7xl mx-auto px-6">
        <Box className="text-center max-w-3xl mx-auto">
          <Box component="span" className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Globe className="h-3.5 w-3.5" /> Pillar 02
          </Box>
          <Typography variant="inherit" component="h2" className="font-head mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            The global career navigator
          </Typography>
          <Typography variant="inherit" component="p" className="mt-5 text-[15px] md:text-base" style={{ color: SUBTLE }}>
            Real-time search across <b>2,50,000+</b> undergraduate and postgraduate programs spanning
            <b> 42 countries</b> — with the filters students and parents actually care about.
          </Typography>
        </Box>

        {/* Filter row + result grid mock */}
        <Box className="mt-14 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 md:p-8">
          <Box className="flex flex-wrap items-center gap-2 mb-5">
            <Filter className="h-4 w-4" style={{ color: INDIGO }} />
            <Box component="span" className="text-[11.5px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>Dynamic filters</Box>
            {["Tuition fee", "Deadline", "Eligibility", "SAT / IELTS", "NEET / JEE", "QS ranking", "Scholarships"].map((f) => (
              <Box component="span" key={f} className="rounded-full bg-white border border-slate-200 text-[11.5px] font-semibold px-2.5 py-1" style={{ color: NAVY }}>
                {f}
              </Box>
            ))}
          </Box>

          <Box className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { c: "🇺🇸", n: "Stanford University", p: "MS Computer Science", fee: "₹58L/yr", rank: "#3", ex: "SAT 1550, TOEFL 108" },
              { c: "🇬🇧", n: "University of Oxford", p: "BA PPE", fee: "₹42L/yr", rank: "#4", ex: "A-Level A*A*A, IELTS 7.5" },
              { c: "🇨🇦", n: "University of Toronto", p: "B.Eng. Software", fee: "₹32L/yr", rank: "#21", ex: "IB 38, IELTS 6.5" },
              { c: "🇦🇺", n: "Melbourne University", p: "B.Sc. Data Science", fee: "₹28L/yr", rank: "#14", ex: "ATAR 95, IELTS 7.0" },
              { c: "🇩🇪", n: "TU Munich", p: "MS Robotics", fee: "₹6L/yr", rank: "#37", ex: "GRE 325, IELTS 7.0" },
              { c: "🇸🇬", n: "NUS Singapore", p: "B.Eng. CE", fee: "₹18L/yr", rank: "#8", ex: "SAT 1450, IELTS 7.0" },
            ].map((r) => (
              <Box key={r.n} className="rounded-2xl bg-white border border-slate-100 p-4 hover:shadow-md transition-shadow">
                <Box className="flex items-center gap-2">
                  <Box component="span" className="text-xl">{r.c}</Box>
                  <Typography variant="inherit" component="p" className="font-head font-bold text-[14px] truncate" style={{ color: NAVY }}>{r.n}</Typography>
                  <Box component="span" className="ml-auto text-[10.5px] font-bold rounded-full px-2 py-0.5" style={{ background: INDIGO_TINT, color: INDIGO }}>QS {r.rank}</Box>
                </Box>
                <Typography variant="inherit" component="p" className="text-[12px] mt-2" style={{ color: SUBTLE }}>{r.p}</Typography>
                <Box className="mt-3 flex items-center justify-between">
                  <Box component="span" className="text-[11.5px] font-bold" style={{ color: NAVY }}>{r.fee}</Box>
                  <Box component="span" className="text-[10.5px]" style={{ color: SUBTLE }}>{r.ex}</Box>
                </Box>
              </Box>
            ))}
          </Box>

          <Box className="mt-6 text-center">
            <Box component="span" className="text-[12px]" style={{ color: SUBTLE }}>
              + <b style={{ color: INDIGO }}>249,994</b> more programs match student profiles across 42 countries
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Counsellor Co-Pilot ---------- */
function CounsellorCoPilot() {
  return (
    <Box component="section" className="py-20" style={{ background: INDIGO_TINT }}>
      <Box className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
        <Box>
          <Box component="span" className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Users className="h-3.5 w-3.5" /> For your counsellors
          </Box>
          <Typography variant="inherit" component="h2" className="font-head mt-5 text-3xl md:text-4xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            School Counsellor Co-Pilot Dashboard
          </Typography>
          <Typography variant="inherit" component="p" className="mt-4 text-[15px] leading-relaxed" style={{ color: SUBTLE }}>
            A dedicated portal for your in-house counsellors to schedule 1:1 sessions,
            track student discovery progress, and export school-wide career analytics.
          </Typography>
          <Box component="ul" className="mt-5 space-y-2.5">
            {[
              "Session scheduler with auto reminders",
              "Bulk assessment triggers by grade or section",
              "Progress tracking per student",
              "One-click school-wide analytics export",
            ].map((t) => (
              <Box component="li" key={t} className="flex items-start gap-2 text-[13.5px]" style={{ color: TEXT }}>
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: INDIGO }} /> {t}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Dashboard mockup */}
        <Box className="rounded-3xl bg-white border border-white shadow-xl p-5">
          <Box className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Box className="h-2 w-2 rounded-full bg-red-400" />
            <Box className="h-2 w-2 rounded-full bg-amber-400" />
            <Box className="h-2 w-2 rounded-full bg-emerald-400" />
            <Box component="span" className="ml-2 font-semibold">Counsellor Co-Pilot · Green Valley Academy</Box>
          </Box>
          {/* KPIs */}
          <Box className="mt-4 grid grid-cols-3 gap-2">
            {[
              { l: "Active students", v: "412", c: INDIGO },
              { l: "Sessions this week", v: "38", c: "#F59E0B" },
              { l: "Reports generated", v: "182", c: "#10B981" },
            ].map((k) => (
              <Box key={k.l} className="rounded-xl border border-slate-100 p-3">
                <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{k.l}</Typography>
                <Typography variant="inherit" component="p" className="font-head font-black text-xl mt-0.5" style={{ color: k.c }}>{k.v}</Typography>
              </Box>
            ))}
          </Box>
          {/* Queue */}
          <Box className="mt-4 rounded-xl border border-slate-100 p-3">
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="inherit" component="p" className="text-[11px] font-bold" style={{ color: NAVY }}>Today&apos;s session queue</Typography>
              <Box component="span" className="text-[10px] text-slate-400">3 upcoming</Box>
            </Box>
            {[
              { t: "10:30 AM", n: "Aarav Sharma · Class 10", tag: "1:1 · Career discovery", c: INDIGO },
              { t: "11:15 AM", n: "Sara Sharma · Class 9", tag: "Report walkthrough", c: "#F59E0B" },
              { t: "02:00 PM", n: "Kabir Nair · Class 12", tag: "University shortlist", c: "#10B981" },
            ].map((r) => (
              <Box key={r.n} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <Box className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: r.c + "1A", color: r.c }}>
                  <Calendar className="h-4 w-4" />
                </Box>
                <Box className="min-w-0 flex-1">
                  <Typography variant="inherit" component="p" className="text-[12.5px] font-bold truncate" style={{ color: NAVY }}>{r.n}</Typography>
                  <Typography variant="inherit" component="p" className="text-[11px] truncate" style={{ color: SUBTLE }}>{r.tag}</Typography>
                </Box>
                <Box component="span" className="text-[11px] font-bold" style={{ color: NAVY }}>{r.t}</Box>
              </Box>
            ))}
          </Box>
          <Box component="button" className="mt-4 w-full h-10 rounded-full text-white font-semibold text-[13px]" style={{ background: INDIGO }}>
            Export school-wide analytics
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Parent Transparency Hub ---------- */
function ParentTransparency() {
  return (
    <Box component="section" className="py-20 bg-white">
      <Box className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left mock */}
        <Box className="rounded-3xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 p-6 order-2 lg:order-1">
          <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-amber-700">Parent view · Rajeev Sharma</Typography>
          <Typography variant="inherit" component="h4" className="font-head font-black text-lg mt-1" style={{ color: NAVY }}>Aarav&apos;s career journey</Typography>

          <Box className="mt-4 rounded-2xl bg-white p-4 border border-slate-100">
            <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Top career match</Typography>
            <Typography variant="inherit" component="p" className="font-head font-black text-[15px] mt-1" style={{ color: NAVY }}>Software Engineer</Typography>
            <Box className="mt-2 flex items-center gap-2">
              <Box className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <Box className="h-full rounded-full" style={{ width: "89%", background: INDIGO }} />
              </Box>
              <Box component="span" className="text-[11px] font-bold" style={{ color: INDIGO }}>89%</Box>
            </Box>
          </Box>

          <Box className="mt-3 rounded-2xl bg-white p-4 border border-slate-100">
            <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Estimated 4-yr investment</Typography>
            <Box className="mt-2 grid grid-cols-3 gap-2">
              <Box>
                <Typography variant="inherit" component="p" className="text-[10px] text-slate-400">India</Typography>
                <Typography variant="inherit" component="p" className="font-head font-bold text-[13px]" style={{ color: NAVY }}>₹18L</Typography>
              </Box>
              <Box>
                <Typography variant="inherit" component="p" className="text-[10px] text-slate-400">Canada</Typography>
                <Typography variant="inherit" component="p" className="font-head font-bold text-[13px]" style={{ color: NAVY }}>₹1.3Cr</Typography>
              </Box>
              <Box>
                <Typography variant="inherit" component="p" className="text-[10px] text-slate-400">USA</Typography>
                <Typography variant="inherit" component="p" className="font-head font-bold text-[13px]" style={{ color: NAVY }}>₹2.1Cr</Typography>
              </Box>
            </Box>
            <Box className="mt-3 rounded-lg bg-emerald-50 border border-emerald-100 p-2 text-center">
              <Typography variant="inherit" component="p" className="text-[11px] font-bold text-emerald-700">Financing plan available · 0% EMI up to ₹15L</Typography>
            </Box>
          </Box>
        </Box>

        {/* Right copy */}
        <Box className="order-1 lg:order-2">
          <Box component="span" className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Eye className="h-3.5 w-3.5" /> Parent Transparency Hub
          </Box>
          <Typography variant="inherit" component="h2" className="font-head mt-5 text-3xl md:text-4xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            Bring parents into the conversation.
          </Typography>
          <Typography variant="inherit" component="p" className="mt-4 text-[15px] leading-relaxed" style={{ color: SUBTLE }}>
            A co-viewing portal that helps parents understand their child&apos;s psychometric results and
            financial estimates for higher education — dramatically reducing home conflict around career choices.
          </Typography>
          <Box component="ul" className="mt-5 space-y-2.5">
            {[
              "Shared psychometric report walkthrough",
              "Real cost estimates for each university & country",
              "Live 0% EMI eligibility right inside the report",
              "One-click session request with the school counsellor",
            ].map((t) => (
              <Box component="li" key={t} className="flex items-start gap-2 text-[13.5px]" style={{ color: TEXT }}>
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: INDIGO }} /> {t}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Career Readiness & Skill Gap Radar ---------- */
function ReadinessRadar() {
  // simple 6-axis radar SVG
  const axes = [
    { label: "Academics", v: 0.9 },
    { label: "Test prep", v: 0.65 },
    { label: "Extra-curriculars", v: 0.55 },
    { label: "Portfolio", v: 0.72 },
    { label: "Recos", v: 0.4 },
    { label: "Essays", v: 0.6 },
  ];
  const cx = 130, cy = 130, R = 100;
  const points = axes.map((a, i) => {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    return [cx + Math.cos(angle) * R * a.v, cy + Math.sin(angle) * R * a.v];
  });
  const polyPath = points.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <Box component="section" className="py-20" style={{ background: INDIGO_TINT }}>
      <Box className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
        <Box>
          <Box component="span" className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Radar className="h-3.5 w-3.5" /> Career Readiness Radar
          </Box>
          <Typography variant="inherit" component="h2" className="font-head mt-5 text-3xl md:text-4xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            Personalized roadmap<br />to their dream program.
          </Typography>
          <Typography variant="inherit" component="p" className="mt-4 text-[15px] leading-relaxed" style={{ color: SUBTLE }}>
            The Skill Gap Radar maps the specific high-school electives, competitive exams and extracurriculars
            each student needs to qualify for the university programs they&apos;re aiming for.
          </Typography>
          <Box component="ul" className="mt-5 space-y-2.5">
            {[
              "Electives to opt in Class 11 & 12",
              "Right competitive exams (SAT/IELTS/JEE/NEET)",
              "Recommended internships & clubs",
              "Timeline milestones — Grade 9 to Grade 12",
            ].map((t) => (
              <Box component="li" key={t} className="flex items-start gap-2 text-[13.5px]" style={{ color: TEXT }}>
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: INDIGO }} /> {t}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Radar mock */}
        <Box className="rounded-3xl bg-white border border-white shadow-xl p-6 flex flex-col items-center">
          <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold self-start" style={{ color: INDIGO }}>Live readiness score</Typography>
          <svg viewBox="0 0 260 260" width="260" height="260" className="mt-2">
            {/* rings */}
            {[0.25, 0.5, 0.75, 1].map((r, i) => (
              <polygon key={i}
                points={axes.map((_, j) => {
                  const angle = (Math.PI * 2 * j) / axes.length - Math.PI / 2;
                  return `${cx + Math.cos(angle) * R * r},${cy + Math.sin(angle) * R * r}`;
                }).join(" ")}
                fill="none" stroke="#E5E7EB" strokeWidth="1" />
            ))}
            {/* spokes */}
            {axes.map((_, i) => {
              const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
              return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(angle) * R} y2={cy + Math.sin(angle) * R} stroke="#E5E7EB" strokeWidth="1" />;
            })}
            {/* data polygon */}
            <polygon points={polyPath} fill={INDIGO} fillOpacity="0.2" stroke={INDIGO} strokeWidth="2.5" />
            {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill={INDIGO} />)}
            {/* labels */}
            {axes.map((a, i) => {
              const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
              const lx = cx + Math.cos(angle) * (R + 22);
              const ly = cy + Math.sin(angle) * (R + 18);
              return (
                <text key={i} x={lx} y={ly} textAnchor="middle" fontSize="11" fontWeight="700" fill={NAVY}>{a.label}</text>
              );
            })}
          </svg>
          <Box className="mt-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5">
            <Typography variant="inherit" component="p" className="text-[12px] font-bold text-emerald-700">63% ready · 8-month roadmap generated</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Student Profile Builder ---------- */
function ProfileBuilder() {
  return (
    <Box component="section" className="py-20 bg-white">
      <Box className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
        <Box>
          <Box component="span" className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Trophy className="h-3.5 w-3.5" /> Student Profile Builder
          </Box>
          <Typography variant="inherit" component="h2" className="font-head mt-5 text-3xl md:text-4xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            A living portfolio<br />ready for every application.
          </Typography>
          <Typography variant="inherit" component="p" className="mt-4 text-[15px] leading-relaxed" style={{ color: SUBTLE }}>
            A digital portfolio manager for students to log achievements, certificates, projects,
            volunteering and internships — auto-formatted for every upcoming university application.
          </Typography>
          <Box component="ul" className="mt-5 space-y-2.5">
            {[
              "Verified school-issued achievements",
              "Certificate & badge uploads with OCR extraction",
              "One-click Common App / UCAS / SAOP export",
              "Sharable public profile URL for applications",
            ].map((t) => (
              <Box component="li" key={t} className="flex items-start gap-2 text-[13.5px]" style={{ color: TEXT }}>
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: INDIGO }} /> {t}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Profile card mock */}
        <Box className="rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-6 shadow-sm">
          <Box className="flex items-center gap-3">
            <Box className="h-14 w-14 rounded-2xl bg-brand-blue text-white font-head font-black flex items-center justify-center text-xl">AS</Box>
            <Box>
              <Typography variant="inherit" component="p" className="font-head font-black text-lg" style={{ color: NAVY }}>Aarav Sharma</Typography>
              <Typography variant="inherit" component="p" className="text-[12px]" style={{ color: SUBTLE }}>Class 10 · Horizon International · Bangalore</Typography>
            </Box>
            <Box component="span" className="ml-auto rounded-full bg-emerald-50 border border-emerald-100 px-2 py-1 text-[10.5px] font-bold text-emerald-700 flex items-center gap-1">
              <BadgeCheck className="h-3 w-3" /> Verified
            </Box>
          </Box>
          <Box className="mt-4 grid grid-cols-3 gap-2">
            <Box className="rounded-lg border border-slate-100 bg-white p-2.5 text-center">
              <Typography variant="inherit" component="p" className="font-head font-black text-lg" style={{ color: INDIGO }}>14</Typography>
              <Typography variant="inherit" component="p" className="text-[10px]" style={{ color: SUBTLE }}>Certificates</Typography>
            </Box>
            <Box className="rounded-lg border border-slate-100 bg-white p-2.5 text-center">
              <Typography variant="inherit" component="p" className="font-head font-black text-lg" style={{ color: "#F59E0B" }}>6</Typography>
              <Typography variant="inherit" component="p" className="text-[10px]" style={{ color: SUBTLE }}>Projects</Typography>
            </Box>
            <Box className="rounded-lg border border-slate-100 bg-white p-2.5 text-center">
              <Typography variant="inherit" component="p" className="font-head font-black text-lg" style={{ color: "#10B981" }}>3</Typography>
              <Typography variant="inherit" component="p" className="text-[10px]" style={{ color: SUBTLE }}>Internships</Typography>
            </Box>
          </Box>
          <Box className="mt-4 space-y-2">
            {[
              { t: "Google Kickstart 2025 · Top 12%", c: INDIGO, ic: Award },
              { t: "AI ML for Everyone · Coursera", c: "#F59E0B", ic: BookOpen },
              { t: "TeachIndia Foundation · 40 hrs", c: "#10B981", ic: Heart },
            ].map((r) => {
              const Icon = r.ic;
              return (
                <Box key={r.t} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-2.5">
                  <Box className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: r.c + "1A", color: r.c }}>
                    <Icon className="h-4 w-4" />
                  </Box>
                  <Box component="span" className="text-[13px] font-semibold flex-1 truncate" style={{ color: NAVY }}>{r.t}</Box>
                  <BadgeCheck className="h-4 w-4" style={{ color: r.c }} />
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
          <Box className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20" style={{ background: "#FBBF24" }} />
          <Box className="absolute -left-12 -bottom-14 h-48 w-48 rounded-full opacity-10 bg-white" />
          <Box className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <Box>
              <Box component="span" className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold rounded-full px-3 py-1 bg-white/15 border border-white/20">
                <Rocket className="h-3.5 w-3.5" /> Go live with Career Hub
              </Box>
              <Typography variant="inherit" component="h2" className="font-head mt-4 text-3xl md:text-4xl font-black leading-tight">
                Add scientific career guidance to your school in 24 hours.
              </Typography>
              <Typography variant="inherit" component="p" className="mt-3 text-white/85 text-sm md:text-base">
                Empower your counsellors, engage parents and unlock global opportunities for your students.
              </Typography>
              <Box className="mt-6 flex flex-wrap gap-3">
                <Button className="h-11 px-6 rounded-full font-semibold text-sm" style={{ background: "#FBBF24", color: NAVY }}>
                  Schedule a demo <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" className="h-11 px-6 rounded-full font-semibold text-sm border-white/50 bg-transparent text-white hover:bg-white/10">
                  <PlayCircle className="h-4 w-4 mr-2" /> Watch 90-sec tour
                </Button>
              </Box>
            </Box>
            <Box className="rounded-2xl bg-white/95 p-5 text-slate-800 shadow-2xl">
              <Box className="flex items-center justify-between">
                <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Report ready</Typography>
                <Box component="span" className="text-[10px]" style={{ color: INDIGO }}>2 min ago</Box>
              </Box>
              <Typography variant="inherit" component="p" className="mt-2 font-head font-black text-lg" style={{ color: NAVY }}>Aarav → Software Engineer · 89% match</Typography>
              <Box className="mt-3 flex items-center gap-2">
                <Box className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <Box className="h-full rounded-full" style={{ width: "89%", background: INDIGO }} />
                </Box>
                <Box component="span" className="text-[11px] font-bold" style={{ color: INDIGO }}>89%</Box>
              </Box>
              <Box className="mt-4 grid grid-cols-2 gap-2">
                <Box component="span" className="rounded-full bg-brand-tint text-[10.5px] font-semibold px-2.5 py-1 text-center" style={{ color: INDIGO }}>3 stream matches</Box>
                <Box component="span" className="rounded-full bg-brand-tint text-[10.5px] font-semibold px-2.5 py-1 text-center" style={{ color: INDIGO }}>184 program matches</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Page shell ---------- */
export default function CareerHub() {
  return (
    <Box className="min-h-screen bg-white text-slate-800 font-sans">
      <MarketingNav />
      <Hero />
      <StatStrip />
      <PillarPsychometrics />
      <PillarNavigator />
      <CounsellorCoPilot />
      <ParentTransparency />
      <ReadinessRadar />
      <ProfileBuilder />
      <FinalCTA />
      <MarketingFooter />
    </Box>
  );
}
