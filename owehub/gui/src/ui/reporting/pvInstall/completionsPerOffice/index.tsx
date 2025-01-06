import React, { useState, useEffect } from 'react';
import ScrollableInstallationsTable, { ScrollableInstallationsTableProps } from '../../components/ScrollableFixedTable/TableComponent';
import styles from '../../styles/CompletionsPerOffice.module.css';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import CompanySelect from '../../components/Dropdowns/CompanySelect';
import SelectOption from '../../../components/selectOption/SelectOption';
import DaySelect from '../../components/Dropdowns/DaySelect';
import WeekSelect from '../../components/Dropdowns/WeekSelect';
import YearSelect from '../../components/Dropdowns/YearSelect';
import BackButtom from '../../components/BackButtom';

// Constants for colors
const OFFICE_COLORS = {
  null: '#e2e535',
  '#N/A': '#90EE90',
  'Albuquerque/El Paso': '#20B2AA',
  Colorado: '#87CEEB',
  'Peoria/Kingman': '#FFD700',
  Tempe: '#9ACD32',
  Texas: '#3CB371',
  Tucson: '#00CED1',
};

const CODE_COLORS = {
  AZPECO1: '#6B8E23',
  AZTUC01: '#98FB98',
  AZTEM01: '#B0E0E6',
  CODEN1: '#87CEEB',
  NMABQ01: '#F0E68C',
  TXDAL01: '#3CB371',
  AZKING01: '#00CED1',
  COGJ1: '#4682B4',
  TXELP01: '#F9C0D6',
  null: '#F9B7B0',
  TXAU01: '#C0C0C0',
  TXSAN01: '#F08080',
  TXHOU01: '#D3F5D3',
  NoOffice: '#B0C4DE',
};

// At the top of the file, add these types
type OfficeColorKey = keyof typeof OFFICE_COLORS;
type CodeColorKey = keyof typeof CODE_COLORS;

// Sample data structure
interface TableData {
  year: number;
  office: string;
  weeks: number[];
  grandTotal: number;
}

interface Option {
  value: string;
  label: string;
}

