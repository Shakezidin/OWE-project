import React from "react";
import "../configure.css";
import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from "../../../../resources/assets/export.png";
import imgimport from "../../../../resources/assets/import.png";
import CreateDealer from "../dealerOverrides/CreateDealer";
import { RiDeleteBin5Line } from "react-icons/ri";
import arrowDown from "../../../../resources/assets/arrow-down.png";
import { CiEdit } from "react-icons/ci";

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
    <>
      <div className="comm">
        <div className="commissionContainer">
          <div className="commissionSection">
            <div className="rateSection">
              <h2>Payment Schedule</h2>
              <p style={{ color: "#667085", fontSize: "14px" }}>
                You can view and edit these data as per your requirement
              </p>
            </div>
            <div className="iconContainer">
    <div className='iconsSection2'>
        <button type='button'> <img src={imgExport} alt='' />View Archive</button>
      </div>
      <div className='iconsSection-filter'>
        <button type='button'> <img src={imgExport} alt='' /></button>
      </div>
      <div className='iconsSection2'>
        <button type='button'> <img src={imgExport} alt='' />Archive</button>
      </div>
      <div className='iconsSection2'>
        <button type='button'> <img src={imgimport} alt='' /> Import</button>
      </div>
      <div className='iconsSection2'>
        <button type='button'> <img src={imgExport} alt='' />Export</button>
      </div>
      <div className='iconsSection2'>
        <button type='button' style={{ background: "black", color: "white",border:"1px solid black" }} onClick={handleOpen}>  <IoAddSharp /> Add New</button>
      </div>
    </div>

            {open && <CreateDealer handleClose={handleClose} />}
          </div>
          <div className="TableContainer" style={{overflowX:"auto",whiteSpace:"nowrap"}}>
            <table>
              <thead>
                <tr>
                  <th>
                    <div>
                      <input
                        value="test"
                        type="checkbox"
                        className="check-box"
                      />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Partner Name</p> <img src={arrowDown} alt="" />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Partner</p> <img src={arrowDown} alt="" />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Installer</p> <img src={arrowDown} alt="" />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Sale Type</p> <img src={arrowDown} alt="" />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>ST</p> <img src={arrowDown} alt="" />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Rate List</p> <img src={arrowDown} alt="" />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Draw %</p> <img src={arrowDown} alt="" />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Draw Max</p> <img src={arrowDown} alt="" />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Rep Draw %</p> <img src={arrowDown} alt="" />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Rep Max Draw %</p> <img src={arrowDown} alt="" />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Rep Pay</p> <img src={arrowDown} alt="" />
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
              <tbody>
                {paymentData.map((el, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        value="test"
                        type="checkbox"
                        className="check-box"
                      />
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
    </>
  );
};

export default PaymentSchedule;
