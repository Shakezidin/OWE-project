import React, { Dispatch, SetStateAction, useState, useRef } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import { ActionButton } from '../../../components/button/ActionButton';
import { useAppDispatch } from '../../../../redux/hooks';
import { createUserOnboarding } from '../../../../redux/apiActions/auth/createUserSliceActions';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import { unwrapResult } from '@reduxjs/toolkit';
import MicroLoader from '../../../components/loader/MicroLoader';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import './Userboard.css';

interface createUserProps {
  handleClose: () => void;
  onSubmitCreateUser: (e: any) => void;
  tablePermissions: {};
}

const ImportUser: React.FC<createUserProps> = ({
  handleClose,
  tablePermissions,
}) => {
  const dispatch = useAppDispatch();
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any | null>(null); // State for API response report
  const [reportView, setReportView] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;

      // Check if the uploaded file is a CSV
      if (fileExtension !== 'csv' || mimeType !== 'text/csv') {
        toast.error('Please upload a valid CSV file.');
        event.target.value = ''; // Clear the file input
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').map((row) => row.split(','));
        setCsvData(rows);
        console.log('Parsed CSV Data:', rows);
      };
      reader.readAsText(file);
    }
  };

  const downloadSampleSheet = () => {
    const sampleData = [
      [
        'name',
        'email_id',
        'mobile_number',
        'designation',
        'role_name',
        'reporting_manager',
        'partner_name',
        'description',
      ],
      [
        'John Doe',
        'john@example.com',
        '123456789',
        'Sales Manager',
        'Sales Manager',
        'raman@example.com',
        'Partner Name',
        'sample description',
      ],
    ];
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      sampleData.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sample_format.csv');
    document.body.appendChild(link); // Required for Firefox
    link.click();
  };

  const processRows = async () => {
    setLoading(true);
    try {
      if (!fileInputRef.current || !fileInputRef.current.files?.[0]) {
        toast.error('No file selected. Please upload a CSV file.');
        setLoading(false);
        return;
      }

      // Create FormData to include the file
      const formData = new FormData();
      formData.append('file', fileInputRef.current.files[0]);

      // Send the FormData to the API using postCaller
      const response = await postCaller('bulk_import_users_csv', formData);

      // Handle response
      if (response.status > 201) {
        toast.error(response.message || 'Failed to process the file.');
        setLoading(false);

        return;
      }
      setReportView(true);
      setReport(response.data);
      console.log(response.data, 'report');
      toast.success('File processed successfully.');
      // Save response data to state
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(
        (error as Error).message ||
          'An error occurred while processing the file.'
      );
    } finally {
      setLoading(false);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="transparent-model">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        processRows();
      }}
      className="modal"
    >
      {reportView ? (
         <div className="report-section" style={{
          borderRadius: '10px',
          padding: '20px 30px',
          margin: '0 auto',
          textAlign: 'left',
        }}>
          <div
            className="createUserCrossButton"
            onClick={handleClose}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <CROSS_BUTTON style={{ cursor: 'pointer', width: '24px', height: '24px' }} />
          </div>
          <h3 style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            marginBottom: '20px',
            color: '#333',
          }}>
            Import Report
          </h3>
          <div
            className="report-content"
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              color: '#555',
              marginBottom: '20px',
            }}
          >
            <p>Total Processed: <strong>{report?.total_processed}</strong></p>
            <p>Successful: <strong style={{ color: '#28a745' }}>{report?.successful}</strong></p>
            <p>Failed: <strong style={{ color: '#dc3545' }}>{report?.failed}</strong></p>
          </div>
          {report?.errors && report?.errors.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{
                fontSize: '1.2rem',
                marginBottom: '10px',
                color: '#d9534f',
              }}>
                Errors:
              </h5>
              <ul style={{
                listStyleType: 'disc',
                paddingLeft: '40px',
                color: '#555',
                maxHeight: "200px", // Limit height for scrolling
                overflowY: "auto", // Scroll if too many errors
              }}>
                {report.errors.map((error: string, index: number) => (
                  <li key={index} style={{ marginBottom: '8px' }}>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="um-createUserActionButton" style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '180px',
          }}>
            <ActionButton
              title="Close"
              onClick={handleClose}
              type="button"
              style={{
                padding: '10px 20px',
                fontSize: '1rem',
                borderRadius: '5px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              }}
            />
          </div>
        </div>
        
      ) : (
        <>
          <div className="createUserCrossButton" onClick={handleClose}>
            <CROSS_BUTTON />
          </div>

          <div className="modal-headerr">
            <h3 className="createProfileText">Import Users</h3>
            <button
              type="button"
              className="download-button"
              onClick={downloadSampleSheet}
            >
              Download Sample Format
            </button>
          </div>
          {loading ? (
            <div
              style={{
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <MicroLoader />
            </div>
          ) : (
            <>
              <div className="modal-bodyy">
                <div className="upload-container">
                  <label htmlFor="csvFile" className="upload-label">
                    Upload CSV File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="csvFile"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="upload-input"
                  />
                  <small className="upload-warning">
                    *Please add only CSV files and make sure to follow the sample
                    format.
                  </small>
                </div>
              </div>
              <div className="um-createUserActionButton">
                <ActionButton
                  title="Cancel"
                  onClick={handleClose}
                  type="button"
                />
                <ActionButton
                  title="Submit"
                  onClick={processRows}
                  type="button"
                />
              </div>
            </>
          )}
        </>
      )}
    </form>
  </div>
  );
};

export default ImportUser;
