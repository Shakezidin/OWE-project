import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './calculator.css';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { IoMdRefresh } from "react-icons/io";

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
    step: 5,
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
  {
    label: 'Growth rate (per month)', value: '20', min: 0, max: 25, step: 1, marks: {
      0: '0', 5: '5',
      10: '10',
      15: '15',
      20: '20',
      25: '25',
    }
  },
  {
    label: 'Months until Earnout', value: '30', min: 24, max: 60, step: 1, marks: {
      24: '24',
      30: '30',
      36: '36',
      42: '42',
      48: '48',
      54: '54',
      60: '60'
    }
  },
];

const equityFilters: Filter[] = [
  {
    label: 'CAGR', value: '15', min: 10, max: 30, step: 1, marks: {
      10: '10',
      15: '15',
      20: '20',
      25: '25',
      30: '30'

    }
  },
  {
    label: 'Years until Next Acquisition / IPO', value: '5', min: 3, max: 7, step: 1, marks: {
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7'
    }
  },
];

const Calculator: React.FC = () => {
  const [earnoutValues, setEarnoutValues] = useState<Record<string, number | ''>>({
    'System Install (per month)': 0,
    'Average system size': 0,
    'Growth rate (per month)': 0,
    'Months until Earnout': 0,
    'Equity Per': 0,
  });

  const [equityValues, setEquityValues] = useState<Record<string, number | ''>>({

    'CAGR': 0,
    'Years until Next Acquisition / IPO': 0,
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

    // Calculate the first value
    let firstvalue = systemInstallPerMonth * averageSystemSize;
    // Add 100 for each month
    firstvalue += 100 * monthsUntilEarnout; // Adds 100 for each month until earnout
    const result = firstvalue * 375;
    return result.toFixed(2);
  };

  const [activeRole, setActiveRole] = useState('Partner');

  const calculateEquityGrowth = (): string => {
    const rate = equityValues['CAGR'] || 0;
    const years = equityValues['Years until Next Acquisition / IPO'] || 0;
    const growth = rate * Math.pow(1 + rate / 100, years);
    return growth.toFixed(2);
  };
  const [selectedRole, setSelectedRole] = useState<'Partner' | 'Sales Rep' | null>(null); // New state to track role

  const handleInputChange = (label: string, value: string, type: 'earnout' | 'equity') => {
    const numericValue = value === '' ? '' : Number(value);

    const filters = type === 'earnout' ? earnoutFilters : equityFilters;
    const filter = filters.find((f) => f.label === label);

    if (filter) {
      if (numericValue === '' || (numericValue >= filter.min && numericValue <= filter.max)) {
        if (type === 'earnout') {
          setEarnoutValues((prev) => ({ ...prev, [label]: numericValue }));
        } else {
          setEquityValues((prev) => ({ ...prev, [label]: numericValue }));
        }
      }
    }
  };
  const navigate = useNavigate();

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

  // Handle role change and reset values
  const handleRoleChange = (role: 'Partner' | 'Sales Rep') => {
    setSelectedRole(role);
    setEarnoutValues({
      'System Install (per month)': 0,
      'Average system size': 0,
      'Growth rate (per month)': 0,
      'Months until Earnout': 0,
      'Equity Per': 0,
    });
    setActiveRole(role);
  };
  const handleCalcClose = () => {
    navigate(-1);

  };

  return (
    <>
      <div id="calc-header">
        <h2>OWE Build earnout and Equity Growth Calculator</h2>
        <IoClose size={24} className="calendar-closeee" onClick={handleCalcClose} />
      </div>
      <div id="calculator-main">
        {/* Earnout Section */}
        <div className="build-earnout">
          <div className="build-header">
            <h2>Build Earnout</h2>
            <div className='build-head-btn'>
              <button className={activeRole === 'Partner' ? 'active' : ''} onClick={() => handleRoleChange('Partner')}>Partner</button>
              <button className={activeRole === 'Sales Rep' ? 'active' : ''} onClick={() => handleRoleChange('Sales Rep')}>Sales Rep</button>
            </div>
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
                      min={min}
                      max={max}
                    />
                    {/* {label === 'Growth rate (per month)' && <span>%</span>}
                    {label === 'Months until Earnout' && <span>months</span>}
                    {label === 'Average system size' && <span>kw</span>} */}
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
            {selectedRole === 'Sales Rep' && (
              <div className="filter-wrap">
                <div className="body-header">
                  <p>Equity Per Kw</p>
                  <div className="input-group">
                    <input
                      type="number"
                      value={earnoutValues['Equity Per'] !== '' ? earnoutValues['Equity Per'] : ''}
                      onChange={(e) => handleRangeChange('Equity Per', Number(e.target.value), 'earnout')}
                      className="number-input"
                      maxLength={3}
                      min={25}
                      max={300}
                    />
                    <span>kw</span>
                  </div>
                </div>
                <div className="filter">
                  <Slider
                    min={25}
                    max={300}
                    marks={{ 25: '25', 50: '50', 100: '100', 150: '150', 200: '200', 250: '250', 300: '300' }}
                    step={1}
                    value={earnoutValues['Equity Per'] || 0}
                    onChange={(val: number | number[]) => {
                      if (typeof val === 'number') {
                        handleRangeChange('Equity Per', val, 'earnout');
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
            )}
          </div>
          <div className="build-footer">
            <button><span>Earnout Amount</span>${calculateEarnout()}</button>
            <p className="footer-value"><IoMdRefresh size={16} />Reset Values</p>
          </div>
        </div>

        {/* Equity Growth Section */}
        <div className="equity-growth">
          <div className="equity-header">
            <h2>Equity Growth</h2>
          </div>
          <div className="equity-body">
            {equityFilters.map(({ label, min, max, step, marks }) => (
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
                      min={min}
                      max={max}
                    />
                    {/* {label === 'CAGR' && <span>%</span>}
                    {label === 'Years until Next Acquisition / IPO' && <span>Yrs</span>} */}
                  </div>
                </div>
                <div className="filter">
                  <Slider
                    min={min}
                    max={max}
                    step={step}
                    marks={marks}
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
            <button><span>Equity Growth</span>${calculateEquityGrowth()}</button>
            <p className="footer-value"><IoMdRefresh size={16} />Reset Values</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculator;
