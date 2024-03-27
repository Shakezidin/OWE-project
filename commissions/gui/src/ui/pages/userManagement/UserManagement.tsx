import React from 'react'
import ManageUser from './ManageUser'
import BarChart from './BarChart'
const UserManagement: React.FC = () => {
    return (
        <>
            <div className='management-section'>
                <p>Welcome, Caleb Antonucci</p>
                <h2>User Management</h2>
            </div>
            <div className="onboardrow">
             
                <div className='user-component'>
               <ManageUser/>
                </div>

            </div>
            <div className='barchart-section'>
                <BarChart />
            </div>

        </>
    )
}

export default UserManagement