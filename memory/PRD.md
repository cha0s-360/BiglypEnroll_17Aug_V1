# BiglypEnroll — PRD

## Original Problem Statement
Build **BiglypEnroll**, a School SaaS (FEE) platform for both web and app, based on the
"School SaaS (FEE) Scoping" document. Clean, sharp, modern design for GenZ students and
their tech-savvy parents. White + shades of blue branding derived from the Biglyp logo.

## User Choices (v1 scope)
- Modules: School onboarding + academic/role setup, Fee Structure setup + Parent fee payment, Analytics dashboards
- Auth: JWT email/password with role-based access
- Payments: Mock / simulated (real Razorpay/Stripe deferred)
- AI: Only fee-structure Excel parsing (Emergent LLM key, openai gpt-5.4)
- Audience: both school staff and parents/students, equally

## Architecture
- **Backend**: FastAPI + MongoDB (motor). JWT (PyJWT) bearer-token auth, bcrypt hashing, role guards.
  `fee_parser.py` uses emergentintegrations (gpt-5.4) to normalise uploaded Excel/CSV fee sheets.
- **Frontend**: React 19 + React Router 7, Tailwind + shadcn/ui, Recharts, framer-motion, sonner.
  Fonts: Outfit (headings) / Figtree (body). Colors: navy #1E2A78, electric blue #2540E8, white.
- Token stored in localStorage (`biglyp_token`), sent via Authorization header.

## Personas / Roles
super_admin (Biglyp Ops), school_admin, finance, counsellor, parent.

## Implemented (2026-06-08)
- Marketing landing page (hero, features, audience, how-it-works, footer)
- Auth: register/login/me/logout, RBAC route guards, 4 seeded demo accounts
- School onboarding wizard: profile → campuses → courses → settlement accounts → go live
- Fee Structure manager: fee heads (amount/frequency/grades), scholarships, early-bird & late-fee rules, draft/publish, **AI Excel/CSV upload parsing**
- Students list + add (with parent email linking)
- Parent app: pending fees, itemized summary w/ GST, mock payment (multiple modes) + receipt, 0% EMI financing with schedule preview, payment history
- Analytics dashboard: KPIs (collected, financed, outstanding, overdue, students, txns), collection velocity line, payment-mode pie, aging bars, admission funnel
- Seed data: Horizon International School, published fee structure, 6 students, historical payments

## Test status
Backend 21/21 pytest pass. Frontend flows verified via testing agent. Tests at
`/app/backend/tests/backend_test.py`.

## Backlog / Remaining (P1/P2 from scoping doc)

## Credit Assessment & Loan Origination module (2026-06-08)
GrayQuest-inspired school fee-financing credit platform at `/credit` (staff + credit_ops) and lender portal (auto-routes lenders). Built on React+FastAPI+MongoDB; external bureaus/KYC/AA are realistically SIMULATED (deterministic from PAN); AI (Emergent LLM/Gemini) powers bank-statement + document OCR with graceful fallback.
- Loan application wizard (student/school, parent applicant, co-applicant, loan+subvention, consent)
- Digital KYC (PAN/Aadhaar/CKYC/DigiLocker/liveness/e-sign) — simulated verify
- Credit bureau pull (TransUnion CIBIL + CRIF/Experian/Equifax) with full report (score, DPD, enquiries, written-off, utilization, credit mix, repayment history, trade lines)
- Bank statement analyzer (AI PDF/CSV + manual), Income Assessment engine, FOIR calculator
- Biglyp Internal Credit Score 0–1000 with admin-configurable weightages
- Rule-based Credit Policy engine per lender (admin-editable, no code), Eligibility Decision (Approved/Conditional/Refer/Reject + reasons), Best-Lender recommendation (approval probability)
- Fee-financing subvention models (100% school / 100% parent / shared) + Loan Pricing engine (EMI, IIR, processing fee, spread, school payout, parent contribution, lender yield, Biglyp revenue)
- Document management + OCR, Fraud & Risk engine (duplicate PAN/mobile, velocity, tampering, statement anomalies)
- Maker-checker workflow, deficiency tracking, lender submission + lender status
- Dashboards (admin/school/lender), audit trail, consent gating, PII masking, RBAC
- 4 preconfigured lenders (Axis/HDFC/ICICI/Aditya Birla NBFC). Backend router: credit.py. Tests: /app/backend/tests/test_credit.py (19/19 pass).
- New logins: creditops@biglyp.com/creditops123 (checker), lender@biglyp.com/lender123 (HDFC portal).

