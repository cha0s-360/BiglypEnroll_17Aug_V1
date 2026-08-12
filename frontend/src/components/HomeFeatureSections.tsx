'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion } from "framer-motion";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  RefreshCw, QrCode, BadgePercent, Bell, CalendarClock, Check,
  LayoutGrid, MessageSquare, Activity, Waypoints, Search, ChevronRight, Sparkles,
} from "lucide-react";

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

/* ---------- mock panels for the payment cards ---------- */
function MockHeader({ brand, icon: Icon }) {
  return (
    <Box className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
      <Box className="flex items-center gap-2">
        <Box className="h-6 w-6 rounded-full bg-brand-blue/15 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-brand-blue" />
        </Box>
        <Box component="span" className="font-head font-extrabold tracking-wide text-brand-navy text-sm">{brand}</Box>
      </Box>
      <Box className="flex items-center gap-2 text-slate-300">
        <CalendarClock className="h-4 w-4" />
        <Bell className="h-4 w-4" />
      </Box>
    </Box>
  );
}

function StudentLine({ id }) {
  return (
    <Box className="px-4 py-3 border-b border-slate-100">
      <Typography variant="inherit" component="p" className="text-sm font-bold text-brand-navy">Punith Kumar</Typography>
      <Typography variant="inherit" component="p" className="text-[11px] text-slate-400 mt-0.5">Pragati Institute of Learning · {id} · LKG · CBSE · 2024-25</Typography>
    </Box>
  );
}

