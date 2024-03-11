import React from 'react'

import SideBar from '../ui/layout/SideBar'
import Header from '../ui/layout/Header'

const ProtectedRoute: React.FC<any> = ({Children }) => {
  return (
    <div className='main-container'>
        <div className="side-header">
      
            <SideBar/>
           <div className="header-container">
           <Header/>
            <div className='children-container'>
               {Children} 
              
               </div>
           </div>
        </div>
                
       
        
 </div>
  )
}

export default ProtectedRoute