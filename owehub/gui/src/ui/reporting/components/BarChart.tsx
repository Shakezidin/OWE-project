import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Tucson',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
        'Pending Roof': 25,
        'Pending Confirmation': 12,
        'Pending Review - Pre-Install': 18,
        'Completed day 1/2': 8,
        'Install Scheduled - Confirmed': 22,
    },
    {
        name: 'Texas',
        'Pending Reschedule': 2,
        'Pending Customer': 35,
        'Pending NTP': 15,
        'Ready for NCA Review': 20,
        'Pending Roof': 30,
        'Pending Confirmation': 18,
        'Pending Review - Pre-Install': 22,
        'Completed day 1/2': 12,
        'Install Scheduled - Confirmed': 28,
    },
    {
        name: 'Tucson',
        'Pending Reschedule': 25,
        'Pending Customer': 35,
        'Pending NTP': 15,
        'Ready for NCA Review': 20,
        'Pending Roof': 30,
        'Pending Confirmation': 18,
        'Pending Review - Pre-Install': 22,
        'Completed day 1/2': 12,
        'Install Scheduled - Confirmed': 28,
    },
    {
        name: 'Texas',
        'Pending Reschedule': 25,
        'Pending Customer': 35,
        'Pending NTP': 15,
        'Ready for NCA Review': 30,
        'Pending Roof': 30,
        'Pending Confirmation': 18,
        'Pending Review - Pre-Install': 22,
        'Completed day 1/2': 12,
        'Install Scheduled - Confirmed': 28,
    },
    {
        name: 'Tucson',
        'Pending Reschedule': 40,
        'Pending Customer': 35,
        'Pending NTP': 15,
        'Ready for NCA Review': 20,
        'Pending Roof': 30,
        'Pending Confirmation': 18,
        'Pending Review - Pre-Install': 22,
        'Completed day 1/2': 12,
        'Install Scheduled - Confirmed': 28,
    },
    {
        name: 'Tucson',
        'Pending Reschedule': 25,
        'Pending Customer': 35,
        'Pending NTP': 15,
        'Ready for NCA Review': 20,
        'Pending Roof': 30,
        'Pending Confirmation': 18,
        'Pending Review - Pre-Install': 22,
        'Completed day 1/2': 12,
        'Install Scheduled - Confirmed': 28,
    },
    {
        name: 'Texas',
        'Pending Reschedule': 25,
        'Pending Customer': 35,
        'Pending NTP': 15,
        'Ready for NCA Review': 20,
        'Pending Roof': 30,
        'Pending Confirmation': 18,
        'Pending Review - Pre-Install': 22,
        'Completed day 1/2': 12,
        'Install Scheduled - Confirmed': 28,
    },
    {
        name: 'Tucson',
        'Pending Reschedule': 25,
        'Pending Customer': 35,
        'Pending NTP': 15,
        'Ready for NCA Review': 20,
        'Pending Roof': 30,
        'Pending Confirmation': 18,
        'Pending Review - Pre-Install': 22,
        'Completed day 1/2': 12,
        'Install Scheduled - Confirmed': 28,
    },
    
    // Add more data for other locations...
];

const BarChartExample: React.FC = () => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                {/* <Tooltip /> */}
                <Legend
                    align="right"
                    layout="vertical"
                    verticalAlign="top"
                    height={3}
                    wrapperStyle={{ right: -12,fontSize: 10 }}
                />
                <Bar dataKey="Pending Reschedule" stackId="a" fill="#8884d8" />
                <Bar dataKey="Pending Customer" stackId="a" fill="#82ca9d" />
                <Bar dataKey="Pending NTP" stackId="a" fill="#ffc658" />
                <Bar dataKey="Ready for NCA Review" stackId="a" fill="#ff7300" />
                <Bar dataKey="Pending Roof" stackId="a" fill="#6b486b" />
                <Bar dataKey="Pending Confirmation" stackId="a" fill="#a05d56" />
                <Bar dataKey="Pending Review - Pre-Install" stackId="a" fill="#d0743c" />
                <Bar dataKey="Completed day 1/2" stackId="a" fill="#ff9b54" />
                <Bar dataKey="Install Scheduled - Confirmed" stackId="a" fill="#c27ba0" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartExample;