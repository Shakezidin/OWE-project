import React from 'react'
import CheckBox from '../../../components/chekbox/CheckBox'
import { ICONS } from '../../../icons/Icons'
import { CiEdit } from "react-icons/ci";
import { FaArrowDown } from 'react-icons/fa6';

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
{/* <UserHeaderSection name="Admin Users"/> */}
        <div
            className="UserManageTable"
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
                                <p>Code</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Name</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Role</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        
                        <th>
                            <div className="table-header">
                                <p>Reporting To</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Email ID</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Phone Number</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Description</p> <FaArrowDown style={{color:"#667085"}}/>
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
                                <td style={{color: "var( --fade-gray-black)"}}>{el.name}</td>
                                <td>{el.role}</td>
                                <td>{el.reporting}</td>
                                <td>{el.email}</td>
                                <td>{el.pn}</td>
                                <td>{el.des}</td>
                                <td>
                                <div className="action-icon">
                        <div className="" style={{ cursor: "pointer" }}>
                          <img src={ICONS.deleteIcon} alt="" />
                        </div>
                        <div className="" style={{ cursor: "pointer" }} >
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
    )
}

export default UserTable