import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MarketingNav, MarketingFooter,
  INDIGO, INDIGO_DEEP, INDIGO_TINT, NAVY, TEXT, SUBTLE,
} from "@/components/MarketingShell";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, GraduationCap, Wallet, Sparkle, Users, School, IndianRupee,
  Landmark, Shield, ShieldCheck, Lock, Globe, Server, Plug, Layers,
  Star, BadgeCheck, Sparkles, TrendingUp, PieChart, ChevronRight,
  Zap, Compass, Award, PlayCircle, Check, Boxes, LockKeyhole,
  Building2, Fingerprint, HeartHandshake, BarChart3, Rocket,
} from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1719559519182-698f9bfc4e2f?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200";

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

const STATS = [
  { icon: School, value: "6,500+", label: "Partner institutions", color: "#F59E0B" },
  { icon: Users, value: "50 Lakh+", label: "Students served", color: "#EC4899" },
  { icon: Globe, value: "42", label: "Countries navigated", color: "#10B981" },
  { icon: IndianRupee, value: "₹4,200 Cr+", label: "Fees processed", color: INDIGO },
];

const B2B_BENEFITS = [
  {
    icon: HeartHandshake, color: "#EC4899",
    title: "Enhanced Parent Satisfaction",
    desc: "Solve fee stress while providing world-class career guidance for their children — all under one institutional roof.",
  },
  {
    icon: Zap, color: "#F59E0B",
    title: "Zero Operational Friction",
    desc: "Reduce admin follow-ups for overdue fees by 80% while automating your entire counselling administration.",
  },
  {
    icon: Award, color: "#10B981",
    title: "Brand Elevation",
    desc: "Upgrade your school&apos;s value offering to prospective parents during admissions and stand out from every competitor.",
  },
];

const SECURITY = [
  { icon: Shield, t: "ISO-27001 Certified", d: "Independently audited information security controls." },
  { icon: Lock, t: "DPDP Compliant", d: "Full compliance with India&apos;s Digital Personal Data Protection Act." },
  { icon: LockKeyhole, t: "Bank-Grade 256-bit SSL", d: "Every financial transaction is end-to-end encrypted." },
  { icon: ShieldCheck, t: "RBI-Regulated Rails", d: "Lending, disbursals and mandates through licensed NBFC partners." },
];

/* --------- Hero ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INDIGO} 0%, ${INDIGO_DEEP} 55%, ${INDIGO_DEEP} 100%)` }} />
      <div className="absolute inset-0 opacity-[0.09]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <motion.div initial="hidden" animate="show" variants={fade}>
          <span className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold rounded-full px-3 py-1.5 text-white" style={{ background: "rgba(255,255,255,0.14)" }}>
            <Sparkle className="h-3.5 w-3.5" /> BiglypEnroll · Master Platform
          </span>
          <motion.h1 custom={1} variants={fade}
            className="font-head mt-5 text-4xl md:text-5xl lg:text-[52px] font-black text-white leading-[1.05] tracking-tight">
            Empower Students.<br />
            Simplify Collections.<br />
            <span className="relative inline-block">
              <span className="relative z-10">The all-in-one OS</span>
              <span className="absolute left-0 right-0 bottom-1 h-3 rounded-sm" style={{ background: "#FBBF24", opacity: 0.85 }} />
            </span>{" "}
            for modern institutions.
          </motion.h1>
          <motion.p custom={2} variants={fade}
            className="mt-5 text-white/85 text-[16px] md:text-[17px] max-w-xl leading-relaxed">
            BiglypEnroll bridges career readiness and institutional fee collection —
            giving schools the digital infrastructure to better serve parents and students.
          </motion.p>
          <motion.div custom={3} variants={fade} className="mt-8 flex flex-wrap gap-3">
            <a href="#demo">
              <Button className="h-12 px-6 rounded-full font-semibold text-sm shadow-lg" style={{ background: "#FFFFFF", color: INDIGO }}>
                Schedule School Demo <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </a>
            <a href="#products">
              <Button variant="outline" className="h-12 px-6 rounded-full font-semibold text-sm border-white/60 text-white hover:bg-white/10 bg-transparent">
                Explore Sub-Products
              </Button>
            </a>
          </motion.div>

          {/* Trust chip strip */}
          <motion.div custom={4} variants={fade} className="mt-8 flex flex-wrap gap-2">
            {["ISO 27001", "DPDP compliant", "RBI-regulated", "50 Lakh+ parents"].map((t) => (
              <span key={t} className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold text-white">
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Ecosystem visual — parent + student + institute triangle */}
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-[440px] mx-auto"
            style={{ boxShadow: "0 40px 80px -30px rgba(0,0,0,0.45)" }}>
            <img src={HERO_IMG} alt="Parent and student" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(15,26,91,0.4) 100%)" }} />
          </div>
          {/* Floating product cards */}
          <div className="hidden md:flex absolute -left-6 top-14 rounded-2xl bg-white shadow-xl p-3 pr-4 items-center gap-3 min-w-[220px]" style={{ boxShadow: "0 20px 40px -15px rgba(0,0,0,0.25)" }}>
            <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Career Hub</p>
              <p className="text-sm font-head font-bold" style={{ color: NAVY }}>2.5L courses · 42 countries</p>
            </div>
          </div>
          <div className="hidden md:flex absolute -right-4 bottom-16 rounded-2xl bg-white shadow-xl p-3 pr-4 items-center gap-3 min-w-[220px]" style={{ boxShadow: "0 20px 40px -15px rgba(0,0,0,0.25)" }}>
            <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "#FEF3C7", color: "#B45309" }}>
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Fee Collection</p>
              <p className="text-sm font-head font-bold" style={{ color: NAVY }}>0% EMI · 100% upfront</p>
            </div>
          </div>
        </motion.div>
      </div>

      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full h-[46px] relative -mb-px" aria-hidden>
        <path d="M0 60 L1440 60 L1440 0 C 1080 60, 360 60, 0 0 Z" fill="#ffffff" />
      </svg>
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

