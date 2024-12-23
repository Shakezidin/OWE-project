import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SelectOption from '../components/selectOption/SelectOption'; // Default import for SelectOption
import styles from './NoPto.module.css'; // Assuming you have a CSS module for styling

// Define Option type if it's not declared already
interface Option {
  label: string;
  value: string;
}

// TableData Component with support for 6 columns for Overall Summary
const TableData = ({ data, title, isSummary = false }: { data: any[]; title: string; isSummary?: boolean }) => {
  const total = data.reduce((sum, item) => sum + item.customer, 0);

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>{title}</h3>
      <div
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                Week of Completion
              </th>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f9f9f9' }}>
                Customer
              </th>
              {isSummary && (
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
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Week {item.week}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.customer}</td>
                {isSummary && (
                  <>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.customerUniqueId}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.projectStatus}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.ptoStatus}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.customerQuantity}</td>
                  </>
                )}
              </tr>
            ))}
            {isSummary && (
              <tr>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    fontWeight: 'bold',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  Grand Total
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    fontWeight: 'bold',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  {total}
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    fontWeight: 'bold',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  {/* Add placeholder for Customer Unique ID */}
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    fontWeight: 'bold',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  {/* Add placeholder for Project Status */}
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    fontWeight: 'bold',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  {/* Add placeholder for PTO Status */}
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    fontWeight: 'bold',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  {/* Add placeholder for Customer Quantity */}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// NoPto Component to handle the data and select dropdowns
function NoPto() {
  // Generate dummy data for 51 weeks
  const generateData = (multiplier: number) =>
    Array.from({ length: 51 }, (_, index) => ({
      week: index + 1,
      customer: Math.floor(Math.random() * 100 * multiplier) + 50,
    }));

  // New data structure for Overall Summary with 6 columns
  const overallSummaryData = Array.from({ length: 51 }, (_, index) => ({
    week: index + 1,
    customer: Math.floor(Math.random() * 100 * 1) + 50,
    customerUniqueId: `ID-${index + 1}`,
    projectStatus: 'Completed',
    ptoStatus: 'Granted',
    customerQuantity: Math.floor(Math.random() * 10) + 1,
  }));

  const data1 = generateData(1);
  const data2 = generateData(1.5);
  const data3 = generateData(2);
  const data4 = generateData(1);

  // State for managing selected values in the dropdowns
  const [statusValue, setStatusValue] = useState<Option | undefined>(undefined);
  const [weekValue, setWeekValue] = useState<Option | undefined>(undefined);
  const [officeValue, setOfficeValue] = useState<Option | undefined>(undefined);

  // Options for SelectOption components
  const statusOptions: Option[] = [
    { label: 'Submitted / Scheduled', value: 'submitted_scheduled' },
    { label: 'Resubmitted / Rescheduled', value: 'resubmitted_rescheduled' },
    { label: 'Ready for Resubmission', value: 'ready_for_resubmission' },
    { label: 'REDLINED', value: 'redlined' },
    { label: 'Pending Submission - Utility', value: 'pending_submission_utility' },
    { label: 'Pending Labels / Fieldwork / CAD / Photos', value: 'pending_labels_fieldwork_cad_photos' },
    { label: 'Pending IC', value: 'pending_ic' },
    { label: 'Pending Grid profile from Tesla NM', value: 'pending_grid_profile_tesla_nm' },
    { label: 'Pending FIN tag / Clearance / Inspection result', value: 'pending_fin_tag_clearance_inspection_result' },
    { label: 'Pending Documents', value: 'pending_documents' },
    { label: 'PTO!', value: 'pto' },
    { label: 'PTO Overdue', value: 'pto_overdue' },
    { label: 'Not Ready for PTO Yet', value: 'not_ready_for_pto_yet' },
    { label: 'only', value: 'only' },
    { label: 'Needs Review', value: 'needs_review' },
    { label: 'NEW Utility - Working with utility', value: 'new_utility_working_with_utility' },
    { label: 'DUPLICATE', value: 'duplicate' },
    { label: 'CANCELLED', value: 'cancelled' },
    { label: 'AHJ Redlined - Send to RAT', value: 'ahj_redlined_send_to_rat' },
    { label: 'null', value: 'null' },
  ];

  const weekOptions: Option[] = Array.from({ length: 51 }, (_, index) => ({
    label: `${(index + 1).toString().padStart(2, '0')}-2024`,
    value: `${(index + 1).toString().padStart(2, '0')}-2024`,
  }));

  const officeOptions: Option[] = [
    { label: 'Tucson', value: 'tucson' },
    { label: 'Texas', value: 'texas' },
    { label: 'Tempe', value: 'tempe' },
    { label: 'Peoria/Kingman', value: 'peoria_kingman' },
    { label: 'Colorado', value: 'colorado' },
    { label: 'Albuquerque/El Paso', value: 'albuquerque_el_paso' },
    { label: '#N/A', value: 'na' },
    { label: 'null', value: 'null' },
  ];

  return (
    <div className={styles.main_container} style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Install Completed (No PTO Granted Date within 30 Days)</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <SelectOption
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
          />
        </div>
      </div>

      {/* Sections */}
      {[{ title: 'Weekly (Overall)', data: data1 },
        { title: 'Weekly (Office)', data: data2 },
        { title: 'Install Complete to PTO Submission', data: data3 },
        { title: 'Install Complete to PTO Granted', data: data4 },
      ].map((section, index) => (
        <div
          key={index}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}
        >
          {/* Line Chart */}
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
                  domain={[50, Math.max(...section.data.map((d) => d.customer)) + 50]}
                  ticks={[50, 100, 150, 200, 250, 300]}
                  label={{ value: 'Customer', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="customer" stroke="#4285F4" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Table Component */}
          <div style={{ flex: 1 }}>
            <TableData title={section.title} data={section.data} />
          </div>
        </div>
      ))}

      {/* Table Section for Overall Summary */}
      <div style={{ width: '100%', marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <TableData title="Overall Summary" data={overallSummaryData} isSummary={true} />
      </div>
    </div>
  );
}

export default NoPto;
