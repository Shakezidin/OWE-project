import React, { useEffect, useRef, useState } from "react";

import "../projectTracker/projectTracker.css";
import Input from "../../components/text_input/Input";
import { stateData } from "../../../resources/static_data/StaticData";
import { projectStatusHeadData } from "./projectData";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import SelectOption from "../../components/selectOption/SelectOption";
import { ICONS } from "../../icons/Icons";
import { FaCheck } from "react-icons/fa6";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  getProjectDetail,
  getProjects,
} from "../../../redux/apiSlice/projectManagement";
import { format } from "date-fns";
interface ActivePopups {
  [key: number]: number | null;
}
interface Option {
  value: string;
  label: string;
}
const data = [
  {
    name: "Page A",

    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",

    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",

    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",

    pv: 3908,
    amt: 2000,
  },
];

const ProjectStatus = () => {
  const { projects, projectDetail } = useAppSelector(
    (state) => state.projectManagement
  );
  const newStatusData = [
    {
      name: "Sales",
      number: <FaCheck />,
      color: "white",
      numColor: "#0493CE",
      bgColor: "#0493CE",
      childStatusData: [
        {
          name: "10 Apr",
          process: "Completed",
          bgColor: projectDetail.sales_completed ? "#57B93A" : "#F2F4F6",
          color: projectDetail.sales_completed ? "white" : "#101828",
          borderColor: "white",
          key: "sales_completed",
        },
      ],
    },
    {
      name: "NTP",
      number: "2",
      color: "white",
      numColor: "#0493CE",
      bgColor: "#0493CE",
      childStatusData: [
        {
          name: "10 Apr",
          process: projectDetail.ntp_pending ? "Completed" : "Pending",
          data: projectDetail.ntp_pending ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "ntp_pending",
          bgColor: projectDetail.ntp_pending ? "#57B93A" : "#F2F4F6",
          color: projectDetail.ntp_pending ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: "Completed",
          data: projectDetail.ntp_completed ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "ntp_completed",
          bgColor: projectDetail.ntp_completed ? "#57B93A" : "#F2F4F6",
          color: projectDetail.ntp_completed ? "white" : "#101828",
        },
      ],
    },
    {
      name: "Site Survey",
      number: "3",
      bgColor: "#0493CE",
      color: "white",
      numColor: "#0493CE",
      childStatusData: [
        {
          name: "10 Apr",
          process: projectDetail.site_survey_scheduled
            ? "Scheduled"
            : "Completed",
          data: projectDetail.site_survey_scheduled
            ? ""
            : "data is not available",
          borderColor: "#A5AAB2",
          key: "site_survey_scheduled",
          bgColor: projectDetail.site_survey_scheduled ? "#57B93A" : "#F2F4F6",
          color: projectDetail.site_survey_scheduled ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: projectDetail.site_survey_rescheduled
            ? "Re-Scheduled"
            : "Completed",
          data: projectDetail.site_survey_rescheduled
            ? ""
            : "data is not available",
          borderColor: "#A5AAB2",
          key: "site_survey_rescheduled",
          bgColor: projectDetail.site_survey_rescheduled
            ? "#57B93A"
            : "#F2F4F6",
          color: projectDetail.site_survey_rescheduled ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: "Completed",
          data: projectDetail.site_survey_completed
            ? ""
            : "data is not available",
          borderColor: "#A5AAB2",
          key: "site_survey_completed",
          bgColor: projectDetail.site_survey_completed ? "#57B93A" : "#F2F4F6",
          color: projectDetail.site_survey_completed ? "white" : "#101828",
        },
      ],
    },
    {
      name: "Roofing",
      number: "4",
      color: "white",
      numColor: "#0493CE",
      bgColor: "#0493CE",
      childStatusData: [
        {
          name: "10 Apr",
          process: projectDetail.roofing_pending ? "Completed" : "Pending",
          data: projectDetail.roofing_pending ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "roofing_pending",
          bgColor: projectDetail.roofing_pending ? "#57B93A" : "#F2F4F6",
          color: projectDetail.roofing_pending ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: projectDetail.roofing_scheduled ? "Completed" : "Scheduled",
          data: projectDetail.roofing_scheduled ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "roofing_scheduled",
          bgColor: projectDetail.roofing_scheduled ? "#57B93A" : "#F2F4F6",
          color: projectDetail.roofing_scheduled ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: "Completed",
          data: projectDetail.roofing_scheduled ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "roofing_scheduled",
          bgColor: projectDetail.roofing_scheduled ? "#57B93A" : "#F2F4F6",
          color: projectDetail.roofing_scheduled ? "white" : "#101828",
        },
      ],
    },
    {
      name: "Electrical",
      number: "5",
      color: "white",

      numColor: "#0493CE",
      bgColor: "#0493CE",
      childStatusData: [
        {
          name: "10 Apr",
          process: projectDetail.electrical_pending ? "Completed" : "Pending",
          data: projectDetail.electrical_pending ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "electrical_pending",
          bgColor: projectDetail.electrical_pending ? "#57B93A" : "#F2F4F6",
          color: projectDetail.electrical_pending ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: projectDetail.electrical_scheduled
            ? "Completed"
            : "Scheduled",
          data: projectDetail.electrical_scheduled
            ? ""
            : "data is not available",
          borderColor: "#A5AAB2",
          key: "electrical_scheduled",
          bgColor: projectDetail.electrical_scheduled ? "#57B93A" : "#F2F4F6",
          color: projectDetail.electrical_scheduled ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: "Completed",
          data: projectDetail.electrical_completed
            ? ""
            : "data is not available",
          borderColor: "#A5AAB2",
          key: "electrical_completed",
          bgColor: projectDetail.electrical_completed ? "#57B93A" : "#F2F4F6",
          color: projectDetail.electrical_completed ? "white" : "#101828",
        },
      ],
    },
    {
      name: "PV Permit ",
      number: "6",
      bgColor: "#0493CE",
      color: "white",

      numColor: "#0493CE",
      childStatusData: [
        {
          name: "10 Apr",
          process: projectDetail.pv_permit_pending ? "Completed" : "Pending",
          data: projectDetail.pv_permit_pending ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "pv_permit_pending",
          bgColor: projectDetail.pv_permit_pending ? "#57B93A" : "#F2F4F6",
          color: projectDetail.pv_permit_pending ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: projectDetail.pv_permit_scehduled
            ? "Completed"
            : "Submitted",
          data: projectDetail.pv_permit_scehduled
            ? ""
            : "data is not available",
          borderColor: "#A5AAB2",
          key: "pv_permit_scehduled",
          bgColor: projectDetail.pv_permit_scehduled ? "#57B93A" : "#F2F4F6",
          color: projectDetail.pv_permit_scehduled ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: "Approved",
          data: projectDetail.pv_permit_completed
            ? ""
            : "data is not available",
          borderColor: "#A5AAB2",
          key: "pv_permit_completed",
          bgColor: projectDetail.pv_permit_completed ? "#57B93A" : "#F2F4F6",
          color: projectDetail.pv_permit_completed ? "white" : "#101828",
        },
      ],
    },
    {
      name: "IC Permit Submitted",
      number: "7",
      color: "white",

      numColor: "#0493CE",
      bgColor: "#0493CE",
      childStatusData: [
        {
          name: "10 Apr",
          process: projectDetail.ic_permit_pending ? "Completed" : "Pending",
          data: projectDetail.ic_permit_pending ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "ic_permit_pending",
          bgColor: projectDetail.ic_permit_pending ? "#57B93A" : "#F2F4F6",
          color: projectDetail.ic_permit_pending ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: projectDetail.ic_permit_scheduled
            ? "Completed"
            : "Submitted",
          data: projectDetail.ic_permit_scheduled
            ? ""
            : "data is not available",
          borderColor: "#A5AAB2",
          key: "ic_permit_scheduled",
          bgColor: projectDetail.ic_permit_scheduled ? "#57B93A" : "#F2F4F6",
          color: projectDetail.ic_permit_scheduled ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: "Approved",
          data: projectDetail.ic_permit_completed
            ? ""
            : "data is not available",
          borderColor: "#A5AAB2",
          key: "ic_permit_completed",
          bgColor: projectDetail.ic_permit_completed ? "#57B93A" : "#F2F4F6",
          color: projectDetail.ic_permit_completed ? "white" : "#101828",
        },
      ],
    },
    {
      name: "Install",
      bgColor: "#0493CE",
      number: "8",
      color: "white",

      numColor: "#0493CE",
      childStatusData: [
        {
          name: "10 Apr",
          process: projectDetail.install_pending ? "Completed" : "Pending",
          data: projectDetail.install_pending ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "install_pending",
          bgColor: projectDetail.install_pending ? "#57B93A" : "#F2F4F6",
          color: projectDetail.install_pending ? "white" : "#101828",
        },

        {
          name: "10 Apr",
          process: projectDetail.install_ready ? "Completed" : "Ready",
          data: projectDetail.install_ready ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "install_ready",
          bgColor: projectDetail.install_ready ? "#57B93A" : "#F2F4F6",
          color: projectDetail.install_ready ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: projectDetail.install_scheduled ? "Completed" : "Scheduled",
          data: projectDetail.install_scheduled ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "install_scheduled",
          bgColor: projectDetail.install_scheduled ? "#57B93A" : "#F2F4F6",
          color: projectDetail.install_scheduled ? "white" : "#101828",
        },

        {
          name: "10 Apr",
          process: "Completed",
          data: projectDetail.install_completed ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "install_completed",
          bgColor: projectDetail.install_completed ? "#57B93A" : "#F2F4F6",
          color: projectDetail.install_completed ? "white" : "#101828",
        },
      ],
    },
    {
      name: "Final Inspection",
      number: "9",
      color: "white",

      numColor: "#0493CE",
      bgColor: "#0493CE",
      childStatusData: [
        {
          name: "10 Apr",
          process: projectDetail.final_inspection_submitted
            ? "Completed"
            : "Scheduled",
          data: projectDetail.final_inspection_submitted
            ? ""
            : "data is not available",
          borderColor: "#A5AAB2",
          key: "final_inspection_submitted",
          bgColor: projectDetail.final_inspection_submitted
            ? "#57B93A"
            : "#F2F4F6",
          color: projectDetail.final_inspection_submitted ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: projectDetail.final_inspection_approved
            ? "Completed"
            : "Approved",
          data: projectDetail.final_inspection_approved
            ? ""
            : "data is not available",
          borderColor: "#A5AAB2",
          key: "final_inspection_approved",
          bgColor: projectDetail.final_inspection_approved
            ? "#57B93A"
            : "#F2F4F6",
          color: projectDetail.final_inspection_approved ? "white" : "#101828",
        },
      ],
    },
    {
      name: "PTO",
      number: "10",
      color: "white",

      numColor: "#0493CE",
      bgColor: "#0493CE",
      childStatusData: [
        {
          name: "10 Apr",
          process: projectDetail.pto_in_process ? "Completed" : "In Process",
          data: projectDetail.pto_in_process ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "pto_in_process",
          bgColor: projectDetail.pto_in_process ? "#57B93A" : "#F2F4F6",
          color: projectDetail.pto_in_process ? "white" : "#101828",
        },
        {
          name: "10 Apr",
          process: projectDetail.pto_submitted ? "Completed" : "Submitted",
          data: projectDetail.pto_submitted ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "pto_submitted",
          bgColor: projectDetail.pto_submitted ? "#57B93A" : "#F2F4F6",
          color: projectDetail.pto_submitted ? "white" : "#101828",
        },

        {
          name: "10 Apr",
          process: "Approved",
          data: projectDetail.pto_completed ? "" : "data is not available",
          borderColor: "#A5AAB2",
          key: "pto_completed",
          bgColor: projectDetail.pto_completed ? "#57B93A" : "#F2F4F6",
          color: projectDetail.pto_completed ? "white" : "#101828",
        },
      ],
    },
  ];
  const [activePopups, setActivePopups] = useState<boolean>(false);

  const [selectedProject, setSelectedProject] = useState<{
    label: string;
    value: string;
  }>({} as Option);
  const dispatch = useAppDispatch();

  const handleClickOutside = (e: MouseEvent) => {
    const elm = e.target as HTMLElement;
    if (!elm.closest(".popup") && !elm.classList.contains("view-flex")) {
      setActivePopups(false);
    }
  };

  useEffect(() => {
    dispatch(getProjects());
  }, []);
  const projectOption: Option[] = projects.map(
    (item: (typeof projects)[0]) => ({
      label: item.unqiue_id,
      value: item.unqiue_id,
    })
  );
  useEffect(() => {
    if (activePopups) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePopups]);

  useEffect(() => {
    if (projectOption.length) {
      setSelectedProject(projectOption[0]);
      dispatch(getProjectDetail(projectOption[0]?.value));
    }
  }, [projectOption.length]);

  return (
    <div className="">
      <Breadcrumb
        head="Project Tracking"
        linkPara="Project Management"
        route={""}
        linkparaSecond="Dashboard"
      />
      <div className="project-container" style={{ padding: "0px" }}>
        <div
          className="project-heading"
          style={{
            borderBottom: "1px solid #E1E1E1",
            padding: "0 22px 15px 22px",
          }}
        >
          <h3 style={{ marginTop: "1rem" }}>Project Status</h3>
          <div className="" style={{ width: "25%" }}>
            <div className="">
              <SelectOption
                options={projectOption}
                value={selectedProject}
                onChange={(val) => val && setSelectedProject(val)}
              />
            </div>
          </div>
        </div>

        <div className="project-status-head-card">
          <div className="project-status-body">
            {projectStatusHeadData.map((el, i) => (
              <div
                className="project-status-body-card"
                key={i}
                style={{ background: el.bgColor }}
              >
                <div className="">
                  <p className="para-head">{el.name}</p>
                  <span className="span-para">
                    {projectDetail[el.key as keyof typeof projectDetail] ||
                      "N/A"}
                  </span>
                </div>
                {el.viewButton ? (
                  <div
                    className="view-flex"
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
                      <li className="order-list-name">Adders</li>
                      <li className="order-list-name">Sub Adder</li>
                      <li className="order-list-name">$20 Adder</li>
                      <li className="order-list-name">$20 Sub Adder</li>
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="project-status-graph">
            <div className="status-graph-heading">
              <h2 className="percent-head">25%</h2>
              <p>Overall Progress</p>
            </div>
            <div className="">
              <div className="curve-graph-pos">
                <div className="curve-head-pos">
                  <p style={{ fontWeight: "600" }}>25%</p>
                  <p>Apr 26th,2024</p>
                </div>
                <img src={ICONS.curveGraph} alt="" />
                {/* time */}
              </div>
              <div className="graph-pos"></div>
              <img className="fade-graph" src={ICONS.linearGraph} alt="" />
            </div>
          </div>
        </div>

        <div className="project-heading" style={{ padding: "22px" }}>
          <div className="">
            <h3>Project Stages</h3>
            <div className="progress-box-container">
              <div className="progress-box-body">
                <div
                  className="progress-box"
                  style={{ background: "#0493CE" }}
                ></div>
                <p>Stages</p>
              </div>
              <div className="progress-box-body">
                <div
                  className="progress-box"
                  style={{ background: "#57B93A" }}
                ></div>
                <p>Completed</p>
              </div>
              <div className="progress-box-body">
                <div
                  className="progress-box"
                  style={{ background: "#E9E9E9" }}
                ></div>
                <p>Not Started yet</p>
              </div>
            </div>
          </div>
        </div>
        <div className="project-management-table">
          <table>
            <tbody>
              <tr style={{ borderBottom: "none" }}>
                <td style={{ padding: "0px" }}>
                  <div className="project-staus-progress-container">
                    {newStatusData.map((item: any, i: any) => (
                      <>
                        <div className="project-status-table">
                          <div
                            className="project-status-card"
                            style={{ marginTop: "0", background: item.bgColor }}
                          >
                            <div
                              className="status-number"
                              style={{
                                background: "#FFFFF",
                                color: item.numColor,
                              }}
                            >
                              {item.number}
                            </div>
                            <p
                              className="stage-1-para"
                              style={{ color: item.color }}
                            >
                              {item.name}
                            </p>
                          </div>
                          {item.childStatusData.map((el: any, index: any) => (
                            <div
                              className="notch-corner"
                              style={{
                                background: el.bgColor,
                                color: "#101828",
                              }}
                            >
                              <div className="child-corner"></div>
                              <div
                                className=""
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  width: "35px",
                                }}
                              >
                                <span
                                  className="date-para"
                                  style={{ color: el.color, fontSize: "9px" }}
                                >
                                  ETA
                                </span>
                                <p style={{ color: el.color, fontSize: "9px" }}>
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
                                        "dd MMMM"
                                      ).slice(0, 6)
                                    : "N/A"}
                                </p>
                                {el.key &&
                                  projectDetail[
                                    el.key as keyof typeof projectDetail
                                  ] && (
                                    <p
                                      className="stage-1-para"
                                      style={{
                                        color: el.color,
                                        fontSize: "10px",
                                      }}
                                    >
                                      {" "}
                                      {format(
                                        new Date(
                                          projectDetail[
                                            el.key as keyof typeof projectDetail
                                          ]
                                        ),
                                        "yyyy"
                                      )}
                                    </p>
                                  )}
                              </div>
                              <div
                                className="border-notch"
                                style={{
                                  border: "0.5px solid ",
                                  borderColor: el.borderColor,
                                }}
                              ></div>
                              <div className="" style={{ width: "115px" }}>
                                <p
                                  className="stage-1-para"
                                  style={{ color: el.color, fontSize: "12px" }}
                                >
                                  {el.process}
                                </p>
                                <p
                                  className=""
                                  style={{ color: el.color, fontSize: "11px" }}
                                >
                                  {el.data}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {i === 9 ? null : <div className="dotted-border"></div>}
                      </>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
