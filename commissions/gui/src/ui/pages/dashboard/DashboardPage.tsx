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
import apiCaller from "../../../infrastructure/web_api/api_client/apiUrl";
import DashboardTotal from "./DashboardTotal";
export const DashboardPage: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [todos, setTodos] = useState<DashboardUserModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiCaller<DashboardUserModel[]>('get', '/users');
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchData();
  }, []);
    
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
