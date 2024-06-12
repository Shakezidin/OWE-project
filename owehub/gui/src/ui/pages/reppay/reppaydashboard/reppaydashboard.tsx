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
        <div className='rep-white-back'>
          <div className="rep-Dashboard-container">
            <div className="rep-manage-user">


            <div className="rep-dash-head-input" >
                <div className='rep-drop_label' style={{ backgroundColor: "#8E81E0" }}>
                  <img  src={ICONS.vector} alt="" />
                </div>
                <div className='rep-up'>
                  <label className="rep-inputLabel" style={{ color: '#344054', marginLeft: "-29px" }}>
                    Includes
                  </label>
                  <div className='drop-d'> <DropdownWithCheckboxes /></div>
                </div>
              </div>

              <div className="rep-dash-head-input" style={{ minWidth: '185px' }}>
                <div className='rep-drop_label' style={{ backgroundColor: "#57B3F1" }}>
                  <img src={ICONS.lable_img} alt="" />
                </div>
                <div className='rep-up relative'>
                  <label className="rep-inputLabel" style=
                    {{
                      color: '#344054', position: 'absolute', left: '8px',
                      top: '-10px',
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
                        // width: '4rem',
                        width: 'fit-content',
                        minHeight: 'unset',
                        height: '8px',
                        alignContent: 'center',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        marginRight: '32px',
                        // marginBottom: '0px',
                        boxShadow: 'none',
                        marginTop: '15px'

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
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        width: '131px',
                        left: -31
                      }),
                      input: (baseStyles) => ({
                        ...baseStyles,
                        '&:focus': {
                          border: 'none',
                          outline: 'none'
                        }
                      })
                    }}
                  />
                </div>
               
              </div>


              <div className="rep-dash-head-input" style={{width: "210px" }}>



                <div className='rep-drop_label' style={{ backgroundColor: "#C470C7" }}>
                  <img src={ICONS.includes_icon} alt="" />
                </div>
                <div className='rep-up relative'>
                  <label className="rep-inputLabel" style=
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
                      <div className="rep-calender-container">
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

            <div className="rep-dashboard-payroll">
              <div className="Line-container">
                <div className="rep-line-graph">
                  <div
                    className={`rep-filter-line ${active === 0 ? 'rep-active-filter-line' : ''
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
                    className={`filter-disable ${active === 1 ? 'rep-active-filter-line' : ''
                      }`}
                    // onClick={() => setActive(1)}
                    style={{ backgroundColor: '#377CF6' }}
                  >
                    {active === 1 ? (
                      <img src={ICONS.viewActive} alt="" />
                    ) : (
                      <img src={ICONS.viewActive} alt="" />
                    )}
                  </div>
                  <div
                    className="rep-filter-line"
                    style={{ backgroundColor: '#377CF6' }}
                    onClick={() => setFilterModal(true)}
                  >
                    <img src={ICONS.fil_white} alt="" style={{ height: '15px', width: '15px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <RepPayDashboardTotal />
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
        <div className="" style={{ marginTop: '20px' }}>
          {active === 0 && <RepDashBoardTable />}
          {active === 1 && <RepDashBoardChart />}
        </div>
      </div >
    </>
  );
};
