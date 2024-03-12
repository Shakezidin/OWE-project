import React from 'react'
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from '../../../../resources/assets/export.png'
import imgimport from '../../../../resources/assets/import.png'
import arrowDown from '../../../../resources/assets/arrow-down.png'
import '../configure.css'
const MarketingFees: React.FC = () => {
    const MarketingData = [
        {
            checkIcon: "../../../resources/assets/checkbox-circle-line.png",
            soeb: "SOEB Settle",
            plug: "Plug PV",
            Text: "Regular Text Column",
            Dollar: "$45853",
            img: "../../../resources/assets/Vector.png",
            loan: "Loan Type",
            regular: "Regular Type"
        },

        {
            checkIcon: "../../../resources/assets/checkbox-circle-line.png",
            soeb: "SOEB Settle",
            plug: "Plug PV",
            Text: "Regular Text Column",
            Dollar: "$45853",
            img: "../../../resources/assets/Vector.png",
            loan: "Loan Type",
            regular: "Regular Type"
        },
        {
            checkIcon: "../../../resources/assets/checkbox-circle-line.png",
            soeb: "SOEB Settle",
            plug: "Plug PV",
            Text: "Regular Text Column",
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
                <h3>Marketing Fees</h3>
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
            <thead style={{ background: "#FCFCFD"  }}>
                <tr>
                    <th><input value="test" type="checkbox" /></th>
                    <th>Source <img src={arrowDown} alt="" /> </th>
                    <th>DBA <img src={arrowDown} alt="" /></th>
                    <th>State <img src={arrowDown} alt="" /></th>
                    <th>Fees Rate <img src={arrowDown} alt="" /></th>
                    <th>Chg Dlr <img src={arrowDown} alt="" /></th>
                    <th>Play Source<img src={arrowDown} alt="" /></th>
                    <th>Note<img src={arrowDown} alt="" /></th>
                </tr>
            </thead>
            <tbody style={{ alignItems: "center" }}>
                {
                    MarketingData.map((el, i) => (
                        <tr key={i}>
                            <td><input value="test" type="checkbox" /></td>
                            <td style={{ fontWeight: "600" }}>{el.soeb}</td>
                            <td>{el.plug}</td>
                            <td>{el.Text}</td>
                            <td>{el.Dollar}</td>
                            <td>
                                <img src={el.img} alt=" " />
                            </td>
                            <td>{el.loan}</td>
                            <td>{el.regular} </td>

                        </tr>
                    ))
                }



            </tbody>


        </table>
    </div>


</div>
  )
}

export default MarketingFees