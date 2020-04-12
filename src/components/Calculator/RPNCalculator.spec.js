import RPNCalculator from './RPNCalculator';
import Operator from './Operator';

const operators = [
  new Operator('+', (a, b) => a + b),
  new Operator('-', (a, b) => a - b),
  new Operator('/', (a, b) => a / b),
];

describe('RPN Calculator initialization', () => {
  test('should create empty calculator', () => {
    const calculator = new RPNCalculator();
    expect(calculator.operators()).toEqual([]);
    expect(calculator.numbers()).toEqual([]);
    expect(calculator.separator()).toEqual({ name: ' ', regex: ' ' });
  });

  test('should create calculator and add operators', () => {
    const calculator = new RPNCalculator();
    calculator.addOperators(...operators);
    expect(calculator.operators()).toEqual(
      operators.map((operator) => operator.name),
    );
  });

  test('should add numbers and reset calculator', () => {
    const calculator = new RPNCalculator();
    calculator.eval('1 2');
    expect(calculator.numbers()).toEqual([1, 2]);
    calculator.reset();
    expect(calculator.numbers()).toEqual([]);
  });
});

describe('RPN Calculator validation', () => {
  let calculator;
  beforeEach(() => {
    calculator = new RPNCalculator();
    calculator.addOperators(...operators);
  });

  afterEach(() => {
    calculator.reset();
  });

  test('single line input is valid', () => {
    calculator.eval('5 5 5 8 + + -');
    expect(calculator.numbers()).toEqual([-13]);
  });

  test('multiple lines input is valid', () => {
    calculator.eval('5 5 5 8 + + -');
    expect(calculator.numbers()).toEqual([-13]);
    calculator.eval('1 1 +');
    expect(calculator.numbers()).toEqual([-13, 2]);
  });

  test('single line input is invalid', () => {
    expect(() => calculator.eval('5 ')).toThrow(Error);
    expect(() => calculator.eval('a')).toThrow(Error);
    expect(() => calculator.eval('-')).toThrow(Error);
    expect(() => calculator.eval('1 2 *')).toThrow(Error);
  });

  test('multiple lines input is invalid', () => {
    calculator.eval('5 5 +');
    expect(calculator.numbers()).toEqual([10]);
    expect(() => calculator.eval('+')).toThrow(Error);
    expect(() => calculator.eval('a')).toThrow(Error);
    expect(calculator.numbers()).toEqual([10]);
    calculator.eval('5');
    expect(calculator.numbers()).toEqual([10, 5]);
  });

  test('should work correct with float values', () => {
    calculator.eval('4.5 5.5 +');
    expect(calculator.numbers()).toEqual([10]);
  });

  test('should work correct with negative values', () => {
    calculator.eval('-5 5 +');
    expect(calculator.numbers()).toEqual([0]);
  });

  test('error when dividing to zero', () => {
    expect(() => calculator.eval('10 0 /')).toThrow(Error);
  });
});

describe('RPN Calculator custom operations', () => {
  let calculator;
  beforeEach(() => {
    calculator = new RPNCalculator();
  });

  afterEach(() => {
    calculator.reset();
  });

  test('should work with custom operator for 3 values', () => {
    calculator.addOperators(
      new Operator('custom', (a, b, c) => a + b + c, 'custom', 3),
    );
    calculator.eval('1 2 3 custom');
    expect(calculator.numbers()).toEqual([6]);
    calculator.reset();
    expect(() => calculator.eval('1 2 custom')).toThrow(Error);
  });

  test('error when custom operator with invalid regex', () => {
    calculator.addOperators(
      new Operator('custom', (a, b, c) => a + b + c, 'bad', 3),
    );
    expect(() => calculator.eval('1 2 3 custom')).toThrow(Error);
    expect(() => calculator.eval('1 2 3 bad')).toThrow(Error);
  });
});
