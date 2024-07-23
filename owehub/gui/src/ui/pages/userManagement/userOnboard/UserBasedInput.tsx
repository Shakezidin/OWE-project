import React, { useEffect, useState } from 'react';
import Input from '../../../components/text_input/Input';
import SelectOption from '../../../components/selectOption/SelectOption';
import axios from 'axios';
import { dealerOption, teamsOption } from '../../../../core/models/data_models/SelectDataModel';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';

interface inputSelectProps {
  onChange: any;
  formData: any;
  regionList: any[];
  handleChangeForRegion: (value: any, name: string) => void;
  handleChangeForDealer?: (value: any, name: string) => void;
  setLogoUrl: any
}

const UserBasedInput: React.FC<inputSelectProps> = ({
  formData,
  onChange,
  regionList,
  handleChangeForRegion,
  handleChangeForDealer,
  setLogoUrl
}) => {


  const [files, setFiles] = useState<FileList | null>(null);
  const [newFormData, setNewFormData] = useState<any>([]);
  const [delaerVal, setDealerVal] = useState('');
  const [dealer, setDealer] = useState<{ [key: string]: any }>({});

  const getnewformData = async () => {
    const tableData = {
      tableNames: ['dealer', 'teams'],
    };
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setDealer((prev) => ({ ...prev, ...res.data }));
  };
  useEffect(() => {
    getnewformData();
  }, []);

  useEffect(() => {
    if (dealer) {
      console.log(dealer, 'dealer');

      setNewFormData((prev: any) => ({ ...prev, ...dealer }));
    }
  }, [dealer]);

  console.log(delaerVal, "selected options")


  return (
    <>
      {formData?.role_name === 'Regional Manager' && (
        <div className="create-input-field">
          <Input
            type={'text'}
            label="Region"
            value={formData.add_region}
            placeholder={'Region'}
            onChange={(e) => onChange(e)}
            name={'add_region'}
          />
        </div>
      )}
      {formData?.role_name === 'Sale Representative' && (
        <>
          <div className="create-input-field">
            <label className="inputLabel selected-fields-onboard">
              Report to
            </label>
            <SelectOption
              options={regionList}
              onChange={(newValue) =>
                handleChangeForRegion(newValue, 'report_to')
              }
              value={regionList?.find(
                (option) => option?.value === formData.report_to
              )}
            />
          </div>
          <div className="create-input-field" style={{marginTop: "4px"}}>
            {/* <Input
              type={'text'}
              label="Team Name"
              value={formData.team_name}
              placeholder={'Team Name'}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Allow only letters and spaces
                if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                  onChange(e);
                }
              }}
              name={'team_name'}
              maxLength={150}
            /> */}

            <label className="inputLabel-select select-type-label">
              Team Name
            </label>
            <SelectOption
              options={teamsOption(newFormData)}
              onChange={(newValue) =>
                handleChangeForRegion(newValue, 'team_name')
              }
              value={teamsOption(newFormData)?.find(
                (option) => option?.value === formData.team_name
              )}
             />

          </div>
        </>
      )}
      {formData?.role_name === 'Sales Manager' && (
        <>
          <div className="create-input-field">
            <label className="inputLabel selected-fields-onboard">
              Report to
            </label>
            <SelectOption
              options={regionList}
              onChange={(newValue) =>
                handleChangeForRegion(newValue, 'report_to')
              }
              value={regionList?.find(
                (option) => option?.value === formData.report_to
              )}
            />
          </div>
        </>
      )}
      {formData?.role_name === 'Dealer Owner' && (
        <>

          <div className="create-input-field">
            <label className="inputLabel-select select-type-label">
              Dealer
            </label>
            <SelectOption
              options={dealerOption(newFormData)}
              onChange={(newValue) =>
                handleChangeForRegion(newValue, 'dealer')
              }
              value={dealerOption(newFormData)?.find(
                (option) => option?.value === formData.dealer
              )}
            />
          </div>



          {/* <div className="file-input-container">
              <input
                type="file"
                className="file-input"
                accept=".jpg, .jpeg, .png"
                onChange={async (e) => {
                  const selectedFiles = e.target.files;
                  setFiles(selectedFiles); // Update the files state variable
                  if (selectedFiles && selectedFiles.length > 0) {
                    const file = selectedFiles[0];
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', 'xdfcmcf4');
                    formData.append('cloud_name', 'duscqq0ii');

                    try {
                      const response = await axios.post(
                        `https://api.cloudinary.com/v1_1/duscqq0ii/image/upload`,
                        formData
                      );
                      const logoUrl = response.data.secure_url;
                      // Append the logoUrl to formData.dealer_logo
                      formData.append('dealer_logo', logoUrl);
                      console.log('Logo URL:', logoUrl);
                    } catch (error) {
                      console.error('Error uploading logo:', error);
                    }
                  }
                }}
              />
              <div className="custom-button-container">
                <span className="file-input-placeholder">
                  {files && files.length > 0
                    ? `${files[0].name.slice(0, 10)}...`
                    : '.jpg .jpeg .png'}
                </span>
                <button className="custom-button">Browse</button>
              </div>
            </div> */}

          <div className="create-input-field">
            <label className="inputLabel">
              <p>Attach Logo</p>
            </label>
            <div className="file-input-container">
              <input
                type="file"
                className="file-input"
                accept=".jpg, .jpeg, .png"
                onChange={async (e) => {
                  const selectedFiles = e.target.files;
                  setFiles(selectedFiles); // Update the files state variable
                  if (selectedFiles && selectedFiles.length > 0) {
                    const file = selectedFiles[0];
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', 'xdfcmcf4');
                    formData.append('cloud_name', 'duscqq0ii');

                    try {
                      const response = await axios.post(
                        `https://api.cloudinary.com/v1_1/duscqq0ii/image/upload`,
                        formData
                      );
                      const url = response.data.secure_url;
                      // Store the logoUrl in the formData state
                      setLogoUrl(url);

                    } catch (error) {
                      console.error('Error uploading logo:', error);
                    }
                  }
                }}
              />
              <div className="custom-button-container">
                <span className="file-input-placeholder">
                  {files && files.length > 0
                    ? `${files[0].name.slice(0, 10)}...`
                    : '.jpg .jpeg .png'}
                </span>
                <button className="custom-button">Browse</button>
              </div>
            </div>
          </div>

        </>
      )}
    </>
  );
};

export default UserBasedInput;
