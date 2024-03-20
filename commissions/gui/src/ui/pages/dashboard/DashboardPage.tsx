import React from "react";

/**
 * Created by satishazad on 23/01/24
 * File Name: DashboardPage
 * Product Name: WebStorm
 * Project Name: commission_app
 * Path: src/ui/pages/dashboard
 */

import Modal from '@mui/material/Modal';
import CreateUserProfile from "../create_profile/CreateUserProfile";
import AccountSettings from "../accountSettings/AccountSettings";
import UserManagement from "../userManagement/UserManagement";


const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export const DashboardPage: React.FC = () => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div className="admin-dashboard">
          <UserManagement />
        <div className="dashboard-head">
          <h4>Admin Dashboard</h4>
         
          <button className='user-btn'  onClick={handleOpen}>Create User</button>
        </div>




        <div className="admin-card-container">
          <div className="admin-card-content">
  
          </div>
        </div>

        <div className="admin-card-container accountcol">
        <AccountSettings />
        </div>


        <div className="user-list-container">
          <div className="user-list">
  user list
          </div>
        </div>
        <div>
          

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <CreateUserProfile  />
            </Modal>
        </div>
      </div>
       
    )
}
