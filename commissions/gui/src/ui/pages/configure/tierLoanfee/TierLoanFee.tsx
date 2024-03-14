import React from "react";
import TableHeaderLayout from "../../../components/tableHeader/TableHeaderLayout";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
const TierLoanFee = () => {
    const tierloandata = [
        {
            name: "Zach Rogers",
            state: "AZ",
            ps: "REP 80/20",
            pos:"ADJ-000",
            be:"--",
            startDate: "10/10/1000",
            endDate: "99/99/99990",
            delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
      
          },
          {
            name: "Zach Rogers",
            state: "AZ",
            ps: "REP 80/20",
            pos:"ADJ-000",
            be:"--",
            startDate: "10/10/1000",
            endDate: "99/99/99990",
            delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
      
          },
          {
            name: "Zach Rogers",
            state: "AZ",
            ps: "REP 80/20",
            pos:"ADJ-000",
            be:"--",
            startDate: "10/10/1000",
            endDate: "99/99/99990",
            delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
      
          },
          {
            name: "Zach Rogers",
            state: "AZ",
            ps: "REP 80/20",
            pos:"ADJ-000",
            be:"--",
            startDate: "10/10/1000",
            endDate: "99/99/99990",
            delete: <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />,
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
      
          },
    ]
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeaderLayout />
        <div className="TableContainer">
          <table>
            <thead>
              <tr>
                <th>
                  <div>
                    <input value="test" type="checkbox" className="check-box" />
                  </div>
                </th>
                <th> Name</th>
                <th>State</th>
                <th>Pay Scale</th>
                <th>Position</th>
                <th>BE</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tierloandata.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "600" }}>{el.name}</td>
                  <td>{el.state}</td>
                  <td>{el.ps}</td>
                  <td>{el.pos}</td>
                  <td>{el.be}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TierLoanFee;
