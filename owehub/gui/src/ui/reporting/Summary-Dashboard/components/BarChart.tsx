import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './style.module.css';

const BarChartComp = () => {
    const data = [
        {
          name: "Jan",
          Target: 100,
          Completed: 105,
          "More than Target": 5,
        },
        {
          name: "Feb",
          Target: 120,
          Completed: 100,
        },
        {
          name: "Mar",
          Target: 140,
          Inprogress: 3,
        },
        {
          name: "Apr",
          Target: 160,
          Incomplete: 8,
        },
        {
          name: "May",
          Target: 180,
          Completed: 170,
        },
        {
          name: "Jun",
          Target: 200,
          Completed: 190,
        },
        {
          name: "Jul",
          Target: 220,
          Inprogress: 3,
        },
        {
          name: "Aug",
          Target: 240,
          Completed: 230,
          
        },
        {
          name: "Sep",
          Target: 260,
          Completed: 250,
          
        },
        {
          name: "Oct",
          Target: 280,
          Completed: 270,
          
        },
        {
          name: "Nov",
          Target: 300,
          Completed: 290,
         
        },
        {
          name: "Dec",
          Target: 320,
          Completed: 322,
          "More than Target": 2,
        },
      ];
      
      
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
                    cursor={{ fill: '#E7F0FF' }}
                    wrapperStyle={{
                        outline: 'none',
                        borderRadius: 4,
                        padding: 4,
                        boxShadow: 'none',
                        fontSize: 12,
                    }}
                    labelFormatter={(value) => `Week ${Number(value)}`}
                />
                <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{
                        paddingBottom: '10px',
                        fontSize: '12px',
                        fontFamily: 'poppins',
                        cursor: 'pointer',
                        color: 'black',
                        fontWeight: '400',
                    }}
                />
                    <Bar stackId="a" dataKey="Target" fill="#D5E4FF" />
                    <Bar stackId="a" dataKey="Completed" fill="#ABDB42" /> 
                    <Bar  stackId="a" dataKey="Incomplete" fill='#EE4A3F'/>
                    <Bar stackId="a" dataKey="Inprogress" fill="#4585F7" />
                    <Bar stackId="a" dataKey="More than Target" fill="#CBFF5C" /> 
                    
            </BarChart>
        </ResponsiveContainer>
    )
}

export default BarChartComp
