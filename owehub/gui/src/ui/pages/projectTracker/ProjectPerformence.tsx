import React, { useState } from "react";
import { cardData, projectDashData } from "./projectData";
import { ICONS } from "../../icons/Icons";
import "../projectTracker/projectTracker.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { projects } from "./projectData";

import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
const ProjectPerformence = () => {
  const getColorStyle = (date: string | null) => {
    if (!date) {
      return { backgroundColor: "#F2F4F6", color: "#7D7D7D" };
    } else if (date === "Completed") {
      return { backgroundColor: "#57B93A", color: "white" };
    } else {
      return { backgroundColor: "#008DDA", color: "white" };
    }
  };

  return (
    <div className="">
      <Breadcrumb
        head=""
        linkPara="Project Tracking"
        route={""}
        linkparaSecond="Performance"
      />
      <div className="project-container">
        <div className="project-heading">
          <h2>Performance</h2>
          <div className="iconsSection-filter">
            <button
              type="button"
              style={{ cursor: "not-allowed", opacity: "0.5" }}
            >
              <img
                src={ICONS.filtercomm}
                alt=""
                style={{ width: "15px", height: "15px" }}
              />
            </button>
          </div>
        </div>
        <div className="project-card-container">
          {cardData.map((el, i) => (
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
                  <img src={el.icon} alt="" className="icon-image" />
                </div>
                <h2 style={{ color: el.color }}>{el.name}</h2>
              </div>
              <div className="project-card-body">
                <div className="project-body-details">
                  <h2 style={{ fontSize: "14px" }}>60</h2>
                  <p style={{ fontSize: "14px" }}>Sales</p>
                </div>
                <div className="project-body-details">
                  <h2 style={{ fontSize: "14px" }}>120</h2>
                  <p style={{ fontSize: "14px" }}>Sales KW</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="project-card-container">
          {projectDashData.map((item, i) => (
            <div className="project-ruppes-card" key={i}>
              <div className="project-ruppes-body">
                <div
                  className="project-icon-img"
                  style={{ background: item.iconBgColor }}
                >
                  <img src={item.icon} alt="" />
                </div>
                <div className="doller-head">
                  <h2>{item.ruppes}</h2>
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
        style={{ marginTop: "1rem", padding: "0 0 1rem 0" }}
      >
        <div className="performance-table-heading">
          <div className="performance-project">
            <h2>Projects</h2>
            <input
              className="performance-search"
              type="search"
              placeholder="search "
              disabled
              onChange={() => {}}
            />
          </div>
          <div className="performance-milestone-table">
            <table>
              <thead>
                <tr>
                  <th style={{ padding: "0px" }}>
                    <div className="milestone-header">
                      <p>Project Name</p>
                      <p>Milestone</p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={index}>
                    <td style={{ padding: "0px" }}>
                      <div className="milestone-data">
                        <p className="install-update">{project.projectName}</p>
                        <div
                          className="milestone-strips"
                          style={getColorStyle(project.salesDate)}
                        >
                          <div className="strip-title">
                            <p>{project.salesDate}</p>
                          </div>
                          <div
                            className="strip-line"
                            style={{ color: "" }}
                          ></div>
                          <div className="strip-des">
                            <p>
                              Sales{" "}
                              <IoMdInformationCircleOutline
                                style={{ cursor: "pointer" }}
                              />
                            </p>
                          </div>
                        </div>
                        {project.notchStrips.map((notch, notchIndex) => (
                          <div
                            key={notchIndex}
                            className="notch-strip"
                            style={getColorStyle(notch.date)}
                          >
                            <div className="notch-strip-title">
                              <p>{notch.date || "Data not available"}</p>
                            </div>
                            <div
                              className="strip-line"
                              style={{ color: "" }}
                            ></div>
                            <div className="notch-strip-des">
                              <p >
                                {notch.name}{" "}
                              </p>
                              <IoMdInformationCircleOutline
                                  style={{ cursor: "pointer" }}
                                />
                            </div>
                            <div className="child-notch"></div>
                          </div>
                        ))}
                        <div className="vertical-wrap">
                          <div className="vertical-line"></div>
                        </div>
                        <div className="all-progress">
                          <div style={{ width: "25px" }}>
                            <CircularProgressbar
                              styles={buildStyles({ pathColor: "#57B93A" })}
                              strokeWidth={10}
                              value={project.overallProgress}
                            />
                          </div>
                          <div>
                            <p className="progress">
                              {project.overallProgress}%
                            </p>
                            <p>Overall Progress</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPerformence;
