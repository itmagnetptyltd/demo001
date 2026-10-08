import {
  toNumberText,
  addNumbers,
  subtractNumbers,
  multiplyNumbers,
  divideNumbers,
} from "./calculator.js";

const firstBox = document.getElementById("first-number");
const secondBox = document.getElementById("second-number");
const addButton = document.getElementById("add");
const subtractButton = document.getElementById("subtract");
const multiplyButton = document.getElementById("multiply");
const divideButton = document.getElementById("divide");
const closeButton = document.getElementById("close");
const answerLabel = document.getElementById("answer");

function keepOnlyDigits(event) {
  const box = event.target;
  box.value = toNumberText(box.value);
}

firstBox.addEventListener("input", keepOnlyDigits);
secondBox.addEventListener("input", keepOnlyDigits);

/**
 * Shows the Answer of the given operation, or clears the label if a box is empty.
 * @param {(first: string, second: string) => number | string} operation
 */
function showAnswer(operation) {
  const isComplete = firstBox.value !== "" && secondBox.value !== "";
  answerLabel.textContent = isComplete
    ? String(operation(firstBox.value, secondBox.value))
    : "";
}

addButton.addEventListener("click", () => showAnswer(addNumbers));
subtractButton.addEventListener("click", () => showAnswer(subtractNumbers));
multiplyButton.addEventListener("click", () => showAnswer(multiplyNumbers));
divideButton.addEventListener("click", () => showAnswer(divideNumbers));

// Browsers close the tab only if the page is allowed to; otherwise nothing changes.
closeButton.addEventListener("click", () => window.close());
