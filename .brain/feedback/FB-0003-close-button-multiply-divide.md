# FB-0003 — A close (x) in the top right corner, and multiply and divide

- **Received:** 2026-10-07
- **From:** Kartik Chandra Biswas (exact role not stated)
- **Channel:** Message in the build session (`/feedback-capture`), after subtraction was delivered
- **Anchors:** REQ-DEMO-001@v3, REQ-DEMO-002@v2, REQ-DEMO-004@v1
- **Triage:** variation — absorbed (CHG-0003, CHG-0004, CHG-0005)
- **Sentiment:** neutral (new asks; nothing said about what was delivered)

## What they said

> "ADD A CLOSE (x) ON TOP RIGHT corner. And al;so add multiply and Division"

No screenshot or attachment was supplied.

## What we think it means

_A reading, not fact._

Three separate asks:

1. **A close control.** An "x" in the top right corner. The words do not say
   what it closes: the white card, the whole page/tab, or whether it clears the
   text boxes and answer label. "Top right corner" could mean of the card or of
   the browser window.
2. **Multiply.** A way to multiply the two Numbers, probably a third operation
   button beside Add and Subtract.
3. **Divide.** A way to divide the first Number by the second. Not said: what
   to show when the result is not a whole Number (7 ÷ 2), or when the second
   Number is 0.

REQ-DEMO-001@v3 c1 allows exactly two buttons, so all three asks add controls
beyond what is agreed. The Answer is defined in the glossary as a sum or a
difference only. Hence **variation** is proposed for all three. A human decides.

## Resolution

_Open._ `/find-variation` 2026-10-07: all three asks **contradict** REQ-DEMO-001@v3 c1-c2 (exactly two buttons, Add and Subtract), so classified as **variation**. Drafted as CHG-0003 (close x), CHG-0004 (multiply) and CHG-0005 (divide).

2026-10-07: CHG-0003, CHG-0004 and CHG-0005 decided **absorbed** (no charge).
Close clears both text boxes and the answer label, in the card's top right.
Multiply and Divide join Add and Subtract on one row; division shows a whole
number and remainder ("3 r 1"), and nothing when dividing by 0. REQ-DEMO-001
moved to v4; REQ-DEMO-005, 006 and 007 added; all agreed. Build pending.
