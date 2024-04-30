import React, { useEffect, useState } from "react";
import "./dasboard.css";
import Select from "react-select";
import DashboardTotal from "./DashboardTotal";
import { ICONS } from "../../icons/Icons";
import DashBoardTable from "./DashBoardTable";
import DashBoardChart from "./DashBoardChart";
import { payRollData } from "../../../resources/static_data/StaticData";
import { comissionValueData } from "../../../resources/static_data/StaticData";
import FilterModal from "../../components/FilterModal/FilterModal";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";
import { DateRangePicker, FocusedInputShape } from "react-dates";
import { useAppDispatch } from "../../../redux/hooks";
import { logout } from "../../../redux/apiSlice/authSlice/authSlice";

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

export const DashboardPage: React.FC = () => {
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

  const dispatch = useAppDispatch()

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

  /** temp solution for session logout */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');

    if (token && expirationTime) {
      const currentTime = Date.now();
      if (currentTime < parseInt(expirationTime, 10)) {
        // Token is still valid
        // Schedule logout after 480 minutes
        const timeout = setTimeout(() => {
         dispatch(logout())
        }, 480 * 60 * 1000); // 480 minutes in milliseconds

        return () => clearTimeout(timeout);
      } else {
        // Token has expired
        dispatch(logout())
      }
    }
  }, []);

  return (
    <>
      <div className="Dashboard-section-container">
        <div className="DashboardPage-container">
          {/* <div className="DashboardPage-wel">
            <h3>Dashboard</h3>
          </div> */}
          <div className="dashboard-payroll">
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
                    cursor: "pointer"
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
                  }),
                }}
              />
            </div>
            <div className="dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Payroll Date
              </label>
              {/* <label className="payroll-label">Start:</label>
              <input type="date" className="payroll-date" />
              <label className="payroll-label">End:</label>
              <input type="date" className="payroll-date" /> */}
              <div className="date-picker">
                <DateRangePicker
                  startDate={startDate}
                  startDateId="s_id"
                  endDate={endDate}
                  endDateId="e_id"
                  onDatesChange={({ startDate, endDate }) => {
                    setStartDate(startDate);
                    setEndDate(endDate);
                  }}
                  focusedInput={focusedInput}
                  onFocusChange={(focusedInput) => 
                    setFocusedInput(focusedInput)
                  }
                  displayFormat="DD/MM/YYYY"
                  block
                  showClearDates
                  transitionDuration={1000}  
                  withPortal
                  isOutsideRange={() => false}
                />
              </div>
            </div>

            <div className="dash-head-input">
              <label className="inputLabel" style={{ color: "#344054" }}>
                Set Default
              </label>
              <label
                className="inputLabel dashboard-chart-view"
                style={{ color: "#344054" }}
              >
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
                  className={`filter-disable ${
                    active === 1 ? "active-filter-line" : ""
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
                  className="filter-line"
                  onClick={() => setFilterModal(true)}
                >
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
          {active === 0 && <DashBoardTable />}
          {active === 1 && <DashBoardChart />}
        </div>
      </div>
    </>
  );
};
