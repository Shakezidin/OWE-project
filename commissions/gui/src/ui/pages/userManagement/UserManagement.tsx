import React, { useState } from "react";
import ManageUser from "./ManageUser";
import BarChart from "./BarChart/BarChart";
import { IoAddSharp } from "react-icons/io5";
import UserOnboardCreation from "./UserOnboardCreation";


const UserManagement: React.FC = () => {
  const [open,setOpen] = useState<boolean>(false)
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
              border:"none"

              // border: "1px solid black",
            }}
            onClick={()=>handleOpen()}
          >
            <IoAddSharp /> Add New
          </button>
        </div>
      </div>
      {open && <UserOnboardCreation
                        
                       
                         handleClose={handleClose} />}
      <div className="barchart-section">
        {/* <BarChart /> */}
      </div>
      <div className="onboardrow">
        <div className="user-component">
          <ManageUser />
        </div>
      </div>
      
    </>
  );
};

export default UserManagement;
