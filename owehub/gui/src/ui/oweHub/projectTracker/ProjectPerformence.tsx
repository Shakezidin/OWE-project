import React, { useEffect, useRef, useState } from 'react';
// import { cardData } from './projectData';
// import { ICONS } from '../../../resources/icons/Icons';
import './projectTracker.css';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
// import { DateRangePicker } from 'react-date-range';
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
// import ReactApexChart from 'react-apexcharts';
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import Input from '../../components/text_input/Input';
import { IoIosSearch } from 'react-icons/io';

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
  console.log(projectStatus, datacount, 'projectStatus');
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
                                    <p>
                                      {project.site_survey_completed_date
                                        ? `${format(new Date(project.site_survey_completed_date), 'dd MMMM').slice(0, 6)} ${format(new Date(project.site_survey_completed_date), 'yyyy')}`
                                        : project.site_survey_scheduled_date
                                          ? `${format(new Date(project.site_survey_scheduled_date), 'dd MMMM').slice(0, 6)} ${format(new Date(project.site_survey_scheduled_date), 'yyyy')}`
                                          : 'No Data'}
                                    </p>
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
                                    <p>
                                      {project.cad_complete_date
                                        ? `${format(
                                            new Date(project.cad_complete_date),
                                            'dd MMMM'
                                          ).slice(0, 6)} ${format(
                                            new Date(project.cad_complete_date),
                                            'yyyy'
                                          )}`
                                        : project.cad_ready
                                          ? `${format(
                                              new Date(project.cad_ready),
                                              'dd MMMM'
                                            ).slice(0, 6)} ${format(
                                              new Date(project.cad_ready),
                                              'yyyy'
                                            )}`
                                          : 'No Data'}
                                    </p>
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
                                    <p>
                                      {project.permit_approved_date
                                        ? `${format(
                                            new Date(
                                              project.permit_approved_date
                                            ),
                                            'dd MMMM'
                                          ).slice(
                                            0,
                                            6
                                          )} ${format(new Date(project.permit_approved_date), 'yyyy')}`
                                        : project.permit_submitted_date
                                          ? `${format(new Date(project.permit_submitted_date), 'dd MMMM').slice(0, 6)} ${format(new Date(project.permit_submitted_date), 'yyyy')}`
                                          : 'No Data'}
                                    </p>
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
                                      <p>
                                        {project.roofing_completed_date
                                          ? `${format(new Date(project.roofing_completed_date), 'dd MMMM').slice(0, 6)} ${format(new Date(project.roofing_completed_date), 'yyyy')}`
                                          : project.roofing_created_date
                                            ? `${format(
                                                new Date(
                                                  project.roofing_created_date
                                                ),
                                                'dd MMMM'
                                              ).slice(0, 6)} ${format(
                                                new Date(
                                                  project.roofing_created_date
                                                ),
                                                'yyyy'
                                              )}`
                                            : 'No Data'}
                                      </p>
                                    </div>
                                  </div>
                                ) : null}

                                <div
                                  className="notch-strip"
                                  style={getColorStyle(project.install_colour)}
                                >
                                  <p className="strips-data">install</p>
                                  <div className="notch-title">
                                    <p>
                                      {project.pv_install_completed_date
                                        ? `${format(new Date(project.pv_install_completed_date), 'dd MMMM').slice(0, 6)} ${format(new Date(project.pv_install_completed_date), 'yyyy')}`
                                        : project.pv_install_created_date
                                          ? `${format(
                                              new Date(
                                                project.pv_install_created_date
                                              ),
                                              'dd MMMM'
                                            ).slice(0, 6)} ${format(
                                              new Date(
                                                project.pv_install_created_date
                                              ),
                                              'yyyy'
                                            )}`
                                          : 'No Data'}
                                    </p>
                                  </div>
                                </div>

                                <div
                                  className="notch-strip"
                                  style={getColorStyle(
                                    project.electrical_colour
                                  )}
                                >
                                  <p className="strips-data">electrical</p>
                                  <div className="notch-title"></div>
                                </div>
                                <div
                                  className="notch-strip"
                                  style={getColorStyle(
                                    project.inspectionsColour
                                  )}
                                >
                                  <p className="strips-data">inspection</p>
                                  <div className="notch-title">
                                  <p>
                                      {project.fin_pass_date
                                        ? `${format(new Date(project.fin_pass_date), 'dd MMMM').slice(0, 6)} ${format(new Date(project.fin_pass_date), 'yyyy')}`
                                        : project.fin_created_date
                                        
                                          ? `${format(
                                              new Date(
                                                project.fin_created_date
                                                
                                              ),
                                              'dd MMMM'
                                            ).slice(0, 6)} ${format(
                                              new Date(
                                                project.fin_created_date
                                                
                                              ),
                                              'yyyy'
                                            )}`
                                          : 'No Data'}
                                    </p>
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
                                    <p>
                                      {project.pto_date
                                        ? `${format(
                                            new Date(project.pto_date),
                                            'dd MMMM'
                                          ).slice(0, 6)} ${format(
                                            new Date(project.pto_date),
                                            'yyyy'
                                          )}`
                                        : project.pto_submitted_date
                                          ? `${format(
                                              new Date(
                                                project.pto_submitted_date
                                              ),
                                              'dd MMMM'
                                            ).slice(0, 6)} ${format(
                                              new Date(
                                                project.pto_submitted_date
                                              ),
                                              'yyyy'
                                            )}`
                                          : 'No Data'}
                                    </p>
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
