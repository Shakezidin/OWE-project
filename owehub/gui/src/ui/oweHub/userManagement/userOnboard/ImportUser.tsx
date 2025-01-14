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
        'partner_id',
        'description',
      ],
      [
        'John Doe',
        'john@example.com',
        '123456789',
        'Sales Manager',
        'Sales Manager',
        'raman@example.com',
        '32822',
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

      toast.success('File processed successfully.');
      handleClose();
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
          <div style ={{justifyContent:"center", display:"flex", alignItems:"center", marginTop:'20px'}}>
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
      </form>
    </div>
  );
};

export default ImportUser;
