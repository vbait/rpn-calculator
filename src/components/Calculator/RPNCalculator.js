import { createValidatorRegExp } from './utils';

/**
 * @typedef {import('./Operator').Operator} Operator
 */

/**
 * @typedef {Object} SEPARATOR
 * @property {string} name
 * @property {string} regex
 */

/** @constant {SEPARATOR} */
const SEPARATOR = { name: ' ', regex: ' ' };

/**
RPN Calculator
@constructor
*/
function Calculator() {
  const stack = []; // stack to keep all numbers

  /**
   * @type {Object.<string, Operator>}
   */
  const operators = {}; // all operators mapped by name
  let regex = new RegExp(); // all operators mapped by name

  /**
   * Validate if operator is presented
   * @param {string} operator Name of Operator
   * @returns {boolean}
   */
  function isOperatorValid(operator) {
    return !!operators[operator];
  }

  /**
   * Validate if has enough operands for operator
   * @param {string} st Stack of numbers
   * @param {number} operands Count of operands
   * @returns {boolean}
   */
  function isStackValid(st, operands) {
    return st.length >= operands;
  }

  /**
   * Return list of operators names
   * @returns {Array.<string>}
   */
  this.operators = () => Object.keys(operators);

  /**
   * Return separator object
   * @returns {SEPARATOR}
   */
  this.separator = () => SEPARATOR;

  /**
   * Return list of operands
   * @returns {Array.<number>}
   */
  this.numbers = () => [...stack];

  /**
   * Add new operators
   * @param {...Operator} args
   */
  this.addOperators = (...args) => {
    args.forEach((operator) => {
      operators[operator.name] = operator;
    });
    regex = createValidatorRegExp(operators, SEPARATOR.regex);
    return this;
  };

  /**
   * Add new values to stack and eval if there are operations
   * @param {string} input String with operators and operands
   * @throws Will throw an error if the operators are not valid or operands are not Number.
   */
  this.push = (input) => {
    this.validate(input);
    const temp = [...stack];
    input.split(SEPARATOR.name).forEach((value) => {
      if (isOperatorValid(value)) {
        const { fn, countOperands } = operators[value];
        if (!isStackValid(temp, countOperands)) {
          throw Error('Too many operators.');
        }
        const args = temp.splice(-1 * countOperands, countOperands);
        const result = parseFloat(fn(...args));
        if (Number.isNaN(result) || result === Infinity) {
          throw Error(
            `Cannot use operator "${value}" to values ${args.join(' ')}.`,
          );
        }
        temp.push(result);
      } else if (Number.isNaN(value) || Number.isNaN(parseFloat(value))) {
        throw Error(`Value "${value}" is not a number.`);
      } else {
        temp.push(parseFloat(value));
      }
    });
    stack.splice(0, stack.length, ...temp);
  };

  /**
   * Validate string
   * @param {string} input String with operators and operands
   * @throws Will throw an error if the operators are not valid or operands are not Number.
   */
  this.validate = (input) => {
    if (!regex.test(input)) {
      throw Error('Input value is not valid.');
    }
  };

  /**
   * Reset calculator
   */
  this.reset = () => {
    stack.splice(0, stack.length);
  };
}

export default Calculator;

// ^((-?\d+\.?\d* )|(-?\d*\.?\d+ )|((sin|cos|\-|\*) ))*((-?\d+\.?\d*)|(-?\d*\.?\d+)|(sin|cos|\-|\*))$
