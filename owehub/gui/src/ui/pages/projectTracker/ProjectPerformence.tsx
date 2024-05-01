import React, { useState } from "react";
import { cardData, newStatusData, projectDashData } from "./projectData";
import { ICONS } from "../../icons/Icons";
import "../projectTracker/projectTracker.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiXCircle,
} from "react-icons/fi";
const ProjectPerformence = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const handleDateClick = () => {
    setShowCalendar(!showCalendar);
  };

  const resetDates = () => {
    setStartDate(null);
    setEndDate(null);
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
            {/* <div className="flight-date-picker">
              <div className="date-input" onClick={handleDateClick}>
                <FiCalendar className="calendar-icon" />
                <div className="date-text">
                  {startDate && endDate
                    ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                    : "Select dates"}
                </div>
                {startDate && endDate && (
                  <FiXCircle className="reset-icon" onClick={resetDates} />
                )}
              </div>
              {showCalendar && (
                <div className="calendar-container">
                  <div className="calendar-header">
                    <FiChevronLeft
                      onClick={() =>
                        setStartDate(
                          new Date(
                            startDate!.getFullYear(),
                            startDate!.getMonth() - 1,
                            startDate!.getDate()
                          )
                        )
                      }
                    />
                    <div className="month-year">
                      {startDate &&
                        startDate.toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                    </div>
                    <FiChevronRight
                      onClick={() =>
                        setStartDate(
                          new Date(
                            startDate!.getFullYear(),
                            startDate!.getMonth() + 1,
                            startDate!.getDate()
                          )
                        )
                      }
                    />
                  </div>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Departure date"
                  />
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Return date"
                  />
                  <button className="reset-button" onClick={resetDates}>
                    Reset
                  </button>
                </div>
              )}
            </div> */}
            {/* <button type="button" >
              <img src={ICONS.filtercomm} alt="" style={{ width: "15px", height: "15px" }} />
            </button> */}
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
        <div className="project-heading" style={{ padding: "1rem" }}>
          <div className="">
            <h2>Projects</h2>
            <div className="progress-box-container">
              <div className="progress-box-body">
                <div
                  className="progress-box"
                  style={{ background: "#57B93A" }}
                ></div>
                <p>Completed</p>
              </div>
              <div className="progress-box-body">
                <div className="progress-box"></div>
                <p>In Current Stage</p>
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
                    style={{ background: "#FFFFF", color: item.numColor }}
                  >
                    {item.number}
                  </div>
                  <p className="stage-1-para" style={{ color: item.color }}>
                    {item.name}
                  </p>
                </div>

                {item.childStatusData.map((el: any, index: any) => (
                  <div
                    className="notch-corner"
                    style={{ background: el.bgColor, color: "#101828" }}
                  >
                    <div className="child-corner"></div>
                    <div
                      className=""
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className="date-para"
                        style={{ color: el.color, fontSize: "11px" }}
                      >
                        ETA
                      </span>
                      <p style={{ color: el.color, fontSize: "10px" }}>
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
                        border: "1px solid ",
                        borderColor: el.borderColor,
                      }}
                    ></div>
                    <div className="">
                      <p
                        className="stage-1-para"
                        style={{ color: el.color, fontSize: "14px" }}
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
      </div>
    </div>
  );
};

export default ProjectPerformence;
