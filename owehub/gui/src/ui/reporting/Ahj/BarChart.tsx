import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, TooltipProps } from 'recharts';


type Data = {
    name: string;
    'Within SLA (%)': number;
};

const data = [
    {
        name: 'Week 1',
        'Within SLA (%)': 20,
        'Out of SLA (%)': 40
    },
    {
        name: 'Week 2',
        'Within SLA (%)': 10,
        'Out of SLA (%)': 30
    },
    {
        name: 'Week 3',
        'Within SLA (%)': 21,
        'Out of SLA (%)': 49
    },
    {
        name: 'Week 4',
        'Within SLA (%)': 1,
        'Out of SLA (%)': 20
    },
    {
        name: 'Week 5',
        'Within SLA (%)': 2,
        'Out of SLA (%)': 4
    },
    {
        name: 'Week 6',
        'Within SLA (%)': 20,
        'Out of SLA (%)': 40
    },
    {
        name: 'Week 7',
        'Within SLA (%)': 90,
        'Out of SLA (%)': 10
    },
    {
        name: 'Week 8',
        'Within SLA (%)': 60,
        'Out of SLA (%)': 70
    },
    {
        name: 'Week 1',
        'Within SLA (%)': 20,
        'Out of SLA (%)': 40
    },
    {
        name: 'Week 2',
        'Within SLA (%)': 10,
        'Out of SLA (%)': 30
    },
    {
        name: 'Week 3',
        'Within SLA (%)': 21,
        'Out of SLA (%)': 49
    },
    {
        name: 'Week 4',
        'Within SLA (%)': 1,
        'Out of SLA (%)': 20
    },
    {
        name: 'Week 5',
        'Within SLA (%)': 2,
        'Out of SLA (%)': 4
    },
    {
        name: 'Week 6',
        'Within SLA (%)': 20,
        'Out of SLA (%)': 40
    },
    {
        name: 'Week 7',
        'Within SLA (%)': 90,
        'Out of SLA (%)': 10
    },
    {
        name: 'Week 8',
        'Within SLA (%)': 60,
        'Out of SLA (%)': 70
    },
   
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label}`}</p>
                <p className="value">{`${payload[0].name}: ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

const AhjBarChart: React.FC = () => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data as Data[]} margin={{ top: 22, right: 10, left: 10, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis             tickSize={10}
 dataKey="name" tick={{ fontSize: 10, fontWeight: 500, fill: '#818181' }} />
                <YAxis             tickSize={10}
 tick={{ fontSize: 10, fontWeight: 500, fill: '#818181' }} tickFormatter={(value) => `${value}%`} domain={[0, 100]}  />
                <Legend
                    align="center"
                    layout="horizontal"
                    verticalAlign="top"
                    wrapperStyle={{
                        fontSize: 10,
                        paddingBottom: 10
                    }}
                    iconSize={10}
                />
                <Bar dataKey="Within SLA (%)" stackId="a" fill="#069306" />
                <Bar dataKey="Out of SLA (%)" stackId="a" fill="#D91616" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default AhjBarChart;