import React from 'react'
import { RiDeleteBin5Line } from "react-icons/ri";

import arrowDown from "../../../../resources/assets/arrow-down.png";
import "../configure.css";
import { CiEdit } from "react-icons/ci";
import CreateDealer from "../dealerOverrides/CreateDealer";

import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from "../../../../resources/assets/export.png";
import imgimport from "../../../../resources/assets/import.png";
const DealeronBoarding = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const dealeronBoardingData = [
        {
            united: "Regional Manager",
            dc: "323223",
            name:"Hanery",
            email:"hanery@gmail.com",
            pn:"+1 9393020303",
            dn:"Voltaic Power LLC",

            des: "Implementing solar system commission ",
          
          },
          {
            united: "Regional Manager",
            dc: "323223",
            name:"Hanery",
            email:"hanery@gmail.com",
            pn:"+1 9393020303",
            dn:"Voltaic Power LLC",

            des: "Implementing solar system commission ",
          },
          {
            united: "Regional Manager",
            dc: "323223",
            name:"Hanery",
            email:"hanery@gmail.com",
            pn:"+1 9393020303",
            dn:"Voltaic Power LLC",

            des: "Implementing solar system commission ",
          },
          {
            united: "Regional Manager",
            dc: "323223",
            name:"Hanery",
            email:"hanery@gmail.com",
            pn:"+1 9393020303",
            dn:"Voltaic Power LLC",

            des: "Implementing solar system commission ",
          },
    ]
  return (
    <div className="comm">
    <div className="commissionContainer">
      <div className="commissionSection">
        <div className="rateSection">
          <h2>User Onboarding</h2>
          <p style={{ color: "#667085", fontSize: "14px" }}>
            You can view and edit these data as per your requirement
          </p>
        </div>
        <div className="iconContainer">
          <div className="iconsSection">
            <button type="button">
              {" "}
              <RiDeleteBin5Line /> Delete
            </button>
          </div>
          <div className="iconsSection">
            <button type="button">
              {" "}
              <MdFilterList /> Filter
            </button>
          </div>
          <div className="iconsSection2">
            <button type="button">
              {" "}
              <img src={imgimport} alt="" /> Import
            </button>
          </div>
          <div className="iconsSection2">
            <button type="button">
              {" "}
              <img src={imgExport} alt="" />
              Export
            </button>
          </div>
          <div className="iconsSection2">
            <button
              type="button"
              style={{ background: "black", color: "white" }}
              onClick={handleOpen}
            >
              {" "}
              <IoAddSharp /> Add New
            </button>
          </div>
        </div>

        {open && <CreateDealer handleClose={handleClose} />}
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
                  <p>Designation</p> <img src={arrowDown} alt="" />
                </div>
              </th>
             
              <th>
                <div className="table-header">
                  <p>Dealer Code</p> <img src={arrowDown} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Name</p> <img src={arrowDown} alt="" />
                </div>
              </th>
            
             <th>
                <div className="table-header">
                  <p>Email ID</p> <img src={arrowDown} alt="" />
                </div>
              </th>
                
             <th>
                <div className="table-header">
                  <p>Phone Number</p> <img src={arrowDown} alt="" />
                </div>
              </th>
                
             <th>
                <div className="table-header">
                  <p>Dealer Name</p> <img src={arrowDown} alt="" />
                </div>
              </th>
                
             <th>
                <div className="table-header">
                  <p>Descriptions</p> <img src={arrowDown} alt="" />
                </div>
              </th>


            </tr>
          </thead>
          <tbody>
            {dealeronBoardingData.map((el, i) => (
              <tr key={i}>
                <td>
                  <input value="test" type="checkbox" className="check-box" />
                </td>
                <td style={{ fontWeight: "600" }}>{el.united}</td>
                <td>{el.dc}</td>
                <td>{el.name}</td>
                <td>{el.email}</td>
                <td>{el.pn}</td>
                <td>{el.dc}</td>
                <td>{el.des}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default DealeronBoarding