### Earlier P1/P2 backlog
- P1: Admission CRM (lead → enrollment, AI lead scoring, counsellor assignment, offer letters)
- P1: Real payment gateway (Razorpay), settlement auto-reconciliation, collection & recovery queue
- P2: Communication engine (Email/SMS/WhatsApp templates), Student Info System, multi-campus selector, financial-year switcher, Biglyp Ops Hub, financing partner API
- Low: split server.py into routers, cache fee structure in analytics loop, brute-force lockout on login

## Update (2025-07) — Configurable parent payment options (Option A/B/C)
- School Setup gained a **Fee Collection** step: toggle 3 parent payment options (A=0% EMI, B=Auto-Debit quarterly/half-yearly, C=Pay full upfront). At least one must stay enabled (enforced client + server via normalize_payment_options). Stored as `payment_options {emi, auto_debit, full}` on the school doc; exposed via GET /api/parent/fees.
- Parent Fee Payment screen: top quick-pick replaced by prominent **Option A/B/C** cards (wizard-style, with highlight badges). Only school-enabled options render. "Choose how to pay" (Quarterly/Half-Yearly) now shows only when Option B is selected.
- Financing wizard Step 1: removed the EMI-vs-lumpsum (Option A/B) chooser; it's now a clean 0% EMI setup.

## Update (2026-06) — Homepage product-section mockups + prominent hero
- Homepage (/) redesigned in **indigo/violet + yellow** palette (aligned to user reference mockups), harmonized across nav, buttons, tabs, testimonials, FAQ, footer.
- 3 product sections now use **custom-built UI mockups** (not stock photos), inspired by user references:
  - BiglypEnroll: dual-engine dashboard (Career Hub psychometric card + Fee Collection live dashboard with bar chart).
  - Biglyp Career Hub: psychometrics radar/profile card (SVG pentagon) + course-discovery result card.
  - Biglyp Fee Collection: Parents/Institutions benefit cards + payment-option cards (Auto-Collect/Instant/0% EMI).
- Hero made more prominent: larger headline (up to 68px) with violet italic accent + yellow underline, subhead, description, dual CTAs, and a trust row (avatars + rating + "6,500+ institutions").
- Hero entrance switched from framer-motion to CSS `float-up` reveal classes (reveal-1..5) in globals.css for paint-based, hydration-independent reliability.
- File: /app/frontend/src/components/home/Homepage.tsx. Verified visually (hero + all 3 sections render correctly).

## Update (2026-06b) — Homepage interactions + polish
- Interactive Radar: Career Hub psychometrics radar (SVG) now scale-animates in on scroll (framer motion.g, whileInView, transformBox view-box).
- Live counters: hero Stats (42+/1,200+/2,50,000+) count up from zero via IntersectionObserver + rAF (CountUp component, en-IN formatting).
- Mockup hover: `.mockup-hover` class (globals.css) adds lift + indigo glow to all 3 product mockups.
- Section CTAs already wired via <Link href> to /biglypenroll, /career-hub, /fee-collection (routes exist).
- Hero background darkened to a deeper lavender wash; Career Hub mockup made sleeker (gradient pill, live-scan dot, readiness=72 stat, larger radar, softer ring shadows); Fee Collection mockup fonts enlarged/bolder.
- Added footnote "* 0% EMI subject to partnership." under the Fee Collection CTA (ProductSection `note` prop) + `*` on the "0% EMIs*" bullet.
