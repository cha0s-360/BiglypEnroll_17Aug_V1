import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight, ArrowUpRight, ShieldCheck, Zap, Sparkles, GraduationCap,
  Wallet, CreditCard, Landmark, Smartphone, Building2, PieChart,
  BadgeCheck, TrendingUp, MessageCircle, FileCheck2, Receipt,
  UserCheck, Fingerprint, Bell, Wallet as WalletIcon, Gift,
  IndianRupee, ChevronRight, Check, PhoneCall, Mail,
  Star, PlayCircle, Users, School, Sparkle, Award, Clock,
  RefreshCw, BadgePercent, QrCode, ChevronDown, Calendar,
} from "lucide-react";

/* --------- Brand tokens (scoped inline styles) ---------- */
const INDIGO = "#5548D1";      // biglyp primary
const INDIGO_DEEP = "#3F35A8";
const INDIGO_TINT = "#EEF0FF";
const NAVY = "#0F1A5B";        // dark footer
const TEXT = "#212529";
const SUBTLE = "#5B6478";

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }),
};

/* --------- Data ---------- */
const HERO_IMG = "https://images.unsplash.com/photo-1719559519182-698f9bfc4e2f?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200";

const STATS = [
  { icon: School, value: "6,500+", label: "Partner institutions", color: "#F59E0B" },
  { icon: Users, value: "50 Lakh+", label: "Students served", color: "#EC4899" },
  { icon: IndianRupee, value: "₹4,200 Cr+", label: "Fees processed", color: "#10B981" },
  { icon: Landmark, value: "20+", label: "Bank & NBFC partners", color: "#5548D1" },
];

const INSTITUTE_HIGHLIGHTS = [
  { icon: TrendingUp, title: "Upfront Cashflow", desc: "Get 100% of annual fees upfront while parents pay you back in easy 0% EMIs." },
  { icon: Smartphone, title: "8+ Payment Options", desc: "UPI, Cards, Netbanking, Wallets, EMIs, Cash — one unified checkout for parents." },
  { icon: PieChart, title: "Zero Admin Hassles", desc: "Auto-reminders, auto-debit, live reconciliation — say goodbye to chasing dues." },
];

const LIVE_FEATURES = [
  { icon: MessageCircle, title: "WhatsApp & SMS Reminders", desc: "Automated, template-driven nudges before every due date." },
  { icon: FileCheck2, title: "Document Upload & Verification", desc: "Aadhaar, PAN, marksheets — collected and verified in-app." },
  { icon: Receipt, title: "Offline Fee Collection & Receipts", desc: "Record walk-in payments and issue GST-ready receipts instantly." },
  { icon: UserCheck, title: "Counsellor Assignment", desc: "Auto-route applicants to counsellors by grade, geography or program." },
  { icon: Fingerprint, title: "CIBIL Soft Pre-Check", desc: "Instant, no-impact eligibility so parents know they qualify before applying." },
  { icon: ShieldCheck, title: "Role-Based Access", desc: "Finance, Admissions, Counsellors — everyone sees exactly what they should." },
];

const PARENT_FEATURES = [
  { icon: WalletIcon, title: "Convenient & Flexible EMIs", desc: "Split annual fees into 3-12 monthly instalments — pay comfortably as you earn." },
  { icon: Sparkles, title: "0% Interest, No Hidden Charges", desc: "True no-cost EMI. What you owe is what you pay — never a rupee more." },
  { icon: Bell, title: "Auto-Debit Subscriptions", desc: "Set it once, never miss a deadline. Full control, cancel anytime." },
  { icon: Gift, title: "Upfront Discounts", desc: "Pay full year in one shot and unlock exclusive early-bird savings." },
];

const MINI_PARENT = [
  { icon: CreditCard, t: "8+ methods to pay", d: "UPI, cards, netbanking, NEFT, wallets, cash — your choice." },
  { icon: Clock, t: "Pay anytime, anywhere", d: "Mobile-first flow. From your couch or the campus lobby." },
  { icon: PhoneCall, t: "Priority support", d: "Call, WhatsApp or email — we reply in under 30 minutes." },
];

const WORKFLOWS = [
  { t: "Flexible Workflows for Modern Schools", d: "Guided parent journeys with automated follow-ups to simplify your K-12 admissions." },
  { t: "Higher-Ed & College Admissions", d: "Multi-stage evaluations, interviews, offers and fee-lock — orchestrated end-to-end." },
  { t: "Custom Workflows for Every Program", d: "Skill programs, coaching, upskilling — configure any stage in minutes." },
];

