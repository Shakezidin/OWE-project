import React from "react";
import "../configure.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";

const PaymentSchedule = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const paymentData = [
    {
      pn: "Gray Horse Group",
      pat: "Concert",
      inst: "OWE",
      saletype: "Loan",
      ST: "AZ",
      rl: "$40.00",
      draw: "50%",
      dm: "$2000.00",
      rw: "$2000.00",
      rmw: "$2000.00",
      rp: "No",
      st: "20-4-2004",
      ed: "20-4-2004",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
    {
      pn: "Gray Horse Group",
      pat: "Concert",
      inst: "OWE",
      saletype: "Loan",
      ST: "AZ",
      rl: "$40.00",
      draw: "50%",
      dm: "$2000.00",
      rw: "$2000.00",
      rmw: "$2000.00",
      rp: "No",
      st: "20-4-2004",
      ed: "20-4-2004",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
    {
      pn: "Gray Horse Group",
      pat: "Concert",
      inst: "OWE",
      saletype: "Loan",
      ST: "AZ",
      rl: "$40.00",
      draw: "50%",
      dm: "$2000.00",
      rw: "$2000.00",
      rmw: "$2000.00",
      rp: "No",
      st: "20-4-2004",
      ed: "20-4-2004",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
    {
      pn: "Gray Horse Group",
      pat: "Concert",
      inst: "OWE",
      saletype: "Loan",
      ST: "AZ",
      rl: "$40.00",
      draw: "50%",
      dm: "$2000.00",
      rw: "$2000.00",
      rmw: "$2000.00",
      rp: "No",
      st: "20-4-2004",
      ed: "20-4-2004",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
  ];

  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Payment Schedule"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => {}}
        />
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <div>
                    <input value="test" type="checkbox" className="check-box" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Partner Name</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Partner</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Installer</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sale Type</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>ST</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rate List</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Draw %</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Draw Max</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Draw %</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Max Draw %</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Pay</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Date</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Date</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
              {paymentData.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "600" }}>{el.pn}</td>
                  <td>{el.pat}</td>
                  <td>{el.inst}</td>
                  <td>{el.saletype}</td>
                  <td>{el.ST}</td>
                  <td>{el.rl}</td>
                  <td>{el.draw}</td>
                  <td>{el.dm}</td>
                  <td>{el.rw}</td>
                  <td>{el.rmw}</td>
                  <td>{el.rp}</td>
                  <td>{el.st}</td>
                  <td>{el.ed}</td>
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

export default PaymentSchedule;
