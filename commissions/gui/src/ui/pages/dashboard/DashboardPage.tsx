import React, { useEffect, useState } from "react";

/**
 * Created by satishazad on 23/01/24
 * File Name: DashboardPage
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/ui/pages/dashboard
 */


import CreateUserProfile from "../create_profile/CreateUserProfile";
import AccountSettings from "../accountSettings/AccountSettings";
import UserManagement from "../userManagement/UserManagement";
import '../dashboard/dasboard.css'
import { DashboardUserModel } from "../../../core/models/data_models/DashboardUserModel";
import DashboardTotal from "./DashboardTotal";
import { getCaller } from "../../../infrastructure/web_api/services/apiUrl";
export const DashboardPage: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
 
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
      <>
      <div className="Dashboard-container">
        <div className="Dashboard-wel">
          <h6>Welcome back, Colten</h6>
          <h3>Your Dashboard</h3>
        </div>
       <DashboardTotal/>
      </div>
      </>
       
    )
}
