'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { ParentLayout } from '@/components/ParentLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Search, SlidersHorizontal, LayoutGrid, List, ChevronRight, ArrowRight, Zap,
} from 'lucide-react';

const INDIGO = '#5548D1';
const NAVY = '#1E1B4B';
const THUMB = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=70&w=200';

const PROGRAMS = [
  { title: 'B.Com – Commerce', college: 'AVVM Sri Pushpam College [AVVM]', state: 'Tamil Nadu', duration: '3 Years', tuition: '₹30,000', intake: 'July / Aug' },
  { title: 'B.Sc – Biology / Life Sciences', college: 'AVVM Sri Pushpam College [AVVM]', state: 'Tamil Nadu', duration: '3 Years', tuition: '₹24,000', intake: 'July / Aug' },
  { title: 'B.Sc – Botany', college: 'AVVM Sri Pushpam College [AVVM]', state: 'Tamil Nadu', duration: '2 Years', tuition: '₹20,000', intake: 'July / Aug' },
  { title: 'B.Sc – Chemistry', college: 'AVVM Sri Pushpam College [AVVM]', state: 'Tamil Nadu', duration: '2 Years', tuition: '₹28,000', intake: 'July / Aug' },
  { title: 'B.Sc – Mathematics', college: 'AVVM Sri Pushpam College [AVVM]', state: 'Tamil Nadu', duration: '3 Years', tuition: '₹22,000', intake: 'July / Aug' },
];

export default function ProgramDiscovery() {
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [country, setCountry] = useState('India');
  return (
    <ParentLayout>
      <Box className="max-w-6xl mx-auto" data-testid="program-discovery">
        {/* Header */}
        <Box className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <Box>
            <Typography variant="inherit" component="h1" className="font-head text-2xl md:text-3xl font-black tracking-tight" style={{ color: INDIGO }}>
              Explore over 2,50,000+ Programs
            </Typography>
            <Typography variant="inherit" component="p" className="mt-1 text-[13.5px]" style={{ color: '#64748B' }}>
              Curating the world&apos;s finest educational opportunities for your career.
            </Typography>
          </Box>

          <Box className="flex items-center gap-2">
            <Button data-testid="extend-access" variant="outline" className="h-9 px-3 rounded-full font-semibold text-[12.5px] border-2 bg-white flex items-center gap-1.5" style={{ borderColor: INDIGO, color: INDIGO }}>
              <Zap className="h-3.5 w-3.5" /> Extend Access
            </Button>
            <Box component="span" className="h-9 px-3 rounded-full font-semibold text-[12.5px] text-white flex items-center bg-emerald-500">
              Access for 30 days
            </Box>
          </Box>
        </Box>

        {/* Search bar */}
        <Box className="mt-6 rounded-2xl bg-white border border-slate-200 shadow-[0_20px_50px_-30px_rgba(15,26,91,0.25)] p-2 flex items-center gap-2 flex-wrap">
          <Box className="flex-1 min-w-[220px] flex items-center gap-2 px-3">
            <Search className="h-4 w-4 text-slate-400" />
            <Input placeholder="Search Program / University" data-testid="program-search" className="border-0 shadow-none focus-visible:ring-0 h-10 text-[13.5px] p-0" />
          </Box>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger data-testid="country-select" className="h-10 w-[130px] rounded-lg border-slate-200 text-[13px] font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="India">🇮🇳 India</SelectItem>
              <SelectItem value="USA">🇺🇸 USA</SelectItem>
              <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
              <SelectItem value="UK">🇬🇧 UK</SelectItem>
              <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
            </SelectContent>
          </Select>
          <Button data-testid="search-submit" className="h-10 w-10 rounded-full shrink-0 flex items-center justify-center text-white" style={{ background: NAVY }}>
            <Search className="h-4 w-4" />
          </Button>
        </Box>

        {/* Advanced filter */}
        <Box className="mt-4 flex items-center justify-end">
          <Button data-testid="advanced-filter" variant="outline" className="h-9 px-4 rounded-full font-semibold text-[12.5px] border-2 bg-white flex items-center gap-2" style={{ borderColor: INDIGO, color: INDIGO }}>
            <SlidersHorizontal className="h-3.5 w-3.5" /> Advanced Filter <ChevronRight className="h-3.5 w-3.5 rotate-90" />
          </Button>
        </Box>

        {/* Popular Programs list */}
        <Box className="mt-6 flex items-center justify-between">
          <Typography variant="inherit" component="h2" className="font-head text-lg md:text-xl font-black" style={{ color: NAVY }}>
            Popular Programs
          </Typography>
          <Box className="inline-flex items-center rounded-full bg-slate-100 p-0.5">
            <Box component="button" data-testid="view-grid" onClick={() => setView('grid')} className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-white shadow-sm' : ''}`} style={view === 'grid' ? { color: INDIGO } : { color: '#94A3B8' }}>
              <LayoutGrid className="h-4 w-4" />
            </Box>
            <Box component="button" data-testid="view-list" onClick={() => setView('list')} className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${view === 'list' ? 'bg-white shadow-sm' : ''}`} style={view === 'list' ? { color: INDIGO } : { color: '#94A3B8' }}>
              <List className="h-4 w-4" />
            </Box>
          </Box>
        </Box>

        <Box className={view === 'grid' ? 'mt-4 grid md:grid-cols-2 gap-3' : 'mt-4 space-y-3'}>
          {PROGRAMS.map((p, idx) => (
            <Box key={idx} data-testid={`program-${idx}`} className="rounded-2xl bg-white border border-slate-200 p-3 md:p-4 flex items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all">
              <Box component="img" src={THUMB} alt={p.title} className="h-16 w-16 md:h-[72px] md:w-[72px] rounded-xl object-cover shrink-0" />
              <Box className="min-w-0 flex-1">
                <Typography variant="inherit" component="p" className="font-head text-[14.5px] font-black truncate" style={{ color: NAVY }}>{p.title}</Typography>
                <Typography variant="inherit" component="p" className="text-[12px] truncate" style={{ color: '#64748B' }}>
                  {p.college}, {p.state} • {p.duration}
                </Typography>
              </Box>
              <Box className="hidden md:flex items-center gap-8 shrink-0">
                <Box className="text-right">
                  <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#94A3B8' }}>Tuition</Typography>
                  <Typography variant="inherit" component="p" className="font-head text-[13px] font-black" style={{ color: NAVY }}>{p.tuition} <Box component="span" className="text-[11px] font-medium" style={{ color: '#94A3B8' }}>/ Year</Box></Typography>
                </Box>
                <Box className="text-right">
                  <Typography variant="inherit" component="p" className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#94A3B8' }}>Intake</Typography>
                  <Typography variant="inherit" component="p" className="font-head text-[13px] font-black" style={{ color: NAVY }}>{p.intake}</Typography>
                </Box>
              </Box>
              <Button data-testid={`view-details-${idx}`} variant="outline" className="h-9 px-3 md:px-4 rounded-full font-semibold text-[12.5px] shrink-0 border-2 bg-white flex items-center gap-1.5" style={{ borderColor: INDIGO, color: INDIGO }}>
                View Details <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </ParentLayout>
  );
}
