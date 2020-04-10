import React from 'react';
import Header from './components/Header';
import Calculator from './components/Calculator';

function Dashboard() {
  return (
    <>
      <Header />
      <div className="p-3 my-3">
        <Calculator />
      </div>
    </>
  );
}

export default Dashboard;
