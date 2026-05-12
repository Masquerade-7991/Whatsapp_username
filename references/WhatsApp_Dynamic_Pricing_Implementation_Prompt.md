# Implementation Prompt: WhatsApp Dynamic Pricing & Max-Price Bidding
## CPaaS Platform Integration — Marketing Messages API

---

## 1. Objective

You are a senior full-stack engineer working on a CPaaS (Communications Platform as a Service) product. Your task is to implement the **WhatsApp Dynamic Pricing / Max-Price Bidding** feature into the existing platform, based on Meta's Marketing Messages API specification.

The deliverable is a **complete, production-ready feature implementation** covering:
- Backend API services, business logic, and data models
- Frontend UI components (template creation, campaign send flow, estimation widget, reporting)
- Billing module updates
- Feature gating system
- Error handling and validation layers

The implementation must be **zero-regression** for existing non-bidding workflows.

---

## 2. Context & Domain

### Platform Type
B2B CPaaS — a WhatsApp Business Solution Provider (BSP) platform serving direct integrators and partner-enabled businesses. Users manage WhatsApp Business Accounts (WABAs), create message templates, run campaigns, and view performance reports.

### Feature Background
Meta is introducing voluntary **max-price bidding** on the Marketing Messages API. Instead of flat-rate pricing, businesses can now set a maximum bid per 1,000 message deliveries. This enables:
- Cost control through bid caps
- Delivery prioritisation during peak campaigns
- Reach estimation before spend commitment

### Rollout State
- **Limited Beta**: Mid-May 2026 (per Business ID, 2–5 Business IDs per BSP)
- **Open Beta**: October 2026
- **GA**: Q2 2027

### Key Meta API Endpoints
| Purpose | Endpoint |
|---|---|
| Create/update template with bid | `POST /<WABA_ID>/message_templates` |
| Send message with multiplier | `POST /<PHONE_NUMBER_ID>/marketing_messages` |
| Reach estimation | `GET /<WABA_ID>/reachestimate` |

### Critical Constraint
Templates with `bid_spec` **must** be sent via `/marketing_messages`, NOT `/messages`. Sending to the wrong endpoint returns error `131061`.

---

## 3. Architecture & File Structure

Organise the implementation into the following modules. Adapt paths to your existing project structure:

```
/feature/dynamic-pricing/
├── backend/
│   ├── models/
│   │   ├── waba-feature-flag.model.ts        # meta_enabled flag per WABA
│   │   ├── template-bid-spec.model.ts         # bid_spec schema
│   │   └── billing-record.model.ts            # Standard vs Custom pricing records
│   ├── services/
│   │   ├── feature-gate.service.ts            # WABA-level flag evaluation
│   │   ├── bid-spec.service.ts                # Conversion, validation, CRUD
│   │   ├── reach-estimation.service.ts        # Proxy + response formatting
│   │   ├── billing.service.ts                 # Standard/Custom charge logic
│   │   └── template-analytics.service.ts      # cost_per_delivered sourcing
│   ├── controllers/
│   │   ├── template-bid.controller.ts
│   │   └── reach-estimation.controller.ts
│   ├── validators/
│   │   └── bid-spec.validator.ts
│   └── error-handlers/
│       └── meta-error-map.ts                  # 131061, 100 mapping
├── frontend/
│   ├── components/
│   │   ├── BiddingToggle.tsx                  # Template creation toggle
│   │   ├── BidAmountInput.tsx                 # Per-message + per-1000 display
│   │   ├── MultiplierSlider.tsx               # Campaign send slider (1.0–3.0×)
│   │   ├── ReachEstimationWidget.tsx          # Expandable estimation panel
│   │   └── BidDecisionGuide.tsx               # Inline strategy guide
│   └── report/
│       └── TemplateReportColumns.tsx          # Billing Type + Actual Cost columns
└── tests/
    ├── unit/
    └── integration/
```

---

## 4. Implementation Tasks

Implement each task in order. Each task maps to a functional requirement from the PRD.

---

### TASK 1 — Feature Gating (WABA Level)
**Priority: Critical — all other tasks depend on this**

Build a `meta_enabled` flag system per WABA.

**Data Model:**
```typescript
interface WABAFeatureFlag {
  wabaId: string;
  metaEnabled: boolean;          // Seeded manually or synced from Meta
  updatedAt: Date;
}
```

