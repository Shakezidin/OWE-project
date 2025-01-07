import React, { useEffect, useState } from 'react'
import SupersetDashboard from '../components/SupersetDashboard';
import { useParams } from 'react-router-dom';
import BackButtom from '../components/BackButtom';


const DynDashboard = () => {
    const { id } = useParams<{ id: string }>();
    const [dashboardId, setDashboardId] = useState<string>('');

    useEffect(() => {
        if (id) {
            setDashboardId(id);
        }
    }, [id]);

    console.log(dashboardId, "id")

    return (
        <>
            <BackButtom heading="Dashboard"/>
            {dashboardId && <SupersetDashboard dashboardId={dashboardId} />}
        </>
    );
};

export default DynDashboard
