import React from 'react'
import TableHeaderLayout from '../../../components/tableHeader/TableHeaderLayout'
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import arrowDown from '../../../../resources/assets/arrow-down.png'
const DealerTier = () => {
    const dealerTierData = [
        {
            dn: "Voltaic Power",
            tier: "Tier 1",
            startDate: "10/10/1000",
            endDate: "99/99/99990",
            delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
        },
        {
            dn: "Voltaic Power",
            tier: "Tier 1",
            startDate: "10/10/1000",
            endDate: "99/99/99990",
            delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
        },
        {
            dn: "Voltaic Power",
            tier: "Tier 1",
            startDate: "10/10/1000",
            endDate: "99/99/99990",
            delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
        },
        {
            dn: "Voltaic Power",
            tier: "Tier 1",
            startDate: "10/10/1000",
            endDate: "99/99/99990",
            delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
        },
    ]
  return (
    <div className='comm'>
    <div className='commissionContainer'>
      <TableHeaderLayout />
      <div className='TableContainer'>
        <table>
      
          <thead >
            <tr>
              <th>
                <div>
                  <input value="test" type="checkbox" className='check-box' />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Dealer Name</p> <img src={arrowDown} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Tier</p> <img src={arrowDown} alt="" />
                </div>
              </th>
             <th>
                <div className="table-header">
                  <p>Start Date</p> <img src={arrowDown} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>End Date</p> <img src={arrowDown} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Action</p> <img src={arrowDown} alt="" />
                </div>
              </th>

            </tr>
          </thead>
          <tbody >
            {
              dealerTierData.map((el, i) => (
                <tr key={i}>
                  <td ><input value="test" type="checkbox" className='check-box' /></td>
                  <td style={{ fontWeight: "600" }}>{el.dn}</td>
                  <td>{el.tier}</td>
                  <td>{el.startDate}</td>
                  <td>{el.endDate}</td>
                 
                  <td>
                    <div className="action-icon">
                      <div className="" style={{ cursor: "pointer" }}>
                        {el.delete}
                      </div>
                      <div className="" style={{ cursor: "pointer" }}>
                        {el.edit}
                      </div>
                    </div>
                  </td>


                </tr>
              ))
            }

          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default DealerTier