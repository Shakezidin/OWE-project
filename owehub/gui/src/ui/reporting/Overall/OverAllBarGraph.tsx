import { Tooltip } from 'antd'
import React from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const OverAllBarGraph = () => {
    const data = [
        {
            // "name": "Page A",
            "More Than 7 Days": 4000,
            "Below 7 Days": 2400
        },
        {
            // "name": "Page B",
            "More Than 7 Days": 3000,
            "Below 7 Days": 1398
        },
        {
            // "name": "Page C",
            "More Than 7 Days": 2000,
            "Below 7 Days": 9800
        },
        {
            // "name": "Page D",
            "More Than 7 Days": 2780,
            "Below 7 Days": 3908
        },
        {
            // "name": "Page E",
            "More Than 7 Days": 1890,
            "Below 7 Days": 4800
        },
        {
            // "name": "Page C",
            "More Than 7 Days": 2000,
            "Below 7 Days": 9800
        },
        {
            // "name": "Page D",
            "More Than 7 Days": 2780,
            "Below 7 Days": 3908
        },
        {
            // "name": "Page C",
            "More Than 7 Days": 2000,
            "Below 7 Days": 9800
        },
        {
            // "name": "Page D",
            "More Than 7 Days": 2780,
            "Below 7 Days": 3908
        },
        {
            // "name": "Page C",
            "More Than 7 Days": 2000,
            "Below 7 Days": 9800
        },
        {
            // "name": "Page D",
            "More Than 7 Days": 2780,
            "Below 7 Days": 3908
        },
        {
            // "name": "Page C",
            "More Than 7 Days": 2000,
            "Below 7 Days": 9800
        },
        {
            // "name": "Page D",
            "More Than 7 Days": 2780,
            "Below 7 Days": 3908
        },
    ]
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }} />
                <YAxis tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Below 7 Days" fill="#7cb342">
                    <LabelList dataKey="Below 7 Days" position="top" fontSize={12} fill="#333" />
                </Bar>

                <Bar dataKey="More Than 7 Days" fill="#f10000">
                    <LabelList dataKey="More Than 7 Days" position="top" fontSize={12} fill="#333" />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}

export default OverAllBarGraph
