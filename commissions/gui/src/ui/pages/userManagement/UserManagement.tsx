import React, { useState } from "react";

import { IoAddSharp } from "react-icons/io5";
import UserOnboardCreation from "./userOnboard/UserOnboardCreation";
import EditOnboarding from "../userManagement/userOnboard/EditOnboarding"
import UserHeaderSection from "./UserHeader/UserHeaderSection";
import UserPieChart from "./pieChart/UserPieChart";
import DatabaseAccess from "./userOnboard/DatabaseAccess";
import SelectTable from "./userOnboard/SeletTable";
const UserManagement: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div className="management-section">
        <div className="manage-user">
          <p>Welcome, Caleb Antonucci</p>
          <h2>User Management</h2>
        </div>
        <div className="iconsSection2">
          <button
            type="button"
            style={{
              background: "#0493CE",
              color: "white",
              border: "none",
              // border: "1px solid black",
            }}
            onClick={() => handleOpen()}
          >
            <IoAddSharp /> Add New
          </button>
        </div>
      </div>
      {open && (
        <DatabaseAccess
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
