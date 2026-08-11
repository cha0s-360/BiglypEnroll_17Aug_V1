import { useState } from "react";
import { Link } from "react-router-dom";
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
    <section className="relative overflow-hidden" style={{ background: "#FFF7ED" }}>
      {/* Soft warm gradient tiles */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(circle at 15% 20%, #FDE68A55 0%, transparent 45%), radial-gradient(circle at 85% 80%, ${INDIGO}22 0%, transparent 45%)`,
      }} />

      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-24">
        {/* Overline row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: NAVY }}>
            <GraduationCap className="h-3.5 w-3.5" style={{ color: INDIGO }} /> Biglyp Career Hub · Issue No. 01
          </span>
          <div className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: SUBTLE }}>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Discovery · Psychometrics · Applications
          </div>
        </div>

        {/* Big editorial headline — centered magazine cover style */}
        <motion.div initial="hidden" animate="show" variants={fade} className="mt-10 text-center max-w-5xl mx-auto">
          <motion.h1 custom={1} variants={fade}
            className="font-head text-[44px] md:text-[70px] lg:text-[96px] leading-[0.92] font-black tracking-tight"
            style={{ color: NAVY }}>
            Discover the{" "}
            <span className="relative inline-block">
              <span className="italic font-light" style={{ color: INDIGO }}>right</span>
            </span>{" "}
            <br className="hidden md:block" />
            career.{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Then the</span>
              <span className="absolute inset-x-0 bottom-2 h-3" style={{ background: "#FBBF24", opacity: 0.75, zIndex: 0 }} />
            </span>{" "}
            right{" "}
            <span className="underline decoration-[6px] underline-offset-[10px]" style={{ textDecorationColor: INDIGO }}>university</span>.
          </motion.h1>
          <motion.p custom={2} variants={fade}
            className="mt-6 max-w-2xl mx-auto text-[16px] md:text-[17px] leading-relaxed" style={{ color: SUBTLE }}>
            AI-driven 4-dimensional psychometrics paired with a live index of <b style={{ color: NAVY }}>2,50,000+ courses</b> across <b style={{ color: NAVY }}>42 countries</b> — built for counsellors, loved by students.
          </motion.p>
          <motion.div custom={3} variants={fade} className="mt-8 inline-flex items-center gap-3 flex-wrap justify-center">
            <a href="#demo">
              <Button className="h-12 px-6 rounded-full font-bold text-white text-[13px] tracking-wide shadow-lg"
                style={{ background: NAVY }}>
                See it in action <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </a>
            <a href="#pillars">
              <Button variant="outline" className="h-12 px-6 rounded-full font-bold text-[13px] border-2 bg-white"
                style={{ borderColor: NAVY, color: NAVY }}>
                Explore capabilities
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Mosaic — 3 asymmetric editorial cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {/* Card 1: Psychometric radar (tall) */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
            className="md:col-span-5 md:row-span-2 rounded-3xl bg-white border border-slate-200 p-6 relative overflow-hidden"
            style={{ boxShadow: "0 30px 60px -35px rgba(15,26,91,0.35)" }}>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
                <Brain className="h-3 w-3" /> Psychometrics
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: SUBTLE }}>Live scan</span>
            </div>
            <h3 className="font-head mt-4 text-2xl font-black tracking-tight" style={{ color: NAVY }}>
              Ananya&apos;s profile
            </h3>
            <p className="text-[12px] mt-1" style={{ color: SUBTLE }}>Class 11 · Science stream</p>

            {/* Radar visual — simple polygon rings */}
            <div className="mt-5 relative h-56 flex items-center justify-center">
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
                const R = 118;
                const style = { left: `calc(50% + ${Math.cos(a) * R}px)`, top: `calc(50% + ${Math.sin(a) * R}px)` };
                return (
                  <span key={l} className="absolute text-[10px] font-bold uppercase tracking-widest -translate-x-1/2 -translate-y-1/2"
                    style={{ ...style, color: NAVY }}>{l}</span>
                );
              })}
            </div>

            <div className="mt-2 rounded-xl bg-slate-50 border border-slate-100 p-3">
              <p className="text-[11px] uppercase tracking-widest font-bold" style={{ color: SUBTLE }}>Top recommendation</p>
              <p className="font-head text-[15px] font-black tracking-tight mt-0.5" style={{ color: NAVY }}>
                Design &amp; Product Engineering
              </p>
              <p className="text-[11.5px] mt-0.5" style={{ color: SUBTLE }}>92% fit · 14 matching programs</p>
            </div>
          </motion.div>

          {/* Card 2: Course search */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }}
            className="md:col-span-7 rounded-3xl bg-white border border-slate-200 p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                style={{ background: INDIGO }}>
                <Globe className="h-3 w-3" /> Course discovery
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: SUBTLE }}>2.5L+ programs</span>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <span className="text-[13px] text-slate-500">Computer Science · Canada · 2026 intake</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["🇨🇦 Canada", "IELTS 7.0", "≤ ₹25L tuition", "Sep 2026", "QS Top 200"].map((c) => (
                <span key={c} className="rounded-full text-[10.5px] font-semibold px-2 py-1"
                  style={{ background: INDIGO_TINT, color: INDIGO }}>{c}</span>
              ))}
            </div>
            <div className="mt-4 grid sm:grid-cols-3 gap-2">
              {[
                { n: "U of Toronto", p: "B.Sc. Computer Science", fee: "₹32L / yr", rank: "#21", flag: "🇨🇦" },
                { n: "UBC Vancouver", p: "B.Sc. Data Science", fee: "₹28L / yr", rank: "#38", flag: "🇨🇦" },
                { n: "McGill", p: "B.Eng. Software", fee: "₹24L / yr", rank: "#42", flag: "🇨🇦" },
              ].map((r) => (
                <div key={r.n} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ background: INDIGO_TINT }}>{r.flag}</div>
                    <span className="text-[10px] font-bold" style={{ color: INDIGO }}>{r.rank}</span>
                  </div>
                  <p className="mt-2 text-[12px] font-head font-black truncate" style={{ color: NAVY }}>{r.n}</p>
                  <p className="text-[10.5px] text-slate-500 truncate">{r.p}</p>
                  <p className="mt-1 text-[11px] font-bold" style={{ color: NAVY }}>{r.fee}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 3: Readiness meter */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.3 }}
            className="md:col-span-4 rounded-3xl p-6 relative overflow-hidden text-white"
            style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${INDIGO_DEEP} 100%)` }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
              <Radar className="h-3 w-3" /> Readiness Radar
            </span>
            <p className="mt-4 font-head text-[42px] leading-none font-black tracking-tight">72<span className="text-lg align-top">/100</span></p>
            <p className="text-[12px] text-white/80 mt-1">Application readiness score</p>
            <div className="mt-4 space-y-2">
              {[
                { k: "Grades", v: 88 },
                { k: "SoP", v: 60 },
                { k: "LORs", v: 55 },
              ].map((r) => (
                <div key={r.k}>
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-white/85">{r.k}</span><span>{r.v}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <div className="h-full bg-white" style={{ width: `${r.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 4: Counsellor summary */}
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.4 }}
            className="md:col-span-3 rounded-3xl bg-white border border-slate-200 p-5 relative overflow-hidden">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3" /> Counsellor
            </span>
            <p className="mt-3 font-head text-lg font-black tracking-tight" style={{ color: NAVY }}>28 students</p>
            <p className="text-[11.5px]" style={{ color: SUBTLE }}>on track this quarter</p>
            <div className="mt-3 flex -space-x-2">
              {["#F59E0B", "#EC4899", "#10B981", "#38BDF8", "#5548D1"].map((c) => (
                <span key={c} className="h-7 w-7 rounded-full border-2 border-white" style={{ background: c }} />
              ))}
              <span className="h-7 w-7 rounded-full bg-slate-100 border-2 border-white text-[10px] font-bold flex items-center justify-center" style={{ color: NAVY }}>+23</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* --------- Stats strip ---------- */
