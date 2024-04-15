import React, { useEffect, useState } from "react";
import './dasboard.css'
import DashboardTotal from "./DashboardTotal";
import DonutChart from './DonutChart/DonutChart'
import TinyBarChart from './DonutChart/TinyBarChart'
import Select from 'react-select';
import { ICONS } from "../../icons/Icons";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import DashBoardTable from "./DashBoardTable";
import DashBoardChart from "./DashBoardChart";

export const DashboardPage: React.FC = () => {
  const [active, setActive] = React.useState<number>(0);


  return (
    <>
      <div className="Dashboard-section-container">
        <div className="Dashboard-container">
          <div className="Dashboard-wel">
            <Breadcrumb head="Dashboard" linkPara="Commission" linkparaSecond="Dashboard" />
          </div>
          <div className="dashboard-payroll" >
            <div className="Payroll-section">
              <label className="inputLabel" style={{ color: "#344054" }}>Payroll Date</label>
              <select name="" id="" className="dash-select">
                <option value="">Select</option>
              </select>
            </div>
            <div className="Payroll-section">
              <label className="inputLabel" style={{ color: "#344054" }}>Set Default</label>
              <div className="dash-select">
                Chart View
              </div>
            </div>
            <div className="Line-container">
              <div className="line-graph">
                <div className={`filter-line ${active === 0 ? "active-filter-line" : ""}`} onClick={() => setActive(0)}>
                  <img src={ICONS.dashHead} style={{ background: "white" }} alt="" />
                </div>
                <div className={`filter-line ${active === 1 ? "active-filter-line" : ""}`} onClick={() => setActive(1)}>
                  <img src={ICONS.viewChart} alt="" />
                </div>
                <div className={`filter-line ${active === 2 ? "active-filter-line" : ""}`} onClick={() => setActive(2)}>
                  <img src={ICONS.FILTER} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <DashboardTotal />
          {/* <DonutChart /> */}
        </div>
        <div className="" style={{ marginTop: "1.5rem" }}>
        {
          active === 0 && (
            <DashBoardTable
            />)
        }
        {
          active === 1 && (
            <DashBoardChart
            />)
        }
      </div>
      </div>

     
    </>

  )
}