function AutoCollectMock() {
  const rows = [
    { l: "Downpayment (1 Apr '25)", a: "₹50,000", s: "Paid" },
    { l: "Instalment 1 (2 May '25)", a: "₹10,000", s: "Paid" },
    { l: "Instalment 2 (15 Jun '25)", a: "₹10,000", s: "Scheduled" },
    { l: "Instalment 3 (31 Jul '25)", a: "₹10,000", s: "Scheduled" },
  ];
  return (
    <Box className="bg-white rounded-lg overflow-hidden shadow-lg">
      <MockHeader brand="FLEX" icon={RefreshCw} />
      <StudentLine id="678987654" />
      <Box className="px-4 py-3">
        <Typography variant="inherit" component="p" className="text-xs font-bold text-brand-navy mb-2">Payment Schedule</Typography>
        <Box className="space-y-2.5">
          {rows.map((r) => (
            <Box key={r.l} className="flex items-center justify-between text-[11px]">
              <Box component="span" className="text-slate-500 flex items-center gap-1.5">
                {r.l}
                <Box component="span" className={`px-1.5 py-0.5 rounded font-semibold ${r.s === "Paid" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>{r.s}</Box>
              </Box>
              <Box component="span" className="font-bold text-brand-navy">{r.a}</Box>
            </Box>
          ))}
        </Box>
        <Typography variant="inherit" component="p" className="text-center text-[11px] text-brand-blue font-semibold mt-3">Show More ⌄</Typography>
      </Box>
    </Box>
  );
}

function InstantlyMock() {
  return (
    <Box className="bg-white rounded-lg overflow-hidden shadow-lg p-5">
      <Box className="flex items-center justify-between">
        <Box component="span" className="font-head font-black text-brand-navy">Scan &amp; pay</Box>
        <Box component="span" className="font-head font-black text-brand-blue">PAY</Box>
      </Box>
      <Box className="mt-4 mx-auto w-32 h-32 grid grid-cols-8 gap-0.5 p-2 border-2 border-brand-navy rounded-md">
        {Array.from({ length: 64 }).map((_, i) => (
          <Box key={i} className={((i * 7 + (i % 5)) % 3 === 0) ? "bg-brand-navy rounded-[1px]" : "bg-transparent"} />
        ))}
      </Box>
      <Typography variant="inherit" component="p" className="text-center text-[11px] text-slate-400 mt-3">Scan the QR with any UPI app</Typography>
      <Box className="mt-4 space-y-2">
        <Typography variant="inherit" component="p" className="text-xs font-bold text-brand-navy">Select payment method</Typography>
        {["UPI / Google Pay", "Debit / Credit Card", "Net Banking"].map((m) => (
          <Box key={m} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-[11px] text-slate-600">
            {m} <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function EmiMock() {
  return (
    <Box className="bg-white rounded-lg overflow-hidden shadow-lg">
      <MockHeader brand="CRED" icon={BadgePercent} />
      <StudentLine id="678544" />
      <Box className="px-4 py-3">
        <Typography variant="inherit" component="p" className="text-xs font-bold text-brand-navy mb-2">Loan details</Typography>
        <Box className="flex justify-between text-[11px]"><Box component="span" className="text-slate-500">Loan amount</Box><Box component="span" className="font-bold text-brand-navy">₹1,00,000</Box></Box>
        <Box className="flex justify-between text-[11px] mt-1"><Box component="span" className="text-slate-500">Interest rate</Box><Box component="span" className="font-bold text-brand-navy">₹0</Box></Box>
        <Box className="mt-3 text-center bg-green-50 text-green-700 text-[11px] font-semibold rounded-md py-1.5">Zero Processing Fee</Box>
        <Typography variant="inherit" component="p" className="text-xs font-bold text-brand-navy mt-3 mb-2">EMI details</Typography>
        <Box className="grid grid-cols-3 text-center">
          {[["EMI", "₹10,000"], ["TENURE", "10 Months"], ["START ON", "14 May 2025"]].map(([k, v]) => (
            <Box key={k}>
              <Typography variant="inherit" component="p" className="text-[9px] tracking-wider text-slate-400 font-semibold">{k}</Typography>
              <Typography variant="inherit" component="p" className="text-[11px] font-bold text-brand-navy mt-0.5">{v}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

const PAY_CARDS = [
  { title: "Auto-Collect", desc: "Automate fee collections as customers authorize recurring payments via NACH or UPI.", Mock: AutoCollectMock },
  { title: "Instantly-Collect", desc: "Collect fees instantly via QR codes or payment links.", Mock: InstantlyMock },
  { title: "Offer No-cost EMIs", desc: "Receive full fee upfront while your customers pay in convenient, no-cost EMIs.", Mock: EmiMock },
];

const OUTCOMES = [
  { v: "60%", l: "more on-time fee collection" },
  { v: "90%", l: "reduction in collection efforts" },
  { v: "100%", l: "visibility of fee collections — both past and upcoming" },
];

const MANAGE = [
  { icon: LayoutGrid, t: "Customizable Fee Schedules", d: "Define complex fee structures with ease — set up discounts, late fees, and installment plans tailored to your institute's needs." },
  { icon: MessageSquare, t: "Automated Fee Communication", d: "Keep fee payers informed with automated reminders, due notes, and receipts sent via WhatsApp and email." },
  { icon: Activity, t: "Real-Time Analytics", d: "Get complete visibility into collections, overdue amounts, and upcoming cash flows, all in one dashboard." },
  { icon: Waypoints, t: "Effortless Reconciliation", d: "Match payments with your bank statements seamlessly, saving time and reducing errors." },
];

const DASH_ROWS = [
  ["Punith Kumar", "Shanti Vidya Academy", "Class 10"],
  ["Rohan Verma", "Vivekananda International", "Class 2"],
  ["Sanya Desai", "Gyan Mandir School", "Class 5"],
  ["Karan Nair", "Pragati Institute", "Class 7"],
  ["Meera Gupta", "Kalpana High School", "Class 1"],
  ["Vikram Rao", "Aakash Academy", "Class 10"],
  ["Tara Iyer", "Sankalp School", "Class 9"],
];

export function HomeFeatureSections() {
  return (
    <>
      {/* ============ Tailored payment options ============ */}
      <Box component="section" id="payments" className="max-w-7xl mx-auto px-6 py-24">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} className="max-w-3xl mx-auto text-center">
          <Box component="span" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-brand-blue bg-brand-tint px-4 py-2 rounded-sm">
            <Sparkles className="h-3.5 w-3.5" /> Payment options
          </Box>
          <Typography variant="inherit" component="h2" className="font-head mt-6 text-4xl lg:text-5xl font-black tracking-tight text-brand-navy leading-[1.1]">
            Tailored payment options to your institute&apos;s needs
          </Typography>
          <Typography variant="inherit" component="p" className="mt-4 text-muted-foreground text-lg">
            Empower your customers with multiple ways to pay, ensuring a smooth experience for both institutes and fee payers.
          </Typography>
        </motion.div>

        <Box className="mt-14 grid md:grid-cols-3 gap-6">
          {PAY_CARDS.map((c, i) => {
            const Mock = c.Mock;
            return (
              <motion.div key={c.title} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise}
                className="rounded-2xl p-6 bg-gradient-to-b from-brand-blue to-brand-navy text-white flex flex-col" data-testid={`pay-card-${i}`}>
                <Typography variant="inherit" component="h3" className="font-head text-2xl font-black text-center">{c.title}</Typography>
                <Typography variant="inherit" component="p" className="mt-3 text-center text-white/85 text-sm leading-relaxed min-h-[64px]">{c.desc}</Typography>
                <Box className="mt-5">
                  <Mock />
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </Box>

      {/* ============ Outcomes ============ */}
      <Box component="section" className="bg-brand-tint/50">
        <Box className="max-w-7xl mx-auto px-6 py-20">
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise}
            className="font-head text-4xl lg:text-5xl font-black tracking-tight text-brand-navy text-center">
            Fee collection <Box component="span" className="line-through decoration-4 decoration-amber-400 text-brand-navy/40">delay</Box>{" "}
            <Box component="span" className="text-brand-blue">solved!</Box>
          </motion.h2>
          <Box className="mt-14 grid md:grid-cols-3 gap-10 text-center">
            {OUTCOMES.map((o, i) => (
              <motion.div key={o.v} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} data-testid={`outcome-${i}`}>
                <Typography variant="inherit" component="p" className="font-head text-6xl lg:text-7xl font-black bg-gradient-to-b from-brand-blue to-brand-sky bg-clip-text text-transparent">{o.v}</Typography>
                <Typography variant="inherit" component="p" className="mt-3 text-muted-foreground max-w-[240px] mx-auto">{o.l}</Typography>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ============ Ultimate fee management platform ============ */}
      <Box component="section" className="max-w-7xl mx-auto px-6 py-24">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise} className="max-w-3xl mx-auto text-center">
          <Typography variant="inherit" component="h2" className="font-head text-4xl lg:text-5xl font-black tracking-tight text-brand-navy leading-[1.1]">
            The ultimate fee management platform
          </Typography>
          <Typography variant="inherit" component="p" className="mt-4 text-muted-foreground text-lg inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-blue" /> Manage the entire fee collection lifecycle with ease.
          </Typography>
        </motion.div>

        <Box className="mt-14 grid lg:grid-cols-2 gap-12 items-center">
          {/* feature list */}
          <Box className="space-y-6">
            {MANAGE.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div key={m.t} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise}
                  className="flex gap-4 bg-white border border-border rounded-2xl p-5 hover:border-brand-blue/40 transition-colors" data-testid={`manage-${i}`}>
                  <Box className="h-11 w-11 shrink-0 rounded-xl bg-brand-tint flex items-center justify-center">
                    <Icon className="h-5 w-5 text-brand-blue" />
                  </Box>
                  <Box>
                    <Typography variant="inherit" component="h3" className="font-head text-lg font-bold text-brand-navy">{m.t}</Typography>
                    <Typography variant="inherit" component="p" className="mt-1 text-sm text-muted-foreground leading-relaxed">{m.d}</Typography>
                  </Box>
                </motion.div>
              );
            })}
          </Box>

          {/* dashboard mock */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={rise}
            className="rounded-2xl border border-border bg-white overflow-hidden hard-shadow-sm">
            <Box className="flex">
              <Box className="hidden sm:block w-40 bg-[#F8FAFC] border-r border-border p-3">
                <Typography variant="inherit" component="p" className="font-head font-black text-brand-navy px-2 mb-3">biglyp</Typography>
                {["Students", "Instalments", "Payments", "Settlements", "Links", "Leads", "Loans", "Cashflow", "Overdue"].map((n, idx) => (
                  <Box key={n} className={`px-2 py-1.5 rounded-md text-[11px] font-medium mb-0.5 ${idx === 0 ? "bg-brand-blue text-white" : "text-slate-500"}`}>{n}</Box>
                ))}
              </Box>
              <Box className="flex-1 min-w-0">
                <Box className="flex items-center gap-2 border-b border-border p-3">
                  <Box className="flex-1 flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-400">
                    <Search className="h-3.5 w-3.5" /> {'Search for "Settlement"'}
                  </Box>
                  <Box component="span" className="text-[10px] font-semibold text-brand-blue border border-brand-blue/30 rounded-md px-2 py-1">+ New Student</Box>
                </Box>
                <Box component="table" className="w-full text-[11px]">
                  <Box component="thead">
                    <Box component="tr" className="bg-slate-50 text-slate-400 uppercase tracking-wider">
                      <Box component="th" className="text-left font-semibold px-3 py-2">Student Name</Box>
                      <Box component="th" className="text-left font-semibold px-3 py-2">Institute</Box>
                      <Box component="th" className="text-left font-semibold px-3 py-2">Grade</Box>
                    </Box>
                  </Box>
                  <Box component="tbody" className="divide-y divide-border">
                    {DASH_ROWS.map((r) => (
                      <Box component="tr" key={r[0]}>
                        <Box component="td" className="px-3 py-2 font-semibold text-brand-blue">{r[0]}</Box>
                        <Box component="td" className="px-3 py-2 text-slate-500">{r[1]}</Box>
                        <Box component="td" className="px-3 py-2 text-slate-600">{r[2]}</Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Box>

        <Box className="mt-12 text-center">
          <Link href="/register" data-testid="manage-cta">
            <Button className="bg-brand-blue hover:bg-brand-navy text-white rounded-sm h-12 px-8 text-base font-semibold hard-shadow-sm">
              Get started free <Check className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </Box>
      </Box>
    </>
  );
}
