import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from '../../styles/dashboard.module.css'; // Adjust the path as necessary
import renderActiveShape from '../RenderActiveShape/renderActiveShape';

interface CustomPieChartProps {
  activeIndex: number;
  pieData: { name: string; value: number; color: string }[];
  handlePieClick: (event: React.MouseEvent<SVGElement>, index: number) => void;
}

const CustomPieChart: React.FC<CustomPieChartProps> = ({
  activeIndex,
  pieData,
  handlePieClick,
}) => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart className={styles.pieChart}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onClick={handlePieClick}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
