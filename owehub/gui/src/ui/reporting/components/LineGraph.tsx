import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Type definitions
interface MetricEntry {
    value: {
        [key: string]: number; // Allow any metric name
    };
}

interface TransformedDataPoint {
    name: string; // Explicitly define name as a string
    [key: string]: number | string; // Allow any metric name, but ensure it can also be a string
}

const transformData = (data: MetricEntry[]): TransformedDataPoint[] => {
    return data.map((entry, index) => {
        const transformedEntry: TransformedDataPoint = { name: `Week ${index + 1}` };
        for (const key in entry.value) {
            transformedEntry[key] = Number((entry.value[key] * 100).toFixed(2)); // Convert to percentage
        }
        return transformedEntry;
    });
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border rounded shadow">
                <p className="font-semibold">{label}</p>
                {payload.map((entry: any) => (
                    <p key={entry.name} style={{ color: entry.color }}>
                        {`${entry.name}: ${entry.value}%`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

interface LineGraphProps {
    batteryData?: MetricEntry[];
    installData?: MetricEntry[];
    mpuData?: MetricEntry[];
}




const LineGraph: React.FC<LineGraphProps> = ({ batteryData, installData, mpuData }) => {
    const transformedBatteryData = batteryData ? transformData(batteryData) : [];
    const transformedInstallData = installData ? transformData(installData) : [];
    const transformedMpuData = mpuData ? transformData(mpuData) : [];

    console.log("batteryData", batteryData)
    console.log("installData", installData)
    console.log("mpuData", mpuData)

    // Get unique keys from the first dataset for dynamic rendering
    const allKeys = new Set<string>();
    transformedBatteryData.forEach(dataPoint => Object.keys(dataPoint).forEach(key => allKeys.add(key)));
    transformedInstallData.forEach(dataPoint => Object.keys(dataPoint).forEach(key => allKeys.add(key)));
    transformedMpuData.forEach(dataPoint => Object.keys(dataPoint).forEach(key => allKeys.add(key)));

    console.log("transformedBatteryData", transformedBatteryData)
    console.log("transformedInstallData", transformedInstallData)
    console.log("transformedMpuData", transformedMpuData)

    return (
        <div className="w-full h-96 mb-8">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transformedBatteryData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {[...Array.from(allKeys)].map((key) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each line
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            {/* Repeat for installData and mpuData */}
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transformedInstallData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {[...Array.from(allKeys)].map((key) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each line
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transformedMpuData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {[...Array.from(allKeys)].map((key) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each line
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineGraph;