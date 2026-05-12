# Graph Report - .  (2026-05-05)

## Corpus Check
- Corpus is ~11,134 words - fits in a single context window. You may not need a graph.

## Summary
- 114 nodes · 83 edges · 55 communities (38 shown, 17 thin omitted)
- Extraction: 58% EXTRACTED · 42% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Primitives|UI Primitives]]
- [[_COMMUNITY_Bidding Controls & Reach|Bidding Controls & Reach]]
- [[_COMMUNITY_Icon Library|Icon Library]]
- [[_COMMUNITY_Layout & Navigation|Layout & Navigation]]
- [[_COMMUNITY_Feature Context & Reach State|Feature Context & Reach State]]
- [[_COMMUNITY_Vite Build Assets|Vite Build Assets]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]

## God Nodes (most connected - your core abstractions)
1. `shadcn/ui Component Pattern` - 8 edges
2. `icons.svg — SVG sprite sheet containing 6 icon symbols for UI use` - 8 edges
3. `cn (class merging utility)` - 7 edges
4. `CSS Variable Design Token System` - 6 edges
5. `ReachEstimationWidget` - 6 edges
6. `Group of social platform icons: Bluesky, Discord, GitHub, X — filled dark style` - 6 edges
7. `Group of UI/functional icons: Documentation, Social profile — purple outline style` - 4 edges
8. `FeatureContext` - 3 edges
9. `Alert` - 3 edges
10. `alertVariants (cva)` - 3 edges

## Surprising Connections (you probably didn't know these)
- `index.html (app entry point)` --conceptually_related_to--> `Sidebar`  [INFERRED]
  index.html → src/components/layout/Sidebar.tsx
- `Card` --references--> `CSS Variable Design Token System`  [INFERRED]
  src/components/ui/card.tsx → tailwind.config.js
- `Switch` --references--> `CSS Variable Design Token System`  [INFERRED]
  src/components/ui/switch.tsx → tailwind.config.js
- `Alert` --references--> `CSS Variable Design Token System`  [INFERRED]
  src/components/ui/alert.tsx → tailwind.config.js
- `Badge` --references--> `CSS Variable Design Token System`  [INFERRED]
  src/components/ui/badge.tsx → tailwind.config.js

## Hyperedges (group relationships)
- **CSS Variable-Backed Design System** — tailwind_config, postcss_config, design_token_system [INFERRED 0.85]
- **Radix UI Primitive Wrappers** — label_label, tooltip_tooltip, switch_switch, separator_separator [INFERRED 0.90]
- **UI Primitives Using CVA Variant Pattern** — button_buttonvariants, alert_alertvariants, badge_badgevariants [INFERRED 0.95]

## Communities (55 total, 17 thin omitted)

### Community 0 - "UI Primitives"
Cohesion: 0.24
Nodes (13): Alert, alertVariants (cva), Badge, badgeVariants (cva), Button, buttonVariants (cva), Card, CSS Variable Design Token System (+5 more)

### Community 1 - "Bidding Controls & Reach"
Cohesion: 0.24
Nodes (12): Input, MultiplierSlider, effectiveBid (baseBid * multiplier), MultiplierSummary, displayState (reach estimation state machine), useFeature (FeatureContext), MOCK_RESULTS (reach/delivery data), ReachEstimationWidget (+4 more)

### Community 2 - "Icon Library"
Cohesion: 0.5
Nodes (9): Bluesky social platform icon (butterfly logo, filled dark #08060d), Discord community/chat platform icon (controller-like logo, filled dark #08060d), Documentation icon (document with code chevrons, purple stroke #aa3bff), GitHub source control platform icon (Octocat silhouette, filled dark #08060d), icons.svg — SVG sprite sheet containing 6 icon symbols for UI use, Social/community icon (person silhouette with star/rating badge, purple stroke #aa3bff), Group of social platform icons: Bluesky, Discord, GitHub, X — filled dark style, Group of UI/functional icons: Documentation, Social profile — purple outline style (+1 more)

### Community 4 - "Layout & Navigation"
Cohesion: 0.4
Nodes (5): index.html (app entry point), React + TypeScript + Vite template, NavItem, NavItemRow, Sidebar

### Community 5 - "Feature Context & Reach State"
Cohesion: 0.5
Nodes (4): FeatureContext, FeatureProvider, ReachEstimateState, useFeature

## Knowledge Gaps
- **28 isolated node(s):** `main.tsx Entry Point`, `FeatureProvider`, `useFeature`, `ReachEstimateState`, `CardHeader` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn (class merging utility)` connect `Bidding Controls & Reach` to `Layout & Navigation`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `NavItemRow` connect `Layout & Navigation` to `Bidding Controls & Reach`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `shadcn/ui Component Pattern` (e.g. with `Card` and `Label`) actually correct?**
  _`shadcn/ui Component Pattern` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `icons.svg — SVG sprite sheet containing 6 icon symbols for UI use` (e.g. with `Group of social platform icons: Bluesky, Discord, GitHub, X — filled dark style` and `Group of UI/functional icons: Documentation, Social profile — purple outline style`) actually correct?**
  _`icons.svg — SVG sprite sheet containing 6 icon symbols for UI use` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `CSS Variable Design Token System` (e.g. with `Card` and `Alert`) actually correct?**
  _`CSS Variable Design Token System` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `main.tsx Entry Point`, `FeatureProvider`, `useFeature` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._