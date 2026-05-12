# Graph Report - w-bidding  (2026-05-08)

## Corpus Check
- 35 files · ~84,174 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 55 nodes · 22 edges · 33 communities (32 shown, 1 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8ac79915`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 1|Community 1]]

## God Nodes (most connected - your core abstractions)
1. `fmtINR()` - 2 edges
2. `formatCost()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `formatCost()` --calls--> `fmtINR()`  [INFERRED]
  src/pages/Reports.tsx → src/lib/format.ts

## Communities (33 total, 1 thin omitted)

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._