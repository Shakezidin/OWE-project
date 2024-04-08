import React, { useEffect, useState } from "react";
import './dasboard.css'
import DashboardTotal from "./DashboardTotal";
import DonutChart from './DonutChart/DonutChart'
import TinyBarChart from './DonutChart/TinyBarChart'
import Select from 'react-select';
import { ICONS } from "../../icons/Icons";

export const DashboardPage: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="Dashboard-section-container">
        <div className="Dashboard-container">
          <div className="Dashboard-wel">
            <h6>Welcome back, Colten</h6>
            <h3>Your Dashboard</h3>
          </div>
          <div className="dashboard-payroll" >
            <div className="Payroll-section">
              <label className="inputLabel" style={{ color: "#344054" }}>Payroll Date</label>
              <Select
                isSearchable
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    // marginTop: "4.5px",
                    borderRadius: "8px",
                    outline: "none",
                    // height: "10px",
                    border: "1px solid #d0d5dd",
                    background: "#ECECEC"

                  }),
                }}
              />
            </div>
            <div className="Payroll-section">
              <label className="inputLabel" style={{ color: "#344054" }}>Set Default</label>
              <Select
                isSearchable
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    // marginTop: "4.5px",
                    borderRadius: "8px ",
                    outline: "none",

                    // height: "1rem",
                    border: "1px solid #d0d5dd",
                    background: "#ECECEC",

                  }),
                }}
              />
            </div>
            <div className="Line-container">
              <div className="line-graph">
                <div className="filter-line">
                  <img src={ICONS.lineChartIcon} alt="" />
                </div>
                <div className="filter-line">
                  <img src={ICONS.graphIcon} alt="" />
                </div>
                <div className="filter-line">
                  <img src={ICONS.filter2} alt="" />
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
      <div className="" style={{ marginTop: "2rem" }}>
        <DashboardTotal />
        <DonutChart/>
      </div>

    </>

  )
}
