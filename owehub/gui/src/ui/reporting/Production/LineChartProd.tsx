import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps, Legend } from 'recharts';
import './index.css'

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

interface ChartData {
    [key: string]: number;
    week: number;
  }
  
  interface LineGraphProps {
    data: ChartData[];
  }
  



const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div>
                <p className="label">{`Albuquerque/El Paso: ${data['Albuquerque/El Paso']}`}</p>
                <p className="label">{`Colorado: ${data['Colorado']}`}</p>
                <p className="label">{`N/A: ${data['N/A']}`}</p>
                <p className="label">{`Peoria/Kingman: ${data['Peoria/Kingman']}`}</p>
                <p className="label">{`Tempe: ${data['Tempe']}`}</p>
                <p className="label">{`Texas: ${data['Texas']}`}</p>
                <p className="label">{`Tucson: ${data['Tucson']}`}</p>
                <p className="label">{`Week: ${data['week']}`}</p>
            </div>
        );
    }

    return null;
};

const LineGraphProd: React.FC<LineGraphProps> = ({ data }) => {

    console.log(data, "sdghghsd")
    const transformedData = data?.map((item) => ({
        ...item,
        name: `${item.week}`,
      }));
    

    return (
        <ResponsiveContainer width="95%" height="100%" className={'graph-container'}>

            <LineChart data={transformedData}  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Legend verticalAlign="top"  wrapperStyle={{ paddingBottom: 20,fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 500, fill: '#818181'}} dy={5} />
                <YAxis tick={{ fontSize: 10, fontWeight: 500, fill: '#818181' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="Albuquerque/El Paso" stroke="#8884d8" strokeWidth={2} dot={{ r: 3, fill: '#8884d8' }} activeDot={{ r: 4, fill: '#8884d8' }} />
                <Line type="monotone" dataKey="Colorado" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3, fill: '#82ca9d' }} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="N/A" stroke="#ffc658" strokeWidth={2} dot={{ r: 3, fill: '#ffc658' }} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="Peoria/Kingman" stroke="#ff7300" strokeWidth={2} dot={{ r: 3, fill: '#ff7300' }} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="Tempe" stroke="#6b486b" strokeWidth={2} dot={{ r: 3, fill: '#6b486b' }} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="Texas" stroke="#a05d56" strokeWidth={2} dot={{ r: 3, fill: '#a05d56' }} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="Tucson" stroke="#d0743c" strokeWidth={2} dot={{ r: 3, fill: '#d0743c' }} activeDot={{ r: 4 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};


export default LineGraphProd;