'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import {
  ArrowLeft, ArrowRight, Check, Clock, X, Sparkles, Wand2,
} from 'lucide-react';
import {
  LIKERT, QUESTIONS, TOTAL_QUESTIONS, CATEGORIES,
  computeCategoryScores, saveResult, assessmentForGrade, loadResults,
} from '@/lib/psychometry';

const NAVY = '#1E1B4B';
const INDIGO = '#5548D1';

/* ---------------- Waiting screen (report generation) ---------------- */
function WaitingScreen({ seconds }: { seconds: number }) {
  const stages = ['Analysing traits', 'Mapping careers', 'Crafting insights'];
  const stageIdx = seconds > 8 ? 0 : seconds > 4 ? 1 : 2;
  return (
    <Box className="fixed inset-0 z-50 bg-[#F6F8FE] flex items-center justify-center px-4" data-testid="report-waiting">
      <Box className="text-center max-w-md w-full">
        <Box className="relative mx-auto h-28 w-28">
          <Box className="absolute inset-0 rounded-full hero-gradient opacity-15 animate-pulse" />
          <Box className="absolute inset-3 rounded-full bg-white soft-shadow-lg flex items-center justify-center">
            <Clock className="h-10 w-10 animate-spin" style={{ color: INDIGO, animationDuration: '3s' }} />
          </Box>
        </Box>
        <Typography variant="inherit" component="h2" className="mt-6 font-head text-[22px] font-black tracking-tight" style={{ color: NAVY }}>
          Your Report is getting generated, stay tuned...
        </Typography>
        <Typography variant="inherit" component="p" className="mt-2 text-[13px] text-slate-500">
          Generating personalised insights based on your psychometric profile
        </Typography>

        <Box className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          {stages.map((s, i) => (
            <Box key={s} component="span"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold transition-all duration-500 ${
                i < stageIdx ? 'bg-emerald-100 text-emerald-700'
                  : i === stageIdx ? 'bg-[#EEF0FF] text-[#5548D1] scale-105'
                  : 'bg-slate-100 text-slate-400'
              }`}>
              {i < stageIdx ? <Check className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
              {s}
            </Box>
          ))}
        </Box>

        <Typography variant="inherit" component="p" className="mt-6 font-head text-3xl font-black tabular-nums" style={{ color: INDIGO }} data-testid="waiting-timer">
          {seconds}s
        </Typography>
      </Box>
    </Box>
  );
}

export default function AssessmentAttempt() {
  const router = useRouter();
  const { user } = useAuth();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(TOTAL_QUESTIONS).fill(null));
  const [waiting, setWaiting] = useState(false);
  const [seconds, setSeconds] = useState(12);
  const [meta, setMeta] = useState({ name: 'ExploreX', classes: 'Classes 9\u201310', emoji: '\ud83d\udd0d' });

  const attemptNo = useMemo(() => 12 + loadResults().length, []);

  useEffect(() => {
    api.get('/parent/children').then(({ data }) => {
      if (data[0]) setMeta(assessmentForGrade(data[0].grade));
    }).catch(() => {});
  }, []);

  const q = QUESTIONS[idx];
  const cat = CATEGORIES[q.cat];
  const answered = answers.filter((a) => a != null).length;
  const progress = Math.round((answered / TOTAL_QUESTIONS) * 100);
  const isLast = idx === TOTAL_QUESTIONS - 1;
  const canFinish = answered === TOTAL_QUESTIONS;

  const select = (value: number) => {
    setAnswers((prev) => { const nx = [...prev]; nx[idx] = value; return nx; });
  };

  const finish = () => {
    setWaiting(true);
    setSeconds(12);
  };

  // demo auto-fill (mirrors the "Auto Answer" helper from the reference flow)
  const autofill = () => {
    setAnswers((prev) => prev.map((a) => (a == null ? LIKERT[Math.floor(Math.random() * 5)].value : a)));
    setIdx(TOTAL_QUESTIONS - 1);
  };

  // waiting countdown -> save + redirect
  useEffect(() => {
    if (!waiting) return;
    if (seconds <= 0) {
      const scores = computeCategoryScores(answers);
      saveResult(scores);
      router.push('/app/psychometry/reports?completed=1');
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [waiting, seconds]);

  if (waiting) return <WaitingScreen seconds={seconds} />;

  return (
    <Box className="min-h-screen bg-[#F6F8FE]" data-testid="assessment-attempt">
      {/* Top bar */}
      <Box component="header" className="sticky top-0 z-40 glass-bar border-b border-border h-14 flex items-center justify-between px-4 md:px-8">
        <Box className="flex items-center gap-3">
          <Logo className="h-7" />
          <Box className="hidden sm:block h-6 w-px bg-border" />
          <Box className="hidden sm:flex items-center gap-2">
            <Typography variant="inherit" component="p" className="font-head font-black text-[14px]" style={{ color: NAVY }}>{meta.name}</Typography>
            <Box component="span" className="inline-flex items-center rounded-full px-2 py-0.5 text-[9.5px] font-black uppercase tracking-widest text-white" style={{ background: '#10B981' }}>
              {meta.classes}
            </Box>
            <Box component="span" className="text-[11px] text-slate-400 font-semibold">Attempt {attemptNo}</Box>
          </Box>
        </Box>
        <Box className="flex items-center gap-2">
          <Box component="button" onClick={autofill} data-testid="autofill-btn"
            className="hidden md:inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[11px] font-bold text-slate-400 border border-border hover:text-[#5548D1] hover:border-[#5548D1]/40 transition-colors">
            <Wand2 className="h-3 w-3" /> Demo: auto-fill
          </Box>
          <Box component="button" onClick={() => router.push('/app/psychometry')} data-testid="exit-attempt"
            className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors" title="Exit assessment">
            <X className="h-4 w-4" />
          </Box>
        </Box>
      </Box>

      {/* Progress bar */}
      <Box className="h-1.5 bg-slate-100">
        <Box className="h-full rounded-r-full transition-all duration-500" data-testid="attempt-progress"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #5548D1, #7C6FF5)' }} />
      </Box>

      <Box className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8 grid lg:grid-cols-[1fr_250px] gap-6 items-start">
        {/* Question card */}
        <Box className="bg-white rounded-2xl border border-border/70 soft-shadow p-5 md:p-7 reveal" key={idx}>
          <Box className="flex items-center justify-between gap-3 flex-wrap">
            <Box component="span" className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold"
              style={{ background: cat.tint, color: cat.color }}>
              {cat.label}
            </Box>
            <Typography variant="inherit" component="p" className="text-[12px] font-bold text-slate-400" data-testid="question-counter">
              Question <Box component="span" style={{ color: INDIGO }}>{idx + 1}</Box> of {TOTAL_QUESTIONS}
            </Typography>
          </Box>

          <Typography variant="inherit" component="h2" className="mt-4 font-head text-[19px] md:text-[22px] font-black tracking-tight leading-snug" style={{ color: NAVY }} data-testid="question-text">
            {q.text}
          </Typography>

          <Box className="mt-5 space-y-2.5">
            {LIKERT.map((o, i) => {
              const active = answers[idx] === o.value;
              return (
                <Box component="button" key={o.label} onClick={() => select(o.value)} data-testid={`likert-${i}`}
                  className={`w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 ${
                    active
                      ? 'border-[#5548D1] bg-[#EEF0FF] shadow-[0_8px_18px_-10px_rgba(85,72,209,0.5)]'
                      : 'border-border bg-white hover:border-[#5548D1]/40 hover:bg-[#EEF0FF]/40'
                  }`}>
                  <Box component="span" className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    active ? 'border-[#5548D1] bg-[#5548D1]' : 'border-slate-300 bg-white'
                  }`}>
                    {active && <Box component="span" className="h-2 w-2 rounded-full bg-white" />}
                  </Box>
                  <Box component="span" className={`text-[14px] ${active ? 'font-bold' : 'font-medium'}`} style={{ color: active ? NAVY : '#475569' }}>
                    {o.label}
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Nav buttons */}
          <Box className="mt-6 flex items-center justify-between">
            <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))} data-testid="prev-btn"
              className="h-10 px-4 rounded-full border-border text-slate-600 font-semibold text-[13px]">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Previous
            </Button>
            {isLast ? (
              <Button onClick={finish} disabled={!canFinish} data-testid="finish-btn"
                className="h-10 px-6 rounded-full font-bold text-white text-[13px] transition-all duration-300 hover:-translate-y-0.5 shadow-[0_10px_22px_-10px_rgba(16,185,129,0.7)] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                Finish <Check className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button onClick={() => setIdx((i) => Math.min(TOTAL_QUESTIONS - 1, i + 1))} disabled={answers[idx] == null} data-testid="next-btn"
                className="h-10 px-6 rounded-full font-bold text-white text-[13px] transition-all duration-300 hover:-translate-y-0.5 shadow-[0_10px_22px_-10px_rgba(85,72,209,0.7)] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #5548D1 0%, #6E5FEA 100%)' }}>
                Next <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            )}
          </Box>
        </Box>

        {/* Category progress rail */}
        <Box className="hidden lg:block bg-white rounded-2xl border border-border/70 soft-shadow p-4 sticky top-24" data-testid="category-progress">
          <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Your progress</Typography>
          <Typography variant="inherit" component="p" className="mt-1 font-head text-xl font-black" style={{ color: NAVY }}>
            {answered}<Box component="span" className="text-sm text-slate-400 font-bold">/{TOTAL_QUESTIONS}</Box>
          </Typography>
          <Box className="mt-3 space-y-3">
            {CATEGORIES.map((c, ci) => {
              const done = QUESTIONS.filter((qq, i) => qq.cat === ci && answers[i] != null).length;
              const total = QUESTIONS.filter((qq) => qq.cat === ci).length;
              const active = q.cat === ci;
              return (
                <Box key={c.key}>
                  <Box className="flex items-center justify-between gap-2">
                    <Typography variant="inherit" component="p" className={`text-[11px] leading-tight ${active ? 'font-bold' : 'font-semibold'}`}
                      style={{ color: active ? c.color : '#64748B' }}>
                      {c.short}
                    </Typography>
                    <Box component="span" className="text-[10.5px] font-bold tabular-nums" style={{ color: done === total ? '#10B981' : '#94A3B8' }}>
                      {done}/{total}
                    </Box>
                  </Box>
                  <Box className="mt-1 h-1 rounded-full bg-slate-100">
                    <Box className="h-full rounded-full transition-all duration-300" style={{ width: `${(done / total) * 100}%`, background: c.color }} />
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Typography variant="inherit" component="p" className="mt-4 text-[10.5px] text-slate-400 leading-relaxed">
            {user?.name ? `Answering as ${user.name.split(' ')[0]} — ` : ''}there are no right or wrong answers. Answer honestly.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
