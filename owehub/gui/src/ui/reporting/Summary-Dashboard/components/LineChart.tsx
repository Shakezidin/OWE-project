import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    LabelList,
    AreaChart,
    Area,
} from 'recharts';
import styles from './style.module.css';


const LineChartComp = () => {
    const lineChartData = [
        { week: "Jan", "Progress": 10, "Target": 5 },
        { week: "Feb", "Progress": 20, "Target": 15 },
        { week: "Mar", "Progress": 8, "Target": 25 },
        { week: "Apr", "Progress": 60, "Target": 15 },
        { week: "May", "Progress": 50, "Target": 55 },
        { week: "Jun", "Progress": 60, "Target": 65 },
        { week: "Jul", "Progress": 70, "Target": 75 },
        { week: "Aug", "Progress": 80, "Target": 85 },
        { week: "Sep", "Progress": 90, "Target": 92 },
        { week: "Oct", "Progress": 95, "Target": 97 },
        { week: "Nov", "Progress": 98, "Target": 99 },
        { week: "Dec", "Progress": 40, "Target": 60 },
    ];


    const tooltipStyle = {
        fontSize: '10px',
        padding: '6px',
    };
    return (
        <ResponsiveContainer width="100%" height={400} >
            <LineChart
                data={lineChartData}
                margin={{ top: 19, right: 20, left: 0, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="0" />
                <XAxis
                    className={styles.axis}
                    height={50}
                    tickSize={10}
                    dy={12}
                    interval={0}
                    dataKey="week"
                />
                <YAxis
                    tickSize={10}
                    tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    contentStyle={tooltipStyle}
                    wrapperStyle={{
                        outline: 'none',
                        borderRadius: 4,
                        padding: 8,
                        fontSize: 10,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                    }}
                    formatter={(value) => `${Number(value)}`}
                    labelFormatter={(value) => `Week ${Number(value) + 1}`}
                />
                <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="top"
                    className={styles.legend}
                    wrapperStyle={{
                        paddingBottom: '20px',
                        fontSize: '12px',
                        fontFamily: 'poppins',
                        cursor: 'pointer',
                    }} />
                <Line
                    type="monotone"
                    dataKey="Progress"
                    stroke="#9DD428"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#2C84FE' }}
                    activeDot={{ r: 4 }}
                >
                    {/* <LabelList
                        dataKey="Progress"
                        position="top"
                        fill="#2C84FE"
                        fontSize={10}
                        offset={5}
                        formatter={(value: number) => `${value.toFixed(0)}%`}
                    /> */}
                </Line>
                <Line
                    type="monotone"
                    dataKey="Target"
                    stroke="#4585F7"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#2C84FE' }}
                    activeDot={{ r: 4 }}
                >
                    {/* <LabelList
                        dataKey="Target"
                        position="top"
                        fill="#2C84FE"
                        fontSize={10}
                        offset={5}
                        formatter={(value: number) => `${value.toFixed(0)}%`}
                    /> */}
                </Line>
            </LineChart>
        </ResponsiveContainer>
    )
}

export default LineChartComp