function StatStrip() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-14">
        <div className="rounded-2xl bg-white border border-slate-100 shadow-[0_20px_50px_-30px_rgba(15,26,91,0.35)] px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.color + "1A", color: s.color }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-head text-xl font-black" style={{ color: NAVY }}>{s.value}</p>
                  <p className="text-[11px] font-medium" style={{ color: SUBTLE }}>{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
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
    <section id="pillars" className="py-20 bg-gradient-to-b from-white to-[color:var(--tint)]" style={{ ["--tint"]: INDIGO_TINT }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Brain className="h-3.5 w-3.5" /> Pillar 01
          </span>
          <h2 className="font-head mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            AI-powered psychometric assessments
          </h2>
          <p className="mt-5 text-[15px] md:text-base" style={{ color: SUBTLE }}>
            Multi-dimensional evaluation that goes beyond marks — assessing aptitude,
            interest traits, emotional intelligence and personality style in under 45 minutes.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-stretch">
          {/* Left — 4 dimension cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {dims.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={d.l}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: d.c + "1A", color: d.c }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-head font-black text-[15px]" style={{ color: NAVY }}>{d.l}</p>
                    <span className="ml-auto font-head font-black text-lg" style={{ color: d.c }}>{d.v}%</span>
                  </div>
                  <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} whileInView={{ width: `${d.v}%` }} viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.1 + i * 0.08 }}
                      className="h-full rounded-full" style={{ background: d.c }} />
                  </div>
                  <p className="text-[12px] mt-3" style={{ color: SUBTLE }}>{d.d}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Right — sample report */}
          <div className="rounded-3xl p-6 text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${INDIGO} 0%, ${INDIGO_DEEP} 100%)` }}>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/80">Auto-generated report</p>
              <h3 className="font-head font-black text-xl mt-1">Aarav&apos;s career report</h3>
              <p className="text-[12px] text-white/70 mt-1">Class 10 · Horizon International · 24 Sep 2025</p>

              <div className="mt-5 rounded-2xl bg-white/95 p-4 text-slate-800">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Recommended streams</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["🧪 Science (PCM)", "💻 Computer Science", "📊 Data Analytics"].map((s) => (
                    <span key={s} className="rounded-full bg-brand-tint text-[11.5px] font-semibold px-2.5 py-1" style={{ color: INDIGO }}>{s}</span>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-slate-100 p-3">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Top matched career</p>
                  <p className="font-head font-black text-[15px] mt-1" style={{ color: NAVY }}>Software Engineer / ML Scientist</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: "89%", background: INDIGO }} />
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: INDIGO }}>89%</span>
                  </div>
                </div>
                <button className="mt-4 w-full h-9 rounded-full text-white font-semibold text-[13px] flex items-center justify-center gap-2" style={{ background: INDIGO }}>
                  Download PDF report <FileCheck2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------- Pillar 2: Global Career Navigator ---------- */
