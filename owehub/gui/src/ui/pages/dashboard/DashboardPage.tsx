import React, { useState, useEffect, useRef } from 'react';
import './dasboard.css';
import Select from 'react-select';
import DashboardTotal from './DashboardTotal';
import { ICONS } from '../../icons/Icons';
import DashBoardTable from './DashBoardTable';
import DashBoardChart from './DashBoardChart';
import { comissionValueData } from '../../../resources/static_data/StaticData';
import FilterModal from '../../components/FilterModal/FilterModal';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { useAppDispatch } from '../../../redux/hooks';
import { getDealerPay } from '../../../redux/apiActions/dealerPayAction';

export const DashboardPage: React.FC = () => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dispatch = useAppDispatch();

  const handleSelect = (ranges: any) => {
    setSelectionRange(ranges.selection);
  };

  const handleToggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleResetDates = () => {
    setSelectionRange({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    });
  };
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = React.useState<number>(0);
  const [filterModal, setFilterModal] = React.useState<boolean>(false);

  /* const [selectedOption, setSelectedOption] = useState<string>(
    payRollData[0].label
  );*/
  const [selectedOption2, setSelectedOption2] = useState<string>(
    comissionValueData[0].label
  );

  /* const handleSelectChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
  setSelectedOption(selectedOption ? selectedOption.value : "");
  };*/
  const handleSelectChange2 = (
    selectedOption2: { value: string; label: string } | null
  ) => {
    setSelectedOption2(selectedOption2 ? selectedOption2.value : '');
  };
  const filterClose = () => {
    setFilterModal(false);
  };

  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    dispatch(getDealerPay({
      page_number:currentPage,
      page_size:itemsPerPage,
      pay_roll_start_date:"",
      pay_roll_end_date:"",
      use_cutoff:"",
      dealer_name:"",
      sort_by:""
    }))
  },[currentPage])

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
      <div className="Dashboard-section-container">
        <div className='white-back'>
          <div className="DashboardPage-container">
            <div className="rep-manage-user">


              <div className="dash-head-input" style={{ minWidth: '185px' }}>
                <div className='rep-drop_label' style={{ backgroundColor: "#57B3F1" }}>
                  <img src={ICONS.lable_img} alt="" />
                </div>
                <div className='rep-up relative'>
                  <label className="inputLabel" style=
                    {{
                      color: '#344054',
                      position: 'absolute',
                      left: '8px',
                      top: '-6px',
                      whiteSpace: 'nowrap'
                    }}>
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
                        fontSize: '12px',
                        fontWeight: '500',
                        borderRadius: '.40rem',
                        border: 'none',
                        outline: 'none',
                        width: 'fit-content',
                        minHeight: 'unset',
                        height: '8px',
                        alignContent: 'center',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        marginRight: '33px',
                        marginBottom: '2px',
                        boxShadow: 'none',
                        marginTop: '18px'
                      }),
                      indicatorSeparator: () => ({
                        display: 'none',
                      }),
                      dropdownIndicator: (baseStyles, state) => ({
                        ...baseStyles,
                        color: '#292929',
                        '&:hover': {
                          color: '#292929',
                        },
                        marginLeft: '-18px'
                      }),
                      option: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '13px',
                        color: state.isSelected ? '#ffffff' : '#0000000',
                        backgroundColor: state.isSelected ? '#377CF6' : '#ffffff',
                        '&:hover': {
                          backgroundColor: state.isSelected ? '#377CF6' : '#DDEBFF',
                        },
                      }),
                      singleValue: (baseStyles, state) => ({
                        ...baseStyles,
                  
                        color:selectedOption2? '#292929' : '#8b8484' ,
                        width: 'fit-content',
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        width: '131px',
                        left: -31
                        
                      }),
                    }}
                  />
                </div>
              </div>

              {/* <div className="dash-head-input">
              <label className="inputLabel" style={{ color: '#344054' }}>
                Set Default
              </label>
              <label
                className="inputLabel dashboard-chart-view"
                style={{ color: '#0493CE' }}
              >
                Chart View
              </label>
            </div> */}

              <div className="dash-head-input" style={{ width: "250px" }}>


                <div className='rep-drop_label' style={{ backgroundColor: "#C470C7" }}>
                  <img src={ICONS.includes_icon} alt="" />
                </div>
                <div className='rep-up relative'>
                  <label className="inputLabel" style=
                    {{
                      color: '#344054',
                      position: 'absolute',
                      left: '12px',
                      top: '-9px',
                      whiteSpace: 'nowrap',
                      zIndex: 99
                    }}>
                    Payroll Date
                  </label>

                  <div
                    style={{
                      position: 'relative',
                      top: '7px',
                      backgroundColor: 'white',
                      marginLeft: '6px',

                    }}
                    ref={datePickerRef}
                  >
                    <label
                      className="date-button"
                      onClick={handleToggleDatePicker}
                      style={{ color: '#292929' }}
                    >
                      {selectionRange.startDate.toLocaleDateString() !== selectionRange.endDate.toLocaleDateString()
                        ? `${selectionRange.startDate.toLocaleDateString()} - ${selectionRange.endDate.toLocaleDateString()}`
                        : 'Select Date'}
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
              </div>

            </div>

            <div className="dashboard-payroll">
              <div className="Line-container">
                <div className="line-graph">
                  <div
                    className={`filter-line ${active === 0 ? 'active-filter-line' : ''
                      }`}
                    onClick={() => setActive(0)}
                  >
                    {active === 0 ? (
                      <img src={ICONS.dashActive} alt="" />
                    ) : (
                      <img src={ICONS.dashActive} alt="" />
                    )}
                  </div>
                  <div
                    className={`filter-disable ${active === 1 ? 'active-filter-line' : ''
                      }`}
                    style={{ backgroundColor: '#377CF6' }}
                  >
                    {active === 1 ? (
                      <img src={ICONS.viewActive} alt="" />
                    ) : (
                      <img src={ICONS.viewActive} alt="" />
                    )}
                  </div>
                  <div
                    className="filter-line"
                    onClick={() => setFilterModal(true)}
                    style={{ backgroundColor: '#377CF6' }}
                  >
                    <img src={ICONS.fil_white} alt="" style={{ height: '15px', width: '15px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <DashboardTotal />
            {/* <DonutChart /> */}
          </div>
        </div>

        {filterModal && (
          <FilterModal
            handleClose={filterClose}
            columns={[]}
            page_number={1}
            page_size={10}
            fetchFunction={() => { }}
          />
        )}

        <div className="" style={{ marginTop: '8px' }}>
          {active === 0 && <DashBoardTable />}
          {active === 1 && <DashBoardChart />}
        </div>
      </div>
    </>
  );
};
