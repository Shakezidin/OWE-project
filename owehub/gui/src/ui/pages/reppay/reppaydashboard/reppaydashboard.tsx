import React, { useEffect, useState, useRef } from 'react';
import './repdasboard.css';
import Select from 'react-select';
import { ICONS } from '../../../icons/Icons';
import {
  comissionValueData,
  payRollData,
} from '../../../../resources/static_data/StaticData';
import RepDashBoardTable from './RepDashboardTable';
import RepDashBoardChart from './RepDashboardChart';
import RepPayDashboardTotal from './RepPayDashboardTotal';
import FilterModal from '../../../components/FilterModal/FilterModal';
import DropdownWithCheckboxes from './DropdownCheck';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

export const RepPayDashboardPage: React.FC = () => {
  const [active, setActive] = React.useState<number>(0);
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [selectedOption2, setSelectedOption2] = useState<string>(
    comissionValueData[0].label
  );
  const handleSelectChange2 = (
    selectedOption2: { value: string; label: string } | null
  ) => {
    setSelectedOption2(selectedOption2 ? selectedOption2.value : '');
  };
  const filterClose = () => {
    setFilterModal(false);
  };
  const handleToggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };
  const handleSelect = (ranges: any) => {
    setSelectionRange(ranges.selection);
  };

  const handleResetDates = () => {
    setSelectionRange({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    });
  };

  const includeData = [
    { value: 'All', label: 'All' },
    { value: 'AP-DTH', label: 'AP-DTH' },
    { value: 'AP-PDA', label: 'AP-PDA' },
    { value: 'AP-ADV', label: 'AP-ADV' },
    { value: 'AP-DED', label: 'AP-DED' },
    { value: 'REP-COMM', label: 'REP-COMM' },
    { value: 'REP BONUS', label: 'REP BONUS' },
    { value: 'LEADER', label: 'LEADER' },
  ];

  const [selectedOption3, setSelectedOption3] = useState<string>(
    includeData[0].label
  );
  const handleSelectChange3 = (
    selectedOption3: { value: string; label: string } | null
  ) => {
    setSelectedOption3(selectedOption3 ? selectedOption3.value : '');
  };

  // used for close date click outside anywhere
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="rep-Dashboard-section-container">
        <div className="rep-Dashboard-container">
          <div className="manage-user"></div>
          <div className="rep-dashboard-payroll">
            <div className="rep-dash-head-input">
              <label className="rep-inputLabel" style={{ color: '#344054' }}>
                Includes
              </label>
              <DropdownWithCheckboxes />
            </div>

            <div className="rep-dash-head-input">
              <label className="inputLabel" style={{ color: '#344054' }}>
                Commission Model
              </label>
              <Select
                options={comissionValueData}
                value={comissionValueData.find(
                  (option) => option.value === selectedOption2
                )}
                onChange={handleSelectChange2}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    fontSize: '13px',
                    fontWeight: '500',
                    borderRadius: '.40rem',
                    border: 'none',
                    outline: 'none',
                    width: '6rem',
                    minHeight: 'unset',
                    height: '30px',
                    alignContent: 'center',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                  }),
                  indicatorSeparator: () => ({
                    display: 'none',
                  }),
                  dropdownIndicator: (baseStyles, state) => ({
                    ...baseStyles,
                    color: '#0493CE',
                    '&:hover': {
                      color: '#0493CE',
                    },
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    fontSize: '13px',
                    color: state.isSelected ? '#ffffff' : '#0000000',
                    backgroundColor: state.isSelected ? '#0493CE' : '#ffffff',
                    '&:hover': {
                      backgroundColor: state.isSelected ? '#0493CE' : '#DDEBFF',
                    },
                  }),
                  singleValue: (baseStyles, state) => ({
                    ...baseStyles,
                    color: '#0493CE',
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    width: '6rem',
                  }),
                }}
              />
            </div>

            <div className="rep-dash-head-input">
              <label className="inputLabel" style={{ color: '#344054' }}>
                Payroll Date
              </label>

              <div
                style={{
                  position: 'relative',
                  top: '-1px',
                  backgroundColor: 'white',
                }}
                ref={datePickerRef}
              >
                <label
                  className="rep-date-button"
                  onClick={handleToggleDatePicker}
                  style={{ color: '#0493CE' }}
                >
                  Select Date
                </label>
                {showDatePicker && (
                  <div className="calender-container">
                    <DateRangePicker
                      ranges={[selectionRange]}
                      onChange={handleSelect}
                    />
                    <button
                      className="reset-calender"
                      onClick={handleResetDates}
                    >
                      Reset
                    </button>
                    <button
                      className="close-calender"
                      onClick={handleToggleDatePicker}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rep-dash-head-input">
              <label className="inputLabel" style={{ color: '#344054' }}>
                Set Default
              </label>
              <label
                className="inputLabel rep-chart-view"
                style={{ color: '#0493CE' }}
              >
                Chart View
              </label>
            </div>

            <div className="Line-container">
              <div className="rep-line-graph">
                <div
                  className={`rep-filter-line ${
                    active === 0 ? 'rep-active-filter-line' : ''
                  }`}
                  onClick={() => setActive(0)}
                >
                  {active === 0 ? (
                    <img src={ICONS.dashActive} alt="" />
                  ) : (
                    <img src={ICONS.dashHead} alt="" />
                  )}
                </div>
                <div
                  className={`filter-disable ${
                    active === 1 ? 'rep-active-filter-line' : ''
                  }`}
                  // onClick={() => setActive(1)}
                  style={{ border: '1px solid #0493CE' }}
                >
                  {active === 1 ? (
                    <img src={ICONS.viewActive} alt="" />
                  ) : (
                    <img src={ICONS.viewChart} alt="" />
                  )}
                </div>
                <div
                  className="rep-filter-line"
                  style={{ border: '1px solid #0493CE' }}
                  onClick={() => setFilterModal(true)}
                >
                  <img src={ICONS.FILTER} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <RepPayDashboardTotal />
          {/* <DonutChart /> */}
        </div>
        {filterModal && (
          <FilterModal
            handleClose={filterClose}
            columns={[]}
            page_number={1}
            page_size={10}
            fetchFunction={() => {}}
          />
        )}
        <div className="" style={{ marginTop: '20px' }}>
          {active === 0 && <RepDashBoardTable />}
          {active === 1 && <RepDashBoardChart />}
        </div>
      </div>
    </>
  );
};
