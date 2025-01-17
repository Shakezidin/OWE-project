import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import useWindowWidth from '../../../../hooks/useWindowWidth';
 
interface ProgressDataItem {
  target: number;
  achieved: number;
  percentage_achieved?: number;
}
 
interface ProgressData {
  [key: string]: ProgressDataItem;
}
 
interface ChartDataItem {
  name: string;
  Target: number;
  Achieved: number;
  AchievedPercentage: number;
  DisplayPercentage: number;
  fill: string;
}
 
const RadialChart = ({ year, radData }: { year: any; radData: ProgressData }) => {
  const getColorByKey = (key: string) => {
    switch (key) {
      case 'Batteries Ct':
        return '#F9CA3E';
      case 'Install Ct':
        return '#64B5F6';
      case 'Projects Sold':
        return '#AD7BFF';
      case 'mW Sold':
        return '#ABDB42';
      case 'mW Installed':
        return '#4ECF54';
      default:
        return '#000000';
    }
  };
 
  const data = radData ? Object.entries(radData).map(([key, value]) => {
    const percentageAchieved = (value.achieved / value.target) * 100;
   
    const displayPercentage = percentageAchieved >= 100 ? 100 : percentageAchieved;
 
    return {
      name: key,
      Target: value.target,
      Achieved: value.achieved,
      AchievedPercentage: percentageAchieved,
      DisplayPercentage: displayPercentage,
      fill: getColorByKey(key),
    };
  }) : [];
 
  const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
 
      return (
        <div
          style={{
            fontSize: '10px',
            padding: '2px',
            borderRadius: '4px',
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
          }}
        >
          <p style={{ fontWeight: "500", fontSize: "12px", color: "#101828", marginRight: '-10px' }}>
            {data.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="12" height="12" style={{ marginRight: '5px' }}>
              <circle
                cx="6"
                cy="6"
                r="5"
                stroke={data.fill}
                strokeWidth="1"
                fill="white"
              />
            </svg>
            <span style={{ fontWeight: "500", fontSize: "12px", color: "#767676" }}>
              {(data.Target).toFixed(2)} - Target
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="12" height="12" style={{ marginRight: '5px' }}>
              <circle
                cx="6"
                cy="6"
                r="5"
                fill={data.fill}
              />
            </svg>
            <span style={{ fontWeight: "500", fontSize: "12px", color: "#767676" }}>
              {(data.Achieved).toFixed(2)} - Achieved
            </span>
          </div>
        </div>
      );
    }
    return null;
  };
 
  const width = useWindowWidth();
  const isMobile = width <= 767;
  const isTablet = width <= 1024;
 
  const formatValue = (value: number, originalValue: number): string => {
    if (originalValue >= 1_000_000) {
      return `${(originalValue / 1_000_000).toFixed(1)}M`;
    } else if (originalValue >= 1_000) {
      return `${(originalValue / 1_000).toFixed(1)}K`;
    }
    return originalValue.toFixed(0);
  };
  
 
  return (
    <ResponsiveContainer width="100%">
      <RadialBarChart
        cx="50%"
        cy={isMobile ? "48%" : isTablet ? "52%" : "70%"}
        innerRadius={(isTablet || isMobile) ? "26%" : "30%"}
        outerRadius={(isTablet || isMobile) ? "120%" : "140%"}
        barSize={15}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          background={{ fill: '#FFFFFF' }}
          dataKey="DisplayPercentage"
          strokeWidth={2}
          cornerRadius={10}
          data={data.map(item => ({
            ...item,
            stroke: item.fill,
          }))}
          // label={{
          //   position: 'insideBottom',
          //   color: '#000',
          //   stroke: "#000",
          //   fill: '#000',
          //   // formatter: (value: number) => {
          //   //     const tolerance = 0.1;
               
          //   //     const item = data.find((d: ChartDataItem) => {
          //   //       console.log(d)
          //   //       return Math.abs(d.DisplayPercentage - value) < tolerance;
          //   //     });
             
          //   //     if (!item) return '';
          //   //     return formatValue(value, item.Achieved);
          //   //   },              
          //   fontSize: 9,
          //   fontWeight: 200,
          //   style: {
          //     fontSize: '9px',
          //     fontWeight: 100,
          //   }
          // }}
           
        />
 
        <Tooltip content={<CustomTooltip />} />
 
        <Legend
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          wrapperStyle={{ marginTop: '-10px', top: isMobile ? "196px" : isTablet ? "280px" : "350px" }}
          content={() => (
            <div style={{ textAlign: 'center', marginTop: '-3px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '19px', marginBottom: '20px' }}>
                {data.slice(0, 3).map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: item.fill,
                        marginRight: 5,
                      }}
                    />
                    <span style={{ color: '#767676', fontWeight: '400', fontSize: isMobile ? '10px' : '12px' }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '-8px' }}>
                {data.slice(3).map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: item.fill,
                        marginRight: 5,
                      }}
                    />
                    <span style={{ color: '#767676', fontWeight: '400', fontSize: isMobile ? '10px' : '12px' }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        />
 
        <text
          x="50%"
          y={isMobile ? "47%" : isTablet ? "47%" : "67%"}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: (isMobile) ? '12px ' : '16px', fontWeight: isMobile ? 'semi-bold' : 'bold' }}
        >
          {year.label}
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
 
export default RadialChart;