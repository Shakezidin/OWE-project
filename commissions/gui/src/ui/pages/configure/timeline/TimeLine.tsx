import React from 'react'
import TableHeaderLayout from '../../../components/tableHeader/TableHeaderLayout'
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import arrowDown from '../../../../resources/assets/arrow-down.png'

const TimeLine = () => {
    const timeLineData = [
        {
            m2m: "TIER 000001",
            state: "AZ",
           days:"5",
            startDate: "10/10/1000",
            endDate: "99/99/99990",
            delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
    },
    {
        m2m: "TIER 000001",
        state: "AZ",
       days:"5",
        startDate: "10/10/1000",
        endDate: "99/99/99990",
        delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
        edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
},
{
    m2m: "TIER 000001",
    state: "AZ",
   days:"5",
    startDate: "10/10/1000",
    endDate: "99/99/99990",
    delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
    edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
},
{
    m2m: "TIER 000001",
    state: "AZ",
   days:"5",
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
                  TYPE / M2M
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
                 Days
                  <div className="">
                  <img src={arrowDown} alt="" className='' />
                  </div>
                </div>
              </th>
              <th>
                <div className="table-header">
                 Start Date
                  <div className="">
                  <img src={arrowDown} alt="" className='' />
                  </div>
                </div>
              </th>
              <th>
                <div className="table-header">
                 End Date
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
              timeLineData.map((el, i) => (
                <tr key={i}>
                  <td ><input value="test" type="checkbox" className='check-box' /></td>
                  <td style={{ fontWeight: "600" }}>{el.m2m}</td>
                  <td>{el.state}</td>
                  <td>{el.days}</td>
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

export default TimeLine