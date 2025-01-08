import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarAngleAxisProps, ResponsiveContainer } from 'recharts';


const RadarChartComponenet = () => {
  const data = [
    {
      subject: 'Project Sold',
      Target: 150,
      Achieve: 120,
    },
    {
      subject: 'Batteries CT',
      Target: 150,
      Achieve: 98,
    },
    {
      subject: 'mw Install',
      Target: 150,
      Achieve: 86,
    },
    {
      subject: 'Install CT',
      Target: 150,
      Achieve: 99,
    },
    {
      subject: 'mv Sold',
      Target: 150,
      Achieve: 85,
    },
  ];

  const CustomTick = ({ payload, x, y, textAnchor }:any) => {
    const entry = data.find((item) => item.subject === payload.value);
    if (entry) {
      const percentage = ((entry.Achieve / entry.Target) * 100).toFixed(1);
  
      return (
        <text x={x} y={y} textAnchor={textAnchor}>
          {/* Dot with custom color */}
          <tspan fill="#377CF6" fontWeight="bold" fontSize="14px">● </tspan>
          {/* Subject */}
          <tspan fill="#767676" fontWeight="600" fontSize="12px">{payload.value}</tspan>
          {/* Percentage */}
          <tspan fill="#000000" fontWeight="400" fontSize="10px"> ({percentage}%)</tspan>
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
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default RadarChartComponenet
