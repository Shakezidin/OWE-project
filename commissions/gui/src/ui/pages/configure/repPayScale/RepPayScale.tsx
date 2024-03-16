import React from 'react'
import TableHeaderLayout from '../../../components/tableHeader/TableHeaderLayout'
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import arrowDown from '../../../../resources/assets/arrow-down.png'

const RepPayScale:React.FC = () => {
    const reppayData = [
        {
          Zach: "Zach Rogers",
          az: "AZ",
          rep: "REP 80/20",
          adj:"ADJ-000",
          be:"--",
          startDate: "10/10/1000",
          endDate: "99/99/99990",
          delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
          edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
    
        },
        {
            Zach: "Zach Rogers",
            az: "AZ",
            rep: "REP 80/20",
            adj:"ADJ-000",
            be:"--",
            startDate: "10/10/1000",
            endDate: "99/99/99990",
            delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
      
          },
          {
            Zach: "Zach Rogers",
            az: "AZ",
            rep: "REP 80/20",
            adj:"ADJ-000",
            be:"--",
            startDate: "10/10/1000",
            endDate: "99/99/99990",
            delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
      
          },
          {
            Zach: "Zach Rogers",
            az: "AZ",
            rep: "REP 80/20",
            adj:"ADJ-000",
            be:"--",
            startDate: "10/10/1000",
            endDate: "99/99/99990",
            delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
      
          },
     
      ]
  return (
   <>
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
                    <p>Name</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Pay Scale</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Position</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>BE</p> <img src={arrowDown} alt="" />
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
                reppayData.map((el, i) => (
                  <tr key={i}>
                    <td ><input value="test" type="checkbox" className='check-box' /></td>
                    <td style={{ fontWeight: "600" }}>{el.Zach}</td>
                    <td>{el.az}</td>
                    <td>{el.rep}</td>
                    <td>{el.adj}</td>
                    <td>{el.be}</td>
                    <td>{el.startDate}</td>
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
</>
  )
}

export default RepPayScale
