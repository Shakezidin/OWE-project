import React from "react";
import ManageUser from "./ManageUser";
import BarChart from "./BarChart";
import { IoAddSharp } from "react-icons/io5";
import UserOnboardCreation from "../../pages/userManagement/UserOnboardCreation";
import AppSetterOnboardCreation from "../../pages/userManagement/AppSetterOnboardCreation";

const UserManagement: React.FC = () => {
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
              // border: "1px solid black",
            }}
            // onClick={onpressAddNew}
          >
            <IoAddSharp /> Add New
          </button>
        </div>
      </div>
      <div className="barchart-section">
        <BarChart />
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
