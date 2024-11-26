import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Legend, Tooltip as RechartsTooltip } from 'recharts';
import styles from '../../styles/dashboard.module.css'; // Adjust the path as necessary


interface CustomLineChartProps {
  lineData: any[]; // Adjust the type as necessary
}


const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'white',
            padding: '5px 10px',
            zIndex: '99',
            borderRadius: '4px',
          }}
        >
          <p
            style={{
              margin: '2px 0',
              color: '#21BC27',
              fontWeight: 'bold',
              fontSize: 11,
            }}
          >{`${payload[0].value} Closed Won`}</p>
          <p
            style={{
              margin: '2px 0',
              color: '#D91515',
              fontWeight: 'bold',
              fontSize: 11,
            }}
          >{`${payload[1].value} Closed Lost`}</p>
        </div>
      );
    }
    return null;
  };

const CustomLineChart: React.FC<CustomLineChartProps> = ({ lineData }) => {
  return (
    <ResponsiveContainer className={styles.chart_main_grid} width="100%" height={300}>
      <LineChart data={lineData}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <RechartsTooltip content={<CustomTooltip />} />
        <Legend
          className={styles.lineChart_legend}
          formatter={(value) => (value === 'won' ? 'Total won' : 'Total Lost')}
          wrapperStyle={{
            fontSize: '12px',
            fontWeight: 550,
            marginBottom: -15,
          }}
        />
        <Line type="monotone" dataKey="won" stroke="#21BC27" strokeWidth={2} name="won" />
        <Line type="monotone" dataKey="lost" stroke="#D91515" strokeWidth={2} name="lost" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CustomLineChart; 