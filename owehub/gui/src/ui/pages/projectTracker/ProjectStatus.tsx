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

const projectOption: Option[] = [
  {
    value: "project_one",
    label: "Project 1",
  },
  {
    value: "project_two",
    label: "Project Two",
  },
];
const ProjectStatus = () => {
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
          bgColor: "#57B93A",
          color: "white",
          borderColor: "white",
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
          process: "Pending",
          bgColor: "#F2F4F6",
          data: "data is not available",
          color: "#101828",
          borderColor: "#A5AAB2",
        },
        {
          name: "10 Apr",
          process: "Completed",
          bgColor: "#F2F4F6",
          data: "data is not available",
          color: "#101828",
          borderColor: "#A5AAB2",
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
          bgColor: "#F2F4F6",
          name: "ETA 20",
          process: "Scheduled",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 20",
          process: "Re-Scheduled",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 22",
          process: "Completed",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
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
          bgColor: "#F2F4F6",
          name: "ETA 20",
          process: "Pending",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 20",
          process: "Scheduled",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 22",
          process: "Completed",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
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
          bgColor: "#F2F4F6",
          name: "ETA 20",
          process: "Pending",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 20",
          process: "Scheduled",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 22",
          process: "Completed",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
        },
      ],
    },
    {
      name: "PV Permit Submitted",
      number: "6",
      bgColor: "#0493CE",
      color: "white",

      numColor: "#0493CE",
      childStatusData: [
        {
          bgColor: "#F2F4F6",
          name: "ETA 20",
          color: "#101828",
          process: "Pending",
          borderColor: "#A5AAB2",
          data: "data is not available",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 22",
          color: "#101828",
          process: "Submitted",
          borderColor: "#A5AAB2",
          data: "data is not available",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 25",
          color: "#101828",
          data: "data is not available",
          process: "Approved",
          borderColor: "#A5AAB2",
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
          bgColor: "#F2F4F6",
          name: "ETA 20",
          color: "#101828",
          process: "Pending",
          borderColor: "#A5AAB2",
          data: "data is not available",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 22",
          color: "#101828",
          process: "Submitted",
          data: "data is not available",
          borderColor: "#A5AAB2",
        },
        {
          bgColor: "#F2F4F6",
          color: "#101828",
          name: "ETA 25",
          data: "data is not available",
          process: "Approved",
          borderColor: "#A5AAB2",
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
          bgColor: "#F2F4F6",
          name: "ETA 20",
          process: "Pending",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 20",
          process: "Ready",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 20",
          process: "Scheduled",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 22",
          process: "Completed",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
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
          bgColor: "#F2F4F6",
          name: "ETA 20",
          color: "#101828",
          process: "Submitted",
          borderColor: "#A5AAB2",
          data: "data is not available",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 22",
          color: "#101828",
          process: "Approved",
          data: "data is not available",
          borderColor: "#A5AAB2",
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
          bgColor: "#F2F4F6",
          name: "ETA 20",
          process: "In Process",
          color: "#101828",
          data: "data is not available",
          borderColor: "#A5AAB2",
        },
        {
          bgColor: "#F2F4F6",
          name: "ETA 20",
          process: "Submitted",
          borderColor: "#A5AAB2",
          data: "data is not available",
          color: "#101828",
        },

        {
          bgColor: "#F2F4F6",
          name: "ETA 22",
          process: "Completed",
          color: "#101828",
          borderColor: "#A5AAB2",
          data: "data is not available",
        },
      ],
    },
  ];
  const [activePopups, setActivePopups] = useState<boolean>(false);
  const menuRef = useRef();
  // State to store active popups for each row
  const handleClickOutside = (e: MouseEvent) => {
    const elm = e.target as HTMLElement;
    if (!elm.closest(".popup") && !elm.classList.contains("view-flex")) {
      setActivePopups(false);
    }
  };
  useEffect(() => {
    if (activePopups) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePopups]);

  return (
    <div className="">
      <Breadcrumb
        head="Project Tracking"
        linkPara="Project Management"
        route={""}
        linkparaSecond="Dashboard"
      />
      <div className="project-container">
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
                value={projectOption?.find(
                  (option) => option.value === "project_one"
                )}
                onChange={() => {}}
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
                  <span className="span-para">{el.para}</span>
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
              <tr style={{borderBottom: "none"}}>
                <td style={{padding: "0px"}}>
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
                                  20 Apr
                                </p>
                                <p
                                  className="stage-1-para"
                                  style={{ color: el.color, fontSize: "10px" }}
                                >
                                  {" "}
                                  2024
                                </p>
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