function PillarNavigator() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Globe className="h-3.5 w-3.5" /> Pillar 02
          </span>
          <h2 className="font-head mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            The global career navigator
          </h2>
          <p className="mt-5 text-[15px] md:text-base" style={{ color: SUBTLE }}>
            Real-time search across <b>2,50,000+</b> undergraduate and postgraduate programs spanning
            <b> 42 countries</b> — with the filters students and parents actually care about.
          </p>
        </div>

        {/* Filter row + result grid mock */}
        <div className="mt-14 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Filter className="h-4 w-4" style={{ color: INDIGO }} />
            <span className="text-[11.5px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>Dynamic filters</span>
            {["Tuition fee", "Deadline", "Eligibility", "SAT / IELTS", "NEET / JEE", "QS ranking", "Scholarships"].map((f) => (
              <span key={f} className="rounded-full bg-white border border-slate-200 text-[11.5px] font-semibold px-2.5 py-1" style={{ color: NAVY }}>
                {f}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { c: "🇺🇸", n: "Stanford University", p: "MS Computer Science", fee: "₹58L/yr", rank: "#3", ex: "SAT 1550, TOEFL 108" },
              { c: "🇬🇧", n: "University of Oxford", p: "BA PPE", fee: "₹42L/yr", rank: "#4", ex: "A-Level A*A*A, IELTS 7.5" },
              { c: "🇨🇦", n: "University of Toronto", p: "B.Eng. Software", fee: "₹32L/yr", rank: "#21", ex: "IB 38, IELTS 6.5" },
              { c: "🇦🇺", n: "Melbourne University", p: "B.Sc. Data Science", fee: "₹28L/yr", rank: "#14", ex: "ATAR 95, IELTS 7.0" },
              { c: "🇩🇪", n: "TU Munich", p: "MS Robotics", fee: "₹6L/yr", rank: "#37", ex: "GRE 325, IELTS 7.0" },
              { c: "🇸🇬", n: "NUS Singapore", p: "B.Eng. CE", fee: "₹18L/yr", rank: "#8", ex: "SAT 1450, IELTS 7.0" },
            ].map((r) => (
              <div key={r.n} className="rounded-2xl bg-white border border-slate-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{r.c}</span>
                  <p className="font-head font-bold text-[14px] truncate" style={{ color: NAVY }}>{r.n}</p>
                  <span className="ml-auto text-[10.5px] font-bold rounded-full px-2 py-0.5" style={{ background: INDIGO_TINT, color: INDIGO }}>QS {r.rank}</span>
                </div>
                <p className="text-[12px] mt-2" style={{ color: SUBTLE }}>{r.p}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11.5px] font-bold" style={{ color: NAVY }}>{r.fee}</span>
                  <span className="text-[10.5px]" style={{ color: SUBTLE }}>{r.ex}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <span className="text-[12px]" style={{ color: SUBTLE }}>
              + <b style={{ color: INDIGO }}>249,994</b> more programs match student profiles across 42 countries
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------- Counsellor Co-Pilot ---------- */
function CounsellorCoPilot() {
  return (
    <section className="py-20" style={{ background: INDIGO_TINT }}>
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Users className="h-3.5 w-3.5" /> For your counsellors
          </span>
          <h2 className="font-head mt-5 text-3xl md:text-4xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            School Counsellor Co-Pilot Dashboard
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: SUBTLE }}>
            A dedicated portal for your in-house counsellors to schedule 1:1 sessions,
            track student discovery progress, and export school-wide career analytics.
          </p>
          <ul className="mt-5 space-y-2.5">
            {[
              "Session scheduler with auto reminders",
              "Bulk assessment triggers by grade or section",
              "Progress tracking per student",
              "One-click school-wide analytics export",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-[13.5px]" style={{ color: TEXT }}>
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: INDIGO }} /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Dashboard mockup */}
        <div className="rounded-3xl bg-white border border-white shadow-xl p-5">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <div className="h-2 w-2 rounded-full bg-red-400" />
            <div className="h-2 w-2 rounded-full bg-amber-400" />
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="ml-2 font-semibold">Counsellor Co-Pilot · Green Valley Academy</span>
          </div>
          {/* KPIs */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { l: "Active students", v: "412", c: INDIGO },
              { l: "Sessions this week", v: "38", c: "#F59E0B" },
              { l: "Reports generated", v: "182", c: "#10B981" },
            ].map((k) => (
              <div key={k.l} className="rounded-xl border border-slate-100 p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{k.l}</p>
                <p className="font-head font-black text-xl mt-0.5" style={{ color: k.c }}>{k.v}</p>
              </div>
            ))}
          </div>
          {/* Queue */}
          <div className="mt-4 rounded-xl border border-slate-100 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold" style={{ color: NAVY }}>Today&apos;s session queue</p>
              <span className="text-[10px] text-slate-400">3 upcoming</span>
            </div>
            {[
              { t: "10:30 AM", n: "Aarav Sharma · Class 10", tag: "1:1 · Career discovery", c: INDIGO },
              { t: "11:15 AM", n: "Sara Sharma · Class 9", tag: "Report walkthrough", c: "#F59E0B" },
              { t: "02:00 PM", n: "Kabir Nair · Class 12", tag: "University shortlist", c: "#10B981" },
            ].map((r) => (
              <div key={r.n} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: r.c + "1A", color: r.c }}>
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-bold truncate" style={{ color: NAVY }}>{r.n}</p>
                  <p className="text-[11px] truncate" style={{ color: SUBTLE }}>{r.tag}</p>
                </div>
                <span className="text-[11px] font-bold" style={{ color: NAVY }}>{r.t}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full h-10 rounded-full text-white font-semibold text-[13px]" style={{ background: INDIGO }}>
            Export school-wide analytics
          </button>
        </div>
      </div>
    </section>
  );
}

