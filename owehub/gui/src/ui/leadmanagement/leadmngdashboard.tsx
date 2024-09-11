import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Sector } from 'recharts';
import styles from './styles/dashboard.module.css';
import {ICONS} from '../../resources/icons/Icons';
import { useNavigate } from 'react-router-dom';
const pieData = [
  { name: 'Pending leads', value: 135, color: '#FF832A' },
  { name: 'Appointment accepted', value: 21, color: '#52B650' },
  { name: 'Appointment sent', value: 29, color: '#81A6E7' },
  { name: 'Appointment declined', value: 15, color: '#CD4040' },
];

const lineData = [
  { name: 'Jan', won: 35, lost: 15 },
  { name: 'Feb', won: 40, lost: 20 },
  { name: 'Mar', won: 45, lost: 15 },
  { name: 'Apr', won: 40, lost: 30 },
  { name: 'May', won: 70, lost: 20 },
  { name: 'Jun', won: 45, lost: 35 },
  { name: 'Jul', won: 75, lost: 35 },
  { name: 'Aug', won: 90, lost: 40 },
  { name: 'Sep', won: 60, lost: 20 },
  { name: 'Oct', won: 55, lost: 30 },
  { name: 'Nov', won: 70, lost: 35 },
  { name: 'Dec', won: 80, lost: 45 },
];

const leads = [
  { name: 'Adam Samson', phone: '+00 876472822', email: 'adamsamson8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Pending' },
  { name: 'Kilewan ditcho', phone: '+00 876472822', email: 'Kilewanditcho8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Pending' },
  { name: 'Paul mark', phone: '+00 876472822', email: 'Paul mark8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Pending' },
  { name: 'Kilewan ditcho', phone: '+00 876472822', email: 'Paul mark8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Pending' },
  { name: 'Adam Samson', phone: '+00 876472822', email: 'adamsamson8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Sent' },
  { name: 'Adam Samson', phone: '+00 876472822', email: 'adamsamson8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Sent' },
  { name: 'Kilewan ditcho', phone: '+00 876472822', email: 'Kilewanditcho8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Sent' },
  { name: 'Paul mark', phone: '+00 876472822', email: 'Paul mark8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Sent' },
  { name: 'Kilewan ditcho', phone: '+00 876472822', email: 'Paul mark8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Accepted' },
  { name: 'Adam Samson', phone: '+00 876472822', email: 'adamsamson8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Declined' },
];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  const splitText = (text: string, width: number) => {
    const words = text.split(' ');
    const lines = [];
    let line = '';

    words.forEach(word => {
      const testLine = line + word + ' ';
      if (testLine.length > width) {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    });
    lines.push(line.trim());
    return lines;
  };





  const lines = splitText(payload.name, 15);

  return (
    <g>
      <text x={cx} y={cy - (lines.length - 1) * 6} textAnchor="middle" fill={fill}>
        {lines.map((line, index) => (
          <tspan key={index} x={cx} dy={index ? 15 : 0} style={{fontSize: '12px',wordBreak: 'break-word'}}>
            {line}
          </tspan>
        ))}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return '#FF832A';
    case 'Sent':
      return '#81A6E7';
    case 'Accepted':
      return '#52B650';
    case 'Declined':
      return '#CD4040';
    default:
      return '#000000';
  }
};

const LeadManagementDashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('Aug');
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('Pending');
  const [filteredLeads, setFilteredLeads] = useState(leads);
  const navigate = useNavigate(); 
  const handleHistory = () => {
    navigate('/leadmng-history');
  };
  const handleAddLead = () => {
    navigate('/leadmgt-addnew');
  };

  useEffect(() => {
    setFilteredLeads(leads.filter(lead => lead.status === currentFilter));
  }, [currentFilter]);

  const handleFilterClick = (filter: string) => {
    setCurrentFilter(filter);
  };

  const getLeadCount = (status: string) => {
    return leads.filter(lead => lead.status === status).length;
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.chartGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>Overview
          <div>Total leads: 200</div>
          </div>
          <div className={styles.cardContent}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.legend}>
              {pieData.map((item) => (
                <div key={item.name} className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: item.color }}></div>
                  <span className={styles.legendText}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Total Won Lost</span>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={styles.monthSelect}
            >
              {lineData.map((item) => (
                <option key={item.name} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.cardContent}>
          {/* <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => name === 'won' ? ['Total won', value] : ['Total Lost', value]} />
              <Legend formatter={(value) => value === 'won' ? 'Total won' : 'Total Lost'} />
              <Line type="monotone" dataKey="won" stroke="#57B93A" strokeWidth={2} name="Total won" />
              <Line type="monotone" dataKey="lost" stroke="#CD4040" strokeWidth={2} name="Total Lost" />
            </LineChart>
          </ResponsiveContainer> */}


           <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'won' ? 'Total won' : 'Total Lost', 
                    value
                  ]} 
                />
                <Legend 
                  formatter={(value) => value === 'won' ? 'Total won' : 'Total Lost'} 
                />
                <Line 
                  type="monotone" 
                  dataKey="won" 
                  stroke="#57B93A" 
                  strokeWidth={2} 
                  name="won" 
                />
                <Line 
                  type="monotone" 
                  dataKey="lost" 
                  stroke="#CD4040" 
                  strokeWidth={2} 
                  name="lost" 
                />
              </LineChart>
            </ResponsiveContainer>

          </div>
        </div>
      </div>
      
      <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.buttonGroup}>
          <button 
            className={`${styles.button} ${currentFilter === 'Pending' ? styles.buttonActive : ''}`}
            onClick={() => handleFilterClick('Pending')}
          >
            <p className={`${styles.status} ${currentFilter !== 'Pending' ? styles.statusInactive : ''}`}>
              {getLeadCount('Pending')}
            </p> 
            Pending
          </button>
          <button 
            className={`${styles.button} ${currentFilter === 'Sent' ? styles.buttonActive : ''}`}
            onClick={() => handleFilterClick('Sent')}
          >
            <p className={`${styles.status} ${currentFilter !== 'Sent' ? styles.statusInactive : ''}`}>
              {getLeadCount('Sent')}
            </p> 
            Sent
          </button>
          <button 
            className={`${styles.button} ${currentFilter === 'Accepted' ? styles.buttonActive : ''}`}
            onClick={() => handleFilterClick('Accepted')}
          >
            <p className={`${styles.status} ${currentFilter !== 'Accepted' ? styles.statusInactive : ''}`}>
              {getLeadCount('Accepted')}
            </p> 
            Accepted
          </button>
          <button 
            className={`${styles.button} ${currentFilter === 'Declined' ? styles.buttonActive : ''}`}
            onClick={() => handleFilterClick('Declined')}
          >
            <p className={`${styles.status} ${currentFilter !== 'Declined' ? styles.statusInactive : ''}`}>
              {getLeadCount('Declined')}
            </p> 
            Declined
          </button>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <div className={styles.filtericon} onClick={handleHistory}>
                  <img src={ICONS.refreshLeadMgmt} alt="" />
          </div>

          <div className={styles.filtericon} onClick={handleAddLead} >
                  <img src={ICONS.AddIconSr} alt="" />
          </div>
         </div>
      </div>

        <div className={styles.cardContent}>
          <table className={styles.table}>
            {/* <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
              </tr>
            </thead> */}
            <tbody>
              {filteredLeads.map((lead, index) => (
                // <tr key={index}>
                //   <td>{lead.name}</td>
                //   <td>{lead.phone}</td>
                //   <td>{lead.email}</td>
                //   <td>{lead.address}</td>
                // </tr>
                <div className={styles.history_lists}>
                        <div className={styles.history_list_inner}>
                            <label>
                                <input
                                    type="checkbox"
                                    style={{
                                        width: '16.42px',
                                        height: '16px',
                                        gap: '0px',
                                        borderRadius: '6px 0px 0px 0px',
                                        border: '1px solid #797979',
                                    }}
                                />
                            </label>
                            <div className={styles.user_name}>
                                <h2>Sanju samson</h2>
                                <p style={{ color: getStatusColor(lead.status) }}>{lead.status}</p>
                            </div>
                            <div className={styles.phone_number}>
                             {lead.phone}
                            </div>
                            <div className={styles.email}>
                                <p>sanjusamson19@gmail.com</p>
                                <img height={15} width={15} src={ICONS.complete} alt='img' />
                            </div>
                            <div className={styles.address}>
                            {lead.address}
                            </div>
                        </div>
                    </div>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadManagementDashboard;