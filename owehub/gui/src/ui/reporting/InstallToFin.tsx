import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList,
} from 'recharts';
import styles from './styles/InstalltoFin.module.css';
import CustomSelect from './components/Dropdowns/CustomSelect';
import BackButtom from './components/BackButtom';
import StackedBarChart from './InstallToFIN/StackedBarChart';

interface LabelProps {
  x: number;
  y: number;
  width: number;
  value: number;
}

interface ChartData {
  week: number;
  low: number;
  medium: number;
  high: number;
  veryHigh: number;
  ultraHigh: number;
  extreme: number;
  totalDays: number;
}

const InstalltoFin = () => {
  const [highlightedLegend, setHighlightedLegend] = useState<string | null>(
    null
  );

  const data = [
    {
      week: '01-2024',
      low: 10,
      medium: 5,
      high: 4,
      veryHigh: 7,
      ultraHigh: 10,
      extreme: 3,
      totalDays: 39,
    },
    {
      week: '02-2024',
      low: 12,
      medium: 6,
      high: 3,
      veryHigh: 5,
      ultraHigh: 11,
      extreme: 4,
      totalDays: 41,
    },
    {
      week: '03-2024',
      low: 15,
      medium: 8,
      high: 6,
      veryHigh: 4,
      ultraHigh: 9,
      extreme: 2,
      totalDays: 44,
    },
    {
      week: '04-2024',
      low: 11,
      medium: 9,
      high: 7,
      veryHigh: 6,
      ultraHigh: 8,
      extreme: 3,
      totalDays: 44,
    },
    {
      week: '05-2024',
      low: 13,
      medium: 7,
      high: 5,
      veryHigh: 4,
      ultraHigh: 10,
      extreme: 2,
      totalDays: 41,
    },
    {
      week: '06-2024',
      low: 14,
      medium: 6,
      high: 4,
      veryHigh: 8,
      ultraHigh: 9,
      extreme: 3,
      totalDays: 44,
    },
    {
      week: '07-2024',
      low: 9,
      medium: 12,
      high: 5,
      veryHigh: 6,
      ultraHigh: 10,
      extreme: 3,
      totalDays: 45,
    },
    {
      week: '08-2024',
      low: 8,
      medium: 9,
      high: 6,
      veryHigh: 5,
      ultraHigh: 11,
      extreme: 4,
      totalDays: 43,
    },
    {
      week: '09-2024',
      low: 10,
      medium: 8,
      high: 7,
      veryHigh: 6,
      ultraHigh: 9,
      extreme: 4,
      totalDays: 44,
    },
    {
      week: '10-2024',
      low: 12,
      medium: 7,
      high: 8,
      veryHigh: 5,
      ultraHigh: 10,
      extreme: 3,
      totalDays: 45,
    },
    {
      week: '11-2024',
      low: 13,
      medium: 9,
      high: 6,
      veryHigh: 7,
      ultraHigh: 8,
      extreme: 4,
      totalDays: 47,
    },
    {
      week: '12-2024',
      low: 11,
      medium: 6,
      high: 5,
      veryHigh: 8,
      ultraHigh: 9,
      extreme: 4,
      totalDays: 43,
    },
    {
      week: '01-2025',
      low: 15,
      medium: 5,
      high: 4,
      veryHigh: 7,
      ultraHigh: 8,
      extreme: 3,
      totalDays: 42,
    },
    {
      week: '02-2025',
      low: 14,
      medium: 8,
      high: 7,
      veryHigh: 6,
      ultraHigh: 9,
      extreme: 3,
      totalDays: 47,
    },
    {
      week: '03-2025',
      low: 10,
      medium: 10,
      high: 6,
      veryHigh: 5,
      ultraHigh: 7,
      extreme: 3,
      totalDays: 41,
    },
    {
      week: '04-2025',
      low: 12,
      medium: 9,
      high: 5,
      veryHigh: 4,
      ultraHigh: 8,
      extreme: 5,
      totalDays: 43,
    },
    {
      week: '05-2025',
      low: 11,
      medium: 10,
      high: 7,
      veryHigh: 6,
      ultraHigh: 7,
      extreme: 3,
      totalDays: 44,
    },
    {
      week: '06-2025',
      low: 14,
      medium: 6,
      high: 8,
      veryHigh: 5,
      ultraHigh: 9,
      extreme: 3,
      totalDays: 45,
    },
    {
      week: '07-2025',
      low: 13,
      medium: 9,
      high: 4,
      veryHigh: 7,
      ultraHigh: 8,
      extreme: 4,
      totalDays: 46,
    },
    {
      week: '08-2025',
      low: 15,
      medium: 6,
      high: 5,
      veryHigh: 6,
      ultraHigh: 9,
      extreme: 4,
      totalDays: 45,
    },
    {
      week: '09-2025',
      low: 11,
      medium: 10,
      high: 6,
      veryHigh: 7,
      ultraHigh: 10,
      extreme: 3,
      totalDays: 47,
    },
    {
      week: '10-2025',
      low: 13,
      medium: 8,
      high: 7,
      veryHigh: 6,
      ultraHigh: 9,
      extreme: 3,
      totalDays: 46,
    },
    {
      week: '11-2025',
      low: 12,
      medium: 6,
      high: 8,
      veryHigh: 5,
      ultraHigh: 9,
      extreme: 4,
      totalDays: 44,
    },
    {
      week: '12-2025',
      low: 14,
      medium: 7,
      high: 6,
      veryHigh: 6,
      ultraHigh: 8,
      extreme: 4,
      totalDays: 45,
    },
    {
      week: '01-2026',
      low: 13,
      medium: 9,
      high: 5,
      veryHigh: 7,
      ultraHigh: 8,
      extreme: 4,
      totalDays: 46,
    },
    {
      week: '02-2026',
      low: 12,
      medium: 6,
      high: 6,
      veryHigh: 7,
      ultraHigh: 9,
      extreme: 3,
      totalDays: 44,
    },
    {
      week: '03-2026',
      low: 14,
      medium: 8,
      high: 5,
      veryHigh: 6,
      ultraHigh: 10,
      extreme: 3,
      totalDays: 47,
    },
    {
      week: '04-2026',
      low: 13,
      medium: 10,
      high: 6,
      veryHigh: 5,
      ultraHigh: 9,
      extreme: 4,
      totalDays: 45,
    },
    {
      week: '05-2026',
      low: 12,
      medium: 9,
      high: 7,
      veryHigh: 6,
      ultraHigh: 8,
      extreme: 4,
      totalDays: 46,
    },
    {
      week: '06-2026',
      low: 15,
      medium: 8,
      high: 6,
      veryHigh: 5,
      ultraHigh: 7,
      extreme: 4,
      totalDays: 45,
    },
    {
      week: '07-2026',
      low: 13,
      medium: 7,
      high: 6,
      veryHigh: 7,
      ultraHigh: 9,
      extreme: 3,
      totalDays: 44,
    },
    {
      week: '08-2026',
      low: 12,
      medium: 6,
      high: 8,
      veryHigh: 5,
      ultraHigh: 10,
      extreme: 4,
      totalDays: 45,
    },
    {
      week: '09-2026',
      low: 14,
      medium: 9,
      high: 7,
      veryHigh: 6,
      ultraHigh: 8,
      extreme: 3,
      totalDays: 46,
    },
    {
      week: '10-2026',
      low: 13,
      medium: 8,
      high: 6,
      veryHigh: 7,
      ultraHigh: 9,
      extreme: 4,
      totalDays: 45,
    },
    {
      week: '11-2026',
      low: 11,
      medium: 7,
      high: 5,
      veryHigh: 8,
      ultraHigh: 9,
      extreme: 3,
      totalDays: 44,
    },
    {
      week: '12-2026',
      low: 12,
      medium: 9,
      high: 6,
      veryHigh: 7,
      ultraHigh: 8,
      extreme: 4,
      totalDays: 46,
    },
    {
      week: '18-2026',
      low: 12,
      medium: 9,
      high: 6,
      veryHigh: 7,
      ultraHigh: 8,
      extreme: 4,
      totalDays: 47,
    },
    {
      week: '23-2026',
      low: 12,
      medium: 9,
      high: 6,
      veryHigh: 7,
      ultraHigh: 8,
      extreme: 4,
      totalDays: 48,
    },
    {
      week: '30-2026',
      low: 12,
      medium: 9,
      high: 6,
      veryHigh: 7,
      ultraHigh: 8,
      extreme: 4,
      totalDays: 49,
    },
    {
      week: '3-2027',
      low: 12,
      medium: 9,
      high: 6,
      veryHigh: 7,
      ultraHigh: 8,
      extreme: 4,
      totalDays: 50,
    },
    {
      week: '24-2027',
      low: 12,
      medium: 9,
      high: 6,
      veryHigh: 7,
      ultraHigh: 8,
      extreme: 4,
      totalDays: 51,
    },
    {
      week: '30-2027',
      low: 12,
      medium: 9,
      high: 6,
      veryHigh: 7,
      ultraHigh: 8,
      extreme: 4,
      totalDays: 52,
    },
  ];
  
  const handleLegendClick = (dataKey: string) => {
    setHighlightedLegend((prev) => (prev === dataKey ? null : dataKey));
  };

  const renderCustomizedLabel = ({ x, y, width, value }: LabelProps) => {
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill="#666666"
        textAnchor="middle"
        dominantBaseline="middle"
        className={styles.barLabel}
      >
        {value}
      </text>
    );
  };

  // Format the data for the legend (day ranges)
  const getLegendLabel = (dataKey: string) => {
    switch (dataKey) {
      case 'low':
        return '0-15 days';
      case 'medium':
        return '16-30 days';
      case 'high':
        return '31-45 days';
      case 'veryHigh':
        return '46-60 days';
      case 'ultraHigh':
        return '61-90 days';
      case 'extreme':
        return '91+ days';
      default:
        return dataKey;
    }
  };

  const getBarColor = (dataKey: string) => {
    switch (dataKey) {
      case 'low':
        return 'rgb(51, 140, 0)';
      case 'medium':
        return 'rgb(124, 179, 66)';
      case 'high':
        return 'rgb(255, 168, 0)';
      case 'veryHigh':
        return 'rgb(246, 109, 0)';
      case 'ultraHigh':
        return 'rgb(242, 68, 45)';
      case 'extreme':
        return 'rgb(238, 0, 0)';
      default:
        return 'rgb(0, 0, 0)';
    }
  };

  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <BackButtom heading="Install to FIN" />
        <div className="report-header-dropdown flex-wrap">
          {/* <div><DaySelect /></div> */}
          <div>
            <CustomSelect
              options={data.map((item) => ({
                value: item.week.toString(),
                label: `Week ${item.week}`,
              }))}
              label="Office"
            />
          </div>

          <div>
            <CustomSelect
              options={data.map((item) => ({
                value: item.week.toString(),
                label: `${item.week}`,
              }))}
              label="AHJ"
            />
          </div>

          <div>
            <CustomSelect
              options={data.map((item) => ({
                value: item.week.toString(),
                label: `${item.week}`,
              }))}
              label="State"
            />
          </div>

          <div>
            <CustomSelect
              options={data.map((item) => ({
                value: item.week.toString(),
                label: `${item.week}`,
              }))}
              label="Quarter"
            />
          </div>
        </div>
      </div>

      <div className="reports-yscroll">
        <div style={{ display: 'flex', flexDirection: 'column', gap: "1.2rem" }}>
          {/* Bar Chart */}

          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                barCategoryGap="5%"
                className={styles.barChart}
                margin={{ right: 70, top: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className={styles.grid} />
                <XAxis
                  dataKey="week"
                  className={styles.axis}
                  tickFormatter={(value) => `${value}`} // Show Week number below tickmarks
                  height={50} // Adding space for the "Week" label below tickmarks
                  tickSize={10}
                  angle={-45}
                  dy={10}
                  interval={0}
                />
                <YAxis className={styles.axis} tickSize={10} />
                <Tooltip
                  wrapperStyle={{
                    outline: 'none',
                    borderRadius: 4,
                    padding: 0,
                    boxShadow: 'none',
                  }}
                  wrapperClassName={styles.tooltip}
                />

                {/* Bars with customized labels */}
                {[
                  'low',
                  'medium',
                  'high',
                  'veryHigh',
                  'ultraHigh',
                  'extreme',
                ].map((dataKey) => (
                  <Bar
                    key={dataKey}
                    dataKey={dataKey}
                    stackId="a"
                    fill={
                      highlightedLegend === dataKey
                        ? getBarColor(dataKey)
                        : getBarColor(dataKey)
                    }
                    opacity={
                      highlightedLegend && highlightedLegend !== dataKey
                        ? 0.1
                        : 1
                    }
                    className={styles.bar}
                    label={
                      dataKey === 'extreme' ? renderCustomizedLabel : undefined
                    } // Label only for 'extreme' bar
                  />
                ))}
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="top"
                  onClick={({ dataKey }) =>
                    handleLegendClick(dataKey as string)
                  }
                  className={styles.legend}
                  wrapperStyle={{
                    paddingBottom: '20px',
                    fontSize: '12px',
                    fontFamily: 'poppins',
                  }}
                  formatter={getLegendLabel}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data} margin={{ right: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  className={styles.axis}
                  dataKey="week"
                  tickFormatter={(value) => `${value}`} // Show Week number below tickmarks
                  height={50}
                  tickSize={10}
                  angle={-45}
                  dy={12}
                  interval={0}
                />
                <YAxis className={styles.axis} tickSize={10} />
                <Tooltip
                  wrapperStyle={{
                    outline: 'none',
                    borderRadius: 4,
                    padding: 0,
                    boxShadow: 'none',
                    fontSize: 12
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalDays"
                  stroke="rgb(76, 175, 80)" // Updated line color
                  activeDot={{ r: 8 }}
                  fill="rgb(76, 175, 80)"
                >
                  <LabelList
                    dataKey="totalDays"
                    position="top"
                    fill="rgb(76, 175, 80)"
                    fontSize={12}
                    offset={5}
                    formatter={(value: any) => value}
                  />
                </Line>
                <Legend
                  layout="horizontal"
                  align="center"
                  verticalAlign="top"
                  className={styles.legend}
                  wrapperStyle={{
                    padding: '20px',
                    fontSize: '12px',
                    fontFamily: 'poppins',
                  }}
                  formatter={getLegendLabel}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstalltoFin;
