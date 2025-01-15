import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import styles from './style.module.css';
import useWindowWidth from '../../../../hooks/useWindowWidth';

const BarChartComp = ({ monthlyStatsData }: any) => {
  console.log(monthlyStatsData, "gh")

  const data = monthlyStatsData.map((item: any) => ({
    name: item.month.slice(0, 3),
    Target: item.target,
    ...(item.completed && { Achieved: item.completed }),
    ...(item.incomplete && { "Not Achieved": item.incomplete }),
    ...(item.more_than_target && { "Achieved more than target": item.more_than_target }),
    ...(item.in_progress && { "Current Month": item.in_progress }),
  }));

  const width = useWindowWidth();
  const isMobile = width <= 767;

  const formatLargeNumber = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    } else {
      return value.toString();
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={730}
        height={250}
        data={data}
        barCategoryGap="5%"
        className={styles.barChart}
        margin={{ top: 22, right: 18, left: 0, bottom: 0 }}
        stackOffset="sign"
        barSize={74}
      >
        <CartesianGrid
          vertical={false}
          strokeDasharray="0"
          className={styles.grid}
        />

        <XAxis
          dataKey="name"
          className={styles.axis}
          height={50}
          tickSize={10}
          dy={4}
          interval={0} />
        <YAxis
          className={styles.axis}
          tickSize={10}
          tickLine={{ stroke: 'black', strokeWidth: 1 }}
        />
        <Tooltip
          cursor={{ fill: '#F5F8FF' }}
          wrapperStyle={{
            outline: 'none',
            borderRadius: 4,
            padding: 8,
            boxShadow: 'none',
            fontSize: 12,
          }}
          labelFormatter={(value) => ` ${value}`}
          content={({ payload, label }) => (
            <div style={{ backgroundColor: '#fff', padding: 8, borderRadius: 4, boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{label}</p>
              {payload && payload.length > 0 && payload.map((entry, index) => (
                <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: entry.color,
                      marginRight: 6,
                    }}
                  />
                  <span style={{ color: '#292929', fontWeight: 500, fontSize: 12 }}>
                    {`${entry.name}: ${entry.value}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        />


        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          iconType="circle"   // Set icon as a circle
          iconSize={8}        // Reduce circle size
          formatter={(value) => (
            <span style={{ color: '#767676', fontWeight: '400', fontSize: '12px', fontFamily: 'Poppins' }}>
              {value}
            </span>
          )}
          wrapperStyle={{
            paddingBottom: '10px',
            cursor: 'pointer',
          }}
        />

        <Bar stackId="a" dataKey="Target" fill="#D5E4FF">
          <LabelList
            dataKey="Target"
            position="center"
            formatter={(value: any) =>
              value !== 0
                ? typeof value === 'number'
                  ? isMobile
                    ? formatLargeNumber(value)
                    : value.toFixed(0)
                  : value
                : ''
            }
            style={{
              fill: '#000',
              fontSize: isMobile ? 6 : 12,
              fontWeight: isMobile ? '300' : '400',
            }}
          />
        </Bar>
        <Bar stackId="a" dataKey="Achieved" fill="#ABDB42">
          <LabelList
            dataKey="Achieved"
            position="center"
            formatter={(value: any) =>
              value !== 0
                ? typeof value === 'number'
                  ? isMobile
                    ? formatLargeNumber(value)
                    : value.toFixed(0)
                  : value
                : ''
            }
            style={{
              fill: '#000',
              fontSize: isMobile ? 6 : 12,
              fontWeight: isMobile ? '300' : '400',
            }}
          />
        </Bar>
        <Bar stackId="a" dataKey="Not Achieved" fill="#EE4A3F">
          <LabelList
            dataKey="Not Achieved"
            position="center"
            formatter={(value: any) =>
              value !== 0
                ? typeof value === 'number'
                  ? isMobile
                    ? formatLargeNumber(value)
                    : value.toFixed(0)
                  : value
                : ''
            }
            style={{
              fill: '#000',
              fontSize: isMobile ? 6 : 12,
              fontWeight: isMobile ? '300' : '400',
            }}
          />
        </Bar>
        <Bar stackId="a" dataKey="Current Month" fill="#4585F7">
          <LabelList
            dataKey="Current Month"
            position="center"
            formatter={(value: any) =>
              value !== 0
                ? typeof value === 'number'
                  ? isMobile
                    ? formatLargeNumber(value)
                    : value.toFixed(0)
                  : value
                : ''
            }
            style={{
              fill: '#000',
              fontSize: isMobile ? 6 : 12,
              fontWeight: isMobile ? '300' : '400',
            }}
          />
        </Bar>
        <Bar stackId="a" dataKey="Achieved more than target" fill="#CBFF5C">
          <LabelList
            dataKey="Achieved more than target"
            position="center"
            formatter={(value: any) =>
              value !== 0
                ? typeof value === 'number'
                  ? isMobile
                    ? formatLargeNumber(value)
                    : value.toFixed(0)
                  : value
                : ''
            }
            style={{
              fill: '#000',
              fontSize: isMobile ? 6 : 12,
              fontWeight: isMobile ? '300' : '400',
            }}
          />
        </Bar>

      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarChartComp
