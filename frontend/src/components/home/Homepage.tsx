'use client';

import { useState } from 'react';
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
} from 'lucide-react';

/* ---- Blue palette (white + blue, Gen-Z) ---- */
const BLUE = '#2563EB';
const BLUE_DEEP = '#1D4ED8';
const NAVY = '#0B1B4B';
const SKY = '#3B82F6';
const TINT = '#EFF6FF';

const HERO_IMG = 'https://images.pexels.com/photos/6238120/pexels-photo-6238120.jpeg?auto=compress&cs=tinysrgb&w=1100';
const LEARN_IMG = 'https://images.unsplash.com/photo-1583037825390-a23eee53f6ef?auto=format&fit=crop&q=80&w=900';
const FEE_IMG = 'https://images.pexels.com/photos/5538000/pexels-photo-5538000.jpeg?auto=compress&cs=tinysrgb&w=1000';

const fade = { hidden: { opacity: 0, y: 22 }, show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }) };
const grad = `linear-gradient(135deg, ${SKY}, ${BLUE_DEEP})`;

/* =================== NAV =================== */
function HomeNav() {
  const NAV = [{ label: 'Homepage', href: '/', active: true }, { label: 'BiglypEnroll', href: '/biglypenroll', active: false }];
  return (
    <Box component="header" className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-blue-100">
      <Box className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2"><Logo className="h-7" /></Link>
        <Box component="nav" className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} data-testid={`homenav-${n.label.toLowerCase()}`}
              className={`px-4 py-2 rounded-full text-[13.5px] font-semibold transition-colors ${n.active ? 'text-white' : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'}`}
              style={n.active ? { background: grad } : undefined}>{n.label}</Link>
          ))}
        </Box>
        <Box className="flex items-center gap-2.5">
          <Link href="/login"><Button variant="outline" className="h-9 px-5 rounded-full text-sm font-semibold border-blue-200 text-blue-700 hover:bg-blue-50">Sign in</Button></Link>
          <Box component="a" href="#platform"><Button className="h-9 px-5 rounded-full text-sm font-semibold text-white shadow-lg shadow-blue-600/25" style={{ background: grad }}>Become a partner</Button></Box>
        </Box>
      </Box>
    </Box>
  );
}

