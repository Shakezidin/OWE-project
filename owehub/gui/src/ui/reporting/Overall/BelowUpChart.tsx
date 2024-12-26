import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps, Legend } from 'recharts';


interface DataPoint {
    name: string;
    'Below 7 Days': number;
    'More Than 7 days': number;
}
interface GraphData {
    data: DataPoint[];
    lineColor: string;
}

const data: DataPoint[] = [
    {
        name: '1',
        'Below 7 Days': 1398,
        'More Than 7 days': 9800,
    },
    {
        name: '2',
        'Below 7 Days': 1,
        'More Than 7 days': 1,
    },
    {
        name: '3',
        'Below 7 Days': 1400,
        'More Than 7 days': 900,
    },
    {
        name: '4',
        'Below 7 Days': 70,
        'More Than 7 days': 100,
    },
    {
        name: '5',
        'Below 7 Days': 900,
        'More Than 7 days': 1100,
    },
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div>
                <p className="label">{`Below 7 Days: ${data['Below 7 Days']}`}</p>
                <p className="label">{`More Than 7 days: ${data['More Than 7 days']}`}</p>
            </div>
        );
    }

    return null;
};

const BelowUpChart: React.FC = () => {
    const graph: GraphData = {
        data: data,
        lineColor: '#ff7300', // Specify the desired color for the line
    };

    return (
        <ResponsiveContainer width="95%" height="100%" className={'graph-container'}>

            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 20, fontSize: 10 }} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }} />
                <YAxis tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    type="monotone"
                    dataKey="Below 7 Days"
                    stroke="#f10000"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#f10000' }}
                    activeDot={{ r: 4, fill: '#f10000' }}
                />
                <Line
                    type="monotone"
                    dataKey="More Than 7 days"
                    stroke="#7cb342"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#7cb342' }}
                    activeDot={{ r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default BelowUpChart;