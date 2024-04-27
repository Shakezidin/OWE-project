import React from "react";
import CheckBox from "../../../components/chekbox/CheckBox";
import { ICONS } from "../../../icons/Icons";
import { FaArrowDown } from "react-icons/fa6";
import { UserRoleBasedListModel } from "../../../../core/models/api_models/UserManagementModel";

interface SalesRepresentativeProps {
  data: UserRoleBasedListModel[];
  onClickEdit: (item: UserRoleBasedListModel)=> void;
  onClickDelete: (item: UserRoleBasedListModel)=> void;
}

const SalesRepresentativeTable: React.FC<SalesRepresentativeProps> = ({
  data, onClickEdit, onClickDelete
}) => {
  console.log(data)
  return (
    <>
      {/* <UserHeaderSection  name="Sales Representative"/> */}
      <div
        className="UserManageTable"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        <table>
          <thead>
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
                  <p>Dealer Owner</p>{" "}
                  <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Team Name</p> <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Reporting To</p>{" "}
                  <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Email ID</p> <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Phone Number</p>{" "}
                  <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Description</p>{" "}
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
              ? data?.map((el: UserRoleBasedListModel) => (
                  <tr key={el.email_id}>
                    <td style={{paddingRight:0}}>
                      <CheckBox
                        checked={true}
                        onChange={() => {}}
                        // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                      />
                    </td>
                    <td style={{ color: "black",paddingLeft:"10px",fontWeight:"500" }}>
                      {el.user_code}
                    </td>
                    <td >
                      {el.name}
                    </td>
                    <td>
                      {el.role_name}
                    </td>
                    <td >
                      {el.dealer_owner}
                    </td>
                    <td>
                      {el.designation}
                    </td>
                    <td >
                      {el.reporting_manager}
                    </td>
                    <td>
                      {el.email_id}
                    </td>
                    <td>
                      {el.mobile_number}
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

export default SalesRepresentativeTable;
