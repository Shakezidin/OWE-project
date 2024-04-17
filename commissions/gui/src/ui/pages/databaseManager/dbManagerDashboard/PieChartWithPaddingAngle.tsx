import React, { PureComponent } from "react";
import { PieChart, Pie, Cell, Label, LabelList} from "recharts";


const data = [
  { name: "Group A", value: 200, Historical_Records: 100, Total_Records: 150 },
  { name: "Group B", value: 500, Historical_Records: 250, Total_Records: 300 },
];

const COLORS = ["#FB7955", "#0088FE"];

const renderCustomizedLabelPercentage = (data: any, total = 32000) => {
  let percentageCalculated = data.value;
  return percentageCalculated;
};

export default class PieChartWithPaddingAngle extends PureComponent {
  render() {
    const totalValue = data.reduce((acc, cur) => acc + cur.value, 0);
    return (
      <div style={{ width: "100%",  margin: "0rem 0 0 -17rem" }}>
        <PieChart width={500} height={400}>
          <Pie
            data={data}
            cx={120}
            cy={200}
            innerRadius={80}
            outerRadius={125}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
          >
           <Label
              content={() => (
                <text
                  x={120}
                  y={200}
                  dy={-10} // Adjust vertical position of the first line
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="center-label"
                >
                  Total
                  <tspan x={120} dy={24} fontSize="1.5em" fontWeight="bold">{totalValue}</tspan>
                </text>
              )}
            />
            <LabelList
              dy={0}
              fill="white" // Percentage color
              dataKey={renderCustomizedLabelPercentage}
              position="inside"
              angle={45}
              stroke="none" // Border of letters
              className="label-percentage"
            />
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
             <g>
            {/* Pass */}
            <rect x={120} y={250} width={40} height={40} fill="#FF0000" />
            <text x={170} y={280} fill="#000000">30% Pass</text>
            {/* Fail */}
            <rect x={170} y={250} width={40} height={40} fill="#800080" />
            <text x={220} y={280} fill="#000000">70% Fail</text>
          </g>
          </Pie>
        </PieChart>
      </div>
    );
    
  }
}
