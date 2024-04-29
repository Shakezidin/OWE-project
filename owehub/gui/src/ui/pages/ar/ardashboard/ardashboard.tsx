import React, { useEffect, useState } from "react";
import "./ardashboard.css";
import Select from "react-select";
import { ICONS } from "../../../icons/Icons";
import { comissionValueData, payRollData } from "../../../../resources/static_data/StaticData";
import DashboardTotal from "../../dashboard/DashboardTotal";
import FilterModal from "../../../components/FilterModal/FilterModal";
import { Column } from "../../../../core/models/data_models/FilterSelectModel";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";
import { DateRangePicker, FocusedInputShape } from "react-dates";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import { ROUTES } from "../../../../routes/routes";
import ArDashBoardTable from "./artable";
import ArDropdownWithCheckboxes from "./Dropdown";

interface DateRangePickerProps {
  startDate: moment.Moment | null;
  startDateId: string;
  endDate: moment.Moment | null;
  endDateId: string;
  onDatesChange: ({
    startDate,
    endDate,
  }: {
    startDate: moment.Moment | null;
    endDate: moment.Moment | null;
  }) => void;
  focusedInput: FocusedInputShape | null;
  onFocusChange: (focusedInput: FocusedInputShape | null) => void;
  displayFormat: string;
  block?: boolean;
  showClearDates?: boolean;
  transitionDuration?: number;
  withPortal?: boolean;
  withFullScreenPortal?: boolean;
}


export const ARDashboardPage: React.FC = () => {
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(null);


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
    { value: "Shaky", label: "AP-DTH" },
    { value: "Cancel", label: "AP-PDA" },
    { value: "QC/Permit/NTP", label: "AP-ADV" },
    { value: "Install", label: "AP-DED" },
    { value: "PTO", label: "ar-COMM" },
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
    <div className="comm">
      <Breadcrumb head="" linkPara="Commission" route={ROUTES.COMMISSION_DASHBOARD} linkparaSecond="AR" />
      <div className="ar-Dashboard-section-container">
        <div className="ar-Dashboard-container">
          <div className="ar-dashboard-payroll">
          <div style={{display:"flex", gap:"10px"}}>
            <div className="ar-dash-head-input" style={{marginLeft: "12px"}}>
              <label className="inputLabel" style={{ color: "#344054" }}>
                Includes
              </label>
              <ArDropdownWithCheckboxes/>
            </div>

            <div className="ar-dash-head-input">
              <label className="inputLabel" style={{ color: "#344054",fontWeight:"400",fontSize:"12px" }}>
                Date Override
              </label>
              <label className="inputLabel" style={{ color: "#344054", fontWeight:"600",fontSize:"12px" }}>
                Today
              </label>
              <input type="date" className="ar-payroll-date"  />
            </div>
          </div>

            <div className="ar-second-container" style={{marginRight:"16px"}}>
              <div className="ar-line-graph">
                <div
                  className={`ar-filter-line ${
                    active === 0 ? "ar-active-filter-line" : ""
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
                    active === 1 ? "ar-active-filter-line" : ""
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
                  className="ar-filter-line"
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
            fetchFunction={() => {}}
          />
        )}
        <div className="" style={{ marginTop: "20px" }}>
          {active === 0 && <ArDashBoardTable/>}
          {active === 1}
        </div>
      </div>
    </div>
    </>
  );
};
