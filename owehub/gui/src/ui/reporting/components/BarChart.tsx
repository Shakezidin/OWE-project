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
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label}`}</p>
                <p className="value">{`${payload[0].name}: ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

const BarChartExample: React.FC = () => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data as Data[]} margin={{ top: 22, right: 10, left: 10, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }} />
                <YAxis tick={{ fontSize: 12, fontWeight: 500, fill: '#818181' }} />
                <Legend
                    align="center"
                    layout="horizontal"
                    verticalAlign="bottom"
                    wrapperStyle={{
                        fontSize: 10,
                        marginTop: 10,
                        paddingBottom: 10
                    }}
                    iconSize={10}
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

export default BarChartExample;