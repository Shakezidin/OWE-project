// TableData.js
import React from 'react';

const QualityTable3 = ({ data, reportType, middleName }: any) => {
    return (
        <div className="grey-table-main-container">
            <div className="grey-table-container">
                <table className="grey-custom-table">
                    <thead>
                        <tr>
                            <th>Week</th>
                            <th>Pass Rate - Albuerque/EI</th>
                            <th>Pass Rate - Colarado</th>
                            <th>Pass Rate - Peoria/Kingman</th>
                            <th>Pass Rate - Tempe</th>
                            <th>Pass Rate - Texas</th>
                            <th>Pass Rate - Tucson</th>
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
                                <td>{row.column7}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Week 1</th>
                            <th>32</th>
                            <th>32</th>
                            <th>2323</th>
                            <th>32</th>
                            <th>23</th>
                            <th>195</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default QualityTable3;