const CompletionsPerOffice: React.FC = () => {
  const [reportType, setReportType] = useState<Option>({
    label: 'Install',
    value: 'install',
  });

  // Sample data
  const tableData: TableData[] = [
    {
      year: 2024,
      office: 'Tucson',
      weeks: [17, 17, 18, 17, 20, 20, 33],
      grandTotal: 1003,
    },
    // Add more data as needed
  ];

  // Table columns configuration
  const columns = [
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Office', dataIndex: 'office', key: 'office' },
    ...Array.from({ length: 7 }, (_, i) => ({
      title: `Week ${i + 1}`,
      dataIndex: 'weeks',
      key: `week${i}`,
      render: (weeks: number[]) => weeks[i],
    })),
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      className: 'font-bold',
    },
  ];

  // Sample data for charts
  const stackedBarData = Array.from({ length: 52 }, (_, i) => ({
    week: `Week ${i + 1}`,
    Tucson: Math.floor(Math.random() * 500),
    Colorado: Math.floor(Math.random() * 300),
    'Albuquerque/El Paso': Math.floor(Math.random() * 400),
    Texas: Math.floor(Math.random() * 400),
    Tempe: Math.floor(Math.random() * 400),
    'Peoria/Kingman': Math.floor(Math.random() * 400),
    '#N/A': Math.floor(Math.random() * 400),
    // 'null': Math.random() * 400,
  }));

  const lineChartData = Array.from({ length: 52 }, (_, i) => ({
    week: `Week ${i + 1}`,
    AZPECO1: parseFloat((Math.random() * 7).toFixed(2)),
    // 'AZTUC01': parseFloat((Math.random() * 1).toFixed(2)),
    // 'AZTEM01': parseFloat((Math.random() * 1.1).toFixed(2)),
    // 'CODEN1': parseFloat((Math.random() * 1.2).toFixed(2)),
    // 'NMABQ01': parseFloat((Math.random() * 1.3).toFixed(2)),
    TXDAL01: parseFloat((Math.random() * 1.5).toFixed(2)),
    // 'AZKING01': parseFloat((Math.random() * 1).toFixed(2)),
    // 'COGJ1': parseFloat((Math.random() * 1.5).toFixed(2)),
    // 'TXELP01': parseFloat((Math.random() * 1.9).toFixed(2)),
    // 'null': parseFloat((Math.random() * 1.6).toFixed(2)),
    // 'TXAU01': parseFloat((Math.random() * 1.8).toFixed(2)),
    // 'TXSAN01': parseFloat((Math.random() * 1).toFixed(2)),
    // 'TXHOU01': parseFloat((Math.random() * 1.2).toFixed(2)),
    NoOffice: parseFloat((Math.random() * 1.5).toFixed(2)),
  }));

  // Real data for the count table
  const countTableData = [
    {
      key: '1',
      year: 2024,
      office: 'Peoria/Kingman',
      weeks: [49, 60, 65, 72, 65, 68, 87],
      grandTotal: 2692,
    },
    {
      key: '2',
      year: 2024,
      office: 'Tucson',
      weeks: [17, 17, 18, 17, 20, 20, 33],
      grandTotal: 1003,
    },
    {
      key: '3',
      year: 2024,
      office: 'Colorado',
      weeks: [3, 7, 8, 9, 6, 14, 14],
      grandTotal: 977,
    },
    {
      key: '4',
      year: 2024,
      office: 'Albuquerque/El Paso',
      weeks: [25, 24, 33, 28, 24, 11, 11],
      grandTotal: 822,
    },
    {
      key: '5',
      year: 2024,
      office: 'Tempe',
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 592,
    },
    {
      key: '6',
      year: 2024,
      office: 'Texas',
      weeks: [5, 6, 6, 1, 4, 5, 5],
      grandTotal: 391,
    },
    {
      key: '7',
      year: 2024,
      office: '#N/A',
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 49,
    },
    {
      key: '8',
      year: 2024,
      office: 'null',
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 0,
    },
  ];

  // Real data for the system size table
  const systemSizeTableData = [
    {
      key: '1',
      year: 2024,
      office: '#N/A',
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 303.22,
    },
    {
      key: '2',
      year: 2024,
      office: 'Albuquerque/El Paso',
      weeks: [187.64, 153.8, 219.41, 190.99, 186.14, 86.49, 71.54],
      grandTotal: 5470.56,
    },
    {
      key: '3',
      year: 2024,
      office: 'Colorado',
      weeks: [23.81, 39.37, 50.4, 58.49, 47.7, 84.1, 83.46],
      grandTotal: 6333.3,
    },
    {
      key: '4',
      year: 2024,
      office: 'Peoria/Kingman',
      weeks: [451.79, 582.79, 632.15, 723.54, 608.52, 649.68, 834.18],
      grandTotal: 25391.63,
    },
    {
      key: '5',
      year: 2024,
      office: 'Tempe',
      weeks: [0, 0, 0, 0, 0, 0, 0],
      grandTotal: 5327,
    },
    {
      key: '6',
      year: 2024,
      office: 'Texas',
      weeks: [55.68, 67.13, 58.62, 8.5, 45.75, 50.62, 55.1],
      grandTotal: 3861.47,
    },
    {
      key: '7',
      year: 2024,
      office: 'Tucson',
      weeks: [171.26, 136.27, 185.63, 152.71, 190.45, 174.13, 267.78],
      grandTotal: 8859.71,
    },
  ];

  // Column configuration for average system size
  // const averageSizeColumns = [
  //   { title: 'Year', dataIndex: 'year', key: 'year' },
  //   { title: 'Office', dataIndex: 'office', key: 'office' },
  //   ...Array.from({ length: 7 }, (_, i) => ({
  //     title: `Week ${i + 1}`,
  //     dataIndex: 'weeks',
  //     key: `week${i}`,
  //     render: (weeks: any) => weeks[i]?.toFixed(2) || '-'
  //   })),
  //   {
  //     title: 'Grand Total',
  //     dataIndex: 'grandTotal',
  //     key: 'grandTotal',
  //     render: (value: any) => <span className="font-bold">{value.toFixed(2)}</span>
  //   }
  // ];

  // Column configurations for the count table
  const countColumns = [
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Office', dataIndex: 'office', key: 'office' },
    ...Array.from({ length: 7 }, (_, i) => ({
      title: `Week ${i + 1}`,
      dataIndex: 'weeks',
      key: `week${i}`,
      render: (weeks: any) => weeks[i] || '-',
    })),
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      className: 'font-bold',
      render: (value: any) => (
        <span className="font-bold">{value.toLocaleString()}</span>
      ),
    },
  ];

  // Column configurations for the system size table
  const systemSizeColumns = [
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Office', dataIndex: 'office', key: 'office' },
    ...Array.from({ length: 7 }, (_, i) => ({
      title: `Week ${i + 1}`,
      dataIndex: 'weeks',
      key: `week${i}`,
      render: (weeks: any) => weeks[i]?.toFixed(2) || '0.00',
    })),
    {
      title: <span className="font-bold">Grand Total</span>,
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (value: any) => (
        <span className="font-bold">
          {typeof value === 'number' ? value.toFixed(2) : value}
        </span>
      ),
    },
  ];

  // Add a function to calculate grand totals
  const calculateGrandTotals = (data: any[]) => {
    const weekTotals = Array(7).fill(0);
    let grandTotal = 0;

    data.forEach((row) => {
      row.weeks.forEach((val: number, idx: number) => {
        weekTotals[idx] += val;
      });
      grandTotal += row.grandTotal;
    });

    return {
      key: 'grand-total',
      year: <span className="font-bold">Grand total</span>,
      office: '',
      weeks: weekTotals,
      grandTotal: grandTotal,
    };
  };

  // Add the calculateSystemSizeGrandTotals function
  const calculateSystemSizeGrandTotals = (data: any[]) => {
    const weekTotals = Array(7).fill(0);
    let grandTotal = 0;

    data.forEach((row) => {
      row.weeks.forEach((val: number, idx: number) => {
        weekTotals[idx] += val;
      });
      grandTotal += row.grandTotal;
    });

    return {
      key: 'grand-total',
      year: <span className="font-bold">Grand total</span>,
      office: '',
      weeks: weekTotals.map((val) => val || '-'),
      grandTotal: <span className="font-bold">{grandTotal.toFixed(2)}</span>, // Using toFixed(2) for system size values
    };
  };

  // Helper function to format numbers consistently
  const formatNumber = (value: number): string => {
    if (value === 0) return '0.00';
    return value.toFixed(2);
  };

  const calculateAverageSizeGrandTotals = (data: any[]) => {
    const weekTotals = Array(7).fill(0);
    let overallTotal = 0;
    let weekCounts = Array(7).fill(0);
    let totalCount = 0;

    data.forEach((row) => {
      row.weeks.forEach((val: number, idx: number) => {
        if (val > 0) {
          weekTotals[idx] += val;
          weekCounts[idx]++;
        }
      });
      if (row.grandTotal > 0) {
        overallTotal += row.grandTotal;
        totalCount++;
      }
    });

    const averageWeeks = weekTotals.map((total, idx) =>
      weekCounts[idx] > 0 ? total / weekCounts[idx] : 0
    );

    return {
      key: 'grand-total',
      year: <span className="font-bold">Grand total</span>,
      office: '',
      weeks: averageWeeks.map((val) => formatNumber(val)),
      grandTotal: (
        <span className="font-bold">
          {formatNumber(totalCount > 0 ? overallTotal / totalCount : 0)}
        </span>
      ),
    };
  };

  const averageSizeColumns = [
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      render: (text: string) =>
        text === 'Grand total' ? (
          <span className="font-bold">{text}</span>
        ) : (
          text
        ),
    },
    {
      title: 'Office',
      dataIndex: 'office',
      key: 'office',
    },
    ...Array.from({ length: 7 }, (_, i) => ({
      title: `Week ${i + 1}`,
      dataIndex: 'weeks',
      key: `week${i}`,
      render: (weeks: any) => {
        const value =
          typeof weeks[i] === 'number' ? formatNumber(weeks[i]) : weeks[i];
        return value || '0.00';
      },
    })),
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (value: any) => {
        if (React.isValidElement(value)) {
          return value;
        }
        return <span className="font-bold">{formatNumber(value)}</span>;
      },
    },
  ];

  // Calculate average system size data
  const averageSizeTableData = systemSizeTableData.map((sizeRow) => {
    const countRow = countTableData.find(
      (count) => count.office === sizeRow.office
    );
    return {
      key: sizeRow.key,
      year: sizeRow.year,
      office: sizeRow.office,
      weeks: sizeRow.weeks.map((size, index) => {
        const count = countRow?.weeks[index] || 0;
        return count === 0 ? 0 : size / count;
      }),
      grandTotal:
        !countRow || countRow.grandTotal === 0
          ? 0
          : sizeRow.grandTotal / countRow.grandTotal,
    };
  });

  const tooltipStyle = {
    fontSize: '10px',
    padding: '6px',
  };

  return (
<div className={` total-main-container`}>
<div className="headingcount flex justify-between items-center">
        <BackButtom heading="PV Install Completions (Office)" />
        <div className="report-header-dropdown flex-wrap">
          <div>
            <YearSelect />
          </div>
          <div>
            <WeekSelect />
          </div>
          <div>
            <DaySelect />
          </div>
          <div>
            <SelectOption
              options={[
                {
                  label: 'Install',
                  value: 'install',
                },
                {
                  label: 'Battery',
                  value: 'battery',
                },
                {
                  label: 'Service',
                  value: 'service',
                },
                {
                  label: 'MPU',
                  value: 'mpu',
                },
                {
                  label: 'Derate',
                  value: 'derate',
                },
                {
                  label: 'DER/LST/Sub-Panel',
                  value: 'der_lst_sub_panel',
                },
              ]}
              onChange={(value: any) => setReportType(value)}
              value={reportType}
              controlStyles={{ marginTop: 0, minHeight: 30, minWidth: 150 }}
              menuListStyles={{ fontWeight: 400 }}
              singleValueStyles={{ fontWeight: 400 }}
            />
          </div>
          <div>
            <CompanySelect />
          </div>
        </div>
      </div>

      <div className={`${styles.container} reports-yscroll`}>
      <div>
      <p className={`${styles.tableHeading}`}>
        Installs Completed per Office by Count
          </p>
        <div className={styles.wrapper}>
        <div className="">
       
          <div
            className="flex justify-end h5 bold pr3"
            style={{ background: '#f0f4c3', padding:'10px 15px',borderRadius: '12px 12px 0 0' }}
            title="Week / Customer"
          >
            Week / Customer
          </div>
          <ScrollableInstallationsTable data={tableData} columns={columns} />
        </div>
        </div>
      </div>

       
        <div>
        <p className={`${styles.tableHeading}`}>
        Installs Completed per Office by Count
          </p>
        <div className={styles.wrapper}>
        <div className="">
       
          <div
            className="flex justify-end h5 bold pr3"
            style={{ background: '#f0f4c3', padding:'10px 15px',borderRadius: '12px 12px 0 0' }}
            title="Week / Customer"
          >
            Week / Customer
          </div>
          <ScrollableInstallationsTable data={tableData} columns={columns} />
        </div>
        </div>
        </div>

        
        <div>
        <p className={`${styles.tableHeading}`}>
            Installs Completed per Office by System Size (Average kW)
          </p>
        <div className={styles.wrapper}>
        <div className="">
        
          <div
            className="flex justify-end h5 bold pr3"
            style={{ background: '#f0f4c3',padding:'10px 15px',borderRadius: '12px 12px 0 0' }}
            title="Week / Customer"
          >
            Week / System Size{' '}
          </div>
          <ScrollableInstallationsTable data={tableData} columns={columns} />

        </div>
        </div>
        </div>


        <div className="">
        <p className={`${styles.tableHeading}`}>
        Installs Completed per Office by System Size
          </p>
          <div className={styles.wrapper}>
            <div className={styles.graph}>
            <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stackedBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tick={{
                  fontSize: 8,
                  fill: '#555',
                }}
                angle={-45}
                dy={20}
                dx={-8}
                interval={0}
                height={60}
                tickSize={10}

              />
              <YAxis tick={{ fontSize: 8, fill: '#555' }}
                                  tickSize={10}
                                  />
              <Tooltip  wrapperStyle={{
            outline: 'none',
            borderRadius: 4,
            padding: 4,
            boxShadow: 'none',
          }}
          formatter={(value) => `${value}%`}
         contentStyle={tooltipStyle} />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="top"
                height={32}
                wrapperStyle={{ gap: 20, fontSize: 12, paddingBottom:10, top: 0, left:32 }}
              />
              {Object.keys(OFFICE_COLORS).map((office) => (
                <Bar
                  key={office}
                  dataKey={office}
                  stackId="a"
                  fill={OFFICE_COLORS[office as OfficeColorKey]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
            </div>
          </div>

        </div>

        


        <div className="">
          <p className={styles.tableHeading}>Install Completion Trends by Office Code</p>
          <div className={styles.wrapper}>
            <div className={styles.graph}>
            <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tick={{
                  fontSize: 8,
                  fill: '#555',
                }}
                tickSize={10}
                angle={-45}
                dy={20}
                dx={-8}
                interval={0}
                height={60}
              />
              <YAxis tick={{ fontSize: 8, fill: '#555' }}
              tickSize={10} />
              <Tooltip  wrapperStyle={{
            outline: 'none',
            borderRadius: 4,
            padding: 4,
            boxShadow: 'none',
          }}
          formatter={(value) => `${value}%`}
         contentStyle={tooltipStyle} />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="top"
                height={32}
                wrapperStyle={{ gap: 20, fontSize: 12, paddingBottom:10, top: 0, left:32 }}
              />
              {Object.keys(CODE_COLORS).map((code) => (
                <Line
                  key={code}
                  type="monotone"
                  dataKey={code}
                  stroke={CODE_COLORS[code as CodeColorKey]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CompletionsPerOffice;
