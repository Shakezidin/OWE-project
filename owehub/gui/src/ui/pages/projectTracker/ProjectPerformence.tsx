import React, { useEffect, useState } from 'react';
import { cardData, projectDashData } from './projectData';
import { ICONS } from '../../icons/Icons';
import '../projectTracker/projectTracker.css';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { projects } from './projectData';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  getPerfomance,
  getPerfomanceStatus,
} from '../../../redux/apiSlice/perfomanceSlice';
import { format } from 'date-fns';
import Pagination from '../../components/pagination/Pagination';
import MicroLoader from '../../components/loader/MicroLoader';
import DataNotFound from '../../components/loader/DataNotFound';
const ProjectPerformence = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const perPage = 10;
  const getColorStyle = (date: string | null) => {
    if (!date) {
      return { backgroundColor: '#F2F4F6', color: '#7D7D7D' };
    } else if (new Date(date) <= new Date()) {
      return { backgroundColor: '#57B93A', color: 'white' };
    } else {
      return { backgroundColor: '#008DDA', color: 'white' };
    }
  };

  const {
    perfomaceSale,
    commisionMetrics,
    projectStatus,
    projectsCount,
    isLoading,
  } = useAppSelector((state) => state.perfomanceSlice);

  useEffect(() => {
    const current = format(new Date(), 'yyyy-MM-dd');
    dispatch(getPerfomance());
  }, []);

  useEffect(() => {
    dispatch(getPerfomanceStatus({ page, perPage }));
  }, [page]);

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
  return (
    <div className="">
      <Breadcrumb
        head=""
        linkPara="Performance"
        route={''}
        linkparaSecond="Dashboard"
      />
      <div className="project-container">
        <div className="project-heading">
          <h2>Performance</h2>

          <div className="iconsSection-filter">
            <button
              type="button"
              style={{ cursor: 'not-allowed', opacity: '0.5' }}
            >
              <img
                src={ICONS.filtercomm}
                alt=""
                style={{ width: '15px', height: '15px' }}
              />
            </button>
          </div>
        </div>
        <div className="project-card-container">
          {cardData.map((el, i) => {
            const findSale = perfomaceSale.find(
              (s: (typeof perfomaceSale)[0]) => s.Type === el.type
            );
            return (
              <div
                className="project-card"
                key={i}
                style={{ backgroundColor: el.bgColor }}
              >
                <div className="project-card-head">
                  <div
                    className="project-icon-img"
                    style={{ backgroundColor: el.iconBgColor }}
                  >
                    <object
                      type="image/svg+xml"
                      data={el.icon}
                      aria-label="performance-icons"
                    ></object>
                  </div>
                  <h2 style={{ color: el.color }}>{el.name}</h2>
                </div>
                <div className="project-card-body">
                  <div className="project-body-details">
                    <h2 style={{ fontSize: '14px' }}>
                      {' '}
                      {formatFloat(findSale?.sales)}{' '}
                    </h2>
                    <p style={{ fontSize: '14px' }}>Sales</p>
                  </div>
                  <div className="project-body-details">
                    <h2 style={{ fontSize: '14px' }}>
                      {' '}
                      {formatFloat(findSale?.sales_kw)}{' '}
                    </h2>
                    <p style={{ fontSize: '14px' }}>Sales KW</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="project-card-container">
          {projectDashData.map((item, i) => (
            <div className="project-ruppes-card" key={i}>
              <div className="project-ruppes-body">
                <div
                  className="project-icon-img"
                  style={{ background: item.iconBgColor }}
                >
                  <img
                    src={item.icon}
                    alt=""
                    style={{ height: '24px', width: '24px' }}
                  />
                </div>
                <div className="doller-head">
                  <h2>
                    {
                      commisionMetrics[
                        item.key as keyof typeof commisionMetrics
                      ]
                    }
                  </h2>
                  <p>{item.para}</p>
                </div>
              </div>
              <div className="project-ruppes-body">
                <div className="project-img-curve">
                  <img src={item.curveImg} alt="" />
                </div>
                <div
                  className="percent"
                  style={{ background: item.iconBgColor }}
                >
                  <img src={item.arrow} alt="" />
                  <p style={{ color: item.percentColor }}>40%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="project-container"
        style={{ marginTop: '1rem', padding: '0 0 1rem 0' }}
      >
        <div className="performance-table-heading">
          <div className="performance-project">
            <div>
              <h2>Projects</h2>

              <div className="progress-box-container">
                <div className="progress-box-body">
                  <div
                    className="progress-box"
                    style={{ background: '#0493CE' }}
                  ></div>
                  <p>In Process</p>
                </div>
                <div className="progress-box-body">
                  <div
                    className="progress-box"
                    style={{ background: '#57B93A' }}
                  ></div>
                  <p>Completed</p>
                </div>
                <div className="progress-box-body">
                  <div
                    className="progress-box"
                    style={{ background: '#E9E9E9' }}
                  ></div>
                  <p>Not Started yet</p>
                </div>
              </div>
            </div>
            {/* <input
              className="performance-search"
              type="search"
              placeholder="search "
              disabled
              onChange={() => {}}
            /> */}
          </div>

          <div className="performance-milestone-table">
            <table>
              <thead>
                <tr>
                  <th style={{ padding: '0px' }}>
                    <div className="milestone-header">
                      <p>Project Name</p>
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
                      <span>No Data Found</span>
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
                              <a
                                href={`/project-management?project_id=${project.unqiue_id}`}
                              >
                                <p className="install-update">
                                  {project.unqiue_id}
                                </p>
                              </a>
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
                                      : ''}
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
                                      pathColor: '#57B93A',
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
