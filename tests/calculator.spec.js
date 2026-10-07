import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { toNumberText, addNumbers, subtractNumbers } from "../src/calculator.js";

const PAGE_URL = new URL("../src/index.html", import.meta.url);
const STYLESHEET_URL = new URL("../src/styles.css", import.meta.url);

function countTags(html, tag) {
  return (html.match(new RegExp(String.raw`<${tag}[\s>]`, "g")) ?? []).length;
}

// @covers REQ-DEMO-001@v3
test("the page holds two text boxes, two buttons and one answer label", async () => {
  const html = await readFile(PAGE_URL, "utf8");

  const counts = {
    textBoxes: countTags(html, "input"),
    buttons: countTags(html, "button"),
    answerLabels: countTags(html, "output"),
  };

  assert.deepEqual(counts, { textBoxes: 2, buttons: 2, answerLabels: 1 });
});

// @covers REQ-DEMO-001@v3
test("the buttons read Add and Subtract", async () => {
  const html = await readFile(PAGE_URL, "utf8");

  const labels = [...html.matchAll(/<button[^>]*>([^<]*)<\/button>/g)].map(
    (match) => match[1].trim(),
  );

  assert.deepEqual(labels, ["Add", "Subtract"]);
});

// @covers REQ-DEMO-001@v3
test("the controls appear in the order first box, second box, Add, Subtract, answer label", async () => {
  const html = await readFile(PAGE_URL, "utf8");

  const positions = [
    "first-number",
    "second-number",
    "add",
    "subtract",
    "answer",
  ].map((id) => html.indexOf(`id="${id}"`));

  assert.deepEqual(
    positions,
    positions.toSorted((a, b) => a - b),
  );
  assert.ok(positions[0] >= 0);
});

// @covers REQ-DEMO-001@v3
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
