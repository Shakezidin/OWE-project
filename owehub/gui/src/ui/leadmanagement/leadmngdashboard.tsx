import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Sector } from 'recharts';
import styles from './styles/dashboard.module.css';
import { ICONS } from '../../resources/icons/Icons';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../ui/components/pagination/Pagination';
import ArchiveModal from '../../ui/leadmanagement/Modals/LeaderManamentSucessModel';
import ConfirmModel from '../../ui/leadmanagement/Modals/ConfirmModel';

type Lead = {
  name: string;
  phone: string;
  email: string;
  address: string;
  status: string;
};

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
  { name: 'Kilewan dicho', phone: '+00 876472822', email: 'Kilewanditcho8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Pending' },
  { name: 'Adam Samson', phone: '+00 876472822', email: 'Paul mark8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Pending' },
  { name: 'Kilewan dicho', phone: '+00 876472822', email: 'Paul mark8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Pending' },
  { name: 'Adam Samson', phone: '+00 876472822', email: 'adamsamson8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Sent' },
  { name: 'Adam Samson', phone: '+00 876472822', email: 'adamsamson8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Sent' },
  { name: 'Kilewan dicho', phone: '+00 876472822', email: 'Kilewanditcho8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Sent' },
  { name: 'Adam Samson', phone: '+00 876472822', email: 'Paul mark8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Sent' },
  { name: 'Kilewan dicho', phone: '+00 876472822', email: 'Paul mark8772@gmail.com', address: '12778 Domingo Ct, 1233Parker, CO', status: 'Accepted' },
  { name: 'Adam', phone: '+00 876472822', email: 'adam8772@gmail.com', address: '12778 Domingo Ct', status: 'Declined' },
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

  // Center text in pie chart
  const splitText = (text: string, width: number) => {
    const words = text.split(' ');
    const lines = [];
    let line = '';

    words.forEach((word: string) => {
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
          <tspan key={index} x={cx} dy={index ? 15 : 0} style={{ fontSize: '12.07px', wordBreak: 'break-word' }}>
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
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" style={{ fontSize: '12.07px' }}>
        {`${value}`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" style={{ fontSize: '12.07px' }}>
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

const statusMap = {
  'Pending leads': 'Pending',
  'Appointment accepted': 'Accepted',
  'Appointment sent': 'Sent',
  'Appointment declined': 'Declined'
};

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '5px 10px',
        // border: '1px solid #f0f0f0',
        borderRadius: '4px',
        // boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: '2px 0', color: '#57B93A', fontWeight: 'bold',fontSize:11 }}>{`${payload[0].value} Closed Won`}</p>
        <p style={{ margin: '2px 0', color: '#CD4040', fontWeight: 'bold',fontSize:11 }}>{`${payload[1].value} Closed Lost`}</p>
      </div>
    );
  }
  return null;
};

const LeadManagementDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('Aug');
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('Pending');
  const [filteredLeads, setFilteredLeads] = useState(leads);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [leadToArchive, setLeadToArchive] = useState<Lead | null>(null);
  const [selectedDate, setSelectedDate] = useState('25 Aug, 2024');

  const itemsPerPage = 5;
  const navigate = useNavigate();

  const handleHistory = () => {
    navigate('/leadmng-history');
  };

  const handleAddLead = () => {
    navigate('/leadmgt-addnew');
  };

  useEffect(() => {
    const pieName = pieData[activeIndex].name;
    const newFilter = statusMap[pieName as keyof typeof statusMap];
    setCurrentFilter(newFilter);
    setFilteredLeads(leads.filter(lead => lead.status === newFilter));
  }, [activeIndex]);

  const handlePieClick = (_: React.MouseEvent<SVGElement>, index: number) => {
    setActiveIndex(index);
  };

  const handleFilterClick = (filter: string) => {
    setCurrentFilter(filter);
    setFilteredLeads(leads.filter(lead => lead.status === filter));
    setActiveIndex(pieData.findIndex(item => statusMap[item.name as keyof typeof statusMap] === filter));
  };

  const getLeadCount = (status: string) => {
    return leads.filter(lead => lead.status === status).length;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredLeads.length / itemsPerPage)));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));


  const handleLeadSelection = (lead: Lead) => {
    setSelectedLeads(prev => 
      prev.includes(lead) ? prev.filter(l => l !== lead) : [...prev, lead]
    );
  };

  const handleArchiveSelected = () => {
    // Implement the logic to remove selected leads
    setFilteredLeads(prev => prev.filter(lead => !selectedLeads.includes(lead)));
    setSelectedLeads([]);
  };

  const handleReschedule = (lead: any) => {
    console.log(`Lead ${lead.name} is being rescheduled`);
    handleFilterClick('Pending'); // Switch to the "Pending" tab
  };
  

  const handleArchive = (lead: Lead) => {
    setLeadToArchive(lead); // Store the lead to be archived
    setShowArchiveModal(true); // Show the modal
  };

  const handleDetailModal= (lead: Lead) => {
    setShowConfirmModal(true); // Show detail modal
  };
  console.log("currentFilter",currentFilter)
  

  return (
    <div className={styles.dashboard}>
      {showConfirmModal && (
        <ConfirmModel
        // isOpen={filterOPen} handleClose={filterClose}
        />
      )}

      {showArchiveModal && (
        <ArchiveModal
        // isOpen={filterOPen} handleClose={filterClose}
        />
      )}

      <div className={styles.chartGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            Overview
            <div>Total leads: 200</div>
          </div>
          <div className={styles.cardContent}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart className={styles.pieChart}>
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
                  onClick={handlePieClick}
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
        
        <div className={`${styles.card} ${styles.lineCard}`}>
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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value) => value === 'won' ? 'Total won' : 'Total Lost'}
                  wrapperStyle={{ fontSize: '12px'}} 
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
          {selectedLeads.length === 0 ? (
            <>
              <div className={styles.buttonGroup}>
                {['Pending', 'Sent', 'Accepted', 'Declined'].map((status) => (
                  <button
                    key={status}
                    className={`${styles.button} ${currentFilter === status ? styles.buttonActive : ''}`}
                    onClick={() => handleFilterClick(status)}
                  >
                    <p className={`${styles.status} ${currentFilter !== status ? styles.statusInactive : ''}`}>
                      {getLeadCount(status)}
                    </p>
                    {status}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className={styles.filtericon} onClick={handleHistory}>
                  <img src={ICONS.historyLeadMgmt} alt="" width="100" height="100" />
                </div>
                <div className={styles.filtericon} onClick={handleAddLead}>
                  <img src={ICONS.AddIconSr} alt=""  width="80" height="80" />
                </div>
              </div>
            </>
          ) : (
            <div className={styles.selectionHeader}>
              <div className={styles.selectionInfo}>
                <span className={styles.closeIcon} onClick={() => setSelectedLeads([])}>
                <img
                  src={ICONS.cross}
                  alt=""
                  height="26" width="26"
                />
                </span>
                <span>{selectedLeads.length} Selected</span>
              </div>
              <button className={styles.removeButton} onClick={handleArchiveSelected}>
                Archived
              </button>
            </div>
          )}
        </div>

        <div className={styles.cardContent}>
        <table className={styles.table}>
            <tbody>
              {currentLeads.map((lead, index) => (
                <tr key={index} className={styles.history_lists} onClick={() => currentFilter == "Pending" && handleDetailModal(lead)}>
                  <td className={styles.history_list_inner}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead)}
                        onChange={() => handleLeadSelection(lead)}
                      />
                    </label>
                    <div className={styles.user_name}>
                      <h2>{lead.name}</h2>
                      <p style={{ color: getStatusColor(lead.status) }}>{lead.status}</p>
                    </div>
                    <div className={styles.phone_number}>{lead.phone}</div>
                    <div className={styles.email}>
                      <span>{lead.email}
                        <img className='ml1' height={15} width={15} src={ICONS.complete} alt="verified" />
                      </span>
                    </div>
                    <div className={styles.address}>{lead.address}</div>
                    
                    {lead.status === 'Declined' && (
                      <div className={styles.actionButtons}>
                        <button onClick={() => handleReschedule(lead)} className={styles.rescheduleButton}>Reschedule</button>
                        <button onClick={() => handleArchive(lead)} className={styles.archiveButton}>Archive</button>

                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.paginationContainer} style={{ textAlign: 'right' }}>
            {filteredLeads.length > 0 && (
              <div className="p1 lead-pagination">
                <p className={styles.pageHeading}>
                  {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredLeads.length)} of {filteredLeads.length} items
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredLeads.length / itemsPerPage)}
                  paginate={paginate}
                  goToNextPage={goToNextPage}
                  goToPrevPage={goToPrevPage}
                  perPage={itemsPerPage}
                  currentPageData={currentLeads}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadManagementDashboard;