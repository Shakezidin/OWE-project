import React from 'react' 
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5"; 
import arrowDown from '../../../resources/assets/arrow-down.png'
import imgExport from '../../../resources/assets/export.png'
 import imgimport from '../../../resources/assets/import.png'
 import './UserManagement.css' 
const UserManamement: React.FC = () => {
  const commissionData = [
    {
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Regional Manager",
    plug: "323223",
    Text: "Hanery",
    state:"hanery@gmail.com",
    Dollar: "+1 9393020303",
    img: "../../../assets/Vector.png",
    loan: "Voltaic Power LLC",
    regular: "Implementing solar"
},
{
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Sales Manager",
    plug: "453233",
    Text: "Bruce",
    state:"bruce@gmail.com",
    Dollar: "+1 9393020303",
    img: "../../../assets/Vector.png",
    loan: "Referral",
    regular: "Implementing solar"
},
{
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Referral",
    plug: "323223",
    Text: "Hanery",
    state:"hanery@gmail.com",
    Dollar: "+1 9393020303",
    img: "../../../assets/Vector.png",
    loan: "Voltaic Power LLC",
    regular: "Implementing solar"
},
{
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Dealer",
    plug: "323223",
    Text: "Hanery",
    state:"hanery@gmail.com",
    Dollar: "+1 9393020303",
    img: "../../../assets/Vector.png",
    loan: "Voltaic Power LLC",
    regular: "Implementing solar"
},
{
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Regional Manager",
    plug: "323223",
    Text: "Hanery",
    state:"hanery@gmail.com",
    Dollar: "+1 9393020303",
    img: "../../../assets/Vector.png",
    loan: "Voltaic Power LLC",
    regular: "Implementing solar"
},
{
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Regional Manager",
    plug: "323223",
    Text: "Hanery",
    state:"hanery@gmail.com",
    Dollar: "+1 9393020303",
    img: "../../../assets/Vector.png",
    loan: "Voltaic Power LLC",
    regular: "Implementing solar"
},
{
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Regional Manager",
    plug: "323223",
    Text: "Hanery",
    state:"hanery@gmail.com",
    Dollar: "+1 9393020303",
    img: "../../../assets/Vector.png",
    loan: "Voltaic Power LLC",
    regular: "Implementing solar"
}

]
  return (
    <div className='comm'>
    <div className='commissionContainer'>
        <div className='commissionSection'>
            <div className='rateSection'>
                <h3>User List</h3>
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
                    <th>Designation <img src={arrowDown} alt="" /> </th>
                    <th>Dealer Code <img src={arrowDown} alt="" /></th>
                    <th>Name <img src={arrowDown} alt="" /></th>
                    <th>Email ID <img src={arrowDown} alt="" /></th>
                    <th>Phone Number <img src={arrowDown} alt="" /></th>
                    <th>Phone Number <img src={arrowDown} alt="" /></th>
                    <th>Descriptions <img src={arrowDown} alt="" /></th>
                </tr>
            </thead>
            <tbody style={{ alignItems: "center" }}>
            {
                commissionData.map((el,i)=>(
                    <tr >
                    <td><input value="test" type="checkbox" /></td>
                    <td>{el.Sova}</td>
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

export default UserManamement