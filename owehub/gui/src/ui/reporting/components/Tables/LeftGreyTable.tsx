// TableData.js
import React from 'react';
import './greyTable.css'

const TableGrey = ({ data }: any) => {
  return (
    <div className="grey-table-main-container">
      <div className="grey-table-container">
        <table className="grey-custom-table">
          <tbody>
            {data.map((row: any, index: any) => (
              <tr key={index}>
                <td style={{backgroundColor:"#ddd",color:"black",fontWeight:"700", borderRight:"1px solid black"}}>{row.column1}</td>
                <td>{row.column2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableGrey;
