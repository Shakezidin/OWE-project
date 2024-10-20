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
    value: '',
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
    label: 'Average system size (kw)',
    value: '',
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
    label: 'Growth rate (per month) %', value: '', min: 0, max: 25, step: 0.5, marks: {
      0: '0', 5: '5',
      10: '10',
      15: '15',
      20: '20',
      25: '25',
    }
  },
  {
    label: 'Months until Earnout (Months)', value: '', min: 0, max: 60, step: 1, marks: {
      0:'0',
      12: '12',
      24: '24',
      36: '36',
      48: '48',
      60: '60',
    }
  },
];

const equityFilters: Filter[] = [
  {
    label: 'CAGR %', value: '', min: 0, max: 30, step: 0.5, marks: {
      0:'0',
      5:'5',
      10: '10',
      15: '15',
      20: '20',
      25: '25',
      30: '30'

    }
  },
  {
    label: 'Years until Next Acquisition / IPO (Yrs)', value: '', min: 3, max: 7, step: 1, marks: {
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
    'Average system size (kw)': 5,
    'Growth rate (per month) %': 0,
    'Months until Earnout (Months)': 0,
    'Equity Per': 25,
  });

  const [equityValues, setEquityValues] = useState<Record<string, number | ''>>({

    'CAGR %': 0,
    'Years until Next Acquisition / IPO (Yrs)': 3,
  });
 
  const handleRangeChange = (label: string, value: number, type: 'earnout' | 'equity') => {
    if (type === 'earnout') {
      setEarnoutValues((prev) => ({ ...prev, [label]: value }));
    } else {
      setEquityValues((prev) => ({ ...prev, [label]: value }));
    }
  };
  const [earnOutCalc, setEarnOutCalc] = useState<string>(''); // State to store the final result

  const calculateEarnout = (): string => {
    // Ensure all values are numbers
    const systemInstallPerMonth = Number(earnoutValues['System Install (per month)']);
    const averageSystemSize = Number(earnoutValues['Average system size (kw)']);
    const monthsUntilEarnout = Number(earnoutValues['Months until Earnout (Months)']);
    const growthRatePerMonth = Number(earnoutValues['Growth rate (per month) %']);
    const equityper = Number(earnoutValues['Equity Per']);

    console.log(systemInstallPerMonth, 'systemInstallPerMonth', averageSystemSize, 'averageSystemSize', growthRatePerMonth, 'growthRatePerMonth',  monthsUntilEarnout, 'monthsUntilEarnout', equityper , 'equityper ')

    // Initial first value (system installs per month * average system size)
    let firstvalue = systemInstallPerMonth * averageSystemSize;

    // Create an array to store all firstvalue results
    const firstValueArray: number[] = [];

    // Store the initial value (first month)
    firstValueArray.push(firstvalue);

    // Loop through from the second month until earnout and apply compounded growth rate
    for (let i = 1; i < monthsUntilEarnout; i++) {
      firstvalue += firstvalue * (growthRatePerMonth / 100); // Increment value by growth rate percentage
      firstValueArray.push(firstvalue); // Store the current firstvalue in the array
    }

    // Now calculate the sum for every 12 months
    let totalSum = 0;
    let finalResult = 0;
    let finalResultSalesRep = 0;
    for (let i = 0; i < firstValueArray.length; i++) {
      totalSum += firstValueArray[i];

      // Every 12th month, print the sum
      if ((i + 1) % 12 === 0) {
        console.log(`Sum for months ${i - 10} to ${i + 1}: ${totalSum.toFixed(2)}`);

        // Check if this is the last 12-month batch
        if (i + 1 === monthsUntilEarnout) {
          // Multiply the last 12 months' sum by 375 and return that as the final result
          finalResult = totalSum * 375;
          console.log(`Final result (last 12 months sum * 375): ${finalResult.toFixed(2)}`);
        }
        finalResultSalesRep = totalSum * equityper;
           // Set the final result value in state so it can be used elsewhere
 
        totalSum = 0; // Reset the sum for the next batch
      }

    // If there are remaining months after the last full 12-month batch
    if (totalSum > 0) {
    console.log(`Sum for remaining months: ${totalSum.toFixed(2)}`);

    // If the remaining months are the last months, apply the multiplication by 375
    if (monthsUntilEarnout % 12 !== 0) {
      finalResult = totalSum * 375;
      console.log(`Final result (remaining months sum * 375): ${finalResult.toFixed(2)}`);
    }
  }

    }

   return activeRole === 'Partner' ?  finalResult.toFixed(2) : finalResultSalesRep.toFixed(2)
  };

  
  const [activeRole, setActiveRole] = useState('Partner');

  const calculateEquityGrowth = (earnOutCalc: any): string => {
    console.log(earnOutCalc);
    
    // Extract the CAGR and Years values, defaulting to 0 if they are not provided
    const rate = Number(equityValues['CAGR %']) || 0; // CAGR as a percentage
    const years = Number(equityValues['Years until Next Acquisition / IPO (Yrs)']) || 0; // Number of years
  
    // Ensure earnOutCalc is a number
    const initialValue = Number(earnOutCalc);
  
    // Calculate the future value based on CAGR and years
    const growth = initialValue * Math.pow(1 + rate / 100, years-1);
    console.log(growth, 'growth')
    // Return the calculated growth, formatted to 2 decimal places
    return growth.toFixed(2);
  };

  
  const [selectedRole, setSelectedRole] = useState<'Partner' | 'Sales Rep' | null>(null); 

  const handleInputChange = (label: string, value: string, type: 'earnout' | 'equity') => {
    const numericValue = value === '' ? '' : Number(value);
    console.log(label, value, type ,"details")
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

  // const handleBlur = (label: string, type: 'earnout' | 'equity') => {
  //   if (type === 'earnout') {
  //     if (earnoutValues[label] === '') {
  //       setEarnoutValues((prev) => ({ ...prev, [label]: getDefaultValue(label, earnoutFilters) }));
  //     }
  //   } else {
  //     if (equityValues[label] === '') {
  //       setEquityValues((prev) => ({ ...prev, [label]: getDefaultValue(label, equityFilters) }));
  //     }
  //   }
  // };

  const getDefaultValue = (label: string, filters: Filter[]): number => {
    const filter = filters.find((f) => f.label === label);
    return filter ? (typeof filter.value === 'string' ? parseFloat(filter.value) : filter.value) : 0;
  };

  // Handle role change and reset values
  const handleRoleChange = (role: 'Partner' | 'Sales Rep') => {
    setSelectedRole(role);
    setEarnoutValues({
      'System Install (per month)': 0,
      'Average system size (kw)': 5,
      'Growth rate (per month) %': 0,
      'Months until Earnout (Months)': 0,
      'Equity Per': 25,
    });
    setEquityValues({
      'CAGR %':0,
      'Years until Next Acquisition / IPO (Yrs)':3

    })
    
    setActiveRole(role);
  };
  const handleCalcClose = () => {
    navigate(-1);

  };

  const handleResetValues = () => {
    setEarnoutValues({
      'System Install (per month)': 0,
      'Average system size (kw)': 5,
      'Growth rate (per month) %': 0,
      'Months until Earnout (Months)': 0,
      'Equity Per': 25,
    });
   
  }

  const handleResetValues1 = () => {
    
    setEquityValues({
      'CAGR %':0,
      'Years until Next Acquisition / IPO (Yrs)':3

    })
  }


  return (
    <>
      <div id="calc-header">
        <h2>CAGR Calculator</h2>
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
                      // onBlur={() => handleBlur(label, 'earnout')}
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
                  <p>Equity Per (kw)</p>
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
            <p className="footer-value" onClick={handleResetValues}><IoMdRefresh size={16} />Reset Values</p>
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
                      
                      className="number-input"
                     
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
            <button><span>Equity Growth</span>${calculateEquityGrowth(calculateEarnout())}</button>
            <p className="footer-value" onClick={handleResetValues1}><IoMdRefresh size={16} />Reset Values</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculator;
