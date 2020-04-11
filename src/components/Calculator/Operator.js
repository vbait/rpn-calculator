/**
 * @typedef {Object} Operator
 * @property {string} name Operator name
 * @property {function} fn Operator function
 * @property {string} [regex=`\\${name}`] Regex for validation
 * @property {number} [countOperands=2] Count of function arguments
 */

/**
Operator for RPN Calculator
@constructor
@param {string} name Operator name
@param {function} fn Operator function
@param {string} [regex=`\\${name}`] Regex for validation
@param {number} [countOperands=2] Count of function arguments
*/
function Operator(name, fn, regex, countOperands = 2) {
  this.name = name;
  this.regex = regex || `\\${name}`;
  this.countOperands = countOperands;
  this.fn = fn;
}

export default Operator;
