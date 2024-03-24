import React from "react";

import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from '../../../../resources/assets/export.png'
import imgimport from '../../../../resources/assets/import.png'
import CreateDealer from "../dealerOverrides/CreateDealer";
import arrowDown from "../../../../resources/assets/arrow-down.png";

const TierLoanFee = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
    const tierloandata = [
        {
            name: "TIER 000001",
            inst:"OWE",
            state: "AZ",
            ftn: "LF-CON-FLEX-20Y-1.49",
            oc:"22.99%",
            be:"00.3%",
            dlr: "25.99%",
            sd: "99/99/99990",
            ed: "99/99/99990",
            delete: (
              <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
            ),
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
          },
          {
            name: "TIER 000001",
            inst:"OWE",
            state: "AZ",
            ftn: "LF-CON-FLEX-20Y-1.49",
            oc:"22.99%",
            be:"00.3%",
            dlr: "25.99%",
            sd: "99/99/99990",
            ed: "99/99/99990",
            delete: (
              <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
            ),
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
          },
          {
            name: "TIER 000001",
            inst:"OWE",
            state: "AZ",
            ftn: "LF-CON-FLEX-20Y-1.49",
            oc:"22.99%",
            be:"00.3%",
            dlr: "25.99%",
            sd: "99/99/99990",
            ed: "99/99/99990",
            delete: (
              <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
            ),
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
          },
          {
            name: "TIER 000001",
            inst:"OWE",
            state: "AZ",
            ftn: "LF-CON-FLEX-20Y-1.49",
            oc:"22.99%",
            be:"00.3%",
            dlr: "25.99%",
            sd: "99/99/99990",
            ed: "99/99/99990",
            delete: (
              <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
            ),
            edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
          },
    ]
  return (
    <div className="comm">
      <div className="commissionContainer">
      <div className='commissionSection'>
    <div className='rateSection'>
      <h2>Tier Loan Fee</h2>
      <p style={{ color: "#667085",fontSize:"14px" }}>You can view and edit these data as per your requirement</p>
    </div>
    <div className="iconContainer">
      <div className='iconsSection'>
        <button type='button'> <RiDeleteBin5Line /> Delete</button>
      </div>
      <div className='iconsSection'>
        <button type='button'>  <MdFilterList /> Filter</button>
      </div>
      <div className='iconsSection2'>
        <button type='button'> <img src={imgimport} alt='' /> Import</button>
      </div>
      <div className='iconsSection2'>c
        <button type='button'> <img src={imgExport} alt='' />Export</button>
      </div>
      <div className='iconsSection2'>

        <button type='button' style={{ background: "black", color: "white" }} onClick={handleOpen}>  <IoAddSharp /> Add New</button>
      </div>
    </div>
           {
            open && (<CreateDealer handleClose={handleClose}  />)
           }
    
  </div>
        <div className="TableContainer">
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
                    <p>Dealer Tier</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Installer</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Finance Type Name</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>OWE Cost</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DLR MU</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DLR Cost</p> <img src={arrowDown} alt="" />
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
              {tierloandata.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "600" }}>{el.name}</td>
                  <td>{el.inst}</td>
                  <td>{el.state}</td>
                  <td>{el.ftn}</td>
                  <td>{el.oc}</td>
                  <td>{el.be}</td>
                  <td>{el.dlr}</td>
                  <td>{el.sd}</td>
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

export default TierLoanFee;
