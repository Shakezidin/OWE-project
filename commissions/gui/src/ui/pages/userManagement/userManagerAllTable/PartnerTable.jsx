import React from "react";
import "../../userManagement/user.css";
import { ICONS } from "../../../icons/Icons";
import { CiEdit } from "react-icons/ci";
import CheckBox from "../../../components/chekbox/CheckBox";
import '../../configure/configure.css'
import UserHeaderSection from "../UserHeader/UserHeaderSection";
// import { installers, partners, respTypeData, statData } from "../../../../../core/models/data_models/SelectDataModel";


const dataUser = [
    {
        name: "ffs",
        det: "Freedom Forever Solar",


    },
    {
        name: "ffs",
        det: "Freedom Forever Solar",


    },
    {
        name: "ffs",
        det: "Freedom Forever Solar",


    },

];

const PartnerTable = () => {
    return (
        <>
            {/* <UserHeaderSection name="Partner" /> */}
            <div
                className="TableContainer"
                style={{ overflowX: "auto", whiteSpace: "nowrap" }}  >
                <table>
                    <thead style={{ background: "#F5F5F5" }}>
                        <tr>
                            <th>
                                <div>
                                    <CheckBox
                                        checked={true}
                                        onChange={() => { }
                                        }
                                    // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                                    />
                                </div>
                            </th>

                            <th>
                                <div className="table-header">
                                    <p>Name</p> <img src={ICONS.DOWN_ARROW} alt="" />
                                </div>
                            </th>
                            <th>
                                <div className="table-header">
                                    <p>Details</p> <img src={ICONS.DOWN_ARROW} alt="" />
                                </div>
                            </th>
                            <th>
                                <div className="table-header">
                                    <p>Action</p> <img src={ICONS.DOWN_ARROW} alt="" />
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {dataUser.length > 0
                            ? dataUser.map((el, i) => (
                                <tr key={i}>
                                    <td>
                                        <CheckBox
                                            checked={true}
                                            onChange={() => { }
                                            }
                                        // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                                        />
                                    </td>
                                    <td style={{ fontWeight: "500", color: "black" }}>{el.name}</td>
                                    <td>{el.det}</td>
                                    <td>
                                        <div className="action-icon">
                                            <div className="" style={{ cursor: "pointer" }}>
                                                <img src={ICONS.ARCHIVE} alt="" />
                                            </div>
                                            <div className="" style={{ cursor: "pointer" }}>
                                                <CiEdit
                                                    style={{ fontSize: "1.5rem", color: "#344054" }}
                                                />
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
