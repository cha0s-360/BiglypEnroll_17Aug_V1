'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ParentLayout } from '@/components/ParentLayout';
import { Button } from '@/components/ui/button';
import {
  Brain, Eye, Sparkles, BookOpen, ArrowRight, Play, FileText, Clock, ListChecks, RefreshCw,
  ShieldCheck, Info, Zap,
} from 'lucide-react';

const INDIGO = '#5548D1';
const VIOLET = '#7C3AED';
const NAVY = '#1E1B4B';
const YELLOW = '#FBBF24';

const CATEGORIES = [
  { icon: Brain, label: 'Linguistic & Logical Intelligence', tint: '#ECFDF5', color: '#10B981', ring: '#A7F3D0', chip: 'Verbal · Numeric' },
  { icon: Eye, label: 'Visual, Kinesthetic & Musical Intelligence', tint: '#FFFBEB', color: '#F59E0B', ring: '#FDE68A', chip: 'Spatial · Rhythm' },
  { icon: Sparkles, label: 'Emotional Strength & Motivation', tint: '#EEF0FF', color: INDIGO, ring: '#C7D2FE', chip: 'Empathy · Drive' },
  { icon: BookOpen, label: 'Learning Style Preferences', tint: '#FEF2F2', color: '#EF4444', ring: '#FECACA', chip: 'How you learn' },
];

function CategoryTile({ icon: Icon, label, tint, color, ring, chip }: any) {
  return (
    <Box className="group rounded-2xl p-4 border-2 flex items-start gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer" style={{ background: tint, borderColor: ring }}>
      <Box className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: '#fff', color }}>
        <Icon className="h-5 w-5" />
      </Box>
      <Box className="min-w-0 flex-1">
        <Typography variant="inherit" component="p" className="text-[13.5px] font-bold leading-snug" style={{ color: NAVY }}>{label}</Typography>
        <Box component="span" className="mt-1.5 inline-flex items-center rounded-full text-[10.5px] font-semibold px-2 py-0.5" style={{ background: '#ffffff', color }}>
          {chip}
        </Box>
      </Box>
      <ArrowRight className="h-4 w-4 shrink-0 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ color }} />
    </Box>
  );
}

function DetailRow({ icon: Icon, label, value, accent }: any) {
  return (
    <Box className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-b-0">
      <Box className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: accent + '18', color: accent }}>
        <Icon className="h-4 w-4" />
      </Box>
      <Box className="min-w-0 flex-1">
        <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold" style={{ color: '#94A3B8' }}>{label}</Typography>
        <Typography variant="inherit" component="p" className="font-head text-[14.5px] font-black" style={{ color: NAVY }}>{value}</Typography>
      </Box>
    </Box>
  );
}

