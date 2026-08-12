# BiglypEnroll — CRA → Next.js Migration (Progress)

## Target stack
- Next.js 15 App Router + TypeScript (.tsx)  [replaces CRA/CRACO]
- MUI v7 (@mui/material + Emotion) via `@mui/material-nextjs` AppRouterCacheProvider
- Tailwind CSS v4 kept alongside MUI (CSS `@layer mui;` declared first => Tailwind utilities always win = pixel-perfect)
- Routing: `next/navigation` + `next/link` (no react-router-dom in migrated code)

## Environment notes
- Repo cloned without `.env` files -> created `/app/backend/.env` (MONGO_URL, DB_NAME=biglyp_enroll, JWT_SECRET) and `/app/frontend/.env` (REACT_APP_BACKEND_URL). Backend code untouched.
- supervisor runs `yarn start`; package.json `start` => `next dev -H 0.0.0.0 -p 3000`.
- Legacy CRA pages moved to `src/_legacy/pages` (excluded in tsconfig, not routed) — reference for later phases.

## Conversion primitives (MUI-based, pixel-safe)
- `ui/button.tsx` -> MUI ButtonBase + shadcn cva classes
- `ui/input.tsx` -> MUI Box `component="input"`; `ui/label.tsx` -> Box `component="label"`
- Select -> MUI Select/MenuItem (register). Global fix: `.MuiSelect-nativeInput{opacity:0}`
- Text -> `<Typography variant="inherit" component=...>`; containers -> `<Box>`; gradients -> inline styles.

## DONE — Phase 1 (verified via screenshots + login 200 + token stored)
- Scaffolding: package.json, next.config.js, tsconfig, postcss(v4), globals.css, theme.ts, providers.tsx, layout.tsx
- lib/api.ts, lib/utils.ts, context/AuthContext.tsx, components/ProtectedRoute.tsx, Logo.tsx
- components/MarketingShell.tsx (nav + footer)
- app/page.tsx -> components/marketing/BiglypMaster.tsx (landing)
- app/login/page.tsx, app/register/page.tsx

## TODO — later phases (still in src/_legacy/pages, react-router based)
- Layouts: DashboardLayout, ParentLayout, CreditLayout, HomeFeatureSections
- Marketing: BiglypEnroll, CareerHub (fee-collection)
- admin/*: AdminDashboard, FeeStructure, Onboarding, Reminders, Students, Team  -> /dashboard/*
- parent/*: ParentDashboard, ActiveFinancing, FinancingWizard, MandateSetup, PaymentHistory, Rewards -> /app/*
- credit/*: CreditDashboard, Applications, ApplicationDetail, NewApplication, Policies -> /credit/*
- Remaining shadcn ui/* primitives (dialog, tabs, badge, table, etc.) -> MUI equivalents/wrappers
- Remove react-router-dom dep at the end
