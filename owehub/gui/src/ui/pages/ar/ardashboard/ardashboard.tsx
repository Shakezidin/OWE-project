import React, { useEffect, useState, useRef } from "react";
import "./ardashboard.css";
import { ICONS } from "../../../icons/Icons";
import {
  comissionValueData,
  payRollData,
} from "../../../../resources/static_data/StaticData";
import FilterModal from "../../../components/FilterModal/FilterModal";
import ArDashBoardTable from "./artable";
import ArDropdownWithCheckboxes from "./Dropdown";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Select from "react-select";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { handleChange as filterChange } from "../../../../redux/apiSlice/AR/ArDataSlice";

export const ARDashboardPage: React.FC = () => {
  const [active, setActive] = React.useState<number>(0);
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dispatch = useAppDispatch();
  const filterClose = () => {
    setFilterModal(false);
  };
  const options = [
    { value: "All", label: "All", key: "all" },
    { value: "Shaky", label: "Shaky", key: "shaky" },
    { value: "Cancel", label: "Cancel", key: "cancel" },
    { value: "QC/Permit/NTP", label: "QC/Permit/NTP", key: "permits" },
    { value: "Install", label: "Install", key: "install" },
    { value: "PTO", label: "PTO", key: "pto" },
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
    { value: "ST", label: "State" },
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
  const { filters } = useAppSelector((state) => state.ardata);

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
    options[0].label
  );
  const handleSelectChange3 = (
    selectedOption3: { value: string; label: string } | null
  ) => {
    setSelectedOption3(selectedOption3 ? selectedOption3.value : "");
  };
  const [selectedOption4, setSelectedOption4] = useState<string>(
    options3[0].label
  );
  const handleSelectChange4 = (
    selectedOption4: { value: string; label: string } | null
  ) => {
    setSelectedOption4(selectedOption4 ? selectedOption4.value : "");
  };
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);

  const handleChange = (name: string, value: string) => {
    dispatch(filterChange({ name, value }));
  };
  console.log(filters, "guhvjhg");

  return (
    <>
      <div className="ar-Dashboard-section-container">
        <div className="ar-Dashboard-container">
          <div className=""></div>
          <div className="dashboard-payroll">
            <div className="ar-dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Report Types
              </label>
              <Select
                options={options1}
                value={options1.find((option) => option.value === filters.report_type)}
                onChange={(value) => handleChange("report_type", value?.value!)}
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
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: "#0493CE", // Change the placeholder color here
                  }),
                  indicatorSeparator: () => ({
                    display: "none",
                  }),
                  dropdownIndicator: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#0493CE",
                    "&:hover": {
                      color: "#0493CE",
                    },
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    fontSize: "13px",
                    color: state.isSelected ? "#ffffff" : "#0493CE",
                    backgroundColor: state.isSelected ? "#0493CE" : "#ffffff",
                    "&:hover": {
                      backgroundColor: state.isSelected ? "#0493CE" : "#f2f2f2",
                    },
                  }),
                  singleValue: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#0493CE",
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    width: "6rem",
                    zIndex: 999,
                  }),
                  menuList: (base) => ({
                    ...base,
                    "&::-webkit-scrollbar": {
                      scrollbarWidth: "thin",
                      display: "block",
                      scrollbarColor: "rgb(173, 173, 173) #fff",
                      width: 8,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgb(173, 173, 173)",
                      borderRadius: "30px",
                    },
                  }),
                }}
              />
            </div>

            <div className="ar-dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Sales Partner
              </label>
              <Select
                options={options2}
                value={options2.find(
                  (option) => option.value === filters.report_type
                )}
                onChange={(value) =>
                  handleChange("sale_partner", value?.value!)
                }
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
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: "#0493CE", // Change the placeholder color here
                  }),
                  indicatorSeparator: () => ({
                    display: "none",
                  }),
                  dropdownIndicator: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#0493CE",
                    "&:hover": {
                      color: "#0493CE",
                    },
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    fontSize: "13px",
                    color: state.isSelected ? "#ffffff" : "#0493CE",
                    backgroundColor: state.isSelected ? "#0493CE" : "#ffffff",
                    "&:hover": {
                      backgroundColor: state.isSelected ? "#0493CE" : "#f2f2f2",
                    },
                  }),
                  singleValue: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#0493CE",
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    width: "6rem",
                    zIndex: 999,
                  }),
                  menuList: (base) => ({
                    ...base,
                    "&::-webkit-scrollbar": {
                      scrollbarWidth: "thin",
                      display: "block",
                      scrollbarColor: "rgb(173, 173, 173) #fff",
                      width: 8,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgb(173, 173, 173)",
                      borderRadius: "30px",
                    },
                  }),
                }}
              />
            </div>

            <div className="ar-dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Elements
              </label>
              <Select
                options={options3}
                value={options3.find(
                  (option) => option.value === filters.sort_by
                )}
                onChange={(value) => handleChange("sort_by", value?.value!)}
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
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: "#0493CE", // Change the placeholder color here
                  }),

                  indicatorSeparator: () => ({
                    display: "none",
                  }),
                  dropdownIndicator: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#0493CE",
                    "&:hover": {
                      color: "#0493CE",
                    },
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    fontSize: "13px",
                    color: state.isSelected ? "#ffffff" : "#0493CE",
                    backgroundColor: state.isSelected ? "#0493CE" : "#ffffff",
                    "&:hover": {
                      backgroundColor: state.isSelected ? "#0493CE" : "#f2f2f2",
                    },
                  }),
                  singleValue: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#0493CE",
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    width: "6rem",
                    height: "auto",
                    overflowY: "auto",
                    zIndex: 999,
                  }),
                  menuList: (base) => ({
                    ...base,
                    "&::-webkit-scrollbar": {
                      scrollbarWidth: "thin",
                      display: "block",
                      scrollbarColor: "rgb(173, 173, 173) #fff",
                      width: 8,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgb(173, 173, 173)",
                      borderRadius: "30px",
                    },
                  }),
                }}
              />
            </div>

            <div className="ar-dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Includes
              </label>
              <ArDropdownWithCheckboxes options={options} />
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
                  style={{ border: "1px solid #0493CE" }}
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
                  style={{ border: "1px solid #0493CE" }}
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
