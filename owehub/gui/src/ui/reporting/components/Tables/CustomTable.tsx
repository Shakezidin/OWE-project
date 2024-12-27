// TableData.js
import React, { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';

const TableCustom = ({
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

  const total = (data || []).reduce((acc: number, row: any) => acc + (Number(row.column2) || 0), 0);


  return (
    <div className="grey-table-main-container" style={{width: "500px"}}>
      {reportType?.label ? (
        <h3>
          {reportType?.label} {middleName}
        </h3>
      ) : (
        <h3>{middleName}</h3>
      )}

      <div className="grey-table-container" style={{height: "260px"}}>
        <table className="grey-custom-table">
          <thead>
            <tr>
              <th
                onClick={handleOfficeClick}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {th1 ? th1 : 'Office (2)'}{' '}
                <FaCaretDown
                  size={20}
                  style={{
                    fontWeight: '500',
                    marginBottom: '-5px',
                    transform: reverse ? 'rotate(180deg)' : '',
                  }}
                />{' '}
              </th>
              <th>{th2 ? th2 : 'Scheduled-kW'}</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((row: any, index: any) => (
              <tr key={index}>
                <td>{row.column1}</td>
                <td>{row.column2}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Grand Total</th>
              <th>{Number(total.toFixed(2))}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TableCustom;