**Behaviour:**
- `metaEnabled = false` → hide ALL bidding UI; exclude `bid_spec` from all outbound API calls
- `metaEnabled = true` → show bidding UI; allow full `bid_spec` flow
- Flag changes must propagate to UI **within 5 minutes** without requiring user re-login
- Flag is **server-side only** — client cannot override it

**Acceptance Criteria:**
- [ ] Flag stored per WABA in database; can be seeded without deployment
- [ ] All bidding UI elements hidden when flag is false — verified in template creation AND campaign send screens
- [ ] `bid_spec` confirmed absent from all outbound API calls when flag is false (integration test)
- [ ] Flag toggle in both directions (enabled→disabled, disabled→enabled) tested and correct
- [ ] Full regression suite for non-bidding WABAs passes with zero failures

---

### TASK 2 — Template-Level Bid Configuration (UI + API)

**UI Component: `BiddingToggle` + `BidAmountInput`**

Render below the template body, above the save button. Only visible on `MARKETING` category templates.

```
[ ] Enable Max-Price Bidding         ← Toggle, default OFF

On toggle ON (animated expand):
  Cost per message:   [____.____ USD]   ← Primary input, max 4 decimal places
  Cost per 1,000:     $X.XX USD         ← Calculated secondary label (read-only)

  ⚠ "To use published rates, create a new template without a max-price."
     (Persistent once bid is set; survives page refresh)
```

**Backend Conversion Formula:**
```typescript
// Convert per-message price to Meta's required integer format
function convertToMetaBidAmount(
  perMessagePrice: number,    // e.g. 0.0050 USD
  currencyFactor: number      // e.g. 100 for USD (cents)
): number {
  return Math.round(perMessagePrice * 1000 * currencyFactor);
  // e.g. 0.0050 × 1000 × 100 = 500 (integer, represents $0.50 per 1,000 in cents)
}
```

**Template API Payload:**
```json
POST /<WABA_ID>/message_templates
{
  "name": "summer_sale_v1",
  "category": "MARKETING",
  "language": "en",
  "components": [...],
  "bid_spec": {
    "bid_amount": 500,
    "bid_strategy": "LOWEST_COST_WITH_BID_CAP"
  }
}
```

**Validations:**
- `bid_amount` must be positive integer > 0
- Maximum bid limit is configurable (set by business ops, not hardcoded)
- Input precision capped at 4 decimal places before conversion
- Non-marketing categories (`UTILITY`, `AUTHENTICATION`, `SERVICE`): block client-side AND server-side

**Edit Constraints (Approved Templates):**
- Max 1 edit per 24 hours OR 10 edits per 30 days (whichever is stricter)
- Rejected/Paused templates: unlimited edits
- Once `bid_spec` is set on a template, it **cannot be removed** from that template

**Acceptance Criteria:**
- [ ] Toggle hidden for non-MARKETING template categories — verified frontend + backend
- [ ] Toggle OFF → `bid_spec` excluded from Template API payload
- [ ] Toggle ON → `bid_spec` included with correct integer `bid_amount` and `bid_strategy: LOWEST_COST_WITH_BID_CAP`
- [ ] Conversion formula unit-tested across ≥ 3 currencies with edge cases (min value, max value, 4-decimal precision)
- [ ] Persistent notice rendered once bid is set; survives page refresh
- [ ] Edit constraints enforced and tested (approved template rejects 2nd edit within 24h; rejects 11th edit within 30 days)
- [ ] Zero and negative values rejected with inline error; values beyond max bid blocked; >4 decimal places truncated

---

### TASK 3 — Per-Message Bid Multiplier (Campaign Send Flow)

**UI Component: `MultiplierSlider`**

Render in the campaign send flow. Only show if the selected template has `bid_spec` configured AND WABA is Meta-enabled.

```
Max-Price Multiplier  [?]  ← Tooltip: "Adjusts your template bid for this campaign.
                                        1.0× applies the base bid with no change."

[1.0× (Base)] ─────●──────────────── [3.0× (Max)]
                  1.5×

  Base bid:        $0.005 per message
  Multiplier:      1.5×
  Effective bid:   $0.0075 per message    ← Real-time calculated

[Tentative] ← Label visible until Meta formally confirms availability
```

**Slider Constraints:**
| Property | Value |
|---|---|
| Default | `1.0×` |
| Minimum | `1.0×` (cannot go below base bid) |
| Maximum | `3.0×` |
| Step | `0.1` increments only |
| Input type | Slider + stepper arrows only. No free-text entry. |

