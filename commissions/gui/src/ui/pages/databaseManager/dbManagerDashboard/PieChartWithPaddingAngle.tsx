import React from "react";
import { PieChart, Pie, Cell, Label, LabelList } from "recharts";
import { useNavigate } from "react-router-dom";

interface DataItem {
  name: string;
  value: number;
  Historical_Records: number;
  Total_Records: number;
}

interface PieChartProps {
  data: DataItem[]; // Define data as prop
}

const COLORS = ["#FB7955", "#0088FE"];

const renderCustomizedLabelPercentage = (data: any, total = 32000) => {
  let percentageCalculated = data.value;
  return `${percentageCalculated}`;
};

function PieChartWithPaddingAngle({ data }: PieChartProps) { // Destructure data from props
  const navigate = useNavigate();

  const handleClick = (entry: DataItem, index: number) => {
    navigate(`/dbManager/webhooks`);
  };

  const totalValue = data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div style={{ width: "100%" }}>
      <PieChart width={300} height={400} style={{ margin: "-75px 0 0 62px", cursor: "pointer" }}>
        <Pie
          data={data}
          cx={120}
          cy={200}
          innerRadius={80}
          outerRadius={125}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
          onClick={handleClick}
        >
          <Label
            content={() => (
              <text
                x={120}
                y={200}
                dy={-10}
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
            fill="white"
            dataKey={renderCustomizedLabelPercentage}
            position="inside"
            angle={45}
            stroke="none"
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

export default PieChartWithPaddingAngle;
