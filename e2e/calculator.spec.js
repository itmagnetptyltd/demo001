import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

// @covers REQ-DEMO-001@v3
test("the Calculator shows two text boxes, two buttons and one answer label", async ({
  page,
}) => {
  await expect(page.getByRole("textbox")).toHaveCount(2);
  await expect(page.getByRole("button")).toHaveCount(2);
  await expect(page.getByRole("status")).toHaveCount(1);
});

// @covers REQ-DEMO-001@v3
test("one button reads Add and the other reads Subtract", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Add", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Subtract", exact: true }),
  ).toBeVisible();
});

// @covers REQ-DEMO-001@v3
test("Add and Subtract sit side by side with Add on the left", async ({
  page,
}) => {
  const add = await page
    .getByRole("button", { name: "Add", exact: true })
    .boundingBox();
  const subtract = await page
    .getByRole("button", { name: "Subtract", exact: true })
    .boundingBox();

  expect(Math.abs(add.y - subtract.y)).toBeLessThanOrEqual(1);
  expect(add.x + add.width).toBeLessThanOrEqual(subtract.x);
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

/** The column top to bottom; the two buttons share one row, measured as one box. */
async function columnBoxes(page) {
  const [first, second, add, subtract, answer] = await Promise.all(
    CONTROLS.map((control) => control.find(page).boundingBox()),
  );
  const buttonRow = {
    x: add.x,
    y: Math.min(add.y, subtract.y),
    width: subtract.x + subtract.width - add.x,
  };
  return [first, second, buttonRow, answer];
}

// @covers REQ-DEMO-001@v3
test("the controls are stacked top to bottom in order", async ({ page }) => {
  const boxes = await columnBoxes(page);

  const tops = boxes.map((box) => box.y);

  expect(tops).toEqual(tops.toSorted((a, b) => a - b));
  expect(new Set(tops).size).toBe(boxes.length);
});

// @covers REQ-DEMO-001@v3
test("every control is centred on the page", async ({ page }) => {
  const pageCentre =
    (await page.evaluate(() => document.documentElement.clientWidth)) / 2;

  const boxes = await columnBoxes(page);

  const offsets = boxes.map((box) =>
    Math.abs(box.x + box.width / 2 - pageCentre),
  );
  expect(Math.max(...offsets)).toBeLessThanOrEqual(1);
});

// @covers REQ-DEMO-001@v3
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
  // @covers REQ-DEMO-001@v3
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
