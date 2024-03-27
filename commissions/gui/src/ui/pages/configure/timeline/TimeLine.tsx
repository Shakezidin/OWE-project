import React from 'react'

import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

import CreateDealer from '../dealerOverrides/CreateDealer';

import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from '../../../../resources/assets/export.png'
import imgimport from '../../../../resources/assets/import.png'
import arrowDown from '../../../../resources/assets/arrow-down.png'
import CreateTimeLine from './CreateTimeLine';
const TimeLine = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
    <div className='commissionSection'>
    <div className='rateSection'>
      <h2>Timeline SLA</h2>
      <p style={{ color: "#667085",fontSize:"14px" }}>You can view and edit these data as per your requirement</p>
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
   
           {
            open && (<CreateTimeLine handleClose={handleClose}  />)
           }
    
  </div>
      <div className='TableContainer' >
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
                    <p>TYPE / M2M</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Days</p> <img src={arrowDown} alt="" />
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
              timeLineData.map((el, i) => (
                <tr key={i}>
                  <td ><input value="test" type="checkbox" className='check-box' /></td>
                  <td style={{ fontWeight: "500",color:"black" }}>{el.m2m}</td>
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