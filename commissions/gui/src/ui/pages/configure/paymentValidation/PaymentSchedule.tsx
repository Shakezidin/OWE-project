import React from 'react'
import '../configure.css'
import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from '../../../../resources/assets/export.png'
import imgimport from '../../../../resources/assets/import.png'
import CreateDealer from '../dealerOverrides/CreateDealer';
import { RiDeleteBin5Line } from "react-icons/ri";
import arrowDown from "../../../../resources/assets/arrow-down.png";

const PaymentSchedule = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
    const paymentData = [
        {
          pn: "Gray Horse Group",
          pat: "Concert",
          inst: "OWE",
          saletype:"Loan",
          ST:"AZ",
          rl: "$40.00",
          draw: "50%",
          dm:"$2000.00",
          rw:"$2000.00",
          rmw:"$2000.00",
          rp:"$2000.00"
    
        },
        {
            pn: "Gray Horse Group",
            pat: "Concert",
            inst: "OWE",
            saletype:"Loan",
            ST:"AZ",
            rl: "$40.00",
            draw: "50%",
            dm:"$2000.00",
            rw:"$2000.00",
            rmw:"$2000.00",
            rp:"$2000.00"
      
          },
          {
            pn: "Gray Horse Group",
            pat: "Concert",
            inst: "OWE",
            saletype:"Loan",
            ST:"AZ",
            rl: "$40.00",
            draw: "50%",
            dm:"$2000.00",
            rw:"$2000.00",
            rmw:"$2000.00",
            rp:"$2000.00"
      
          },
          {
            pn: "Gray Horse Group",
            pat: "Concert",
            inst: "OWE",
            saletype:"Loan",
            ST:"AZ",
            rl: "$40.00",
            draw: "50%",
            dm:"$2000.00",
            rw:"$2000.00",
            rmw:"$2000.00",
            rp:"$2000.00"
      
          },
        
      ]

  return (
    <>
<div className='comm'>
      <div className='commissionContainer'>
      <div className='commissionSection'>
    <div className='rateSection'>
      <h2>Payment Schedule</h2>
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
      <div className='iconsSection2'>
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

              </tr>
            </thead>
            <tbody >
              {
                paymentData.map((el, i) => (
                  <tr key={i}>
                    <td ><input value="test" type="checkbox" className='check-box' /></td>
                    <td style={{ fontWeight: "600" }}>{el.pn}</td>
                    <td>{el.pat}</td>
                    <td>{el.inst}</td>
                    <td>{el.saletype}</td>
                    <td>{el.ST}</td>
                    <td>{el.rl}</td>
                    <td>{el.draw}</td>
                    <td>{el.dm}</td>
                
                   
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

export default PaymentSchedule