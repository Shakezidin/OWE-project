import React, { useEffect } from "react";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import { ICONS } from "../../../icons/Icons";
import { FaArrowDown } from "react-icons/fa6";
import CheckBox from "../../../components/chekbox/CheckBox";
import { ActionButton } from "../../../components/button/ActionButton";
interface ButtonProps {
  setSelectTable: React.Dispatch<React.SetStateAction<boolean>>;
  setTablePermissions: React.Dispatch<React.SetStateAction<any>>;
  tablePermissions: any;
  selected:Set<number>,
  setSelected:React.Dispatch<React.SetStateAction<Set<number>>>,
}
const SelectTable: React.FC<ButtonProps> = ({
  setSelectTable,
  setTablePermissions,
  tablePermissions,
  setSelected,
  selected
}) => {


  function handleOptionChange(type: string, table: string,ind:number) {
    if (selected.has(ind)) {    
      setTablePermissions((permissions: any) => {
        return {
          ...permissions,
          [table]: type,
        };
      });
    }
  }
  const tables = [
    "internal_ops_metrics_schema",
    "finance_metrics_schema",
    "sales_metrics_schema",
    "field_ops_metrics_schema",
  ];


  return (
    <>
      <div className="transparent-model">
        <div className="modal">
          <div
            className="createUserCrossButton"
            onClick={() => {
              setSelectTable(false);
              // setSelected(new Set())
              // setTablePermissions({})
            }}
          >
            <CROSS_BUTTON />
          </div>
          <div className="selectTable-section">
            <img src={ICONS.leftArrow} alt="" />
            <p> Section Table</p>
          </div>

          <div
            className="TableContainer"
            style={{ overflowX: "auto", whiteSpace: "nowrap" }}
          >
            <table>
              <thead>
                <tr>

                <th>
                    <div>
                      <CheckBox
                        checked={tables.length === selected.size}
                        onChange={() => {
                          const set = new Set(Array.from(selected));
                          if (set.size === tables.length) {
                            set.clear();
                            setSelected(set);
                            setTablePermissions({})
                          } else {
                            const newSet = new Set(
                              Array.from(Array(tables.length).keys())
                            );
                            setSelected(newSet);
                          }
                        }}
                       
                      />
                    </div>
                  </th>
                 
                  <th>
                    <div className="table-header">
                      <p>Table Name</p>
                      <FaArrowDown style={{ color: "#667085" }} />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>View</p> <FaArrowDown style={{ color: "#667085" }} />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Edit</p> <FaArrowDown style={{ color: "#667085" }} />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Full</p> <FaArrowDown style={{ color: "#667085" }} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table, ind) => (
                  <tr>
                     <td>
                      <div>
                        <CheckBox
                          checked={selected.has(ind)}
                          onChange={() => {
                            const set = new Set(Array.from(selected));
                            if (set.has(ind)) {
                              set.delete(ind);
                              const permissons = {...tablePermissions}
                              if (table in permissons) {
                                delete permissons[table]
                                setTablePermissions(permissons) 
                              }
                            } else {
                              set.add(ind);
                            }
                            setSelected(set);
                          }}
                        />
                      </div>
                    </td>
                   
                    <td style={{ fontWeight: "500", color: "black" }}>
                      {table}
                    </td>
                    <td>
                      <div className="radio-container">
                        <div className="radio-content">
                          <input
                            type="radio"
                            className="user-radio"
                            name={table}
                            disabled={!selected.has(ind)}
                            id={table}
                            checked={tablePermissions[table] === "View"}
                            onChange={(e) => handleOptionChange("View", table,ind)}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="radio-container">
                        <div className="radio-content">
                          <input
                            type="radio"
                            className="user-radio"
                            name={table}
                            disabled={!selected.has(ind)}
                            id={table}
                            checked={tablePermissions[table] === "Edit"}
                            onChange={(e) => handleOptionChange("Edit", table,ind)}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="radio-container">
                        <div className="radio-content">
                          <input
                            type="radio"
                            className="user-radio"
                            name={table}
                            disabled={!selected.has(ind)}
                            id={table}
                            // value={"1"}
                            checked={tablePermissions[table] === "Full"}
                            onChange={(e) => handleOptionChange("Full", table,ind)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{display:"flex",justifyContent:"center",marginTop:"3rem"}}>

<ActionButton  type="submit" title="Done" onClick={()=>setSelectTable(false)}/>
  </div>
          </div>
           
          
        </div>
      </div>
    </>
  );
};

export default SelectTable;
