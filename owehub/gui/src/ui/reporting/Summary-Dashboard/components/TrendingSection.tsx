import React, { useState } from 'react';
import './HistoricalTrends.css';
import SelectOption from '../../../components/selectOption/SelectOption';
import DropdownCheckbox from '../../../components/DropdownCheckBox';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';

const colors = {
  Sales: '#20c6c6',
  NTP: '#627ef7',
  Install: '#ec5df7',
  Battery: '#e5b600',
  Cancel: '#E1D6FB',
} as const;

type FilterType = keyof typeof colors | 'All';

interface DataPoint {
  name: string;
  Sales: number;
  NTP: number;
  Install: number;
  Battery: number;
  Cancel: number;
}

interface Option {
  value: string;
  label: string;
}

const data: DataPoint[] = [
  {
    name: 'Jan 2022',
    Sales: 2000,
    NTP: 1200,
    Install: 1500,
    Battery: 900,
    Cancel: 500,
  },
  {
    name: 'Feb 2022',
    Sales: 2200,
    NTP: 1300,
    Install: 1400,
    Battery: 950,
    Cancel: 600,
  },
  {
    name: 'Mar 2022',
    Sales: 2100,
    NTP: 1500,
    Install: 1700,
    Battery: 1000,
    Cancel: 550,
  },
  {
    name: 'Apr 2023',
    Sales: 2400,
    NTP: 1600,
    Install: 1900,
    Battery: 1150,
    Cancel: 750,
  },
  {
    name: 'Dec 2023',
    Sales: 2600,
    NTP: 1900,
    Install: 2100,
    Battery: 1350,
    Cancel: 850,
  },
  {
    name: 'Apr 2024',
    Sales: 2700,
    NTP: 2000,
    Install: 2200,
    Battery: 1450,
    Cancel: 900,
  },
  {
    name: 'Aug 2024',
    Sales: 2800,
    NTP: 2100,
    Install: 2300,
    Battery: 1550,
    Cancel: 950,
  },
  {
    name: 'Dec 2024',
    Sales: 2600,
    NTP: 1950,
    Install: 2200,
    Battery: 1500,
    Cancel: 950,
  },
  {
    name: 'Jan 2023',
    Sales: 3886,
    NTP: 1910,
    Install: 1538,
    Battery: 1577,
    Cancel: 1325,
  },
  {
    name: 'Feb 2023',
    Sales: 2774,
    NTP: 2151,
    Install: 2077,
    Battery: 1465,
    Cancel: 1379,
  },
  {
    name: 'Mar 2023',
    Sales: 3017,
    NTP: 1928,
    Install: 2661,
    Battery: 1667,
    Cancel: 1277,
  },
  {
    name: 'Apr 2023',
    Sales: 2761,
    NTP: 1303,
    Install: 2112,
    Battery: 1408,
    Cancel: 857,
  },
  {
    name: 'May 2023',
    Sales: 3244,
    NTP: 2494,
    Install: 1763,
    Battery: 1005,
    Cancel: 840,
  },
  {
    name: 'Jun 2023',
    Sales: 2975,
    NTP: 2480,
    Install: 2377,
    Battery: 1031,
    Cancel: 1237,
  },
  {
    name: 'Jul 2023',
    Sales: 3788,
    NTP: 1387,
    Install: 2328,
    Battery: 939,
    Cancel: 1082,
  },
  {
    name: 'Aug 2023',
    Sales: 2299,
    NTP: 2398,
    Install: 1725,
    Battery: 1302,
    Cancel: 775,
  },
  {
    name: 'Sep 2023',
    Sales: 2718,
    NTP: 2418,
    Install: 2615,
    Battery: 1449,
    Cancel: 1078,
  },
  {
    name: 'Oct 2023',
    Sales: 3652,
    NTP: 1955,
    Install: 2173,
    Battery: 1070,
    Cancel: 1387,
  },
  {
    name: 'Nov 2023',
    Sales: 2667,
    NTP: 1488,
    Install: 2638,
    Battery: 1197,
    Cancel: 1212,
  },
  {
    name: 'Dec 2023',
    Sales: 3743,
    NTP: 1480,
    Install: 2906,
    Battery: 912,
    Cancel: 1315,
  },
  {
    name: 'Jan 2022',
    Sales: 3101,
    NTP: 1207,
    Install: 1833,
    Battery: 1799,
    Cancel: 1399,
  },
  {
    name: 'Feb 2022',
    Sales: 2962,
    NTP: 2493,
    Install: 1728,
    Battery: 1249,
    Cancel: 1068,
  },
  {
    name: 'Mar 2022',
    Sales: 2662,
    NTP: 2169,
    Install: 1695,
    Battery: 1129,
    Cancel: 1242,
  },
  {
    name: 'Apr 2022',
    Sales: 2084,
    NTP: 1677,
    Install: 2892,
    Battery: 1799,
    Cancel: 920,
  },
  {
    name: 'May 2022',
    Sales: 2469,
    NTP: 1723,
    Install: 1547,
    Battery: 1937,
    Cancel: 818,
  },
  {
    name: 'Jun 2022',
    Sales: 2059,
    NTP: 2179,
    Install: 1663,
    Battery: 1198,
    Cancel: 1464,
  },
  {
    name: 'Jul 2022',
    Sales: 3379,
    NTP: 1216,
    Install: 1609,
    Battery: 1193,
    Cancel: 745,
  },
  {
    name: 'Aug 2022',
    Sales: 2153,
    NTP: 1783,
    Install: 2138,
    Battery: 1633,
    Cancel: 1349,
  },
  {
    name: 'Sep 2022',
    Sales: 3027,
    NTP: 1985,
    Install: 2461,
    Battery: 1012,
    Cancel: 1332,
  },
  {
    name: 'Oct 2022',
    Sales: 3838,
    NTP: 1246,
    Install: 1549,
    Battery: 1339,
    Cancel: 1113,
  },
  {
    name: 'Nov 2022',
    Sales: 2308,
    NTP: 1879,
    Install: 2946,
    Battery: 1938,
    Cancel: 1470,
  },
  {
    name: 'Dec 2022',
    Sales: 3764,
    NTP: 2106,
    Install: 1803,
    Battery: 952,
    Cancel: 995,
  },
];

