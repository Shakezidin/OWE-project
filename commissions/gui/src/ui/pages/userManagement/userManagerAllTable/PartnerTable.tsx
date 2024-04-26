import React from "react";
import "../../userManagement/user.css";
import { ICONS } from "../../../icons/Icons";
import CheckBox from "../../../components/chekbox/CheckBox";
import "../../configure/configure.css";
import { FaArrowDown } from "react-icons/fa6";
import { UserRoleBasedListModel } from "../../../../core/models/api_models/UserManagementModel";

interface PartnerProps {
  data: UserRoleBasedListModel[];
  onClickEdit: (item: UserRoleBasedListModel)=> void;
  onClickDelete: (item: UserRoleBasedListModel)=> void;
}

const PartnerTable: React.FC<PartnerProps>= ({data, onClickDelete,onClickEdit}) => {
 
  return (
    <>
      {/* <UserHeaderSection name="Partner" /> */}
      <div
        className="UserManageTable"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        <table>
          <thead >
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
                  <p>Details</p> <FaArrowDown style={{ color: "#667085" }} />
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
                    <td style={{ color:"black",paddingLeft:"10px" ,fontWeight:"500"}}>
                      {el.name}
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

export default PartnerTable;
