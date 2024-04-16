import React, { useCallback } from 'react'
import "./barchart.css"
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, PieChart, Pie, LabelList } from "recharts";
const data = [
  {
    name: "Sale Rep.",
    value:800,
    percentage: "30%",
    fill: "#5e5ef0",
  },
  {
    name: "App Setter",
    value: 300,
    percentage: "30%",
    fill: "#ff3f66",
  },
  {
    name: "Dealer Owner",
    value: 250,
    percentage: "20%",
    fill: "#fb7955",
  },
  {
    name: "Partner",
    value: 300,
    percentage: "20%",
    fill: "#ffa133"
  },
  {
    name: "Regional Manager",
    value: 300,
    percentage: "20%",
    fill: "#5edd74"
  },
  {
    name: "Sales Manager",
    value: 300,
    percentage: "20%",
    fill: "#52cafe"
  },
  {
    name: "Admin",
    value: 600,
    percentage: "20%",
    fill: "#0181ff"
  },
];
const data2 = [
  {
    name: "User ",
    value: 300,
    percentage: "20%",
    fill: "#fb7955",
  },
  {
    name: "Admin",
    value: 700,
    percentage: "20%",
    fill: "#0181ff",
  }
]

const renderCustomizedLabelPercentage = (data: any, total = 32000) => {
  let percentageCalculated = data.value
  return `${percentageCalculated}`;
};
const UserPieChart = () => {
  const navigate = useNavigate()
  const renderLabel = useCallback((piePiece: any) => {
    return piePiece.name;
  }, []);
  return (
 
    <div className="PieChart-container" style={{display:"flex", gap:"2rem"}} >
      <div className="pie-section" style={{width:"50%",height:"50vh", background:"white", borderRadius:"16px", padding:"1rem"}} >
        <div className="pieChart-section">
          <h2>Onboarding Detail</h2>
        </div>
        <div style={{ width: "100%", height: "45vh" }}>
          <ResponsiveContainer>
            <PieChart style={{ cursor: "pointer" }}>
              <Pie
                dataKey="value"
                data={data}
                label={renderLabel}
                cx="50%"
                cy="50%"
                outerRadius={"75%"}
                nameKey="name"
                fontSize={12}
                dominantBaseline="central" 
              // activeShape={(props) => renderActiveShape(props, showSubchart)}
              // onMouseEnter={onMouseOver}
              // onMouseLeave={onMouseLeave}
              >
                <LabelList
                  dy={0}
                  dx={10}
                  fill="white" // Percentage color
                  // dataKey="percentage"
                  dataKey={renderCustomizedLabelPercentage}
                  position="outside"
                  angle={0}
                  fontSize={16}
                  stroke="none" // Border of letters
                  className="label-percentage"
                  offset={-45}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='pie-section' style={{width:"50%",height:"50vh", background:"white", borderRadius:"16px", padding:"1rem"}}>
        <div className="pieChart-section">
          <h2>Performance</h2>
        </div>
        <div style={{ width: "100%", height: "45vh" }}>
          <ResponsiveContainer>
            <PieChart style={{ cursor: "pointer" }}>
              <Pie
                dataKey="value"
                data={data2}
                // label={renderLabel}
                cx="50%"
                cy="50%"
                outerRadius={"75%"}
                nameKey="name"
                labelLine={false}
              // activeShape={(props) => renderActiveShape(props, showSubchart)}
              // onMouseEnter={onMouseOver}
              // onMouseLeave={onMouseLeave}
              >
                <LabelList
                  dy={0}
                  fill="white" // Percentage color
                  // dataKey="percentage"
                  dataKey={renderCustomizedLabelPercentage}
                  position="inside"
                  fontSize={16}
                  angle={45}
                  stroke="none" // Border of letters
                  className="label-percentage"

                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

  )
}

export default UserPieChart