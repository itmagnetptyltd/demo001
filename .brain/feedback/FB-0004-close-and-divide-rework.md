# FB-0004 — Close should close; Divide should show the real result; divide by zero needs a message

- **Received:** 2026-10-07
- **From:** Kartik Chandra Biswas (exact role not stated)
- **Channel:** Message in the build session (`/feedback-capture`), after close, Multiply and Divide were built (branch `feat/multiply-divide-close`, PR B, not yet merged)
- **Anchors:** REQ-DEMO-005@v1, REQ-DEMO-007@v1
- **Triage:** variation — absorbed (CHG-0006, CHG-0007, CHG-0008)
- **Sentiment:** negative (about how close and Divide behave as delivered)

## What they said

> "closebutton will close this and divition  will not show like (0 r 3434) the real result will be here, and div by zero will give a message with clearing rtesult"

No screenshot or attachment was supplied.

## What we think it means

_A reading, not fact._

Three separate asks:

1. **Close closes.** The close button should "close this" rather than clear
   the Calculator. Not said: what "this" is (the browser tab, the page, or the
   Calculator card), and what is shown afterwards. Browsers usually refuse to
   let a page close a tab it did not open by script.
2. **Divide shows the real result.** Not "0 r 3434" (what 3434 ÷ a larger Number
   shows today) but "the real result", probably a decimal such as 0.6868. Not
   said: how many decimal places, whether to round, and whether exact results
   (6 ÷ 2) still show as a whole number.
3. **Divide by zero shows a message and clears the result.** Not said: the
   message's words, where it appears (in the answer label or elsewhere), and
   whether "clearing result" also empties the text boxes.

All three reverse answers recorded in `requirements/ANSWERS.md` on 2026-10-07
for CHG-0003 and CHG-0005:

- "What should pressing the close (x) do?" → **Clear everything**
- "What shows when dividing gives a part number, e.g. 7 ÷ 2?" → **3 r 1**
- "What shows when dividing by 0, e.g. 5 ÷ 0?" → **Show nothing**

The delivered behaviour matches those answers and the agreed criteria
(REQ-DEMO-005@v1, REQ-DEMO-007@v1), so this is not a defect. Hence
**variation** is proposed for all three. A human decides.

## Resolution

_Closed._ `/find-variation` 2026-10-07: close-closes and real-result Divide **contradict** REQ-DEMO-005@v1 and REQ-DEMO-007@v1 and the client's own answers of the same day; the ÷ 0 message contradicts REQ-DEMO-007@v1 c3; clearing on ÷ 0 is half already agreed (answer label) and half not covered (text boxes). Drafted as CHG-0006 (close), CHG-0007 (real result) and CHG-0008 (÷ 0 message and clearing).

2026-10-07: CHG-0006, CHG-0007 and CHG-0008 decided **absorbed** (no charge).
Close tries to close the tab (chosen knowing browsers usually refuse). Divide
shows a decimal rounded to 2 places, no trailing zeros. Dividing by 0 shows
"Oops! You can't divide by zero" in the answer label and clears nothing else.
REQ-DEMO-005 moved to v2 and REQ-DEMO-007 to v2, both agreed. Build pending.

2026-10-08: Built and verified. REQ-DEMO-005 v2 and REQ-DEMO-007 v2 `verified`
by `tests/calculator.spec.js` and `e2e/calculator.spec.js`; merged in PR #8
(`feat/close-tab-decimal-divide`). See `constraints/browser-tab-close.md` for
why the close button usually does nothing in a tab the user opened.
