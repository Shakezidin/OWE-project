/* eslint-disable no-shadow */
import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import LineChart from './BarLineChart';
import TinyBarChart from './TinyBarChart';
import DashboardTotal from '../DashboardTotal';

// const RADIAN = Math.PI / 180;
const data = [
  { name: 'A', value: 80, color: '#ff0000' },
  { name: 'B', value: 45, color: '#00ff00' },
  { name: 'C', value: 25, color: '#0000ff' },
];
const cx = 280;
const cy = 150;
const iR = 50;
const oR = 100;
const value = 50;

export default class DonutChart extends PureComponent {
  render() {
    return (
      <>
        <div
          className="PieChart-container"
          style={{ display: 'flex', gap: '2rem' }}
        >
          <div
            className="pie-section"
            style={{
              width: '50%',
              height: '60vh',
              background: 'white',
              borderRadius: '16px',
              padding: '1rem',
              border: '1px solid #D0D5DD',
            }}
          >
            <div className="pieChart-section">
              <p>Commission</p>
            </div>
            <PieChart width={500} height={300}>
              <Pie
                dataKey="value"
                startAngle={360}
                endAngle={0}
                data={data}
                cx={cx}
                cy={cy}
                innerRadius={iR}
                outerRadius={oR}
                fill="#8884d8"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div
            className="pie-section"
            style={{
              width: '50%',
              height: '60vh',
              background: 'white',
              borderRadius: '16px',
              padding: '1rem',
              border: '1px solid #D0D5DD',
            }}
          >
            <div className="pieChart-section">
              <p>Month Wise Commission</p>
            </div>
            <LineChart />
          </div>
        </div>
        <div
          className="pie-section"
          style={{
            marginTop: '2rem',
            width: '100%',
            height: '80vh',
            background: 'white',
            borderRadius: '16px',
            padding: '1rem',
            border: '1px solid #D0D5DD',
          }}
        >
          <div className="pieChart-section">
            <p>Top 10 Sales Rep.</p>
          </div>

          <TinyBarChart />
        </div>
      </>
    );
  }
}
