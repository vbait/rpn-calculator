/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param chunk_size {Integer} Size of every group
 */
function chunkArray(myArray, chunkSize) {
  let index = 0;
  const arrayLength = myArray.length;
  const tempArray = [];

  for (index = 0; index < arrayLength; index += chunkSize) {
    const myChunk = myArray.slice(index, index + chunkSize);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }
  return tempArray;
}

/**
 * @typedef {Object} Operator
 * @property {string} name Operator name
 * @property {function} fn Operator function
 * @property {string} [regex=`\\${name}`] Regex for validation
 * @property {number} [countOperands=2] Count of function arguments
 */

/**
 * Returns an regular expression to validate input data for RPN Calculator.
 *
 * @param {Object.<string, import('./Operator').Operator>} operators Object with operators (Operator)
 * @param {string} separator Separator between operators and operands
 * @return {string}
 */
function createValidatorRegExp(operators, separator) {
  const operatorsRegex = Object.entries(operators)
    .map(([, { regex: r }]) => {
      return `${r}`;
    })
    .join('|');
  return new RegExp(
    `^((-?\\d+\\.?\\d*${separator})|(-?\\d*\\.?\\d+${separator})|((${operatorsRegex})${separator}))*((-?\\d+\\.?\\d*)|(-?\\d*\\.?\\d+)|(${operatorsRegex}))$`,
  );
}

export { chunkArray, createValidatorRegExp };

// ^((-?\d+\.?\d* )|(-?\d*\.?\d+ )|((sin|cos|\-|\*) ))*((-?\d+\.?\d*)|(-?\d*\.?\d+)|(sin|cos|\-|\*))$
