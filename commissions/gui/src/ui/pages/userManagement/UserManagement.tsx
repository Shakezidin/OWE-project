import React, { useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import UserHeaderSection from "./UserHeader/UserHeaderSection";
import UserPieChart from "./pieChart/UserPieChart";
import UserOnboardingCreation from "./userOnboard/UserOnboardCreation";
import { AddNewButton } from "../../components/button/AddNewButton";

const UserManagement: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const userName = localStorage.getItem("userName");

  return (
    <>
      <div className="management-section">
        <div className="manage-user">
          <p>Welcome, {userName}</p>
          <h2>User Management</h2>
        </div>

        <AddNewButton title={"Add New"} onClick={()=>{
          handleOpen()
        } }/>
       
      </div>
      {open && (
        <UserOnboardingCreation
          handleClose={handleClose}
          editMode={false}
          userOnboard={null}
        />
      )}
      <div className="barchart-section">
        <UserPieChart />
      </div>

      <div className="onboardrow">
        <div className="user-component">
          <UserHeaderSection />
        </div>
      </div>
    </>
  );
};

export default UserManagement;
