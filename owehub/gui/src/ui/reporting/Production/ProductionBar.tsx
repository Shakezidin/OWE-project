import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, TooltipProps } from 'recharts';


type Data = {
    name: string;
    'Pending Reschedule': number;
    'Pending Customer': number;
    'Pending NTP': number;
    'Ready for NCA Review': number;
    'Pending Roof': number;
    'Pending Confirmation': number;
    'Pending Review - Pre-Install': number;
    'Completed day 1/2': number;
    'Install Scheduled - Confirmed': number;
};

interface ChartData {
    [key: string]: number | string;
}

interface ProductionBarProps {
    data: ChartData[];
}




const ProductionBar: React.FC<ProductionBarProps> = ({ data }) => {
    const keys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'office') : [];

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    return (
        <ResponsiveContainer width="100%" height="97%" minWidth="1000px">
            <BarChart data={data} margin={{ top: 22, right: 10, left: 10, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 500, fill: '#818181' }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 500, fill: '#818181' }} />
                <Legend
                    align="center"
                    layout="horizontal"
                    verticalAlign="bottom"
                    wrapperStyle={{
                        fontSize: 10,
                        marginTop: 10,
                        paddingBottom: 10
                    }}
                    iconSize={10}
                />
                {keys.map((key, index) => (
                    <Bar key={index} dataKey={key} stackId="a" fill={getRandomColor()} />
                ))}
                {/* <Tooltip content={<CustomTooltip />} /> */}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ProductionBar;