'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ParentLayout } from '@/components/ParentLayout';
import { Button } from '@/components/ui/button';
import { Brain, Eye, Sparkles, BookOpen } from 'lucide-react';

const INDIGO = '#5548D1';
const NAVY = '#1E1B4B';

function CategoryTile({ icon: Icon, label, tint, color }: any) {
  return (
    <Box className="flex items-center gap-3 rounded-xl px-4 py-3.5 border" style={{ background: tint, borderColor: color + '33' }}>
      <Box className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#ffffff', color }}>
        <Icon className="h-4 w-4" />
      </Box>
      <Typography variant="inherit" component="p" className="text-[13px] font-semibold" style={{ color: NAVY }}>{label}</Typography>
    </Box>
  );
}

function DetailsRow({ label, value }: { label: string; value: string | number }) {
  return (
    <Box className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
      <Typography variant="inherit" component="span" className="text-[13px]" style={{ color: '#64748B' }}>{label}</Typography>
      <Typography variant="inherit" component="span" className="font-head text-[14px] font-black" style={{ color: NAVY }}>{value}</Typography>
    </Box>
  );
}

export default function PsychometryAssessment() {
  return (
    <ParentLayout>
      <Box className="max-w-6xl mx-auto" data-testid="psychometry-assessment">
        <Typography variant="inherit" component="h1" className="font-head text-2xl md:text-3xl font-black tracking-tight" style={{ color: NAVY }}>
          Psychometric Assessment
        </Typography>
        <Typography variant="inherit" component="p" className="text-[13.5px] mt-1" style={{ color: '#64748B' }}>
          Explore your strengths
        </Typography>

        <Box className="mt-6 grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Main card */}
          <Box className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-[0_20px_50px_-30px_rgba(15,26,91,0.25)]" data-testid="assessment-card">
            <Box className="flex items-center gap-3 flex-wrap">
              <Box component="span" className="text-3xl leading-none" aria-hidden>🪴</Box>
              <Typography variant="inherit" component="h2" className="font-head text-xl md:text-2xl font-black tracking-tight" style={{ color: NAVY }}>DiscoverU</Typography>
              <Box component="span" className="inline-flex items-center rounded-full bg-emerald-500 text-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest">Classes 6–8</Box>
            </Box>
            <Typography variant="inherit" component="p" className="mt-2 text-[13px]" style={{ color: '#64748B' }}>
              Learning · Strengths · Self-Awareness
            </Typography>

            <Typography variant="inherit" component="h3" className="font-head mt-6 text-lg font-black" style={{ color: NAVY }}>Your Psychometric assessments</Typography>
            <Typography variant="inherit" component="p" className="mt-1 text-[13.5px]" style={{ color: '#475569' }}>
              Discover how you learn, think, feel and work with others – without any career pressure.
            </Typography>

            <Typography variant="inherit" component="h4" className="font-head mt-5 text-[15px] font-black" style={{ color: NAVY }}>Assessment Categories:</Typography>
            <Box className="mt-3 grid md:grid-cols-2 gap-3">
              <CategoryTile icon={Brain} label="Linguistic & Logical Intelligence" tint="#ECFDF5" color="#10B981" />
              <CategoryTile icon={Eye} label="Visual, Kinesthetic & Musical Intelligence" tint="#FFFBEB" color="#F59E0B" />
              <CategoryTile icon={Sparkles} label="Emotional Strength & Motivation" tint="#EEF0FF" color={INDIGO} />
              <CategoryTile icon={BookOpen} label="Learning Style Preferences" tint="#FEF2F2" color="#EF4444" />
            </Box>

            <Box className="mt-6 flex flex-wrap gap-3">
              <Button data-testid="start-attempt" className="h-11 px-6 rounded-xl font-bold text-white text-[13px] shadow-md" style={{ background: '#10B981' }}>
                Start Attempt 12
              </Button>
              <Button data-testid="view-report" className="h-11 px-6 rounded-xl font-bold text-white text-[13px] shadow-md" style={{ background: INDIGO }}>
                Report
              </Button>
            </Box>

            <Typography variant="inherit" component="p" className="mt-5 text-[11.5px] italic" style={{ color: '#F59E0B' }}>
              Disclaimer: This assessment is for educational guidance and self awareness only. It is not a diagnostic or clinical tool.
            </Typography>
          </Box>

          {/* Right column */}
          <Box className="space-y-6 lg:sticky lg:top-24">
            <Box className="rounded-3xl bg-white border border-slate-200 p-6 shadow-[0_20px_50px_-30px_rgba(15,26,91,0.25)]" data-testid="assessment-details">
              <Typography variant="inherit" component="h3" className="font-head text-lg font-black" style={{ color: NAVY }}>Assessment details</Typography>
              <Box className="mt-3">
                <DetailsRow label="Questions" value={80} />
                <DetailsRow label="Categories" value={4} />
                <DetailsRow label="Duration" value="~ 15 minutes" />
                <DetailsRow label="Attempts" value="2/10 Available" />
              </Box>
            </Box>

            <Box className="rounded-3xl bg-white border border-slate-200 p-6 shadow-[0_20px_50px_-30px_rgba(15,26,91,0.25)]" data-testid="assessment-instructions">
              <Typography variant="inherit" component="h3" className="font-head text-lg font-black" style={{ color: NAVY }}>Instructions</Typography>
              <Box component="ul" className="mt-3 space-y-2.5 text-[13px]" style={{ color: '#475569' }}>
                <Box component="li">There are no Right or Wrong answers.</Box>
                <Box component="li">Answer honestly based on what feels true for you.</Box>
                <Box component="li">Take your time and stay relaxed.</Box>
                <Box component="li">You can take the assessment again.</Box>
                <Box component="li">Be curious and enjoy your process.</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ParentLayout>
  );
}
