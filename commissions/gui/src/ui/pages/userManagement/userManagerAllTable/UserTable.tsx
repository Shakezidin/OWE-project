import React from "react";
import CheckBox from "../../../components/chekbox/CheckBox";
import { ICONS } from "../../../icons/Icons";
import { FaArrowDown } from "react-icons/fa6";
import { UserRoleBasedListModel } from "../../../../core/models/api_models/UserManagementModel";

interface UserTableProps {
  data: UserRoleBasedListModel[];
}
const UserTable: React.FC<UserTableProps> = ({data}) => {

  return (
    <div
      className="UserManageTable"
      style={{ overflowX: "auto", whiteSpace: "nowrap" }}
    >
      <table>
        <thead>
          <tr style={{ backgroundColor: "#F5F5F5" }}>
            <th style={{paddingRight:0}}>
              <div>
                <CheckBox
                  checked={false}
                  onChange={() => {}}
                  // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                />
              </div>
            </th>
            <th style={{paddingLeft:"10px"}}>
              <div className="table-header">
                <p>Code</p> <FaArrowDown style={{ color: "#667085" }} />
              </div>
            </th>
            <th>
              <div className="table-header">
                <p>Name</p> <FaArrowDown style={{ color: "#667085" }} />
              </div>
            </th>
            <th>
              <div className="table-header">
                <p>Role</p> <FaArrowDown style={{ color: "#667085" }} />
              </div>
            </th>

            <th>
              <div className="table-header">
                <p>Reporting To</p> <FaArrowDown style={{ color: "#667085" }} />
              </div>
            </th>
            <th>
              <div className="table-header">
                <p>Email ID</p> <FaArrowDown style={{ color: "#667085" }} />
              </div>
            </th>
            <th>
              <div className="table-header">
                <p>Phone Number</p> <FaArrowDown style={{ color: "#667085" }} />
              </div>
            </th>
            <th>
              <div className="table-header">
                <p>Description</p> <FaArrowDown style={{ color: "#667085" }} />
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
            ? data?.map((el: UserRoleBasedListModel, i: number) => (
                <tr key={el.email_id}>
                  <td style={{paddingRight:0}}>
                    <CheckBox
                      checked={false}
                      onChange={() => {}}
                      // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </td>
                  <td style={{ color:"black",fontWeight:"500",paddingLeft:"10px" }}>
                    {el.user_code}
                  </td>
                  <td >
                    {el.name}
                  </td>
                  <td>
                    {el.role_name}
                  </td>
                  <td >
                    {el.reporting_manager}
                  </td>
                  <td >
                    {el.email_id}
                  </td>
                  <td >{el.mobile_number}</td>
                  <td>{el.description}</td>
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
  );
};

export default UserTable;
