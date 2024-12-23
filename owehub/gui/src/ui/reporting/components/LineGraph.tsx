import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps, Legend } from 'recharts';
import './linechart.css'

interface DataPoint {
    name: string;
    'Peoria/Kingman': number;
    'Tucson': number;
    'Colorado': number;
    'Albuquerque/El Paso': number;
    'Tempe': number;
    'Texas': number;
    '#N/A': number;
}
interface GraphData {
    data: DataPoint[];
    lineColor: string;
}

const data: DataPoint[] = [
    {
        name: 'Day 1',
        'Peoria/Kingman': 2400,
        'Tucson': 1398,
        'Colorado': 9800,
        'Albuquerque/El Paso': 3908,
        'Tempe': 4800,
        'Texas': 3800,
        '#N/A': 1,
    },
    {
        name: 'Day 2',
        'Peoria/Kingman': 500,
        'Tucson': 100,
        'Colorado': 1,
        'Albuquerque/El Paso': 500,
        'Tempe': 200,
        'Texas': 89,
        '#N/A': 1200,
    },
    {
        name: 'Day 3',
        'Peoria/Kingman': 2300,
        'Tucson': 1500,
        'Colorado': 9500,
        'Albuquerque/El Paso': 3800,
        'Tempe': 5100,
        'Texas': 4200,
        '#N/A': 4500,
    },
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div>
                <p className="label">{`Peoria/Kingman: ${data['Peoria/Kingman']}`}</p>
                <p className="label">{`Tucson: ${data['Tucson']}`}</p>
                <p className="label">{`Colorado: ${data['Colorado']}`}</p>
                <p className="label">{`Albuquerque/El Paso: ${data['Albuquerque/El Paso']}`}</p>
                <p className="label">{`Tempe: ${data['Tempe']}`}</p>
                <p className="label">{`Texas: ${data['Texas']}`}</p>
                <p className="label">{`#N/A: ${data['#N/A']}`}</p>
            </div>
        );
    }

    return null;
};

const LineGraph: React.FC = () => {
    const graph: GraphData = {
        data: data,
        lineColor: '#ff7300', // Specify the desired color for the line
    };

    return (
        <ResponsiveContainer width="95%" height="100%" className={'graph-container'}>

            <LineChart data={data}>
                <Legend verticalAlign="top" height={32} wrapperStyle={{ gap: 20,fontSize: 10 }} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }} />
                <YAxis tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Peoria/Kingman" stroke="#8884d8" strokeWidth={2} dot={{ r: 3, fill: '#8884d8' }} activeDot={{ r: 4, fill: '#8884d8' }} />
                <Line type="monotone" dataKey="Tucson" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3, fill: '#82ca9d' }} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="Colorado" stroke="#ffc658" strokeWidth={2} dot={{ r: 3, fill: '#ffc658' }} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="Albuquerque/El Paso" stroke="#ff7300" strokeWidth={2} dot={{ r: 3, fill: '#ff7300' }} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="Tempe" stroke="#6b486b" strokeWidth={2} dot={{ r: 3, fill: '#6b486b' }} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="Texas" stroke="#a05d56" strokeWidth={2} dot={{ r: 3, fill: '#a05d56' }} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="#N/A" stroke="#d0743c" strokeWidth={2} dot={{ r: 3, fill: '#d0743c' }} activeDot={{ r: 4 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineGraph;