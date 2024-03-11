import React from 'react'
import '../configure.css'
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from '../../../../resources/assets/export.png'
import imgimport from '../../../../resources/assets/import.png'
import arrowDown from '../../../../resources/assets/arrow-down.png'
const CommissionRate: React.FC = () => {
  const commissionData = [
    {
    checkIcon: "../../../resources/assets/checkbox-circle-line.png",
    Sova: "Sova",
    plug: "Plug PV",
    Text: "Regular Text Column",
    state:"State Type",
    Dollar: "$45853",
    img: "../../../resources/assets/Vector.png",
    loan: "Loan Type",
    regular: "Regular Type"
},
{
    checkIcon: "../../../resources/assets/checkbox-circle-line.png",
    Sova: "Sova",
    plug: "Plug PV",
    Text: "Regular Text Column",
    state:"State Type",
    Dollar: "$45853",
    img: "../../../resources/assets/Vector.png",
    loan: "Loan Type",
    regular: "Regular Type"
},
{
    checkIcon: "../../../resources/assets/checkbox-circle-line.png",
    Sova: "Sova",
    plug: "Plug PV",
    Text: "Regular Text Column",
    state:"State Type",
    Dollar: "$45853",
    img: "../../../resources/assets/Vector.png",
    loan: "Loan Type",
    regular: "Regular Type"
},
{
    checkIcon: "../../../resources/assets/checkbox-circle-line.png",
    Sova: "Sova",
    plug: "Plug PV",
    Text: "Regular Text Column",
    state:"State Type",
    Dollar: "$45853",
    img: "../../../resources/assets/Vector.png",
    loan: "Loan Type",
    regular: "Regular Type"
},
]
  return (
    <div className='comm'>
    <div className='commissionContainer'>
        <div className='commissionSection'>
            <div className='rateSection'>
                <h3>Commission Rate</h3>
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

                    <button type='button' style={{ background: "black", color: "white", border:"none" }}>  <h2><IoAddSharp /></h2>  Add New</button>
                </div>
            </div>

        </div>

    </div>

    

    <div className='TableContainer'>
        <table>
            <thead style={{ background: "#FCFCFD" }}>
                <tr>
                    <th><input value="test" type="checkbox" /></th>
                    <th>Partner <img src={arrowDown} alt="" /> </th>
                    <th>Installer <img src={arrowDown} alt="" /></th>
                    <th>State <img src={arrowDown} alt="" /></th>
                    <th>State Type <img src={arrowDown} alt="" /></th>
                    <th>Sale Price <img src={arrowDown} alt="" /></th>
                    <th>Rep. Type <img src={arrowDown} alt="" /></th>
                    <th>Rate List <img src={arrowDown} alt="" /></th>
                </tr>
            </thead>
            <tbody style={{ alignItems: "center" }}>
            {
                commissionData.map((el,i)=>(
                    <tr >
                    <td><input value="test" type="checkbox" /></td>
                    <td style={{fontWeight:"600"}}>{el.Sova}</td>
                    <td>{el.plug}</td>
                    <td>{el.Text}t</td>
                    <td>{el.state}</td>
                    <td>{el.Dollar}</td>
                    <td>{el.loan}</td>
                    <td>{el.regular}</td>

                </tr>
                ))
            }
              
              

            </tbody>


        </table>
    </div>


</div>
  )
}

export default CommissionRate