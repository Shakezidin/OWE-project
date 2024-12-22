// TableData.js
import React from 'react';

const TableData = ({ data,reportType }: any) => {
  return (
    <div className="table-main-container">
      <h3>{reportType.label} Scheduled</h3>
      <div className="table-container">
        <table className="custom-table">
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

export default TableData;
