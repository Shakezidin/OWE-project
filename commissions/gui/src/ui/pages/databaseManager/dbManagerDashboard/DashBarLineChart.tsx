import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Table 1",
    Total_Records: 800,
    Historical_Records: 1400,
    amt: 2000,
  },
  {
    name: "Table 2",
    Total_Records: 500,
    Historical_Records: 1500,
    amt: 2000,
  },
  {
    name: "Table 3",
    Total_Records: 100,
    Historical_Records: 300,
    amt: 2000,
  },
  {
    name: "Table 4",
    Total_Records: 300,
    Historical_Records: 900,
    amt: 2000,
  },
  {
    name: "Table 5",
    Total_Records: 50,
    Historical_Records: 150,
    amt: 2000,
  },
  {
    name: "Table 6",
    Total_Records: 800,
    Historical_Records: 200,
    amt: 2000,
  },
  {
    name: "Table 7",
    Total_Records: 200,
    Historical_Records: 800,
    amt: 2000,
  },
];

export default class LineChart extends PureComponent {
  // static demoUrl = 'https://codesandbox.io/s/simple-bar-chart-tpz8r';

  render() {
    return (
      <div className="" >
        <div className="dash-section" style={{padding:"1rem"}}>
          <p>Total Table Record</p>
        </div>
        <div style={{ width: "100%", height: "35vh", marginTop:"1rem" }}>
          <ResponsiveContainer width="100%" height="110%">
            <BarChart
              width={500}
              height={500}
              data={data}
            
              margin={{
                // top: 50,
                right: 30,
                left: 20,
                
                // bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Historical_Records"
                fill="#FB7955"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
              <Bar
                dataKey="Total_Records"
                fill="#007AF5"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