/* --------- Dual-Engine Core (sub-product spotlight) ---------- */
function DualEngineCore() {
  return (
    <section id="products" className="py-20 bg-gradient-to-b from-white to-[color:var(--tint)]" style={{ ["--tint"]: INDIGO_TINT }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Layers className="h-3.5 w-3.5" /> Dual-engine core
          </span>
          <h2 className="font-head mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            Two powerful engines.<br />One institutional platform.
          </h2>
          <p className="mt-5 text-[15px] md:text-base" style={{ color: SUBTLE }}>
            Career readiness and fee collection — the two things every parent cares about most —
            unified into a single OS for your institution.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-6">
          {/* Card 1 — Career Hub */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl bg-white border border-slate-100 p-8 shadow-sm flex flex-col">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: INDIGO_TINT, color: INDIGO }}>
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold" style={{ color: INDIGO }}>Sub-product · 01</p>
                <h3 className="font-head text-2xl font-black mt-1" style={{ color: NAVY }}>Biglyp Career Hub</h3>
                <p className="text-[13.5px] mt-2 leading-relaxed" style={{ color: SUBTLE }}>
                  Scientific career guidance and global university discovery for every student.
                </p>
              </div>
            </div>
            <ul className="mt-6 space-y-2.5">
              {[
                "AI Psychometrics — Aptitude, Interest, EQ, Personality",
                "2,50,000+ courses across 42 countries in one search",
                "Structured counselling workflows for your team",
                "Actionable, easy-to-read student career reports",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-[13.5px]" style={{ color: TEXT }}>
                  <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: INDIGO }} /> {t}
                </li>
              ))}
            </ul>
            {/* Mini mockup */}
            <div className="mt-6 rounded-2xl border border-slate-100 p-4 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: INDIGO }}>Psychometric report</span>
                <span className="ml-auto text-[10px] text-slate-400">Class 10 · Aarav Sharma</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[
                  { l: "Aptitude", v: 82, c: INDIGO },
                  { l: "Interest", v: 74, c: "#F59E0B" },
                  { l: "EQ", v: 91, c: "#10B981" },
                  { l: "Style", v: 68, c: "#EC4899" },
                ].map((k) => (
                  <div key={k.l} className="rounded-lg bg-white border border-slate-100 p-2 text-center">
                    <p className="text-[9.5px] uppercase tracking-widest text-slate-400 font-bold">{k.l}</p>
                    <p className="font-head font-black text-sm mt-0.5" style={{ color: k.c }}>{k.v}%</p>
                    <div className="h-1 mt-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${k.v}%`, background: k.c }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/career-hub" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: INDIGO }}>
              Explore Career Hub <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Card 2 — Fee Collection */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-3xl p-8 shadow-sm flex flex-col text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${INDIGO} 0%, ${INDIGO_DEEP} 100%)` }}>
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="absolute -left-6 -bottom-8 h-32 w-32 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="flex items-start gap-4 relative">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 bg-white/15">
                <Wallet className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold text-white/80">Sub-product · 02</p>
                <h3 className="font-head text-2xl font-black mt-1">Biglyp Fee Collection</h3>
                <p className="text-[13.5px] mt-2 text-white/85 leading-relaxed">
                  0% EMI fee financing, automated collections, custom module billing.
                </p>
              </div>
            </div>
            <ul className="mt-6 space-y-2.5 relative">
              {[
                "0% EMI fee financing — 100% upfront to schools",
                "Automated auto-debit collections via NACH/UPI",
                "Custom modules — Tuition, Transport, Trips, Meals",
                "Live dashboards & reconciliation for finance teams",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-[13.5px] text-white">
                  <Check className="h-4 w-4 mt-0.5 shrink-0 text-amber-300" /> {t}
                </li>
              ))}
            </ul>
            {/* Mini mockup */}
            <div className="mt-6 rounded-2xl bg-white/95 p-4 text-slate-800 relative">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: INDIGO }}>Live dashboard</span>
                <span className="ml-auto text-[10px] text-slate-400">AY 2025-26</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { l: "Collected", v: "₹18.4L", c: "#10B981" },
                  { l: "Due", v: "₹2.6L", c: "#F59E0B" },
                  { l: "On EMI", v: "142", c: INDIGO },
                ].map((k) => (
                  <div key={k.l} className="rounded-lg border border-slate-100 p-2">
                    <p className="text-[9.5px] uppercase tracking-widest text-slate-400 font-bold">{k.l}</p>
                    <p className="font-head font-black text-sm" style={{ color: k.c }}>{k.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-slate-50 p-2 flex items-end gap-1 h-12">
                {[40, 65, 30, 75, 55, 90, 70, 85, 50, 78, 68, 92].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i % 2 ? INDIGO : "#FBBF24", opacity: i % 3 ? 1 : 0.7 }} />
                ))}
              </div>
            </div>
            <Link to="/fee-collection" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white">
              Explore Fee Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* --------- Deployment Flexibility ---------- */
function DeploymentFlex() {
  return (
    <section id="deploy" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Plug className="h-3.5 w-3.5" /> Deployment flexibility
          </span>
          <h2 className="font-head mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            Plug into your ERP.<br />Or run stand-alone.
          </h2>
          <p className="mt-5 text-[15px] md:text-base" style={{ color: SUBTLE }}>
            Whether you already have a school ERP or need a fresh, branded portal —
            BiglypEnroll works exactly the way your institution wants it to.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-6">
          {/* ERP */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
                <Server className="h-6 w-6" />
              </div>
              <p className="font-head font-black text-xl" style={{ color: NAVY }}>Seamless ERP Integration</p>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed" style={{ color: SUBTLE }}>
              Native APIs connect with existing school management software — <b>Skolaro, Fedena, Entab, MyClassCampus</b>
              and more — with zero data duplication.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {["Skolaro", "Fedena", "Entab", "MyClassCampus"].map((e) => (
                <div key={e} className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
                    <Boxes className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[12.5px] font-semibold" style={{ color: NAVY }}>{e}</span>
                  <BadgeCheck className="ml-auto h-4 w-4 text-emerald-500" />
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-white border border-slate-100 p-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[11px] font-mono text-slate-500">POST /api/v1/webhook/payment.success</p>
              </div>
              <p className="text-[10.5px] font-mono text-slate-400 mt-1">{"→ ERP reconciled · student_id=BLP-1042 · ₹18,000"}</p>
            </div>
          </div>

          {/* White-labeled */}
          <div className="rounded-3xl p-8 text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${INDIGO} 0%, ${INDIGO_DEEP} 100%)` }}>
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-white/15">
                  <Globe className="h-6 w-6" />
                </div>
                <p className="font-head font-black text-xl">White-Labeled Web Portal</p>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-white/85">
                Get an independent, fully branded web environment with your school&apos;s own logo, colours and a dedicated URL.
              </p>
              {/* URL preview */}
              <div className="mt-6 rounded-xl bg-white/95 p-3 flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-600" />
                <span className="text-[13px] font-mono" style={{ color: NAVY }}>
                  your-school<span style={{ color: INDIGO }}>.biglypenroll.com</span>
                </span>
                <BadgeCheck className="ml-auto h-4 w-4" style={{ color: INDIGO }} />
              </div>
              {/* Sub-features */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { i: Sparkles, t: "Custom branding" },
                  { i: Users, t: "SSO for parents" },
                  { i: Rocket, t: "Live in 24 hrs" },
                  { i: BarChart3, t: "Owned analytics" },
                ].map((s) => {
                  const Icon = s.i;
                  return (
                    <div key={s.t} className="rounded-lg bg-white/10 border border-white/15 p-2.5 flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="text-[12.5px] font-semibold">{s.t}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------- B2B Institutional Value Prop ---------- */
function InstitutionalValue() {
  return (
    <section className="py-20" style={{ background: INDIGO_TINT }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Building2 className="h-3.5 w-3.5" /> Built for institutions
          </span>
          <h2 className="font-head mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            What your institution unlocks
          </h2>
          <p className="mt-5 text-[15px] md:text-base" style={{ color: SUBTLE }}>
            Measurable, board-level outcomes — not just software.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {B2B_BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div key={b.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-white border border-white p-6 shadow-sm">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: b.color + "1A", color: b.color }}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="font-head font-black text-lg mt-4" style={{ color: NAVY }}>{b.title}</p>
                <p className="text-[13.5px] mt-2 leading-relaxed" style={{ color: SUBTLE }}>{b.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* KPI ribbon */}
        <div className="mt-10 rounded-3xl bg-white border border-white p-6 grid md:grid-cols-4 gap-4">
          {[
            { v: "80%", l: "fewer admin follow-ups" },
            { v: "3.2×", l: "counselling capacity" },
            { v: "24 hrs", l: "to go live" },
            { v: "100%", l: "school payout upfront" },
          ].map((k) => (
            <div key={k.l} className="text-center">
              <p className="font-head font-black text-3xl" style={{ color: INDIGO }}>{k.v}</p>
              <p className="text-[12px] mt-0.5" style={{ color: SUBTLE }}>{k.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------- Enterprise Trust & Security ---------- */
function EnterpriseTrust() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
              <ShieldCheck className="h-3.5 w-3.5" /> Enterprise trust & security
            </span>
            <h2 className="font-head mt-5 text-3xl md:text-4xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
              Built with the same rigor as your school&apos;s finance office.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: SUBTLE }}>
              ISO-certified security, DPDP-compliant data protection and bank-grade SSL encryption
              for every financial transaction — audited by third-party partners you already trust.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["ISO 27001", "DPDP 2023", "PCI DSS", "TLS 1.3"].map((c) => (
                <span key={c} className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-[11.5px] font-bold" style={{ color: NAVY }}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {SECURITY.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.t} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-head font-black mt-3 text-[15px]" style={{ color: NAVY }}>{s.t}</p>
                  <p className="text-[12.5px] mt-1 leading-relaxed" style={{ color: SUBTLE }} dangerouslySetInnerHTML={{ __html: s.d }} />
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
                <Zap className="h-3.5 w-3.5" /> Ready when you are
              </span>
              <h2 className="font-head mt-4 text-3xl md:text-4xl font-black leading-tight">
                Give your institution<br />the OS of tomorrow.
              </h2>
              <p className="mt-3 text-white/85 text-sm md:text-base">
                One 30-minute call — we&apos;ll map both engines to your existing workflows and get you live in 24 hours.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="h-11 px-6 rounded-full font-semibold text-sm" style={{ background: "#FBBF24", color: NAVY }}>
                  Schedule School Demo <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" className="h-11 px-6 rounded-full font-semibold text-sm border-white/50 bg-transparent text-white hover:bg-white/10">
                  <PlayCircle className="h-4 w-4 mr-2" /> Watch 90-sec tour
                </Button>
              </div>
            </div>
            <div className="rounded-2xl bg-white/95 p-5 text-slate-800 shadow-2xl">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">One institution, two engines</p>
              <div className="mt-3 space-y-2">
                {[
                  { i: GraduationCap, l: "Career Hub · Live", c: "#10B981" },
                  { i: Wallet, l: "Fee Collection · Live", c: INDIGO },
                  { i: Server, l: "ERP synced (Skolaro)", c: "#F59E0B" },
                  { i: Fingerprint, l: "SSO enabled", c: "#EC4899" },
                ].map((r) => {
                  const Icon = r.i;
                  return (
                    <div key={r.l} className="flex items-center gap-3 rounded-lg border border-slate-100 p-2.5">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: r.c + "1A", color: r.c }}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[13px] font-semibold" style={{ color: NAVY }}>{r.l}</span>
                      <BadgeCheck className="ml-auto h-4 w-4 text-emerald-500" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------- Page shell ---------- */
export default function BiglypMaster() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      <MarketingNav />
      <Hero />
      <StatStrip />
      <DualEngineCore />
      <DeploymentFlex />
      <InstitutionalValue />
      <EnterpriseTrust />
      <FinalCTA />
      <MarketingFooter />
    </div>
  );
}
