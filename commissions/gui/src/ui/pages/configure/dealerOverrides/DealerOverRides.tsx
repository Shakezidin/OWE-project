import React from 'react'
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from '../../../../resources/assets/export.png'
import imgimport from '../../../../resources/assets/import.png'
import arrowDown from '../../../../resources/assets/arrow-down.png'
import '../configure.css'
const DealerOverRides: React.FC = () => {
  const DealerOverData = [
    {
      united: "United Wholesales",
      Markting: "Markting",
      dollar: "$10",
      startDate: "10/10/1000",
      endDate: "99/99/99990",
      img: {
        delete: "../../../resources/assets/delete-bin-line.png",
        edit: "../../../resources/assets/edit-2-line.png"
      }

    },
    {
      united: "United Wholesales",
      Markting: "Markting",
      dollar: "$10",
      startDate: "10/10/1000",
      endDate: "99/99/99990",
      img: {
        delete: "../../../resources/assets/delete-bin-line.png",
        edit: "../../../resources/assets/edit-2-line.png"
      }

    },
    {
      united: "United Wholesales",
      Markting: "Markting",
      dollar: "$10",
      startDate: "10/10/1000",
      endDate: "99/99/99990",
      img: {
        delete: "../../../resources/assets/delete-bin-line.png",
        edit: "../../../resources/assets/edit-2-line.png"
      }

    },
    {
      united: "United Wholesales",
      Markting: "Markting",
      dollar: "$10",
      startDate: "10/10/1000",
      endDate: "99/99/99990",
      img: {
        delete: "../../../resources/assets/delete-bin-line.png",
        edit: "../../../resources/assets/edit-2-line.png"
      }

    },
  ]
  return (
    <div className='comm'>
    <div className='commissionContainer'>
      <div className='commissionSection'>
        <div className='rateSection'>
          <h3>Dealer Overrides</h3>
          <h6 style={{ color: "#667085" }}>You can view and edit these data as per your requirement</h6>
        </div>
        <div className="iconContainer">
          <div className='iconsSection'>
            <button type='button'>   <h3><RiDeleteBin5Line /></h3> Delete</button>
          </div>
          <div className='iconsSection'>
            <button type='button'>    <h3><MdFilterList /></h3>  Filter</button>
          </div>
          <div className='iconsSection2'>
            <button type='button'> <img src={imgimport} alt='' /> Import</button>
          </div>
          <div className='iconsSection2'>
            <button type='button'> <img src={imgExport} alt='' />Export</button>
          </div>
          <div className='iconsSection2'>

            <button type='button' style={{ background: "black", color: "white" }}>  <h2><IoAddSharp /></h2>  Add New</button>
          </div>
        </div>

      </div>

    </div>

    {/* <hr style={{ border: "1px solid #EAECF0" }} /> */}

    <div className='TableContainer'>
      <table>
        <thead style={{ background: "#FCFCFD" }}>
          <tr>
            <th><input value="test" type="checkbox" /></th>
            <th>Sub Dealer <img src={arrowDown} alt="" /> </th>
            <th>Dealer <img src={arrowDown} alt="" /></th>
            <th>Pay Rate <img src={arrowDown} alt="" /></th>
            <th>Start Date <img src={arrowDown} alt="" /></th>
            <th>End Date <img src={arrowDown} alt="" /></th>
            <th>Action<img src={arrowDown} alt="" /></th>
            {/* <th>Rate List <img src={arrowDown} alt="" /></th> */}
          </tr>
        </thead>
        <tbody style={{ alignItems: "center" }}>
        {
          DealerOverData.map((el,i)=>(
            <tr>
            <td><input value="test" type="checkbox" /></td>
            <td style={{ fontWeight: "600" }}>{el.united}</td>
            <td>{el.Markting}</td>
            <td>{el.dollar}</td>
            <td>{el.startDate}</td>
            <td>{el.endDate}</td>
            <td style={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: "18px", gap: '0.5rem', cursor: "pointer" }}>
              <img src={el.img.delete} alt="" />
              <img src={el.img.edit} alt="" />
            </td>


          </tr>
          ))
        }
         


        </tbody>


      </table>
    </div>


  </div>

  )
}

export default DealerOverRides