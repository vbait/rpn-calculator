const SEPARATOR = ' ';

function Calculator() {
  const stack = [];
  const operators = [];
  const operatorsNames = [];
  let regex = new RegExp();

  function generateRegExp() {
    const names = operatorsNames.reduce((acc, i) => `${acc}\\${i}`, '');
    const separator = `\\${SEPARATOR}`;
    regex = new RegExp(
      `^((\\d+\\.?\\d*${separator})|(\\d*\\.?\\d+${separator})|([${names}]${separator}))*((\\d+\\.?\\d*)|(\\d*\\.?\\d+)|([${names}]))$`,
    );
  }

  function isStackValid(st, operands) {
    return st.length >= operands;
  }

  this.addOperators = (list = []) => {
    Array.prototype.push.apply(operators, list);
    Array.prototype.push.apply(
      operatorsNames,
      list.map((o) => o.name),
    );
    generateRegExp();
    return this;
  };

  this.push = (input) => {
    this.validate(input);
    const temp = [...stack];
    input.split(SEPARATOR).forEach((value) => {
      if (operatorsNames.includes(value)) {
        if (!isStackValid(temp, 2)) {
          throw Error('Too many operators.');
        }
        const { fn } = operators.find(({ name }) => name === value);
        temp.push(fn(temp.pop(), temp.pop()));
      } else if (Number.isNaN(value)) {
        throw Error(`Value ${value} is not a number.`);
      } else {
        temp.push(parseFloat(value));
      }
    });
    stack.splice(0, stack.length, ...temp);
  };

  this.validate = (input) => {
    if (!regex.test(input)) {
      throw Error('Input value is not valid.');
    }
  };

  this.operators = () => [...operatorsNames];

  this.reset = () => {
    stack.splice(0, stack.length);
  };

  this.separator = () => SEPARATOR;

  this.numbers = () => [...stack];
}

function Operator(name, fn) {
  this.name = name;
  this.fn = fn;
}

export { Operator };
export default Calculator;
