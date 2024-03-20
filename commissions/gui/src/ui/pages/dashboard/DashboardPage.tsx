import React, { useEffect, useState } from "react";

/**
 * Created by satishazad on 23/01/24
 * File Name: DashboardPage
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/ui/pages/dashboard
 */


import CreateUserProfile from "../create_profile/CreateUserProfile";
import '../dashboard/dasboard.css'
import { httpRequest } from "../../../infrastructure/web_api/api_client/APIClient";
import { DashboardUserModel } from "../../../core/models/data_models/DashboardUserModel";
import apiCaller from "../../../infrastructure/web_api/api_client/apiUrl";




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
        <div className="admin-dashboard">
        <div className="dashboard-head">
          <h4>Admin Dashboard</h4>
          <button className='user-btn'  onClick={handleOpen}>Create User</button>
        </div>
        <div className="admin-card-container">
        {
            todos.map((el,i)=>(
              <div className="admin-card-content" key={i}>
                 {el.name}
              </div>
            ))
           }
       
        </div>
        <div className="user-list-container">
          <div className="user-list">
  user list
          </div>
        </div>
        <div>
          

          
               {
                open && ( <CreateUserProfile handleClose={handleClose}  />)
               }
          
        </div>
      </div>
       
    )
}
