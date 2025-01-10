import React from 'react'
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';


const RadialChart = () => {

    const data = [
        {
            name: 'Batteries CT',
            Target: 50,
            Achieved: 40,
            fill: '#F9CA3E',
        },
        {
            name: 'mW Installed',
            Target: 60,
            Achieved: 45,
            fill: '#4ECF54',
        },
        {
            name: 'Install CT',
            Target: 70,
            Achieved: 65,
            fill: '#64B5F6',
        },
        {
            name: 'mW Sold',
            Target: 80,
            Achieved: 75,
            fill: '#ABDB42',
        },
        {
            name: 'Project Sold',
            Target: 90,
            Achieved: 85,
            fill: '#AD7BFF',
        },
    ];
    const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div
                    style={{
                        fontSize: '10px',
                        padding: '2px',
                        borderRadius: '4px',
                        display:"flex",
                        flexDirection:"column",
                        justifyContent:"start",
                        alignItems:"start",
                       
                    }}
                >
                    <p style={{fontWeight:"500", fontSize:"12px", color:"#101828", marginRight:'-10px'}}>{data.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* Blank Circle for Target */}
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
                        <span style={{fontWeight:"500", fontSize:"12px", color:"#767676"}}>Target: {data.Target}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* Filled Circle for Achieved */}
                        <svg width="12" height="12" style={{ marginRight: '5px' }}>
                            <circle
                                cx="6"
                                cy="6"
                                r="5"
                                fill={data.fill}
                            />
                        </svg>
                        <span style={{fontWeight:"500", fontSize:"12px", color:"#767676"}}>Achieved: {data.Achieved}</span>
                    </div>
                </div>
            );
        }

        return null;
    };







    return (
        <ResponsiveContainer width="100%">
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
                    dataKey="Achieved"  // Updated to reflect progress
                    strokeWidth={2}
                    cornerRadius={10}
                    data={data.map(item => ({
                        ...item,
                        stroke: item.fill,
                    }))}
                />


                {/* <Tooltip
                    contentStyle={tooltipStyle}
                    wrapperStyle={{
                        outline: 'none',
                        borderRadius: 0,
                        padding: 0,
                        boxShadow: 'none',
                    }}
                    formatter={(value, name) => [`${value}%`, `${name}`]}
                /> */}

                <Tooltip content={<CustomTooltip />} />


                <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    wrapperStyle={{ bottom: "78px" }}
                    formatter={(value) => (
                        <span style={{ color: '#767676', fontWeight: '400', fontSize: '12px' }}>
                            {value}
                        </span>
                    )}
                    payload={data.map((item) => ({
                        id: item.name,
                        type: "circle",
                        value: `${item.name}`,
                        color: item.fill,
                    }))}
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
