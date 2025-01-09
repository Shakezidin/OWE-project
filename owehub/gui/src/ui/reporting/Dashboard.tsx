import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { RiArrowRightLine } from 'react-icons/ri';
import ReportFormModal from './AddNewModal';
import { reportingCaller } from '../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import MicroLoader from '../components/loader/MicroLoader';
import DataNotFound from '../components/loader/DataNotFound';
import { ActionButton } from '../components/button/ActionButton';
import { AddNewButton } from '../components/button/AddNewButton';
import { SlPencil } from "react-icons/sl";
import { Tooltip } from 'react-tooltip';

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
  const [count, setCount] = useState(1);


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

  }, [count]);
  const [accordionStates, setAccordionStates] = useState<boolean[]>([]);

  const accordionSectionsTest = data
    ? Object.entries(data).map(([arrayName, arrayData], index) => ({
      title: arrayName,
      data: arrayData.map((item, index) => ({
        subtitle: item.subtitle || '',
        id: item.id,
        dashboard_id: item.dashboard_id,
        title: item.title || `Item ${index + 1}`,
        route: `${ROUTES.DYNAMIC_REPORT.replace(':id', item.dashboard_id)}`,
      })),
      state: [accordionStates[index] ?? true, () => { }],
    }))
    : [];


  useEffect(() => {
    if (data) {
      setAccordionStates(Object.keys(data).map(() => true));
    }
  }, [data]);




  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
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

  const [deleteRec, setDeleteRec] = useState(false);

  const handleSubmit = async (e: any) => {
    setDeleteRec(true)
    try {
      const response = await reportingCaller(
        'delete_superset_reports',
        {
          "report_ids": checkedItems
        },
      );
      if (response.status === 200) {
        toast.success(response.message);
        setCheckedItems([])
        setCount(count + 1);
        setDeleteRec(false)
      } else if (response.status >= 201) {
        toast.warn(response.message);
        setDeleteRec(false)
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setDeleteRec(false)
  };

  const [editId, setEditId] = useState(0);
  const [editCat, setEditCat] = useState("")
  const [editTitle, setEditTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [editDashId, setDashEditId] = useState("");

  return (
    <>


      <ReportFormModal title={editTitle} subTitle={subTitle} dashId={editDashId} id={editId} isOpen={isOpenMod} handleClose={handleClose} count={count} setCount={setCount} />
      <div className="configure-container">

        <div className="configure-main">
          <div className='add-delete-report'>
            <p>Total Reports: {dashboardIds ? dashboardIds.length : "0"}</p>
            <div>
              {checkedItems.length === 0 &&
                <AddNewButton
                  title={'Add New Report'}
                  onClick={() => {
                    handleOpen();
                    setEditId(0);
                  }}
                />
              }
              {checkedItems.length !== 0 && (
                <button
                  className='delete-report'
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: "rgb(225, 44, 44)",
                    cursor: deleteRec ? "not-allowed" : "pointer",
                    pointerEvents: deleteRec ? "none" : "auto",
                    opacity: deleteRec ? 0.6 : 1,
                  }}
                  disabled={deleteRec}
                >
                  {checkedItems.length === 1 ? "Delete Report" : "Delete Report's"}
                </button>
              )}
            </div>
          </div>
          <div className="configure-main-section">
            {(loading) ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <MicroLoader />
              </div>
            ) : accordionSectionsTest.length > 0 ? (
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
                                  position: "relative",
                                }}
                                onMouseEnter={() => {
                                  setIsHovered(true);
                                  setHoveredItem(item.id);
                                }}
                                onMouseLeave={() => {
                                  setIsHovered(false);
                                  setHoveredItem(null);
                                }}
                              >

                                <div className="con-fle">
                                  {item.subtitle ? (
                                    <small>
                                      {item.subtitle.length > 20 ? `${item.subtitle.slice(0, 15)}...` : item.subtitle}
                                    </small>
                                  ) : null}
                                  <h1 className="reporting-card-heading" data-tooltip-id={item.title.length > 15 ? item.title : ""}>
                                    {item.title.length > 15 ? `${item.title.slice(0, 15)}...` : item.title}
                                  </h1>
                                  <Tooltip
                                    style={{
                                      zIndex: 999,
                                      background: "#000",
                                      color: '#f7f7f7',
                                      fontSize: 12,
                                      paddingBlock: 4,
                                    }}
                                    delayShow={400}
                                    offset={8}
                                    id={item.title}
                                    place="bottom"
                                    content={item.title}
                                    
                                    
                                  />

                                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "6px" }}>
                                    <div
                                      className="checkbox-wrapper"
                                      onClick={(event) => {
                                        event.stopPropagation();

                                        const id = item.id;
                                        if (checkedItems.includes(id)) {
                                          setCheckedItems(checkedItems.filter((item) => item !== id));
                                        } else {
                                          setCheckedItems([...checkedItems, id]);
                                        }
                                      }}
                                      style={{
                                        display: checkedItems.includes(item.id) || (isHovered && hoveredItem === item.id) ? 'block' : 'none'
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checkedItems.includes(item.id)}
                                        readOnly
                                      />
                                    </div>

                                    <div
                                      onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        setEditId(item.id);
                                        setEditTitle(item.title)
                                        setDashEditId(item.dashboard_id)
                                        setSubTitle(item.subtitle);
                                        handleOpen();
                                      }}
                                      style={{
                                        display: checkedItems.includes(item.id) || (isHovered && hoveredItem === item.id) ? 'block' : 'none',
                                        width: "15px",
                                        // backgroundColor:"black"
                                      }}
                                      data-tooltip-id={"edit"}
                                    >
                                      <SlPencil color="white" className="report-edit-icon" />
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
