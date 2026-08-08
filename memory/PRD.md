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
- P1: Admission CRM (lead → enrollment, AI lead scoring, counsellor assignment, offer letters)
- P1: Real payment gateway (Razorpay), settlement auto-reconciliation, collection & recovery queue
- P2: Communication engine (Email/SMS/WhatsApp templates), Student Info System, multi-campus selector, financial-year switcher, Biglyp Ops Hub, financing partner API
- Low: split server.py into routers, cache fee structure in analytics loop, brute-force lockout on login
