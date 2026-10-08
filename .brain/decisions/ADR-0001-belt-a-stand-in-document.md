# ADR-0001 — Belt A tests the page script against a stand-in document, not a DOM library

- **Status:** accepted
- **Date:** 2026-10-07
- **Governs:** tests/calculator.spec.js (the `aCalculatorPage` / `aStandInElement` / `aBrowserThatRefusesToClose` helpers), src/app.js

## Context

REQ-DEMO-005 (the close button) has behaviour that lives only in `src/app.js`,
the page script, not in `src/calculator.js`. Every requirement needs a belt A
(unit) test, and belt A runs under `node:test` with no browser. The project is
plain JavaScript with no build step, and the JavaScript rules discourage adding
dependencies; the only dev dependency is `@playwright/test`.

## Decision

Belt A loads the real `src/app.js` against hand-made stand-ins: a `document`
whose `getElementById` returns plain objects with `value`, `textContent` and
`addEventListener`, and a `window` whose `close()` records the request and
refuses it. Each test imports `app.js` with its own query string, so every test
gets a fresh copy and no state is shared. The stand-ins are removed in
`t.after`.

Approved in the plan for REQ-DEMO-005@v1 (2026-10-07) and kept for v2.

## Alternatives considered

- **jsdom (or happy-dom) as a dev dependency.** A real DOM, so tests read more
  like the browser. Lost because it adds a dependency the JavaScript rules
  discourage and that would itself need an ADR, for one page script with a
  handful of elements.
- **Reading `app.js` as text and checking for the handler.** No dependency, but
  it asserts how the code is written, not what it does, and breaks on any
  refactor. The testing rules forbid it.
- **Belt B only for this requirement.** Not allowed: every requirement in this
  project lists `belts: [A, B]`.

## Consequences

- Belt A proves behaviour (values after a click), not just that code exists.
- The stand-ins know only what `app.js` uses today. If `app.js` starts using
  another DOM API (for example `querySelector` or `classList`), the stand-in
  must grow, or this decision should be revisited in favour of a DOM library.
- Real browser behaviour (layout, focus, whether a tab actually closes) is
  proven only in belt B.
