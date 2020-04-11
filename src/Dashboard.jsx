import React from 'react';
import Header from './components/Header';
import Calculator, { Operator } from './components/Calculator';

const operators = [
  new Operator('sqrt', (a) => Math.sqrt(a), 'sqrt', 1),
  new Operator('^', (a, b) => a ** b, '\\^', 2),
  new Operator('%', (a, b) => (a / 100) * b, '\\%', 2),
];

function Dashboard() {
  return (
    <>
      <Header />
      <div className="p-3 my-3">
        <Calculator operators={operators} />
      </div>
    </>
  );
}

export default Dashboard;
