import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarAngleAxisProps, ResponsiveContainer, Legend } from 'recharts';


const RadarChartComponenet = ({ radData }: any) => {

  const data = radData
    ? Object.entries(radData).map(([key, value]) => ({
      subject: key,
      Target: (value as { target: number }).target,
      Achieve: (value as { achieved: number }).achieved,
      Percent_Achieve: (value as { percentage_achieved: number }).percentage_achieved,
    }))
    : [];

  const CustomTick = ({ payload, x, y, textAnchor }: any) => {
    const entry = data.find((item) => item.subject === payload.value);
    if (entry) {
      const percentage = (entry.Percent_Achieve);
      const formattedPercentage = percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(2);

      return (
        <text x={x} y={y-5} textAnchor={textAnchor}>
          {/* First row: Dot and Percentage */}
          <tspan fill="#377CF6" fontWeight="bold" fontSize="14px">● </tspan>
          <tspan fill="#000000" fontWeight="500" fontSize="12px">{formattedPercentage}%</tspan>
          {/* Second row: Subject */}
          <tspan x={x + 5} y={y + 7} fill="#767676" fontWeight="400" fontSize="12px">
            {payload.value}
          </tspan>
        </text>
      );
    }
    return null;
  };




  return (

    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          tick={<CustomTick />}
        />

        <Radar
          name="Achieve"
          dataKey="Achieve"
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
}

export default RadarChartComponenet
