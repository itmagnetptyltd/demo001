# FB-0001 — The Calculator needs a child-friendly design

- **Received:** 2026-10-01
- **From:** Kartik Chandra Biswas (exact role not stated)
- **Channel:** Message in the build session (`/feedback-capture`), after the running app was shown at http://127.0.0.1:4173/
- **Anchors:** REQ-DEMO-001@v1
- **Triage:** variation — absorbed (CHG-0001)
- **Sentiment:** negative (about appearance only; nothing said about behaviour)

## What they said

> "Design need to update as kids like this, a beautiful background, noce add button and lebel textbox apearence is also nice all aligned in same point"

No screenshot or attachment was supplied.

## What we think it means

_A reading, not fact._

The delivered page works but is unstyled browser default. The client wants:

1. A visual design a child would like.
2. A beautiful background.
3. A nicer-looking Add button.
4. Nicer-looking answer label and text boxes.
5. All controls aligned to the same point. Probably one vertical column with
   matching left edges, or centred. The words do not say which.

No agreed requirement says anything about appearance. REQ-DEMO-001@v1 fixes
only *which* controls are on the page (two text boxes, one button, one answer
label), not how they look or where they sit. So this asks for something beyond
the agreed criteria, hence **variation** is proposed.

The alternative reading is **preference**: styling is within the spirit of "a
calculator for a child" and only a matter of taste. A human decides which.

"Beautiful", "nice" and "kids like this" are not testable as written. Any
requirement written from this needs observable criteria: colours, font size,
alignment rule.

## Resolution

_Closed._ `/find-variation` 2026-10-01: all five asks not-covered by any agreed
criterion, so classified as **variation**. Drafted as CHG-0001.

2026-10-01: CHG-0001 decided **absorbed** (no charge), alignment as one centred
column. REQ-DEMO-001 moved to v2 (draft) with design criteria. Build pending.

2026-10-07: Built and verified. REQ-DEMO-001 v2 is `verified` by
`tests/calculator.spec.js` and `e2e/calculator.spec.js`; belt B passed 14/14.
