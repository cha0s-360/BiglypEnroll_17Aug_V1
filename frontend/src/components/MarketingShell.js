import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown, ArrowRight, GraduationCap, Wallet, Mail, PhoneCall,
} from "lucide-react";

/* Brand tokens — shared across every marketing page */
export const INDIGO = "#5548D1";
export const INDIGO_DEEP = "#3F35A8";
export const INDIGO_TINT = "#EEF0FF";
export const NAVY = "#0F1A5B";
export const TEXT = "#212529";
export const SUBTLE = "#5B6478";

/* --------- Top navigation with BiglypEnroll hover dropdown ---------- */
export function MarketingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-7" />
        </Link>

        <nav
          className="hidden lg:flex items-center gap-8 text-[13px] font-medium relative"
          style={{ color: TEXT }}
          onMouseLeave={() => setOpen(false)}
        >
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
          >
            <Link
              to="/"
              className="flex items-center gap-1 font-bold py-6"
              style={{ color: INDIGO }}
              data-testid="nav-biglypenroll"
            >
              BiglypEnroll
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
            </Link>

            {/* Dropdown */}
            {open && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[520px]"
                data-testid="nav-dropdown"
              >
                <div className="rounded-2xl bg-white shadow-2xl border border-slate-100 p-3 grid grid-cols-2 gap-2 overflow-hidden">
                  <Link
                    to="/career-hub"
                    onClick={() => setOpen(false)}
                    data-testid="nav-career-hub"
                    className="rounded-xl p-4 hover:bg-brand-tint transition-colors flex gap-3 group"
                  >
                    <div className="h-10 w-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: INDIGO_TINT, color: INDIGO }}>
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-head font-bold text-[14px] group-hover:text-brand-blue transition-colors" style={{ color: NAVY }}>
                        Biglyp Career Hub
                      </p>
                      <p className="text-[12px] mt-0.5 leading-snug" style={{ color: SUBTLE }}>
                        AI psychometrics + 2.5L global courses across 42 countries.
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/fee-collection"
                    onClick={() => setOpen(false)}
                    data-testid="nav-fee-collection"
                    className="rounded-xl p-4 hover:bg-brand-tint transition-colors flex gap-3 group"
                  >
                    <div className="h-10 w-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: "#FEF3C7", color: "#B45309" }}>
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-head font-bold text-[14px] group-hover:text-brand-blue transition-colors" style={{ color: NAVY }}>
                        Biglyp Fee Collection
                      </p>
                      <p className="text-[12px] mt-0.5 leading-snug" style={{ color: SUBTLE }}>
                        0% EMI fees, auto-debit, and instant collection on 8+ rails.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" className="h-9 px-5 rounded-full text-sm font-semibold border-slate-300" style={{ color: INDIGO }}>
              Sign in
            </Button>
          </Link>
          <a href="#demo">
            <Button className="h-9 px-5 rounded-full text-sm font-semibold text-white" style={{ background: INDIGO }}>
              Become a partner
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}

/* --------- Shared marketing footer ---------- */
export function MarketingFooter() {
  return (
    <footer style={{ background: NAVY }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-7 grayscale invert brightness-200" />
          </div>
          <p className="mt-3 text-[13px] text-white/60 leading-relaxed max-w-xs">
            The leap that defines you. India&apos;s complete student lifecycle & financial infrastructure for institutions.
          </p>
          <div className="mt-5">
            <p className="text-[11px] uppercase tracking-widest font-bold text-white/70">Subscribe to our newsletter</p>
            <form className="mt-2 flex items-center gap-2">
              <Input placeholder="Enter your email address" className="bg-white/10 border-white/15 text-white placeholder:text-white/50 rounded-full h-10 text-sm" />
              <Button type="button" className="h-10 rounded-full px-4 text-sm font-semibold text-white" style={{ background: INDIGO }}>
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest font-bold text-white/70">Products</p>
          <ul className="mt-4 space-y-2 text-[13px] text-white/80">
            <li><Link to="/" className="hover:text-white">BiglypEnroll (Master)</Link></li>
            <li><Link to="/career-hub" className="hover:text-white">Biglyp Career Hub</Link></li>
            <li><Link to="/fee-collection" className="hover:text-white">Biglyp Fee Collection</Link></li>
            <li><a href="#" className="hover:text-white">0% EMI Financing</a></li>
            <li><a href="#" className="hover:text-white">CIBIL Score Check</a></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest font-bold text-white/70">Study destinations</p>
          <ul className="mt-4 space-y-2 text-[13px] text-white/80">
            <li>Study in India</li>
            <li>Study in USA</li>
            <li>Study in UK</li>
            <li>Study in Canada</li>
            <li>Study in Australia</li>
            <li>Study in Germany</li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest font-bold text-white/70">Contact us</p>
          <ul className="mt-4 space-y-3 text-[13px] text-white/80">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@biglyp.com</li>
            <li className="flex items-center gap-2"><PhoneCall className="h-4 w-4" /> +91 91234 56789</li>
          </ul>
          <div className="mt-5 flex gap-2">
            {["in", "f", "𝕏", "▶"].map((s) => (
              <span key={s} className="h-8 w-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[13px] font-bold cursor-pointer hover:bg-white/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-white/50">
          <p>© 2026 Biglyp Education Finance Pvt. Ltd. · All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white">Terms &amp; Conditions</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Refund Policy</a>
            <a href="#" className="hover:text-white">Lending Partners</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --------- Small helper: primary CTA link ---------- */
export function CtaLink({ children, to = "#demo", solid = true, className = "", ...rest }) {
  const base = "h-11 px-6 rounded-full font-semibold text-sm inline-flex items-center transition-colors";
  const style = solid
    ? { background: INDIGO, color: "#fff" }
    : { color: INDIGO, background: "#fff", border: `1px solid ${INDIGO}` };
  return (
    <a href={to} className={`${base} ${className}`} style={style} {...rest}>
      {children} <ArrowRight className="h-4 w-4 ml-2" />
    </a>
  );
}
