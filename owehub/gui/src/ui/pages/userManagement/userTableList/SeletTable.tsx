import React, { useState } from "react";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import { ICONS } from "../../../icons/Icons";
import CheckBox from "../../../components/chekbox/CheckBox";
import { FaArrowDown } from "react-icons/fa6";

interface ButtonProps {
  setSelectTable: React.Dispatch<React.SetStateAction<boolean>>;
  setTablePermissions: React.Dispatch<React.SetStateAction<any>>;
  tablePermissions: any;
}
const SelectTable: React.FC<ButtonProps> = ({
  setSelectTable,
  setTablePermissions,
  tablePermissions,
}) => {
  // const [circleStates, setCircleStates] = useState(Array(1).fill(Array(1).fill(false)));
  

  // const toggleCircle = (rowIndex, colIndex) => {
  //     const newCircleStates = [...circleStates];
  //     newCircleStates[rowIndex][colIndex] = !circleStates[rowIndex][colIndex];
  //     setCircleStates(newCircleStates);
  //   };

  function handleOptionChange(type: string, table: string) {
    setTablePermissions((permissions: any) => {
      return {
        ...permissions,
        [table]: type,
      };
    });
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
                            id={table}
                            checked={tablePermissions[table] === "View"}
                            onChange={(e) => handleOptionChange("View", table)}
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
                            id={table}
                            checked={tablePermissions[table] === "Edit"}
                            onChange={(e) => handleOptionChange("Edit", table)}
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
                            id={table}
                            // value={"1"}
                            checked={tablePermissions[table] === "Full"}
                            onChange={(e) => handleOptionChange("Full", table)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectTable;
