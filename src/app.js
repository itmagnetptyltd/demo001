import { toNumberText, addNumbers } from './calculator.js';

const firstBox = document.getElementById('first-number');
const secondBox = document.getElementById('second-number');
const addButton = document.getElementById('add');
const answerLabel = document.getElementById('answer');

function keepOnlyDigits(event) {
  const box = event.target;
  box.value = toNumberText(box.value);
}

firstBox.addEventListener('input', keepOnlyDigits);
secondBox.addEventListener('input', keepOnlyDigits);

addButton.addEventListener('click', () => {
  const isComplete = firstBox.value !== '' && secondBox.value !== '';
  answerLabel.textContent = isComplete ? String(addNumbers(firstBox.value, secondBox.value)) : '';
});
