import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// @covers REQ-DEMO-001@v2
test('the Calculator shows two text boxes, one button and one answer label', async ({ page }) => {
  await expect(page.getByRole('textbox')).toHaveCount(2);
  await expect(page.getByRole('button')).toHaveCount(1);
  await expect(page.getByRole('status')).toHaveCount(1);
});

// @covers REQ-DEMO-003@v1
test('typing a minus sign into an empty text box leaves it empty', async ({ page }) => {
  const box = page.getByRole('textbox', { name: 'First Number' });

  await box.pressSequentially('-');

  await expect(box).toHaveValue('');
});

// @covers REQ-DEMO-003@v1
test('typing a decimal point after 12 leaves 12', async ({ page }) => {
  const box = page.getByRole('textbox', { name: 'First Number' });
  await box.pressSequentially('12');

  await box.pressSequentially('.');

  await expect(box).toHaveValue('12');
});

// @covers REQ-DEMO-003@v1
test('typing a letter into an empty text box leaves it empty', async ({ page }) => {
  const box = page.getByRole('textbox', { name: 'Second Number' });

  await box.pressSequentially('a');

  await expect(box).toHaveValue('');
});

// @covers REQ-DEMO-003@v1
test('typing 25 leaves 25', async ({ page }) => {
  const box = page.getByRole('textbox', { name: 'Second Number' });

  await box.pressSequentially('25');

  await expect(box).toHaveValue('25');
});

// @covers REQ-DEMO-002@v1
test('3 and 4 then the button shows 7', async ({ page }) => {
  await page.getByRole('textbox', { name: 'First Number' }).pressSequentially('3');
  await page.getByRole('textbox', { name: 'Second Number' }).pressSequentially('4');

  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByRole('status')).toHaveText('7');
});

// @covers REQ-DEMO-002@v1
test('0 and 5 then the button shows 5', async ({ page }) => {
  await page.getByRole('textbox', { name: 'First Number' }).pressSequentially('0');
  await page.getByRole('textbox', { name: 'Second Number' }).pressSequentially('5');

  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByRole('status')).toHaveText('5');
});

const CONTROLS = [
  { name: "first text box", find: (page) => page.getByRole("textbox", { name: "First Number" }), tag: "input" },
  { name: "second text box", find: (page) => page.getByRole("textbox", { name: "Second Number" }), tag: "input" },
  { name: "button", find: (page) => page.getByRole("button", { name: "Add" }), tag: "button" },
  { name: "answer label", find: (page) => page.getByRole("status"), tag: "output" },
];

function lookOf(element) {
  const style = getComputedStyle(element);
  return {
    backgroundColor: style.backgroundColor,
    border: `${style.borderTopWidth} ${style.borderTopStyle} ${style.borderTopColor}`,
    fontSize: style.fontSize,
  };
}

// @covers REQ-DEMO-001@v2
test("the controls are stacked top to bottom in order", async ({ page }) => {
  const boxes = await Promise.all(CONTROLS.map((control) => control.find(page).boundingBox()));

  const tops = boxes.map((box) => box.y);

  expect(tops).toEqual(tops.toSorted((a, b) => a - b));
  expect(new Set(tops).size).toBe(CONTROLS.length);
});

// @covers REQ-DEMO-001@v2
test("every control is centred on the page", async ({ page }) => {
  const pageCentre = (await page.evaluate(() => document.documentElement.clientWidth)) / 2;

  const boxes = await Promise.all(CONTROLS.map((control) => control.find(page).boundingBox()));

  const offsets = boxes.map((box) => Math.abs(box.x + box.width / 2 - pageCentre));
  expect(Math.max(...offsets)).toBeLessThanOrEqual(1);
});

// @covers REQ-DEMO-001@v2
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
  // @covers REQ-DEMO-001@v2
  test(`the ${control.name} does not look like the browser default`, async ({ page, context }) => {
    const blank = await context.newPage();
    await blank.setContent(`<${control.tag}>5</${control.tag}>`);
    const defaultLook = await blank.locator(control.tag).evaluate(lookOf);

    const look = await control.find(page).evaluate(lookOf);

    expect(look.backgroundColor).not.toBe(defaultLook.backgroundColor);
    expect(look.border).not.toBe(defaultLook.border);
    expect(look.fontSize).not.toBe(defaultLook.fontSize);
  });
}
