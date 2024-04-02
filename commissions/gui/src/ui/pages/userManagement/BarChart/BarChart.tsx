import React, { useCallback } from "react";
import "./barchart.css";

import { ResponsiveContainer, PieChart, Pie } from "recharts";

const BarChart: React.FC = () => {
  const renderLabel = useCallback((piePiece: any) => {
    return piePiece.name;
  }, []);

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
  const data = [
    {
      name: "Liquide Vermogen",
      value: 6000,
      fill: "#3333FF",
    },
    {
      name: "Pensioenopbouw",
      value: 4000,
      fill: "#FF9933",
    },
    {
      name: "Onroerend",
      value: 10000,
      fill: "#FF3333",
    },
    {
      name: "Zakelijk",
      value: 12000,
      fill: "#00FF00",
    },
  ];
  return (
    <>
      {/* <div className="PieChart-container">
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
      </div> */}

      <div className="PieChart-container" style={{ width: "50%", height: "50vh", background: "white" }}>

      {/* <ResponsiveContainer width="100%" height="100%"> */}
         
            <p>Onboarding Detail</p>
            <PieChart style={{ cursor: "pointer" }}>
              <Pie
                dataKey="value"
                data={data}
                label={renderLabel}
                cx="50%"
                cy="50%"
                outerRadius={"75%"}
                nameKey="name"
              // activeShape={(props) => renderActiveShape(props, showSubchart)}
              // onMouseEnter={onMouseOver}
              // onMouseLeave={onMouseLeave}
              />
            </PieChart>
          
        {/* </ResponsiveContainer> */}
      </div>

    </>
  );
};

export default BarChart;
