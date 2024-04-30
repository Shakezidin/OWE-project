import React, { useEffect, useState } from "react";
import "./ardashboard.css";
import { ICONS } from "../../../icons/Icons";
import { comissionValueData, payRollData } from "../../../../resources/static_data/StaticData";
import FilterModal from "../../../components/FilterModal/FilterModal";
import ArDashBoardTable from "./artable";
import ArDropdownWithCheckboxes from "./Dropdown";



export const ARDashboardPage: React.FC = () => {

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

  const options = [
    { value: "Shaky", label: "Shaky" },
    { value: "Cancel", label: "Cancel" },
    { value: "QC/Permit/NTP", label: "QC/Permit/NTP" },
    { value: "Install", label: "Install" },
    { value: "PTO", label: "PTO" },
  ];


  const [selectedOption3, setSelectedOption3] = useState<string>(
    options[0].label,
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
      <div className="ar-Dashboard-section-container">
        <div className="ar-Dashboard-container">
          <div className="manage-user">
            <h3>AR</h3>
          </div>
          <div className="dashboard-payroll">

            <div className="rep-dash-head-input">
              <label className="inputLabel" style={{fontWeight: "400", color: "#344054" }}>
                Includes
              </label>
                <ArDropdownWithCheckboxes
                />

            </div>

            <div className="rep-dash-head-input">
              <label className="inputLabel" style={{ color: "#344054", fontWeight: "400", fontSize: "12px" }}>
                Date Override
              </label>
              <label className="inputLabel" style={{ color: "#344054", fontWeight: "600", fontSize: "12px" }}>
                Today
              </label>
              <input type="date" className="ar-payroll-date" />
            </div>

            <div className="Line-container">
              <div className="rep-line-graph">
                <div
                  className={`rep-filter-line ${active === 0 ? "rep-active-filter-line" : ""
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
                  className={`filter-disable ${active === 1 ? "rep-active-filter-line" : ""
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
        {filterModal && (
          <FilterModal
            handleClose={filterClose}
            columns={[]}
            page_number={1}
            page_size={10}
            fetchFunction={() => { }}
          />
        )}
        <div className="" style={{ marginTop: "20px" }}>
          {active === 0 && <ArDashBoardTable />}
        </div>
      </div>
    </>
  );
};
