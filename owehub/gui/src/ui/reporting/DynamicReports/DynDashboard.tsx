// import React, { useEffect, useState } from 'react'
// import SupersetDashboard from '../components/SupersetDashboard';
// import { useParams } from 'react-router-dom';
// import BackButtom from '../components/BackButtom';


// const DynDashboard = () => {
//     const { id } = useParams<{ id: string }>();
//     const [dashboardId, setDashboardId] = useState<string>('');

//     useEffect(() => {
//         if (id) {
//             setDashboardId(id);
//         }
//     }, [id]);

//     console.log(dashboardId, "id")

//     return (
//         <>
//             <BackButtom heading="Reports Dashboard"/>
//             {dashboardId && <SupersetDashboard dashboardId={dashboardId} />}
//         </>
//     );
// };

// export default DynDashboard
import React from 'react'

const DynDashboard = () => {
  return (
    <div></div>
  )
}

export default DynDashboard