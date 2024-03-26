import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
 import "./AccountSettings.css";
 import userImg from '../../../resources/assets/user.png'
 import editicon from '../../../resources/assets/edit-line.png'  
 import accountIcon from '../../../resources/assets/settings-line.png'
 
 

const AccountSettings  = () => {
  return ( <> 
    <div className="titlehed"> <span><img src={accountIcon} alt="" /></span> Account Setting </div>
    <div className="TabsContainer">
    <Tabs className="Tabs">
      <TabList>
        <Tab> <span> My Profile</span></Tab>
        <Tab> <span>Reset Password </span> </Tab> 
        <Tab> <span> Log Out</span></Tab>
      </TabList> 
      <dl className="tabrow">
<TabPanel >
   
   <h4 className="titlefour"> My Profile</h4>

<div className="flex pad15 border radius6 justifycnt">

<div className="user-img-container">
        <div className="user-img">
        <img src={userImg} alt="" />
        </div>
        <div className="user-name">
         <div className="down-arrow">
         <h4 className="fweight600">Caleb Antonucci</h4>
       
         </div>
         
          <p>Sales Executive Officer</p>
        </div>
      </div>
      <span className="editbtn"> <img src={editicon} alt="" /> Edit </span>


</div>



<div className="flex pad15 border radius6 justifycnt mt30">
<div className="fleft">
  <h4>Personal Information</h4>
<div className="row mt30">
  <div className="col-md-6">
    <label htmlFor="">First Name</label>
    <input type="text" placeholder="Caleb" />
  </div>
  <div className="col-md-6">
    <label htmlFor="">Last Name</label>
    <input type="text" placeholder="Antonucci" />
  </div>
</div>
<div className="row mt30">
  <div className="col-md-6">
    <label htmlFor="">Email</label>
    <input type="text" placeholder="caleb_antonucci@gmail.com" />
  </div>
  <div className="col-md-6">
    <label htmlFor="">Phone Number</label>
    <input type="text" placeholder="+1 93932 29292" />
  </div>
</div>


</div>

<span className="editbtn"> <img src={editicon} alt="" /> Edit </span>

</div>

<div className="pad15 border radius6 mt30">
<div className="flex  justifycnt ">
<h4>Address Detail</h4><span className="editbtn"> <img src={editicon} alt="" /> Edit </span>
</div>
<div className="">
 
<div className="row mt30">
  <div className="col-md-4">
    <label htmlFor="">Street</label>
    <select > <option></option> </select>
  </div>
  <div className="col-md-4">
    <label htmlFor="">State</label>
    <select > <option></option> </select>
  </div>

  <div className="col-md-4">
    <label htmlFor="">City</label>
    <select > <option></option> </select>
  </div>
</div>

<div className="row mt30">
  <div className="col-md-4">
  <label htmlFor="">Zip Code</label>
    <input type="text" placeholder="caleb_antonucci@gmail.com" />
  </div>
  <div className="col-md-4">
  <label htmlFor="">Country</label>
    <input type="text" placeholder="+1 93932 29292" />
  </div> 
</div>
 


</div>

</div>
 

      </TabPanel>
      <TabPanel>
      <h4>Security</h4>
      </TabPanel>
      <TabPanel>
       <h4>Setting</h4>
      </TabPanel>
      <TabPanel>
       <h4>Delete Account</h4>
      </TabPanel>
      <TabPanel>
    <h4>Log Out</h4>
      </TabPanel></dl>
    </Tabs></div>
    </>

  );
};

export default AccountSettings;
