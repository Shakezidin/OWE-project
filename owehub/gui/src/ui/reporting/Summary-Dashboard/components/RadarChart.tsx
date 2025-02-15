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

  const data = radData
    ? Object.entries(radData).map(([key, value]) => {
      const target = (value as { target: number }).target;
      const achieved = (value as { achieved: number }).achieved;

      let percentAchieved: number;

      if (target === 0 && achieved > 0) {
        percentAchieved = 100;
      } else if (target === 0 && achieved === 0) {
        percentAchieved = 0;
      } else {
        percentAchieved = (achieved / target) * 100;
        percentAchieved = percentAchieved;
      }

      let norm: number;

      if (target === 0 && achieved > 0) {
        norm = 100;
      } else if (target === 0 && achieved === 0) {
        norm = 0;
      } else {
        norm = (achieved / target) * 100;
        norm = percentAchieved >= 100 ? 100 : percentAchieved;
      }

      return {
        subject: key,
        Target: (value as { target: number }).target,
        Achieve: (value as { achieved: number }).achieved,
        Percent_Achieve: percentAchieved,
        Normalized_Achieve: norm,
        show: true,
        B: 100
      };
    })
    : [];



  const newData = [...data];

  const CustomTick = ({ payload, x, y, textAnchor, index }: any) => {
    const entry = data.find((item) => item.subject === payload.value);

    if (entry) {
      const percentage = entry.Percent_Achieve;
      const formattedPercentage = percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(2);

      // Calculate angle-based offset
      const angleInDegrees = (360 / data.length) * index;
      const angleInRadians = (Math.PI / 180) * angleInDegrees;

      // Adjust offset distance
      const offset = 1; // Increase this to push ticks further
      const offsetX = offset * Math.cos(angleInRadians);
      const offsetY = offset * Math.sin(angleInRadians);

      return (
        <g>
          <text
            x={x + offsetX}
            y={y + offsetY - 2}
            textAnchor={textAnchor}
            style={{ fontSize: '10px' }}
          >
            <tspan fill="#377CF6" fontWeight="bold">●</tspan>
            <tspan dx="2" fill="#000000" fontWeight="500">
              {formattedPercentage}%
            </tspan>
          </text>
          <text
            x={x + offsetX}
            y={y + offsetY + 10}
            textAnchor={textAnchor}
            fill="#767676"
            style={{ fontSize: '10px', fontWeight: '400' }}
          >
            {payload.value === "ntp" ? "NTP" : payload.value}
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
        outerRadius={(isTablet || isMobile) ? "65%" : "70%"}
        data={newData}
      >

        <PolarGrid stroke='#D5E4FF' />
        <PolarAngleAxis
          dataKey="subject"
          tick={<CustomTick />}
          tickSize={15}
          tickLine={false}
        />
        <Radar name="Lily" dataKey="B" stroke="#D5E4FF" fill="#fff" fillOpacity={0} />
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
