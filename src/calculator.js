const NOT_A_DIGIT = /[^0-9]/g;

/**
 * Removes every character that is not a digit, so only a whole Number of
 * zero or more can remain.
 * @param {string} text - what was typed into a text box
 * @returns {string} the same text with only the digits 0-9 kept
 */
export function toNumberText(text) {
  return text.replace(NOT_A_DIGIT, "");
}

/**
 * Adds two Numbers.
 * @param {string} first - digits only, as returned by toNumberText
 * @param {string} second - digits only, as returned by toNumberText
 * @returns {number} the Answer
 */
export function addNumbers(first, second) {
  return Number.parseInt(first, 10) + Number.parseInt(second, 10);
}

/**
 * Subtracts the second Number from the first. The Answer can be negative.
 * @param {string} first - digits only, as returned by toNumberText
 * @param {string} second - digits only, as returned by toNumberText
 * @returns {number} the Answer
 */
export function subtractNumbers(first, second) {
  return Number.parseInt(first, 10) - Number.parseInt(second, 10);
}
