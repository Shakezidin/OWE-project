import React from 'react'
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip } from 'recharts';


const RadialChart = () => {

    const data = [
        {
            name: 'Batteries CT',
            uv: 31.47,
            pv: 2400,
            fill: '#F9CA3E',
        },
        {
            name: 'mW Installed',
            uv: 26.69,
            pv: 4567,
            fill: '#4ECF54',
        },
        {
            name: 'Install CT',
            uv: 15.69,
            pv: 1398,
            fill: '#64B5F6',
        },
        {
            name: 'mW Sold',
            uv: 8.22,
            pv: 9800,
            fill: '#ABDB42',
        },
        {
            name: 'Project Sold',
            uv: 8.63,
            pv: 3908,
            fill: '#AD7BFF',
        },
    ];
    const tooltipStyle = {
        fontSize: '10px',
        padding: '6px',
        borderRadius: '4px',
    };

    return (
        <ResponsiveContainer width="100%" >
            <RadialBarChart
                cx="50%"
                cy="70%"
                innerRadius="30%"
                outerRadius="120%"
                barSize={15}
                data={data}
                startAngle={180}
                endAngle={0}
            >
                <RadialBar
                    background={{ fill: '#FFFFFF' }}
                    dataKey="uv"
                    strokeWidth={2}
                    cornerRadius={10}
                    data={data.map(item => ({
                        ...item,
                        stroke: item.fill, // Adding stroke property directly in the data
                    }))}
                />

                <Tooltip
                    contentStyle={tooltipStyle}
                    wrapperStyle={{
                        outline: 'none',
                        borderRadius: 0,
                        padding: 0,
                        boxShadow: 'none',
                    }}
                    formatter={(value) => `${value}%`}
                />
                <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    wrapperStyle={{
                        fontSize: '12px',
                        fontWeight: "400",
                        bottom: "78px"
                    }}
                    payload={
                        data.map((item, index) => ({
                            id: item.name,
                            type: "circle",
                            value: `${item.name}`,
                            color: item.fill,
                        }))
                    }
                />
                <text
                    x="50%"
                    y="67%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                    2024
                </text>
            </RadialBarChart>
        </ResponsiveContainer>

    )
}

export default RadialChart
