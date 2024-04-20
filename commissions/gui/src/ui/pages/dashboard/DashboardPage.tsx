import React, { useEffect, useState } from "react";
import "./dasboard.css"
import DashboardTotal from "./DashboardTotal";
import DonutChart from './DonutChart/DonutChart'
import TinyBarChart from './DonutChart/TinyBarChart'
import Select from 'react-select';
import { ICONS } from "../../icons/Icons";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import DashBoardTable from "./DashBoardTable";
import DashBoardChart from "./DashBoardChart";
import { payRollData } from "../../../resources/static_data/StaticData";

export const DashboardPage: React.FC = () => {
  const [active, setActive] = React.useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>(
    payRollData[0].label
  );
  const handleSelectChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedOption(selectedOption ? selectedOption.value : "");
  };

  return (
    <>
      <div className="Dashboard-section-container">
        <div className="Dashboard-container">
          <div className="Dashboard-wel">
            <h3>Dashboard</h3> 
          </div>
          <div className="dashboard-payroll" >
            <div className="Payroll-section">
              <label className="inputLabel" style={{ color: "#344054" }}>Payroll Date</label>
              {/* <select name="" id="" className="dash-select">
                <option value="">01/02/2024</option>
                <option value="">23/02/2024</option>
                <option value="">12/03/2024</option>
                <option value="">07/04/2024</option>
                <option value="">24/04/2024</option>
              </select> */}
               <Select
              options={payRollData}
              value={payRollData.find(
                (option) => option.value === selectedOption
              )}
              onChange={handleSelectChange}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  fontSize: "13px",
                  fontWeight: "500",
                  borderRadius: ".40rem",
                  border: "none",
                  outline: "none",
                  width: "6rem",
                  minHeight: "unset",
                  height: "30px",
                  alignContent: "center",
                  backgroundColor: '#ECECEC'
                }),
                indicatorSeparator: () => ({
                  display: 'none'
                }),
                option: (baseStyles) => ({
                  ...baseStyles,
                  fontSize: "13px",
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  width: "6rem"
                }),
              }}
            />
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
                  {active === 0 ? <img src={ICONS.dashActive} alt="" /> : <img src={ICONS.dashHead} alt="" /> }
                </div>
                <div className={`filter-line ${active === 1 ? "active-filter-line" : ""}`} onClick={() => setActive(1)}>
                {active === 1 ? <img src={ICONS.viewActive} alt="" /> : <img src={ICONS.viewChart} alt="" /> }
                </div>
                <div className={`filter-line ${active === 2 ? "active-filter-line" : ""}`} onClick={() => setActive(2)}>
                {active === 2 ? <img src={ICONS.FILTERACTIVE} alt="" /> : <img src={ICONS.FILTER} alt="" /> }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <DashboardTotal />
          {/* <DonutChart /> */}
        </div>
        <div className="" style={{ marginTop: "20px" }}>
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
