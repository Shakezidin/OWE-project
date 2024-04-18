import React, { PureComponent } from "react";
import { PieChart, Pie, Cell, Label, LabelList, Legend} from "recharts";


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
      <div style={{ width: "100%" }}>
        <PieChart width={300} height={400} style={{ margin: "-75px 0 0 39px" }}>
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
          </Pie>
        </PieChart>
      </div>
    );
    
  }
}