const years = [
  { label: '2022', value: '2022' },
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
];

const Days = [
  { label: '30 Days', value: '30' },
  { label: '60 Days', value: '60' },
  { label: '90 Days', value: '90' },
];

const HistoricalTrends: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');
  const [selectedYear, setSelectedYear] = useState<Option[]>([]);
  const [days, setDays] = useState<Option>({ label: '30 Days', value: '30' });

  const toggleFilter = (filter: FilterType) => {
    setSelectedFilter(filter === 'All' ? 'All' : filter);
  };

  // Function to filter data based on selected years
  const getFilteredData = () => {
    if (selectedYear.length === 0) return data;

    const selectedYearsSet = new Set(selectedYear.map((y) => y.value));
    return data.filter((entry) =>
      selectedYearsSet.has(entry.name.split(' ')[1])
    );
  };
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const wrapper = document.querySelector('.chart-wrapper .recharts-surface');
    const chartWrapper = document.querySelector('.chart-wrapper');
    const yAxis = document.querySelector('.chart-wrapper .recharts-yAxis') as HTMLElement | null;
    
    if (yAxis) {
      // Create white background rectangle to prevent content bleed
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const yAxisHeight = yAxis.getBoundingClientRect().height;
      const yAxisWidth = yAxis.getBoundingClientRect().width;
      
      rect.setAttribute('x', '0');
      rect.setAttribute('y', '0');
      rect.setAttribute('width', yAxisWidth.toString());
      rect.setAttribute('height', yAxisHeight.toString());
      rect.setAttribute('fill', 'white');
      rect.setAttribute('class', 'y-axis-background');
      
    //   // Remove existing background if present
    //   const existingRect = yAxis.querySelector('.y-axis-background');
    //   if (existingRect) existingRect.remove();
      
      yAxis.insertBefore(rect, yAxis.firstChild);
      
      // Fix Y-axis position
      yAxis.style.transform = `translateX(${e.currentTarget.scrollLeft}px)`;
    }
  };

  return (
    <div className="historical-trends">
      <h2>Historical Trends</h2>

      {/* Filters */}
      <div className="top-section">
        <p className="overview-title">Overview</p>
        <div className="filters">
          <button
            className={`filter-button ${selectedFilter === 'All' ? 'active' : ''}`}
            onClick={() => toggleFilter('All')}
          >
            All
          </button>
          {Object.keys(colors).map((filter) => (
            <button
              key={filter}
              className={`filter-button ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => toggleFilter(filter as keyof typeof colors)}
            >
              <span className={`color-dot ${filter.toLowerCase()}`}></span>
              {filter}
            </button>
          ))}
        </div>

        {/* Dropdown Section */}
        <div className="dropdown-section">
          <div className="dropdown-container">
            {/* Days Dropdown */}
            <SelectOption
              options={Days}
              onChange={(value: any) => setDays(value)}
              value={days}
              controlStyles={{ marginTop: 0, minHeight: 30, minWidth: 120 }}
              menuWidth={'120px'}
              menuListStyles={{ fontWeight: 400 }}
              singleValueStyles={{ fontWeight: 400 }}
            />

            {/* Years Dropdown */}
            <DropdownCheckbox
              label="Years"
              placeholder="Select a Year"
              selectedOptions={selectedYear}
              options={years}
              onChange={(val) => setSelectedYear(val)}
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <div 
          className="chart-wrapper" 
          style={{ 
            overflowX: 'auto',
            overflowY: 'hidden',
            width: '100%',
            position: 'relative'
          }}
          onScroll={handleScroll}
        >
          <ResponsiveContainer
            width={data.length > 12 ? data.length * 100 : '100%'}
            height={300}
          >
            {selectedFilter === 'All' ? (
              <LineChart
                data={getFilteredData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid stroke="#e0e0e0" strokeDasharray="4 4" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 14, fill: '#767676', fontWeight: 500 }}
                />
                <YAxis 
                  tick={{ fontSize: 14, fill: '#767676', fontWeight: 500 }}
                  style={{ 
                    position: 'sticky', 
                    left: 0,
                    backgroundColor: 'white',
                    zIndex: 1,
                    paddingRight: '10px'
                  }}
                />
                {Object.keys(colors).map((filter) => (
                  <Line
                    key={filter}
                    type="monotone"
                    dataKey={filter}
                    stroke={colors[filter as keyof typeof colors]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            ) : (
              <AreaChart
                data={getFilteredData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid stroke="#e0e0e0" strokeDasharray="4 4" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 14, fill: '#767676', fontWeight: 500 }}
                />
                <YAxis 
                  tick={{ fontSize: 14, fill: '#767676', fontWeight: 500 }}
                  style={{ 
                    position: 'sticky', 
                    left: 0,
                    backgroundColor: 'white',
                    zIndex: 1,
                    paddingRight: '10px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={selectedFilter}
                  stroke={colors[selectedFilter as keyof typeof colors]}
                  fill={colors[selectedFilter as keyof typeof colors]}
                  fillOpacity={0.3}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default HistoricalTrends;
