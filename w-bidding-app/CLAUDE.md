# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is a **React prototype** for Helo.ai's WhatsApp campaign management UI — specifically the "w-bidding" (WhatsApp bidding) feature. It is a frontend-only application with no backend, mocking data inline. The UI mirrors the live Helo.ai product (helo.ai) and is used for design validation.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check + production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test suite exists.

## Architecture

**Stack:** React 19, TypeScript, Vite, Tailwind CSS, Radix UI primitives, `react-router-dom` v7.

**Routing** is defined in `src/App.tsx`. Four real pages exist: `/templates`, `/templates/new`, `/campaigns`, `/reports`. All other sidebar routes render a `PlaceholderPage`.

**Prototype controls** live in `src/components/DevToolbar.tsx` — a fixed overlay that toggles global state via `FeatureContext`. Two flags are exposed:
- `metaEnabled` — shows/hides the bidding UI (simulates a WABA feature flag)
- `reachEstimateState` — cycles the `ReachEstimationWidget` through `loading | success | no-history | error`

**Global state** is in `src/context/FeatureContext.tsx`. Components consume it via `useFeature()`.

**Shared utilities:**
- `src/lib/constants.ts` — `BID_MIN`, `BID_MAX`, `USD_TO_INR`, `CHANNEL_TABS`, `DATE_INTERVALS`
- `src/lib/format.ts` — `fmtINR(usd)` converts USD → INR string

**UI primitives** in `src/components/ui/` are thin wrappers around Radix UI (shadcn-style). Use these before reaching for raw HTML elements.

**Bidding components** in `src/components/bidding/` are self-contained and used inside `CampaignSend.tsx`.

**Path alias:** `@/` resolves to `src/`.

## Styling Conventions

- Design tokens are CSS custom properties defined in `src/index.css` (e.g. `var(--primary)`, `var(--text-sm)`, `var(--font-weight-semi-bold)`). Use these for inline `style` props on custom elements.
- Tailwind utility classes handle layout, spacing, and structural concerns. Use Tailwind for `flex`, `gap`, `rounded`, `border`, `overflow`, etc.
- **Do not hard-code hex colors or px font sizes** — always reference a CSS variable or Tailwind utility.

## Code Editing Rules

**Make the minimum diff required.** Only modify lines that must change.

- Adding an import: append it to the existing import block — do not rewrite unchanged import lines.
- Changing a prop or style: edit only that attribute — do not reformat surrounding JSX.
- Extracting a constant: add it where it belongs without touching unrelated code.
- If a file has 2 imports and needs a 3rd, the edit touches exactly 1 line (or adds 1 line) — not a rewrite of the import section.

This keeps diffs reviewable and avoids unintentional regressions.
