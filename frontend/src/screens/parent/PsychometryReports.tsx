'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ParentLayout } from '@/components/ParentLayout';
import { Button } from '@/components/ui/button';
import api, { downloadFile } from '@/lib/api';
import { toast } from 'sonner';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts';
import {
  BarChart3, Sparkles, Download, Mail, Compass, BookOpen, PenLine, Puzzle,
  Users, Search, ChevronDown, Loader2,
} from 'lucide-react';
import {
  PARAMETERS, CLUSTERS, DEFAULT_SCORES, CATEGORIES,
  loadResults, assessmentForGrade,
} from '@/lib/psychometry';

const NAVY = '#1E1B4B';
const INDIGO = '#5548D1';

const EMOJIS = [
  { e: '\ud83d\ude21', label: 'Awful' },
  { e: '\ud83d\ude1f', label: 'Poor' },
  { e: '\ud83d\ude10', label: 'Neutral' },
  { e: '\ud83d\ude03', label: 'Good' },
  { e: '\ud83e\udd29', label: 'Excellent' },
];

const SKILL_TILES = [
  { label: 'Elective Mapping', icon: Compass, tint: '#EEF0FF', color: INDIGO },
  { label: 'Research', icon: Search, tint: '#ECFDF5', color: '#10B981' },
  { label: 'Analytical Writing', icon: PenLine, tint: '#FFFBEB', color: '#F59E0B' },
  { label: 'Problem Solving', icon: Puzzle, tint: '#FEF2F2', color: '#EF4444' },
];

function SectionHead({ icon: Icon, title, sub }: any) {
  return (
    <Box className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: '#EEF0FF' }}>
      <Box className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shrink-0" style={{ color: INDIGO }}>
        <Icon className="h-4 w-4" />
      </Box>
      <Box>
        <Typography variant="inherit" component="h3" className="font-head text-[15px] font-black leading-tight" style={{ color: INDIGO }}>{title}</Typography>
        {sub && <Typography variant="inherit" component="p" className="text-[11.5px] text-slate-500">{sub}</Typography>}
      </Box>
    </Box>
  );
}

function CategoryScoreRow({ pct, label, caution }: { pct: number; label: string; caution?: boolean }) {
  // decorative parameter dots on the track
  const dots = [18, 42, 66, 88];
  return (
    <Box className="flex items-center gap-4 md:gap-6">
      <Box className="w-[92px] shrink-0 text-right">
        <Typography variant="inherit" component="p" className="font-head text-[26px] font-black leading-none tabular-nums" style={{ color: NAVY }}>{pct}%</Typography>
      </Box>
      <Box className="w-[150px] shrink-0">
        <Typography variant="inherit" component="p" className="text-[12px] font-bold leading-snug" style={{ color: NAVY }}>{label}</Typography>
      </Box>
      <Box className="flex-1 min-w-0">
        <Box className="relative h-2.5 rounded-full" style={{ background: '#E7EAFB' }}>
          <Box className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#5548D1,#7C6FF5)' }} />
          {dots.map((d) => (
            <Box key={d} className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white border-2" style={{ left: `${d}%`, borderColor: '#B9C0F5' }} />
          ))}
          {/* average marker */}
          <Box className="absolute -top-1.5 h-5 w-[3px] rounded-full" style={{ left: `${pct}%`, background: '#EF4444' }} />
        </Box>
        <Typography variant="inherit" component="p" className="mt-1.5 text-[10px] text-slate-400">
          {caution
            ? 'Answers varied widely here. Read each parameter and treat this section with caution.'
            : 'The average does not represent the individual parameters. Read each parameter for better inference.'}
        </Typography>
      </Box>
    </Box>
  );
}

