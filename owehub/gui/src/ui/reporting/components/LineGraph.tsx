import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Type definitions
interface MetricEntry {
    value: {
        [key: string]: number; // Allow any metric name
    };
}

interface TransformedDataPoint {
    name: string;
    [key: string]: number | string; // Allow any metric name
}

interface DataPoint {
    value: {
        [key: string]: number; // Allow any metric name
    };
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
            <div className="bg-white p-4 rounded shadow">
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
    const transformAndGetKeys = (data: DataPoint[]) => {
        if (!data) return { transformedData: [], uniqueKeys: [] };

        const transformedData = transformData(data); // Transform data
        const uniqueKeys = Array.from(
            new Set(
                transformedData.flatMap((point) => Object.keys(point).filter((key) => key !== "name"))
            )
        );
        return { transformedData, uniqueKeys };
    };

    const battery = transformAndGetKeys(batteryData || []);
    const install = transformAndGetKeys(installData || []);
    const mpu = transformAndGetKeys(mpuData || []);

    const renderChart = (data: TransformedDataPoint[], keys: string[], title: string) => (
        <div className="">
            <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: "500" }} interval={0} angle={-45} dy={10} />
                    <YAxis
                        tick={{ fontSize: 10 }}
                        label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', dy: 50, dx: 15, style:{fontSize: 12}}} 
                    />
                    <Tooltip wrapperStyle={{fontSize: 12,border: 'none', outline: 'none', borderRadius:4, padding:4 }} content={<CustomTooltip />} />
                    <Legend wrapperStyle={{fontSize: "12px", paddingTop: "10px"}} iconSize={12} />
                    {keys.map((key) => {
                        let strokeColor;
                        switch (key) {
                            case "Peoria/Kingman":
                                strokeColor = "#8884d8";
                                break;
                            case "Tucson":
                                strokeColor = "#82ca9d";
                                break;
                            case "Colorado":
                                strokeColor = "#ffc658";
                                break;
                            case "Albuquerque/El Paso":
                                strokeColor = "#ff7300";
                                break;
                            case "Tempe":
                                strokeColor = "#6b486b";
                                break;
                            case "Texas":
                                strokeColor = "#a05d56";
                                break;
                            case "#N/A":
                                strokeColor = "#d0743c";
                                break;
                            default:
                                strokeColor = "#000"; // Fallback color
                        }
                        return (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={strokeColor}
                                strokeWidth={2}
                                dot={{ r: 3, fill: strokeColor }}
                                activeDot={{ r: 4, fill: strokeColor }}
                            />
                        );
                    })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div className="w-full">
            {battery.transformedData.length > 0 &&
                renderChart(battery.transformedData, battery.uniqueKeys, "Battery Data")}
            {install.transformedData.length > 0 &&
                renderChart(install.transformedData, install.uniqueKeys, "Install Data")}
            {mpu.transformedData.length > 0 &&
                renderChart(mpu.transformedData, mpu.uniqueKeys, "MPU Data")}
        </div>
    );
};

export default LineGraph;