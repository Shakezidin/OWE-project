import React, { useEffect, useRef, useState } from 'react';
import { cardData } from './projectData';
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
import { getProjects } from '../../../redux/apiSlice/projectManagement';
import { format, subMonths, subDays } from 'date-fns';
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
import ReactApexChart from 'react-apexcharts';

interface Option {
  value: string;
  label: string;
}

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

  const [resDatePicker, setResDatePicker] = useState({
    startdate: format(subMonths(new Date(), 3), 'dd-MM-yyyy'),
    enddate: format(subDays(new Date(), 1), 'dd-MM-yyyy'),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleSelect = (ranges: any) => {
    setSelectionRange(ranges.selection);
  };

  const handleToggleDatePicker = () => {
    const formattedStartDate = selectionRange.startDate
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .split('/')
      .join('-');

    const formattedEndDate = selectionRange.endDate
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .split('/')
      .join('-');
    setShowDatePicker(!showDatePicker);
    setResDatePicker({
      startdate: formattedStartDate,
      enddate: formattedEndDate,
    });
  };

  const handleResetDates = () => {
    setSelectionRange({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    });
    setResDatePicker({
      startdate: format(subMonths(new Date(), 3), 'dd-MM-yyyy'),
      enddate: format(subDays(new Date(), 1), 'dd-MM-yyyy'),
    });
    setShowDatePicker(!showDatePicker);
  };

  const perPage = 10;
  const getColorStyle = (date: string | null) => {
    if (!date) {
      return { backgroundColor: '#F2F4F6', color: '#7D7D7D' };
    } else if (new Date(date) <= new Date()) {
      return { backgroundColor: '#63ACA3', color: 'white' };
    } else {
      return { backgroundColor: '#008DDA', color: 'white' };
    }
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
        startdate: resDatePicker.startdate,
        enddate: resDatePicker.enddate,
      })
    );
    return () => {
      const expirationTime = localStorage.getItem('expirationTime');
      const currentTime = Date.now();
      if (expirationTime && currentTime < parseInt(expirationTime, 10)) {
        toast.dismiss();
      }
    };
  }, [resDatePicker.startdate, resDatePicker.enddate]);

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

  useEffect(() => {
    dispatch(
      getPerfomanceStatus({
        page,
        perPage,
        startDate: resDatePicker.startdate,
        endDate: resDatePicker.enddate,
        uniqueId: selectedProject?.value || '',
      })
    );
  }, [
    page,
    resDatePicker.startdate,
    resDatePicker.enddate,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated) {
          const data = await postCaller('get_performance_tiledata', {
            start_date: resDatePicker.startdate,
            end_date: resDatePicker.enddate,
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
  }, [isAuthenticated, resDatePicker.startdate, resDatePicker.enddate]);

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
          <h2>Performance</h2>

          <div style={{ zIndex: '1001' }} ref={datePickerRef}>
            <div
              className="per-head-input"
              onClick={(e) => {
                if (datePickerRef?.current?.contains(e.target as Node)) {
                  setShowDatePicker(!showDatePicker);
                }
              }}
            >
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
                        minDate={
                          new Date(
                            new Date().setMonth(new Date().getMonth() - 3)
                          )
                        }
                        maxDate={
                          new Date(new Date().setDate(new Date().getDate() - 1))
                        }
                      />
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex stats-card-wrapper">
          <div className="project-card-container-1">
            {cardData.map((el, i) => {
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
        </div>
      </div>

      <div
        className="project-container"
        style={{ marginTop: '1rem', padding: '0 0 1rem 0' }}
      >
        <div className="performance-table-heading">
          <div className="proper-top">
            <div className="performance-project">
              <h2>Projects</h2>
              <div className="progress-box-container">
                <div className="progress-box-body">
                  <div
                    className="progress-box"
                    style={{ background: '#377CF6' }}
                  ></div>
                  <p>In Progress</p>
                </div>
                <div className="progress-box-body">
                  <div
                    className="progress-box"
                    style={{ background: '#63ACA3' }}
                  ></div>
                  <p>Active</p>
                </div>
                <div className="progress-box-body">
                  <div
                    className="progress-box"
                    style={{ background: '#E9E9E9' }}
                  ></div>
                  <p>Not Started</p>
                </div>
              </div>
            </div>

            <div className="proper-select">
              <SelectOption
                options={projectOption}
                value={selectedProject.value ? selectedProject : undefined}
                onChange={(val) => {
                  if (val) {
                    setSelectedProject({ ...val });
                  }
                }}
                placeholder="Select Project Id"
                menuWidth="300px"
                width="190px"
              />

              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>

          <div className="performance-milestone-table">
            <table>
              <thead>
                <tr>
                  <th style={{ padding: '0px' }}>
                    <div className="milestone-header">
                      <p>Project Id</p>
                      <p>Customer Name</p>
                      <p>Milestone</p>
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
                                <p className="install-update">
                                  {project.unqiue_id}
                                </p>
                              </Link>
                              <div>
                              <p className="project-customer">
                                  {project.customer}
                                </p>
                              </div>
                              <div
                                className="milestone-strips"
                                style={getColorStyle(project.contract_date)}
                              >
                                <div className="strip-title">
                                  <p>
                                    {project.contract_date
                                      ? format(
                                          new Date(project.contract_date),
                                          'dd MMMM'
                                        ).slice(0, 6)
                                      : 'No Data'}
                                  </p>
                                  <p>
                                    {project.contract_date
                                      ? format(
                                          new Date(project.contract_date),
                                          'yyyy'
                                        )
                                      : ''}
                                  </p>
                                </div>
                                <div
                                  className="strip-line"
                                  style={{
                                    borderColor: project.contract_date
                                      ? '#fff'
                                      : '#d6d6d6',
                                  }}
                                ></div>
                                <div className="strip-des">
                                  <p>
                                    Sales{' '}
                                    <IoMdInformationCircleOutline
                                      style={{ cursor: 'pointer' }}
                                    />
                                  </p>
                                </div>
                              </div>
                              <div
                                className="notch-strip"
                                style={getColorStyle(
                                  project.site_survey_complete_date
                                )}
                              >
                                <div className="notch-strip-title">
                                  <p>
                                    {project.site_survey_complete_date
                                      ? format(
                                          new Date(
                                            project.site_survey_complete_date
                                          ),
                                          'dd MMMM'
                                        ).slice(0, 6)
                                      : 'No Data'}
                                  </p>

                                  <p>
                                    {project.site_survey_complete_date
                                      ? format(
                                          new Date(
                                            project.site_survey_complete_date
                                          ),
                                          'yyyy'
                                        )
                                      : ''}
                                  </p>
                                </div>
                                <div
                                  className="strip-line"
                                  style={{
                                    borderColor:
                                      project.site_survey_complete_date
                                        ? '#fff'
                                        : '#d6d6d6',
                                  }}
                                ></div>
                                <div className="notch-strip-des">
                                  <p>Site Survey</p>
                                  <IoMdInformationCircleOutline
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                                <div className="child-notch"></div>
                              </div>

                              <div
                                className="notch-strip"
                                style={getColorStyle(
                                  project.permit_approved_date
                                )}
                              >
                                <div className="notch-strip-title">
                                  <p>
                                    {project.permit_approved_date
                                      ? format(
                                          new Date(
                                            project.permit_approved_date
                                          ),
                                          'dd MMMM'
                                        ).slice(0, 6)
                                      : 'No Data'}
                                  </p>

                                  <p>
                                    {project.permit_approved_date
                                      ? format(
                                          new Date(
                                            project.permit_approved_date
                                          ),
                                          'yyyy'
                                        )
                                      : ''}
                                  </p>
                                </div>
                                <div
                                  className="strip-line"
                                  style={{
                                    borderColor: project.permit_approved_date
                                      ? '#fff'
                                      : '#d6d6d6',
                                  }}
                                ></div>
                                <div className="notch-strip-des">
                                  <p>Permit Submitted </p>
                                  <IoMdInformationCircleOutline
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                                <div className="child-notch"></div>
                              </div>

                              <div
                                className="notch-strip"
                                style={getColorStyle(
                                  project.install_ready_date
                                )}
                              >
                                <div className="notch-strip-title">
                                  <p>
                                    {project.install_ready_date
                                      ? format(
                                          new Date(project.install_ready_date),
                                          'dd MMMM'
                                        ).slice(0, 6)
                                      : 'No Data'}
                                  </p>

                                  <p>
                                    {project.install_ready_date
                                      ? format(
                                          new Date(project.install_ready_date),
                                          'yyyy'
                                        )
                                      : ''}
                                  </p>
                                </div>
                                <div
                                  className="strip-line"
                                  style={{
                                    borderColor: project.install_ready_date
                                      ? '#fff'
                                      : '#d6d6d6',
                                  }}
                                ></div>
                                <div className="notch-strip-des">
                                  <p>Install Ready</p>
                                  <IoMdInformationCircleOutline
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                                <div className="child-notch"></div>
                              </div>

                              <div
                                className="notch-strip"
                                style={getColorStyle(
                                  project.install_completed_date
                                )}
                              >
                                <div className="notch-strip-title">
                                  <p>
                                    {project.install_completed_date
                                      ? format(
                                          new Date(
                                            project.install_completed_date
                                          ),
                                          'dd MMMM'
                                        ).slice(0, 6)
                                      : 'No Data'}
                                  </p>
                                  <p>
                                    {project.install_completed_date
                                      ? format(
                                          new Date(
                                            project.install_completed_date
                                          ),
                                          'yyyy'
                                        ).slice(0, 6)
                                      : ''}
                                  </p>
                                </div>
                                <div
                                  className="strip-line"
                                  style={{
                                    borderColor: project.install_completed_date
                                      ? '#fff'
                                      : '#d6d6d6',
                                  }}
                                ></div>
                                <div className="notch-strip-des">
                                  <p>Install Completed</p>
                                  <IoMdInformationCircleOutline
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                                <div className="child-notch"></div>
                              </div>

                              <div
                                className="notch-strip"
                                style={getColorStyle(project.pto_date)}
                              >
                                <div className="notch-strip-title">
                                  <p>
                                    {project.pto_date
                                      ? format(
                                          new Date(project.pto_date),
                                          'dd MMMM'
                                        ).slice(0, 6)
                                      : 'No Data'}
                                  </p>
                                  <p>
                                    {project.pto_date
                                      ? format(
                                          new Date(project.pto_date),
                                          'yyyy'
                                        ).slice(0, 6)
                                      : ''}
                                  </p>
                                </div>
                                <div
                                  className="strip-line"
                                  style={{
                                    borderColor: project.pto_date
                                      ? '#fff'
                                      : '#d6d6d6',
                                  }}
                                ></div>
                                <div className="notch-strip-des">
                                  <p>PTO</p>
                                  <IoMdInformationCircleOutline
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                                <div className="child-notch"></div>
                              </div>
                              <div className="vertical-wrap">
                                <div className="vertical-line"></div>
                              </div>

                              <div className="all-progress">
                                <div style={{ width: '25px' }}>
                                  <CircularProgressbar
                                    styles={buildStyles({
                                      pathColor: '#63ACA3',
                                    })}
                                    strokeWidth={10}
                                    value={parseInt(
                                      calculateCompletionPercentage(newObj)
                                    )}
                                  />
                                </div>
                                <div>
                                  <p className="progress">
                                    {calculateCompletionPercentage(newObj)}%
                                  </p>
                                  <p>Overall Progress</p>
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
