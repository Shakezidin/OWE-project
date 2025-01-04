import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { RiArrowRightLine } from 'react-icons/ri';
import ReportFormModal from './AddNewModal';
import { reportingCaller } from '../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import DynDashboard from './DynamicReports/DynDashboard';
import MicroLoader from '../components/loader/MicroLoader';
import DataNotFound from '../components/loader/DataNotFound';

interface AccordionSection {
  title: string;
  data: { title: string; route: string; heading?: string }[];
  state: [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined;
}

interface ReportData {
  id: number;
  title: string;
  subtitle: string;
  dashboard_id: string;
}

interface ApiData {
  [key: string]: ReportData[];
}


const Dashboard: React.FC = () => {
  const cardColors = ['#FAD9CA', '#CDE8FB', '#EDD4EE', '#D0E6E3', '#DDD9F6'];
  const arrowColors = ['#EE824D', '#57B3F1', '#C470C7', '#63ACA3', '#8E81E0'];

  const hoverSwithClass = (color: string) => {
    switch (color) {
      case '#FAD9CA':
        return 'bg-salmon';
      case '#CDE8FB':
        return 'bg-light-blue';
      case '#EDD4EE':
        return 'bg-purple';

      case '#D0E6E3':
        return 'bg-light-green';

      case '#DDD9F6':
        return 'bg-dark-blue';

      default:
        return '';
    }
  };


  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ApiData | null>(null);
  const [dashboardIds, setDashboardIds] = useState<string[]>([]);

 
  useEffect(() => {

    setLoading(true)
    const fetchData = async () => {
      try {
        const response = await reportingCaller('get_superset_reports', {});
        if (response.status === 200) {
          setData(response.data)
          const allDashboardIds = Object.values(response.data).flatMap((items: any) =>
            items.map((item: any) => item.dashboard_id)
          );
          const uniqueDashboardIds = Array.from(new Set(allDashboardIds));
          setDashboardIds(uniqueDashboardIds);
        } else {
          console.error('Error fetching data:', response.message);
          toast.error(response.message)
          setLoading(false);
        }
      } catch (error) {
        console.error('Error making API request:', error);
        setLoading(false);
      }
      setLoading(false);
    };
    fetchData();

  }, []);
  const [accordionStates, setAccordionStates] = useState<boolean[]>([]);

 const accordionSectionsTest = data
  ? Object.entries(data).map(([arrayName, arrayData], index) => ({
      title: arrayName,
      data: arrayData.map((item, index) => ({
        subtitle: item.subtitle || '',
        id:item.id,
        title: item.title || `Item ${index + 1}`,
        route: `${ROUTES.DYNAMIC_REPORT.replace(':id', item.dashboard_id)}`,
      })),
      state: [accordionStates[index] ?? true, () => {}],
    }))
  : [];

// Update accordion states when data changes
useEffect(() => {
  if (data) {
    setAccordionStates(Object.keys(data).map(() => true));
  }
}, [data]);


  const accordionSections: AccordionSection[] = [
    {
      title: 'Sales NTP Install',
      data: [{ title: 'Sales NTP Install', route: ROUTES.TOTAL_COUNT }],
      state: useState<boolean>(true),
    },
    {
      title: 'Summary',
      data: [
        { title: 'Production', route: ROUTES.REPORTING_PRODUCTION },
        { title: 'Quality', route: ROUTES.REPORTING_QUALITY },
        {
          heading: 'Speed',
          title: 'Overall',
          route: ROUTES.REPORTING_SPEED_OVERALL,
        },
        {
          heading: 'Speed',
          title: 'Sales to Install',
          route: ROUTES.REPORTING_SALES_TO_INSTALL,
        },
        {
          heading: 'First time completions',
          title: 'Quality per Office',
          route: ROUTES.FIRST_TIME_COMPLETIONS,
        },
        {
          heading: 'First time completions',
          title: 'Reason for Incompletion',
          route: ROUTES.REPORTING_REASON_FOR_INCOMPLETE,
        },
      ],
      state: useState<boolean>(true),
    },
    // {
    //   title: 'PV Install',
    //   data: [
    //     {
    //       heading: 'Install Completions',
    //       title: 'Completions per office',
    //       route: ROUTES.COMPLETIONS_PER_OFFICE,
    //     },
    //     {
    //       heading: 'Install Completions',
    //       title: 'Completions per Team',
    //       route: ROUTES.COMPLETIONS_PER_TEAM,
    //     },
    //     {
    //       heading: 'Install Completions',
    //       title: 'No PTO Granted Date',
    //       route: ROUTES.NO_PTO,
    //     },
    //     { title: 'Timelines', route: ROUTES.TIMELINES },
    //     { title: '1st Time Completions', route: ROUTES.SITE_FIRST_COMPLETION },
    //   ],
    //   state: useState<boolean>(true),
    // },
    // {
    //   title: 'Site Survey',
    //   data: [
    //     { title: 'All Completions', route: ROUTES.SITE_COMPLETION },
    //     { title: 'Timelines', route: ROUTES.SITE_TIMELINES },
    //     { title: '1st Time Completions', route: ROUTES.SITE_FIRST_COMPLETION },
    //     { title: 'Outside SLA', route: ROUTES.SITE_OUTSIDE_SLA },
    //   ],
    //   state: useState<boolean>(true),
    // },
    {
      title: 'CFA Timeline',
      data: [
        { title: 'Install to FIN', route: ROUTES.INSTALL_TO_FIN },
        { title: 'AJH + 15 Days SLA', route: ROUTES.AHJ },
        { title: 'Permit Redline %', route: ROUTES.PERMIT_REDLINE },
      ],
      state: useState<boolean>(true),
    },
  ];
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState('');
  const [isOpenMod, setIsOpenMod] = useState(false)

  const handleClose = () => {
    setIsOpenMod(false)
  }
  const handleOpen = () => {
    setIsOpenMod(true)
  }




  const toggleAccordion = (index: number) => () => {
    setAccordionStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  console.log(accordionSectionsTest, "gfadsh")
  

  return (
    <>

      <ReportFormModal isOpen={isOpenMod} handleClose={handleClose} />
      <div className="configure-container">

        <div className="configure-main">
          <div className='add-delete-report'>
            {checkedItems.length === 0 &&
              <button onClick={handleOpen} style={{ backgroundColor: "rgb(62, 62, 208)" }}>Add New</button>
            }
            {checkedItems.length !== 0 &&
              <button style={{ backgroundColor: "rgb(225, 44, 44)" }}>Delete</button>
            }
          </div>
          <div className="configure-main-section">
          {(loading) ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MicroLoader />
            </div>
          ) : accordionSectionsTest ? (
            <>
            {accordionSectionsTest.map(({ title, data, state }, index) => {
              if (!state) return null;
              const [isOpen, setIsOpen] = state;
              return (
                <div
                  key={index}
                  className={`${title.toLowerCase()} ${isOpen ? 'open' : ''}`}
                >
                  <div
                    className="configure-card-title"
                    onClick={toggleAccordion(index)}
                  >
                    <p className="payer-type">{title}</p>
                    <div className="accordion-icon-container">
                      {isOpen ? (
                        <FaMinus className="accordion-icon" />
                      ) : (
                        <FaPlus className="accordion-icon" />
                      )}
                    </div>
                  </div>

                  <div className={`configure-cards ${isOpen ? 'open' : ''}`}>
                    {data.map((item, index) => {
                      const colorIndex =
                        index % Math.min(cardColors.length, arrowColors.length);
                      const randomCardColor = cardColors[colorIndex];
                      const randomArrowColor = arrowColors[colorIndex];
                      return (

                        <div key={index} className="pay-card-wrapper">
                          <Link
                            to={item.route}
                            className={`pay-card ${hoverSwithClass(randomCardColor)}`}
                            style={{
                              backgroundColor: randomCardColor,
                              outline: `1px dotted ${randomArrowColor}`,
                              outlineOffset: '3px',
                              position: "relative"
                            }}
                            onMouseEnter={() => {
                              setIsHovered(true);
                              setHoveredItem(item.title);
                            }}
                            onMouseLeave={() => {
                              setIsHovered(false);
                              setHoveredItem('');
                            }}
                          >

                            <div className="con-fle">
                              {item.subtitle ? (
                                <small>({item.subtitle})</small>
                              ) : null}
                              <h1 className="reporting-card-heading">
                                {item.title}
                              </h1>
                              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "36px" }}>
                                <div
                                  className="checkbox-wrapper"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    const title = item.title;
                                    if (checkedItems.includes(title)) {
                                      setCheckedItems(checkedItems.filter((item) => item !== title));
                                    } else {
                                      setCheckedItems([...checkedItems, title]);
                                    }
                                  }}
                                  style={{
                                    display: checkedItems.includes(item.title) || (isHovered && hoveredItem === item.title) ? 'block' : 'none'
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={checkedItems.includes(item.title)}
                                    readOnly
                                  />
                                </div>
                                <div
                                  className="arrow-wrapper"
                                  style={{ color: randomArrowColor }}
                                >
                                  <span className="view-text">View</span>
                                  <RiArrowRightLine className="arrow-right" />
                                </div>
                              </div>

                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
             </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <DataNotFound />
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
