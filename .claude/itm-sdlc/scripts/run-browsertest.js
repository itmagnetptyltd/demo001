#!/usr/bin/env node
"use strict";

/**
 * Run belt B — real browser tests (Playwright / pytest-playwright).
 *
 * Usage:
 *   node scripts/run-browsertest.js [--project <path>] [--headed|--headless]
 *     [--slice <id-or-name>] [--req REQ-MOD-001[,REQ-MOD-002]]
 *     [--file <e2e-path>] [--grep <text>] [--report|--reporter <name>]
 */

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { globSync } = require("glob");
const { detectAdapters } = require("./lib/adapters");
const { loadSlices } = require("./lib/slices");
const { scanFile } = require("./check-traceability");

const EXIT_OK = 0;
const EXIT_TOOL_ERROR = 2;

function parseArgs(argv) {
  const options = {
    project: process.cwd(),
    headed: true,
    help: false,
    reqs: [],
    files: [],
    slice: "",
    grep: "",
    report: false,
    reporter: "",
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") options.help = true;
    else if (arg === "--headed") options.headed = true;
    else if (arg === "--headless") options.headed = false;
    else if (arg === "--report") options.report = true;
    else if (arg === "--project") {
      i += 1;
      options.project = argv[i];
    } else if (arg === "--slice") {
      i += 1;
      options.slice = argv[i] ?? "";
    } else if (arg === "--grep") {
      i += 1;
      options.grep = argv[i] ?? "";
    } else if (arg === "--reporter") {
      i += 1;
      options.reporter = argv[i] ?? "";
    } else if (arg === "--req") {
      i += 1;
      options.reqs.push(...splitList(argv[i]));
    } else if (arg === "--file") {
      i += 1;
      if (argv[i]) options.files.push(argv[i]);
    } else throw new Error(`unknown option: ${arg}`);
  }
  if (options.reporter) options.report = true;
  return options;
}

