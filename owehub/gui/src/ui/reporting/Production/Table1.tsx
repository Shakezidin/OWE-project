// TableData.js
import React, { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';

const TableProd1 = ({
  data,
  reportType,
  middleName,
  setData,
  th1,
  th2,
}: any) => {
  const [reverse, setReverse] = useState(false);
  console.log(data, "table 1")

  const handleOfficeClick = () => {
    setData((prevData: any) => {
      const midIndex = Math.floor(prevData.length / 2);
      const topRows = prevData.slice(0, midIndex);
      const bottomRows = prevData.slice(midIndex);
      return [...bottomRows, ...topRows];
    });
    setReverse(!reverse);
  };

  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];

  const totalSum = data ? data.reduce((sum: any, row: any) => {
    const value = row[headers[1]];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0).toFixed(2) : '0.00';


  return (
    <div className="grey-table-main-container">
      {reportType?.label ? (
        <h3>
          {middleName}
        </h3>
      ) : (
        <h3>{middleName}</h3>
      )}

      <div className="grey-table-container">
        <table className="grey-custom-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.map((row: any, rowIndex: any) => (
              <tr key={rowIndex}>
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Grand Total</th>
              <th>
                {totalSum}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TableProd1;
