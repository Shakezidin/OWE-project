import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SelectOption from '../components/selectOption/SelectOption';
import styles from './NoPto.module.css';
import YearSelect from './components/Dropdowns/YearSelect';
import WeekSelect from './components/Dropdowns/WeekSelect';
import DaySelect from './components/Dropdowns/DaySelect';
import CompanySelect from './components/Dropdowns/CompanySelect';
import PTOStatus from './components/Dropdowns/PtoStatus';
import NoPtoTable from './components/Tables/NoPtoTable';
import BackButtom from './components/BackButtom';

interface Option {
  label: string;
  value: string;
}

const NoPto = () => {
  // Generate dummy data for weekly tables
  const generateWeeklyData = (multiplier: number) =>
    Array.from({ length: 51 }, (_, index) => ({
      week: index + 1,
      customer: Math.floor(Math.random() * 100 * multiplier) + 50,
    }));

  // Generate dummy data for PTO tables
  const generatePtoData = () =>
    Array.from({ length: 51 }, (_, index) => ({
      week: index + 1,
      ptoSubmission: Math.floor(Math.random() * 30) + 10,
      ptoGranted: Math.floor(Math.random() * 25) + 5,
    }));

  // Updated Overall Summary data to include office and customer name
  const overallSummaryData = Array.from({ length: 51 }, (_, index) => {
    const offices = ['Tucson', 'Texas', 'Tempe', 'Peoria/Kingman', 'Colorado', 'Albuquerque/El Paso'];
    return {
      office: offices[Math.floor(Math.random() * offices.length)],
      customerName: `Customer ${index + 1}`,
      customerUniqueId: `ID-${index + 1}`,
      projectStatus: 'Completed',
      ptoStatus: 'Granted',
      customerQuantity: Math.floor(Math.random() * 10) + 1,
    };
  });

  const weeklyData = generateWeeklyData(1);
  const officeData = generateWeeklyData(1.5);
  const ptoSubmissionData = generatePtoData();
  const ptoGrantedData = generatePtoData();

  const [statusValue, setStatusValue] = useState<Option | undefined>(undefined);
  const [weekValue, setWeekValue] = useState<Option | undefined>(undefined);
  const [officeValue, setOfficeValue] = useState<Option | undefined>(undefined);

  // Options arrays remain the same as in the original code
  const statusOptions: Option[] = [
    { label: 'Submitted / Scheduled', value: 'submitted_scheduled' },
    // ... rest of the options
  ];

  const weekOptions: Option[] = Array.from({ length: 51 }, (_, index) => ({
    label: `${(index + 1).toString().padStart(2, '0')}-2024`,
    value: `${(index + 1).toString().padStart(2, '0')}-2024`,
  }));

  const officeOptions: Option[] = [
    { label: 'Tucson', value: 'tucson' },
    // ... rest of the options
  ];

  // Function to calculate grand totals for the columns
  const calculateGrandTotal = (data: any[], columns: { key: string }[]) => {
    return columns.map((col) => {
      if (typeof data[0]?.[col.key] === 'number') {
        return data.reduce((total, row) => total + row[col.key], 0);
      }
      return null;
    });
  };

  const weeklyGrandTotal = calculateGrandTotal(weeklyData, [
    { key: 'customer' }
  ]);

  const officeGrandTotal = calculateGrandTotal(officeData, [
    { key: 'customer' }
  ]);

  const ptoSubmissionGrandTotal = calculateGrandTotal(ptoSubmissionData, [
    { key: 'ptoSubmission' },
    { key: 'ptoGranted' }
  ]);

  const ptoGrantedGrandTotal = calculateGrandTotal(ptoGrantedData, [
    { key: 'ptoSubmission' },
    { key: 'ptoGranted' }
  ]);

  return (
    <div className={styles.main_container} style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <BackButtom heading="Install Completed (No PTO Granted Date within 30 Days)" />
        <div style={{ display: 'flex', gap: '10px' }}>
          <div><YearSelect /></div>
          <div><WeekSelect /></div>
          {/* <div><DaySelect /></div> */}
          <div><CompanySelect /></div>
          <div><PTOStatus /></div>
        </div>
      </div>

      {/* Weekly sections */}
      {[{
        title: 'Weekly (Overall)',
        data: weeklyData,
        columns: [
          { key: 'week', label: 'Week of Completion' },
          { key: 'customer', label: 'Customer' }
        ],
        grandTotal: weeklyGrandTotal
      }, {
        title: 'Weekly (Office)',
        data: officeData,
        columns: [
          { key: 'week', label: 'Week of Completion' },
          { key: 'customer', label: 'Customer' }
        ],
        grandTotal: officeGrandTotal
      }, {
        title: 'Install Complete to PTO Submission',
        data: ptoSubmissionData,
        columns: [
          { key: 'week', label: 'Week of Completion' },
          { key: 'ptoSubmission', label: 'Install Complete to PTO Submission Date' },
          { key: 'ptoGranted', label: 'Install Complete to PTO' }
        ],
        grandTotal: ptoSubmissionGrandTotal
      }, {
        title: 'Install Complete to PTO Granted',
        data: ptoGrantedData,
        columns: [
          { key: 'week', label: 'Week of Completion' },
          { key: 'ptoSubmission', label: 'Install Complete to PTO Submission Date' },
          { key: 'ptoGranted', label: 'Install Complete to PTO' }
        ],
        grandTotal: ptoGrantedGrandTotal
      }].map((section, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div style={{ flex: 2, marginRight: '20px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>{section.title}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={section.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  label={{ value: 'Week', position: 'insideBottomRight', offset: -5 }}
                  tickCount={52}
                />
                <YAxis
                  domain={[0, 'auto']}
                  label={{ value: section.columns.some(col => col.key === 'ptoSubmission') ? 'Days' : 'Customer', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                {section.columns.some(col => col.key === 'ptoSubmission') ? (
                  <>
                    <Line type="monotone" dataKey="ptoSubmission" stroke="#4285F4" name="PTO Submission" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="ptoGranted" stroke="#34A853" name="PTO Granted" activeDot={{ r: 8 }} />
                  </>
                ) : (
                  <Line type="monotone" dataKey="customer" stroke="#4285F4" activeDot={{ r: 8 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 1 }}>
            <NoPtoTable
              title={section.title}
              data={section.data}
              columns={section.columns}
              showFooter={true}  // Display the footer with grand total
            />
          </div>
        </div>
      ))}

      {/* Overall Summary Table */}
      <NoPtoTable
        title="Overall Summary"
        data={overallSummaryData}
        columns={[
          { key: 'office', label: 'Office' },
          { key: 'customerName', label: 'Customer Name' },
          { key: 'customerUniqueId', label: 'Customer Unique ID' },
          { key: 'projectStatus', label: 'Project Status' },
          { key: 'ptoStatus', label: 'PTO Status' },
          { key: 'customerQuantity', label: 'Customer Quantity' }
        ]}
        showFooter={true}  // Show grand total for overall summary table
      />
    </div>
  );
};

export default NoPto;
