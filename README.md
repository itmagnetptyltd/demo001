# Demo Calculator

A single-page Calculator for a child: two text boxes, one button and one answer
label. Type a Number into each box, press the button, and the Answer — the sum of
the two Numbers — appears in the label.

A Number is a whole number of zero or more. The text boxes refuse anything else
(minus signs, decimal points, letters), so invalid input cannot be entered.

Plain JavaScript, no build step, no runtime dependencies.

## Requirements

- Node.js 20 or later

## Run it

```
npm install
npm start
```

Then open <http://127.0.0.1:4173>. Set `PORT` to use a different port.

## Test it

| Command | What it runs |
|---|---|
| `npm test` | Unit tests (`tests/`) with `node:test` |
| `npm run coverage` | Unit tests with line coverage |
| `npm run lint` | Syntax check of the source files |
| `npm run test:e2e` | Browser tests (`e2e/`) in Chromium via Playwright |

Browser tests start their own server on port 4174. To watch them run in a visible
browser, use `/run-browsertest` or double-click `scripts/run-browsertest.cmd`.
The first run may need `npx playwright install chromium`.

## Layout

```
src/
  index.html      the page
  calculator.js   addition and input rules
  app.js          wires the page to calculator.js
  styles.css      look and layout
  server.js       static server for the five files above, nothing else
tests/            unit tests
e2e/              browser tests
.brain/           requirements, decisions and the glossary — the project record
```

## Project record

What the Calculator must do is agreed in `.brain/requirements/`
(`REQ-DEMO-001` to `REQ-DEMO-003`), and the words used for it are fixed in
`.brain/glossary.md`. Every test names the requirement it covers with an
`@covers` annotation. Changes to `.brain/` go through a reviewed pull request.
