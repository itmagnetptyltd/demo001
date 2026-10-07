import { toNumberText, addNumbers, subtractNumbers } from "./calculator.js";

const firstBox = document.getElementById("first-number");
const secondBox = document.getElementById("second-number");
const addButton = document.getElementById("add");
const subtractButton = document.getElementById("subtract");
const answerLabel = document.getElementById("answer");

function keepOnlyDigits(event) {
  const box = event.target;
  box.value = toNumberText(box.value);
}

firstBox.addEventListener("input", keepOnlyDigits);
secondBox.addEventListener("input", keepOnlyDigits);

/**
 * Shows the Answer of the given operation, or clears the label if a box is empty.
 * @param {(first: string, second: string) => number} operation
 */
function showAnswer(operation) {
  const isComplete = firstBox.value !== "" && secondBox.value !== "";
  answerLabel.textContent = isComplete
    ? String(operation(firstBox.value, secondBox.value))
    : "";
}

addButton.addEventListener("click", () => showAnswer(addNumbers));
subtractButton.addEventListener("click", () => showAnswer(subtractNumbers));