/* =================== HERO =================== */
function Hero() {
  return (
    <Box component="section" className="relative overflow-hidden bg-white">
      <Box className="absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-40" style={{ background: 'radial-gradient(circle, #93C5FD, transparent 70%)' }} />
      <Box className="absolute top-40 -left-24 h-80 w-80 rounded-full blur-3xl opacity-40" style={{ background: 'radial-gradient(circle, #BFDBFE, transparent 70%)' }} />
      <Box className="relative max-w-7xl mx-auto px-5 pt-14 pb-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <motion.div initial="hidden" animate="show" variants={fade}>
          <Box component="span" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest" style={{ background: TINT, color: BLUE_DEEP }}>
            <Sparkles className="h-3.5 w-3.5" /> Biglyp · Student Success Platform
          </Box>
          <motion.h1 custom={1} variants={fade} className="font-head mt-5 text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.05]" style={{ color: NAVY }}>
            Building{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(120deg, ${SKY}, ${BLUE_DEEP})` }}>Future-Ready</span>{' '}Students
          </motion.h1>
          <motion.p custom={2} variants={fade} className="mt-2 font-head text-xl md:text-2xl font-bold" style={{ color: BLUE }}>
            from Early Career Discovery to the Right Course & University
          </motion.p>
          <motion.p custom={3} variants={fade} className="mt-4 text-[16px] max-w-xl leading-relaxed text-slate-600">
            From career discovery to university enrollment — we provide end-to-end support with cutting-edge technology and expert guidance.
          </motion.p>
          <motion.div custom={4} variants={fade} className="mt-8 flex flex-wrap gap-3">
            <Box component="a" href="#journey"><Button className="h-12 px-6 rounded-full font-semibold text-sm text-white shadow-xl shadow-blue-600/25" style={{ background: grad }}>Take Assessment <ArrowRight className="h-4 w-4 ml-2" /></Button></Box>
            <Box component="a" href="#platform"><Button variant="outline" className="h-12 px-6 rounded-full font-semibold text-sm border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"><PlayCircle className="h-4 w-4 mr-2" /> Explore Platform</Button></Box>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
          <Box className="relative rounded-[28px] overflow-hidden shadow-2xl aspect-[4/3]" style={{ boxShadow: '0 40px 80px -30px rgba(37,99,235,0.45)' }}>
            <Box component="img" src={HERO_IMG} alt="Future-ready students" className="w-full h-full object-cover" />
            <Box className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(11,27,75,0.35))' }} />
          </Box>
          <Box className="hidden sm:flex absolute -left-5 top-10 rounded-2xl bg-white shadow-xl p-3 pr-4 items-center gap-3" style={{ boxShadow: '0 20px 40px -15px rgba(37,99,235,0.3)' }}>
            <Box className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: TINT, color: BLUE_DEEP }}><Brain className="h-5 w-5" /></Box>
            <Box><Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-400">AI Psychometrics</Typography><Typography variant="inherit" component="p" className="text-sm font-head font-bold" style={{ color: NAVY }}>60+ traits mapped</Typography></Box>
          </Box>
          <Box className="hidden sm:flex absolute -right-4 bottom-8 rounded-2xl bg-white shadow-xl p-3 pr-4 items-center gap-3" style={{ boxShadow: '0 20px 40px -15px rgba(37,99,235,0.3)' }}>
            <Box className="h-10 w-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600"><Globe className="h-5 w-5" /></Box>
            <Box><Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Study abroad</Typography><Typography variant="inherit" component="p" className="text-sm font-head font-bold" style={{ color: NAVY }}>42 countries</Typography></Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}

/* =================== STATS (with numbers) =================== */
const STATS = [
  { icon: Globe, value: '42+', label: 'Countries', color: SKY },
  { icon: Building2, value: '1,200+', label: 'Partner Universities', color: '#7C3AED' },
  { icon: Award, value: '2,50,000+', label: 'Career Programs', color: '#F59E0B' },
];
function Stats() {
  return (
    <Box component="section" className="bg-white">
      <Box className="max-w-6xl mx-auto px-5 -mt-2 pb-16">
        <Box className="rounded-3xl border border-blue-100 shadow-[0_20px_50px_-30px_rgba(37,99,235,0.4)] px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <Box key={s.label} className="flex items-center gap-4 justify-center sm:justify-start">
                <Box className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: s.color + '18', color: s.color }}><Icon className="h-6 w-6" /></Box>
                <Box><Typography variant="inherit" component="p" className="font-head text-2xl font-black" style={{ color: NAVY }}>{s.value}</Typography><Typography variant="inherit" component="p" className="text-[12px] font-medium text-slate-500">{s.label}</Typography></Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

/* =================== TABBED FEATURE SECTION (compact + aligned) =================== */
function TabbedSection({ id, eyebrow, title, subtitle, tabs, footer, bg }: any) {
  const [active, setActive] = useState(0);
  const cur = tabs[active];
  const CurIcon = cur.icon;
  return (
    <Box component="section" id={id} className="py-20" style={bg ? { background: bg } : undefined}>
      <Box className="max-w-7xl mx-auto px-5">
        <Box className="text-center max-w-3xl mx-auto">
          {eyebrow && (
            <Box component="span" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest bg-white" style={{ color: BLUE_DEEP, border: '1px solid #DBEAFE' }}>
              <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
            </Box>
          )}
          <Typography variant="inherit" component="h2" className="font-head mt-4 text-3xl md:text-4xl font-black tracking-tight leading-tight" style={{ color: NAVY }}>{title}</Typography>
          <Typography variant="inherit" component="p" className="mt-4 text-[15px] text-slate-600">{subtitle}</Typography>
        </Box>

        <Box className="mt-10 grid lg:grid-cols-[300px_1fr] gap-6 items-stretch">
          {/* Tab list */}
          <Box className="flex lg:flex-col gap-2 overflow-x-auto pb-1">
            {tabs.map((t: any, i: number) => {
              const Icon = t.icon;
              const on = i === active;
              return (
                <Box component="button" key={t.label} onClick={() => setActive(i)} data-testid={`tab-${id}-${i}`}
                  className={`shrink-0 lg:w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl text-[13.5px] font-semibold transition-all border ${on ? 'text-white border-transparent shadow-lg shadow-blue-600/20' : 'bg-white text-slate-600 border-blue-100 hover:border-blue-300'}`}
                  style={on ? { background: grad } : undefined}>
                  <Box className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: on ? 'rgba(255,255,255,0.2)' : TINT, color: on ? '#fff' : BLUE_DEEP }}><Icon className="h-4 w-4" /></Box>
                  {t.label}
                </Box>
              );
            })}
          </Box>

          {/* Active card */}
          <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="rounded-3xl bg-white border border-blue-100 overflow-hidden shadow-[0_24px_60px_-30px_rgba(37,99,235,0.4)] grid md:grid-cols-2 items-stretch">
            <Box className="p-6 md:p-8 flex flex-col">
              <Box className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: TINT, color: BLUE_DEEP }}><CurIcon className="h-6 w-6" /></Box>
              <Typography variant="inherit" component="h3" className="font-head text-2xl font-black mt-4" style={{ color: NAVY }}>{cur.cardTitle}</Typography>
              {cur.desc.map((d: string, k: number) => (
                <Typography key={k} variant="inherit" component="p" className="mt-2.5 text-[13.5px] leading-relaxed text-slate-600">{d}</Typography>
              ))}
              <Box component="ul" className="mt-4 grid gap-2">
                {cur.points?.map((p: string) => (
                  <Box component="li" key={p} className="flex items-start gap-2 text-[13px] text-slate-700">
                    <Box className="h-4 w-4 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ background: TINT, color: BLUE_DEEP }}><Check className="h-3 w-3" /></Box>{p}
                  </Box>
                ))}
              </Box>
              <Box className="mt-auto pt-6 flex flex-wrap gap-3">
                <Button className="h-11 px-5 rounded-full font-semibold text-sm text-white shadow-lg shadow-blue-600/20" style={{ background: grad }}>{cur.primary} <ArrowRight className="h-4 w-4 ml-2" /></Button>
                {cur.secondary && (<Button variant="outline" className="h-11 px-5 rounded-full font-semibold text-sm border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent">{cur.secondary}</Button>)}
              </Box>
            </Box>
            <Box className="relative min-h-[340px] hidden md:block">
              <Box component="img" src={cur.img} alt={cur.cardTitle} className="absolute inset-0 w-full h-full object-cover" />
              <Box className="absolute inset-0" style={{ background: 'linear-gradient(160deg, transparent 55%, rgba(11,27,75,0.28))' }} />
            </Box>
          </motion.div>
        </Box>

        {footer && (
          <Box className="mt-10 text-center">
            <Typography variant="inherit" component="p" className="text-[14px] text-slate-600">{footer.text}</Typography>
            <Box className="mt-4"><Button className="h-11 px-7 rounded-full font-semibold text-sm text-white shadow-lg shadow-blue-600/20" style={{ background: grad }}>{footer.cta}</Button></Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* =================== PRODUCT SECTION (one per engine, alternating + dark) =================== */
function ProductSection({ theme = 'light', reverse = false, index, icon, tag, title, tagline, desc, points, stats, img, href, accent }: any) {
  const Icon = icon;
  const dark = theme === 'dark';
  const bg = dark ? `linear-gradient(150deg, ${NAVY} 0%, ${BLUE_DEEP} 100%)` : theme === 'tint' ? TINT : '#ffffff';
  const titleColor = dark ? '#fff' : NAVY;
  const bodyColor = dark ? 'rgba(255,255,255,0.82)' : '#475569';
  const chipBg = dark ? 'rgba(255,255,255,0.12)' : TINT;
  const chipText = dark ? '#fff' : BLUE_DEEP;
  return (
    <Box component="section" className="py-20 relative overflow-hidden" style={{ background: bg }}>
      {dark && <Box className="absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #3B82F6, transparent 70%)' }} />}
      <Box className="relative max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-12 items-center">
        {/* Media */}
        <Box className={`relative ${reverse ? 'lg:order-2' : ''}`}>
          <Box className="relative rounded-[26px] overflow-hidden shadow-2xl aspect-[5/4]" style={{ boxShadow: dark ? '0 40px 80px -30px rgba(0,0,0,0.6)' : '0 40px 80px -34px rgba(37,99,235,0.4)' }}>
            <Box component="img" src={img} alt={title} className="w-full h-full object-cover" />
            <Box className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(11,27,75,0.4))' }} />
          </Box>
          {/* Floating stats strip */}
          <Box className="absolute -bottom-6 left-4 right-4 rounded-2xl bg-white shadow-xl px-5 py-3 grid grid-cols-3 gap-2" style={{ boxShadow: '0 24px 48px -20px rgba(11,27,75,0.35)' }}>
            {stats.map((s: any) => (
              <Box key={s.l} className="text-center">
                <Typography variant="inherit" component="p" className="font-head font-black text-lg" style={{ color: accent }}>{s.v}</Typography>
                <Typography variant="inherit" component="p" className="text-[10.5px] font-medium text-slate-500 leading-tight">{s.l}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Copy */}
        <Box className={reverse ? 'lg:order-1' : ''}>
          <Box className="flex items-center gap-3">
            <Box className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: dark ? 'rgba(255,255,255,0.14)' : accent + '16', color: dark ? '#fff' : accent }}><Icon className="h-6 w-6" /></Box>
            <Box component="span" className="text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1" style={{ background: chipBg, color: chipText }}>{tag}</Box>
            <Box component="span" className="ml-auto text-[11px] font-bold" style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#94A3B8' }}>0{index} / 03</Box>
          </Box>
          <Typography variant="inherit" component="h2" className="font-head mt-5 text-3xl md:text-4xl font-black tracking-tight leading-tight" style={{ color: titleColor }}>{title}</Typography>
          <Typography variant="inherit" component="p" className="mt-1.5 font-head text-lg font-bold" style={{ color: dark ? '#93C5FD' : accent }}>{tagline}</Typography>
          <Typography variant="inherit" component="p" className="mt-4 text-[14.5px] leading-relaxed" style={{ color: bodyColor }}>{desc}</Typography>
          <Box component="ul" className="mt-6 grid sm:grid-cols-2 gap-2.5">
            {points.map((p: string) => (
              <Box component="li" key={p} className="flex items-start gap-2 text-[13px]" style={{ color: dark ? 'rgba(255,255,255,0.9)' : '#334155' }}>
                <Box className="h-4 w-4 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ background: dark ? 'rgba(255,255,255,0.16)' : accent + '18', color: dark ? '#fff' : accent }}><Check className="h-3 w-3" /></Box>{p}
              </Box>
            ))}
          </Box>
          <Box className="mt-7">
            <Link href={href}>
              <Button className="h-11 px-6 rounded-full font-semibold text-sm text-white shadow-lg" style={{ background: dark ? '#fff' : grad, color: dark ? NAVY : '#fff', boxShadow: '0 10px 30px -8px rgba(37,99,235,0.4)' }}>
                Explore {title} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* =================== DARK CTA BAND =================== */
function DarkCta() {
  return (
    <Box component="section" className="relative overflow-hidden" style={{ background: `linear-gradient(120deg, ${NAVY}, ${BLUE_DEEP})` }}>
      <Box className="absolute -top-20 -left-16 h-72 w-72 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #3B82F6, transparent 70%)' }} />
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
  { name: 'Saransh Waghela', role: 'Student', tag: 'DiscoverU', color: SKY, text: 'This assessment was very helpful to identify and acknowledge my career goals, and gave insight about my weakness and strengths. I really liked the way everything was so organized and direct. Everything written in the report — about my strengths and weaknesses — was exactly the obstacles I was facing to organize, plan, and simplify my goals.' },
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
              className="rounded-3xl bg-white border border-blue-100 p-6 shadow-[0_20px_50px_-34px_rgba(37,99,235,0.45)] flex flex-col">
              <Box className="flex items-center justify-between">
                <Quote className="h-8 w-8" style={{ color: r.color, opacity: 0.35 }} />
                <Box component="span" className="text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1" style={{ background: r.color + '16', color: r.color }}>{r.tag}</Box>
              </Box>
              <Box className="flex gap-0.5 mt-3">{[0, 1, 2, 3, 4].map((s) => <Star key={s} className="h-4 w-4" style={{ color: '#F59E0B', fill: '#F59E0B' }} />)}</Box>
              <Typography variant="inherit" component="p" className="mt-3 text-[13.5px] leading-relaxed text-slate-600 flex-1">{r.text}</Typography>
              <Box className="mt-5 flex items-center gap-3 pt-4 border-t border-blue-50">
                <Box className="h-11 w-11 rounded-full flex items-center justify-center font-head font-black text-white" style={{ background: `linear-gradient(135deg, ${r.color}, ${BLUE_DEEP})` }}>{r.name[0]}</Box>
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
              <Box key={f.q} className="rounded-2xl border border-blue-100 bg-white overflow-hidden transition-shadow" style={on ? { boxShadow: '0 20px 40px -28px rgba(37,99,235,0.4)' } : undefined}>
                <Box component="button" onClick={() => setOpen(on ? null : i)} data-testid={`faq-${i}`} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                  <Typography variant="inherit" component="span" className="font-head font-bold text-[15px]" style={{ color: NAVY }}>{f.q}</Typography>
                  <Box className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-transform" style={{ background: TINT, color: BLUE_DEEP, transform: on ? 'rotate(180deg)' : 'none' }}><ChevronDown className="h-4 w-4" /></Box>
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
    <Box component="footer" style={{ background: `linear-gradient(160deg, ${NAVY}, ${BLUE_DEEP})` }} className="text-white">
      <Box className="max-w-7xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <Box>
          <Logo className="h-7 grayscale invert brightness-200" />
          <Typography variant="inherit" component="p" className="mt-3 text-[13px] text-white/60 leading-relaxed max-w-xs">Building future-ready students — from early career discovery to the right course, university and beyond.</Typography>
          <Box className="mt-5">
            <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-white/70">Subscribe to our newsletter</Typography>
            <Box component="form" className="mt-2 flex items-center gap-2 max-w-sm">
              <Input placeholder="Enter your email address" className="bg-white/10 border-white/15 text-white placeholder:text-white/50 rounded-full h-10 text-sm" />
              <Button type="button" className="h-10 rounded-full px-4 text-sm font-semibold text-white" style={{ background: SKY }}>Subscribe</Button>
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

      {/* Platform anchor + 3 dedicated engine sections */}
      <Box id="platform">
        <ProductSection index={1} theme="light" reverse={false} icon={GraduationCap} accent={BLUE_DEEP}
          tag="For Institutions" title="BiglypEnroll" tagline="The all-in-one OS for modern institutions." href="/biglypenroll" img={LEARN_IMG}
          desc="Run admissions and fee collection from a single console — bridging career readiness and payments into one operating system trusted by schools, colleges and skilling institutes."
          points={['Admissions & enrolment, end-to-end', 'Career-readiness + fee-collection engines', 'Plug into your ERP or launch a white-labeled portal', 'ISO 27001 · DPDP · RBI-regulated']}
          stats={[{ v: '6,500+', l: 'Institutions' }, { v: '50 Lakh+', l: 'Students' }, { v: '₹4,200 Cr+', l: 'Fees processed' }]} />

        <ProductSection index={2} theme="dark" reverse={true} icon={Brain} accent="#93C5FD"
          tag="For Students" title="Biglyp Career Hub" tagline="Discover the right career. Then the right university." href="/career-hub" img={HERO_IMG}
          desc="AI-driven 4-dimensional psychometrics paired with a live index of 2,50,000+ courses across 42 countries — built for counsellors, loved by students."
          points={['4-D psychometrics: Aptitude · Interest · EQ · Personality', '2,50,000+ courses across 42 countries', 'Personalised career & university matches', 'Counsellor dashboards, workflows & reports']}
          stats={[{ v: '2.5L+', l: 'Courses' }, { v: '42', l: 'Countries' }, { v: '60+', l: 'Traits mapped' }]} />

        <ProductSection index={3} theme="tint" reverse={false} icon={Wallet} accent="#0EA5E9"
          tag="For Parents" title="Biglyp Fee Collection" tagline="Fees upfront. EMIs for parents. Reconciled live." href="/fee-collection" img={FEE_IMG}
          desc="India's most advanced fee payment platform for schools, colleges and skilling institutes — 8+ payment rails, 0% EMIs for parents and live analytics, with schools paid 100% upfront."
          points={['8+ payment rails (UPI, cards, netbanking, NACH…)', '0% EMIs for parents · 100% upfront to schools', 'Automated reconciliation & live dashboards', 'RBI-regulated NBFC lending partners']}
          stats={[{ v: '8+', l: 'Payment rails' }, { v: '0%', l: 'EMI interest' }, { v: '100%', l: 'Upfront' }]} />
      </Box>

      <DarkCta />
      <Testimonials />
      <Faq />
      <HomeFooter />
    </Box>
  );
}
