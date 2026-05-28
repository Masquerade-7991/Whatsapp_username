# Graph Report - src  (2026-05-13)

## Corpus Check
- Corpus is ~12,156 words - fits in a single context window. You may not need a graph.

## Summary
- 93 nodes · 49 edges · 49 communities (33 shown, 16 thin omitted)
- Extraction: 71% EXTRACTED · 29% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Primitive Components|UI Primitive Components]]
- [[_COMMUNITY_Form & Navigation UI|Form & Navigation UI]]
- [[_COMMUNITY_Feature Context State|Feature Context State]]
- [[_COMMUNITY_Build Assets|Build Assets]]
- [[_COMMUNITY_App Bootstrap|App Bootstrap]]
- [[_COMMUNITY_Card Header|Card Header]]
- [[_COMMUNITY_Card Title|Card Title]]
- [[_COMMUNITY_Card Description|Card Description]]
- [[_COMMUNITY_Card Content|Card Content]]
- [[_COMMUNITY_Card Footer|Card Footer]]
- [[_COMMUNITY_Tooltip Provider|Tooltip Provider]]
- [[_COMMUNITY_Tooltip Trigger|Tooltip Trigger]]
- [[_COMMUNITY_Tooltip Content|Tooltip Content]]
- [[_COMMUNITY_Alert Title|Alert Title]]
- [[_COMMUNITY_Alert Description|Alert Description]]
- [[_COMMUNITY_TopNav Breadcrumb|TopNav Breadcrumb]]
- [[_COMMUNITY_TopNav Crumb|TopNav Crumb]]
- [[_COMMUNITY_Hero Illustration|Hero Illustration]]
- [[_COMMUNITY_React Logo Asset|React Logo Asset]]

## God Nodes (most connected - your core abstractions)
1. `shadcn/ui Component Pattern` - 8 edges
2. `cn (class merging utility)` - 5 edges
3. `FeatureContext` - 3 edges
4. `alertVariants (cva)` - 3 edges
5. `badgeVariants (cva)` - 3 edges
6. `buttonVariants (cva)` - 3 edges
7. `Input` - 3 edges
8. `NavItemRow` - 3 edges
9. `Alert` - 2 edges
10. `Badge` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Card` --implements--> `shadcn/ui Component Pattern`  [INFERRED]
  src/components/ui/card.tsx → src/components/ui/button.tsx
- `Label` --implements--> `shadcn/ui Component Pattern`  [INFERRED]
  src/components/ui/label.tsx → src/components/ui/button.tsx
- `Tooltip` --implements--> `shadcn/ui Component Pattern`  [INFERRED]
  src/components/ui/tooltip.tsx → src/components/ui/button.tsx
- `Alert` --implements--> `shadcn/ui Component Pattern`  [INFERRED]
  src/components/ui/alert.tsx → src/components/ui/button.tsx
- `alertVariants (cva)` --semantically_similar_to--> `badgeVariants (cva)`  [INFERRED] [semantically similar]
  src/components/ui/alert.tsx → src/components/ui/badge.tsx

## Hyperedges (group relationships)
- **Radix UI Primitive Wrappers** — label_label, tooltip_tooltip, switch_switch, separator_separator [INFERRED 0.90]
- **UI Primitives Using CVA Variant Pattern** — button_buttonvariants, alert_alertvariants, badge_badgevariants [INFERRED 0.95]

## Communities (49 total, 16 thin omitted)

### Community 0 - "UI Primitive Components"
Cohesion: 0.21
Nodes (12): Alert, alertVariants (cva), Badge, badgeVariants (cva), Button, buttonVariants (cva), Card, Label (+4 more)

### Community 1 - "Form & Navigation UI"
Cohesion: 0.32
Nodes (8): Input, Select, NavItem, NavItemRow, Sidebar, Skeleton, Textarea, cn (class merging utility)

### Community 3 - "Feature Context State"
Cohesion: 0.5
Nodes (4): FeatureContext, FeatureProvider, ReachEstimateState, useFeature

## Knowledge Gaps
- **28 isolated node(s):** `main.tsx Entry Point`, `FeatureProvider`, `useFeature`, `ReachEstimateState`, `Card` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 8 inferred relationships involving `shadcn/ui Component Pattern` (e.g. with `Card` and `Label`) actually correct?**
  _`shadcn/ui Component Pattern` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `alertVariants (cva)` (e.g. with `badgeVariants (cva)` and `buttonVariants (cva)`) actually correct?**
  _`alertVariants (cva)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `badgeVariants (cva)` (e.g. with `alertVariants (cva)` and `buttonVariants (cva)`) actually correct?**
  _`badgeVariants (cva)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `main.tsx Entry Point`, `FeatureProvider`, `useFeature` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._