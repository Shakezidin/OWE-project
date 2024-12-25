import React, { useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { TableData } from '../../types/speedTypes';

interface TableCustomProps {
  data?: TableData[]; // Make `data` optional
  reportType?: { label: string };
  middleName?: string;
  setData?: (data: TableData[]) => void;
  th1?: string;
  th2?: string;
}

const TableCustom: React.FC<TableCustomProps> = ({
  data = [], // Provide a default empty array
  reportType,
  middleName,
  setData,
  th1,
  th2,
}) => {
  const [reverse, setReverse] = useState(false);

  const handleOfficeClick = () => {
    if (!setData) return;

    const midIndex = Math.floor(data.length / 2);
    const topRows = data.slice(0, midIndex);
    const bottomRows = data.slice(midIndex);
    setReverse(!reverse);
    setData([...bottomRows, ...topRows]);
  };

  // Safely convert column2 to number for calculations
  const total = data.reduce((acc, row) => acc + (Number(row.column2) || 0), 0);

  return (
    <div className="grey-table-main-container">
      {reportType?.label ? (
        <h3>
          {reportType?.label} {middleName}
        </h3>
      ) : (
        <h3>{middleName}</h3>
      )}

      <div className="grey-table-container">
        <table className="grey-custom-table">
          <thead>
            <tr>
              <th
                onClick={handleOfficeClick}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {th1 ? th1 : 'Office'}{' '}
                <FaCaretDown
                  size={20}
                  style={{
                    fontWeight: '500',
                    marginBottom: '-5px',
                    transform: reverse ? 'rotate(180deg)' : '',
                  }}
                />
              </th>
              <th>{th2 ? th2 : 'Count'}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.column1}</td>
                <td>{Number(row.column2) || 0}</td> {/* Safely convert to number */}
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
