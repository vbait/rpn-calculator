/* eslint-disable react/no-array-index-key */
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { chunkArray } from './utils';
import RPNCalculator from './RPNCalculator';
import Operator from './Operator';
import { NUMBERS } from './constants';
import './styles.scss';

const calculator = new RPNCalculator();
calculator.addOperators(
  new Operator('+', (a, b) => a + b),
  new Operator('-', (a, b) => a - b),
  new Operator('*', (a, b) => a * b),
  new Operator('/', (a, b) => a / b),
);

const separator = calculator.separator();
const separatorReplaceRegex = new RegExp(`(${separator.regex}){2,}`, 'g');

function Calculator({ operators: additionalOperators }) {
  const inputRef = useRef();
  const [operators, setOperators] = useState(calculator.operators());
  const [numbers, setNumbers] = useState(calculator.numbers());
  const [value, setValue] = useState('');
  const [error, setError] = useState();
  const [readonly, setReadonly] = useState(false);

  const handleReadonly = useCallback(() => {
    setReadonly((v) => !v);
  }, [setReadonly]);

  const handleChange = useCallback(
    (v) => {
      const formatted = v.replace(separatorReplaceRegex, separator.name);
      setError();
      setValue(formatted);
      inputRef.current.focus();
    },
    [setValue, setError, inputRef],
  );

  const handleApply = useCallback(() => {
    if (!value) return;
    try {
      calculator.eval(value.trim());
      setValue('');
      setNumbers(calculator.numbers());
    } catch (err) {
      setError(err.message);
    }
  }, [setError, setValue, setNumbers, value]);

  const handleBackSpace = useCallback(() => {
    setError();
    setValue((state) => {
      return state.slice(0, -1);
    });
    inputRef.current.focus();
  }, [setError, setValue]);

  const handleClear = useCallback(() => {
    setValue('');
    setError();
  }, [setValue]);

  const handleReset = useCallback(() => {
    calculator.reset();
    setValue('');
    setError();
    setNumbers(calculator.numbers());
  }, [setValue]);

  const handleInputKeyUp = useCallback(
    (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        handleApply();
      }
    },
    [handleApply],
  );

  useEffect(() => {
    const input = inputRef.current;
    input.addEventListener('keyup', handleInputKeyUp);
    return () => {
      input.removeEventListener('keyup', handleInputKeyUp);
    };
  }, [inputRef, handleInputKeyUp]);

  useEffect(() => {
    calculator.addOperators(...additionalOperators);
    setOperators(calculator.operators());
  }, [additionalOperators, setOperators]);

  const chunkedOperators = useMemo(() => {
    return chunkArray(operators, 4);
  }, [operators]);

  return (
    <div className="calculator">
      <div className="filter">
        <Form.Check
          type="checkbox"
          id="id_readonly"
          label="Readonly"
          checked={readonly}
          onChange={handleReadonly}
        />
      </div>
      <div className="display">
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="form-control"
          readOnly={readonly}
          ref={inputRef}
        />
      </div>
      <div className="display">
        <textarea
          className="form-control"
          readOnly
          rows="2"
          disabled
          value={numbers.join(' ')}
        />
        {!!error && <Alert variant="danger">{error}</Alert>}
      </div>
      <div className="reset">
        <Button variant="danger" onClick={handleBackSpace} disabled={!value}>
          {'<-'}
        </Button>
        <Button variant="danger" onClick={handleClear} disabled={!value}>
          CE
        </Button>
        <Button
          variant="danger"
          onClick={handleReset}
          disabled={!numbers.length && !value}
        >
          C
        </Button>
      </div>
      <div className="calculator-container">
        <div className="numbers">
          {NUMBERS.map((v) => (
            <Button key={v} onClick={() => handleChange(value + v)}>
              {v}
            </Button>
          ))}
          <Button onClick={() => handleChange(`${value}0`)} className="double">
            0
          </Button>
          <Button onClick={() => handleChange(`${value}.`)}>.</Button>
        </div>
        {chunkedOperators.map((rows, index) => (
          <div key={index} className="operations">
            {rows.map((operator) => (
              <Button
                key={operator}
                onClick={() => handleChange(value + operator)}
                variant="secondary"
              >
                {operator}
              </Button>
            ))}
          </div>
        ))}
      </div>
      <div className="manipulate">
        <Button
          onClick={() => handleChange(value + separator.name)}
          disabled={!value}
          variant="info"
        >
          space
        </Button>
        <Button
          onClick={handleApply}
          disabled={!value || !!error}
          variant="info"
        >
          apply
        </Button>
      </div>
    </div>
  );
}

Calculator.defaultProps = {
  operators: [],
};

Calculator.propTypes = {
  operators: PropTypes.arrayOf(PropTypes.instanceOf(Operator)),
};

export default Calculator;
