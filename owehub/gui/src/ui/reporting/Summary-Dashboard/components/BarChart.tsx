import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './style.module.css';

const BarChartComp = ({monthlyStatsData}:any) => {
  console.log(monthlyStatsData,"gh")
  // const data = [
  //   {
  //     name: "Jan",
  //     Target: 100,
  //     Completed: 105,
  //     "More than Target": 5,
  //   },
  //   {
  //     name: "Feb",
  //     Target: 120,
  //     Completed: 100,
  //   },
  //   {
  //     name: "Mar",
  //     Target: 140,
  //     Inprogress: 3,
  //   },
  //   {
  //     name: "Apr",
  //     Target: 160,
  //     Incomplete: 8,
  //   },
  //   {
  //     name: "May",
  //     Target: 180,
  //     Completed: 170,
  //   },
  //   {
  //     name: "Jun",
  //     Target: 200,
  //     Completed: 190,
  //   },
  //   {
  //     name: "Jul",
  //     Target: 220,
  //     Inprogress: 3,
  //   },
  //   {
  //     name: "Aug",
  //     Target: 240,
  //     Completed: 230,

  //   },
  //   {
  //     name: "Sep",
  //     Target: 260,
  //     Completed: 250,

  //   },
  //   {
  //     name: "Oct",
  //     Target: 280,
  //     Completed: 270,

  //   },
  //   {
  //     name: "Nov",
  //     Target: 300,
  //     Completed: 290,

  //   },
  //   {
  //     name: "Dec",
  //     Target: 320,
  //     Completed: 322,
  //     "More than Target": 2,
  //   },
  // ];


  const data = monthlyStatsData.map((item:any) => ({
    name: item.month,
    Target: item.target,
    ...(item.completed && { Completed: item.completed }),
    ...(item.incomplete && { Incomplete: item.incomplete }),
    ...(item.more_than_target && { "More than Target": item.more_than_target }),
    ...(item.in_progress && { Inprogress: item.in_progress }),
  }));

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

        <Bar stackId="a" dataKey="Target" fill="#D5E4FF" />
        <Bar stackId="a" dataKey="Completed" fill="#ABDB42" />
        <Bar stackId="a" dataKey="Incomplete" fill='#EE4A3F' />
        <Bar stackId="a" dataKey="Inprogress" fill="#4585F7" />
        <Bar stackId="a" dataKey="More than Target" fill="#CBFF5C" />

      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarChartComp
