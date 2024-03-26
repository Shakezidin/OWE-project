import React from 'react'
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";
import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from "../../../../resources/assets/export.png";
import imgimport from "../../../../resources/assets/import.png";
import CreateDealer from "../dealerOverrides/CreateDealer";
import { CiEdit } from "react-icons/ci";
import arrowDown from "../../../../resources/assets/arrow-down.png";
const SaleType = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const saleTypeData = [ 
        {
            an: "LEASE 0.0",
            des: "Customer paying OWE Directly ",
            action: "",
        },
        {
            an: "LEASE 0.0",
            des: "Customer paying OWE Directly ",
            action: "",
        },
        {
            an: "LEASE 0.0",
            des: "Customer paying OWE Directly ",
            action: "",
        },
        {
            an: "LEASE 0.0",
            des: "Customer paying OWE Directly ",
            action: "",
        },
    ]
  return (
    <div className="comm">
    <div className="commissionContainer">
      <div className="commissionSection">
        <div className="rateSection">
          <h2>Sale Type</h2>
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
        <thead >
            <tr>
              <th>
                <div>
                  <input value="test" type="checkbox" className='check-box' />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p> Name</p> <img src={arrowDown} alt="" />
                </div>
              </th>
             
              <th>
                <div className="table-header">
                  <p>Description</p> <img src={arrowDown} alt="" />
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
              {saleTypeData.map((el, i) => (
              <tr key={i}>
                <td>
                  <input value="test" type="checkbox" className="check-box" />
                </td>
                <td style={{ fontWeight: "500",color:"black" }}>{el.an}</td>
            
                <td>{el.des}</td>
           

                <td style={{ display: "flex", gap: "1rem" }}>
                  <RiDeleteBin5Line
                    style={{ fontSize: "1.5rem", color: "#344054" }}
                  />
                  <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default SaleType