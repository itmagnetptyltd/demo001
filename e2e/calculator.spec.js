import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

const OPERATIONS = ["Add", "Subtract", "Multiply", "Divide"];

const operationButton = (page, name) =>
  page.getByRole("button", { name, exact: true });

// @covers REQ-DEMO-001@v4
test("the Calculator shows two text boxes, five buttons and one answer label", async ({
  page,
}) => {
  await expect(page.getByRole("textbox")).toHaveCount(2);
  await expect(page.getByRole("button")).toHaveCount(5);
  await expect(page.getByRole("status")).toHaveCount(1);
});

// @covers REQ-DEMO-001@v4
test("the operation buttons read Add, Subtract, Multiply and Divide, and the close button shows an x", async ({
  page,
}) => {
  await expect(operationButton(page, "Add")).toHaveText("Add");
  await expect(operationButton(page, "Subtract")).toHaveText("Subtract");
  await expect(operationButton(page, "Multiply")).toHaveText("Multiply");
  await expect(operationButton(page, "Divide")).toHaveText("Divide");
  await expect(page.getByRole("button", { name: "Close" })).toHaveText("×");
});

// @covers REQ-DEMO-001@v4
test("Add, Subtract, Multiply and Divide sit on one row in that order", async ({
  page,
}) => {
  const [add, subtract, multiply, divide] = await Promise.all(
    OPERATIONS.map((name) => operationButton(page, name).boundingBox()),
  );

  expect(Math.abs(add.y - subtract.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(add.y - multiply.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(add.y - divide.y)).toBeLessThanOrEqual(1);
  expect(add.x + add.width).toBeLessThanOrEqual(subtract.x);
  expect(subtract.x + subtract.width).toBeLessThanOrEqual(multiply.x);
  expect(multiply.x + multiply.width).toBeLessThanOrEqual(divide.x);
});

// @covers REQ-DEMO-001@v4
test("the close button sits in the top right corner of the card", async ({
  page,
}) => {
  const card = await page.getByRole("main").boundingBox();
  const close = await page.getByRole("button", { name: "Close" }).boundingBox();
  const firstBox = await page
    .getByRole("textbox", { name: "First Number" })
    .boundingBox();

  const cardRight = card.x + card.width;
  expect(close.x).toBeGreaterThanOrEqual(card.x);
  expect(close.y).toBeGreaterThanOrEqual(card.y);
  expect(close.x + close.width).toBeLessThanOrEqual(cardRight);
  expect(cardRight - (close.x + close.width)).toBeLessThan(
    cardRight - (firstBox.x + firstBox.width),
  );
  expect(close.y).toBeLessThan(firstBox.y);
});

// @covers REQ-DEMO-003@v1
test("typing a minus sign into an empty text box leaves it empty", async ({
  page,
}) => {
  const box = page.getByRole("textbox", { name: "First Number" });

  await box.pressSequentially("-");

  await expect(box).toHaveValue("");
});

// @covers REQ-DEMO-003@v1
test("typing a decimal point after 12 leaves 12", async ({ page }) => {
  const box = page.getByRole("textbox", { name: "First Number" });
  await box.pressSequentially("12");

  await box.pressSequentially(".");

  await expect(box).toHaveValue("12");
});

// @covers REQ-DEMO-003@v1
test("typing a letter into an empty text box leaves it empty", async ({
  page,
}) => {
  const box = page.getByRole("textbox", { name: "Second Number" });

  await box.pressSequentially("a");

  await expect(box).toHaveValue("");
});

// @covers REQ-DEMO-003@v1
test("typing 25 leaves 25", async ({ page }) => {
  const box = page.getByRole("textbox", { name: "Second Number" });

  await box.pressSequentially("25");

  await expect(box).toHaveValue("25");
});

// @covers REQ-DEMO-002@v2
test("3 and 4 then Add shows 7", async ({ page }) => {
  await page
    .getByRole("textbox", { name: "First Number" })
    .pressSequentially("3");
  await page
    .getByRole("textbox", { name: "Second Number" })
    .pressSequentially("4");

  await page.getByRole("button", { name: "Add", exact: true }).click();

  await expect(page.getByRole("status")).toHaveText("7");
});

// @covers REQ-DEMO-002@v2
test("0 and 5 then Add shows 5", async ({ page }) => {
  await page
    .getByRole("textbox", { name: "First Number" })
    .pressSequentially("0");
  await page
    .getByRole("textbox", { name: "Second Number" })
    .pressSequentially("5");

  await page.getByRole("button", { name: "Add", exact: true }).click();

  await expect(page.getByRole("status")).toHaveText("5");
});

// @covers REQ-DEMO-004@v1
test("7 and 3 then Subtract shows 4", async ({ page }) => {
  await page
    .getByRole("textbox", { name: "First Number" })
    .pressSequentially("7");
  await page
    .getByRole("textbox", { name: "Second Number" })
    .pressSequentially("3");

  await page.getByRole("button", { name: "Subtract", exact: true }).click();

  await expect(page.getByRole("status")).toHaveText("4");
});

// @covers REQ-DEMO-004@v1
test("5 and 5 then Subtract shows 0", async ({ page }) => {
  await page
    .getByRole("textbox", { name: "First Number" })
    .pressSequentially("5");
  await page
    .getByRole("textbox", { name: "Second Number" })
    .pressSequentially("5");

  await page.getByRole("button", { name: "Subtract", exact: true }).click();

  await expect(page.getByRole("status")).toHaveText("0");
});

// @covers REQ-DEMO-004@v1
test("3 and 5 then Subtract shows -2", async ({ page }) => {
  await page
    .getByRole("textbox", { name: "First Number" })
    .pressSequentially("3");
  await page
    .getByRole("textbox", { name: "Second Number" })
    .pressSequentially("5");

  await page.getByRole("button", { name: "Subtract", exact: true }).click();

  await expect(page.getByRole("status")).toHaveText("-2");
});

async function typeNumbers(page, first, second) {
  await page
    .getByRole("textbox", { name: "First Number" })
    .pressSequentially(first);
  await page
    .getByRole("textbox", { name: "Second Number" })
    .pressSequentially(second);
}

// @covers REQ-DEMO-006@v1
test("3 and 4 then Multiply shows 12", async ({ page }) => {
  await typeNumbers(page, "3", "4");

  await page.getByRole("button", { name: "Multiply", exact: true }).click();

  await expect(page.getByRole("status")).toHaveText("12");
});

// @covers REQ-DEMO-006@v1
test("0 and 5 then Multiply shows 0", async ({ page }) => {
  await typeNumbers(page, "0", "5");

  await page.getByRole("button", { name: "Multiply", exact: true }).click();

  await expect(page.getByRole("status")).toHaveText("0");
});

// @covers REQ-DEMO-007@v2
test("6 and 2 then Divide shows 3", async ({ page }) => {
  await typeNumbers(page, "6", "2");

  await page.getByRole("button", { name: "Divide", exact: true }).click();

  await expect(page.getByRole("status")).toHaveText("3");
});

// @covers REQ-DEMO-007@v2
test("7 and 2 then Divide shows 3.5", async ({ page }) => {
  await typeNumbers(page, "7", "2");

  await page.getByRole("button", { name: "Divide", exact: true }).click();

  await expect(page.getByRole("status")).toHaveText("3.5");
});

// @covers REQ-DEMO-007@v2
test("3434 and 5000 then Divide shows 0.69", async ({ page }) => {
  await typeNumbers(page, "3434", "5000");

  await page.getByRole("button", { name: "Divide", exact: true }).click();

  await expect(page.getByRole("status")).toHaveText("0.69");
});

// @covers REQ-DEMO-007@v2
test("1 and 3 then Divide shows 0.33", async ({ page }) => {
  await typeNumbers(page, "1", "3");

  await page.getByRole("button", { name: "Divide", exact: true }).click();

  await expect(page.getByRole("status")).toHaveText("0.33");
});

// @covers REQ-DEMO-007@v2
test("5 and 0 then Divide shows Oops! You can't divide by zero", async ({
  page,
}) => {
  await typeNumbers(page, "5", "0");

  await page.getByRole("button", { name: "Divide", exact: true }).click();

  await expect(page.getByRole("status")).toHaveText(
    "Oops! You can't divide by zero",
  );
});

// @covers REQ-DEMO-007@v2
test("5 and 0 then Divide leaves the text boxes holding 5 and 0", async ({
  page,
}) => {
  await typeNumbers(page, "5", "0");

  await page.getByRole("button", { name: "Divide", exact: true }).click();

  await expect(page.getByRole("textbox", { name: "First Number" })).toHaveValue(
    "5",
  );
  await expect(
    page.getByRole("textbox", { name: "Second Number" }),
  ).toHaveValue("0");
});

// @covers REQ-DEMO-005@v2
test("pressing close closes a tab the page is allowed to close", async ({
  page,
  context,
}) => {
  // Browsers let a page close its tab only when a script opened that tab.
  const [calculatorTab] = await Promise.all([
    context.waitForEvent("page"),
    page.evaluate(() => {
      window.open("/", "_blank");
    }),
  ]);
  await calculatorTab.waitForLoadState();
  const closed = calculatorTab.waitForEvent("close", { timeout: 5000 });

  await calculatorTab.getByRole("button", { name: "Close" }).click();

  await closed;
  expect(calculatorTab.isClosed()).toBe(true);
});

// @covers REQ-DEMO-005@v2
test("pressing close in a tab the browser keeps open changes nothing", async ({
  page,
}) => {
  // This tab was not opened by a script and has more than one history entry,
  // so the browser will not let the page close it.
  await page.goto("/?again");
  await typeNumbers(page, "3", "4");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("7");

  await page.getByRole("button", { name: "Close" }).click();

  expect(page.isClosed()).toBe(false);
  await expect(page.getByRole("textbox", { name: "First Number" })).toHaveValue(
    "3",
  );
  await expect(
    page.getByRole("textbox", { name: "Second Number" }),
  ).toHaveValue("4");
  await expect(page.getByRole("status")).toHaveText("7");
});

const CONTROLS = [
  {
    name: "first text box",
    find: (page) => page.getByRole("textbox", { name: "First Number" }),
    tag: "input",
  },
  {
    name: "second text box",
    find: (page) => page.getByRole("textbox", { name: "Second Number" }),
    tag: "input",
  },
  {
    name: "Add button",
    find: (page) => page.getByRole("button", { name: "Add", exact: true }),
    tag: "button",
  },
  {
    name: "Subtract button",
    find: (page) => page.getByRole("button", { name: "Subtract", exact: true }),
    tag: "button",
  },
  {
    name: "Multiply button",
    find: (page) => page.getByRole("button", { name: "Multiply", exact: true }),
    tag: "button",
  },
  {
    name: "Divide button",
    find: (page) => page.getByRole("button", { name: "Divide", exact: true }),
    tag: "button",
  },
  {
    name: "close button",
    find: (page) => page.getByRole("button", { name: "Close" }),
    tag: "button",
  },
  {
    name: "answer label",
    find: (page) => page.getByRole("status"),
    tag: "output",
  },
];

function lookOf(element) {
  const style = getComputedStyle(element);
  return {
    backgroundColor: style.backgroundColor,
    border: `${style.borderTopWidth} ${style.borderTopStyle} ${style.borderTopColor}`,
    fontSize: style.fontSize,
  };
}

/**
 * The column top to bottom; the four operation buttons share one row, measured
 * as one box. The close button sits in the corner and is not part of the column.
 */
async function columnBoxes(page) {
  const box = (locator) => locator.boundingBox();
  const [first, second, answer] = await Promise.all([
    box(page.getByRole("textbox", { name: "First Number" })),
    box(page.getByRole("textbox", { name: "Second Number" })),
    box(page.getByRole("status")),
  ]);
  const row = await Promise.all(
    OPERATIONS.map((name) => box(operationButton(page, name))),
  );
  const left = row[0];
  const right = row[row.length - 1];
  const buttonRow = {
    x: left.x,
    y: Math.min(...row.map((button) => button.y)),
    width: right.x + right.width - left.x,
  };
  return [first, second, buttonRow, answer];
}

// @covers REQ-DEMO-001@v4
test("the controls are stacked top to bottom in order", async ({ page }) => {
  const boxes = await columnBoxes(page);

  const tops = boxes.map((box) => box.y);

  expect(tops).toEqual(tops.toSorted((a, b) => a - b));
  expect(new Set(tops).size).toBe(boxes.length);
});

// @covers REQ-DEMO-001@v4
test("every control is centred on the page", async ({ page }) => {
  const pageCentre =
    (await page.evaluate(() => document.documentElement.clientWidth)) / 2;

  const boxes = await columnBoxes(page);

  const offsets = boxes.map((box) =>
    Math.abs(box.x + box.width / 2 - pageCentre),
  );
  expect(Math.max(...offsets)).toBeLessThanOrEqual(1);
});

// @covers REQ-DEMO-001@v4
test("the page background is not plain white", async ({ page }) => {
  const background = await page.evaluate(() => {
    const style = getComputedStyle(document.body);
    return { image: style.backgroundImage, colour: style.backgroundColor };
  });

  const isPlainWhite =
    background.image === "none" &&
    ["rgb(255, 255, 255)", "rgba(0, 0, 0, 0)"].includes(background.colour);
  expect(isPlainWhite).toBe(false);
});

for (const control of CONTROLS) {
  // @covers REQ-DEMO-001@v4
  test(`the ${control.name} does not look like the browser default`, async ({
    page,
    context,
  }) => {
    const blank = await context.newPage();
    await blank.setContent(`<${control.tag}>5</${control.tag}>`);
    const defaultLook = await blank.locator(control.tag).evaluate(lookOf);

    const look = await control.find(page).evaluate(lookOf);

    expect(look.backgroundColor).not.toBe(defaultLook.backgroundColor);
    expect(look.border).not.toBe(defaultLook.border);
    expect(look.fontSize).not.toBe(defaultLook.fontSize);
  });
}