export default function PsychometryAssessment() {
  return (
    <ParentLayout>
      <Box className="max-w-6xl mx-auto" data-testid="psychometry-assessment">
        {/* Page header */}
        <Box className="flex flex-wrap items-start justify-between gap-3">
          <Box>
            <Box className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-widest mb-2" style={{ background: '#EEF0FF', color: INDIGO }}>
              <Brain className="h-3 w-3" /> Assessment · DiscoverU
            </Box>
            <Typography variant="inherit" component="h1" className="font-head text-2xl md:text-3xl font-black tracking-tight" style={{ color: NAVY }}>
              Psychometric Assessment
            </Typography>
            <Typography variant="inherit" component="p" className="text-[13.5px] mt-1" style={{ color: '#64748B' }}>
              Explore your strengths — one honest answer at a time.
            </Typography>
          </Box>
          <Box className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11.5px] font-bold" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <Zap className="h-3.5 w-3.5" fill="#F59E0B" strokeWidth={0} /> ~15 min · 4 categories
          </Box>
        </Box>

        <Box className="mt-6 grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* Main card */}
          <Box className="rounded-3xl border border-indigo-100 overflow-hidden bg-white shadow-[0_30px_70px_-30px_rgba(85,72,209,0.4)]" data-testid="assessment-card">
            {/* Vibrant banner */}
            <Box className="relative p-6 md:p-7 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${INDIGO} 0%, ${VIOLET} 60%, #C026D3 100%)` }}>
              <Box className="absolute -top-16 -right-14 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
              <Box className="absolute -bottom-14 -left-10 h-40 w-40 rounded-full opacity-40 blur-2xl" style={{ background: YELLOW }} />
              <Box className="relative flex items-center gap-4 flex-wrap">
                <Box className="h-16 w-16 md:h-[72px] md:w-[72px] rounded-3xl flex items-center justify-center shrink-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)' }}>
                  <Box component="span" className="text-3xl md:text-4xl" aria-hidden>🪴</Box>
                </Box>
                <Box className="min-w-0 flex-1">
                  <Box className="flex items-center gap-2 flex-wrap">
                    <Typography variant="inherit" component="h2" className="font-head text-2xl md:text-3xl font-black tracking-tight">DiscoverU</Typography>
                    <Box component="span" className="inline-flex items-center rounded-full bg-emerald-400 text-emerald-950 px-2.5 py-1 text-[11px] font-black uppercase tracking-widest">Classes 6–8</Box>
                  </Box>
                  <Box className="mt-2 flex flex-wrap gap-1.5">
                    {['Learning', 'Strengths', 'Self-Awareness'].map((t) => (
                      <Box key={t} component="span" className="inline-flex items-center rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 text-[11px] font-semibold">{t}</Box>
                    ))}
                  </Box>
                </Box>
                <Box className="hidden md:block text-right shrink-0">
                  <Typography variant="inherit" component="p" className="text-[10.5px] uppercase tracking-widest font-bold text-white/70">Attempts left</Typography>
                  <Typography variant="inherit" component="p" className="font-head text-2xl font-black">8<Box component="span" className="text-sm font-bold text-white/70">/10</Box></Typography>
                </Box>
              </Box>
            </Box>

            {/* Body */}
            <Box className="p-6 md:p-7">
              <Typography variant="inherit" component="h3" className="font-head text-lg md:text-xl font-black" style={{ color: NAVY }}>
                Your Psychometric assessments <Box component="span" aria-hidden>🌱</Box>
              </Typography>
              <Typography variant="inherit" component="p" className="mt-1 text-[13.5px] leading-relaxed" style={{ color: '#475569' }}>
                Discover how you learn, think, feel and work with others — without any career pressure.
              </Typography>

              <Box className="mt-6 flex items-center justify-between">
                <Typography variant="inherit" component="h4" className="font-head text-[14.5px] font-black" style={{ color: NAVY }}>Assessment Categories</Typography>
                <Box component="span" className="text-[11px] font-bold" style={{ color: '#94A3B8' }}>4 sections · 80 questions</Box>
              </Box>
              <Box className="mt-3 grid md:grid-cols-2 gap-3">
                {CATEGORIES.map((c) => <CategoryTile key={c.label} {...c} />)}
              </Box>

              <Box className="mt-7 flex flex-wrap gap-3 items-center">
                <Button data-testid="start-attempt" className="h-12 px-6 rounded-2xl font-black text-white text-[13.5px] shadow-lg shadow-emerald-500/30 flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                  <Play className="h-4 w-4" fill="#fff" /> Start Attempt 12
                </Button>
                <Button data-testid="view-report" variant="outline" className="h-12 px-6 rounded-2xl font-bold text-[13.5px] border-2 bg-white flex items-center gap-2" style={{ borderColor: INDIGO, color: INDIGO }}>
                  <FileText className="h-4 w-4" /> View Report
                </Button>
                <Box className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: '#64748B' }}>
                  <Clock className="h-3.5 w-3.5" /> Best if done in one sitting
                </Box>
              </Box>

              <Box className="mt-5 rounded-2xl p-3 flex items-start gap-2.5" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#B45309' }} />
                <Typography variant="inherit" component="p" className="text-[12px] leading-relaxed" style={{ color: '#92400E' }}>
                  <b>Disclaimer:</b> This assessment is for educational guidance and self awareness only. It is not a diagnostic or clinical tool.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right column */}
          <Box className="space-y-5 lg:sticky lg:top-24">
            {/* Assessment details */}
            <Box className="rounded-3xl bg-white border border-indigo-100 overflow-hidden shadow-[0_24px_60px_-30px_rgba(85,72,209,0.35)]" data-testid="assessment-details">
              <Box className="px-5 pt-5 pb-3 flex items-center justify-between" style={{ background: 'linear-gradient(160deg, #EEF0FF 0%, #ffffff 90%)' }}>
                <Typography variant="inherit" component="h3" className="font-head text-base font-black" style={{ color: NAVY }}>Assessment details</Typography>
                <Box className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: '#ffffff', color: INDIGO }}>
                  <ShieldCheck className="h-4 w-4" />
                </Box>
              </Box>
              <Box className="px-5 pb-4">
                <DetailRow icon={ListChecks} label="Questions" value="80" accent={INDIGO} />
                <DetailRow icon={Sparkles} label="Categories" value="4" accent="#DB2777" />
                <DetailRow icon={Clock} label="Duration" value="~ 15 minutes" accent="#F59E0B" />
                <DetailRow icon={RefreshCw} label="Attempts" value="2 / 10 Available" accent="#10B981" />
              </Box>
            </Box>

            {/* Instructions */}
            <Box className="rounded-3xl bg-white border border-indigo-100 p-5 shadow-[0_24px_60px_-30px_rgba(85,72,209,0.35)]" data-testid="assessment-instructions">
              <Box className="flex items-center gap-2">
                <Box className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: '#F3E8FF', color: VIOLET }}>
                  <Info className="h-4 w-4" />
                </Box>
                <Typography variant="inherit" component="h3" className="font-head text-base font-black" style={{ color: NAVY }}>Instructions</Typography>
              </Box>
              <Box component="ul" className="mt-3 space-y-2 text-[12.5px]" style={{ color: '#475569' }}>
                {[
                  'There are no Right or Wrong answers.',
                  'Answer honestly based on what feels true for you.',
                  'Take your time and stay relaxed.',
                  'You can take the assessment again.',
                  'Be curious and enjoy your process.',
                ].map((t) => (
                  <Box component="li" key={t} className="flex items-start gap-2">
                    <Box className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ background: VIOLET }} />
                    <Box component="span">{t}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ParentLayout>
  );
}
