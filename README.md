This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## [LIVE DEMO](https://vbait.github.io/rpn-calculator/)

## Description

[Reverse Polish notation (RPN)](https://en.wikipedia.org/wiki/Reverse_Polish_notation), also known as Polish postfix notation or simply postfix notation, is a mathematical notation in which operators follow their operands. The calculator can work with a keyboard and the UI to allow you to use single or multiple operators and operands when you input a string. Your operators and operands should be separated by one space.

## Solution

### User experience

- the base idea was to use a standard calculator (macOS or Window) with an extra field to see current status of the calculator (stack of operands)
- can work with integer, float and negative numbers
- this calculator allows you to input many operators and operands in one line, they also can be even mixed
- allow using a keyboard or UI buttons
- validate input before computation
- show errors for an input string

### Architectural decision

- react library to build UI
- [RPN Calculator](https://github.com/vbait/rpn-calculator/blob/master/src/components/Calculator/RPNCalculator.js) should be an independent service that allows you to use it with different js frameworks or even node.js REPL
- an input string should be validated before computation (made by a regular expression)
- should support extending to add more operators (+, -, \*, /, ^, ...)
- to create an operator, you should use a special function ([Operator](https://github.com/vbait/rpn-calculator/blob/master/src/components/Calculator/Operator.js)) which provides you to add name, function, regular expression (to understand how to validate it) and count of operands for the function
- react [Calculator](https://github.com/vbait/rpn-calculator/blob/master/src/components/Calculator/Calculator.jsx) component as a wrapper to communicate between RPN Calculator service and end-user.

### Example

```javascript
// create the calculator with an empty list of operators
const calculator = new RPNCalculator();

// add operators
calculator.addOperators(
  new Operator('+', (a, b) => a + b),
  new Operator('-', (a, b) => a - b),
  new Operator('*', (a, b) => a * b),
  new Operator('/', (a, b) => a / b),
  new Operator('sqrt', (a) => Math.sqrt(a), 'sqrt', 1),
  new Operator('^', (a, b) => a ** b, '\\^', 2),
);

// use it
calculator.eval('1 2 3 4 + - +');

// to see the result
calculator.numbers(); // [-4]

/**
 * how it works
 * 3 + 4 = 7
 * 2 - 7 = -5
 * 1 + -5 = -4
 */

// if you want to continue
calculator.eval('4'); // [-4, 4]
calculator.eval('+');
calculator.numbers(); // [0]

// if you want to start from scratch
calculator.reset();
calculator.numbers(); // [] - empty stack

// How to use react component
const operators = [new Operator('%', (a, b) => (a / 100) * b, '\\%', 2)];

<Calculator operators={operators} />;
```

### Nice to have

- add unit and integration tests for react Calculator component
- add real-time validation after tapping separator
- add a better way to show errors for end-user
- avoid to input whatever from a keyboard, only numbers, separator (one space) and basic operators (as macOS or Windows calculators do)
- better error handlers for developers

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.

### `yarn test`

To run tests.
