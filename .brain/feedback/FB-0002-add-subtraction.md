# FB-0002 — The Calculator should also subtract

- **Received:** 2026-10-07
- **From:** Kartik Chandra Biswas (exact role not stated)
- **Channel:** Message in the build session (`/decompose` prompt), after the running app was shown at http://127.0.0.1:4173/
- **Anchors:** REQ-DEMO-002@v1, REQ-DEMO-001@v2
- **Triage:** variation — absorbed (CHG-0002)
- **Sentiment:** neutral (a new ask; nothing said about the delivered addition)

## What they said

> "add substraction"

Nothing else was said. No screenshot or attachment was supplied.

## What we think it means

_A reading, not fact._

The Calculator should be able to subtract one Number from the other, as well
as add them. The words do not say how the child chooses between adding and
subtracting, or what happens when the second Number is larger than the first.

## Resolution

_Open._ `/find-variation` 2026-10-07: the one ask **contradicts** the agreed
brief ("only can add two numbers") and REQ-DEMO-002@v1, so classified as
**variation**. Drafted as CHG-0002.

2026-10-07: CHG-0002 decided **absorbed** (no charge). Second button labelled
Subtract, beside Add; a negative Answer is shown when the second Number is
larger. REQ-DEMO-001 moved to v3, REQ-DEMO-002 to v2, REQ-DEMO-004 added, all
agreed. Build pending.
