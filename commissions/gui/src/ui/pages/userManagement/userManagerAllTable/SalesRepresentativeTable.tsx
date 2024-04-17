import React from 'react'
import CheckBox from '../../../components/chekbox/CheckBox'
import { ICONS } from '../../../icons/Icons'
import { CiEdit } from "react-icons/ci";
import { FaArrowDown } from 'react-icons/fa6';

const SalesRepresentativeTable = () => {
    const dataUser = [
        {
          code: "323223",
          name: "Voltaic Power LLC",
          role: "Regional Manager",
          dealer:"Regional Manager",
          tm:"New Team 1",
          repoting:"Hanery",
          email: "hanery@gmail.com",
          pn: "123456789",
          des: "Implementing solar system commission"
        },
        {
            code: "323223",
            name: "Voltaic Power LLC",
            role: "Regional Manager",
            dealer:"Regional Manager",
            tm:"New Team 1",
            repoting:"Hanery",
            email: "hanery@gmail.com",
            pn: "123456789",
            des: "Implementing solar system commission"
          },
          {
            code: "323223",
            name: "Voltaic Power LLC",
            role: "Regional Manager",
            dealer:"Regional Manager",
            tm:"New Team 1",
            repoting:"Hanery",
            email: "hanery@gmail.com",
            pn: "123456789",
            des: "Implementing solar system commission"
          },
      ];
    return (
<>
{/* <UserHeaderSection  name="Sales Representative"/> */}
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
                                <p>Dealer Owner</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Team Name</p> <FaArrowDown style={{color:"#667085"}}/>
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
                                <td style={{color: "#5B5B5B"}}>{el.name}</td>
                                <td>{el.role}</td>
                                <td>{el.dealer}</td>
                                <td>{el.tm}</td>
                                <td>{el.repoting}</td>
                                <td>{el.email}</td>
                                <td>{el.pn}</td>
                                <td>{el.des}</td>
                                <td>
                                <div className="action-icon">
                        <div className="" style={{ cursor: "pointer" }}>
                          <img src={ICONS.ARCHIVE} alt="" />
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

export default SalesRepresentativeTable