import React from 'react';
import Input from '../../../components/text_input/Input';
import SelectOption from '../../../components/selectOption/SelectOption';

interface inputSelectProps {
  onChange: any;
  formData: any;
  regionList: any[];
  handleChangeForRegion: (value: any, name: string) => void;
}

const UserBasedInput: React.FC<inputSelectProps> = ({
  formData,
  onChange,
  regionList,
  handleChangeForRegion,
}) => {
  return (
    <div className="create-input-container">
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
          <div className="create-input-field">
            <Input
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
    </div>
  );
};

export default UserBasedInput;