const WHY_STEPS = [
  { icon: GraduationCap, t: "Onboard your school" },
  { icon: Wallet, t: "Configure fee heads" },
  { icon: Zap, t: "Go live in 24 hours" },
  { icon: CreditCard, t: "Collect via any rail" },
  { icon: Sparkles, t: "Offer 0% EMIs" },
  { icon: PieChart, t: "Analyse & reconcile" },
];

const TESTIMONIALS = [
  {
    tag: "Institute", name: "Dr. Kavita Menon", role: "Principal, Green Valley Academy",
    q: "BiglypEnroll cleared a two-year fee backlog in eight weeks. Our finance team finally has weekends back.",
  },
  {
    tag: "Parent", name: "Rajeev Sharma", role: "Father of Aarav, Class 10",
    q: "I split ₹1.2 lakh into 12 EMIs with zero interest. The CIBIL check was instant and didn't touch my score.",
  },
  {
    tag: "Institute", name: "Aditya Rao", role: "Admin, Horizon International",
    q: "One dashboard for admissions, payments and receipts — plus WhatsApp reminders that actually work. Game-changer.",
  },
];

const MEDIA = ["CNBC", "Economic Times", "ET Now", "Mint", "YourStory", "Inc42", "BW Disrupt"];

const FAQS = [
  { q: "What is BiglypEnroll?", a: "BiglypEnroll is an end-to-end enrollment and fee-payments platform for schools, colleges and skilling institutes. It combines admissions workflows, one-tap fee collection across 8+ rails, 0% EMI financing, auto-debit mandates and live analytics — all in one place." },
  { q: "How does the 0% EMI work?", a: "Parents split annual fees into 3-12 monthly EMIs at 0% interest. Our RBI-regulated NBFC partners pay the school upfront while parents repay comfortably via UPI AutoPay or eNACH." },
  { q: "Does the CIBIL check impact my credit score?", a: "No. It is a soft pull done for eligibility only, and does not appear on your credit report or affect your score in any way." },
  { q: "Which institutions can use BiglypEnroll?", a: "Schools (K-12), colleges, universities, coaching centres and skilling institutes — any organisation that collects fees from students or parents." },
  { q: "How long does onboarding take?", a: "Most institutes go live in under 24 hours. Upload your fee sheet — our AI parses it — set up settlement accounts, and start collecting." },
  { q: "Is my data secure?", a: "Yes. We use bank-grade 256-bit encryption, RBI-regulated payment rails, and are fully compliant with India's Digital Personal Data Protection Act." },
];

/* --------- Nav ---------- */
function TopNav() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-7" />
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium" style={{ color: TEXT }}>
          <a href="#psychometry" className="hover:text-[color:var(--i)] transition-colors" style={{ ["--i"]: INDIGO }}>Psychometry</a>
          <a href="#services" className="flex items-center gap-1 hover:opacity-80 transition-opacity">Educational Services <ChevronRight className="h-3.5 w-3.5 rotate-90" /></a>
          <a href="#scholarships" className="flex items-center gap-1 hover:opacity-80 transition-opacity">Scholarships <ChevronRight className="h-3.5 w-3.5 rotate-90" /></a>
          <a href="#finance" className="flex items-center gap-1 font-semibold" style={{ color: INDIGO }}>
            Financial Services <ChevronRight className="h-3.5 w-3.5 rotate-90" />
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" className="h-9 px-5 rounded-full text-sm font-semibold border-slate-300"
              style={{ color: INDIGO }}>
              Sign in
            </Button>
          </Link>
          <a href="#demo">
            <Button className="h-9 px-5 rounded-full text-sm font-semibold text-white"
              style={{ background: INDIGO }}>
              Become a partner
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}

