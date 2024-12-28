import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  Legend,
} from 'recharts';
import './../styles/firstTimeGraph.css';

interface DataPoint {
  name: string;
  'Peoria/Kingman': number;
  Tucson: number;
  Colorado: number;
  'Albuquerque/El Paso': number;
  Tempe: number;
  Texas: number;
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

// const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//         const data = payload[0].payload;
//         return (
//             <div>
//                 <p className="">{`Albuquerque/El Paso: ${data['Albuquerque/El Paso']}`}</p>
//                 <p className="">{`Colorado: ${data['Colorado']}`}</p>
//                 <p className="">{`N/A: ${data['N/A']}`}</p>
//                 <p className="">{`Peoria/Kingman: ${data['Peoria/Kingman']}`}</p>
//                 <p className="">{`Tempe: ${data['Tempe']}`}</p>
//                 <p className="">{`Texas: ${data['Texas']}`}</p>
//                 <p className="">{`Tucson: ${data['Tucson']}`}</p>
//                 <p className="">{`Week: ${data['week']}`}</p>
//             </div>
//         );
//     }

//     return null;
// };

const LineGraphProd: React.FC<LineGraphProps> = ({ data }) => {
  console.log(data, 'sdghghsd');
  const transformedData = data?.map((item) => ({
    ...item,
    name: `${item.week}`,
  }));

  return (
    <ResponsiveContainer
      width="95%"
      height="100%"
      className={'graph-container'}
    >
      <LineChart
        data={transformedData}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <Legend
          verticalAlign="top"
          wrapperStyle={{
            paddingBottom: 20,
            fontSize: 12,
            width: 450,
            left: 255,
          }}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 8, fontWeight: 500, fill: '#818181' }}
          dy={5}
        />
        <YAxis tick={{ fontSize: 10, fontWeight: 500, fill: '#818181' }} />
        <Tooltip
          wrapperStyle={{
            outline: 'none',
            borderRadius: 4,
            padding: 4,
            boxShadow: 'none',
            fontSize: 12,
          }}
          labelFormatter={(label) => `Week ${label}`}
          formatter={(value) => (value as number).toFixed(2)} // Type assertion to number
        />
        <Line
          type="monotone"
          dataKey="Albuquerque/El Paso"
          stroke="#cddc39"
          strokeWidth={2}
          dot={{ r: 3, fill: '#cddc39' }}
          activeDot={{ r: 4, fill: '#cddc39' }}
        />
        <Line
          type="monotone"
          dataKey="Colorado"
          stroke="#00b6cb"
          strokeWidth={2}
          dot={{ r: 3, fill: '#00b6cb' }}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="N/A"
          stroke="#388e3c"
          strokeWidth={2}
          dot={{ r: 3, fill: '#388e3c' }}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Peoria/Kingman"
          stroke="#0072f0"
          strokeWidth={2}
          dot={{ r: 3, fill: '#0072f0' }}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Tempe"
          stroke="#ffd54f"
          strokeWidth={2}
          dot={{ r: 3, fill: '#ffd54f' }}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Texas"
          stroke="#a05d56"
          strokeWidth={2}
          dot={{ r: 3, fill: '#a05d56' }}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Tucson"
          stroke="#d0743c"
          strokeWidth={2}
          dot={{ r: 3, fill: '#d0743c' }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraphProd;
