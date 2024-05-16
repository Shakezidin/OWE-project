import React, { useCallback } from 'react'
import "./barchart.css"
import { ResponsiveContainer, PieChart, Pie, LabelList } from "recharts";
import { OnboardingChartModel } from '../../../../core/models/api_models/UserManagementModel';

interface UserPieChartProps{
  onboardingList: OnboardingChartModel[]
  userPerformanceList: OnboardingChartModel[];
}

const renderCustomizedLabelPercentage = (data: any, total = 32000) => {
  let percentageCalculated = data.value
  return `${percentageCalculated}`;
};

const UserPieChart:React.FC<UserPieChartProps> = ({ onboardingList, userPerformanceList }) => {
  const renderLabel = useCallback((piePiece: any) => {
    return piePiece.name;
  }, []);

  return (
    <div className="PieChart-container" style={{display:"flex", width:'100%', gap:"1.2rem"}} >
      <div className="pie-section" style={{width:"50%",height:"100%", background:"white",
       borderRadius:"16px", padding:"1rem",
       alignItems:'center', justifyContent:'center'
       }} >
        <div className="pieChart-section">
          <h2>Onboarding Detail</h2>
        </div>
        <div style={{ width: "100%", height: "90%", outline: 'none' }} className="pie-chart-container">
          <ResponsiveContainer>
            <PieChart style={{ outline: 'none' }}>
              <Pie
                style={{outline: 'none'}}
                dataKey="value"
                data={onboardingList}
                label={renderLabel}
                cx="50%"
                cy="49%"
                outerRadius={"85%"}
                nameKey="name"
                fontSize={12}
                labelLine={true}
                textAnchor=''
                dominantBaseline="central"
              >
                <LabelList
                  fill="white"
                  dataKey={renderCustomizedLabelPercentage}
                  position="outside"
                  fontSize={12}
                  stroke="none"
                  className="label-percentage"
                  style={{outline: 'none'}}
                  offset={-30}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pie-section" style={{width:"50%",height:"100%", background:"white",
       borderRadius:"16px", padding:"1rem",
       alignItems:'center', justifyContent:'center'
       }} >
        <div className="pieChart-section">
          <h2>Performance</h2>
        </div>
        <div style={{ width: "100%", height: "90%" }}>
          <ResponsiveContainer>
            <PieChart  style={{outline: 'none'}}>
              <Pie
                style={{outline: 'none'}}
                dataKey="value"
                data={userPerformanceList}
                label={renderLabel}
                cx="50%"
                cy="50%"
                outerRadius={"85%"}
                nameKey="name"
                 fontSize={12}
                labelLine={true}
              >
                <LabelList
                  dy={0}
                  fill="white"
                  dataKey={renderCustomizedLabelPercentage}
                  position="inside"
                  fontSize={12}
                  angle={45}
                  stroke="none"
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