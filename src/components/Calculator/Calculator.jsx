import React, { useState, useCallback, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import RPNCalculator, { Operator } from '../../services/RPNCalculator';
import { NUMBERS } from './constants';
import './styles.scss';

const calculator = new RPNCalculator();
calculator.addOperators([
  new Operator('+', (a, b) => a + b),
  new Operator('-', (a, b) => b - a),
  new Operator('*', (a, b) => a * b),
  new Operator('/', (a, b) => b / a),
]);

const separator = calculator.separator();

function Calculator() {
  const inputRef = useRef();
  const [operators] = useState(calculator.operators());
  const [numbers, setNumbers] = useState(calculator.numbers());
  const [value, setValue] = useState('');
  const [error, setError] = useState();
  const [readonly, setReadonly] = useState(false);

  const handleReadonly = useCallback(() => {
    setReadonly((v) => !v);
  }, [setReadonly]);

  const handleChange = useCallback(
    (v) => {
      const formatted = v.replace(/  +/g, ' ');
      setError();
      setValue(formatted);
    },
    [setValue, setError],
  );

  const handleAnd = useCallback(
    (v) => {
      setError();
      setValue((state) => {
        return state + v;
      });
      inputRef.current.focus();
    },
    [setValue, inputRef],
  );

  const handleApply = useCallback(() => {
    try {
      calculator.push(value.trim());
      setValue('');
      setNumbers(calculator.numbers());
    } catch (err) {
      setError(err.message);
    }
  }, [setError, setValue, setNumbers, value]);

  const handleBackSpace = useCallback(() => {
    setError();
    setValue((state) => {
      return state;
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

  return (
    <div className="calculator">
      {!!error && <Alert variant="danger">{error}</Alert>}
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
        <div className="form-control">{numbers.join(' ')}</div>
      </div>
      <div className="reset">
        <Button variant="danger" onClick={handleBackSpace}>
          {'<-'}
        </Button>
        <Button variant="danger" onClick={handleClear}>
          CE
        </Button>
        <Button variant="danger" onClick={handleReset}>
          C
        </Button>
      </div>
      <div className="calculator-container">
        <div className="numbers">
          {NUMBERS.map((v) => (
            <Button key={v} onClick={() => handleAnd(v)}>
              {v}
            </Button>
          ))}
          <Button onClick={() => handleAnd(0)} className="double">
            0
          </Button>
          <Button onClick={() => handleAnd('.')}>.</Button>
        </div>
        <div className="operations">
          {operators.map((operator) => (
            <Button
              key={operator}
              onClick={() => handleAnd(operator)}
              variant="secondary"
            >
              {operator}
            </Button>
          ))}
        </div>
      </div>
      <div className="manipulate">
        <Button
          onClick={() => handleAnd(separator)}
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

export default Calculator;
