// TableData.js
import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

const TableCustom = ({ data,reportType, middleName,setData }: any) => {

  const [reverse, setReverse] = useState(false);

  const handleOfficeClick = () => {
    setData((prevData:any) => {
      const midIndex = Math.floor(prevData.length / 2);
      const topRows = prevData.slice(0, midIndex);
      const bottomRows = prevData.slice(midIndex);
      return [...bottomRows, ...topRows];
    });
    setReverse(!reverse);
  };
  
  return (
    <div className="grey-table-main-container">
      <h3>{reportType.label} {middleName}</h3>
      <div className="grey-table-container">
        <table className="grey-custom-table">
          <thead>
            <tr>
              <th onClick={handleOfficeClick} style={{cursor:"pointer"}}>Office (2) <FaCaretDown size={20} style={{fontWeight:"500",marginBottom:"-5px",transform: reverse ? "rotate(180deg)" : ""}}/> </th>
              <th>Scheduled-kW</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, index: any) => (
              <tr key={index}>
                <td>{row.column1}</td>
                <td>{row.column2}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Grand Total</th>
              <th>195</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TableCustom;
