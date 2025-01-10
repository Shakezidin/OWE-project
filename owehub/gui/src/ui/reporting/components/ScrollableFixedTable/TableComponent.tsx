import React from 'react';
import './style.css';

interface InstallationData {
  office: string;
  weeks: (number | string)[]; // Weekly data for installs
  grandTotal: number; // Grand total for the office
}

export interface ScrollableInstallationsTableProps {
  data: any[];
  columns: any[];
}

const ScrollableInstallationsTable: React.FC<
  ScrollableInstallationsTableProps
> = ({ data: propData, columns }) => {
  // Generate 52 weeks of sample data

  // Sample data
  const data: InstallationData[] = [
    { office: 'Tucson', weeks: [33, 16, 20, 13, 17, 20, 20], grandTotal: 1010 },
    { office: 'Colorado', weeks: [14, 7, 12, 8, 11, 10, 7], grandTotal: 1003 },
    {
      office: 'Albuquerque',
      weeks: [11, 19, 15, 17, 13, 23, 15],
      grandTotal: 841,
    },
    {
      office: 'Tempe',
      weeks: ['-', '-', 1, '-', '-', 1, '-'],
      grandTotal: 601,
    },
    { office: 'Texas', weeks: [5, 5, 4, 3, 4, 6, 5], grandTotal: 404 },
    { office: '#N/A', weeks: Array(7).fill('-'), grandTotal: 71 },
    { office: 'null', weeks: Array(7).fill('-'), grandTotal: 0 },
  ];

  const calculateWeekTotal = (weekIndex: number): number => {
    return data.reduce((acc, row) => {
      const value = row.weeks[weekIndex];
      return acc + (typeof value === 'number' ? value : 0);
    }, 0);
  };

  const grandTotal = data.reduce((acc, row) => acc + row.grandTotal, 0);

  return (
    <div className="relative">
      <div className="relative border-gray-200 rounded-sm overflow-hidden">
        <div className="flex">
          {/* Fixed "Year, Office" columns */}
          <div className="flex-none w-48 bg-gray-50 z-10">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-50 border-b f-12">Year</th>
                  <th className="px-4 py-2 bg-gray-50 border-b f-12">Office</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {index === 0 && (
                      <td
                        rowSpan={data.length}
                        className="px-4 py-2 border-r text-left align-top"
                      >
                        2024
                      </td>
                    )}
                    <td className="px-4 py-2 border-b">{row.office}</td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-2 border-b font-semibold bg-gray-50"
                  >
                    Total
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Scrollable weeks section */}
          <div
            className="overflow-x-auto ai-style-change-1"
            style={{ overflowX: 'auto' }}
          >
            <table className="w-full">
              <thead>
                <tr>
                  {Array.from({ length: 52 }, (_, i) => (
                    <th key={i} className="px-4 py-2 bg-gray-50 border-b whitespace-nowrap min-w-[100px] f-12">Week{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.weeks.map((value, weekIndex) => (
                      <td
                        key={weekIndex}
                        className="px-4 py-2 border-b text-center whitespace-nowrap"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  {Array.from({ length: 52 }, (_, i) => (
                    <td
                      key={i}
                      className="px-4 py-2 border-b font-semibold text-center whitespace-nowrap"
                    >
                      {calculateWeekTotal(i)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          {/* Fixed "Grand Total" column */}
          <div className="flex-none w-32 bg-gray-50 z-10">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 bg-gray-50 border-b f-12">Grand Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b text-right">
                      {row.grandTotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border-b font-semibold text-right">
                    {grandTotal.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollableInstallationsTable;