**Effective Bid Calculation:**
```typescript
const effectiveBid = templateBidAmount * perMessageBidMultiplier;
// Update displayed value in real-time as slider moves
```

**API Payload (only when multiplier > 1.0×):**
```json
POST /<PHONE_NUMBER_ID>/marketing_messages
{
  "recipient_type": "individual",
  "messaging_product": "whatsapp",
  "to": "+91XXXXXXXXXX",
  "type": "template",
  "template": { ... },
  "bid_spec": {
    "per_message_bid_multiplier": 1.5
  }
}
```

**Acceptance Criteria:**
- [ ] Slider renders with correct min/max/step — verified across browsers and devices
- [ ] Free-text entry not possible — confirmed via UI and direct API payload tests
- [ ] Default 1.0× state: `per_message_bid_multiplier` excluded from outbound API call entirely
- [ ] Values 1.0×, 1.5×, 2.0×, 2.5×, 3.0× all transmit correct multiplier value end-to-end
- [ ] Server-side rejects any value outside [1.0, 3.0] or not conforming to 0.1 step — even when submitted via direct API call
- [ ] Three-line summary updates in real-time with no stale states
- [ ] `[Tentative]` label visible in UI until Meta confirms; feature gated from production

---

### TASK 4 — Reach Estimation Widget

**UI Component: `ReachEstimationWidget`**

Render as an expandable panel: **"Preview estimated reach"**. Available in both template creation and campaign send flows.

```
▼ Preview estimated reach

  Country:         [India (IN)    ▼]
  Date interval:   [Last 7 days   ▼]   ← Options: L1D | L7D | L14D | L28D

  [Loading skeleton for 300ms, then:]

  ~72% est. delivery
  Est. ~$0.004 per message
  Based on last 7 days of historical data

  ⓘ Estimates are based on historical data and do not guarantee future performance.
```

**API Call:**
```
GET /<WABA_ID>/reachestimate
  ?targeting_spec={"geo_locations":{"countries":["IN"]}}
  &date_interval=L7D
```

**Response → Display Mapping:**
```typescript
interface ReachEstimateDisplay {
  deliveryRate: number;    // midpoint(lower_bound, upper_bound) / 1000
  costPerMessage: number;  // midpoint(cost_lower_bound, cost_upper_bound) / 1000
}
```

**State Handling (3 distinct states — render visually distinct):**

| State | Trigger | Display |
|---|---|---|
| **Loading** | API in-flight | Skeleton loader (show after 300ms) |
| **No history** | WABA has zero messaging events for selected country/interval | `"Estimates will be available once your account has sent messages to this market. Send your first campaign to unlock reach data."` |
| **API error** | API returns error (not no-data) | `"Estimates unavailable for this configuration"` |
| **Success** | Data returned | Delivery rate + cost per message + contextual label |

**Non-Functional:**
- Debounce bid input: trigger API call after **400ms of inactivity**
- Perceived response time < **500ms** (show skeleton/loader beyond 300ms)
- Max **100 API calls per template per day** during editing
- Estimation panel must **never block** template save or message send

**Acceptance Criteria:**
- [ ] API called with correct `targeting_spec` (ISO country code) and `date_interval`
- [ ] Date interval dropdown renders exactly 4 options (L1D, L7D, L14D, L28D) with L7D pre-selected
- [ ] Delivery rate and cost per message calculated correctly using midpoint formula — verified against known API responses
- [ ] No-history state renders the correct notice — not zero values, not blank fields, not a generic error
- [ ] No-history notice and API error state are **visually distinct** from each other — QA verified
- [ ] Debounce confirmed at 400ms — API not called on every keystroke (verify via network tab)
- [ ] Disclaimer present on every result render, including after interval or country changes
- [ ] Estimation panel does not block or delay template save under any condition — tested with artificially delayed API responses

---

### TASK 5 — API Routing & Error Handling

All templates with `bid_spec` must route through `/marketing_messages`. Never `/messages`.

**Routing Logic (server-side, not overridable by client):**
```typescript
function resolveMessageEndpoint(template: Template): string {
  if (template.bidSpec) {
    return `/marketing_messages`;  // Required for bid_spec
  }
  return `/messages`;              // Standard endpoint
}
```

