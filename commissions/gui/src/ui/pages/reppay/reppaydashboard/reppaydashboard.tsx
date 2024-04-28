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
import FilterModal from "../../../components/FilterModal/FilterModal";
import { Column } from "../../../../core/models/data_models/FilterSelectModel";
import DropdownWithCheckboxes from "./DropdownCheck";

export const RepPayDashboardPage: React.FC = () => {

  const [active, setActive] = React.useState<number>(0);
  const [filterModal, setFilterModal] = React.useState<boolean>(false);

  const [selectedOption, setSelectedOption] = useState<string>(
    payRollData[0].label
  );
  const [selectedOption2, setSelectedOption2] = useState<string>(
    comissionValueData[0].label
  );
  const handleSelectChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedOption(selectedOption ? selectedOption.value : "");
  };
  const handleSelectChange2 = (
    selectedOption2: { value: string; label: string } | null
  ) => {
    setSelectedOption2(selectedOption2 ? selectedOption2.value : "");
  };
  const filterClose = () => {
    setFilterModal(false);
  };

  const includeData = [
    { value: "All", label: "All" },
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
const handleSelectChange3 = (
  selectedOption3: { value: string; label: string } | null
) => {
  setSelectedOption3(selectedOption3 ? selectedOption3.value : "");
};
const [open, setOpen] = useState<boolean>(false);
const handleOpen = () => setOpen(true);
 
  return (
    <>
      <div className="rep-Dashboard-section-container">
        <div className="rep-Dashboard-container">
        <div className="manage-user">
          <h3>Dashboard</h3>
        </div>
          <div className="rep-dashboard-payroll">

          <div className="rep-dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Include
              </label>
              <DropdownWithCheckboxes
                includeData={includeData}
                selectedOption3={selectedOption3}
                handleSelectChange3={handleSelectChange3}
              />
            </div>

            <div className="rep-dash-head-input">
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

            <div className="rep-dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Payroll Date
              </label>
              <input type="date" className="rep-payroll-date"  />
            </div>
            
            <div className="rep-dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Set Default
              </label>
              <label className="inputLabel rep-chart-view" style={{ color: "#344054" }}>
                Chart View
              </label>
            </div>

            <div className="Line-container">
              <div className="rep-line-graph">
                <div
                  className={`rep-filter-line ${
                    active === 0 ? "rep-active-filter-line" : ""
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
                  className={`filter-disable ${
                    active === 1 ? "rep-active-filter-line" : ""
                  }`}
                  // onClick={() => setActive(1)}
                >
                  {active === 1 ? (
                    <img src={ICONS.viewActive} alt="" />
                  ) : (
                    <img src={ICONS.viewChart} alt="" />
                  )}
                </div>
                <div
                  className="rep-filter-line"
                  onClick={() => setFilterModal(true)}
                >
                  <img src={ICONS.FILTER} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <RepPayDashboardTotal />
          {/* <DonutChart /> */}
        </div>
        {filterModal && (
          <FilterModal
            handleClose={filterClose}
            columns={[]}
            page_number={1}
            page_size={10}
            fetchFunction={() => {}}
          />
        )}
        <div className="" style={{ marginTop: "20px" }}>
          {active === 0 && <RepDashBoardTable/>}
          {active === 1 && <RepDashBoardChart/>}
          {active === 2 

          //  <RepDashBoardFilter/>
           
          }
        </div>
      </div>
    </>
  );
};
