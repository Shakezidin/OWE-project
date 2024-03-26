import React from 'react' 
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5"; 
import arrowDown from '../../../resources/assets/arrow-down.png'
import imgExport from '../../../resources/assets/export.png' 
 import imgimport from '../../../resources/assets/import.png'
 import './UserManagement.css'
 import UserOnboardCreation from './UserOnboardCreation';
import AppSetterOnboardCreation from './AppSetterOnboardCreation'  

 

const UserManagement: React.FC = () => {

    const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleOpen1 = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const commissionData = [
    {
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Regional Manager",
    plug: "$3002",
    Text: "Implementing solar system commission settings ",
    state:"03-01-22",
    Dollar: "03-01-22",
    img: "../../../assets/Vector.png",
    loan: " ",
    
},
{
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Sales Manager",
    plug: "$3002",
    Text: "Implementing solar system commission",
    state:"03-01-22",
    Dollar: "03-01-22",
    img: "../../../assets/Vector.png",
    loan: " ",
   
},
{
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Referral",
    plug: "$3002",
    Text: "Implementing solar system commission",
    state:"03-01-22",
    Dollar: "03-01-22",
    img: "../../../assets/Vector.png",
    loan: " ",
  
},
{
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Dealer",
    plug: "$3002",
    Text: "Implementing solar system commission",
    state:"03-01-22",
    Dollar: "03-01-22",
    img: "../../../assets/Vector.png",
    loan: "",
    
},
{
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Regional Manager",
    plug: "$3002",
    Text: "Implementing solar system commission",
    state:"03-01-22",
    Dollar: "03-01-22",
    img: "../../../assets/Vector.png",
    loan: " ",
    
},
{
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Regional Manager",
    plug: "$3002",
    Text: "Hanery",
    state:"03-01-22",
    Dollar: "03-01-22",
    img: "../../../assets/Vector.png",
     
     
},
{
    checkIcon: "../../../assets/checkbox-circle-line.png",
    Sova: "Regional Manager",
    plug: "$3002",
    Text: "Hanery",
    state:"03-01-22",
    Dollar: "03-01-22",
    img: "../../../assets/Vector.png",
    loan: " ",
     
}

]
  return ( <>
    <div className="onboardrow">
  <div className="onboardcol btnone">
     <button onClick={handleOpen}><span> + </span> <div className="txt">Create</div> <div className="boldtxt">User Onboarding</div>  </button>  
     { open && (<UserOnboardCreation handleClose={handleClose}  />) }
  </div>
   
  <div className="onboardcol btntwo">
     <button onClick={handleOpen1}><span> + </span> <div className="txt">Create</div> <div className="boldtxt">Appt Setter Onboarding</div>  </button>  
     { open && (<AppSetterOnboardCreation handleClose={handleClose}  />) }
    

  </div>
  <div className="onboardcol btnthree">
  <button onClick={handleOpen}><span> + </span> <div className="txt">Create</div> <div className="boldtxt">Partner Onboarding</div>  </button>  
  </div>
</div>
 
 <div className="graphbar">
<h3>Onboarding Detail</h3>

<div className="charbarrow">


<div className="cbars">
    <div className="barline auser">

  <span>89  <br />
Users</span>   

    </div>
    <h6>Admin Users</h6>
</div>
<div className="cbars">
    <div className="barline manager"> <span>38  <br />
Users</span> </div>
    <h6>Sales Manager</h6>
</div>
<div className="cbars">
    <div className="barline repre"> <span>32  <br />
Users</span> </div>
    <h6>Sales Representative</h6>
</div>
<div className="cbars">
    <div className="barline dealer"> <span>65  <br />
User</span> </div>
    <h6>Dealer</h6>
</div>
<div className="cbars">
    <div className="barline rmanger"><span>30  <br />
Users</span></div>
    <h6>Regional Manager</h6>
</div>
<div className="cbars">
    <div className="barline partner"> <span>30  <br />
Users</span> </div>
    <h6>Partner</h6>
</div>
<div className="cbars">
    <div className="barline setter"> <span>30  <br />
Users</span> </div>
    <h6>App Setter</h6>
</div>



<div className="zero gline">
    0
</div>
<div className="twenty gline">
   20
</div>
<div className="fourty gline">
  40
</div>
<div className="sixty gline">
   60
</div>
<div className="eighty gline">
   80
</div>
<div className="hundred gline">
   100
</div>
</div>


 </div>

    <div className='comm'>
    <div className='commissionContainer'>
        <div className='commissionSection'>
            <div className='rateSection'>
                <h3>Admin Users</h3>
                <h6 style={{ color: "#667085" }}>You can view and edit these data as per your requirement</h6>
            </div>
            <div className="iconContainer">
<div className="userselect">
            <select> <option>Admin User</option> </select>
            </div>
                <div className='iconsSection'>
                    <button type='button'>   <h3><RiDeleteBin5Line /></h3> Delete</button>
                </div>
                <div className='iconsSection'>
                    <button type='button'>    <h3><MdFilterList /></h3>  Filter</button>
                </div>
              
            </div>

        </div>

    </div>

    

    <div className='TableContainer'>
        <table>
            <thead style={{ background: "#FCFCFD" }}>
                <tr>
                    <th><input value="test" type="checkbox" /></th>
                   
                    <th>Name <img src={arrowDown} alt="" /></th>
                    <th>Pay Rate <img src={arrowDown} alt="" /></th>
                  
                    <th>Descriptions <img src={arrowDown} alt="" /></th>
                    <th>Start Date <img src={arrowDown} alt="" /></th>
                    <th>End Date <img src={arrowDown} alt="" /></th>
                    <th>Action  <img src={arrowDown} alt="" /></th>
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
                   

                </tr>
                ))
            }
              
              

            </tbody>


        </table>
    </div>


</div>

 

</>
  )
}

export default UserManagement