**Error Mapping:**
```typescript
const META_ERROR_MAP = {
  131061: {
    userMessage: "This template requires the Marketing Messages API. Please check your integration settings.",
    logLevel: "error",
  },
  100: {
    userMessage: "Please sign the beta agreement before sending.",
    logLevel: "warn",
  },
};
```

**Acceptance Criteria:**
- [ ] All templates with `bid_spec` route exclusively through `/marketing_messages` — confirmed via integration test
- [ ] Error 131061 mapped to correct user-facing message — verified in QA
- [ ] Error 100 mapped to correct user-facing message — verified in QA
- [ ] Negative test: submitting `bid_spec` template to `/messages` → error 131061 caught and surfaced correctly
- [ ] Routing logic is server-side — confirmed not overridable via client config

---

### TASK 6 — Reporting: Template Report New Columns

Add two new columns to the WhatsApp Template Performance Report.

| Column | Values | Source |
|---|---|---|
| **Billing Type** | `Standard` / `Custom` | Presence of `bid_spec` on template |
| **Actual Cost per Message** | Numeric in WABA currency | `cost_per_delivered` from Template Analytics API, averaged over report period |

**Display Rules:**
- `Billing Type = Standard` → template has no `bid_spec`
- `Billing Type = Custom` → template has `bid_spec` (regardless of whether bid was above/below published rate)
- `Actual Cost per Message`: if zero deliveries in selected period → display `—` (not `$0.00`)
- Both columns: sortable, filterable
- CSV/Excel export must include both columns with matching values to UI

**Acceptance Criteria:**
- [ ] Both columns appear in report for all users with reporting access
- [ ] Billing Type correctly shows Standard/Custom — tested against templates with and without `bid_spec` on the same WABA
- [ ] No-delivery state renders `—` — confirmed with a template that has sends but zero deliveries in the selected period
- [ ] Sort and filter work on both new columns
- [ ] CSV and Excel exports include new columns with correct values
- [ ] Zero regression on existing report columns, filters, date range selectors, and exports

---

### TASK 7 — Billing Module: Standard & Custom Pricing Logic

**Billing Logic:**

```typescript
// Standard (no bid_spec): unchanged
function calculateStandardCharge(
  publishedRate: number,
  messagesDelivered: number
): number {
  return publishedRate * messagesDelivered;
}

// Custom (bid_spec set):
function calculateCustomCharge(
  costPerDelivered: number,    // From Template Analytics; always <= bid_amount_per_message
  messagesDelivered: number
): number {
  return costPerDelivered * messagesDelivered;
}
```

**Billing Record Schema:**
```typescript
interface BillingRecord {
  id: string;
  wabaId: string;
  templateId: string;
  pricingModel: 'STANDARD' | 'CUSTOM';
  chargePerMessage: number;
  messagesDelivered: number;
  totalCharge: number;
  pricingCategory: 'MARKETING_LITE';   // SKU unchanged regardless of bid_spec
  costPerDeliveredSource: 'TEMPLATE_ANALYTICS' | 'PENDING_REVIEW';
  isFinalized: boolean;
  auditLog: AuditEntry[];
  createdAt: Date;
}
```

**Edge Cases (must implement explicitly):**

| Scenario | Required Behaviour |
|---|---|
| `cost_per_delivered` unavailable (API delay/error) | Flag record for manual review. Do NOT default to published rate. Do NOT bill zero. |
| `actual_cost_per_delivery > bid_amount_per_message` | Flag for finance review. Never auto-process. |
| Zero-cost records on custom-priced sends | Flag for review. Do not auto-process. |
| Mixed WABA invoice (some Standard, some Custom) | Both appear correctly labelled. No cross-contamination of pricing logic. |

**Acceptance Criteria:**
- [ ] Billing module identifies Standard vs Custom per template send based on `bid_spec` presence — unit tested for both cases
- [ ] Standard billing passes full regression suite — zero change in behaviour for non-bid sends
- [ ] Custom billing correctly sources `cost_per_delivered` from Template Analytics — verified end-to-end on test WABA
- [ ] `actual_cost_per_delivery` never exceeds `bid_amount_per_message` — edge case tests confirm flagging behaviour
- [ ] Billing records store pricing model per send — confirmed in DB schema and audit log
- [ ] Records with unavailable `cost_per_delivered` are flagged, not auto-billed
- [ ] Billing values reconcile with Actual Cost per Message in the template report — zero discrepancy across ≥10 test sends
- [ ] Billing records immutable once finalized — corrections require explicit audit trail entry

