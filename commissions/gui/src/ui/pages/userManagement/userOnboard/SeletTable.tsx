import React from "react";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import { UserAdmin } from "../../../../core/models/UserManagement/UserAdmin";
import { ICONS } from "../../../icons/Icons";
import CheckBox from "../../../components/chekbox/CheckBox";
import { FaArrowDown } from "react-icons/fa6";


interface ButtonProps {
    editMode: boolean;
    handleClose: () => void;
    userOnboard: UserAdmin | null;
}
const SelectTable: React.FC<ButtonProps> = ({
    handleClose,
    userOnboard,
    editMode,
}) => {
    // const [circleStates, setCircleStates] = useState(Array(1).fill(Array(1).fill(false)));

    // const toggleCircle = (rowIndex, colIndex) => {
    //     const newCircleStates = [...circleStates];
    //     newCircleStates[rowIndex][colIndex] = !circleStates[rowIndex][colIndex];
    //     setCircleStates(newCircleStates);
    //   };
    return (
        <>
            <div className="transparent-model">
                <div className="modal">
                    <div className="createUserCrossButton" onClick={handleClose}>
                        <CROSS_BUTTON />
                    </div>
                    <div className="selectTable-section">
                        <img src={ICONS.leftArrow} alt="" />
                        <p> Section Table</p>
                    </div>

                    <div
                        className="TableContainer"
                        style={{ overflowX: "auto", whiteSpace: "nowrap" }}  >
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <div>
                                            <CheckBox
                                                checked={true}
                                                onChange={() => { }}
                                            // indeterminate={isAnyRowSelected && !isAllRowsSelected}
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
                                <tr>
                                    <td>
                                    <div>
                                            <CheckBox
                                                checked={true}
                                                onChange={() => { }}
                                            // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                                            />
                                        </div>
                                    </td>
                                    <td style={{fontWeight:"500", color:"black"}}>Table 1</td>
                                    <td >
                                    <div className="radio-container">
                                            <div className="radio-content">
                                                <input
                                                    type="radio"
                                                    className="radio"
                                                    name="active"
                                                    // value={"1"}
                                                    // checked={createLoanTypeData.active === 1}
                                                    // onChange={handleOptionChange}
                                                />
                                                
                                            </div>
                                            {/* <div className="radio-content">
                                                <input
                                                    type="radio"
                                                    name="active"
                                                    className="radio"
                                                    // value={"0"}
                                                    // checked={createLoanTypeData.active === 0}
                                                    // onChange={(e) => handleOptionChange(e)}
                                                />
                                                
                                            </div> */}

                                        </div>
                                    </td>
                                    <td >
                                    <div className="radio-container">
                                            <div className="radio-content">
                                                <input
                                                    type="radio"
                                                    className="radio"
                                                    name="active"
                                                    // value={"1"}
                                                    // checked={createLoanTypeData.active === 1}
                                                    // onChange={handleOptionChange}
                                                />
                                                
                                            </div>
                                            {/* <div className="radio-content">
                                                <input
                                                    type="radio"
                                                    name="active"
                                                    className="radio"
                                                    // value={"0"}
                                                    // checked={createLoanTypeData.active === 0}
                                                    // onChange={(e) => handleOptionChange(e)}
                                                />
                                                
                                            </div> */}

                                        </div>
                                    </td>
                                    <td >
                                    <div className="radio-container">
                                            <div className="radio-content">
                                                <input
                                                    type="radio"
                                                    className="radio"
                                                    name="active"
                                                    // value={"1"}
                                                    // checked={createLoanTypeData.active === 1}
                                                    // onChange={handleOptionChange}
                                                />
                                                
                                            </div>
                                            {/* <div className="radio-content">
                                                <input
                                                    type="radio"
                                                    name="active"
                                                    className="radio"
                                                    // value={"0"}
                                                    // checked={createLoanTypeData.active === 0}
                                                    // onChange={(e) => handleOptionChange(e)}
                                                />
                                                
                                            </div> */}

                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                       
                    </div>
                   
                </div>
            </div>
        </>
    );
};

export default SelectTable;