export default function PsychometryReports() {
  const params = useSearchParams();
  const completed = params.get('completed') === '1';

  const [child, setChild] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.get('/parent/children').then(({ data }) => { if (data[0]) setChild(data[0]); }).catch(() => {});
    setResults(loadResults());
  }, []);

  const meta = assessmentForGrade(child?.grade || 'Class 10');
  const latest = results[0];
  const scores = latest?.scores || DEFAULT_SCORES;
  const dateStr = new Date(latest?.ts || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const radarData = useMemo(() => PARAMETERS.map((p) => ({ subject: p.short, score: p.pct })), []);

  const doDownload = async () => {
    if (!child) { toast.error('No student linked'); return; }
    setDownloading(true);
    try {
      await downloadFile(`/parent/psychometry/report/${child.id}`, `${meta.name}_report_${(child.name || 'student').replace(/ /g, '_')}.pdf`);
      toast.success('Detailed report downloaded');
    } catch {
      toast.error('Could not download the report');
    } finally {
      setDownloading(false);
    }
  };

  const emailReport = () => toast.success(`Report emailed to ${child?.parent_email || 'your inbox'} (mock)`);

  const shareFeedback = () => {
    if (rating == null) { toast.error('Pick an emoji rating first'); return; }
    toast.success('Thanks for your feedback!');
    setRating(null); setFeedback('');
  };

  // past assessments list (latest local results + seeded mock history)
  const history = [
    ...results.map((r: any) => ({ id: r.id, n: r.attempt, ts: r.ts, latest: false })),
    { id: 'mock_11', n: 11, ts: new Date('2026-08-12T14:24:00').getTime(), latest: false },
    { id: 'mock_10', n: 10, ts: new Date('2026-08-05T09:34:00').getTime(), latest: false },
  ];
  if (history[0]) history[0].latest = true;

  return (
    <ParentLayout>
      <Box className="max-w-5xl mx-auto" data-testid="psychometry-reports">
        {/* Congratulations banner */}
        {completed && (
          <Box className="rounded-2xl px-6 py-6 text-center mb-6 reveal" style={{ background: 'linear-gradient(160deg,#EEF0FF 0%,#F8F9FF 100%)' }} data-testid="congrats-banner">
            <Typography variant="inherit" component="h2" className="font-head text-[24px] font-black tracking-tight" style={{ color: NAVY }}>
              Congratulations!
            </Typography>
            <Typography variant="inherit" component="p" className="mt-1 text-[13.5px] font-semibold" style={{ color: INDIGO }}>
              You have successfully completed your Psychometric Assessment.
            </Typography>
          </Box>
        )}

        <Typography variant="inherit" component="h1" className="font-head text-[22px] font-black tracking-tight reveal" style={{ color: NAVY }}>
          Psychometric Reports
        </Typography>
        <Typography variant="inherit" component="p" className="text-[12.5px] text-slate-500 mt-0.5 reveal">
          View your completed assessment results and career recommendations.
        </Typography>

        {/* ================= Summary report card ================= */}
        <Box className="mt-5 bg-white rounded-2xl border border-border/70 soft-shadow p-5 md:p-8 reveal-1" data-testid="summary-report">
          <Box className="text-center">
            <Typography variant="inherit" component="h2" className="font-head text-[19px] md:text-[21px] font-black tracking-tight" style={{ color: NAVY }}>
              Your Personalized Assessment Report
            </Typography>
            <Typography variant="inherit" component="p" className="text-[12px] text-slate-500 mt-1">
              {child?.name || 'Student'} • {child?.grade || ''} • {dateStr}
            </Typography>
          </Box>

          {/* Profile snapshot */}
          <Box className="mt-6">
            <SectionHead icon={BarChart3} title="Profile Snapshot" sub="Your learning profile at a glance" />
          </Box>

          {/* Professional identity */}
          <Box className="mt-5">
            <SectionHead icon={Sparkles} title="Your Professional Identity" />
            <Box className="mt-4 grid md:grid-cols-[1fr_200px] gap-5 items-start px-1">
              <Box>
                <Typography variant="inherit" component="p" className="text-[13px] font-bold" style={{ color: NAVY }}>
                  Empathetic Global Business Strategist
                </Typography>
                <Typography variant="inherit" component="p" className="mt-2 text-[12.5px] leading-relaxed text-slate-600">
                  You are an Empathetic Global Business Strategist — a profile chosen due to your strong inclination
                  towards understanding global economic trends and your deep desire to create solutions for social
                  problems. Your balanced emotional intelligence allows you to navigate complex situations with composure.
                </Typography>
                <Typography variant="inherit" component="p" className="mt-2 text-[12.5px] leading-relaxed text-slate-600">
                  Your unique blend of strong business acumen and a genuine social orientation enables you to approach
                  challenges with both strategic insight and a human-centered perspective. Your potential lies in
                  leveraging these strengths to drive impactful initiatives in dynamic environments.
                </Typography>
              </Box>
              <Box className="hidden md:flex h-36 rounded-xl items-center justify-center text-5xl" style={{ background: '#EEF0FF' }} aria-hidden>
                {'\ud83e\udd1d'}
              </Box>
            </Box>
          </Box>

          {/* Category scores */}
          <Box className="mt-6" data-testid="category-scores">
            <SectionHead icon={BarChart3} title="Category Scores" />
            <Box className="mt-5 space-y-5 px-1">
              {CATEGORIES.map((c, i) => (
                <CategoryScoreRow key={c.key} pct={scores[i] ?? DEFAULT_SCORES[i]} label={c.label} caution={i === 3} />
              ))}
            </Box>
          </Box>

          {/* Radar */}
          <Box className="mt-6" data-testid="profile-radar">
            <SectionHead icon={Sparkles} title="Assessment Profile Radar" />
            <Box className="mt-2 h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="72%">
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Radar name="Score" dataKey="score" stroke={INDIGO} fill={INDIGO} fillOpacity={0.18} strokeWidth={2}
                    dot={{ r: 2.5, fill: INDIGO }} />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* Career clusters */}
          <Box className="mt-6" data-testid="career-clusters">
            <SectionHead icon={Compass} title="Career Cluster Exploration" />
            <Box className="mt-4 grid md:grid-cols-3 gap-3">
              {CLUSTERS.map((c, i) => (
                <Box key={c.name} className="rounded-xl border border-border/70 p-4 card-lift bg-white soft-shadow">
                  <Box component="span" className="inline-flex items-center rounded-full px-2 py-0.5 text-[9.5px] font-black uppercase tracking-widest" style={{ background: '#EEF0FF', color: INDIGO }}>
                    Cluster {i + 1}
                  </Box>
                  <Typography variant="inherit" component="p" className="mt-2 font-head text-[14px] font-black leading-tight" style={{ color: NAVY }}>{c.name}</Typography>
                  <Typography variant="inherit" component="p" className="mt-1.5 text-[11.5px] leading-snug text-slate-500">{c.fit}</Typography>
                  <Typography variant="inherit" component="p" className="mt-2 text-[10.5px] font-semibold" style={{ color: INDIGO }}>{c.subjects}</Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="inherit" component="p" className="mt-3 text-center text-[12px] text-slate-500 leading-relaxed max-w-2xl mx-auto">
              We identify 3 career paths that strongly align with your unique skills and personality. Dive into the details
              in the report, where &lsquo;A Day in the Life&rsquo; scenarios will further help you visualize exactly what to expect from each role.
            </Typography>
          </Box>

          {/* Academic & skill development */}
          <Box className="mt-6" data-testid="skill-development">
            <SectionHead icon={BookOpen} title="Academic & Skill Development" />
            <Box className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {SKILL_TILES.map((s) => {
                const Icon = s.icon;
                return (
                  <Box key={s.label} className="rounded-xl p-4 text-center card-lift" style={{ background: s.tint }}>
                    <Box className="h-10 w-10 rounded-xl bg-white mx-auto flex items-center justify-center" style={{ color: s.color }}>
                      <Icon className="h-5 w-5" />
                    </Box>
                    <Typography variant="inherit" component="p" className="mt-2.5 text-[12px] font-bold" style={{ color: NAVY }}>{s.label}</Typography>
                  </Box>
                );
              })}
            </Box>
            <Typography variant="inherit" component="p" className="mt-3 text-center text-[12px] text-slate-500">
              Explore these <Box component="span" className="font-bold" style={{ color: INDIGO }}>Career options</Box> in the Detailed Report
            </Typography>
          </Box>

          {/* Parent guidance */}
          <Box className="mt-6" data-testid="parent-guidance">
            <SectionHead icon={Users} title="Guidance for Parents & Student Interaction" />
            <Typography variant="inherit" component="p" className="mt-3 px-1 text-[12.5px] leading-relaxed text-slate-600">
              Actionable strategies and conversation scripts to help students bridge the communication gap with parents
              regarding stream selection. It focuses on using personal assessment strengths to drive collaborative,
              logic-based decisions for the next academic phase.
            </Typography>
          </Box>

          {/* Download */}
          <Box className="mt-7 flex justify-center">
            <Button onClick={doDownload} disabled={downloading} data-testid="download-report-btn"
              className="h-11 px-7 rounded-full font-bold text-white text-[13.5px] transition-all duration-300 hover:-translate-y-0.5 shadow-[0_12px_26px_-10px_rgba(85,72,209,0.7)]"
              style={{ background: 'linear-gradient(135deg, #5548D1 0%, #6E5FEA 100%)' }}>
              {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Download Report
            </Button>
          </Box>

          {/* Feedback */}
          <Box className="mt-7 rounded-2xl p-5 md:p-6" style={{ background: '#EEF0FF' }} data-testid="feedback-card">
            <Typography variant="inherit" component="h3" className="text-center font-head text-[15px] font-black" style={{ color: NAVY }}>
              Share your feedback about the assessment
            </Typography>
            <Typography variant="inherit" component="p" className="text-center text-[11.5px] text-slate-500 mt-0.5">
              How would you describe your experience with the assessment?
            </Typography>
            <Box className="mt-4 flex items-start justify-center gap-4 md:gap-6">
              {EMOJIS.map((em, i) => (
                <Box component="button" key={em.label} onClick={() => setRating(i)} data-testid={`feedback-emoji-${i}`}
                  className={`flex flex-col items-center gap-1 transition-all duration-200 ${rating === i ? 'scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}>
                  <Box component="span" className={`text-[26px] leading-none ${rating === i ? '' : 'grayscale-[35%]'}`}>{em.e}</Box>
                  <Box component="span" className="text-[10px] font-bold" style={{ color: rating === i ? INDIGO : '#94A3B8' }}>{em.label}</Box>
                </Box>
              ))}
            </Box>
            <Typography variant="inherit" component="p" className="mt-4 text-[11px] font-bold text-slate-500">Tell us more</Typography>
            <Box component="textarea" value={feedback} onChange={(e: any) => setFeedback(e.target.value)} data-testid="feedback-message"
              placeholder="Enter Your Message"
              className="mt-1.5 w-full h-20 rounded-xl border border-border bg-white px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[#5548D1] transition-colors resize-none" />
            <Box className="mt-3 flex justify-center">
              <Button onClick={shareFeedback} data-testid="share-feedback-btn"
                className="h-9 px-5 rounded-full bg-[#5548D1] hover:bg-[#3F35A8] text-white font-bold text-[12.5px]">
                Share Feedback
              </Button>
            </Box>
          </Box>
        </Box>

        {/* ================= Past assessments ================= */}
        <Box className="mt-6 space-y-3 reveal-2" data-testid="report-list">
          {history.map((h: any) => (
            <Box key={h.id} className="bg-white rounded-2xl border border-border/70 soft-shadow px-4 md:px-5 py-3.5 flex items-center gap-3 flex-wrap" data-testid={`report-item-${h.id}`}>
              <Box className="h-10 w-10 rounded-full flex items-center justify-center text-xl shrink-0" style={{ background: '#EEF0FF' }} aria-hidden>
                {meta.emoji}
              </Box>
              <Box className="min-w-0 flex-1">
                <Box className="flex items-center gap-2 flex-wrap">
                  <Typography variant="inherit" component="p" className="font-head font-black text-[14px]" style={{ color: NAVY }}>{meta.name}</Typography>
                  <Box component="span" className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white" style={{ background: '#10B981' }}>
                    {meta.classes}
                  </Box>
                  {h.latest && (
                    <Box component="span" className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest" style={{ background: '#FEF3C7', color: '#B45309' }}>
                      Latest
                    </Box>
                  )}
                </Box>
                <Typography variant="inherit" component="p" className="text-[11px] text-slate-400 mt-0.5">
                  Learning · Strengths · Self-Awareness &nbsp;·&nbsp; Assessment {h.n} | {new Date(h.ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Typography>
              </Box>
              <Box className="flex items-center gap-2">
                <Button onClick={doDownload} data-testid={`dl-${h.id}`}
                  className="h-8 px-3.5 rounded-full bg-[#5548D1] hover:bg-[#3F35A8] text-white font-bold text-[11.5px]">
                  <Download className="h-3.5 w-3.5 mr-1.5" /> Download Report
                </Button>
                <Button onClick={emailReport} variant="outline" data-testid={`email-${h.id}`}
                  className="h-8 px-3.5 rounded-full border-[#5548D1]/30 text-[#5548D1] font-bold text-[11.5px] hover:bg-[#EEF0FF]">
                  <Mail className="h-3.5 w-3.5 mr-1.5" /> Email Report <ChevronDown className="h-3 w-3 ml-1 opacity-60" />
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </ParentLayout>
  );
}