/* --------- Parent Transparency Hub ---------- */
function ParentTransparency() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left mock */}
        <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 p-6 order-2 lg:order-1">
          <p className="text-[10px] uppercase tracking-widest font-bold text-amber-700">Parent view · Rajeev Sharma</p>
          <h4 className="font-head font-black text-lg mt-1" style={{ color: NAVY }}>Aarav&apos;s career journey</h4>

          <div className="mt-4 rounded-2xl bg-white p-4 border border-slate-100">
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Top career match</p>
            <p className="font-head font-black text-[15px] mt-1" style={{ color: NAVY }}>Software Engineer</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: "89%", background: INDIGO }} />
              </div>
              <span className="text-[11px] font-bold" style={{ color: INDIGO }}>89%</span>
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-white p-4 border border-slate-100">
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Estimated 4-yr investment</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div>
                <p className="text-[10px] text-slate-400">India</p>
                <p className="font-head font-bold text-[13px]" style={{ color: NAVY }}>₹18L</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Canada</p>
                <p className="font-head font-bold text-[13px]" style={{ color: NAVY }}>₹1.3Cr</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">USA</p>
                <p className="font-head font-bold text-[13px]" style={{ color: NAVY }}>₹2.1Cr</p>
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-100 p-2 text-center">
              <p className="text-[11px] font-bold text-emerald-700">Financing plan available · 0% EMI up to ₹15L</p>
            </div>
          </div>
        </div>

        {/* Right copy */}
        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Eye className="h-3.5 w-3.5" /> Parent Transparency Hub
          </span>
          <h2 className="font-head mt-5 text-3xl md:text-4xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            Bring parents into the conversation.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: SUBTLE }}>
            A co-viewing portal that helps parents understand their child&apos;s psychometric results and
            financial estimates for higher education — dramatically reducing home conflict around career choices.
          </p>
          <ul className="mt-5 space-y-2.5">
            {[
              "Shared psychometric report walkthrough",
              "Real cost estimates for each university & country",
              "Live 0% EMI eligibility right inside the report",
              "One-click session request with the school counsellor",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-[13.5px]" style={{ color: TEXT }}>
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: INDIGO }} /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
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
    <section className="py-20" style={{ background: INDIGO_TINT }}>
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Radar className="h-3.5 w-3.5" /> Career Readiness Radar
          </span>
          <h2 className="font-head mt-5 text-3xl md:text-4xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            Personalized roadmap<br />to their dream program.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: SUBTLE }}>
            The Skill Gap Radar maps the specific high-school electives, competitive exams and extracurriculars
            each student needs to qualify for the university programs they&apos;re aiming for.
          </p>
          <ul className="mt-5 space-y-2.5">
            {[
              "Electives to opt in Class 11 & 12",
              "Right competitive exams (SAT/IELTS/JEE/NEET)",
              "Recommended internships & clubs",
              "Timeline milestones — Grade 9 to Grade 12",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-[13.5px]" style={{ color: TEXT }}>
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: INDIGO }} /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Radar mock */}
        <div className="rounded-3xl bg-white border border-white shadow-xl p-6 flex flex-col items-center">
          <p className="text-[11px] uppercase tracking-widest font-bold self-start" style={{ color: INDIGO }}>Live readiness score</p>
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
          <div className="mt-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5">
            <p className="text-[12px] font-bold text-emerald-700">63% ready · 8-month roadmap generated</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------- Student Profile Builder ---------- */
