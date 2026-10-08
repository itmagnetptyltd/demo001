# A page can close its own browser tab only if a script opened that tab

- **Discovered:** 2026-10-08
- **Review by:** 2027-04-08
- **Source:** measured in Playwright Chromium (`@playwright/test` 1.63.0) on 2026-10-08; matches the HTML standard's "script-closable" rule
- **Affects:** src/app.js (close button handler), REQ-DEMO-005@v2, e2e/calculator.spec.js

## The constraint

`window.close()` closes the tab only when the browser counts it as
script-closable: the tab was opened by a script (`window.open`), or its history
has a single entry. In every other tab the call is silently ignored. No error is
thrown, so the page can't tell the request was refused.

## How we know

A probe on 2026-10-08 against the running Calculator:

- A Playwright tab that loaded the page with `goto` reported `history.length` = 2
  (`about:blank`, then the page). Pressing the close button left it open
  (no `close` event within 2 s).
- A tab opened from another page with `window.open('/', '_blank')` closed as soon
  as the close button was pressed.

To re-measure: open the Calculator both ways and press the x.

## What we do about it

REQ-DEMO-005@v2 accepts it: the close button calls `window.close()` and nothing
else, and when the browser refuses, the Calculator is left exactly as it was. The
client chose this knowing it usually does nothing in a tab the user opened
(ANSWERS.md, CHG-0006).

Tests: the "tab closes" browser test opens the Calculator from a script; the
"refused" test uses a tab with history. A test that presses close in Playwright's
default tab will never see it close.
