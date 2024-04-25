import React, { useCallback } from 'react'
import "./barchart.css"
import { ResponsiveContainer, PieChart, Pie, LabelList } from "recharts";
import { OnboardingChartModel } from '../../../../core/models/api_models/UserManagementModel';

interface UserPieChartProps{
  onboardingList: OnboardingChartModel[]
}

const data2 = [
  {
    name: "Inactive",
    value: 300,
    fill: "#fb7955",
  },
  {
    name: "Active",
    value: 700,
    fill: "#0181ff",
  }
]

const renderCustomizedLabelPercentage = (data: any, total = 32000) => {
  let percentageCalculated = data.value
  return `${percentageCalculated}`;
};
const UserPieChart:React.FC<UserPieChartProps> = ({ onboardingList }) => {

  const renderLabel = useCallback((piePiece: any) => {
    return piePiece.name;
  }, []);

  return (
 
    <div className="PieChart-container" style={{display:"flex", width:'100%', gap:"2rem"}} >
      <div className="pie-section" style={{width:"50%",height:"55vh", background:"white", borderRadius:"16px", padding:"1rem"}} >
        <div className="pieChart-section">
          <h2>Onboarding Detail</h2>
        </div>
        <div style={{ width: "100%", height: "45vh" }}>
          <ResponsiveContainer>
            <PieChart style={{ cursor: "pointer" }}>
              <Pie
                dataKey="value"
                data={onboardingList}
                label={renderLabel}
                cx="50%"
                cy="50%"
                outerRadius={"85%"}
                nameKey="name"
                fontSize={12}
                labelLine = {true}
                textAnchor=''
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
                    fontSize={12}
                    stroke="none" // Border of letters
                    className="label-percentage"
                    offset={-45}
                  />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='pie-section' style={{width:"50%",height:"55vh", background:"white", borderRadius:"16px", padding:"1rem"}}>
        <div className="pieChart-section">
          <h2>Performance</h2>
        </div>
        <div style={{ width: "100%", height: "45vh" }}>
          <ResponsiveContainer>
            <PieChart style={{ cursor: "pointer" }}>
              <Pie
                dataKey="value"
                data={data2}
                label={renderLabel}
                cx="50%"
                cy="50%"
                outerRadius={"85%"}
                nameKey="name"
                labelLine={true}
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
                  fontSize={12}
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