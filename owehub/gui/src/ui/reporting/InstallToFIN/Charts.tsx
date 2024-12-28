import React from 'react';
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
import styles from '../styles/InstalltoFin.module.css';

interface ChartsProps {
  chartData: any[];
  highlightedLegend: string | null;
  handleLegendClick: (dataKey: string) => void;
  renderCustomizedLabel: (props: any) => JSX.Element;
  getBarColor: (dataKey: string) => string;
}

const Charts: React.FC<ChartsProps> = ({
  chartData,
  highlightedLegend,
  handleLegendClick,
  renderCustomizedLabel,
  getBarColor,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Bar Chart */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            barCategoryGap="5%"
            className={styles.barChart}
            margin={{ right: 70, top: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" className={styles.grid} />
            <XAxis
              dataKey="week"
              className={styles.axis}
              tickFormatter={(value) => `Week ${value}`}
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
                padding: 4,
                boxShadow: 'none',
                fontSize: 12,
              }}
              labelFormatter={(label) => `Week ${label}`}
              formatter={(value, name) => {
                const legendLabels: { [key: string]: string } = {
                  low: '0-15 days',
                  medium: '16-30 days',
                  high: '31-45 days',
                  veryHigh: '46-60 days',
                  ultraHigh: '61-90 days',
                  extreme: '91+ days',
                };
                return [value, legendLabels[name]];
              }}
            />
            {['extreme', 'ultraHigh', 'veryHigh', 'high', 'medium', 'low'].map((dataKey) => (
              <Bar
                key={dataKey}
                dataKey={dataKey}
                stackId="a"
                fill={getBarColor(dataKey)}
                opacity={highlightedLegend && highlightedLegend !== dataKey ? 0.1 : 1}
                className={styles.bar}
                label={dataKey === 'low' ? renderCustomizedLabel : undefined}
              />
            ))}
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="top"
              onClick={({ dataKey }) => handleLegendClick(dataKey as string)}
              className={styles.legend}
              wrapperStyle={{
                paddingBottom: '20px',
                fontSize: '12px',
                fontFamily: 'poppins',
                cursor: 'pointer',
              }}
              formatter={(value) => {
                const legendLabels: { [key: string]: string } = {
                  low: '0-15 days',
                  medium: '16-30 days',
                  high: '31-45 days',
                  veryHigh: '46-60 days',
                  ultraHigh: '61-90 days',
                  extreme: '91+ days',
                };
                return legendLabels[value] || value;
              }}
              payload={[
                { value: 'low', type: 'square', color: getBarColor('low') },
                { value: 'medium', type: 'square', color: getBarColor('medium') },
                { value: 'high', type: 'square', color: getBarColor('high') },
                { value: 'veryHigh', type: 'square', color: getBarColor('veryHigh') },
                { value: 'ultraHigh', type: 'square', color: getBarColor('ultraHigh') },
                { value: 'extreme', type: 'square', color: getBarColor('extreme') },
              ]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ right: 70 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              className={styles.axis}
              dataKey="week"
              tickFormatter={(value) => `Week ${value}`}
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
                padding: 4,
                boxShadow: 'none',
                fontSize: 12,
              }}
              labelFormatter={(label) => `Week ${label}`}
              formatter={(value) => (value as number).toFixed(2)}
            />
            <Line
              type="monotone"
              dataKey="Average Days From Install to FIN"
              stroke="rgb(76, 175, 80)"
              activeDot={{ r: 8 }}
              fill="rgb(76, 175, 80)"
            >
              <LabelList
                dataKey="Average Days From Install to FIN"
                position="top"
                fill="rgb(76, 175, 80)"
                fontSize={8}
                offset={5}
                formatter={(value: number) => value.toFixed(2)}
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
              formatter={(dataKey) => dataKey}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts; 