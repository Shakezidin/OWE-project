import React, { useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
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

const RadialChart = ({
  year,
  radData,
}: {
  year: any;
  radData: ProgressData;
}) => {
  const getColorByKey = (key: string) => {
    switch (key) {
      case 'Batteries Installed':
        return '#F9CA3E';
      case 'Install Ct':
        return '#64B5F6';
      case 'Projects Sold':
        return '#AD7BFF';
      case 'mW Sold':
        return '#ABDB42';
      case 'mW Installed':
        return '#4ECF54';
      case 'ntp':
        return '#007ACC';
      default:
        return '#000000';
    }
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const apiData = radData
    ? Object.entries(radData).map(([key, value]) => {
      let displayPercentage;
      if (value.target === 0 && value.achieved > 0) {
        displayPercentage = 100;
      } else if (value.target === 0 && value.achieved === 0) {
        displayPercentage = 0;
      } else {
        const percentage = (value.achieved / value.target) * 100;
        displayPercentage = percentage >= 100 ? 100 : percentage.toFixed(2);
      }

      return {
        name: key,
        Target: value.target,
        Achieved: value.achieved,
        DisplayPercentage: displayPercentage,
        fill: getColorByKey(key),
        tooltip: true,
      };
    })
    : [];

  const dummyData = [
    {
      name: 'Dummy 1',
      Target: 100,
      Achieved: 75,
      AchievedPercentage: 75,
      DisplayPercentage: 100,
      fill: '#fff',
      tooltip: false,
    },
  ];

  const data = [...apiData, ...dummyData];

  const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (data.tooltip) {
        return (
          <div
            style={{
              fontSize: '10px',
              padding: '2px',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              alignItems: 'start',
            }}
          >
            <p
              style={{
                fontWeight: '500',
                fontSize: '12px',
                color: '#101828',
                marginRight: '-10px',
              }}
            >
              {data.name === "ntp" ? "NTP" : data.name}
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
              <span
                style={{
                  fontWeight: '500',
                  fontSize: '12px',
                  color: '#767676',
                }}
              >
                {data.Target.toFixed(2)} - Target
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="12" height="12" style={{ marginRight: '5px' }}>
                <circle cx="6" cy="6" r="5" fill={data.fill} />
              </svg>
              <span
                style={{
                  fontWeight: '500',
                  fontSize: '12px',
                  color: '#767676',
                }}
              >
                {data.Achieved.toFixed(2)} - Achieved
              </span>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  const width = useWindowWidth();
  const isMobile = width <= 767;
  const isTablet = width <= 1024;

  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return (
    <ResponsiveContainer width="100%">
      <RadialBarChart
        cx="50%"
        cy={isMobile ? '48%' : isTablet ? '52%' : '70%'}
        innerRadius={isTablet || isMobile ? '6%' : '30%'}
        outerRadius={isTablet || isMobile ? '140%' : '140%'}
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
          data={data.map((item) => ({
            ...item,
            stroke: item.fill,
          }))}
          onMouseEnter={(data) => {
            setShowTooltip(data.tooltip);
            if (!data.tooltip) {
              return null;
            }
          }}
          onMouseLeave={(data) => {
            setShowTooltip(false);
          }}
        />

        {showTooltip && <Tooltip content={<CustomTooltip />} />}

        <Legend
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          wrapperStyle={{
            marginTop: '-10px',
            top: isMobile ? '196px' : isTablet ? '280px' : '350px',
          }}
          content={() => (
            <div style={{ textAlign: 'center', marginTop: '-3px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: isMobile ? '8px' : '19px',
                  marginBottom: '20px',
                }}
              >
                {data.slice(0, 3).map((item) => (
                  <div
                    key={item.name}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
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
                    <span
                      style={{
                        color: '#767676',
                        fontWeight: '400',
                        fontSize: isMobile ? '10px' : '12px',
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px',
                  marginTop: '-8px',
                }}
              >
                {data.slice(3).map((item) => (
                  <div
                    key={item.name}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
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
                    {item.tooltip && (
                      <span
                        style={{
                          color: '#767676',
                          fontWeight: '400',
                          fontSize: isMobile ? '10px' : '12px',
                        }}
                      >
                        {item.name === "ntp" ? "NTP" : item.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        />

        <text
          x="50%"
          y={isMobile ? '47%' : isTablet ? '47%' : '67%'}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: isMobile ? '12px ' : '16px',
            fontWeight: isMobile ? 'semi-bold' : 'bold',
          }}
        >
          {year.label.slice(0, 3)}
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default RadialChart;