function splitList(value) {
  return String(value || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

const REQ_ID = /^REQ-[A-Z]{3,8}-\d{3}$/;

function normaliseReq(id) {
  const text = String(id || "")
    .trim()
    .toUpperCase();
  if (!REQ_ID.test(text)) {
    throw new Error(
      `${id} is not a requirement id. Use REQ-MOD-001 (3–8 letters, 3 digits).`,
    );
  }
  return text;
}

function pythonExe(projectRoot) {
  const win = path.join(projectRoot, ".venv", "Scripts", "python.exe");
  const nix = path.join(projectRoot, ".venv", "bin", "python");
  if (fs.existsSync(win)) return win;
  if (fs.existsSync(nix)) return nix;
  return null;
}

function quote(value) {
  const text = String(value);
  if (/\s/.test(text) && !/^".*"$/.test(text)) return `"${text}"`;
  return text;
}

function isPlaywright(cmd) {
  return /\bplaywright\s+test\b/.test(cmd);
}

function browserCommand(base, options = {}) {
  let cmd = String(base || "").trim();
  if (!cmd) throw new Error("adapter has no commands.e2e");
  const python = options.python;
  if (python && /^pytest\b/.test(cmd)) cmd = `"${python}" -m ${cmd}`;

  const files = (options.files || []).map((file) =>
    quote(String(file).split(path.sep).join("/")),
  );
  if (files.length) {
    if (isPlaywright(cmd)) cmd = `${cmd} ${files.join(" ")}`;
    else if (/\bpytest\b/.test(cmd)) {
      cmd = cmd.replace(/\stests\/e2e\b/, "");
      cmd = `${cmd} ${files.join(" ")}`;
    } else if (/\bdotnet test\b/.test(cmd)) {
      const names = (options.files || []).map((file) =>
        path.basename(file, path.extname(file)),
      );
      const filter = names
        .map((name) => `FullyQualifiedName~${name}`)
        .join("|");
      cmd = /--filter\s+"[^"]*"/.test(cmd)
        ? cmd.replace(/--filter\s+"[^"]*"/, `--filter "${filter}"`)
        : `${cmd} --filter "${filter}"`;
    }
  }

  if (options.grep) {
    const pattern = quote(options.grep);
    if (isPlaywright(cmd)) cmd = `${cmd} --grep ${pattern}`;
    else if (/\bpytest\b/.test(cmd)) cmd = `${cmd} -k ${pattern}`;
  }

  const reporter = options.reporter || (options.report ? "html" : "");
  if (reporter && isPlaywright(cmd) && !/--reporter\b/.test(cmd)) {
    cmd = `${cmd} --reporter=${reporter}`;
  }

  if (options.headed && !/(^|\s)--headed(\s|$)/.test(cmd)) {
    cmd = `${cmd} --headed`;
  }
  return cmd;
}

function sliceCovers(projectRoot, sliceKey) {
  const loaded = loadSlices(projectRoot);
  const key = String(sliceKey || "").trim();
  const found = loaded.slices.find(
    (slice) =>
      String(slice.id) === key ||
      String(slice.name || "").toLowerCase() === key.toLowerCase(),
  );
  if (!found) {
    throw new Error(
      loaded.present
        ? `no slice named ${key} in .brain/slices.yaml`
        : "this project has no .brain/slices.yaml",
    );
  }
  return found.covers.map(normaliseReq);
}

function e2eFiles(projectRoot, adapter) {
  const globs = adapter.e2eGlobs?.length ? adapter.e2eGlobs : ["**/e2e/**"];
  return globSync(globs, {
    cwd: projectRoot,
    absolute: true,
    nodir: true,
    ignore: adapter.ignore || ["**/node_modules/**"],
    windowsPathsNoEscape: true,
  });
}

function filesCovering(projectRoot, adapters, ids) {
  const wanted = new Set(ids);
  const byId = new Map(ids.map((id) => [id, []]));
  for (const adapter of adapters) {
    for (const file of e2eFiles(projectRoot, adapter)) {
      const relative = path
        .relative(projectRoot, file)
        .split(path.sep)
        .join("/");
      for (const hit of scanFile(file, adapter)) {
        if (!wanted.has(hit.id)) continue;
        const list = byId.get(hit.id);
        if (!list.includes(relative)) list.push(relative);
      }
    }
  }
  return byId;
}

function selectedFiles(projectRoot, adapters, options) {
  const ids = options.reqs.map(normaliseReq);
  if (options.slice) ids.push(...sliceCovers(projectRoot, options.slice));
  const uniqueIds = [...new Set(ids)];
  const explicit = options.files.map((file) =>
    String(file).split(path.sep).join("/"),
  );
  if (!uniqueIds.length) return { ids: [], files: explicit };

  const byId = filesCovering(projectRoot, adapters, uniqueIds);
  const missing = uniqueIds.filter((id) => byId.get(id).length === 0);
  if (missing.length) {
    throw new Error(
      `no belt B test covers ${missing.join(", ")}. @covers on an e2e file is what selects it.`,
    );
  }
  const fromReqs = uniqueIds.flatMap((id) => byId.get(id));
  return {
    ids: uniqueIds,
    files: [...new Set([...explicit, ...fromReqs])].sort(),
  };
}

function installChromium(projectRoot, adapter) {
  if (adapter.id === "python") {
    const py = pythonExe(projectRoot) || "python";
    spawnSync(`${quote(py)} -m playwright install chromium`, {
      cwd: projectRoot,
      shell: true,
      stdio: "inherit",
    });
    return;
  }
  if (adapter.id === "javascript" || adapter.id === "typescript") {
    spawnSync("npx --yes playwright install chromium", {
      cwd: projectRoot,
      shell: true,
      stdio: "inherit",
    });
  }
}

function runBrowserTests(projectRoot, options = {}) {
  const adapters = detectAdapters(projectRoot).filter(
    (adapter) => adapter.commands && adapter.commands.e2e,
  );
  if (!adapters.length) {
    throw new Error(
      "no adapter declared commands.e2e (belt B). This project has no browser-test command.",
    );
  }
  const selection = selectedFiles(projectRoot, adapters, options);
  for (const adapter of adapters) {
    installChromium(projectRoot, adapter);
    const cmd = browserCommand(adapter.commands.e2e, {
      headed: options.headed,
      python: adapter.id === "python" ? pythonExe(projectRoot) : null,
      files: selection.files,
      grep: options.grep,
      report: options.report,
      reporter: options.reporter,
    });
    if (selection.ids.length) {
      process.stdout.write(`Requirements: ${selection.ids.join(", ")}\n`);
    }
    process.stdout.write(`Belt B (${adapter.id}): ${cmd}\n`);
    if ((options.report || options.reporter === "html") && isPlaywright(cmd)) {
      process.stdout.write("Report: playwright-report/index.html\n");
    }
    const result = spawnSync(cmd, {
      cwd: projectRoot,
      shell: true,
      stdio: "inherit",
    });
    const code = result.status == null ? 1 : result.status;
    if (code !== 0) return code;
  }
  return EXIT_OK;
}

function main(argv) {
  try {
    const options = parseArgs(argv);
    if (options.help) {
      process.stdout.write(
        [
          "Usage: node scripts/run-browsertest.js [--project <path>] [--headed|--headless]",
          "       [--slice <id-or-name>] [--req REQ-MOD-001] [--file <e2e-path>]",
          "       [--grep <text>] [--report | --reporter html]",
          "",
        ].join("\n"),
      );
      return EXIT_OK;
    }
    return runBrowserTests(path.resolve(options.project), options);
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    return EXIT_TOOL_ERROR;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = {
  parseArgs,
  browserCommand,
  pythonExe,
  sliceCovers,
  filesCovering,
  selectedFiles,
  runBrowserTests,
  main,
};