---

## 5. Constraints & Rules

| Constraint | Rule |
|---|---|
| **Zero regression** | All non-bidding workflows must pass their full existing test suite unchanged |
| **Marketing templates only** | `bid_spec` is invalid on UTILITY, AUTHENTICATION, SERVICE — block on both client and server |
| **Endpoint enforcement** | `bid_spec` → `/marketing_messages` only. Routing is server-side. |
| **No AI bid optimisation** | Out of scope. Do not build automated bid management. |
| **No segment/per-user pricing** | Out of scope. |
| **Billing SKU unchanged** | `pricing_category = MARKETING_LITE` regardless of `bid_spec`. Do not modify webhooks, metrics, or billing SKU. |
| **Estimation is non-blocking** | Estimation API failure must never block template save or message send. |
| **Feature flag is server-side** | Client cannot override WABA feature gating. |
| **[Tentative] multiplier** | Per-message multiplier feature is gated behind Meta confirmation. Do not release to production without Meta sign-off. |

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Reach Estimation API perceived response < 500ms. Show loader at 300ms. |
| **Debounce** | Bid input changes → Estimation API call after 400ms of inactivity |
| **Data integrity** | UI cost display must always match the underlying `bid_amount` value — no drift |
| **Security** | Feature flag changes are server-side only |
| **Availability** | Estimation API failure is graceful and non-blocking |
| **Consistency** | Bidding logic is identical across template creation, editing, and send flow |

---

## 7. Testing Requirements

Write tests for each of the following scenarios:

```
Unit Tests:
- convertToMetaBidAmount() across USD, EUR, INR, JPY with edge values
- Midpoint calculation for reach estimation display fields
- Feature flag evaluation (true/false) and API payload exclusion
- Slider step validation (reject 1.05, 1.23; accept 1.0, 1.1, 1.2)
- Billing charge calculation: Standard and Custom formulas
- Edit constraint enforcement: 24h and 30-day limits

Integration Tests:
- Template creation with bid_spec → Template API → success
- Template creation with bid_spec on non-MARKETING category → server rejection
- Message send with bid_spec → routes to /marketing_messages (not /messages)
- Message send with bid_spec to /messages → intercepts error 131061
- Reach estimation API call → correct targeting_spec and date_interval params
- Reach estimation with no messaging history → no-history notice (not zero values)
- Billing: Custom-priced send → correct sourcing from cost_per_delivered
- Billing: Mixed invoice → Standard and Custom rows correctly labelled
- Flag toggle: enabled→disabled→enabled propagation to UI within 5 minutes

Regression Tests:
- Full non-bidding template creation flow (all categories)
- Full non-bidding message send flow
- Pricing analytics: MARKETING_LITE confirmed for non-bidding sends
- Webhook payload: marketing_lite confirmed for non-bidding sends
- Existing report columns, filters, and exports unchanged
```

---

## 8. Open Items (Flag in Code, Do Not Ship Until Resolved)

Mark these with `// TODO: PENDING_META_CONFIRMATION` in code:

1. **Per-message multiplier availability** — Feature is currently `[Tentative]`. Gate behind feature flag until Meta formally confirms. Do not ship in production.
2. **Maximum bid cap value per currency** — Configurable; actual values to be defined by business ops before Open Beta. Use a config table, not hardcoded values.
3. **Geo restriction list** — Countries where the feature is unavailable must come from a Meta-provided list. Build the filtering mechanism; populate with real values once list is shared.
4. **Beta agreement signing mechanism** — Operational process TBD. Build the `meta_enabled` flag infrastructure to be manually seeded for now; automated sync with Meta's enablement API can be added later.

---

## 9. Integration Timeline Reference

Per Meta's recommendation, allow **6–8 calendar weeks** for full integration of max-price and reach estimation APIs before Limited Beta (mid-May 2026).

Prioritise implementation order:
1. Feature gating (Task 1) — blocks all other work
2. Template-level bidding (Task 2) — core path
3. API routing + error handling (Task 5) — required for any live API call
4. Reach estimation (Task 4) — high visibility, not blocking
5. Per-message multiplier (Task 3) — pending Meta confirmation
6. Reporting columns (Task 6) — before Open Beta
7. Billing module (Task 7) — before Open Beta; requires Finance/Legal sign-off
