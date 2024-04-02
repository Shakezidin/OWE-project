import React from 'react'
import CheckBox from '../../../components/chekbox/CheckBox'
import { ICONS } from '../../../icons/Icons'
import { CiEdit } from "react-icons/ci";
import UserHeaderSection from '../UserHeader/UserHeaderSection';

const SalesManagerTable = () => {
    const dataUser = [
        {
          code: "323223",
          name: "Voltaic Power LLC",
          role: "Regional Manager",
          dealer:"Regional Manager",
          reporting:"hanery",
          email: "hanery@gmail.com",
          pn: "123456789",
          des: "Implementing solar system commission"
        },
        {
            code: "323223",
            name: "Voltaic Power LLC",
            role: "Regional Manager",
            dealer:"Regional Manager",
            reporting:"hanery",
            email: "hanery@gmail.com",
            pn: "123456789",
            des: "Implementing solar system commission"
          },
          {
            code: "323223",
            name: "Voltaic Power LLC",
            role: "Regional Manager",
            dealer:"Regional Manager",
            reporting:"hanery",
            email: "hanery@gmail.com",
            pn: "123456789",
            des: "Implementing solar system commission"
          },
      ];
    return (
<>
<UserHeaderSection  name="Sale Manager"/>
        <div
            className="TableContainer"
            style={{ overflowX: "auto", whiteSpace: "nowrap" }} >
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
                                <p>Code</p> <img src={ICONS.DOWN_ARROW} alt="" />
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Name</p> <img src={ICONS.DOWN_ARROW} alt="" />
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Role</p> <img src={ICONS.DOWN_ARROW} alt="" />
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Dealer Owner</p> <img src={ICONS.DOWN_ARROW} alt="" />
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Repoting To</p> <img src={ICONS.DOWN_ARROW} alt="" />
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Email ID</p> <img src={ICONS.DOWN_ARROW} alt="" />
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Phone Number</p> <img src={ICONS.DOWN_ARROW} alt="" />
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Description</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
                    {dataUser?.length > 0 ? dataUser?.map((el, i) => (   
                     <tr key={i}>
                                <td>
                                    <CheckBox
                                        checked={true}
                                        onChange={() => { }
                                        }
                                    // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                                    />
                                </td>
                                <td style={{ fontWeight: "500", color: "black" }}>{el.code}</td>
                                <td>{el.name}</td>
                                <td>{el.role}</td>
                                <td>{el.dealer}</td>
                                <td>{el.reporting}</td>
                                <td>{el.email}</td>
                                <td>{el.pn}</td>
                                <td>{el.des}</td>
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
    )
}

export default SalesManagerTable