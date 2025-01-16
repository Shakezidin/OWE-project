import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import styles from './style.module.css';
import useWindowWidth from '../../../../hooks/useWindowWidth';

const BarChartComp = ({ monthlyStatsData }: any) => {
  console.log(monthlyStatsData, "gh")

  const data = monthlyStatsData.map((item: any) => ({
    name: item.month.slice(0, 3),
    Target: item.target,
    ...(item.in_progress && { "Achieved": item.in_progress }),
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
          interval={0} tickFormatter={formatLargeNumber} />

        <YAxis
          className={styles.axis}
          tickSize={10}
          tickLine={{ stroke: 'black', strokeWidth: 1 }}
          tickFormatter={formatLargeNumber}
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
                    {`${entry.name}: ${entry.value !== undefined ? parseFloat(entry.value as string).toFixed(2) : '0.00'}`}
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

        <Bar stackId="a" dataKey="Target" fill="#4585F7">
          <LabelList
            dataKey="Target"

            position="insideTop"
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
              bottom: "14px"
            }}
          />
        </Bar>

        <Bar stackId="a" dataKey="Achieved" fill="#9DD428">
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
              marginBottom: "4px"
            }}
          />
        </Bar>


      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarChartComp
