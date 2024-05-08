import React, { useEffect, useState, useRef } from "react";
import "./ardashboard.css";
import { ICONS } from "../../../icons/Icons";
import { comissionValueData, payRollData } from "../../../../resources/static_data/StaticData";
import FilterModal from "../../../components/FilterModal/FilterModal";
import ArDashBoardTable from "./artable";
import ArDropdownWithCheckboxes from "./Dropdown";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Select from "react-select";



export const ARDashboardPage: React.FC = () => {

  const [active, setActive] = React.useState<number>(0);
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const filterClose = () => {
    setFilterModal(false);
  };

  const options = [
    { value: "All", label: "All" },
    { value: "Shaky", label: "Shaky" },
    { value: "Cancel", label: "Cancel" },
    { value: "QC/Permit/NTP", label: "QC/Permit/NTP" },
    { value: "Install", label: "Install" },
    { value: "PTO", label: "PTO" },
  ];

  const options1 = [
    { value: "All", label: "All" },
    { value: "Shaky", label: "Current Due" },
    { value: "Cancel", label: "Overpaid" },
  ];
  const options2 = [
    { value: "All", label: "All" },
    { value: "Shaky", label: "N/A" },
  ];
  const options3 = [
    { value: "Select", label: "Select" },
    { value: "Partner", label: "Partner" },
    { value: "Installer", label: "Installer" },
    { value: "Type", label: "Type" },
    { value: "Service", label: "Service" },
    { value: "Home Owner", label: "Home Owner" },
    { value: "Street Address", label: "Street Address" },
    { value: "City", label: "City" },
    { value: "ST", label: "ST" },
    { value: "Zip", label: "Zip" },
    { value: "KW", label: "KW" },
    { value: "Contract Date", label: "Contract Date" },
    { value: "Install date", label: "Install date" },
    { value: "Current Status", label: "Current Status" },
    { value: "Status date", label: "Status date" },
    { value: "Contract", label: "Contract" },
    { value: "AR Total", label: "AR Total" },
    { value: "Amt paid", label: "Amt paid" },
    { value: "Current Due", label: "Current Due" },
    { value: "Est Pipeline", label: "Est Pipeline" },
    { value: "Subtotal", label: "Subtotal" },
  ];

  // used for close date click outside anywhere
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const [selectedOption3, setSelectedOption3] = useState<string>(
    options[0].label,
  );
  const handleSelectChange3 = (
    selectedOption3: { value: string; label: string } | null
  ) => {
    setSelectedOption3(selectedOption3 ? selectedOption3.value : "");
  };
  const [selectedOption4, setSelectedOption4] = useState<string>(
    options3[0].label,
  );
  const handleSelectChange4 = (
    selectedOption4: { value: string; label: string } | null
  ) => {
    setSelectedOption4(selectedOption4 ? selectedOption4.value : "");
  };
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <div className="ar-Dashboard-section-container">
        <div className="ar-Dashboard-container">
          <div className=""></div>
          <div className="dashboard-payroll">

            <div className="rep-dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Report Types
              </label>
              <Select
                options={options1}
                value={options1.find(
                  (option) => option.value === selectedOption3
                )}
                onChange={handleSelectChange3}
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
                Sales Partner
              </label>
              <Select
                options={options2}
                value={comissionValueData.find(
                  (option) => option.value === selectedOption3
                )}
                onChange={handleSelectChange3}
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
                Elements
              </label>
              {/* <Select
                options={options3}
                value={options3.find(
                  (option) => option.value === selectedOption4
                )}
                onChange={handleSelectChange4}
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
              /> */}
              <Select
                options={options3}
                value={options3.find((option) => option.value === selectedOption4)}
                onChange={handleSelectChange4}
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
                    maxHeight: "200px",
                    overflowY: "auto",
                    "::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                    },
                    "::-webkit-scrollbar-thumb": {
                      background: "#888",
                      borderRadius: "4px",
                    },
                    "::-webkit-scrollbar-thumb:hover": {
                      background: "#555",
                    },
                  }),
                }}
              />
            </div>


            <div className="rep-dash-head-input">
              <label className="inputLabel" style={{ fontWeight: "400", color: "#344054" }}>
                Includes
              </label>
              <ArDropdownWithCheckboxes options={options} />

            </div>

            <div className="rep-dash-head-input">
              <label className="inputLabel" style={{ color: "#344054", fontWeight: "400", fontSize: "12px" }}>
                Date Override
              </label>
              <label className="inputLabel" style={{ color: "#344054", fontWeight: "600", fontSize: "12px" }}>
                Today
              </label>
              <div className="" style={{}}></div>

              {/* <div style={{ position: "relative", top: "-1px" }} ref={datePickerRef}>
                <label className="date-button" onClick={handleToggleDatePicker}>
                  Select Dates
                </label>
                {showDatePicker && (
                  <div className="calender-container">
                    <DateRangePicker
                      ranges={[selectionRange]}
                      onChange={handleSelect}
                    />
                    <button
                      className="reset-calender"
                      onClick={handleResetDates}
                    >
                      Reset
                    </button>
                    <button
                      className="close-calender"
                      onClick={handleToggleDatePicker}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div> */}

            </div>

            <div className="Line-container">
              <div className="ar-line-graph">
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
