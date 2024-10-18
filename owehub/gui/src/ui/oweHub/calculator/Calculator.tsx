import React, { useState } from 'react';
import './calculator.css';

interface Filter {
  label: string;
  value: string;
  min: number;
  max: number;
}

const earnoutFilters: Filter[] = [
  { label: 'System Install (per month)', value: '80', min: 0, max: 100 },
  { label: 'Average system size', value: '11 kw', min: 0, max: 20 },
  { label: 'Growth rate (per month)', value: '20%', min: 0, max: 100 },
  { label: 'Months until Earnout', value: '30 months', min: 0, max: 60 },
];

const equityFilters: Filter[] = [
  { label: 'Initial Investment', value: '$10,000', min: 0, max: 50000 },
  { label: 'CAGR', value: '15%', min: 0, max: 100 },
  { label: 'Years until Next Acquisition / IPO', value: '5 Yrs', min: 0, max: 100 },
];

const Calculator: React.FC = () => {
  const [earnoutValues, setEarnoutValues] = useState<Record<string, number>>({
    'System Install (per month)': 80,
    'Average system size': 11,
    'Growth rate (per month)': 20,
    'Months until Earnout': 30,
  });

  const [equityValues, setEquityValues] = useState<Record<string, number>>({
    'Initial Investment': 10000,
    'CAGR': 15,
    'Years until Next Acquisition / IPO': 5,
  });

  const handleRangeChange = (label: string, value: number, type: 'earnout' | 'equity') => {
    if (type === 'earnout') {
      setEarnoutValues((prev) => ({ ...prev, [label]: value }));
    } else {
      setEquityValues((prev) => ({ ...prev, [label]: value }));
    }
  };

  const calculateEarnout = () => {
    // Apply the formula here
    return (earnoutValues['System Install (per month)'] * earnoutValues['Average system size'] * earnoutValues['Months until Earnout']).toFixed(2);
  };

  const calculateEquityGrowth = () => {
    const { 'Initial Investment': investment, 'CAGR': rate, 'Years until Next Acquisition / IPO': years } = equityValues;
    const growth = investment * Math.pow(1 + rate / 100, years);
    return growth.toFixed(2);
  };

  return (
    <div id="calculator-main">
      <div className="build-earnout">
        <div className="build-header">
          <h2>Build Earnout</h2>
        </div>
        <div className="build-body">
          {earnoutFilters.map(({ label, value, min, max }) => (
            <div className="filter-wrap" key={label}>
              <div className="body-header">
                <p>{label}</p>
                <button>{`${earnoutValues[label]} ${value.split(' ')[1] || ''}`}</button>
              </div>
              <div className="filter">
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={earnoutValues[label]}
                  onChange={(e) => handleRangeChange(label, parseInt(e.target.value), 'earnout')}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="build-footer">
          <p className="footer-heading">Earnout Amount</p>
          <button>${calculateEarnout()}</button>
        </div>
      </div>

      <div className="equity-growth">
        <div className="equity-header">
          <h2>Equity Growth</h2>
        </div>
        <div className="equity-body">
          {equityFilters.map(({ label, value, min, max }) => (
            <div className="filter-wrap" key={label}>
              <div className="body-header">
                <p>{label}</p>
                <button>{`${equityValues[label]} ${value.split(' ')[1] || ''}`}</button>
              </div>
              <div className="filter">
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={equityValues[label]}
                  onChange={(e) => handleRangeChange(label, parseInt(e.target.value), 'equity')}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="equity-footer">
          <p className="footer-heading">Equity Value</p>
          <button>${calculateEquityGrowth()}</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
