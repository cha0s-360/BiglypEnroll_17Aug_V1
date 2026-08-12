'use client';

import { useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ArrowRight, GraduationCap, Wallet, Mail, PhoneCall } from 'lucide-react';

/* Brand tokens — shared across every marketing page */
export const INDIGO = '#5548D1';
export const INDIGO_DEEP = '#3F35A8';
export const INDIGO_TINT = '#EEF0FF';
export const NAVY = '#0F1A5B';
export const TEXT = '#212529';
export const SUBTLE = '#5B6478';

/* --------- Top navigation with BiglypEnroll hover dropdown ---------- */
export function MarketingNav() {
  const [open, setOpen] = useState(false);
  return (
    <Box component="header" className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100">
      <Box className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7" />
        </Link>

        <Box
          component="nav"
          className="hidden lg:flex items-center gap-8 text-[13px] font-medium relative"
          style={{ color: TEXT }}
          onMouseLeave={() => setOpen(false)}
        >
          <Link href="/" className="font-semibold py-6 hover:opacity-70 transition-opacity" data-testid="nav-homepage">
            Homepage
          </Link>
          <Box className="relative" onMouseEnter={() => setOpen(true)}>
            <Link
              href="/biglypenroll"
              className="flex items-center gap-1 font-bold py-6"
              style={{ color: INDIGO }}
              data-testid="nav-biglypenroll"
            >
              BiglypEnroll
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
            </Link>

            {open && (
              <Box className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[520px]" data-testid="nav-dropdown">
                <Box className="rounded-2xl bg-white shadow-2xl border border-slate-100 p-3 grid grid-cols-2 gap-2 overflow-hidden">
                  <Link
                    href="/career-hub"
                    onClick={() => setOpen(false)}
                    data-testid="nav-career-hub"
                    className="rounded-xl p-4 hover:bg-brand-tint transition-colors flex gap-3 group"
                  >
                    <Box className="h-10 w-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
                      <GraduationCap className="h-5 w-5" />
                    </Box>
                    <Box className="min-w-0">
                      <Typography variant="inherit" component="p" className="font-head font-bold text-[14px] group-hover:text-brand-blue transition-colors" style={{ color: NAVY }}>
                        Biglyp Career Hub
                      </Typography>
                      <Typography variant="inherit" component="p" className="text-[12px] mt-0.5 leading-snug" style={{ color: SUBTLE }}>
                        AI psychometrics + 2.5L global courses across 42 countries.
                      </Typography>
                    </Box>
                  </Link>

                  <Link
                    href="/fee-collection"
                    onClick={() => setOpen(false)}
                    data-testid="nav-fee-collection"
                    className="rounded-xl p-4 hover:bg-brand-tint transition-colors flex gap-3 group"
                  >
                    <Box className="h-10 w-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: '#FEF3C7', color: '#B45309' }}>
                      <Wallet className="h-5 w-5" />
                    </Box>
                    <Box className="min-w-0">
                      <Typography variant="inherit" component="p" className="font-head font-bold text-[14px] group-hover:text-brand-blue transition-colors" style={{ color: NAVY }}>
                        Biglyp Fee Collection
                      </Typography>
                      <Typography variant="inherit" component="p" className="text-[12px] mt-0.5 leading-snug" style={{ color: SUBTLE }}>
                        0% EMI fees, auto-debit, and instant collection on 8+ rails.
                      </Typography>
                    </Box>
                  </Link>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <Box className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" className="h-9 px-5 rounded-full text-sm font-semibold border-slate-300" style={{ color: INDIGO }}>
              Sign in
            </Button>
          </Link>
          <Box component="a" href="#demo">
            <Button className="h-9 px-5 rounded-full text-sm font-semibold text-white" style={{ background: INDIGO }}>
              Become a partner
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Shared marketing footer ---------- */
export function MarketingFooter() {
  return (
    <Box component="footer" style={{ background: NAVY }} className="text-white">
      <Box className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        <Box>
          <Box className="flex items-center gap-2">
            <Logo className="h-7 grayscale invert brightness-200" />
          </Box>
          <Typography variant="inherit" component="p" className="mt-3 text-[13px] text-white/60 leading-relaxed max-w-xs">
            The leap that defines you. India&apos;s complete student lifecycle & financial infrastructure for institutions.
          </Typography>
          <Box className="mt-5">
            <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-white/70">Subscribe to our newsletter</Typography>
            <Box component="form" className="mt-2 flex items-center gap-2">
              <Input placeholder="Enter your email address" className="bg-white/10 border-white/15 text-white placeholder:text-white/50 rounded-full h-10 text-sm" />
              <Button type="button" className="h-10 rounded-full px-4 text-sm font-semibold text-white" style={{ background: INDIGO }}>
                Subscribe
              </Button>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-white/70">Products</Typography>
          <Box component="ul" className="mt-4 space-y-2 text-[13px] text-white/80">
            <Box component="li"><Link href="/" className="hover:text-white">BiglypEnroll (Master)</Link></Box>
            <Box component="li"><Link href="/career-hub" className="hover:text-white">Biglyp Career Hub</Link></Box>
            <Box component="li"><Link href="/fee-collection" className="hover:text-white">Biglyp Fee Collection</Link></Box>
            <Box component="li"><Box component="a" href="#" className="hover:text-white">0% EMI Financing</Box></Box>
            <Box component="li"><Box component="a" href="#" className="hover:text-white">CIBIL Score Check</Box></Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-white/70">Study destinations</Typography>
          <Box component="ul" className="mt-4 space-y-2 text-[13px] text-white/80">
            <Box component="li">Study in India</Box>
            <Box component="li">Study in USA</Box>
            <Box component="li">Study in UK</Box>
            <Box component="li">Study in Canada</Box>
            <Box component="li">Study in Australia</Box>
            <Box component="li">Study in Germany</Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="inherit" component="p" className="text-[11px] uppercase tracking-widest font-bold text-white/70">Contact us</Typography>
          <Box component="ul" className="mt-4 space-y-3 text-[13px] text-white/80">
            <Box component="li" className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@biglyp.com</Box>
            <Box component="li" className="flex items-center gap-2"><PhoneCall className="h-4 w-4" /> +91 91234 56789</Box>
          </Box>
          <Box className="mt-5 flex gap-2">
            {['in', 'f', '𝕏', '▶'].map((s) => (
              <Box component="span" key={s} className="h-8 w-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[13px] font-bold cursor-pointer hover:bg-white/20">
                {s}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box className="border-t border-white/10">
        <Box className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-white/50">
          <Typography variant="inherit" component="p">© 2026 Biglyp Education Finance Pvt. Ltd. · All rights reserved.</Typography>
          <Box className="flex items-center gap-5">
            <Box component="a" href="#" className="hover:text-white">Terms &amp; Conditions</Box>
            <Box component="a" href="#" className="hover:text-white">Privacy Policy</Box>
            <Box component="a" href="#" className="hover:text-white">Refund Policy</Box>
            <Box component="a" href="#" className="hover:text-white">Lending Partners</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* --------- Small helper: primary CTA link ---------- */
export function CtaLink({ children, to = '#demo', solid = true, className = '', ...rest }: any) {
  const base = 'h-11 px-6 rounded-full font-semibold text-sm inline-flex items-center transition-colors';
  const style = solid
    ? { background: INDIGO, color: '#fff' }
    : { color: INDIGO, background: '#fff', border: `1px solid ${INDIGO}` };
  return (
    <Box component="a" href={to} className={`${base} ${className}`} style={style} {...rest}>
      {children} <ArrowRight className="h-4 w-4 ml-2" />
    </Box>
  );
}
