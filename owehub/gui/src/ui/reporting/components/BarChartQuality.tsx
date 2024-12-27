import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, TooltipProps } from 'recharts';


type Data = {
    name: string;
    'Pending Reschedule': number;
    'Pending Customer': number;
    'Pending NTP': number;
    'Ready for NCA Review': number;
    'Pending Roof': number;
    'Pending Confirmation': number;
    'Pending Review - Pre-Install': number;
    'Completed day 1/2': number;
    'Install Scheduled - Confirmed': number;
  };

const data = [
    {
        name: '1',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '2',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '3',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '4',
       'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '5',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '6',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '7',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '8',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '9',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '4',
       'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '5',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '6',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '7',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '8',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '9',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '4',
       'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '5',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '6',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '7',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '8',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '9',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '4',
       'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '5',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '6',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '7',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '8',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },
    {
        name: '9',
        'Pending Reschedule': 20,
        'Pending Customer': 30,
        'Pending NTP': 10,
        'Ready for NCA Review': 15,
    },

    // Add more data for other locations...
];

const BarChartQuality: React.FC = () => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data as Data[]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }}/>
                <YAxis tick={{ fontSize: 12 }}/>
                <Legend
                    align="right"
                    layout="vertical"
                    verticalAlign="top"
                    height={3}
                    wrapperStyle={{ right: -12, fontSize: 10 }}
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
                {/* <Tooltip content={<CustomTooltip />} /> */}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartQuality;