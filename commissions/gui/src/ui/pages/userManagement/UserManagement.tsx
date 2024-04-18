import React, { useState } from "react";

import { IoAddSharp } from "react-icons/io5";
import UserHeaderSection from "./UserHeader/UserHeaderSection";
import UserPieChart from "./pieChart/UserPieChart";

import UserOnboardingCreation from "./userOnboard/UserOnboardCreation";

const UserManagement: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const userRole = localStorage.getItem("role");
  const userEmail = localStorage.getItem("email");

  return (
    <>
      <div className="management-section">
        <div className="manage-user">
          <p>Welcome, {userEmail}</p>
          <h2>User Management</h2>
        </div>
        <div className="iconsSection2">
          <button
            type="button"
            style={{
              background: "#0493CE",
              color: "white",
           
              border: "2px solid #0493CE",
            }}
            onClick={() => handleOpen()}
          >
            <IoAddSharp /> Add New
          </button>
        </div>
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
