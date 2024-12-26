import React from 'react';
import { MdStackedBarChart } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, TooltipProps } from 'recharts';


type Data = {
    week: number;
    low: number;
    medium: number;
    high: number;
    veryHigh: number;
    ultraHigh: number;
    extreme: number;
    totalDays: number;
  };

const data: Data[] = [
    { week: 1, low: 10, medium: 5, high: 4, veryHigh: 7, ultraHigh: 10, extreme: 3, totalDays: 39 },
    { week: 2, low: 12, medium: 6, high: 3, veryHigh: 5, ultraHigh: 11, extreme: 4, totalDays: 41 },
    { week: 3, low: 15, medium: 8, high: 6, veryHigh: 4, ultraHigh: 9, extreme: 2, totalDays: 44 },
    { week: 4, low: 11, medium: 9, high: 7, veryHigh: 6, ultraHigh: 8, extreme: 3, totalDays: 44 },
    { week: 5, low: 13, medium: 7, high: 5, veryHigh: 4, ultraHigh: 10, extreme: 2, totalDays: 41 },
    { week: 6, low: 14, medium: 6, high: 4, veryHigh: 8, ultraHigh: 9, extreme: 3, totalDays: 44 },
    { week: 7, low: 9, medium: 12, high: 5, veryHigh: 6, ultraHigh: 10, extreme: 3, totalDays: 45 },
    { week: 8, low: 8, medium: 9, high: 6, veryHigh: 5, ultraHigh: 11, extreme: 4, totalDays: 43 },
    { week: 9, low: 10, medium: 8, high: 7, veryHigh: 6, ultraHigh: 9, extreme: 4, totalDays: 44 },
    { week: 10, low: 12, medium: 7, high: 8, veryHigh: 5, ultraHigh: 10, extreme: 3, totalDays: 45 },
    { week: 11, low: 13, medium: 9, high: 6, veryHigh: 7, ultraHigh: 8, extreme: 4, totalDays: 47 },
    { week: 12, low: 11, medium: 6, high: 5, veryHigh: 8, ultraHigh: 9, extreme: 4, totalDays: 43 },
    { week: 13, low: 15, medium: 5, high: 4, veryHigh: 7, ultraHigh: 8, extreme: 3, totalDays: 42 },
    { week: 14, low: 14, medium: 8, high: 7, veryHigh: 6, ultraHigh: 9, extreme: 3, totalDays: 47 },
    { week: 15, low: 10, medium: 10, high: 6, veryHigh: 5, ultraHigh: 7, extreme: 3, totalDays: 41 },
    { week: 16, low: 12, medium: 9, high: 5, veryHigh: 4, ultraHigh: 8, extreme: 5, totalDays: 43 },
    { week: 17, low: 11, medium: 10, high: 7, veryHigh: 6, ultraHigh: 7, extreme: 3, totalDays: 44 },
    { week: 18, low: 14, medium: 6, high: 8, veryHigh: 5, ultraHigh: 9, extreme: 3, totalDays: 45 },
    { week: 19, low: 13, medium: 7, high: 6, veryHigh: 5, ultraHigh: 10, extreme: 4, totalDays: 45 },
    { week: 20, low: 11, medium: 8, high: 7, veryHigh: 6, ultraHigh: 8, extreme: 3, totalDays: 43 },
    { week: 21, low: 12, medium: 6, high: 5, veryHigh: 9, ultraHigh: 10, extreme: 3, totalDays: 45 },
    { week: 22, low: 15, medium: 9, high: 7, veryHigh: 5, ultraHigh: 6, extreme: 3, totalDays: 45 },
    { week: 23, low: 10, medium: 10, high: 6, veryHigh: 7, ultraHigh: 8, extreme: 4, totalDays: 45 },
    { week: 24, low: 9, medium: 7, high: 8, veryHigh: 6, ultraHigh: 9, extreme: 5, totalDays: 44 },
    { week: 25, low: 13, medium: 6, high: 7, veryHigh: 5, ultraHigh: 11, extreme: 3, totalDays: 45 },
    { week: 26, low: 11, medium: 10, high: 6, veryHigh: 4, ultraHigh: 8, extreme: 4, totalDays: 43 },
    { week: 27, low: 10, medium: 8, high: 6, veryHigh: 7, ultraHigh: 9, extreme: 4, totalDays: 44 },
    { week: 28, low: 12, medium: 7, high: 5, veryHigh: 8, ultraHigh: 10, extreme: 3, totalDays: 45 },
    { week: 29, low: 14, medium: 9, high: 4, veryHigh: 7, ultraHigh: 8, extreme: 4, totalDays: 46 },
    { week: 30, low: 15, medium: 6, high: 5, veryHigh: 6, ultraHigh: 9, extreme: 4, totalDays: 45 },
    { week: 31, low: 11, medium: 10, high: 6, veryHigh: 7, ultraHigh: 10, extreme: 3, totalDays: 47 },
    { week: 32, low: 13, medium: 8, high: 7, veryHigh: 6, ultraHigh: 9, extreme: 3, totalDays: 46 },
    { week: 33, low: 12, medium: 6, high: 8, veryHigh: 5, ultraHigh: 9, extreme: 4, totalDays: 44 },
    { week: 34, low: 14, medium: 7, high: 6, veryHigh: 6, ultraHigh: 8, extreme: 4, totalDays: 45 },
    { week: 35, low: 13, medium: 9, high: 5, veryHigh: 7, ultraHigh: 8, extreme: 4, totalDays: 46 },
    { week: 36, low: 10, medium: 8, high: 7, veryHigh: 6, ultraHigh: 9, extreme: 4, totalDays: 44 },
    { week: 37, low: 9, medium: 10, high: 5, veryHigh: 7, ultraHigh: 8, extreme: 5, totalDays: 44 },
    { week: 38, low: 13, medium: 6, high: 8, veryHigh: 5, ultraHigh: 9, extreme: 4, totalDays: 45 },
    { week: 39, low: 10, medium: 9, high: 6, veryHigh: 8, ultraHigh: 7, extreme: 4, totalDays: 44 },
    { week: 40, low: 12, medium: 7, high: 8, veryHigh: 5, ultraHigh: 10, extreme: 3, totalDays: 45 },
    { week: 41, low: 11, medium: 8, high: 7, veryHigh: 6, ultraHigh: 9, extreme: 4, totalDays: 45 },
    { week: 42, low: 14, medium: 5, high: 9, veryHigh: 4, ultraHigh: 10, extreme: 4, totalDays: 46 },
    { week: 43, low: 13, medium: 9, high: 6, veryHigh: 5, ultraHigh: 8, extreme: 3, totalDays: 44 },
    { week: 44, low: 12, medium: 7, high: 8, veryHigh: 6, ultraHigh: 9, extreme: 4, totalDays: 46 },
    { week: 45, low: 14, medium: 6, high: 7, veryHigh: 8, ultraHigh: 7, extreme: 3, totalDays: 45 },
    { week: 46, low: 13, medium: 8, high: 5, veryHigh: 6, ultraHigh: 10, extreme: 3, totalDays: 45 },
    { week: 47, low: 12, medium: 7, high: 6, veryHigh: 8, ultraHigh: 9, extreme: 4, totalDays: 46 },
    { week: 48, low: 10, medium: 9, high: 8, veryHigh: 5, ultraHigh: 11, extreme: 3, totalDays: 46 },
    { week: 49, low: 14, medium: 8, high: 7, veryHigh: 6, ultraHigh: 9, extreme: 3, totalDays: 47 },
    { week: 50, low: 11, medium: 9, high: 6, veryHigh: 7, ultraHigh: 10, extreme: 4, totalDays: 47 },
    { week: 51, low: 13, medium: 8, high: 5, veryHigh: 6, ultraHigh: 8, extreme: 4, totalDays: 44 },
    { week: 52, low: 9, medium: 7, high: 6, veryHigh: 5, ultraHigh: 11, extreme: 4, totalDays: 42 },
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

const StackedBarChart: React.FC = () => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 22, right: 10, left: 10, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }} />
                <YAxis tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }} tickFormatter={(value) => `${value}%`} domain={[0, 100]}  />
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
                <Bar dataKey="low" stackId="a" fill="#338C00" />
                <Bar dataKey="medium" stackId="a" fill="#7CC244" />
                <Bar dataKey="high" stackId="a" fill="#FFA800" />
                <Bar dataKey="veryHigh" stackId="a" fill="#F66D00" />
                <Bar dataKey="ultraHigh" stackId="a" fill="#F2442D" />
                <Bar dataKey="extreme" stackId="a" fill="#EE0000" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StackedBarChart;