function ProfileBuilder() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Trophy className="h-3.5 w-3.5" /> Student Profile Builder
          </span>
          <h2 className="font-head mt-5 text-3xl md:text-4xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            A living portfolio<br />ready for every application.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: SUBTLE }}>
            A digital portfolio manager for students to log achievements, certificates, projects,
            volunteering and internships — auto-formatted for every upcoming university application.
          </p>
          <ul className="mt-5 space-y-2.5">
            {[
              "Verified school-issued achievements",
              "Certificate & badge uploads with OCR extraction",
              "One-click Common App / UCAS / SAOP export",
              "Sharable public profile URL for applications",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-[13.5px]" style={{ color: TEXT }}>
                <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: INDIGO }} /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Profile card mock */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-brand-blue text-white font-head font-black flex items-center justify-center text-xl">AS</div>
            <div>
              <p className="font-head font-black text-lg" style={{ color: NAVY }}>Aarav Sharma</p>
              <p className="text-[12px]" style={{ color: SUBTLE }}>Class 10 · Horizon International · Bangalore</p>
            </div>
            <span className="ml-auto rounded-full bg-emerald-50 border border-emerald-100 px-2 py-1 text-[10.5px] font-bold text-emerald-700 flex items-center gap-1">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-slate-100 bg-white p-2.5 text-center">
              <p className="font-head font-black text-lg" style={{ color: INDIGO }}>14</p>
              <p className="text-[10px]" style={{ color: SUBTLE }}>Certificates</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-white p-2.5 text-center">
              <p className="font-head font-black text-lg" style={{ color: "#F59E0B" }}>6</p>
              <p className="text-[10px]" style={{ color: SUBTLE }}>Projects</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-white p-2.5 text-center">
              <p className="font-head font-black text-lg" style={{ color: "#10B981" }}>3</p>
              <p className="text-[10px]" style={{ color: SUBTLE }}>Internships</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { t: "Google Kickstart 2025 · Top 12%", c: INDIGO, ic: Award },
              { t: "AI ML for Everyone · Coursera", c: "#F59E0B", ic: BookOpen },
              { t: "TeachIndia Foundation · 40 hrs", c: "#10B981", ic: Heart },
            ].map((r) => {
              const Icon = r.ic;
              return (
                <div key={r.t} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-2.5">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: r.c + "1A", color: r.c }}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[13px] font-semibold flex-1 truncate" style={{ color: NAVY }}>{r.t}</span>
                  <BadgeCheck className="h-4 w-4" style={{ color: r.c }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------- Final CTA ---------- */
function FinalCTA() {
  return (
    <section id="demo" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-white"
          style={{ background: `linear-gradient(120deg, ${INDIGO} 0%, ${INDIGO_DEEP} 100%)` }}>
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20" style={{ background: "#FBBF24" }} />
          <div className="absolute -left-12 -bottom-14 h-48 w-48 rounded-full opacity-10 bg-white" />
          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold rounded-full px-3 py-1 bg-white/15 border border-white/20">
                <Rocket className="h-3.5 w-3.5" /> Go live with Career Hub
              </span>
              <h2 className="font-head mt-4 text-3xl md:text-4xl font-black leading-tight">
                Add scientific career guidance to your school in 24 hours.
              </h2>
              <p className="mt-3 text-white/85 text-sm md:text-base">
                Empower your counsellors, engage parents and unlock global opportunities for your students.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="h-11 px-6 rounded-full font-semibold text-sm" style={{ background: "#FBBF24", color: NAVY }}>
                  Schedule a demo <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" className="h-11 px-6 rounded-full font-semibold text-sm border-white/50 bg-transparent text-white hover:bg-white/10">
                  <PlayCircle className="h-4 w-4 mr-2" /> Watch 90-sec tour
                </Button>
              </div>
            </div>
            <div className="rounded-2xl bg-white/95 p-5 text-slate-800 shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Report ready</p>
                <span className="text-[10px]" style={{ color: INDIGO }}>2 min ago</span>
              </div>
              <p className="mt-2 font-head font-black text-lg" style={{ color: NAVY }}>Aarav → Software Engineer · 89% match</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "89%", background: INDIGO }} />
                </div>
                <span className="text-[11px] font-bold" style={{ color: INDIGO }}>89%</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <span className="rounded-full bg-brand-tint text-[10.5px] font-semibold px-2.5 py-1 text-center" style={{ color: INDIGO }}>3 stream matches</span>
                <span className="rounded-full bg-brand-tint text-[10.5px] font-semibold px-2.5 py-1 text-center" style={{ color: INDIGO }}>184 program matches</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------- Page shell ---------- */
export default function CareerHub() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
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
    </div>
  );
}
