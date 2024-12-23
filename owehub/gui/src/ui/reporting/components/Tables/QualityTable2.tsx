// TableData.js
import React from 'react';

const QualityTable2 = ({ data, reportType, middleName }: any) => {
    return (
        <div className="grey-table-main-container">
            <div className="grey-table-container">
                <table className="grey-custom-table">
                    <thead>
                        <tr>
                            <th>Office (2)</th>
                            <th>UID</th>
                            <th>Source of Fail</th>
                            <th>Employee Responsibility</th>
                            <th>FIN Redline Reason</th>
                            <th>Customer</th>

                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row: any, index: any) => (
                            <tr key={index}>
                                <td>{row.column1}</td>
                                <td>{row.column2}</td>
                                <td>{row.column3}</td>
                                <td>{row.column4}</td>
                                <td>{row.column5}</td>
                                <td>{row.column6}</td>

                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
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

export default QualityTable2;
