// TableData.js
import React from 'react';

const QualityTable = ({ data, reportType, middleName }: any) => {
  return (
    <div className="grey-table-main-container">
      <div className="grey-table-container" style={{height:"247px"}}>
        <table className="grey-custom-table" >
          <thead>
            <tr>
              <th>Office (2)</th>
              <th>App Status</th>
              
                <th>Pending</th>
           
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, index: any) => (
              <tr key={index}>

                <td>{row.column1}</td>
                <td>{row.column2}</td>
                {row.column3 &&
                  <td>{row.column3}</td>
                }
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{position:"sticky", bottom:"0"}}>
              <th></th>
              <th>Grand Total</th>
              <th>195</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default QualityTable;
