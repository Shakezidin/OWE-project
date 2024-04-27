import React, { useState } from "react";
import "../../userManagement/user.css";
import { ICONS } from "../../../icons/Icons";
import CheckBox from "../../../components/chekbox/CheckBox";
import "../../configure/configure.css";
import { FaArrowDown } from "react-icons/fa6";
import { UserRoleBasedListModel } from "../../../../core/models/api_models/UserManagementModel";
import { UserPatternTableColumn } from "../../../../resources/static_data/UserManagementColumn";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { toggleRowSelection } from "../../../components/chekbox/checkHelper";

interface PartnerProps {
  data: UserRoleBasedListModel[];
  onClickEdit: (item: UserRoleBasedListModel)=> void;
  onClickDelete: (item: UserRoleBasedListModel)=> void;
  selectAllChecked: boolean;
  selectedRows: Set<number>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  setSelectAllChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const PartnerTable: React.FC<PartnerProps>= ({data, onClickDelete,onClickEdit, selectAllChecked,
  selectedRows,
  setSelectedRows,
  setSelectAllChecked,}) => {

    const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const isAnyRowSelected = selectedRows?.size > 0;
  const isAllRowsSelected = selectedRows?.size === data?.length;

  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  if (sortKey) {
    data?.sort((a: any, b: any) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        // Ensure numeric values for arithmetic operations
        const numericAValue =
          typeof aValue === "number" ? aValue : parseFloat(aValue);
        const numericBValue =
          typeof bValue === "number" ? bValue : parseFloat(bValue);
        return sortDirection === "asc"
          ? numericAValue - numericBValue
          : numericBValue - numericAValue;
      }
    });
  }

 
  return (
    <>
      {/* <UserHeaderSection name="Partner" /> */}
      <div
        className="UserManageTable"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        <table>
        <thead>
          <tr style={{ backgroundColor: "#F5F5F5" }}>
            {UserPatternTableColumn.map((item, key) => (
              <SortableHeader
                key={key}
                isCheckbox={item.isCheckbox}
                titleName={item.displayName}
                data={data}
                isAllRowsSelected={isAllRowsSelected}
                isAnyRowSelected={isAnyRowSelected}
                selectAllChecked={selectAllChecked}
                setSelectAllChecked={setSelectAllChecked}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                sortKey={item.name}
                sortDirection={"desc"}
                onClick={() => {}}
              />
            ))}
            <th>
              <div className="action-header">
                <p>Action</p>
              </div>
            </th>
          </tr>
        </thead>

          <tbody>
            {data?.length > 0
              ? data.map((el: UserRoleBasedListModel, i: number) => (
                  <tr key={el.email_id}>
                   <td>
                    <div className="flex-check">
                      <CheckBox
                        checked={selectedRows.has(i)}
                        onChange={() => {
                          // If there's only one row of data and the user clicks its checkbox, select all rows
                          if (data?.length === 1) {
                            setSelectAllChecked(true);
                            setSelectedRows(new Set([0]));
                          } else {
                            toggleRowSelection(
                              i,
                              selectedRows,
                              setSelectedRows,
                              setSelectAllChecked
                            );
                          }
                        }}
                      />
                      {el.user_code}
                    </div>
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
