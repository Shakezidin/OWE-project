// TableData.js
import React, { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';

const MulCol = ({
  data,
  reportType,
  middleName,
  setData,
  th1,
  th2,
}: any) => {
  const [reverse, setReverse] = useState(false);

  const handleOfficeClick = () => {
    setData((prevData: any) => {
      const midIndex = Math.floor(prevData.length / 2);
      const topRows = prevData.slice(0, midIndex);
      const bottomRows = prevData.slice(midIndex);
      return [...bottomRows, ...topRows];
    });
    setReverse(!reverse);
  };

  console.log(data, "mildghjd")

  return (
    <div className="grey-table-main-container">
      {reportType?.label ? (
        <h3>
          {middleName}
        </h3>
      ) : (
        <h3>{middleName}</h3>
      )}

      <div className="grey-table-container" style={
        {
          maxHeight:"282px",
          minHeight:"282px",
          // position:"relative"
        }
      }>
        <table className="grey-custom-table">
          <thead>
            <tr>
              <th
                onClick={handleOfficeClick}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Office
                <FaCaretDown
                  size={20}
                  style={{
                    fontWeight: '500',
                    marginBottom: '-5px',
                    transform: reverse ? 'rotate(180deg)' : '',
                  }}
                />{' '}
              </th>
              <th style={{whiteSpace:"nowrap"}}>System Size</th>
              <th>Customer</th>
              <th style={{whiteSpace:"nowrap"}}>Active Install team</th>
              <th style={{whiteSpace:"nowrap"}}>Average System Size</th>
            </tr>
          </thead>
          <tbody>
            {data ? (
              data.map((row: any, index: any) => (
                <tr key={index}>
                  <td>{row.Office || 'N/A'}</td>
                  <td>{row['System Size'] ? (row['System Size']).toFixed(2) : 'N/A'}</td>
                  <td>{row.Customers ? (row.Customers).toFixed(2) : 'N/A'}</td>
                  <td>0</td>
                  <td>{row['Average System Size'] ? (row['Average System Size']).toFixed(2) : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td rowSpan={5} colSpan={5}>No data available</td>
                
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th>Grand Total</th>
              <th>
                {data && data.length > 0 ? (
                  data.reduce((sum: number, row: any) => {
                    const value = row['System Size'];
                    return sum + (typeof value === 'number' ? value : 0);
                  }, 0).toFixed(2)
                ) : (
                  '0.00'
                )}
              </th>
              <th>
                <th>
                  {data && data.length > 0 ? (
                    data.reduce((sum: number, row: any) => {
                      const value = row.Customers;
                      return sum + (typeof value === 'number' ? value : 0);
                    }, 0).toFixed(2)
                  ) : (
                    '0.00'
                  )}
                </th>
              </th>
              <th>0</th>
              <th>
                {data && data.length > 0 ? (
                  data.reduce((sum: number, row: any) => {
                    const value = row['Average System Size'];
                    return sum + (typeof value === 'number' ? value : 0);
                  }, 0).toFixed(2)
                ) : (
                  '0.00'
                )}

              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default MulCol;
