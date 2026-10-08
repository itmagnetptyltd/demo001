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

/**
 * Multiplies two Numbers.
 * @param {string} first - digits only, as returned by toNumberText
 * @param {string} second - digits only, as returned by toNumberText
 * @returns {number} the Answer
 */
export function multiplyNumbers(first, second) {
  return Number.parseInt(first, 10) * Number.parseInt(second, 10);
}

/**
 * Divides the first Number by the second, as a whole number and a remainder.
 * The remainder is shown only when it is not 0; dividing by 0 has no Answer.
 * @param {string} first - digits only, as returned by toNumberText
 * @param {string} second - digits only, as returned by toNumberText
 * @returns {string} the Answer as shown, e.g. "3", "3 r 1", or "" for ÷ 0
 */
export function divideNumbers(first, second) {
  const dividend = Number.parseInt(first, 10);
  const divisor = Number.parseInt(second, 10);
  if (divisor === 0) {
    return "";
  }
  const quotient = Math.trunc(dividend / divisor);
  const remainder = dividend % divisor;
  return remainder === 0 ? String(quotient) : `${quotient} r ${remainder}`;
}
