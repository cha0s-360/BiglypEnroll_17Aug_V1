// Psychometry mock data & helpers — shared by assessment flow + reports.

export const LIKERT = [
  { label: 'Very True', value: 100 },
  { label: 'Mostly True', value: 75 },
  { label: 'Somewhat true', value: 50 },
  { label: 'Slightly true', value: 25 },
  { label: 'Not true at all', value: 0 },
];

export const CATEGORIES = [
  { key: 'personality', label: 'Personality & Behavioral Traits', short: 'Personality', color: '#5548D1', tint: '#EEF0FF' },
  { key: 'career', label: 'Career Interest Mapping', short: 'Career Interests', color: '#10B981', tint: '#ECFDF5' },
  { key: 'learning', label: 'Learning Style & Cognitive Strengths', short: 'Learning Style', color: '#F59E0B', tint: '#FFFBEB' },
  { key: 'life', label: 'Life Readiness & Decision Skills', short: 'Life Readiness', color: '#EF4444', tint: '#FEF2F2' },
];

const Q_PERSONALITY = [
  'I rarely change my opinion even when presented with strong evidence.',
  'I enjoy helping teammates who are struggling with their portion of a project.',
  'I stay calm when plans change at the last minute.',
  'I prefer clarity in instructions before starting work.',
  'I take initiative in group discussions.',
  'I find it easy to bounce back after a disappointing result.',
  'I like to double-check my work before submitting it.',
  'I am comfortable introducing myself to new people.',
  'I keep my emotions steady during arguments.',
  'I finish tasks even when they get boring.',
  'I enjoy trying activities I have never done before.',
  'I often notice how my classmates are feeling.',
  'I stay organised even during busy exam weeks.',
  'I speak up when I believe something is unfair.',
  'I adapt quickly when joining a new team.',
  'I remain patient when others work slower than me.',
  'I set small goals for myself every week.',
  'I handle criticism without taking it personally.',
  'I like taking responsibility for group outcomes.',
  'I keep promises I make to friends and family.',
];

const Q_CAREER = [
  'I enjoy figuring out how machines or gadgets work.',
  'I like conducting small experiments to test my ideas.',
  'I enjoy sketching, designing or creating visual content.',
  'I like helping people solve their personal problems.',
  'I enjoy persuading others to support my ideas.',
  'I like keeping records, lists and data well organised.',
  'I am curious about how businesses make money.',
  'I follow news about science and technology.',
  'I enjoy writing stories, poems or scripts.',
  'I would enjoy volunteering for a social cause.',
  'I like leading teams during school events.',
  'I enjoy working with numbers and budgets.',
  'I am interested in how global economies connect.',
  'I enjoy building or repairing things with my hands.',
  'I like analysing data to find patterns.',
  'I enjoy performing or presenting on stage.',
  'I want a career where I improve people\u2019s lives.',
  'I dream of starting my own venture someday.',
  'I like planning events step by step.',
  'I prefer traditional, well-established career paths.',
];

const Q_LEARNING = [
  'I keep track of upcoming assignments and deadlines proactively.',
  'I understand concepts better with diagrams and charts.',
  'I remember things best after discussing them aloud.',
  'I learn faster by doing rather than reading.',
  'I can solve math puzzles quickly in my head.',
  'I summarise chapters in my own words to revise.',
  'I can focus for long stretches without distraction.',
  'I spot mistakes in my own reasoning easily.',
  'I connect new topics with things I already know.',
  'I enjoy brain teasers and logic games.',
  'I visualise objects in 3D easily.',
  'I grasp the meaning of new words from context.',
  'I plan my study schedule before exams.',
  'I recall facts accurately during tests.',
  'I break large problems into smaller steps.',
  'I learn well from videos and animations.',
  'I ask questions when a concept is unclear.',
  'I use mind maps or notes with colours.',
  'I finish practice papers within the time limit.',
  'I explain topics to friends to strengthen my memory.',
];

const Q_LIFE = [
  'I know which stream I want to choose after Class 10.',
  'I research careers before forming an opinion on them.',
  'I compare pros and cons before making big decisions.',
  'I manage my pocket money with a simple budget.',
  'I can say no to distractions during study time.',
  'I have discussed my career plans with my family.',
  'I set long-term goals and track my progress.',
  'I stay confident when facing unfamiliar situations.',
  'I know the subjects required for careers I like.',
  'I take feedback from teachers to improve my plans.',
  'I balance academics with hobbies without stress.',
  'I make decisions without depending fully on friends.',
  'I keep backup options for my career plans.',
  'I understand the value of internships and projects.',
  'I am aware of scholarships and entrance exams.',
  'I handle unexpected changes to my routine calmly.',
  'I reflect on my mistakes and adjust my approach.',
  'I can prioritise tasks when everything feels urgent.',
  'I am comfortable making decisions under time pressure.',
  'I feel prepared for the transition to higher classes.',
];

