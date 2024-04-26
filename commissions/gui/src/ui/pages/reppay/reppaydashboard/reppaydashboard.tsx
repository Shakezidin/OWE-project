import React, { useEffect, useState } from "react";
import "./repdasboard.css";
import Select from "react-select";
import { ICONS } from "../../../icons/Icons";
import { comissionValueData, payRollData } from "../../../../resources/static_data/StaticData";
import DashboardTotal from "../../dashboard/DashboardTotal";
import RepDashBoardTable from "./RepDashboardTable";
import RepDashBoardChart from "./RepDashboardChart";
import RepDashBoardFilter from "./RepFilter";
import RepPayDashboardTotal from "./RepPayDashboardTotal";

export const RepPayDashboardPage: React.FC = () => {

  const [active, setActive] = React.useState<number>(0);
 
  const [selectedOption, setSelectedOption] = useState<string>(
    payRollData[0].label,
  );
  const [selectedOption2, setSelectedOption2] = useState<string>(
    comissionValueData[0].label,
  );
  
  const handleSelectChange2 = (
    selectedOption2: { value: string; label: string } | null
  ) => {
    setSelectedOption2(selectedOption2 ? selectedOption2.value : "");
  };

  const includeData = [
    { value: "AP-DTH", label: "AP-DTH" },
    { value: "AP-PDA", label: "AP-PDA" },
    { value: "AP-ADV", label: "AP-ADV" },
    { value: "AP-DED", label: "AP-DED" },
    { value: "REP-COMM", label: "REP-COMM" },
    { value: "REP BONUS", label: "REP BONUS" },
    { value: "LEADER", label: "LEADER" }
];

const [selectedOption3, setSelectedOption3] = useState<string>(
  includeData[0].label,
);
 
  return (
    <>
      <div className="Dashboard-section-container">
        <div className="Dashboard-container">
        <div className="manage-user">
          <p>Welcome, Bruce Wills</p>
          <h2>Your Dashboard</h2>
        </div>
          <div className="dashboard-payroll">

          <div className="dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Include
              </label>
              <Select
                options={includeData}
                value={includeData.find(
                  (option) => option.value === selectedOption3
                )}
                onChange={handleSelectChange2}
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
                    backgroundColor: "#ECECEC",
                  }),
                  indicatorSeparator: () => ({
                    display: "none",
                  }),
                  option: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: "13px",
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    width: "6rem",
                  })
                }}
              />
            </div>

            <div className="dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Commission Model
              </label>
              <Select
                options={comissionValueData}
                value={comissionValueData.find(
                  (option) => option.value === selectedOption2
                )}
                onChange={handleSelectChange2}
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
                    backgroundColor: "#ECECEC",
                  }),
                  indicatorSeparator: () => ({
                    display: "none",
                  }),
                  option: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: "13px",
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    width: "6rem",
                  })
                }}
              />
            </div>

            <div className="dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Payroll Date
              </label>
              <input type="date" className="payroll-date"  />
            </div>
            
            <div className="dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Set Default
              </label>
              <label className="inputLabel chart-view" style={{ color: "#344054" }}>
                Chart View
              </label>
            </div>

            <div className="Line-container">
              <div className="line-graph">
                <div
                  className={`filter-line ${
                    active === 0 ? "active-filter-line" : ""
                  }`}
                  onClick={() => setActive(0)}
                >
                  {active === 0 ? (
                    <img src={ICONS.dashActive} alt="" />
                  ) : (
                    <img src={ICONS.dashHead} alt="" />
                  )}
                </div>
                <div
                  className={`filter-line ${
                    active === 1 ? "active-filter-line" : ""
                  }`}
                  onClick={() => setActive(1)}
                >
                  {active === 1 ? (
                    <img src={ICONS.viewActive} alt="" />
                  ) : (
                    <img src={ICONS.viewChart} alt="" />
                  )}
                </div>
                <div
                  className={`filter-line ${
                    active === 2 ? "active-filter-line" : ""
                  }`}
                  onClick={() => setActive(2)}
                >
                  {active === 2 ? (
                    <img src={ICONS.FILTERACTIVE} alt="" />
                  ) : (
                    <img src={ICONS.FILTER} alt="" />
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="">
            <RepPayDashboardTotal/>
        </div>
        <div className="" style={{ marginTop: "20px" }}>
          {active === 0 && <RepDashBoardTable/>}
          {active === 1 && <RepDashBoardChart/>}
          {active === 2 && <RepDashBoardFilter/>}
        </div>
      </div>
    </>
  );
};
