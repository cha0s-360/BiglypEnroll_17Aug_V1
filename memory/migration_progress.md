# BiglypEnroll — CRA → Next.js Migration (COMPLETE)

## Final stack
- Next.js 15 App Router + TypeScript (.tsx) — CRA/CRACO fully removed
- MUI v7 (@mui/material + Emotion) via `@mui/material-nextjs` AppRouterCacheProvider (enableCssLayer)
- Tailwind CSS v4 alongside MUI (`@layer mui;` first => Tailwind wins => pixel-perfect)
- Routing: `next/link` + `next/navigation` only. `react-router-dom` fully removed.

## Routes (all migrated + verified via screenshots, no page errors)
- Marketing: `/`, `/biglypenroll`, `/career-hub`, `/fee-collection`
- Auth: `/login`, `/register`
- Admin (`/dashboard/*`): index, fees, students, team, onboarding, reminders (role-guarded)
- Parent (`/app/*`): index, mandate, history, financing, rewards (+ FinancingWizard dialog)
- Credit (`/credit/*`): index, applications, new, `app/[id]`, policies (role-guarded)

## Structure
- `src/app/**` — App Router routes; thin wrappers wrap screens in `ProtectedRoute` w/ role guards (`src/lib/roles.ts`).
- `src/screens/{admin,parent,credit}/*` — migrated screen components (MUI Box/Typography + Tailwind).
- `src/components/{DashboardLayout,CreditLayout,ParentLayout,HomeFeatureSections}.tsx` + `marketing/*`.
- `src/components/ui/*` — button/input/label/badge = MUI-based; select/dialog/checkbox/switch/radio-group/accordion/tabs/slider/progress kept as shadcn(Radix)+Tailwind primitives (pixel-perfect, run in Next client tree).

## Special handling
- `/app/mandate` state passed via `sessionStorage` (Next has no router state).
- MUI Select hidden native input hidden via global `.MuiSelect-nativeInput{opacity:0}`.
- `.env` files were missing from the clone; created (backend + frontend). Backend code untouched.
- supervisor `yarn start` => `next dev` on :3000.
