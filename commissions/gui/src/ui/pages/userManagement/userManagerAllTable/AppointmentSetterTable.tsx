import React from "react";
import { ICONS } from "../../../icons/Icons";
import CheckBox from "../../../components/chekbox/CheckBox";
import "../../configure/configure.css";
import { FaArrowDown } from "react-icons/fa6";
import { UserRoleBasedListModel } from "../../../../core/models/api_models/UserManagementModel";

interface AppointmentSetterProps {
  data: UserRoleBasedListModel[];
  onClickEdit: (item: UserRoleBasedListModel)=> void;
  onClickDelete: (item: UserRoleBasedListModel)=> void;
}

const AppointmentSetterTable: React.FC<AppointmentSetterProps> = ({ data, onClickDelete, onClickEdit }) => {
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
              <th style={{paddingRight:0}}>
                <div>
                  <CheckBox
                    checked={true}
                    onChange={() => {}}
                    // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                  />
                </div>
              </th>

              <th style={{paddingLeft:"10px"}}>
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
            {data?.length > 0
              ? data.map((el: UserRoleBasedListModel) => (
                  <tr key={el.email_id}>
                    <td style={{paddingRight:0}}>
                      <CheckBox
                        checked={true}
                        onChange={() => {}}
                        // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                      />
                    </td>
                    <td
                      style={{
                        fontWeight: "500",
                        color:"black",
                      paddingLeft:"10px"
                      }}
                    >
                      {el.name}
                    </td>
                    <td style={{ color: "var( --fade-gray-black)" }}>
                      {el.startData}
                    </td>
                    <td style={{ color: "var( --fade-gray-black)" }}>
                      {el.endDate}
                    </td>
                    <td style={{ color: "var( --fade-gray-black)" }}>
                      {el.amount}
                    </td>
                    <td>{el.description}</td>

                    <td>
                      <div className="action-icon">
                        <div className="" style={{ cursor: "pointer" }} onClick={()=> onClickDelete(el)}>
                          <img src={ICONS.deleteIcon} alt="" />
                        </div>
                        <div className="" style={{ cursor: "pointer" }} onClick={()=> onClickEdit(el)}>
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
