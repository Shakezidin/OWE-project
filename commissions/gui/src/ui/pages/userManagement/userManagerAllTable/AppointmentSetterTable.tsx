import React from "react";
import { ICONS } from "../../../icons/Icons";
import CheckBox from "../../../components/chekbox/CheckBox";
import "../../configure/configure.css";
import { FaArrowDown } from "react-icons/fa6";

interface AppointmentSetterProps {
  data: { [key: string]: any }[];
}

const AppointmentSetterTable: React.FC<AppointmentSetterProps> = ({data}) => {

  return (
    <>
      {/* <UserHeaderSection  name="Appointment Setter"/> */}
      <div
        className="UserManageTable"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >

        <table>
          <thead style={{ background: "#F5F5F5" }}>
            <tr>
              <th>
                <div>
                  <CheckBox
                    checked={true}
                    onChange={() => {}}
                    // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                  />
                </div>
              </th>

              <th>
                <div className="table-header">
                  <p>Name</p> <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Start Date</p> <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>End Date</p> <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Pay Rate</p> <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Descriptions</p>{" "}
                  <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>

              <th>
                <div className="action-header">
                  <p>Action</p>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0
              ? data.map((el, i) => (
                  <tr key={i}>
                    <td>
                      <CheckBox
                        checked={true}
                        onChange={() => {}}
                        // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                      />
                    </td>
                    <td
                      style={{
                        fontWeight: "none",
                        color: "var( --fade-gray-black)",
                      }}
                    >
                      {el.name}
                    </td>
                    <td style={{ color: "var( --fade-gray-black)" }}>
                      {el.sd}
                    </td>
                    <td style={{ color: "var( --fade-gray-black)" }}>
                      {el.ed}
                    </td>
                    <td style={{ color: "var( --fade-gray-black)" }}>
                      {el.pay}
                    </td>
                    <td>{el.des}</td>

                    <td>
                      <div className="action-icon">
                        <div className="" style={{ cursor: "pointer" }}>
                          <img src={ICONS.deleteIcon} alt="" />
                        </div>
                        <div className="" style={{ cursor: "pointer" }}>
                          <img src={ICONS.editIcon} alt="" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AppointmentSetterTable;
