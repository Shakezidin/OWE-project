import React from "react";
import '../userManagement/user.css'
import { ICONS } from "../../icons/Icons";


type ButtonProps ={
  handleClose:()=>void
}
const ManageUser: React.FC = () => {
  return (
    <>
      <div className="user-manager-section">
        <div className="addIcon">
          {/* <img src={ICONS.addIcon} alt=""/> */}
          <h3>create</h3>
          <p>User Onboarding</p>
        </div>
      </div>
      <div className="user-manager-section">
        <div className="addIcon">
          {/* <img src={ICONS.addIcon2} style={{ background: "#C9F7F7" }} alt="" /> */}
          <h3 style={{color:"#30AFAF"}}>create</h3>
          <p style={{color:"#30AFAF"}}>Appt Setter Onboarding</p>
        </div>
      </div>
      <div className="user-manager-section">
        <div className="addIcon">
          {/* <img style={{ background: "#FEE6CF" }} src={ICONS.addIcon3} alt="" /> */}
          <h3 style={{ color: "#F36B1E" }}>create</h3>
          <p style={{ color: "#F36B1E" }}>Partner Onboarding </p>
        </div>
      </div>
    </>
  );
};

export default ManageUser;