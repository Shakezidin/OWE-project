import React from "react";
import CheckBox from "../../../components/chekbox/CheckBox";
import { ICONS } from "../../../icons/Icons";
import { FaArrowDown } from "react-icons/fa6";
import {  UserRoleBasedListModel } from "../../../../core/models/api_models/UserManagementModel";
import { toggleRowSelection } from "../../../components/chekbox/checkHelper";

interface UserTableProps {
  data: UserRoleBasedListModel[];
  onClickEdit: (item: UserRoleBasedListModel)=> void;
  onClickDelete: (item: UserRoleBasedListModel)=> void;

  selectAllChecked: boolean,
  selectedRows: Set<number>,
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>,
  setSelectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
}
const UserTable: React.FC<UserTableProps> = ({data, onClickDelete, onClickEdit,  selectAllChecked,
  selectedRows,
  setSelectedRows,
  setSelectAllChecked}) => {

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
                   checked={selectedRows.has(i)}
                   onChange={() => {
                     // If there's only one row of data and the user clicks its checkbox, select all rows
                     toggleRowSelection(
                      i,
                      selectedRows,
                      setSelectedRows,
                      setSelectAllChecked
                    );
                    //  if (data?.length === 1) {
                    //    setSelectAllChecked(true);
                    //    setSelectedRows(new Set([0]));
                    //  } else {
                       
                    //  }
                   }}
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
                      <div className="" style={{ cursor: "pointer" }} onClick={()=> {
                        onClickDelete(el)
                      }}>
                        <img src={ICONS.deleteIcon} alt="" />
                      </div>
                      <div className="" style={{ cursor: "pointer" }} onClick={()=> {
                        onClickEdit(el)
                      }}>
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
