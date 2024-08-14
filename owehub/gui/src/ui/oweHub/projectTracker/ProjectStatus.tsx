import React, { useEffect, useRef, useState } from 'react';
import './projectTracker.css';
import { projectStatusHeadData } from './projectData';
import SelectOption from '../../components/selectOption/SelectOption';
import { FaCheck } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  getProjectDetail,
  getProjects,
} from '../../../redux/apiSlice/projectManagement';
import { format } from 'date-fns';
import MicroLoader from '../../components/loader/MicroLoader';
import DataNotFound from '../../components/loader/DataNotFound';
import useMatchMedia from '../../../hooks/useMatchMedia';
import { toast } from 'react-toastify';
import Proj_pie_chart from './lib/proj_pie_chart';
import { ICONS } from '../../../resources/icons/Icons';

interface ActivePopups {
  [key: number]: number | null;
}
interface Option {
  value: string;
  label: string;
}
const data = [
  {
    name: 'Page A',
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    pv: 3908,
    amt: 2000,
  },
];

const ProjectStatus = () => {
  const { projects, projectDetail, isLoading } = useAppSelector(
    (state) => state.projectManagement
  );
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get('project_id');

  const getStatus = (arr: string[]) => {
    return arr.every(
      (item) => projectDetail[item as keyof typeof projectDetail]
    );
  };
  const filtered = [
    // {
    //   name: 'Sales',
    //   number: <FaCheck />,
    //   color: 'white',
    //   numColor: '#0493CE',
    //   bgColor: '#4191C9',
    //   childStatusData: [
    //     {
    //       name: '10 Apr',
    //       process: 'Completed',
    //       bgColor: projectDetail.sales_completed ? '#63ACA3' : '#EBEBEB',
    //       color: projectDetail.sales_completed ? 'white' : '#858585',
    //       borderColor: projectDetail.sales_completed ? 'white' : '#A5AAB2',
    //       key: 'sales_completed',
    //     },
    //   ],
    // },
    
     
    {
      name: 'NTP',
      number: '1',
      color: 'white',
      numColor: '#0493CE',
      bgColor: '#4191C9',
      childStatusData: [
        {
          name: '10 Apr',
          process: 'Sale Date',
          data: projectDetail.sales_completed ? '' : 'Data not available',
          borderColor: projectDetail.sales_completed ? 'white' : '#A5AAB2',
          key: 'sales_completed',
          bgColor: projectDetail.sales_completed ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.sales_completed ? 'white' : '#858585',
          
        },
        {
          name: '10 Apr',
          process: 'Completed',
          data: projectDetail.ntp_completed ? '' : 'Data not available',
          borderColor: projectDetail.ntp_completed ? 'white' : '#A5AAB2',
          key: 'ntp_completed',
          bgColor: projectDetail.ntp_completed ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.ntp_completed ? 'white' : '#858585',
        },
      ],
    },
    {
      name: 'Site Survey',
      number: '2',
      bgColor: '#4191C9',
      color: 'white',
      numColor: '#0493CE',
      childStatusData: [
        {
          name: '10 Apr',
          process: 'Scheduled',

          data: projectDetail.site_survey_scheduled ? '' : 'Data not available',
          borderColor: projectDetail.site_survey_scheduled
            ? 'white'
            : '#A5AAB2',
          key: 'site_survey_scheduled',
          bgColor: projectDetail.site_survey_scheduled ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.site_survey_scheduled ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Re-Scheduled',
          data: projectDetail.site_survey_rescheduled
            ? ''
            : 'Data not available',
          borderColor: projectDetail.site_survey_rescheduled
            ? 'white'
            : '#A5AAB2',
          key: 'site_survey_rescheduled',
          bgColor: projectDetail.site_survey_rescheduled
            ? '#63ACA3'
            : '#EBEBEB',
          color: projectDetail.site_survey_rescheduled ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Completed',
          data: projectDetail.site_survey_completed ? '' : 'Data not available',
          borderColor: projectDetail.site_survey_completed
            ? 'white'
            : '#A5AAB2',
          key: 'site_survey_completed',
          bgColor: projectDetail.site_survey_completed ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.site_survey_completed ? 'white' : '#858585',
        },
      ],
    },
    {
      name: 'Roofing',
      number: '3',
      color: 'white',
      numColor: '#0493CE',
      bgColor: '#4191C9',
      childStatusData: [
        {
          name: '10 Apr',
          process: 'Pending',
          data: projectDetail.roofing_pending ? '' : 'Data not available',
          borderColor: projectDetail.roofing_pending ? 'white' : '#A5AAB2',
          key: 'roofing_pending',
          bgColor: projectDetail.roofing_pending ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.roofing_pending ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Scheduled',
          data: projectDetail.roofing_scheduled ? '' : 'Data not available',
          borderColor: projectDetail.roofing_scheduled ? 'white' : '#A5AAB2',
          key: 'roofing_scheduled',
          bgColor: projectDetail.roofing_scheduled ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.roofing_scheduled ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Completed',
          data: projectDetail.roofing_completed ? '' : 'Data not available',
          borderColor: projectDetail.roofing_completed ? 'white' : '#A5AAB2',
          key: 'roofing_scheduled',
          bgColor: projectDetail.roofing_completed ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.roofing_completed ? 'white' : '#858585',
        },
      ],
    },
    {
      name: 'Electrical',
      number: '4',
      color: 'white',
      numColor: '#0493CE',
      bgColor: '#4191C9',
      childStatusData: [
        {
          name: '10 Apr',
          process: 'Pending',
          data: projectDetail.electrical_pending ? '' : 'Data not available',
          borderColor: projectDetail.electrical_pending ? 'white' : '#A5AAB2',
          key: 'electrical_pending',
          bgColor: projectDetail.electrical_pending ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.electrical_pending ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Scheduled',
          data: projectDetail.electrical_scheduled ? '' : 'Data not available',
          borderColor: projectDetail.electrical_scheduled ? 'white' : '#A5AAB2',
          key: 'electrical_scheduled',
          bgColor: projectDetail.electrical_scheduled ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.electrical_scheduled ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Completed',
          data: projectDetail.electrical_completed ? '' : 'Data not available',
          borderColor: projectDetail.electrical_completed ? 'white' : '#A5AAB2',
          key: 'electrical_completed',
          bgColor: projectDetail.electrical_completed ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.electrical_completed ? 'white' : '#858585',
        },
      ],
    },
    {
      name: 'PV Permit ',
      number: '5',
      bgColor: '#4191C9',
      color: 'white',
      numColor: '#0493CE',
      childStatusData: [
        {
          name: '10 Apr',
          process: 'Pending',
          data: projectDetail.pv_permit_pending ? '' : 'Data not available',
          borderColor: projectDetail.pv_permit_pending ? 'white' : '#A5AAB2',
          key: 'pv_permit_pending',
          bgColor: projectDetail.pv_permit_pending ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.pv_permit_pending ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Submitted',
          data: projectDetail.pv_permit_scehduled ? '' : 'Data not available',
          borderColor: projectDetail.pv_permit_scehduled ? 'white' : '#A5AAB2',
          key: 'pv_permit_scehduled',
          bgColor: projectDetail.pv_permit_scehduled ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.pv_permit_scehduled ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Approved',
          data: projectDetail.pv_permit_completed ? '' : 'Data not available',
          borderColor: projectDetail.pv_permit_completed ? 'white' : '#A5AAB2',
          key: 'pv_permit_completed',
          bgColor: projectDetail.pv_permit_completed ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.pv_permit_completed ? 'white' : '#858585',
        },
      ],
    },
    {
      name: 'IC Permit Submitted',
      number: '6',
      color: 'white',
      numColor: '#0493CE',
      bgColor: '#4191C9',
      childStatusData: [
        {
          name: '10 Apr',
          process: 'Pending',
          data: projectDetail.ic_permit_pending ? '' : 'Data not available',
          borderColor: projectDetail.ic_permit_pending ? 'white' : '#A5AAB2',
          key: 'ic_permit_pending',
          bgColor: projectDetail.ic_permit_pending ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.ic_permit_pending ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Submitted',
          data: projectDetail.ic_permit_scheduled ? '' : 'Data not available',
          borderColor: projectDetail.ic_permit_scheduled ? 'white' : '#A5AAB2',
          key: 'ic_permit_scheduled',
          bgColor: projectDetail.ic_permit_scheduled ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.ic_permit_scheduled ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Approved',
          data: projectDetail.ic_permit_completed ? '' : 'Data not available',
          borderColor: projectDetail.ic_permit_completed ? 'white' : '#A5AAB2',
          key: 'ic_permit_completed',
          bgColor: projectDetail.ic_permit_completed ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.ic_permit_completed ? 'white' : '#858585',
        },
      ],
    },
    {
      name: 'Install',
      bgColor: '#4191C9',
      number: '7',
      color: 'white',
      numColor: '#0493CE',
      childStatusData: [
        {
          name: '10 Apr',
          process: 'Pending',
          data: projectDetail.install_pending ? '' : 'Data not available',
          borderColor: projectDetail.install_pending ? 'white' : '#A5AAB2',
          key: 'install_pending',
          bgColor: projectDetail.install_pending ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.install_pending ? 'white' : '#858585',
        },

        {
          name: '10 Apr',
          process: 'Ready',
          data: projectDetail.install_ready ? '' : 'Data not available',
          borderColor: projectDetail.install_ready ? 'white' : '#A5AAB2',
          key: 'install_ready',
          bgColor: projectDetail.install_ready ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.install_ready ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Scheduled',
          data: projectDetail.install_scheduled ? '' : 'Data not available',
          borderColor: projectDetail.install_scheduled ? 'white' : '#A5AAB2',
          key: 'install_scheduled',
          bgColor: projectDetail.install_scheduled ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.install_scheduled ? 'white' : '#858585',
        },

        {
          name: '10 Apr',
          process: 'Completed',
          data: projectDetail.install_completed ? '' : 'Data not available',
          borderColor: projectDetail.install_completed ? 'white' : '#A5AAB2',
          key: 'install_completed',
          bgColor: projectDetail.install_completed ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.install_completed ? 'white' : '#858585',
        },
      ],
    },
    {
      name: 'Final Inspection',
      number: '8',
      color: 'white',
      numColor: '#0493CE',
      bgColor: '#4191C9',
      childStatusData: [
        {
          name: '10 Apr',
          process: 'Scheduled',
          data: projectDetail.final_inspection_submitted
            ? ''
            : 'Data not available',
          borderColor: projectDetail.final_inspection_submitted
            ? 'white'
            : '#A5AAB2',
          key: 'final_inspection_submitted',
          bgColor: projectDetail.final_inspection_submitted
            ? '#63ACA3'
            : '#EBEBEB',
          color: projectDetail.final_inspection_submitted ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Approved',
          data: projectDetail.final_inspection_approved
            ? ''
            : 'Data not available',
          borderColor: '#A5AAB2',
          key: 'final_inspection_approved',
          bgColor: projectDetail.final_inspection_approved
            ? '#63ACA3'
            : '#EBEBEB',
          color: projectDetail.final_inspection_approved ? 'white' : '#858585',
        },
      ],
    },
    {
      name: 'PTO',
      number: '9',
      color: 'white',
      numColor: '#0493CE',
      bgColor: '#4191C9',
      childStatusData: [
        {
          name: '10 Apr',
          process: 'In Process',
          data: projectDetail.pto_in_process ? '' : 'Data not available',
          borderColor: projectDetail.pto_in_process ? 'white' : '#A5AAB2',
          key: 'pto_in_process',
          bgColor: projectDetail.pto_in_process ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.pto_in_process ? 'white' : '#858585',
        },
        {
          name: '10 Apr',
          process: 'Submitted',
          data: projectDetail.pto_submitted ? '' : 'Data not available',
          borderColor: projectDetail.pto_submitted ? 'white' : '#A5AAB2',
          key: 'pto_submitted',
          bgColor: projectDetail.pto_submitted ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.pto_submitted ? 'white' : '#858585',
        },

        {
          name: '10 Apr',
          process: 'Approved',
          data: projectDetail.pto_completed ? '' : 'Data not available',
          borderColor: projectDetail.pto_completed ? 'white' : '#A5AAB2',
          key: 'pto_completed',
          bgColor: projectDetail.pto_completed ? '#63ACA3' : '#EBEBEB',
          color: projectDetail.pto_completed ? 'white' : '#858585',
        },
      ],
    },
  ];


  const filteredStatusData = filtered.filter(status => {
    if (status.name === 'Roofing') {
      return (
        projectDetail.roofing_pending ||
        projectDetail.roofing_scheduled ||
        projectDetail.roofing_completed
      );
    }
    if (status.name === 'Electrical') {
      return (
        projectDetail.electrical_pending ||
        projectDetail.electrical_scheduled ||
        projectDetail.electrical_completed
      );
    }
    return true; // Keep all other status objects
  });

  console.log(filteredStatusData, "Check");

  const [activePopups, setActivePopups] = useState<boolean>(false);
  const refBtn = useRef<null | HTMLDivElement>(null);
  const isTablet = useMatchMedia('(max-width:1024px)');
  const [selectedProject, setSelectedProject] = useState<{
    label: string;
    value: string;
  }>({} as Option);
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    if (activePopups) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePopups]);

  useEffect(() => {
    dispatch(getProjects());

    return () => toast.dismiss();
  }, []);
  const projectOption: Option[] = projects?.map?.(
    (item: (typeof projects)[0]) => ({
      label: `${item.unqiue_id}-${item.customer}`,
      value: item.unqiue_id,
    })
  );

  useEffect(() => {
    if (activePopups) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePopups]);

  useEffect(() => {
    if (projectId) {
      const opt = { label: projectId, value: projectId };
      setSelectedProject(opt);
    } else if (projectOption.length) {
      const val = {
        label: projectOption[0].label || '',
        value: projectOption[0].value || '',
      };
      console.log('val', val);
      setSelectedProject(val);
      dispatch(getProjectDetail(projectOption[0]?.value));
    }
  }, [projectOption.length, projectId, dispatch]);

  useEffect(() => {
    if (selectedProject.value) {
      dispatch(getProjectDetail(selectedProject.value));
    }
  }, [selectedProject.value]);

  return (
    <div className="">
      <div style={{ padding: '0px' }}>
        <div className="flex mt1 top-project-cards">
          <div
            className="px1 project-card-wrapper  bg-white rounded-16"
            style={{ paddingInline: 16, paddingBottom: 16 }}
          >
            <div className="project-heading project-status-heading mb3">
              <h3 style={{ marginTop: '1rem' }}>Project Status</h3>
              <div className="pro-status-dropdown" style={{ minWidth: 200 }}>
                <div className="">
                  <SelectOption
                    options={projectOption}
                    value={selectedProject}
                    onChange={(val) => {
                      if (val) {
                        setSelectedProject(val);
                      }
                    }}
                    width="190px"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center flex-wrap mxn1">
              {projectStatusHeadData.map((el, i) => (
                <div
                  key={i}
                  className={` ${isTablet ? 'col-6' : ' lg-col-3'} px1`}
                  style={{ marginBottom: 10 }}
                >
                  <div
                    className="rounded-8"
                    style={{
                      padding: 3,
                      border: `1px dashed ${el.bgColor}`,
                      zIndex: i === 1 ? 50 : undefined,
                    }}
                  >
                    <div
                      className=" flex items-center rounded-8 justify-center relative"
                      style={{
                        background: el.bgColor,
                        height: 83,
                        zIndex: i === 1 ? 50 : undefined,
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          color: '#fff',
                        }}
                      >
                        <p className="para-head text-white-color">{el.name}</p>
                        <span className="span-para">
                          {projectDetail[
                            el.key as keyof typeof projectDetail
                          ] || 'N/A'}
                        </span>
                      </div>
                      {el.viewButton ? (
                        <div
                          className="view-flex"
                          ref={refBtn}
                          onClick={() => setActivePopups((prev) => !prev)}
                        >
                          <p>View</p>
                          <img src={ICONS.arrowDown} alt="" />
                        </div>
                      ) : null}
                      {activePopups && i === 1 && (
                        <div className="popup">
                          <p className="pop-head">Adder Details</p>
                          <ol className="order-list">
                            {
                              // @ts-ignore
                              projectDetail.adder_breakdown_and_total &&
                                Object.keys(
                                  projectDetail.adder_breakdown_and_total
                                ).map((item, ind) => {
                                  // @ts-ignore
                                  return (
                                    <li key={ind} className="order-list-name">
                                      {' '}
                                      {item} :{' '}
                                      {
                                        projectDetail.adder_breakdown_and_total[
                                          item
                                        ]
                                      }{' '}
                                    </li>
                                  );
                                })
                            }
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pl2 flex-auto second-project-card">
            <div
              className="bg-white rounded-16 flex items-center justify-center"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                alignItems: 'center',
              }}
            >
              <Proj_pie_chart />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-16 project-table-wrapper">
          <div
            className="project-heading project-status-heading mt2"
            style={{ padding: '22px' }}
          >
            <div className=" flex items-center project-status-table-title ">
              <h3>Project Stages</h3>
              <div className="progress-box-container ml3">
                <div className="progress-box-body mt0">
                  <div
                    className="progress-box"
                    style={{
                      background: '#4191C9',
                      borderRadius: 0,
                      width: 14,
                      height: 14,
                    }}
                  ></div>
                  <p>Stages</p>
                </div>
                <div className="progress-box-body mt0">
                  <div
                    className="progress-box"
                    style={{
                      background: '#63ACA3',
                      borderRadius: 0,
                      width: 14,
                      height: 14,
                    }}
                  ></div>
                  <p>Completed</p>
                </div>
                <div className="progress-box-body mt0">
                  <div
                    className="progress-box"
                    style={{
                      background: '#E9E9E9',
                      borderRadius: 0,
                      width: 14,
                      height: 14,
                    }}
                  ></div>
                  <p>Not Started yet</p>
                </div>
              </div>
            </div>
          </div>
          <div className="project-management-table ">
            <table>
              <tbody>
                <tr style={{ borderBottom: 'none' }}>
                  <td style={{ padding: '0px' }}>
                    <div className="project-staus-progress-container">
                      {isLoading ? (
                        <div
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <MicroLoader />
                        </div>
                      ) : !isLoading &&
                        Object.keys(projectDetail).length < 1 ? (
                        <td colSpan={7} style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            <DataNotFound />
                          </div>
                        </td>
                      ) : (
                        filteredStatusData.map((item: any, i: any) => (
                          <>
                            <div className="project-status-table">
                              <div
                                className="project-status-card"
                                style={{
                                  marginTop: '0',
                                  background: item.bgColor,
                                }}
                              >
                                <div
                                  className="status-number"
                                  style={{
                                    background: '#FFFFF',
                                    color: item.numColor,
                                  }}
                                >
                                  {getStatus(
                                    item.childStatusData.map(
                                      (item: any) => item.key
                                    )
                                  ) ? (
                                    <FaCheck />
                                  ) : (
                                    i + 1
                                  )}
                                </div>
                                <p
                                  className="stage-1-para"
                                  style={{ color: item.color }}
                                >
                                  {item.name}
                                </p>
                              </div>
                              {item.childStatusData.map(
                                (el: any, index: any) => (
                                  <div
                                    className="notch-corner"
                                    style={{
                                      background: el.bgColor,
                                      color: '#858585',
                                    }}
                                  >
                                    <div className="child-corner"></div>
                                    <div
                                      className=""
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        width: '35px',
                                      }}
                                    >
                                      {!(
                                        el.key &&
                                        projectDetail[
                                          el.key as keyof typeof projectDetail
                                        ]
                                      ) && (
                                        <span
                                          className="date-para"
                                          style={{
                                            color: el.color,
                                            fontSize: '9px',
                                          }}
                                        >
                                          ETA
                                        </span>
                                      )}
                                      <p
                                        style={{
                                          color: el.color,
                                          fontSize: '9px',
                                        }}
                                      >
                                        {el.key &&
                                        projectDetail[
                                          el.key as keyof typeof projectDetail
                                        ]
                                          ? format(
                                              new Date(
                                                projectDetail[
                                                  el.key as keyof typeof projectDetail
                                                ]
                                              ),
                                              'dd MMMM'
                                            ).slice(0, 6)
                                          : 'N/A'}
                                      </p>
                                      {el.key &&
                                        projectDetail[
                                          el.key as keyof typeof projectDetail
                                        ] && (
                                          <p
                                            className="stage-1-para"
                                            style={{
                                              color: el.color,
                                              fontSize: '10px',
                                            }}
                                          >
                                            {' '}
                                            {format(
                                              new Date(
                                                projectDetail[
                                                  el.key as keyof typeof projectDetail
                                                ]
                                              ),
                                              'yyyy'
                                            )}
                                          </p>
                                        )}
                                    </div>
                                    <div
                                      className="border-notch"
                                      style={{
                                        border: '0.5px solid ',
                                        borderColor: el.borderColor,
                                      }}
                                    ></div>
                                    <div
                                      className=""
                                      style={{ width: '115px' }}
                                    >
                                      <p
                                        className="stage-1-para"
                                        style={{
                                          color: el.color,
                                          fontSize: '12px',
                                        }}
                                      >
                                        {el.process}
                                      </p>
                                      <p
                                        className=""
                                        style={{
                                          color: el.color,
                                          fontSize: '11px',
                                        }}
                                      >
                                        {el.data}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                            {i === 6 ? null : (
                              <div className="dotted-border"></div>
                            )}
                          </>
                        ))
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
