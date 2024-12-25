import React from 'react';
import styles from '../../../reporting/NoPto.module.css';

type Column = {
  key: string;
  label: string;
};

type ReusableTableProps = {
  data: any[];
  columns: Column[];
  title: string;
  showFooter?: boolean;
};

const NoPtoTable: React.FC<ReusableTableProps> = ({ data, columns, title, showFooter = false }) => {
  const calculateTotals = () => {
    return columns.map((col) => {
      if (typeof data[0]?.[col.key] === 'number') {
        return data.reduce((total, row) => total + row[col.key], 0);
      }
      return null;
    });
  };

  const totals = showFooter ? calculateTotals() : [];

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.tableTitle}>{title}</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={styles.headerCell}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td key={col.key} className={styles.dataCell}>{row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
          {showFooter && (
            <tfoot>
              <tr>
                {totals.map((total, index) => (
                  <td key={index} className={styles.footerCell}>
                    {total !== null ? total : ''}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default NoPtoTable;