/* --------- Hero ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${INDIGO} 0%, ${INDIGO_DEEP} 55%, ${INDIGO_DEEP} 100%)`,
        }}
      />
      {/* soft grid */}
      <div className="absolute inset-0 opacity-[0.09]" style={{
        backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }} />
      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="show" variants={fade}>
          <span className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold rounded-full px-3 py-1.5 text-white"
            style={{ background: "rgba(255,255,255,0.14)" }}>
            <Sparkle className="h-3.5 w-3.5" /> BiglypEnroll · Fees made effortless
          </span>
          <motion.h1 custom={1} variants={fade}
            className="font-head mt-5 text-4xl md:text-5xl lg:text-[54px] font-black text-white leading-[1.05] tracking-tight">
            India&apos;s most advanced <br />
            <span className="relative inline-block">
              <span className="relative z-10">fee payment platform</span>
              <span className="absolute left-0 right-0 bottom-1 h-3 rounded-sm" style={{ background: "#FBBF24", opacity: 0.85 }} />
            </span>{" "}
            for your institute.
          </motion.h1>
          <motion.p custom={2} variants={fade}
            className="mt-5 text-white/85 text-[17px] max-w-lg leading-relaxed">
            From admissions to analytics — collect fees on 8+ rails, offer 0% EMIs and
            reconcile every rupee live. All in one platform loved by 6,500+ institutions.
          </motion.p>
          <motion.div custom={3} variants={fade} className="mt-8 flex flex-wrap gap-3">
            <a href="#demo">
              <Button className="h-12 px-6 rounded-full font-semibold text-white text-sm shadow-lg" style={{ background: "#FFFFFF", color: INDIGO }}>
                Schedule a demo <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </a>
            <a href="#products">
              <Button variant="outline" className="h-12 px-6 rounded-full font-semibold text-sm border-white/60 text-white hover:bg-white/10 bg-transparent">
                Explore products
              </Button>
            </a>
          </motion.div>
          {/* trust chip */}
          <motion.div custom={4} variants={fade} className="mt-8 inline-flex items-center gap-3 rounded-full pl-1 pr-4 py-1 bg-white/10 border border-white/15">
            <div className="flex -space-x-2">
              {["#F59E0B", "#EC4899", "#10B981", "#38BDF8"].map((c, i) => (
                <div key={i} className="h-7 w-7 rounded-full border-2 border-[color:var(--b)]" style={{ background: c, ["--b"]: INDIGO_DEEP }} />
              ))}
            </div>
            <span className="text-xs text-white/85 font-medium">
              50 Lakh+ parents · pay 0% EMI in minutes
            </span>
          </motion.div>
        </motion.div>

        {/* Hero image + floating cards */}
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-[440px] mx-auto"
            style={{ boxShadow: "0 40px 80px -30px rgba(0,0,0,0.45)" }}>
            <img src={HERO_IMG} alt="Parent and child" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, transparent 60%, rgba(15,26,91,0.35) 100%)",
            }} />
          </div>
          {/* floating card left */}
          <div className="hidden md:block absolute -left-6 top-16 rounded-2xl bg-white shadow-xl p-3 pr-4 flex items-center gap-3 min-w-[210px]"
            style={{ boxShadow: "0 20px 40px -15px rgba(0,0,0,0.25)" }}>
            <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "#DCFCE7", color: "#16A34A" }}>
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Pre-approved</p>
              <p className="text-sm font-head font-bold" style={{ color: NAVY }}>0% EMI · ₹1,20,000</p>
            </div>
          </div>
          {/* floating card right */}
          <div className="hidden md:flex absolute -right-4 bottom-14 rounded-2xl bg-white shadow-xl p-3 pr-4 items-center gap-3 min-w-[210px]"
            style={{ boxShadow: "0 20px 40px -15px rgba(0,0,0,0.25)" }}>
            <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">WhatsApp</p>
              <p className="text-sm font-head font-bold" style={{ color: NAVY }}>Reminder sent · Class 10</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* curved bottom */}
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
                <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: s.color + "1A", color: s.color }}>
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

