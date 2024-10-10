import React, { useState, useEffect, useRef, useMemo } from 'react';
import './dasboard.css';
import Select from 'react-select';
import DashboardTotal from './DashboardTotal';
import { ICONS } from '../../../resources/icons/Icons';
import DashBoardTable from './DashBoardTable';
import DashBoardChart from './DashBoardChart';
import { comissionValueData } from '../../../resources/static_data/StaticData';
import FilterModal from '../../components/FilterModal/FilterModal';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from 'react-date-range';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import moment from 'moment';
import { getDealerPay } from '../../../redux/apiActions/dealerPayAction';
import FilterHoc from '../../components/FilterModal/FilterHoc';
import dealerPayColumn from '../../../resources/static_data/configureHeaderData/dealerPayColumn';
import { FilterModel } from '../../../core/models/data_models/FilterSelectModel';
import { useLocation } from 'react-router-dom';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../infrastructure/web_api/api_client/EndPoints';
import { format } from 'date-fns';
import { FaUpload } from 'react-icons/fa';
import DropdownCheckbox from '../../components/DropdownCheckBox';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import '../../oweHub/reppay/reppaydashboard/repdasboard.css';
export const DashboardPage: React.FC = () => {
  const [selectionRange, setSelectionRange] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dispatch = useAppDispatch();

  const handleSelect = (ranges: Date) => {
    setSelectionRange(ranges);
  };

  const handleResetDates = () => {
    setSelectionRange(new Date());
  };

  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(1);
  const [active, setActive] = React.useState<number>(0);
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [filters, setFilters] = useState<FilterModel[]>([]);
  const [dealer, setDealer] = useState<{ label: string; value: string }>({
    label: 'All',
    value: 'ALL',
  });
  const [dealers, setDealers] = useState<string[]>([]);
  const [appliedDate, setAppliedDate] = useState<Date | null>(null);

  const [selectedOption2, setSelectedOption2] = useState<string>(
    comissionValueData[comissionValueData.length - 1].value
  );
  const { isActive } = useAppSelector((state) => state.filterSlice);
  const [prefferedType, setPrefferedType] = useState<string>('');
  const { pathname } = useLocation();
  const [isOptionsFetched, setIsOptionsFetched] = useState(false);
  const handleSelectChange2 = (
    selectedOption2: { value: string; label: string } | null
  ) => {
    setSelectedOption2(selectedOption2 ? selectedOption2.value : '');
    setCurrentPage(1);
  };
  const filterClose = () => {
    setFilterModal(false);
  };
  const handleToggleDatePicker = () => {
    setAppliedDate(selectionRange);
    setShowDatePicker(!showDatePicker);
  };

  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOptionsFetched) {
      dispatch(
        getDealerPay({
          page_number: currentPage,
          page_size: itemsPerPage,
          pay_roll_start_date: moment(appliedDate).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          pay_roll_end_date: moment(appliedDate).format('YYYY-MM-DD HH:mm:ss'),
          use_cutoff: 'NO',
          dealer_name: dealer.value,
          sort_by: 'unique_id',
          commission_model: selectedOption2,
          filters,
          preffered_type: prefferedType,
        })
      );
    }
  }, [
    currentPage,
    selectedOption2,
    appliedDate,
    filters,
    dealer,
    isOptionsFetched,
    prefferedType,
  ]);

  useEffect(() => {
    (async () => {
      const tableData = {
        tableNames: ['dealer'],
      };
      const res = await postCaller(EndPoints.get_newFormData, tableData);
      if (res.status > 201) {
        return;
      }
      setDealers([...res.data.dealer]);
      setDealer({ label: 'All', value: 'ALL' });
      setIsOptionsFetched(true);
    })();
  }, []);

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
  const fetchFunction = (req: any) => {
    setCurrentPage(1);
    setFilters(req.filters);
  };

  return (
    <>
      <div className='dealer-bread' style={{ marginLeft: '6px', marginTop: '6px' }}>
        <Breadcrumb
          head=""
          linkPara="Dealer Pay"
          route={''}
          linkparaSecond=""
          marginLeftMobile="12px"
        />
      </div>
      <div className="Dashboard-section-container">
        <div className="white-back">
          <div className="DashboardPage-container">
            <div className="rep-manage-user">
              <div className="dash-head-input dealer-commission" style={{ minWidth: '185px' }}>
                <div
                  className="rep-drop_label"
                  style={{ backgroundColor: '#57B3F1' }}
                >
                  <img src={ICONS.lable_img} alt="" />
                </div>
                <div className="rep-up relative">
                  <label
                    className="inputLabel"
                    style={{
                      color: '#344054',
                      position: 'absolute',
                      left: '8px',
                      top: '-6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
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
                        marginTop: '18px',
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
                        marginLeft: '-18px',
                      }),
                      option: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '13px',
                        color: state.isSelected ? '#ffffff' : '#0000000',
                        backgroundColor: state.isSelected
                          ? '#377CF6'
                          : '#ffffff',
                        '&:hover': {
                          backgroundColor: state.isSelected
                            ? '#377CF6'
                            : '#DDEBFF',
                        },
                      }),
                      singleValue: (baseStyles, state) => ({
                        ...baseStyles,

                        color: selectedOption2 ? '#292929' : '#8b8484',
                        width: 'fit-content',
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        width: '131px',
                        left: -31,
                      }),
                    }}
                  />
                </div>
              </div>

              <div className="dash-head-input" style={{ minWidth: '145px' }}>
                <div
                  className="rep-drop_label"
                  style={{ backgroundColor: '#57B3F1' }}
                >
                  <img src={ICONS.lable_img} alt="" />
                </div>
                <div className="rep-up relative">
                  <label
                    className="inputLabel"
                    style={{
                      color: '#344054',
                      position: 'absolute',
                      left: '8px',
                      top: '-6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Sales Partner
                  </label>
                  <Select
                    options={[
                      { label: 'All', value: 'ALL' },
                      ...(dealers.length > 0 ? dealers.map((item) => ({
                        label: item,
                        value: item,
                      })) : []),
                    ]}
                    value={dealer}
                    onChange={(newValue) => {
                      if (newValue) {
                        setDealer(newValue);
                        setCurrentPage(1);
                      }
                    }}
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
                        marginTop: '18px',
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
                        marginLeft: '-18px',
                      }),
                      option: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '13px',
                        color: state.isSelected ? '#ffffff' : '#0000000',
                        backgroundColor: state.isSelected
                          ? '#377CF6'
                          : '#ffffff',
                        '&:hover': {
                          backgroundColor: state.isSelected
                            ? '#377CF6'
                            : '#DDEBFF',
                        },
                      }),
                      singleValue: (baseStyles, state) => ({
                        ...baseStyles,

                        color: selectedOption2 ? '#292929' : '#8b8484',
                        width: 'fit-content',
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        width: '140px',
                        left: -31,
                        zIndex: 50,
                      }),
                      menuList: (base) => ({
                        ...base,
                        '&::-webkit-scrollbar': {
                          scrollbarWidth: 'thin',
                          display: 'block',
                          scrollbarColor: 'rgb(173, 173, 173) #fff',
                          width: 8,
                          height: 50,
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: 'rgb(173, 173, 173)',
                          borderRadius: '30px',
                        },
                      }),
                    }}
                  />

                  {/* <DropdownCheckbox
                    options={dealers?.map?.((item) => ({ label: item, value: item })) || []}
                    selectedOptions={dealer}
                    onChange={(selectedOptions) => {
                      setDealer(selectedOptions)
                      setCurrentPage(1);
                    }}
                  /> */}
                </div>
              </div>

              <div className="dash-head-input dealer-payroll">
                <div
                  className="rep-drop_label"
                  style={{ backgroundColor: '#C470C7' }}
                >
                  <img src={ICONS.includes_icon} alt="" />
                </div>
                <div className="rep-up relative">
                  <label
                    className="inputLabel"
                    style={{
                      color: '#344054',
                      position: 'absolute',
                      left: '12px',
                      top: '-9px',
                      whiteSpace: 'nowrap',
                      zIndex: 99,
                    }}
                  >
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
                      {appliedDate
                        ? format(appliedDate, 'dd-MM-yyyy')
                        : 'Select Date'}
                    </label>
                    {showDatePicker && (
                      <div className="calender-container dealer-calendar">
                        <Calendar
                          date={selectionRange || new Date()}
                          onChange={handleSelect}
                        />
                        <div className="calender-btn-wrapper">
                          <button
                            className="reset-calender"
                            onClick={handleResetDates}
                          >
                            Reset
                          </button>
                          <button
                            className="apply-calender"
                            onClick={handleToggleDatePicker}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-payroll">
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
                  className="filter-line relative"
                  onClick={() => setFilterModal(true)}
                  style={{ backgroundColor: '#377CF6' }}
                >
                  {isActive[pathname] && (
                    <span
                      className="absolute"
                      style={{
                        border: '1px solid #fff',
                        borderRadius: '50%',
                        backgroundColor: '#2DC74F',
                        width: 8,
                        height: 8,
                        top: 0,
                        right: -2,
                      }}
                    ></span>
                  )}
                  <img
                    src={ICONS.fil_white}
                    alt=""
                    style={{ height: '15px', width: '15px' }}
                  />
                </div>
                <button
                  className={`performance-exportbtn  mt0 `}
                  style={{ height: '36px', padding: '8px 12px' }}
                >
                  <FaUpload size={12} className="mr-1 dealer-exp-svg" />
                  <span className='dealer-export-mob'>{' Export '}</span>
                </button>
              </div>
            </div>
          </div>
          <div className="">
            <DashboardTotal setPrefferedType={setPrefferedType} />
            {/* <DonutChart /> */}
          </div>
        </div>

        <FilterHoc
          isOpen={filterModal}
          handleClose={filterClose}
          resetOnChange={false}
          columns={dealerPayColumn.filter((col) => col.name !== 'help')}
          page_number={currentPage}
          page_size={10}
          fetchFunction={fetchFunction}
        />

        <div className="dealer-pay-table">
          {active === 0 && (
            <DashBoardTable
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
          {active === 1 && <DashBoardChart />}
        </div>
      </div>
    </>
  );
};
