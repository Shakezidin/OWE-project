// TableData.js
import React from 'react';

const TableCustom = ({ data,reportType, middleName }: any) => {
  return (
    <div className="grey-table-main-container">
      <h3>{reportType.label} {middleName}</h3>
      <div className="grey-table-container">
        <table className="grey-custom-table">
          <thead>
            <tr>
              <th>Office (2)</th>
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
