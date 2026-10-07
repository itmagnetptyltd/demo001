---
name: run-browsertest
description: Run belt B browser tests in Chromium. Use when asked to run browser tests, e2e, Playwright, /run-browsertest, or to watch the UI tests click.
allowed-tools: Read, Grep, Glob, Bash
---

# run-browsertest

Opens Chromium and runs the project's belt B tests (`e2e/`). Starts its own
app server. Does **not** use a site you already have open.

`--project` is the **client app** (has `.brain/` + `.claude/itm-sdlc/`).

---

## Before running a vendored script

```bash
[ -f .claude/itm-sdlc/scripts/run-browsertest.js ] || echo "vendored toolkit predates run-browsertest.js - re-run install.js"
```

If it is missing, say that and stop.

---

## 1. Run

From the project root, with the browser **visible**. No extra flags runs every belt B test:

```
node .claude/itm-sdlc/scripts/run-browsertest.js --project . --headed
```

One slice from `.brain/slices.yaml` (its id or its name). One requirement. One file. A title filter. An HTML report. Combine them.

```
node .claude/itm-sdlc/scripts/run-browsertest.js --project . --slice 5 --report
node .claude/itm-sdlc/scripts/run-browsertest.js --project . --req REQ-TRV-017,REQ-TRV-018 --report
node .claude/itm-sdlc/scripts/run-browsertest.js --project . --file e2e/save-reopen.spec.ts --report
node .claude/itm-sdlc/scripts/run-browsertest.js --project . --grep "login" --headless --report
```

`--slice` and `--req` run only e2e files whose `@covers` names those ids. A requirement with no belt B file stops the run. `--report` writes `playwright-report/index.html` in the client project. Open it with `npx playwright show-report`.

Headless (CI-style):

```
node .claude/itm-sdlc/scripts/run-browsertest.js --project . --headless
```

On Windows, double-click `scripts/run-browsertest.cmd` — same thing, headed. Extra flags can follow: `scripts\run-browsertest.cmd --req REQ-TRV-017 --report`.

Show the command output as written. Do not paraphrase a failure into a lecture.

## 2. Do not

- Point the tests at a URL the developer already opened.
- Start `/tdd` or `/dashboard` from here.
- Edit `.brain/`.

---

## Then

Green: belt B passed. Red: `/fix` the failing e2e, do not skip it. Lost? `/help`
