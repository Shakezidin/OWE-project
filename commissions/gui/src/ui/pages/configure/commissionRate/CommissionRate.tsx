import React from 'react'
import { RiDeleteBin5Line } from "react-icons/ri";
import arrowDown from '../../../../resources/assets/arrow-down.png'
import '../configure.css'
import { CiEdit } from "react-icons/ci";

import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from '../../../../resources/assets/export.png'
import imgimport from '../../../../resources/assets/import.png'
import CreateUserProfile from '../../create_profile/CreateUserProfile';
import CreateCommissionRate from './CreateCommissionRate';
const CommissionRate: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const commissionRateData = [
    {
      pt: "Nova",
      inst: "Plug PV",
      state: "Regular text column",
      st: "Loan Type",
      sp: "$9802",
     rep:"Loan Type",
     rl:"Regular text column"

    },
    {
      pt: "Nova",
      inst: "Plug PV",
      state: "Regular text column",
      st: "Loan Type",
      sp: "$9802",
     rep:"Loan Type",
     rl:"Regular text column"

    },
    {
      pt: "Nova",
      inst: "Plug PV",
      state: "Regular text column",
      st: "Loan Type",
      sp: "$9802",
     rep:"Loan Type",
     rl:"Regular text column"

    },
    {
      pt: "Nova",
      inst: "Plug PV",
      state: "Regular text column",
      st: "Loan Type",
      sp: "$9802",
     rep:"Loan Type",
     rl:"Regular text column"
    },
    
  ]
  return (
    <div className='comm'>
      <div className='commissionContainer'>
      <div className='commissionSection'>
    <div className='rateSection'>
      <h2>Commission Rate</h2>
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
            open && (<CreateCommissionRate handleClose={handleClose}  />)
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
                    <p>State</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sales Type</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sales Price</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep. Type</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
               <th>
                  <div className="table-header">
                    <p>Rate List</p> <img src={arrowDown} alt="" />
                  </div>
                </th>

              </tr>
            </thead>
          
            <tbody >
              {
                commissionRateData.map((el, i) => (
                  <tr key={i}>
                    <td ><input value="test" type="checkbox" className='check-box' /></td>
                    <td style={{ fontWeight: "600" }}>{el.pt}</td>
                    <td>{el.inst}</td>
                    <td>{el.state}</td>
                    <td>{el.st}</td>
                    <td>{el.sp}</td>
                    <td>{el.rep}</td>
                    <td>{el.rl}</td>
                    {/* <td>{el.endDate}</td> */}
                  


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