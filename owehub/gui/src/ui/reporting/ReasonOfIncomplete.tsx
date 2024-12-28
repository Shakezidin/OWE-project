import React, {useState} from 'react';
import './ReasonOfIncomplete.css';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import CompanySelect from './components/Dropdowns/CompanySelect';
import WeekSelect from './components/Dropdowns/WeekSelect';
import BackButtom from './components/BackButtom';

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

interface Option {
  value: string;
  label: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps): JSX.Element | null => {
  if (percent < 0.1) {
    // If percentage is less than 10%, return null (no label)
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      fontSize={12}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ReasonOfIncomplete = () => {
  const titles = [
    'Survey (Weekly)',
    'Install (Weekly)',
    'Service (Weekly)',
    'MPU (Weekly)',
    'Derate (Weekly)',
    'Battery (Weekly)',
    'DER/LST/Sub-Panel (Weekly)',
  ];

  const chartDataSets = [
    {
      barData: Array.from({ length: 52 }, (_, index) => ({
        week: `Week ${index + 1}`,
        percent: Math.floor(Math.random() * 101), // Random percent between 0 and 100
        null: Math.floor(Math.random() * 50), // Random values for `null`
        no: Math.floor(Math.random() * 50), // Random values for `no`
        yes: '100%',
      })),
      pieData: [
        { name: 'Change SOW', value: 30 },
        { name: 'Customer Cancel', value: 40 },
        { name: 'Customer Is Not Okay…', value: 20 },
        { name: 'Customer Non Respon…', value: 10 },
        { name: 'Change SOW', value: 30 },
        { name: 'Customer Cancel', value: 40 },
        { name: 'Customer Is Not Okay…', value: 20 },
        { name: 'Customer Non Respon…', value: 10 },
      ],
    },
    {
      barData: Array.from({ length: 50 }, (_, index) => ({
        week: `Week ${index + 1}`,
        percent: Math.floor(Math.random() * 101), // Random percent between 0 and 100
        null: Math.floor(Math.random() * 50), // Random values for `null`
        no: Math.floor(Math.random() * 50), // Random values for `no`
        yes: '100%',
      })),
      pieData: [
        { name: 'Customer Reschedule', value: 25 },
        { name: 'Lack of Equipment', value: 35 },
        { name: 'Missed Photos', value: 25 },
        { name: 'No Access To Property', value: 15 },
        { name: 'Customer Reschedule', value: 25 },
        { name: 'Lack of Equipment', value: 35 },
        { name: 'Missed Photos', value: 25 },
        { name: 'No Access To Property', value: 15 },
      ],
    },
    {
      barData: Array.from({ length: 52 }, (_, index) => ({
        week: `Week ${index + 1}`,
        percent: Math.floor(Math.random() * 101), // Random percent between 0 and 100
        null: Math.floor(Math.random() * 50), // Random values for `null`
        no: Math.floor(Math.random() * 50), // Random values for `no`
        yes: '100%',
      })),
      pieData: [
        { name: 'Over Scheduling', value: 40 },
        { name: 'Sales Rep Reschedule', value: 30 },
        { name: 'Tech Is Not Available', value: 20 },
        { name: 'Tech Missed Arrival Wi…', value: 10 },
        { name: 'Over Scheduling', value: 40 },
        { name: 'Sales Rep Reschedule', value: 30 },
        { name: 'Tech Is Not Available', value: 20 },
        { name: 'Tech Missed Arrival Wi…', value: 10 },
      ],
    },
    {
      barData: Array.from({ length: 50 }, (_, index) => ({
        week: `Week ${index + 1}`,
        percent: Math.floor(Math.random() * 101), // Random percent between 0 and 100
        null: Math.floor(Math.random() * 50), // Random values for `null`
        no: Math.floor(Math.random() * 50), // Random values for `no`
        yes: '100%',
      })),
      pieData: [
        { name: 'Customer Reschedule', value: 30 },
        { name: 'Tech Missed Arrival Wi…', value: 30 },
        { name: 'No Access To Property', value: 20 },
        { name: 'Over Scheduling', value: 20 },
        { name: 'Customer Reschedule', value: 30 },
        { name: 'Tech Missed Arrival Wi…', value: 30 },
        { name: 'No Access To Property', value: 20 },
        { name: 'Over Scheduling', value: 20 },
      ],
    },
    {
      barData: Array.from({ length: 51 }, (_, index) => ({
        week: `Week ${index + 1}`,
        percent: Math.floor(Math.random() * 101), // Random percent between 0 and 100
        null: Math.floor(Math.random() * 50), // Random values for `null`
        no: Math.floor(Math.random() * 50), // Random values for `no`
        yes: '100%',
      })),
      pieData: [
        { name: 'Customer Cancel', value: 50 },
        { name: 'Customer Is Not Okay…', value: 25 },
        { name: 'Lack of Equipment', value: 15 },
        { name: 'Missed Photos', value: 10 },
        { name: 'Customer Cancel', value: 50 },
        { name: 'Customer Is Not Okay…', value: 25 },
        { name: 'Lack of Equipment', value: 15 },
        { name: 'Missed Photos', value: 10 },
      ],
    },
    {
      barData: Array.from({ length: 52 }, (_, index) => ({
        week: `Week ${index + 1}`,
        percent: Math.floor(Math.random() * 101), // Random percent between 0 and 100
        null: Math.floor(Math.random() * 50), // Random values for `null`
        no: Math.floor(Math.random() * 50), // Random values for `no`
        yes: '100%',
      })),
      pieData: [
        { name: 'Customer Cancel', value: 50 },
        { name: 'Customer Is Not Okay…', value: 25 },
        { name: 'Lack of Equipment', value: 15 },
        { name: 'Missed Photos', value: 10 },
        { name: 'Customer Cancel', value: 50 },
        { name: 'Customer Is Not Okay…', value: 25 },
        { name: 'Lack of Equipment', value: 15 },
        { name: 'Missed Photos', value: 10 },
      ],
    },
    {
      barData: Array.from({ length: 52 }, (_, index) => ({
        week: `Week ${index + 1}`,
        percent: Math.floor(Math.random() * 101), // Random percent between 0 and 100
        null: Math.floor(Math.random() * 50), // Random values for `null`
        no: Math.floor(Math.random() * 50), // Random values for `no`
        yes: '100%',
      })),
      pieData: [
        { name: 'Customer Cancel', value: 50 },
        { name: 'Customer Is Not Okay…', value: 25 },
        { name: 'Lack of Equipment', value: 15 },
        { name: 'Missed Photos', value: 10 },
        { name: 'Customer Cancel', value: 50 },
        { name: 'Customer Is Not Okay…', value: 25 },
        { name: 'Lack of Equipment', value: 15 },
        { name: 'Missed Photos', value: 10 },
      ],
    },
  ];

  const timeColors = {
    null: '#FBF9BD',
    no: '#CA3D01',
    yes: '#CFE621',
  };

  const tooltipStyle = {
    fontSize: '10px',
    padding: '6px',
    borderRadius: '4px',
  };

  const [selectedWeek, setSelectedWeek] = useState<Option>({
    label: 'Week 1',
    value: '1',
  });
  const handleWeekChange = (value: Option | null) => {
    if (value) {
      setSelectedWeek(value);
    }
  };

  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <BackButtom heading="Reason of Incomplete" />
        <div className="incomplete-dropdowns">
          <WeekSelect value={selectedWeek} onChange={handleWeekChange} />
          <CompanySelect />
        </div>
      </div>
      <div className="reports-yscroll">
        {chartDataSets.map((dataSet, index) => (
          <div key={index} className="time-completions">
            <div className="time-bar">
              <p className="time-bar-p">{titles[index]}</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dataSet.barData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                  barCategoryGap="0%"
                  barGap={0}
                >
                  <XAxis
                    dataKey="week"
                    interval={0}
                    tick={{ fontSize: 8, fill: '#555' }}
                    angle={-45}
                    dy={12}
                    dx={-10}
                  />
                  <YAxis
                    tickFormatter={(tick) => `${tick}%`}
                    tick={{ fontSize: 10, fill: '#555' }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    wrapperStyle={{
                      outline: 'none',
                      borderRadius: 0,
                      padding: 0,
                      boxShadow: 'none',
                    }}
                    formatter={(value) => `${value}%`}
                  />
                  <Legend
                    height={32}
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: 10, gap: 20, color: '#555' }}
                    payload={[
                      { value: 'Null', type: 'square', color: timeColors.null },
                      { value: 'No', type: 'square', color: timeColors.no },
                      { value: 'Yes', type: 'square', color: timeColors.yes },
                    ]}
                  />
                  <Bar dataKey="null" fill={timeColors.null} stackId="a" />
                  <Bar dataKey="no" fill={timeColors.no} stackId="a" />
                  <Bar
                    dataKey="yes"
                    fill={timeColors.yes}
                    stackId="a"
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="line"></div>
            <div className="time-radialbar">
              <p className="time-radialbar-p">Reason for Incompletion</p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataSet.pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="40%"
                    cy="50%"
                    outerRadius={110}
                    fill="#8884d8"
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {dataSet.pieData.map((entry, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    wrapperStyle={{
                      fontSize: 12,
                      outline: 'none',
                      borderRadius: 0,
                      padding: 0,
                      boxShadow: 'none',
                    }}
                    contentStyle={tooltipStyle}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="top"
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{
                      fontSize: '10px',
                      marginRight: 50,
                      marginTop: 50,
                    }}
                    height={100}
                    payload={dataSet.pieData.map((entry, i) => ({
                      value: entry.name,
                      type: 'circle',
                      color: COLORS[i % COLORS.length],
                    }))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReasonOfIncomplete;
