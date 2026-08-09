import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { HomeFeatureSections } from "@/components/HomeFeatureSections";
import { motion } from "framer-motion";
import {
  ArrowUpRight, Wallet, ShieldCheck, Sparkles, TrendingUp, Zap,
  GraduationCap, CreditCard, PieChart, ArrowRight,
} from "lucide-react";

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const FEATURES = [
  { icon: GraduationCap, title: "School Onboarding", desc: "Add campuses, courses and teams with a guided wizard. Go live in minutes, not weeks." },
  { icon: Wallet, title: "Smart Fee Structures", desc: "Map fee heads to grades, set frequencies, scholarships and late-fee rules with ease." },
  { icon: Sparkles, title: "AI Excel Parsing", desc: "Upload your messy fee sheet — our AI turns it into clean structured fee heads instantly." },
  { icon: CreditCard, title: "Frictionless Payments", desc: "UPI, cards, netbanking or 0% EMI financing. Parents pay one amount, we split & route." },
  { icon: PieChart, title: "Live Analytics", desc: "Collections, outstanding, aging and admission funnels — all in one sharp dashboard." },
  { icon: ShieldCheck, title: "Role-based Access", desc: "Ops, Admin, Finance, Counsellor and Parent — everyone sees exactly what they should." },
];

const STATS = [
  { value: "₹4.2Cr+", label: "Fees processed" },
  { value: "0%", label: "EMI financing" },
  { value: "3 min", label: "Avg. checkout" },
  { value: "50k+", label: "Students enrolled" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo className="h-8" />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-brand-blue transition-colors">Features</a>
            <a href="#payments" className="hover:text-brand-blue transition-colors">Payments</a>
            <a href="#how" className="hover:text-brand-blue transition-colors">How it works</a>
            <a href="#audience" className="hover:text-brand-blue transition-colors">{"Who it's for"}</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" data-testid="nav-login">
              <Button variant="ghost" className="font-semibold">Sign in</Button>
            </Link>
            <Link to="/register" data-testid="nav-getstarted">
              <Button className="bg-brand-blue hover:bg-brand-navy text-white rounded-sm font-semibold">
                Get started <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-70" />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.span
              initial="hidden" animate="show" variants={fade}
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-brand-blue bg-brand-tint px-4 py-2 rounded-sm"
            >
              <Zap className="h-3.5 w-3.5" /> The Leap That Defines You
            </motion.span>
            <motion.h1
              initial="hidden" animate="show" custom={1} variants={fade}
              className="font-head mt-6 text-5xl lg:text-6xl font-black tracking-tight text-brand-navy leading-[1.05]"
            >
              Enrollment & fees,{" "}
              <span className="text-brand-blue">reimagined</span> for the next gen.
            </motion.h1>
            <motion.p
              initial="hidden" animate="show" custom={2} variants={fade}
              className="mt-6 text-lg text-muted-foreground max-w-lg"
            >
              BiglypEnroll runs the entire journey — onboarding, fee setup, payments and
              analytics — in one sharp platform built for GenZ students and their parents.
            </motion.p>
            <motion.div
              initial="hidden" animate="show" custom={3} variants={fade}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/register" data-testid="hero-getstarted">
                <Button className="bg-brand-blue hover:bg-brand-navy text-white rounded-sm h-12 px-7 text-base font-semibold hard-shadow-sm">
                  Start enrolling <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login" data-testid="hero-demo">
                <Button variant="outline" className="rounded-sm h-12 px-7 text-base font-semibold border-brand-navy text-brand-navy">
                  View demo
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial="hidden" animate="show" custom={4} variants={fade}
              className="mt-10 grid grid-cols-4 gap-4"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-head text-2xl font-extrabold text-brand-navy">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-sm overflow-hidden border-2 border-brand-navy hard-shadow">
              <img
                src="https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwyfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwc3R1ZGVudHN8ZW58MHx8fHwxNzg2MjE5NDkzfDA&ixlib=rb-4.1.0&q=85"
                alt="Students"
                className="w-full h-[460px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white border-2 border-brand-navy rounded-sm p-4 hard-shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-sm bg-brand-blue flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fees collected today</p>
                  <p className="font-head font-extrabold text-brand-navy text-lg">₹4,26,000</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <span className="text-xs tracking-[0.2em] uppercase font-semibold text-brand-blue">Everything in one place</span>
          <h2 className="font-head mt-4 text-4xl font-black tracking-tight text-brand-navy">
            A platform as ambitious as your institute.
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-sm overflow-hidden">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-white p-8 hover:bg-brand-tint transition-colors group" data-testid={`feature-${i}`}>
                <div className="h-12 w-12 rounded-sm bg-brand-navy flex items-center justify-center group-hover:bg-brand-blue transition-colors">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-head mt-5 text-xl font-bold text-brand-navy">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* New feature sections: payment options, outcomes, platform */}
      <HomeFeatureSections />

      {/* Audience */}
      <section id="audience" className="bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="rounded-sm overflow-hidden border-2 border-white/10">
            <img
              src="https://images.unsplash.com/photo-1513906029980-32d13afe6d8c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzl8MHwxfHNlYXJjaHwxfHxwYXJlbnQlMjBhbmQlMjB0ZWVuJTIwc21pbGluZ3xlbnwwfHx8fDE3ODYyMTk0OTN8MA&ixlib=rb-4.1.0&q=85"
              alt="Parent and teen"
              className="w-full h-[420px] object-cover"
            />
          </div>
          <div>
            <span className="text-xs tracking-[0.2em] uppercase font-semibold text-brand-sky">Built for both sides</span>
            <h2 className="font-head mt-4 text-4xl font-black tracking-tight">
              Students move fast. Parents want clarity. We do both.
            </h2>
            <div className="mt-8 space-y-6">
              {[
                { t: "For students & parents", d: "A crisp mobile-first app to see dues, pay in a tap, or split into 0% EMIs — with instant GST receipts." },
                { t: "For schools & finance teams", d: "Configure fees, publish structures and watch collections, aging and funnels update live." },
              ].map((x) => (
                <div key={x.t} className="flex gap-4">
                  <div className="mt-1 h-6 w-6 shrink-0 rounded-sm bg-brand-blue flex items-center justify-center">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-head font-bold text-lg">{x.t}</p>
                    <p className="text-white/60 text-sm mt-1">{x.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/register" className="inline-block mt-10" data-testid="audience-cta">
              <Button className="bg-brand-blue hover:bg-white hover:text-brand-navy text-white rounded-sm h-12 px-7 font-semibold">
                Create your account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-6 py-24">
        <span className="text-xs tracking-[0.2em] uppercase font-semibold text-brand-blue">How it works</span>
        <h2 className="font-head mt-4 text-4xl font-black tracking-tight text-brand-navy">Three steps to go live.</h2>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {[
            { n: "01", t: "Onboard your school", d: "Add campuses, courses and your team through the setup wizard." },
            { n: "02", t: "Configure fees", d: "Build fee heads by hand or drop in an Excel — AI does the rest." },
            { n: "03", t: "Collect & analyse", d: "Parents pay online, you track every rupee across accounts." },
          ].map((s) => (
            <div key={s.n} className="border-2 border-brand-navy rounded-sm p-8 hard-shadow-sm bg-white">
              <p className="font-head text-5xl font-black text-brand-tint">{s.n}</p>
              <h3 className="font-head mt-4 text-xl font-bold text-brand-navy">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo className="h-7" />
          <p className="text-sm text-muted-foreground">The Leap That Defines You, Shapes Your Career.</p>
          <p className="text-xs text-muted-foreground">© 2026 Biglyp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
