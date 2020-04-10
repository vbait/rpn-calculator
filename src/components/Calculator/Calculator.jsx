import React from 'react';
import Button from 'react-bootstrap/Button';
import './styles.scss';

function Calculator() {
  const onChange = () => {};
  const onAnd = () => {};
  return (
    <div className="calculator">
      <div className="display">
        <input type="text" onChange={onChange} className="form-control" />
      </div>
      <div className="display">
        <div className="form-control" />
      </div>
      <div className="reset">
        <Button variant="danger">CE</Button>
        <Button variant="danger">C</Button>
      </div>
      <div className="calculator-container">
        <div className="numbers">
          <Button onClick={() => onAnd(1)}>7</Button>
          <Button>8</Button>
          <Button>9</Button>
          <Button>4</Button>
          <Button>5</Button>
          <Button>6</Button>
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button className="double">0</Button>
          <Button>.</Button>
        </div>
        <div className="operations">
          <Button variant="secondary">+</Button>
          <Button variant="secondary">-</Button>
          <Button variant="secondary">*</Button>
          <Button variant="secondary">/</Button>
        </div>
      </div>
      <div className="manipulate">
        <Button variant="info">space</Button>
        <Button variant="info">apply</Button>
      </div>
    </div>
  );
}

export default Calculator;
