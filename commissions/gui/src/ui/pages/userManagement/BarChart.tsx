import React from "react";
import "./barchart.css";
import { PieChart } from "recharts";
import { Pie } from "recharts";

const BarChart: React.FC = () => {
  const data01 = [
    {
      name: "Group A",
      value: 400,
    },
    {
      name: "Group B",
      value: 300,
    },
    {
      name: "Group C",
      value: 300,
    },
    {
      name: "Group D",
      value: 200,
    },
    {
      name: "Group E",
      value: 278,
    },
    {
      name: "Group F",
      value: 189,
    },
  ];
  const data02 = [
    {
      name: "Group A",
      value: 2400,
    },
    {
      name: "Group B",
      value: 4567,
    },
    {
      name: "Group C",
      value: 1398,
    },
    {
      name: "Group D",
      value: 9800,
    },
    {
      name: "Group E",
      value: 3908,
    },
    {
      name: "Group F",
      value: 4800,
    },
  ];
  return (
    <>
    <div className="PieChart-container">
      <div className="pieChart-section">
        <p>Onboarding Detail</p>
        <PieChart width={550} height={350}>
          <Pie
            data={data01}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
          />
        </PieChart>
      </div>
      <div className="pieChart-section">
        <p>Performance</p>
        <PieChart width={550} height={350}>
          <Pie
            data={data01}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
          />
        </PieChart>
      </div>
      </div>
    </>
  );
};

export default BarChart;