/* --------- Trusted institutions logo wall ---------- */
function LogoWall() {
  const logos = [
    "Delhi Public School", "Amity University", "Podar", "Orchids", "NMIMS",
    "Manipal", "GITAM", "BITS Pilani", "SP Jain", "Shiv Nadar",
  ];
  return (
    <section className="bg-white pb-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold" style={{ color: INDIGO }}>
          Trusted by India&apos;s most respected educational institutions
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {logos.map((l) => (
            <div key={l} className="h-14 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center px-4">
              <span className="font-head font-bold text-[13px] text-slate-500 tracking-tight text-center">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------- Payment Options (3 cards: Auto-Collect · Instantly-Collect · Offer No-cost EMIs) ---------- */
function PaymentOptions() {
  const cards = [
    {
      title: "Auto-Collect",
      copy: "Automate fee collections as customers authorize recurring payments via NACH or UPI.",
      render: <FlexCard />,
    },
    {
      title: "Instantly-Collect",
      copy: "Collect fees instantly via QR codes or payment links.",
      render: <ScanPayCard />,
    },
    {
      title: "Offer No-cost EMIs",
      copy: "Receive full fee upfront while your customers pay in convenient, no-cost EMIs.",
      render: <CredCard />,
    },
  ];
  return (
    <section id="payments" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand-tint px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Sparkle className="h-3.5 w-3.5" /> Payment options
          </span>
          <h2 className="font-head mt-5 text-4xl md:text-5xl font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            Tailored payment options to<br className="hidden md:block" /> your institute&apos;s needs
          </h2>
          <p className="mt-5 text-[15px] md:text-base" style={{ color: SUBTLE }}>
            Empower your customers with multiple ways to pay, ensuring a smooth experience for both institutes and fee payers.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl p-6 md:p-7 text-white flex flex-col"
              style={{ background: `linear-gradient(180deg, ${INDIGO} 0%, ${INDIGO_DEEP} 100%)` }}
            >
              <div className="text-center">
                <h3 className="font-head text-2xl md:text-[26px] font-black tracking-tight">{c.title}</h3>
                <p className="mt-3 text-[13px] text-white/85 leading-relaxed max-w-[280px] mx-auto">{c.copy}</p>
              </div>
              <div className="mt-6 flex-1 flex items-stretch">
                {c.render}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Auto-Collect — FLEX schedule card */
function FlexCard() {
  const rows = [
    { l: "Downpayment (1 Apr '25)", tag: "Paid", amt: "₹50,000" },
    { l: "Instalment 1 (2 May '25)", tag: "Paid", amt: "₹10,000" },
    { l: "Instalment 2 (15 Jun '25)", tag: "Scheduled", amt: "₹10,000" },
    { l: "Instalment 3 (31 Jul '25)", tag: "Scheduled", amt: "₹10,000" },
  ];
  return (
    <div className="rounded-2xl bg-white text-slate-800 w-full p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
            <RefreshCw className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: NAVY }}>FLEX</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          <Bell className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-4">
        <p className="font-head font-bold text-[15px]" style={{ color: NAVY }}>Punith Kumar</p>
        <p className="text-[11px] text-slate-500 leading-snug">Pragati Institute of Learning · 678987654 · LKG · CBSE · 2024-25</p>
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-[12px] font-bold mb-2" style={{ color: NAVY }}>Payment Schedule</p>
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.l} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11.5px] text-slate-600 truncate">{r.l}</span>
                <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                  r.tag === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}>{r.tag}</span>
              </div>
              <span className="text-[12px] font-bold" style={{ color: NAVY }}>{r.amt}</span>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full flex items-center justify-center gap-1 text-[12px] font-bold" style={{ color: INDIGO }}>
          Show More <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* Instantly-Collect — Scan & pay card */
function ScanPayCard() {
  // Deterministic-looking QR pattern
  const cells = Array.from({ length: 15 * 15 }, (_, i) => {
    const x = i % 15, y = Math.floor(i / 15);
    // Force position markers
    const inCorner = (cx, cy) => x >= cx && x < cx + 3 && y >= cy && y < cy + 3;
    if (inCorner(0, 0) || inCorner(12, 0) || inCorner(0, 12)) {
      const inside = (cx, cy) => x === cx + 1 && y === cy + 1;
      if (inside(0, 0) || inside(12, 0) || inside(0, 12)) return false;
      return true;
    }
    // Pseudo-random
    return ((x * 31 + y * 17 + x * y) % 5) < 2;
  });

  const methods = ["UPI / Google Pay", "Debit / Credit Card", "Net Banking"];

  return (
    <div className="rounded-2xl bg-white text-slate-800 w-full p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <p className="font-head font-black text-[16px]" style={{ color: NAVY }}>Scan &amp; pay</p>
        <span className="text-[11px] font-bold tracking-widest" style={{ color: INDIGO }}>PAY</span>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <div className="rounded-lg border-2 border-slate-800 p-2.5 bg-white">
          <div className="grid grid-cols-15 gap-[1.5px]" style={{ gridTemplateColumns: "repeat(15, 8px)" }}>
            {cells.map((on, i) => (
              <div
                key={i}
                className="h-2 w-2"
                style={{ background: on ? NAVY : "transparent" }}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Scan the QR with any UPI app</p>
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-[12px] font-bold mb-2" style={{ color: NAVY }}>Select payment method</p>
        <div className="space-y-1.5">
          {methods.map((m) => (
            <button key={m} className="w-full flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 hover:border-slate-200 hover:bg-slate-50 transition-colors">
              <span className="text-[12.5px] text-slate-700">{m}</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Offer No-cost EMIs — CRED card */
function CredCard() {
  return (
    <div className="rounded-2xl bg-white text-slate-800 w-full p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
            <BadgePercent className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: NAVY }}>CRED</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          <Bell className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-4">
        <p className="font-head font-bold text-[15px]" style={{ color: NAVY }}>Punith Kumar</p>
        <p className="text-[11px] text-slate-500 leading-snug">Pragati Institute of Learning · 678544 · LKG · CBSE · 2024-25</p>
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-[12px] font-bold mb-2" style={{ color: NAVY }}>Loan details</p>
        <div className="flex items-center justify-between text-[12px] text-slate-600">
          <span>Loan amount</span>
          <span className="font-bold" style={{ color: NAVY }}>₹1,00,000</span>
        </div>
        <div className="flex items-center justify-between text-[12px] text-slate-600 mt-1">
          <span>Interest rate</span>
          <span className="font-bold" style={{ color: NAVY }}>₹0</span>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-100 py-2 text-center text-[12px] font-bold text-emerald-700">
        Zero Processing Fee
      </div>
      <div className="mt-3 border-t border-slate-100 pt-3">
        <p className="text-[12px] font-bold mb-2" style={{ color: NAVY }}>EMI details</p>
        <div className="grid grid-cols-3 gap-1 text-center">
          <div>
            <p className="text-[9.5px] uppercase tracking-widest text-slate-400 font-bold">EMI</p>
            <p className="font-head font-bold text-[13px] mt-0.5" style={{ color: NAVY }}>₹10,000</p>
          </div>
          <div>
            <p className="text-[9.5px] uppercase tracking-widest text-slate-400 font-bold">Tenure</p>
            <p className="font-head font-bold text-[13px] mt-0.5" style={{ color: NAVY }}>10 Months</p>
          </div>
          <div>
            <p className="text-[9.5px] uppercase tracking-widest text-slate-400 font-bold">Start on</p>
            <p className="font-head font-bold text-[13px] mt-0.5" style={{ color: NAVY }}>14 May 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------- Dual-audience tabbed panel ---------- */
function AudienceTabs() {
  const [tab, setTab] = useState("institutes");
  const tabs = [
    { k: "institutes", label: "For Institutes", icon: Building2 },
    { k: "parents", label: "For Parents", icon: Users },
  ];
  return (
    <section id="products" className="bg-gradient-to-b from-white to-[color:var(--tint)] py-20" style={{ ["--tint"]: INDIGO_TINT }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: INDIGO }}>
            <Award className="h-3.5 w-3.5" /> One platform · two audiences
          </span>
          <h2 className="font-head mt-4 text-3xl md:text-4xl font-black" style={{ color: NAVY }}>
            Built for institutes.<br className="hidden md:block" /> Loved by parents.
          </h2>
          <p className="mt-3 text-sm md:text-base" style={{ color: SUBTLE }}>
            The same platform serves both sides of the classroom — see what each gets.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-white shadow-sm border border-slate-100">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = t.k === tab;
              return (
                <button key={t.k} data-testid={`audience-tab-${t.k}`}
                  onClick={() => setTab(t.k)}
                  className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors"
                  style={{
                    background: active ? INDIGO : "transparent",
                    color: active ? "#fff" : TEXT,
                  }}>
                  <Icon className="h-4 w-4" /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel */}
        <div className="mt-10">
          {tab === "institutes" ? <InstitutePanel /> : <ParentPanel />}
        </div>
      </div>
    </section>
  );
}

/* --------- Institute Panel ---------- */
function InstitutePanel() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* left: 3 highlight cards */}
      <div className="space-y-4">
        {INSTITUTE_HIGHLIGHTS.map((h, i) => {
          const Icon = h.icon;
          return (
            <motion.div key={h.title}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white border border-slate-100 p-5 flex items-start gap-4 shadow-sm">
              <div className="h-11 w-11 rounded-xl shrink-0 flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-head font-bold text-[16px]" style={{ color: NAVY }}>{h.title}</p>
                <p className="text-[13px] mt-1" style={{ color: SUBTLE }}>{h.desc}</p>
              </div>
            </motion.div>
          );
        })}
        {/* Workflow accordion */}
        <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
          <p className="font-head font-bold text-[16px] mb-3" style={{ color: NAVY }}>Customisable Admissions Workflows</p>
          <Accordion type="single" collapsible defaultValue="w0">
            {WORKFLOWS.map((w, i) => (
              <AccordionItem key={i} value={`w${i}`} className="border-b border-slate-100 last:border-0">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline" style={{ color: TEXT }}>{w.t}</AccordionTrigger>
                <AccordionContent className="text-[13px]" style={{ color: SUBTLE }}>{w.d}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* right: live features grid */}
      <div>
        <div className="rounded-2xl p-6 text-white relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${INDIGO} 0%, ${INDIGO_DEEP} 100%)` }}>
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="absolute -left-6 -bottom-8 h-32 w-32 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
          <p className="text-[10px] uppercase tracking-widest font-bold text-white/80">Live features</p>
          <h3 className="font-head text-2xl font-black mt-1">Everything institutes need — nothing they don&apos;t.</h3>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {LIVE_FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-3">
                  <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="font-head font-bold mt-2 text-[13px]">{f.title}</p>
                  <p className="text-[11px] text-white/70 mt-0.5 leading-snug">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
        <a href="#demo" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: INDIGO }}>
          Explore BiglypEnroll for institutes <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

/* --------- Parent Panel ---------- */
function ParentPanel() {
  return (
    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-stretch">
      {/* left: value props */}
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {PARENT_FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-head font-bold text-[15px] mt-3" style={{ color: NAVY }}>{f.title}</p>
                <p className="text-[12.5px] mt-1" style={{ color: SUBTLE }}>{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Mock EMI card */}
        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-amber-50 to-white p-5 relative overflow-hidden">
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700">Sample EMI plan</span>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-head text-3xl font-black" style={{ color: NAVY }}>₹0</p>
            <p className="text-xs" style={{ color: SUBTLE }}>payable today</p>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-white border border-slate-100 p-2.5">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">EMI</p>
              <p className="font-head font-bold text-sm" style={{ color: NAVY }}>₹10,000/mo</p>
            </div>
            <div className="rounded-lg bg-white border border-slate-100 p-2.5">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Tenure</p>
              <p className="font-head font-bold text-sm" style={{ color: NAVY }}>12 months</p>
            </div>
            <div className="rounded-lg bg-white border border-slate-100 p-2.5">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Interest</p>
              <p className="font-head font-bold text-sm text-emerald-600">0%</p>
            </div>
          </div>
          <p className="mt-3 text-[12px]" style={{ color: SUBTLE }}>
            Starts 15th Apr · 100% school-paid upfront · powered by RBI-regulated NBFCs
          </p>
          <Sparkle className="h-5 w-5 absolute right-4 top-4 text-amber-400" />
        </div>

        {/* Mini icons */}
        <div className="grid sm:grid-cols-3 gap-3 pt-1">
          {MINI_PARENT.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.t} className="rounded-xl bg-white border border-slate-100 p-3.5">
                <Icon className="h-4 w-4" style={{ color: INDIGO }} />
                <p className="font-head font-bold text-[13px] mt-1.5" style={{ color: NAVY }}>{m.t}</p>
                <p className="text-[11.5px] mt-0.5" style={{ color: SUBTLE }}>{m.d}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* right: phone mockup */}
      <div className="relative flex items-center justify-center">
        <div className="relative">
          {/* halo */}
          <div className="absolute inset-0 -m-6 rounded-[48px]" style={{ background: `radial-gradient(60% 60% at 50% 50%, ${INDIGO}22 0%, transparent 70%)` }} />
          <div className="relative w-[280px] h-[560px] rounded-[36px] border-[8px] border-slate-900 bg-white overflow-hidden shadow-2xl">
            {/* status bar */}
            <div className="h-6 bg-slate-900" />
            <div className="p-4 pt-3 text-[10px] font-medium text-slate-400 flex justify-between">
              <span>9:41</span><span>WhatsApp</span>
            </div>
            <div className="px-4 space-y-3">
              <div className="rounded-2xl bg-emerald-50 p-3 border border-emerald-100">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700">Reminder · Class 10</p>
                <p className="text-[12px] mt-1 font-medium" style={{ color: NAVY }}>
                  Dear Rajeev, EMI 3 of ₹10,000 is due on <b>15 Sep</b>. Tap to pay in one click.
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-full bg-emerald-600 text-white text-[10px] px-2.5 py-1 font-semibold">Pay Now</span>
                  <span className="rounded-full bg-white border border-emerald-200 text-emerald-700 text-[10px] px-2.5 py-1 font-semibold">View schedule</span>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Receipt</p>
                <p className="text-[12px] mt-1 font-medium" style={{ color: NAVY }}>
                  ₹10,000 received · BLP-EMI-8F91 · GST invoice attached.
                </p>
                <p className="text-[10px] mt-1 text-slate-400">Horizon International · 15 Aug 2026</p>
              </div>
              <div className="rounded-2xl border border-slate-100 p-3 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
                  <Fingerprint className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold" style={{ color: NAVY }}>CIBIL score verified</p>
                  <p className="text-[10px] text-slate-400">Soft pull · No impact</p>
                </div>
                <div className="ml-auto text-[11px] font-black" style={{ color: INDIGO }}>801</div>
              </div>
            </div>
          </div>
          {/* floating chip */}
          <div className="absolute -right-6 top-24 rounded-xl bg-white shadow-lg px-3 py-2 text-[11px] font-semibold flex items-center gap-2 border border-slate-100" style={{ color: NAVY }}>
            <Bell className="h-3.5 w-3.5" style={{ color: INDIGO }} /> Real-time alerts
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------- Why choose Biglyp — process ribbon ---------- */
function WhyChoose() {
  return (
    <section id="finance" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: INDIGO }}>
          <Award className="h-3.5 w-3.5" /> Proven process
        </span>
        <h2 className="font-head mt-4 text-3xl md:text-4xl font-black" style={{ color: NAVY }}>
          Why institutes choose BiglypEnroll
        </h2>
        <p className="mt-3 text-sm md:text-base max-w-2xl mx-auto" style={{ color: SUBTLE }}>
          A complete, end-to-end fee-payments platform — for K-12, higher-ed and skilling institutes across India.
        </p>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {WHY_STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.t} className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-md"
                    style={{ background: i % 2 ? "#FEF3C7" : INDIGO_TINT, color: i % 2 ? "#B45309" : INDIGO }}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full text-[11px] font-black flex items-center justify-center text-white"
                    style={{ background: INDIGO }}>
                    {i + 1}
                  </span>
                </div>
                <p className="font-head font-bold text-[13px] mt-3" style={{ color: NAVY }}>{s.t}</p>
              </div>
            );
          })}
        </div>

        <a href="#demo" className="mt-12 inline-block">
          <Button className="h-11 px-6 rounded-full font-semibold text-white text-sm" style={{ background: INDIGO }}>
            Start your journey with Biglyp <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </a>
      </div>
    </section>
  );
}

/* --------- Testimonials ---------- */
function Testimonials() {
  return (
    <section className="py-20" style={{ background: INDIGO_TINT }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h2 className="font-head text-3xl md:text-4xl font-black" style={{ color: NAVY }}>
            Hear it from our partners &amp; parents
          </h2>
          <p className="mt-3 text-sm md:text-base" style={{ color: SUBTLE }}>
            Real stories from schools and families we&apos;ve worked with.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white p-6 shadow-sm border border-white flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold rounded-full px-2 py-0.5"
                  style={{ background: t.tag === "Parent" ? "#FEF3C7" : INDIGO_TINT, color: t.tag === "Parent" ? "#B45309" : INDIGO }}>
                  {t.tag}
                </span>
                <div className="flex ml-auto">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: TEXT }}>&ldquo;{t.q}&rdquo;</p>
              <div className="mt-auto pt-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full flex items-center justify-center font-head font-bold text-white text-sm"
                  style={{ background: INDIGO }}>
                  {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-head font-bold text-sm" style={{ color: NAVY }}>{t.name}</p>
                  <p className="text-[11.5px]" style={{ color: SUBTLE }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------- Media strip ---------- */
function MediaStrip() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-[11px] uppercase tracking-widest font-bold" style={{ color: SUBTLE }}>
          <Sparkles className="inline h-3.5 w-3.5 mr-1" style={{ color: INDIGO }} /> Proudly featured in media
        </p>
        <div className="mt-6 flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
          {MEDIA.map((m) => (
            <span key={m} className="font-head font-black text-slate-400 text-lg tracking-tight">
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------- CTA banner ---------- */
function FinalCTA() {
  return (
    <section id="demo" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-white"
          style={{ background: `linear-gradient(120deg, ${INDIGO} 0%, ${INDIGO_DEEP} 100%)` }}>
          {/* decorations */}
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20" style={{ background: "#FBBF24" }} />
          <div className="absolute -left-12 -bottom-14 h-48 w-48 rounded-full opacity-10 bg-white" />
          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase font-bold rounded-full px-3 py-1 bg-white/15 border border-white/20">
                <Zap className="h-3.5 w-3.5" /> Let&apos;s transform fee collection
              </span>
              <h2 className="font-head mt-4 text-3xl md:text-4xl font-black leading-tight">
                Go live in 24 hours.<br />Delight parents from day one.
              </h2>
              <p className="mt-3 text-white/85 text-sm md:text-base">
                Talk to our team, share your fee sheet — we&apos;ll get your institute live before your next collection cycle.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="h-11 px-6 rounded-full font-semibold text-sm" style={{ background: "#FBBF24", color: NAVY }}>
                  Schedule a demo <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" className="h-11 px-6 rounded-full font-semibold text-sm border-white/50 bg-transparent text-white hover:bg-white/10">
                  <PlayCircle className="h-4 w-4 mr-2" /> Watch 90-sec tour
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-5 text-[12px] text-white/80">
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> No setup fee</span>
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Cancel anytime</span>
                <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> RBI-regulated</span>
              </div>
            </div>
            {/* Mini dashboard preview */}
            <div className="rounded-2xl bg-white/95 p-4 text-slate-800 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-semibold text-slate-400 ml-2">BiglypEnroll · Live dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { l: "Collected", v: "₹18.4L", c: "#10B981" },
                  { l: "Due", v: "₹2.6L", c: "#F59E0B" },
                  { l: "On EMI", v: "142", c: INDIGO },
                ].map((k) => (
                  <div key={k.l} className="rounded-lg border border-slate-100 p-2">
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{k.l}</p>
                    <p className="font-head font-black text-sm" style={{ color: k.c }}>{k.v}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-slate-50 p-3 flex items-end gap-1 h-16">
                {[40, 65, 30, 75, 55, 90, 70, 85, 50, 78, 68, 92].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i % 2 ? INDIGO : "#FBBF24", opacity: i % 3 ? 1 : 0.7 }} />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Monthly collections · Apr–Mar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------- FAQ ---------- */
function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <h2 className="font-head text-3xl md:text-4xl font-black" style={{ color: NAVY }}>
            Frequently asked questions
          </h2>
          <p className="mt-3 text-sm md:text-base" style={{ color: SUBTLE }}>
            Everything you and your school need to know before switching to BiglypEnroll.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {FAQS.map((f, i) => (
            <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="font-head font-bold text-[15px]" style={{ color: NAVY }}>{f.q}</span>
                <span className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center transition-transform group-open:rotate-45"
                  style={{ background: INDIGO_TINT, color: INDIGO }}>
                  <span className="text-lg leading-none font-bold">+</span>
                </span>
              </summary>
              <p className="mt-3 text-[13.5px] leading-relaxed" style={{ color: SUBTLE }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------- Footer ---------- */
function Footer() {
  return (
    <footer style={{ background: NAVY }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-7 grayscale invert brightness-200" />
          </div>
          <p className="mt-3 text-[13px] text-white/60 leading-relaxed max-w-xs">
            The leap that defines you. India&apos;s complete education finance platform for institutes, parents and students.
          </p>
          <div className="mt-5">
            <p className="text-[11px] uppercase tracking-widest font-bold text-white/70">Subscribe to our newsletter</p>
            <form className="mt-2 flex items-center gap-2">
              <Input placeholder="Enter your email address" className="bg-white/10 border-white/15 text-white placeholder:text-white/50 rounded-full h-10 text-sm" />
              <Button type="button" className="h-10 rounded-full px-4 text-sm font-semibold text-white" style={{ background: INDIGO }}>
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest font-bold text-white/70">Products</p>
          <ul className="mt-4 space-y-2 text-[13px] text-white/80">
            <li><a href="#" className="hover:text-white">Psychometric Assessment</a></li>
            <li><a href="#" className="hover:text-white">BiglypEnroll (Fees)</a></li>
            <li><a href="#" className="hover:text-white">Education Financing</a></li>
            <li><a href="#" className="hover:text-white">CIBIL Score Check</a></li>
            <li><a href="#" className="hover:text-white">Scholarships</a></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest font-bold text-white/70">Study destinations</p>
          <ul className="mt-4 space-y-2 text-[13px] text-white/80">
            <li>Study in India</li>
            <li>Study in USA</li>
            <li>Study in UK</li>
            <li>Study in Canada</li>
            <li>Study in Australia</li>
            <li>Study in Germany</li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest font-bold text-white/70">Contact us</p>
          <ul className="mt-4 space-y-3 text-[13px] text-white/80">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@biglyp.com</li>
            <li className="flex items-center gap-2"><PhoneCall className="h-4 w-4" /> +91 91234 56789</li>
          </ul>
          <div className="mt-5 flex gap-2">
            {["in", "f", "𝕏", "▶"].map((s) => (
              <span key={s} className="h-8 w-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[13px] font-bold cursor-pointer hover:bg-white/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-white/50">
          <p>© 2026 Biglyp Education Finance Pvt. Ltd. · All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white">Terms &amp; Conditions</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Refund Policy</a>
            <a href="#" className="hover:text-white">Lending Partners</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --------- Page shell ---------- */
export default function BiglypEnroll() {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      <TopNav />
      <Hero />
      <StatStrip />
      <LogoWall />
      <PaymentOptions />
      <AudienceTabs />
      <WhyChoose />
      <Testimonials />
      <MediaStrip />
      <FinalCTA />
      <FAQ />
      <Footer />
    </div>
  );
}
