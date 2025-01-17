import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Legend,
  PolarRadiusAxis,
} from 'recharts';
import useWindowWidth from '../../../../hooks/useWindowWidth';

const RadarChartComponenet = ({ radData }: any) => {
  // Transform and normalize data
  const data = radData
    ? Object.entries(radData).map(([key, value]) => {
        const percentAchieved = (value as { percentage_achieved: number }).percentage_achieved;
        const scaledValue = Math.log10(percentAchieved + 1) * 30;
        const normalizedValue = Math.max(scaledValue, 10);

        return {
          subject: key,
          Target: (value as { target: number }).target,
          Achieve: (value as { achieved: number }).achieved,
          Percent_Achieve: percentAchieved,
          // Add normalized value for scaling
          Normalized_Achieve: normalizedValue,
        };
      })
    : [];

  const CustomTick = ({ payload, x, y, textAnchor }: any) => {
    const entry = data.find((item) => item.subject === payload.value);
    if (entry) {
      const percentage = entry.Percent_Achieve;
      const formattedPercentage = percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(2);

      return (
        <g>
          <text
            x={x}
            y={y - 15}
            textAnchor={textAnchor}
            style={{ fontSize: '12px' }}
          >
            <tspan fill="#377CF6" fontWeight="bold">●</tspan>
            <tspan dx="2" fill="#000000" fontWeight="500">
              {formattedPercentage}%
            </tspan>
          </text>
          <text
            x={x}
            y={y + 5}
            textAnchor={textAnchor}
            fill="#767676"
            style={{ fontSize: '12px', fontWeight: '400' }}
          >
            {payload.value}
          </text>
        </g>
      );
    }
    return null;
  };

  const width = useWindowWidth();
  const isMobile = width <= 767;
  const isTablet = width <= 1024;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius={(isTablet || isMobile) ? "65%" : "80%"}
        data={data}
      >
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          tick={<CustomTick />}
        />
        <Radar
          name="Achieve"
          dataKey="Normalized_Achieve"
          stroke="#377CF6"
          fill="#377CF6"
          fillOpacity={0.4}
          dot={{
            fill: '#377CF6',
            stroke: '#377CF6',
            strokeWidth: 4,
            r: 2,
          }}
        />
        <Legend
          payload={[
            {
              value: 'Target Achieved in Percentage',
              type: 'circle',
              id: 'Achieve',
              color: '#377CF6',
            },
          ]}
          formatter={(value) => (
            <span style={{ color: '#767676', fontWeight: '400', fontSize: '12px' }}>
              {value}
            </span>
          )}
          iconSize={10}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChartComponenet;
