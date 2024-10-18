import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './calculator.css';

interface Filter {
  label: string;
  value: string;
  min: number;
  max: number;
  step?: number;
  marks?: { [key: number]: string };
}

const earnoutFilters: Filter[] = [
  {
    label: 'System Install (per month)',
    value: '80',
    min: 0,
    max: 200,
    step: 10,
    marks: {
      0: '0',
      20: '20',
      40: '40',
      60: '60',
      80: '80',
      100: '100',
      120: '120',
      140: '140',
      160: '160',
      180: '180',
      200: '200',
    },
  },
  {
    label: 'Average system size',
    value: '11',
    min: 5,
    max: 15,
    step: 1,
    marks: {
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      13: '13',
      14: '14',
      15: '15',
    },
  },
  { label: 'Growth rate (per month)', value: '20', min: 0, max: 25, step: 5 , marks:{5: '5',
    10: '10',
    15: '15',
    20: '20',
    25: '25',
     }},
  { label: 'Months until Earnout', value: '30', min: 24, max: 60, step: 12, marks:{24: '24',
    36: '36',
    48: '48',
     }  },
];

const equityFilters: Filter[] = [
  { label: 'CAGR', value: '15', min: 10, max: 30, step: 10 },
  { label: 'Years until Next Acquisition / IPO', value: '5', min: 3, max: 7, step: 1 },
];

const Calculator: React.FC = () => {
  const [earnoutValues, setEarnoutValues] = useState<Record<string, number | ''>>({
    'System Install (per month)': 80,
    'Average system size': 11,
    'Growth rate (per month)': 20,
    'Months until Earnout': 30,
  });

  const [equityValues, setEquityValues] = useState<Record<string, number | ''>>({
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

  const calculateEarnout = (): string => {
    // Ensure all values are numbers
    const systemInstallPerMonth = Number(earnoutValues['System Install (per month)']);
    const averageSystemSize = Number(earnoutValues['Average system size']);
    const monthsUntilEarnout = Number(earnoutValues['Months until Earnout']);
  
    // Now the arithmetic operations will work without errors
    const firstvalue = systemInstallPerMonth * averageSystemSize;
    const secondvalue = firstvalue + (100 * monthsUntilEarnout);
  
    const result = secondvalue * 375;
  
    return result.toFixed(2);
  };
  

  const calculateEquityGrowth = (): string => {
    const rate = equityValues['CAGR'] || 0;
    const years = equityValues['Years until Next Acquisition / IPO'] || 0;
    const growth = rate * Math.pow(1 + rate / 100, years);
    return growth.toFixed(2);
  };

  const handleInputChange = (label: string, value: string, type: 'earnout' | 'equity') => {
    if (value === '' || /^\d{0,3}$/.test(value)) {
      const numericValue = value === '' ? '' : Number(value);
      if (type === 'earnout') {
        setEarnoutValues((prev) => ({ ...prev, [label]: numericValue }));
      } else {
        setEquityValues((prev) => ({ ...prev, [label]: numericValue }));
      }
    }
  };

  const handleBlur = (label: string, type: 'earnout' | 'equity') => {
    if (type === 'earnout') {
      if (earnoutValues[label] === '') {
        setEarnoutValues((prev) => ({ ...prev, [label]: getDefaultValue(label, earnoutFilters) }));
      }
    } else {
      if (equityValues[label] === '') {
        setEquityValues((prev) => ({ ...prev, [label]: getDefaultValue(label, equityFilters) }));
      }
    }
  };

  const getDefaultValue = (label: string, filters: Filter[]): number => {
    const filter = filters.find((f) => f.label === label);
    return filter ? (typeof filter.value === 'string' ? parseFloat(filter.value) : filter.value) : 0;
  };

  return (
    <div id="calculator-main">
      {/* Earnout Section */}
      <div className="build-earnout">
        <div className="build-header">
          <h2>Build Earnout</h2>
        </div>
        <div className="build-body">
          {earnoutFilters.map(({ label, min, max, step, marks }) => (
            <div className="filter-wrap" key={label}>
              <div className="body-header">
                <p>{label}</p>
                <div className="input-group">
                  <input
                    type="number"
                    value={earnoutValues[label] !== '' ? earnoutValues[label] : ''}
                    onChange={(e) => handleInputChange(label, e.target.value, 'earnout')}
                    onBlur={() => handleBlur(label, 'earnout')}
                    className="number-input"
                    maxLength={3}
                  />
                  {label === 'Growth rate (per month)' && <span>%</span>}
                  {label === 'Months until Earnout' && <span>months</span>}
                  {label === 'Average system size' && <span>kw</span>}
                </div>
              </div>
              <div className="filter">
                <Slider
                  min={min}
                  max={max}
                  marks={marks}
                  step={step}
                  value={earnoutValues[label] || 0}
                  onChange={(val: number | number[]) => {
                    if (typeof val === 'number') {
                      handleRangeChange(label, val, 'earnout');
                    }
                  }}
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
          {equityFilters.map(({ label, min, max }) => (
            <div className="filter-wrap" key={label}>
              <div className="body-header">
                <p>{label}</p>
                <div className="input-group">
                  <input
                    type="number"
                    value={equityValues[label] !== '' ? equityValues[label] : ''}
                    onChange={(e) => handleInputChange(label, e.target.value, 'equity')}
                    onBlur={() => handleBlur(label, 'equity')}
                    className="number-input"
                    maxLength={3} 
                  />
                  {label === 'CAGR' && <span>%</span>}
                  {label === 'Years until Next Acquisition / IPO' && <span>Yrs</span>}
                </div>
              </div>
              <div className="filter">
                <Slider
                  min={min}
                  max={max}
                  step={1}
                  value={equityValues[label] || 0} 
                  onChange={(val: number | number[]) => {
                    if (typeof val === 'number') {
                      handleRangeChange(label, val, 'equity');
                    }
                  }}
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