export interface Question { text: string; cat: number }

export const QUESTIONS: Question[] = [
  ...Q_PERSONALITY.map((text) => ({ text, cat: 0 })),
  ...Q_CAREER.map((text) => ({ text, cat: 1 })),
  ...Q_LEARNING.map((text) => ({ text, cat: 2 })),
  ...Q_LIFE.map((text) => ({ text, cat: 3 })),
];

export const TOTAL_QUESTIONS = QUESTIONS.length; // 80

// 12 radar parameters (mock values per the ExploreX sample report)
export const PARAMETERS = [
  { label: 'Conscientiousness & Organization', short: 'Conscientiousness', pct: 73, level: 'High' },
  { label: 'Openness to Experience', short: 'Openness', pct: 34, level: 'Low' },
  { label: 'Extraversion & Social Influence', short: 'Extraversion', pct: 58, level: 'Medium' },
  { label: 'Scientific & Investigative Interest', short: 'Investigative', pct: 19, level: 'Very Low' },
  { label: 'Social & Helping Orientation', short: 'Social', pct: 63, level: 'Medium' },
  { label: 'Business & Enterprising Drive', short: 'Enterprising', pct: 62, level: 'Medium' },
  { label: 'Verbal & Comprehension Aptitude', short: 'Verbal', pct: 28, level: 'Very Low' },
  { label: 'Spatial & Visual Aptitude', short: 'Spatial', pct: 71, level: 'High' },
  { label: 'Logical & Quantitative Aptitude', short: 'Logical', pct: 61, level: 'Medium' },
  { label: 'Stress & Pressure Handling', short: 'Stress Handling', pct: 68, level: 'Medium' },
  { label: 'Stream Decision Confidence', short: 'Decision Confidence', pct: 68, level: 'Medium' },
  { label: 'Goal Setting & Future Orientation', short: 'Goal Setting', pct: 34, level: 'Low' },
];

export const CLUSTERS = [
  { name: 'Business & Social Impact', fit: 'Empathetic, strategic, community-focused, innovative.', subjects: 'Business Studies · Economics · Sociology' },
  { name: 'Creative & Design-Oriented', fit: 'Visually adept, creative, detail-oriented, expressive.', subjects: 'Fine Arts · Graphic Design · Media Studies' },
  { name: 'Global Business & Analytics', fit: 'Analytical, globally-minded, structured, data-driven.', subjects: 'Economics · Business Analytics · International Relations' },
];

export const SKILL_TILES = [
  'Elective Mapping', 'Research', 'Analytical Writing', 'Problem Solving',
];

export function assessmentForGrade(grade = '') {
  const m = grade.match(/\d+/);
  const n = m ? parseInt(m[0], 10) : 10;
  if (n <= 8) return { name: 'DiscoverU', classes: 'Classes 6\u20138', emoji: '\ud83e\udeb4' };
  if (n <= 10) return { name: 'ExploreX', classes: 'Classes 9\u201310', emoji: '\ud83d\udd0d' };
  return { name: 'DecidePro', classes: 'Classes 11\u201312', emoji: '\ud83c\udfaf' };
}

export function computeCategoryScores(answers: (number | null)[]) {
  return CATEGORIES.map((_, ci) => {
    const vals = QUESTIONS.map((q, i) => (q.cat === ci ? answers[i] : null)).filter((v) => v != null) as number[];
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  });
}

export interface PsychoResult {
  id: string;
  ts: number;
  attempt: number;
  scores: number[]; // 4 category pcts
}

const KEY = 'biglyp_psycho_results';

export function loadResults(): PsychoResult[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function saveResult(scores: number[]): PsychoResult {
  const prev = loadResults();
  const res: PsychoResult = {
    id: `att_${Date.now()}`,
    ts: Date.now(),
    attempt: 12 + prev.length,
    scores,
  };
  localStorage.setItem(KEY, JSON.stringify([res, ...prev]));
  return res;
}

export const BASE_ATTEMPTS_USED = 2;
export const MAX_ATTEMPTS = 10;
export const DEFAULT_SCORES = [54, 50, 50, 57];
