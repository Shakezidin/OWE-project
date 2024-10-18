import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './calculator.css';

interface Filter {
  label: string;
  value: string;
  min: number;
  max: number;
  step?:number;
  marks?:{[key:number]:string};
}

const earnoutFilters: Filter[] = [
  { label: 'System Install (per month)', value: '80', min: 0, max: 200 , step:10, marks:{0: '0',
    20: '20',
    40: '40',
    60: '60',
    80: '80',
    100: '100',
    120: '120',
    140: '140',
    160: '160',
    180: '180',
    200: '200',}},
  { label: 'Average system size', value: '11 kw', min: 5, max: 15 , step:1 , marks:{5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: '11',
    12: '12',
    13: '13',
    14: '14',
    15: '15',} },
  { label: 'Growth rate (per month)', value: '20%', min: 0, max: 25 , step:5},
  { label: 'Months until Earnout', value: '30 months', min:24 , max: 60 , step:12},
];

const equityFilters: Filter[] = [
  { label: 'Initial Investment', value: '$10,000', min: 0, max: 50000 },
  { label: 'CAGR', value: '15%', min: 10, max: 30 , step:10},
  { label: 'Years until Next Acquisition / IPO', value: '5 Yrs', min: 3, max: 7 , step:1 },
];

 

const Calculator: React.FC = () => {
  // State for Earnout Values
  const [earnoutValues, setEarnoutValues] = useState<Record<string, number>>({
    'System Install (per month)': 80,
    'Average system size': 11,
    'Growth rate (per month)': 20,
    'Months until Earnout': 30,
  });

  // State for Equity Values
  const [equityValues, setEquityValues] = useState<Record<string, number>>({
    'Initial Investment': 10000,
    'CAGR': 15,
    'Years until Next Acquisition / IPO': 5,
  });

  // Handle Slider Changes
  const handleRangeChange = (label: string, value: number, type: 'earnout' | 'equity') => {
    if (type === 'earnout') {
      setEarnoutValues((prev) => ({ ...prev, [label]: value }));
    } else {
      setEquityValues((prev) => ({ ...prev, [label]: value }));
    }
  };

  // Calculate Earnout Value
  const calculateEarnout = (): string => {
    const result =
      earnoutValues['System Install (per month)'] *
      earnoutValues['Average system size'] *
      earnoutValues['Months until Earnout'];
    return result.toFixed(2);
  };

  // Calculate Equity Growth
  const calculateEquityGrowth = (): string => {
    const { 'Initial Investment': investment, 'CAGR': rate, 'Years until Next Acquisition / IPO': years } = equityValues;
    const growth = investment * Math.pow(1 + rate / 100, years);
    return growth.toFixed(2);
  };

  return (
    <div id="calculator-main">
      {/* Earnout Section */}
      <div className="build-earnout">
        <div className="build-header">
          <h2>Build Earnout</h2>
        </div>
        <div className="build-body">
          {earnoutFilters.map(({ label, value, min, max ,step, marks}) => (
            <div className="filter-wrap" key={label}>
              <div className="body-header">
                <p>{label}</p>
                <button>{`${earnoutValues[label]} ${value.split(' ')[1] || ''}`}</button>
              </div>
              <div className="filter">
                <Slider
                  min={min}
                  max={max}
                  marks={marks}
                  step={step}
                  value={earnoutValues[label]}
                  onChange={(val) => handleRangeChange(label, val as number, 'earnout')}
                  railStyle={{ backgroundColor: '#e4e4e4', height: 2 }}
                  trackStyle={{ backgroundColor: '#00c8ff', height: 4 }}
                  handleStyle={{
                    borderColor: '#00c8ff',
                    height: 18,
                    width: 18,
                    marginTop: -7,
                    backgroundColor: '#fff',
                  }}
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

      {/* Equity Growth Section */}
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
                <Slider
                  min={min}
                  max={max}
                  
                  step={1}
                  value={equityValues[label]}
                  onChange={(val) => handleRangeChange(label, val as number, 'equity')}
                  railStyle={{ backgroundColor: '#e4e4e4', height: 2 }}
                  trackStyle={{ backgroundColor: '#00c8ff', height: 4 }}
                  handleStyle={{
                    borderColor: '#00c8ff',
                    height: 18,
                    width: 18,
                    marginTop: -7,
                    backgroundColor: '#fff',
                  }}
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
