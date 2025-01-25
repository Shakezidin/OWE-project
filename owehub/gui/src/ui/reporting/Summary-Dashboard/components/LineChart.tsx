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



const LineChartComp = ({ monthData }: any) => {

    const lineChartData = monthData?.map((item: any) => ({
        week: (item.month).slice(0, 3),
        Target: item.target,
        "Achieved": item.achieved,
    }));

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
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                    }}
                    formatter={(value) => (value !== undefined ? parseFloat(value as string).toFixed(2) : '0.00')}
                />

                <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    className={styles.legend}
                    wrapperStyle={{
                        paddingBottom: '20px',
                        fontSize: '12px',
                        fontFamily: 'poppins',
                    }} />

                <Line
                    type="monotone"
                    dataKey="Target"
                    stroke="#4585F7"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#2C84FE' }}
                    activeDot={{ r: 4 }}
                >
                    <LabelList
                        dataKey="Target"
                        position="bottom"
                        fill="#4585F7"
                        fontSize={10}
                        offset={5}
                        formatter={(value: number) => `${value.toFixed(0)}`}
                    />
                </Line>

                <Line
                    type="monotone"
                    dataKey="Achieved"
                    stroke="#9DD428"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#9DD428' }}
                    activeDot={{ r: 4 }}
                >
                    <LabelList
                        dataKey="Achieved"
                        position="top"
                        fill="#9DD428"
                        fontSize={10}
                        offset={5}
                        formatter={(value: number) => `${value.toFixed(0)}`}
                    />
                </Line>
            </LineChart>
        </ResponsiveContainer>
    )
}

export default LineChartComp
