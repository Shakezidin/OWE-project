import React, { useCallback } from "react";
import "./barchart.css";

import { ResponsiveContainer, PieChart, Pie } from "recharts";

const BarChart: React.FC = () => {
  const renderLabel = useCallback((piePiece: any) => {
    return piePiece.name;
  }, []);

  const data = [
    {
      name: "Sale Rep.",
      value: 150,
      fill: "#5e5ef0",
    },
    {
      name: "App Setter",
      value: 300,
      fill: "#ff3f66",
    },
    {
      name: "Dealer Owner",
      value: 100,
      fill: "#fb7955",
    },
    {
      name: "Partner",
      value: 180,
      fill: "#ffa133",
    },
    {
      name: "Regional Manager",
      value: 316,
      fill: "#5edd74",
    },
    {
      name: "Sales Manager ",
      value: 200,
      fill: "#52cafe",
    },
    {
      name: "Admin",
      value: 763,
      fill: "#0181ff",
    }
  ];
  const data2 = [
    {
      name: "User ",
      value: 300,
      fill: "#fb7955",
    },
    {
      name: "Admin",
      value: 700,
      fill: "#0181ff",
    }
  ]
  return (
    <>
      <div className="PieChart-container" style={{display:"flex", gap:"2rem"}}>
        <div className="pie-section" style={{width:"50%",height:"60vh", background:"white", borderRadius:"16px", padding:"1rem"}}>
          <div className="pieChart-section">
            <p>Onboarding</p>
          </div>
          <ResponsiveContainer>
            <PieChart style={{ cursor: "pointer" }}>
              <Pie
                dataKey="value"
                data={data}
                label={renderLabel}
                cx="55%"
                cy="50%"
                outerRadius={"75%"}
                nameKey="name"
              // activeShape={(props) => renderActiveShape(props, showSubchart)}
              // onMouseEnter={onMouseOver}
              // onMouseLeave={onMouseLeave}
              />
            </PieChart>

          </ResponsiveContainer>
        </div>
        <div className="pie-section" style={{width:"50%",height:"60vh", background:"white", borderRadius:"16px",padding:"1rem"}} >
          <div className="pieChart-section" >
            <p>Performance</p>
          </div>
          <ResponsiveContainer>

            <PieChart style={{ cursor: "pointer" }}>
              <Pie
                dataKey="value"
                data={data2}
                label={renderLabel}
                cx="55%"
                cy="50%"
                outerRadius={"75%"}
                nameKey="name"
              // activeShape={(props) => renderActiveShape(props, showSubchart)}
              // onMouseEnter={onMouseOver}
              // onMouseLeave={onMouseLeave}
              />
            </PieChart>

          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default BarChart;