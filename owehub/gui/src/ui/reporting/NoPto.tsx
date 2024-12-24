import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SelectOption from '../components/selectOption/SelectOption';
import styles from './NoPto.module.css';
import YearSelect from './components/Dropdowns/YearSelect';
import WeekSelect from './components/Dropdowns/WeekSelect';
import DaySelect from './components/Dropdowns/DaySelect';
import CompanySelect from './components/Dropdowns/CompanySelect';
import PTOStatus from './components/Dropdowns/PtoStatus';

interface Option {
  label: string;
  value: string;
}

const TableData = ({ 
  data, 
  title, 
  isSummary = false,
  isPtoTable = false 
}: { 
  data: any[]; 
  title: string; 
  isSummary?: boolean;
  isPtoTable?: boolean;
}) => {
  // Calculate totals based on table type
  const customerTotal = data.reduce((sum, item) => sum + item.customer, 0);
  const customerQuantityTotal = data.reduce((sum, item) => sum + (item.customerQuantity || 0), 0);
  const ptoSubmissionTotal = data.reduce((sum, item) => sum + (item.ptoSubmission || 0), 0);
  const ptoGrantedTotal = data.reduce((sum, item) => sum + (item.ptoGranted || 0), 0);

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>{title}</h3>
      <div style={{
        height: '400px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr>
              {isSummary ? (
                <>
                  <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                    Office
                  </th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                    Customer Name
                  </th>
                </>
              ) : (
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                  Week of Completion
                </th>
              )}
              {isPtoTable ? (
                <>
                  <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                    Install Complete to PTO Submission Date
                  </th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                    Install Complete to PTO
                  </th>
                </>
              ) : !isSummary ? (
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                  Customer
                </th>
              ) : (
                <>
                  <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                    Customer Unique ID
                  </th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                    Project Status
                  </th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                    PTO Status
                  </th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                    Customer Quantity
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {isSummary ? (
                  <>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.office}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.customerName}</td>
                  </>
                ) : (
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Week {item.week}</td>
                )}
                {isPtoTable ? (
                  <>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.ptoSubmission}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.ptoGranted}</td>
                  </>
                ) : !isSummary ? (
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.customer}</td>
                ) : (
                  <>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.customerUniqueId}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.projectStatus}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.ptoStatus}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.customerQuantity}</td>
                  </>
                )}
              </tr>
            ))}
            <tr>
              {isSummary ? (
                <>
                  <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                    Grand Total
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}></td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}></td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}></td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}></td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                    {customerQuantityTotal}
                  </td>
                </>
              ) : (
                <>
                  <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                    Grand Total
                  </td>
                  {isPtoTable ? (
                    <>
                      <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                        {ptoSubmissionTotal}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                        {ptoGrantedTotal}
                      </td>
                    </>
                  ) : (
                    <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                      {customerTotal}
                    </td>
                  )}
                </>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

function NoPto() {
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

  return (
    <div className={styles.main_container} style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Install Completed (No PTO Granted Date within 30 Days)</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* <SelectOption
            options={statusOptions}
            value={statusValue}
            onChange={(newValue: Option | null) => setStatusValue(newValue ?? undefined)}
          />
          <SelectOption
            options={weekOptions}
            value={weekValue}
            onChange={(newValue: Option | null) => setWeekValue(newValue ?? undefined)}
          />
          <SelectOption
            options={officeOptions}
            value={officeValue}
            onChange={(newValue: Option | null) => setOfficeValue(newValue ?? undefined)}
          /> */}
          <div><YearSelect /></div>
          <div><WeekSelect /></div>
          {/* <div><DaySelect /></div> */}
          <div><CompanySelect /></div>
          <div><PTOStatus /></div>

        </div>
      </div>

      {/* Weekly sections */}
      {[
        { title: 'Weekly (Overall)', data: weeklyData, isPtoTable: false },
        { title: 'Weekly (Office)', data: officeData, isPtoTable: false },
        { title: 'Install Complete to PTO Submission', data: ptoSubmissionData, isPtoTable: true },
        { title: 'Install Complete to PTO Granted', data: ptoGrantedData, isPtoTable: true },
      ].map((section, index) => (
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
                  label={{ value: section.isPtoTable ? 'Days' : 'Customer', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                {section.isPtoTable ? (
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
            <TableData 
              title={section.title} 
              data={section.data} 
              isPtoTable={section.isPtoTable}
            />
          </div>
        </div>
      ))}

      {/* Overall Summary Table */}
      <div style={{ width: '100%', marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <TableData 
          title="Overall Summary" 
          data={overallSummaryData} 
          isSummary={true}
        />
      </div>
    </div>
  );
}

export default NoPto;