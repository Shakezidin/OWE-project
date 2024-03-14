import React from 'react'
import { RiDeleteBin5Line } from "react-icons/ri";

import arrowDown from '../../../../resources/assets/arrow-down.png'
import '../configure.css'
import { CiEdit } from "react-icons/ci";

import TableHeaderLayout from '../../../components/tableHeader/TableHeaderLayout';
const CommissionRate: React.FC = () => {

  const DealerOverData = [
    {
      united: "United Wholesales",
      Markting: "Markting",
      dollar: "$10",
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
                    Partner
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Installer
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    State
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    State Type
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Sale Price
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Rep Type 
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Rate List 
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    Action
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>

              </tr>
            </thead>
            <tbody >
              {
                DealerOverData.map((el, i) => (
                  <tr key={i}>
                    <td ><input value="test" type="checkbox" className='check-box' /></td>
                    <td style={{ fontWeight: "600" }}>{el.united}</td>
                    <td>{el.Markting}</td>
                    <td>{el.dollar}</td>
                    <td>{el.startDate}</td>
                    <td>{el.endDate}</td>
                    <td>{el.endDate}</td>
                    <td>{el.endDate}</td>
                    {/* <td>{el.endDate}</td> */}
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

export default CommissionRate