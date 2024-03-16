import React from 'react'
import { RiDeleteBin5Line } from "react-icons/ri";

import arrowDown from '../../../../resources/assets/arrow-down.png'
import '../configure.css'
import { CiEdit } from "react-icons/ci";
import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from '../../../../resources/assets/export.png'
import imgimport from '../../../../resources/assets/import.png'
import CreateDealer from '../dealerOverrides/CreateDealer';

const MarketingFees: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  const DealerOverData = [
    {
      united: "United Wholesales",
      Markting: "Markting",
      dollar: "$10",
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
      <h2>Dealer Overrides</h2>
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
                  Sub Dealer
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                  Dealer
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                  Pay Rate
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                  Start Date
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                  End Date
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>
              
                <th>
                  <div className="table-header">
                    Action
                    <div className="">
                    <img src={arrowDown} alt="" className='' />
                    </div>
                  </div>
                </th>

              </tr>
            </thead>
            <tbody >
              {
                DealerOverData.map((el, i) => (
                  <tr key={i}>
                    <td ><input value="test" type="checkbox" className='check-box' /></td>
                    <td style={{ fontWeight: "600" }}>{el.united}</td>
                    <td>{el.Markting}</td>
                    <td>{el.dollar}</td>
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

  )
}

export default MarketingFees