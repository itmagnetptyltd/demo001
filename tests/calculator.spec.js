import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  toNumberText,
  addNumbers,
  subtractNumbers,
  multiplyNumbers,
  divideNumbers,
} from "../src/calculator.js";

const PAGE_URL = new URL("../src/index.html", import.meta.url);
const STYLESHEET_URL = new URL("../src/styles.css", import.meta.url);

function countTags(html, tag) {
  return (html.match(new RegExp(String.raw`<${tag}[\s>]`, "g")) ?? []).length;
}

function buttonText(html, id) {
  const match = html.match(
    new RegExp(String.raw`<button[^>]*id="${id}"[^>]*>([^<]*)</button>`),
  );
  return match?.[1].trim();
}

// @covers REQ-DEMO-001@v4
test("the page holds two text boxes, five buttons and one answer label", async () => {
  const html = await readFile(PAGE_URL, "utf8");

  const counts = {
    textBoxes: countTags(html, "input"),
    buttons: countTags(html, "button"),
    answerLabels: countTags(html, "output"),
  };

  assert.deepEqual(counts, { textBoxes: 2, buttons: 5, answerLabels: 1 });
});

// @covers REQ-DEMO-001@v4
test("the operation buttons read Add, Subtract, Multiply, Divide and the close button shows an x", async () => {
  const html = await readFile(PAGE_URL, "utf8");

  const labels = ["add", "subtract", "multiply", "divide", "close"].map((id) =>
    buttonText(html, id),
  );

  assert.deepEqual(labels, ["Add", "Subtract", "Multiply", "Divide", "×"]);
});

// @covers REQ-DEMO-001@v4
test("the controls appear in the order first box, second box, Add, Subtract, Multiply, Divide, answer label", async () => {
  const html = await readFile(PAGE_URL, "utf8");

  const positions = [
    "first-number",
    "second-number",
    "add",
    "subtract",
    "multiply",
    "divide",
    "answer",
  ].map((id) => html.indexOf(`id="${id}"`));

  assert.deepEqual(
    positions,
    positions.toSorted((a, b) => a - b),
  );
  assert.ok(positions[0] >= 0);
});

// @covers REQ-DEMO-001@v4
test("the page links the Calculator stylesheet", async () => {
  const html = await readFile(PAGE_URL, "utf8");

  const stylesheet = await readFile(STYLESHEET_URL, "utf8");

  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
  assert.ok(stylesheet.length > 0);
});

// @covers REQ-DEMO-003@v1
test("a minus sign is removed from a Number", () => {
  assert.equal(toNumberText("-"), "");
});

// @covers REQ-DEMO-003@v1
test("a decimal point is removed from a Number", () => {
  assert.equal(toNumberText("12."), "12");
});

// @covers REQ-DEMO-003@v1
test("a letter is removed from a Number", () => {
  assert.equal(toNumberText("a"), "");
});

// @covers REQ-DEMO-003@v1
test("digits are kept as typed", () => {
  assert.equal(toNumberText("25"), "25");
});

// @covers REQ-DEMO-002@v2
test("3 and 4 give the Answer 7", () => {
  assert.equal(addNumbers("3", "4"), 7);
});

// @covers REQ-DEMO-002@v2
test("0 and 5 give the Answer 5", () => {
  assert.equal(addNumbers("0", "5"), 5);
});

// @covers REQ-DEMO-004@v1
test("7 minus 3 gives the Answer 4", () => {
  assert.equal(subtractNumbers("7", "3"), 4);
});

// @covers REQ-DEMO-004@v1
test("5 minus 5 gives the Answer 0", () => {
  assert.equal(subtractNumbers("5", "5"), 0);
});

// @covers REQ-DEMO-004@v1
test("3 minus 5 gives the Answer -2", () => {
  assert.equal(subtractNumbers("3", "5"), -2);
});

// @covers REQ-DEMO-006@v1
test("3 times 4 gives the Answer 12", () => {
  assert.equal(multiplyNumbers("3", "4"), 12);
});

// @covers REQ-DEMO-006@v1
test("0 times 5 gives the Answer 0", () => {
  assert.equal(multiplyNumbers("0", "5"), 0);
});

// @covers REQ-DEMO-007@v2
test("6 divided by 2 gives the Answer 3", () => {
  assert.equal(divideNumbers("6", "2"), "3");
});

// @covers REQ-DEMO-007@v2
test("7 divided by 2 gives the Answer 3.5", () => {
  assert.equal(divideNumbers("7", "2"), "3.5");
});

// @covers REQ-DEMO-007@v2
test("3434 divided by 5000 gives the Answer 0.69", () => {
  assert.equal(divideNumbers("3434", "5000"), "0.69");
});

// @covers REQ-DEMO-007@v2
test("1 divided by 3 gives the Answer 0.33", () => {
  assert.equal(divideNumbers("1", "3"), "0.33");
});

// @covers REQ-DEMO-007@v2
test("dividing by 0 gives the message", () => {
  assert.equal(divideNumbers("5", "0"), "Oops! You can't divide by zero");
});

const APP_URL = new URL("../src/app.js", import.meta.url);

/** A stand-in for one page element: just what app.js reads and writes. */
function aStandInElement() {
  const handlers = {};
  return {
    value: "",
    textContent: "",
    addEventListener: (type, handler) => {
      handlers[type] = handler;
    },
    fire: (type) => handlers[type]?.({ target: undefined }),
  };
}

/** Loads a fresh copy of app.js against a stand-in document. */
async function aCalculatorPage(name) {
  const ids = [
    "first-number",
    "second-number",
    "add",
    "subtract",
    "multiply",
    "divide",
    "close",
    "answer",
  ];
  const elements = Object.fromEntries(ids.map((id) => [id, aStandInElement()]));
  globalThis.document = { getElementById: (id) => elements[id] ?? null };
  globalThis.window = aBrowserThatRefusesToClose();
  await import(`${APP_URL.href}?page=${name}`);
  return { ...elements, window: globalThis.window };
}

/** A stand-in window: records each request to close the tab, and refuses it. */
function aBrowserThatRefusesToClose() {
  const browser = {
    closeRequests: 0,
    close: () => {
      browser.closeRequests += 1;
    },
  };
  return browser;
}

function forgetTheStandIns() {
  delete globalThis.document;
  delete globalThis.window;
}

// @covers REQ-DEMO-005@v2
test("pressing close asks the browser to close the tab", async (t) => {
  t.after(forgetTheStandIns);
  const page = await aCalculatorPage("close-asks");

  page.close.fire("click");

  assert.equal(page.window.closeRequests, 1);
});

// @covers REQ-DEMO-005@v2
test("pressing close when the browser refuses leaves 3, 4 and 7 as they were", async (t) => {
  t.after(forgetTheStandIns);
  const page = await aCalculatorPage("close-refused");
  page["first-number"].value = "3";
  page["second-number"].value = "4";
  page.add.fire("click");
  assert.equal(page.answer.textContent, "7");

  page.close.fire("click");

  assert.deepEqual(
    [
      page["first-number"].value,
      page["second-number"].value,
      page.answer.textContent,
    ],
    ["3", "4", "7"],
  );
});
