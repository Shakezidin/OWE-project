import React from 'react'
import CheckBox from '../../../components/chekbox/CheckBox'
import { ICONS } from '../../../icons/Icons'
import { CiEdit } from "react-icons/ci";
import UserHeaderSection from '../UserHeader/UserHeaderSection';

const UserTable:React.FC= () => {
    const dataUser = [
        {
          code: "323223",
          name: "Voltaic Power LLC",
          role: "Regional Manager",
          reporting: "Hanery",
          email: "hanery@gmail.com",
          pn: "123456789",
          des: "Implementing solar system commission"
        },
        {
          code: "323223",
          name: "Voltaic Power LLC",
          role: "Regional Manager",
          reporting: "Hanery",
          email: "hanery@gmail.com",
          pn: "123456789",
          des: "Implementing solar system commission"
        },
        {
          code: "323223",
          name: "Voltaic Power LLC",
          role: "Regional Manager",
          reporting: "Hanery",
          email: "hanery@gmail.com",
          pn: "123456789",
          des: "Implementing solar system commission"
        },
      ];
    return (
<>
<UserHeaderSection name="Admin Users"/>
        <div
            className="TableContainer"
            style={{ overflowX: "auto", whiteSpace: "nowrap" }} >
            <table>
                <thead > 
                    <tr style={{backgroundColor:"#F5F5F5"}}>
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
                                <p>Reporting To</p> <img src={ICONS.DOWN_ARROW} alt="" />
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

export default UserTable