'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ParentLayout } from '@/components/ParentLayout';
import { Button } from '@/components/ui/button';
import {
  Brain, Eye, Sparkles, BookOpen, Play,
} from 'lucide-react';

const INDIGO = '#5548D1';
const NAVY = '#1E1B4B';

const CATEGORIES = [
  { icon: Brain, label: 'Linguistic & Logical Intelligence', tint: '#ECFDF5', color: '#10B981', ring: '#C7F0DD' },
  { icon: Eye, label: 'Visual, Kinesthetic & Musical Intelligence', tint: '#FFFBEB', color: '#F59E0B', ring: '#FBEBC2' },
  { icon: Sparkles, label: 'Emotional Strength & Motivation', tint: '#EEF0FF', color: INDIGO, ring: '#DCDFFA' },
  { icon: BookOpen, label: 'Learning Style Preferences', tint: '#FEF2F2', color: '#EF4444', ring: '#FBDADA' },
];

function CategoryTile({ icon: Icon, label, tint, color, ring }: any) {
  return (
    <Box className="rounded-xl px-3 py-2.5 border flex items-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-14px_rgba(15,26,91,0.35)]"
      style={{ background: tint, borderColor: ring }}>
      <Box className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shrink-0" style={{ color }}>
        <Icon className="h-4 w-4" />
      </Box>
      <Typography variant="inherit" component="p" className="text-[12.5px] font-bold leading-snug" style={{ color: NAVY }}>{label}</Typography>
    </Box>
  );
}

function DetailRow({ label, value }: any) {
  return (
    <Box className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-b-0">
      <Typography variant="inherit" component="p" className="text-[12.5px]" style={{ color: '#64748B' }}>{label}</Typography>
      <Typography variant="inherit" component="p" className="font-head text-[13px] font-black" style={{ color: NAVY }}>{value}</Typography>
    </Box>
  );
}

export default function PsychometryAssessment() {
  return (
    <ParentLayout>
      <Box className="max-w-6xl mx-auto" data-testid="psychometry-assessment">
        {/* Page header — compact, per design */}
        <Box className="reveal">
          <Typography variant="inherit" component="h1" className="font-head text-[24px] md:text-[27px] font-black tracking-tight" style={{ color: NAVY }}>
            Psychometric Assessment
          </Typography>
          <Typography variant="inherit" component="p" className="text-[12.5px] mt-0.5" style={{ color: '#64748B' }}>
            Explore your strengths
          </Typography>
        </Box>

        <Box className="mt-5 grid lg:grid-cols-[1fr_300px] gap-5 items-start">
          {/* Main card */}
          <Box className="rounded-2xl border border-border/70 bg-white soft-shadow p-5 md:p-6 reveal-1" data-testid="assessment-card">
            {/* DiscoverU header row */}
            <Box className="flex items-center gap-2.5 flex-wrap">
              <Box component="span" className="text-[26px] leading-none" aria-hidden>🪴</Box>
              <Typography variant="inherit" component="h2" className="font-head text-[21px] font-black tracking-tight" style={{ color: NAVY }}>DiscoverU</Typography>
              <Box component="span" className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white"
                style={{ background: '#10B981' }}>
                Classes 6–8
              </Box>
            </Box>
            <Typography variant="inherit" component="p" className="mt-1 text-[12px]" style={{ color: '#94A3B8' }}>
              Learning · Strengths · Self-Awareness
            </Typography>

            <Typography variant="inherit" component="h3" className="mt-4 font-head text-[16px] font-black" style={{ color: NAVY }}>
              Your Psychometric assessments
            </Typography>
            <Typography variant="inherit" component="p" className="mt-1 text-[13px] leading-relaxed" style={{ color: '#475569' }}>
              Discover how you learn, think, feel and work with others – without any career pressure.
            </Typography>

            <Typography variant="inherit" component="h4" className="mt-4 font-head text-[13.5px] font-black" style={{ color: NAVY }}>
              Assessment Categories:
            </Typography>
            <Box className="mt-2.5 grid md:grid-cols-2 gap-2.5">
              {CATEGORIES.map((c) => <CategoryTile key={c.label} {...c} />)}
            </Box>

            {/* Actions */}
            <Box className="mt-5 flex flex-wrap gap-2.5 items-center">
              <Button data-testid="start-attempt"
                className="h-10 px-5 rounded-full font-bold text-white text-[13px] flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_10px_22px_-10px_rgba(16,185,129,0.7)]"
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                <Play className="h-3.5 w-3.5" fill="#fff" /> Start Attempt 12
              </Button>
              <Button data-testid="view-report"
                className="h-10 px-5 rounded-full font-bold text-white text-[13px] transition-all duration-300 hover:-translate-y-0.5 shadow-[0_10px_22px_-10px_rgba(85,72,209,0.7)]"
                style={{ background: 'linear-gradient(135deg, #5548D1 0%, #6D28D9 100%)' }}>
                Report
              </Button>
            </Box>

            <Typography variant="inherit" component="p" className="mt-4 text-[11px] italic" style={{ color: '#F59E0B' }}>
              Disclaimer: This assessment is for educational guidance and self awareness only. It is not a diagnostic or clinical tool.
            </Typography>
          </Box>

          {/* Right column */}
          <Box className="space-y-4 lg:sticky lg:top-24 reveal-2">
            {/* Assessment details */}
            <Box className="rounded-2xl bg-white border border-border/70 soft-shadow px-5 py-4" data-testid="assessment-details">
              <Typography variant="inherit" component="h3" className="font-head text-[15px] font-black" style={{ color: NAVY }}>Assessment details</Typography>
              <Box className="mt-1.5">
                <DetailRow label="Questions" value="80" />
                <DetailRow label="Categories" value="4" />
                <DetailRow label="Duration" value="~ 15 minutes" />
                <DetailRow label="Attempts" value="2/10 Available" />
              </Box>
            </Box>

            {/* Instructions */}
            <Box className="rounded-2xl bg-white border border-border/70 soft-shadow px-5 py-4" data-testid="assessment-instructions">
              <Typography variant="inherit" component="h3" className="font-head text-[15px] font-black" style={{ color: NAVY }}>Instructions</Typography>
              <Box component="ul" className="mt-2.5 space-y-2 text-[12.5px] leading-snug" style={{ color: '#475569' }}>
                {[
                  'There are no Right or Wrong answers.',
                  'Answer honestly based on what feels true for you.',
                  'Take your time and stay relaxed.',
                  'You can take the assessment again.',
                  'Be curious and enjoy your process.',
                ].map((t) => (
                  <Box component="li" key={t}>{t}</Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ParentLayout>
  );
}
