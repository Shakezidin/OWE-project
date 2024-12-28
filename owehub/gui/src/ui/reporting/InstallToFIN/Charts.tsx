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
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  const CustomTooltip: React.FC<{ active: boolean; payload: any[]; label: string }> = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const legendLabels = {
      low: '0-15 days',
      medium: '16-30 days',
      high: '31-45 days',
      veryHigh: '46-60 days',
      ultraHigh: '61-90 days',
      extreme: '91+ days',
    };

    const getBarColor = (dataKey: string) => {
      switch (dataKey) {
        case 'low': return 'rgb(51, 140, 0)';
        case 'medium': return 'rgb(124, 179, 66)';
        case 'high': return 'rgb(255, 168, 0)';
        case 'veryHigh': return 'rgb(246, 109, 0)';
        case 'ultraHigh': return 'rgb(242, 68, 45)';
        case 'extreme': return 'rgb(238, 0, 0)';
        default: return 'rgb(0, 0, 0)';
      }
    };

    const relevantPayload = highlightedSection
      ? payload.filter(entry => entry.dataKey === highlightedSection)
      : payload;

      return (
        <div className="chart-tooltip" style={{
          backgroundColor: 'white',
          border: '1px solid #efeff5',
          boxShadow: 'none',
          // margin:2,
          padding:5

        }}>
          <div className="tooltip-title" style={{
            fontWeight: '500',
            marginBottom: '5px',
            fontSize: '12px',
            color: '#333',
          }}>Week {label}</div>
          {relevantPayload.map((entry, index) => (
            <div key={index} className="tooltip-row" style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '3px',
            }}>
              <div className="tooltip-label" style={{
                display: 'flex',
                alignItems: 'center',
              }}>
                <span 
                  className="color-box"
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '0',
                    backgroundColor: getBarColor(entry.dataKey),
                    marginRight: '5px',
                  }}
                />
                <span className="tooltip-name" style={{
                  fontSize: '12px',
                  color: '#555',
                }}>{legendLabels[entry.dataKey as keyof typeof legendLabels]}</span>
              </div>
              <span className="tooltip-value" style={{
                fontSize: '12px',
                color: '#000',
              }}>: {entry.value}</span>
            </div>
          ))}
        </div>
      );
  };

  const handleBarMouseEnter = (dataKey:any) => {
    setHighlightedSection(dataKey);
  };

  const handleBarMouseLeave = () => {
    setHighlightedSection(null);
  };

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
              borderRadius: 0,
              padding: 3,
              boxShadow: 'none',
            }}
            content={<CustomTooltip active={false} payload={[]} label="" />} />
            {['extreme', 'ultraHigh', 'veryHigh', 'high', 'medium', 'low'].map((dataKey) => (
              <Bar
                key={dataKey}
                dataKey={dataKey}
                stackId="a"
                fill={getBarColor(dataKey)}
                opacity={!highlightedSection || highlightedSection === dataKey ? 1 : 0.2}
                onMouseEnter={() => handleBarMouseEnter(dataKey)}
                onMouseLeave={handleBarMouseLeave}
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