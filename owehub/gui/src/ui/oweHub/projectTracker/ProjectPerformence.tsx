import React, { useEffect, useRef, useState } from 'react';
// import { cardData } from './projectData';
import { ICONS } from '../../../resources/icons/Icons';
import './projectTracker.css';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  getPerfomance,
  getPerfomanceStatus,
} from '../../../redux/apiSlice/perfomanceSlice';
import { Calendar } from './ICONS';
import Select from 'react-select';
import { getProjects } from '../../../redux/apiSlice/projectManagement';
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  subMonths,
} from 'date-fns';
import { DateRange } from 'react-date-range';
import Pagination from '../../components/pagination/Pagination';
import MicroLoader from '../../components/loader/MicroLoader';
import DataNotFound from '../../components/loader/DataNotFound';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import useMatchMedia from '../../../hooks/useMatchMedia';
import SelectOption from '../../components/selectOption/SelectOption';
// import ReactApexChart from 'react-apexcharts';
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import Input from '../../components/text_input/Input';
import { IoIosSearch } from 'react-icons/io';
import { TYPE_OF_USER } from '../../../resources/static_data/Constant';
interface Option {
  value: string;
  label: string;
}

export type DateRangeWithLabel = {
  label?: string;
  start: Date;
  end: Date;
};
const ProjectPerformence = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const refBtn = useRef<null | HTMLDivElement>(null);
  const [activePopups, setActivePopups] = useState<boolean>(false);
  const { projects } = useAppSelector((state) => state.projectManagement);

  const [selectedProject, setSelectedProject] = useState<{
    label: string;
    value: string;
  }>({} as Option);

  const handleCancel = () => {
    setSelectedProject({} as Option);
  };
  const role = localStorage.getItem('role');
  // PERIOD FILTER
  //
  const today = new Date();
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // assuming week starts on Monday, change to 0 if it starts on Sunday
  const startOfThisMonth = startOfMonth(today);
  const startOfThisYear = startOfYear(today);
  const startOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  );
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  // Calculate the start and end of last week
  const startOfLastWeek = startOfWeek(subDays(startOfThisWeek, 1), {
    weekStartsOn: 1,
  });
  const endOfLastWeek = endOfWeek(subDays(startOfThisWeek, 1), {
    weekStartsOn: 1,
  });

  const handleClickOutside = (e: MouseEvent) => {
    const elm = e.target as HTMLElement;
    if (
      refBtn?.current &&
      (elm === refBtn?.current || refBtn?.current?.contains(elm))
    ) {
      return;
    }
    if (!elm.closest('.popup')) {
      setActivePopups(false);
    }
  };

  const [selectionRange, setSelectionRange] = useState({
    startDate: subMonths(new Date(), 3),
    endDate: subDays(new Date(), 1),
    key: 'selection',
  });



  const [tileData, setTileData] = useState<any>({});

  // const [resDatePicker, setResDatePicker] = useState({
  //   startdate: format(subMonths(new Date(), 3), 'dd-MM-yyyy'),
  //   enddate: format(subDays(new Date(), 1), 'dd-MM-yyyy'),
  // });

  const [selectedRangeDate, setSelectedRangeDate] = useState<any>({
    label: 'Three Months',
    start: role == TYPE_OF_USER.ADMIN ? subMonths(new Date(), 3) : '',
    end: role == TYPE_OF_USER.ADMIN ? subMonths(new Date(), 1) : '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleSelect = (ranges: any) => {
    setSelectionRange(ranges.selection);
  };

  // const handleToggleDatePicker = () => {
  //   const formattedStartDate = selectionRange.startDate
  //     .toLocaleDateString('en-GB', {
  //       day: '2-digit',
  //       month: '2-digit',
  //       year: 'numeric',
  //     })
  //     .split('/')
  //     .join('-');

  //   const formattedEndDate = selectionRange.endDate
  //     .toLocaleDateString('en-GB', {
  //       day: '2-digit',
  //       month: '2-digit',
  //       year: 'numeric',
  //     })
  //     .split('/')
  //     .join('-');
  //   setShowDatePicker(!showDatePicker);
  //   setResDa({
  //     startdate: formattedStartDate,
  //     enddate: formattedEndDate,
  //   });
  // };

  // const handleResetDates = () => {
  //   setSelectionRange({
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     key: 'selection',
  //   });
  //   setResDatePicker({
  //     startdate: format(subMonths(new Date(), 3), 'dd-MM-yyyy'),
  //     enddate: format(subDays(new Date(), 1), 'dd-MM-yyyy'),
  //   });
  //   setShowDatePicker(!showDatePicker);
  // };

  const perPage = 10;
  const getColorStyle = (color: any | null) => {
    let backgroundColor;
    let textColor;
    let boxShadowColor;

    backgroundColor = color;
    textColor = 'white';
    boxShadowColor = 'rgba(0, 141, 218, 0.3)';

    return {
      backgroundColor,
      color: textColor,
      boxShadow: `0px 4px 12px ${boxShadowColor}`,
    };
  };

  const projectOption: Option[] = projects?.map?.(
    (item: (typeof projects)[0]) => ({
      label: `${item.unqiue_id}-${item.customer}`,
      value: item.unqiue_id,
    })
  );

  const {
    perfomaceSale,
    commisionMetrics,
    projectStatus,
    projectsCount,
    datacount,
    isLoading,
  } = useAppSelector((state) => state.perfomanceSlice);
  const { sessionTimeout } = useAppSelector((state) => state.auth);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    dispatch(getProjects());

    return () => toast.dismiss();
  }, []);

  useEffect(() => {
    const current = format(new Date(), 'yyyy-MM-dd');
    dispatch(
      getPerfomance({
        startdate: format(selectedRangeDate.start,'dd-MM-yyyy'),
        enddate: format(selectedRangeDate.end, 'dd-MM-yyyy')
      })
    );
    return () => {
      const expirationTime = localStorage.getItem('expirationTime');
      const currentTime = Date.now();
      if (expirationTime && currentTime < parseInt(expirationTime, 10)) {
        toast.dismiss();
      }
    };
  }, [selectedRangeDate.start, selectedRangeDate.end]);

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

  //

  const periodFilterOptions: any = [
    {
      label: 'Three Months',
      start: subMonths(new Date(), 3),
      end: subDays(new Date(), 1),
    },
    {
      label: 'This Week',
      start: startOfThisWeek,
      end: today,
    },
    {
      label: 'Last Week',
      start: startOfLastWeek,
      end: endOfLastWeek,
    },
    {
      label: 'This Month',
      start: startOfThisMonth,
      end: today,
    },
    {
      label: 'Last Month',
      start: startOfLastMonth,
      end: endOfLastMonth,
    },
    {
      label: 'This Year',
      start: startOfThisYear,
      end: today,
    },
  ];
 

  useEffect(() => {
    dispatch(
      getPerfomanceStatus({
        page,
        perPage,
        startDate: selectedRangeDate.start ? format(selectedRangeDate.start, 'dd-MM-yyyy') : '',
        endDate: selectedRangeDate.end ? format(selectedRangeDate.end, 'dd-MM-yyyy') : '',
        uniqueId: selectedProject?.value || '',
      })
    );
  }, [
    page,
    selectedRangeDate.start,
    selectedRangeDate.end,
    selectedProject.value,
  ]);

  const calculateCompletionPercentage = (
    project: (typeof projectStatus)[0]
  ) => {
    const totalSteps = Object.keys(project).length;
    const completedSteps = Object.values(project).filter(
      (date) => !!date
    ).length;
    const completionPercentage = (completedSteps / totalSteps) * 100;
    return completionPercentage.toFixed(2);
  };

  const formatFloat = (number: number | undefined) => {
    if (
      typeof number === 'number' &&
      !isNaN(number) &&
      Number.isFinite(number) &&
      Number.isInteger(number) === false
    ) {
      return number.toFixed(2);
    } else {
      return number;
    }
  };
  const startIndex = (page - 1) * perPage + 1;
  const endIndex = page * perPage;

  const projectDashData = [
    {
      ruppes: tileData?.all_sales,
      para: 'All Sales',
      percentColor: '#8E81E0',
      key: 'SalesPeriod',
      percent: 80,
    },
    {
      ruppes: tileData?.total_cancellation,
      para: 'Total Cancellation',
      iconBgColor: '#FFE6E6',
      percentColor: '#C470C7',
      key: 'cancellation_period',
      percent: 30,
    },
    {
      ruppes: tileData?.total_installation,
      para: 'Total Installation',
      percentColor: '#63ACA3',
      key: 'installation_period',
      percent: 50,
    },
  ];

  const topCardsData = [
    { id: 1, title: 'Site Survey', value: datacount.site_survey_count },
    { id: 2, title: 'CAD Design', value: datacount.cad_design_count },
    { id: 3, title: 'Permitting', value: datacount.permitting_count },
    { id: 4, title: 'Roofing', value: datacount.roofing_count },
    { id: 5, title: 'Install', value: datacount.isntall_count },
    { id: 6, title: 'Electrical', value: datacount.electrical_count },
    { id: 7, title: 'Inspection', value: datacount.inspection_count },
    { id: 8, title: 'Activation', value: datacount.activation_count },
  ];

  const cardColors = ['#57B3F1', '#EE824D', '#63ACA3', '#6761DA', '#C470C7'];
  const resetPage = () => {
    setPage(1);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated) {
          const data = await postCaller('get_performance_tiledata', {
            start_date: selectedRangeDate.start,
            end_date: selectedRangeDate.end,
          });

          if (data?.data) {
            setTileData(data?.data);
          }

          if (data.status > 201) {
            toast.error(data.message);
            return;
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [isAuthenticated, selectedRangeDate.start, selectedRangeDate.end]);

  const isMobile = useMatchMedia('(max-width: 767px)');

  const getSeries = (item: any) => [item.percent];
  const getOptions = (item: any) => ({
    chart: {
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '60%',
        },
        track: {
          background: '#F2F4F6',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
            offsetY: 0,
          },
        },
      },
    },
    fill: {
      colors: [item.percentColor],
    },
    stroke: {
      lineCap: 'round',
      width: 10,
    },
  });

  const DateFilter = ({
    selected,
    setSelected,
    resetPage,
  }: {
    selected: DateRangeWithLabel;
    setSelected: (newVal: DateRangeWithLabel) => void;
    resetPage: () => void;
  }) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedRanges, setSelectedRanges] = useState(
      selected
        ? [
            {
              startDate: selected.start,
              endDate: selected.end,
              key: 'selection',
            },
          ]
        : []
    );

    const onApply = () => {
      const range = selectedRanges[0];
      if (!range) return;
      setSelected({
        start: range.startDate,
        end: range.endDate,
        label: 'Custom',
      });
      setShowCalendar(false);
      resetPage();
    };

    const onReset = () => {
      const defaultOption = periodFilterOptions[0];
      setSelected(periodFilterOptions[0]);
      setSelectedRanges([
        {
          startDate: defaultOption.start,
          endDate: defaultOption.end,
          key: 'selection',
        },
      ]);
      setShowCalendar(false);
      resetPage();
    };

    // update datepicker if "selected" updated externally
    useEffect(() => {
      setSelectedRanges([
        {
          startDate: selected.start,
          endDate: selected.end,
          key: 'selection',
        },
      ]);
    }, [selected]);

    // close on click outside anywhere
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        console.log(event);
        const remain = window.innerWidth - event.clientX;
        if (
          wrapperRef.current &&
          !event.composedPath().includes(wrapperRef.current) &&
          remain > 15
        )
          setShowCalendar(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="flex items-center justify-end">
        <div className="leaderborder_filter-slect-wrapper mr1">
          <Select
            options={periodFilterOptions}
            value={selected}
            // placeholder={selected?"Custom"}
            isSearchable={false}
            onChange={(value) => value && setSelected(value)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                fontSize: '11px',
                fontWeight: '500',
                borderRadius: '4px',
                outline: 'none',
                width: 'fit-content',
                minWidth: '92px',
                height: '28px',
                alignContent: 'center',
                cursor: 'pointer',
                boxShadow: 'none',
                border: '1px solid #377CF6',
                minHeight: 30,
              }),
              valueContainer: (provided, state) => ({
                ...provided,
                height: '30px',
                padding: '0 6px',
              }),
              placeholder: (baseStyles) => ({
                ...baseStyles,
                color: '#377CF6',
              }),
              indicatorSeparator: () => ({
                display: 'none',
              }),
              dropdownIndicator: (baseStyles, state) => ({
                ...baseStyles,
                svg: {
                  fill: '#377CF6',
                },
                marginLeft: '-18px',
              }),

              option: (baseStyles, state) => ({
                ...baseStyles,
                fontSize: '12px',
                color: '#fff',
                transition: 'all 500ms',
                '&:hover': {
                  transform: 'scale(1.1)',
                  background: 'none',
                  transition: 'all 500ms',
                },
                background: '#377CF6',
                transform: state.isSelected ? 'scale(1.1)' : 'scale(1)',
              }),

              singleValue: (baseStyles, state) => ({
                ...baseStyles,
                color: '#377CF6',
                fontSize: 11,
                padding: '0 8px',
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                width: '92px',
                zIndex: 999,
                color: '#FFFFFF',
              }),
              menuList: (base) => ({
                ...base,
                background: '#377CF6',
              }),
              input: (base) => ({ ...base, margin: 0 }),
            }}
          />
        </div>
        <div ref={wrapperRef} className="leaderboard-data__datepicker-wrapper">
          <span
            role="button"
            onClick={() => setShowCalendar((prev) => !prev)}
            style={{ lineHeight: 0 }}
          >
            <Calendar />
          </span>
          {showCalendar && (
            <div className="leaderboard-data__datepicker-content">
              <DateRange
                editableDateInputs={true}
                onChange={(item) => {
                  const startDate = item.selection?.startDate;
                  const endDate = item.selection?.endDate;
                  if (startDate && endDate) {
                    setSelectedRanges([
                      { startDate, endDate, key: 'selection' },
                    ]);
                  }
                }}
                moveRangeOnFirstSelection={false}
                ranges={selectedRanges}
              />
              <div className="leaderboard-data__datepicker-btns">
                <button className="reset-calender" onClick={onReset}>
                  Reset
                </button>
                <button className="apply-calender" onClick={onApply}>
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const PeriodFilter = ({
    period,
    setPeriod,
    resetPage,
  }: {
    period: DateRangeWithLabel | null;
    setPeriod: (newVal: DateRangeWithLabel) => void;
    resetPage: () => void;
  }) => {
    return (
      <ul className="leaderboard-data__btn-group">
        {periodFilterOptions.map((item: any) => (
          <li key={item.label}>
            <button
              onClick={() => {
                setPeriod(item);
                resetPage();
              }}
              className={
                'leaderboard-data__btn' +
                (period?.label === item.label
                  ? ' leaderboard-data__btn--active performance-btn'
                  : ' inactive-btn')
              }
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    );
  };

  console.log(projectStatus, datacount, 'projectStatus');
  console.log(selectedRangeDate, 'select');
  return (
    <div className="">
      <Breadcrumb
        head=""
        linkPara="Performance"
        route={''}
        linkparaSecond="Dashboard"
        marginLeftMobile="12px"
      />
      <div className="project-container">
        <div className="project-heading">
          <h2>Total Count</h2>

          {/* <div style={{zIndex: "1001"}} ref={datePickerRef} >
          <div className="per-head-input"   onClick={(e) => {
            if (datePickerRef?.current?.contains(e.target as Node)) {
              setShowDatePicker(!showDatePicker);
            }
          }}>
            <div className="rep-drop_label" style={{ backgroundColor: '#C470C7' }}>
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
                Date Range
              </label>
              <div
                style={{
                  position: 'relative',
                  top: '7px',
                  backgroundColor: 'white',
                  marginLeft: '6px',
                }}
                
              >
                <label
                  className="per-date-button"
                  style={{ color: '#292929' }}
                >
                  {selectionRange.startDate.toLocaleDateString() !==
                    selectionRange.endDate.toLocaleDateString()
                    ? `${selectionRange.startDate.toLocaleDateString()} - ${selectionRange.endDate.toLocaleDateString()}`
                    : 'Select Date'}
                </label>
                {showDatePicker && (
                  <div
                    className="per-calender-container"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DateRangePicker
                      ranges={[selectionRange]}
                      onChange={handleSelect}
                      minDate={new Date(new Date().setMonth(new Date().getMonth() - 3))}
                      maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                    />
                    <button className="reset-calender" onClick={handleResetDates}>
                      Reset
                    </button>
                    <button className="apply-calender" onClick={handleToggleDatePicker}>
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div> */}
          <div className="flex items-center justify-end">
            <PeriodFilter
              resetPage={resetPage}
              period={selectedRangeDate}
              setPeriod={setSelectedRangeDate}
            />
            <DateFilter
              selected={selectedRangeDate}
              resetPage={resetPage}
              setSelected={setSelectedRangeDate}
            />
          </div>
        </div>
        {/* <div className="flex stats-card-wrapper">
          <div className="project-card-container-1">
            {topCardsData.map((el, i) => {
              const findSale = perfomaceSale.find(
                (s: (typeof perfomaceSale)[0]) => s.type === el.type
              );
              return (
                <div
                  className="project-card"
                  key={i}
                  style={{ backgroundColor: el.bgColor }}
                >
                  <div className="project-card-head">
                    <div className="project-icon-img">
                      <object
                        type="image/svg+xml"
                        data={el.icon}
                        aria-label="performance-icons"
                        width={24}
                      ></object>
                    </div>
                    <div style={{ lineHeight: '20px' }}>
                      <p style={{ color: el.color, fontSize: '12px' }}>
                        {el.name}
                      </p>
                      <p style={{ color: '#fff', fontSize: '16px' }}>
                        {' '}
                        {formatFloat(findSale?.sales)}{' '}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      style={{
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: '300',
                        marginTop: '10px',
                        textAlign: 'start',
                      }}
                      className="per-sales"
                    >
                      {' '}
                      Sales KW - {formatFloat(findSale?.sales_kw)}{' '}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {/*<div className="project-card-container-2 flex-auto">
            {projectDashData.map((item, i) => (
              <div className="project-ruppes-card" key={i}>
                <div
                  className="performance-bars"
                  style={{
                    // height: isMobile ? '160px' : '130px',
                  }}
                >
                  <div id="chart">
                    <ReactApexChart
                      //@ts-ignore
                      options={getOptions(item)}
                      series={getSeries(item)}
                      type="radialBar"
                    />
                  </div>
                  <div
                      className="cards-description"
                    >
                      <p
                        style={{
                          fontSize: isMobile ? '16px' : '12px',
                          color: '#646464',
                          fontWeight: '300',
                        }}
                      >
                        {item.para}
                      </p>
                      <p
                        style={{
                          fontSize: isMobile ? '18px' : '16px',
                          color: '#0C0B18',
                        }}
                      >
                        {item.ruppes}
                      </p>
                    </div>
                </div>
              </div>
            ))}
          </div>}*/}
        {/* </div> */}

        <div className="flex stats-card-wrapper">
          <div className="project-card-container-1">
            {topCardsData.map((card, index) => {
              const cardColor = cardColors[index % cardColors.length];
              return (
                <div
                  className="flex items-center arrow-wrap"
                  style={{ marginRight: '-20px' }}
                >
                  <div
                    key={card.id}
                    className="project-card"
                    style={{
                      backgroundColor: cardColor,
                      outline: `1px dotted ${cardColor}`,
                    }}
                  >
                    <span
                      className="stages-numbers"
                      style={{ color: cardColor, borderColor: cardColor }}
                    >
                      {card.id}
                    </span>
                    <p>{card.title || "N/A"}</p>
                    <h2>{card.value || "N/A"}</h2>
                  </div>
                  {index < topCardsData.length - 1 && (
                    <div className="flex arrow-dir" style={{ padding: '0 5px' }}>
                      <MdOutlineKeyboardDoubleArrowRight
                        style={{
                          width: '1.5rem',
                          height: '1.5rem',
                          color: cardColor,
                        }}
                      />
                      <MdOutlineKeyboardDoubleArrowRight
                        style={{
                          marginLeft: '-10px',
                          height: '1.5rem',
                          width: '1.5rem',
                          color: cardColors[(index + 1) % cardColors.length],
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="project-container"
        style={{ marginTop: '1rem', padding: '0 0 1rem 0' }}
      >
        <div className="performance-table-heading">
          <div className="proper-top">
            <div className="performance-project">
              <div className="proper-select">
                <SelectOption
                  options={projectOption}
                  value={selectedProject.value ? selectedProject : undefined}
                  onChange={(val) => {
                    if (val) {
                      setSelectedProject({ ...val });
                    }
                  }}
                  placeholder="Search Project Id or Name"
                  lazyRender
                  width="190px"
                  controlStyles={{ marginTop: 0 }}
                />

                {/* <IoIosSearch className="search-icon" /> */}

                {/* <Input
                  type={'text'}
                  placeholder={'Search for Unique ID or Name'}
                  value={'Search for Unique ID or Name'}
                  name={'Search for Unique ID or Name'}
                  onChange={() => {}}
                /> */}
              </div>
              <div className="performance-box-container">
                <p className="status-indicator">Status indicators</p>
                <div className="progress-box-body">
                  <div
                    className="progress-box"
                    style={{ background: '#377CF6', borderRadius: '2px' }}
                  ></div>
                  <p>Scheduled</p>
                </div>
                <div className="progress-box-body">
                  <div
                    className="progress-box"
                    style={{ background: '#63ACA3', borderRadius: '2px' }}
                  ></div>
                  <p>Completed</p>
                </div>
                <div className="progress-box-body">
                  <div
                    className="progress-box"
                    style={{ background: '#E9E9E9', borderRadius: '2px' }}
                  ></div>
                  <p>Not Started</p>
                </div>
              </div>
            </div>
          </div>

          <div className="performance-milestone-table">
            <table>
              <thead>
                <tr>
                  <th style={{ padding: '0px' }}>
                    <div className="milestone-header">
                      <div className="project-info">
                        <p>Project Info</p>
                      </div>
                      <div className="header-milestone">
                        <p>Milestones</p>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      colSpan={6}
                    >
                      <MicroLoader />
                    </td>
                  </tr>
                ) : projectStatus.length < 1 && !isLoading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center' }}>
                      <div
                        className=""
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <DataNotFound />
                      </div>
                    </td>
                  </tr>
                ) : (
                  projectStatus.map(
                    (project: (typeof projectStatus)[0], index: number) => {
                      const newObj: any = { ...project };
                      delete newObj?.['unqiue_id'];
                      return (
                        <tr key={index}>
                          <td style={{ padding: '0px' }}>
                            <div className="milestone-data">
                              <Link
                                to={`/project-management?project_id=${project.unqiue_id}`}
                              >
                                <div className="project-info-details">
                                  <h3>{project.customer}</h3>
                                  <p className="install-update">
                                    {project.unqiue_id}
                                  </p>
                                </div>
                              </Link>

                              <div className="strips-wrapper">
                                <div
                                  className="milestone-strips"
                                  style={getColorStyle(
                                    project.site_survey_colour
                                  )}
                                >
                                  <p className="strips-data">site survey</p>
                                  <div className="strip-title">
                                    {project.site_survey_date ? (
                                      <p>{project?.site_survey_date}</p>
                                    ) : (
                                      <p className='text-dark'>{'No Data'}</p>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className="notch-strip"
                                  style={getColorStyle(
                                    project.cad_design_colour
                                  )}
                                >
                                  <p className="strips-data">cad design</p>
                                  <div className="notch-title">
                                    {project.cad_design_date ? (
                                      <p>{project?.cad_design_date}</p>
                                    ) : (
                                      <p className='text-dark'>{'No Data'}</p>
                                    )}
                                  </div>
                                </div>

                                <div
                                  className="notch-strip"
                                  style={getColorStyle(
                                    project.permitting_colour
                                  )}
                                >
                                  <p className="strips-data">permitting</p>
                                  <div className="notch-title">
                                    {project.permitting_date ? (
                                      <p>{project?.permitting_date}</p>
                                    ) : (
                                      <p className='text-dark'>{'No Data'}</p>
                                    )}
                                  </div>
                                </div>

                                {project.roofing_colour ? (
                                  <div
                                    className="notch-strip"
                                    style={getColorStyle(
                                      project.roofing_colour
                                    )}
                                  >
                                    <p className="strips-data">roofing</p>
                                    <div className="notch-title">
                                      {project.roofing_date ? (
                                        <p>{project?.roofing_date}</p>
                                      ) : (
                                        <p className='text-dark'>{'No Data'}</p>
                                      )}
                                    </div>
                                  </div>
                                ) : null}

                                <div
                                  className="notch-strip"
                                  style={getColorStyle(project.install_colour)}
                                >
                                  <p className="strips-data">install</p>
                                  <div className="notch-title">
                                    {project.install_date ? (
                                      <p>{project?.install_date}</p>
                                    ) : (
                                      <p className='text-dark'>{'No Data'}</p>
                                    )}
                                  </div>
                                </div>

                                <div
                                  className="notch-strip"
                                  style={getColorStyle(
                                    project.electrical_colour
                                  )}
                                >
                                  <p className="strips-data">electrical</p>
                                  <div className="notch-title">
                                    {project.electrical_date ? (
                                      <p>{project?.electrical_date}</p>
                                    ) : (
                                      <p className='text-dark'>{'No Data'}</p>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className="notch-strip"
                                  style={getColorStyle(
                                    project.inspectionsColour
                                  )}
                                >
                                  <p className="strips-data">inspection</p>
                                  <div className="notch-title">
                                    {project.inspection_date ? (
                                      <p>{project?.inspection_date}</p>
                                    ) : (
                                      <p className='text-dark'>{'No Data'}</p>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className="notch-strip"
                                  style={getColorStyle(
                                    project.activation_colour
                                  )}
                                >
                                  <p className="strips-data">activation</p>
                                  <div className="notch-title">
                                    {project.activation_date ? (
                                      <p>{project?.activation_date}</p>
                                    ) : (
                                      <p className='text-dark'>{'No Data'}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="page-heading-container">
            {!!projectsCount && (
              <p className="page-heading">
                {startIndex} -{' '}
                {endIndex > projectsCount ? projectsCount : endIndex} of{' '}
                {projectsCount} item
              </p>
            )}

            {projectStatus?.length > 0 ? (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(projectsCount / perPage)}
                paginate={(num) => setPage(num)}
                currentPageData={projectStatus}
                goToNextPage={() => setPage((prev) => prev + 1)}
                goToPrevPage={() =>
                  setPage((prev) => (prev < 1 ? prev - 1 : prev))
                }
                perPage={perPage}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPerformence;

{
  /* <CircularProgressbarWithChildren
                    className="my-custom-progressbar"
                    circleRatio={0.5}
                    value={item.percent}
                    strokeWidth={10}
                    styles={buildStyles({
                      pathColor: item.percentColor,
                      textSize: '10px',
                      textColor: '#0C0B18',
                      rotation: 0.75,
                      trailColor: '#F2F4F6',
                    })}
                  >
                  </CircularProgressbarWithChildren> */
}
{
  /* <div
                      className="flex flex-column items-center flex-center gap-20"
                      style={{
                        gap: '4px',
                        ...(isMobile && { marginTop: '-30px' }),
                      }}
                    >
                      <p
                        style={{
                          fontSize: isMobile ? '16px' : '12px',
                          color: '#646464',
                          fontWeight: '300',
                        }}
                      >
                        {item.para}
                      </p>
                      <p
                        style={{
                          fontSize: isMobile ? '18px' : '16px',
                          color: '#0C0B18',
                        }}
                      >
                        {item.ruppes}
                      </p>
                    </div> */
}
