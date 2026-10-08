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

export const DIVIDE_BY_ZERO_MESSAGE = "Oops! You can't divide by zero";

/**
 * Divides the first Number by the second, rounded to 2 decimal places and
 * shown without trailing zeros. Dividing by 0 has no Answer; the message is
 * returned instead.
 * @param {string} first - digits only, as returned by toNumberText
 * @param {string} second - digits only, as returned by toNumberText
 * @returns {string} the Answer as shown, e.g. "3", "3.5", "0.69", or the message for ÷ 0
 */
export function divideNumbers(first, second) {
  const divisor = Number.parseInt(second, 10);
  if (divisor === 0) {
    return DIVIDE_BY_ZERO_MESSAGE;
  }
  const quotient = Number.parseInt(first, 10) / divisor;
  // EPSILON nudges exact halves (e.g. 1.005) up before rounding, where float error would round them down.
  return String(Math.round((quotient + Number.EPSILON) * 100) / 100);
}
