import React, { useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { useDispatch } from 'react-redux';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import Select from 'react-select';
import {
  installerOption,
  partnerOption,
  repTypeOption,
  stateOption,
} from '../../../../core/models/data_models/SelectDataModel';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { respTypeData } from '../../../../resources/static_data/StaticData';
import { updateForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createCommissionSlice';
import { CommissionModel } from '../../../../core/models/configuration/create/CommissionModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import { FormEvent, FormInput } from '../../../../core/models/data_models/typesModel';

interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
  commission: CommissionModel | null;
}

interface IError {
  record_id?: string;
  partner?: string;
  installer?: string;
  state?: string;
  sale_type?: string;
  rep_type: string;
  rl: string;
  rate: string;
  sale_price?: string;
  end_date?: string;
  start_date: string;
}

const CreateRebateData: React.FC<ButtonProps> = ({
  handleClose,
  commission,
  editMode,
}) => {
  const dispatch = useDispatch();

  const [createCommission, setCreateCommission] = useState({
    record_id: commission ? commission?.record_id : 0,
    partner: commission ? commission?.partner : 'OWE',
    installer: commission ? commission?.installer : 'OWE',
    state: commission ? commission?.state : 'Alaska',
    sale_type: commission ? commission?.sale_type : 'BATTERY',
    sale_price: commission ? commission?.sale_price : 1500.0,
    rep_type: commission ? commission?.rep_type : 'EMPLOYEE',
    rl: commission ? commission?.rl : 0.5,
    rate: commission ? commission?.rate : 0.1,
    start_date: commission ? commission?.start_date : '2024-04-01',
    end_date: commission ? commission?.end_date : '2024-06-30',
  });
  const [newFormData, setNewFormData] = useState<any>([]);
  const [errors, setErrors] = useState<IError>({} as IError);
  const tableData = {
    tableNames: ['partners', 'states', 'installers', 'rep_type'],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  useEffect(() => {
    if (commission) {
      setCreateCommission(commission);
    }
  }, [commission]);

  const handleValidation = () => {
    const error: IError = {} as IError;
    for (const key in createCommission) {
      if (key === 'record_id') {
        continue;
      }
      if (!createCommission[key as keyof IError]) {
        error[key as keyof IError] = `${key.toLocaleLowerCase()} is required`;
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length === 0;
  };

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateCommission((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
  };
  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    if (name === 'end_date') {
      if (createCommission.start_date && value < createCommission.start_date) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          end_date: 'End date cannot be before the start date',
        }));
        return;
      }
    }
    setCreateCommission((prevData) => ({
      ...prevData,
      [name]:
        name === 'rl' || name === 'sale_price' || name === 'rate'
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      try {
        dispatch(updateForm(createCommission));
        if (createCommission.record_id) {
          const res = await postCaller(
            EndPoints.update_commission,
            createCommission
          );
          if (res.status === 200) {
            handleClose();
            window.location.reload();
          } else {
            alert(res.message);
          }
        } else {
          const { record_id, ...cleanedFormData } = createCommission;
          const res = await postCaller(
            EndPoints.create_commission,
            cleanedFormData
          );
          if (res.status === 200) {
            handleClose();
            // window.location.reload()
          } else {
            alert(res.message);
          }
        }

        // dispatch(resetForm());
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };
  return (
    <div className="transparent-model">
      <form action="" onSubmit={(e) => handleSubmit(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? 'Create Rebate Data' : 'Update Rebate Data'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select">Partner</label>
                  <SelectOption
                    options={partnerOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'partner')}
                    value={partnerOption(newFormData)?.find(
                      (option) => option?.value === createCommission.partner
                    )}
                  />
                  {errors?.partner && (
                    <span style={{ display: 'block', color: '#FF204E' }}>
                      {errors.partner}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">Installer</label>
                  <div className="">
                    <SelectOption
                      options={installerOption(newFormData)}
                      onChange={(newValue) =>
                        handleChange(newValue, 'installer')
                      }
                      value={installerOption(newFormData)?.find(
                        (option) => option.value === createCommission.installer
                      )}
                    />
                    {errors?.installer && (
                      <span style={{ display: 'block', color: '#FF204E' }}>
                        {errors.installer}
                      </span>
                    )}
                  </div>
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">State</label>
                  <SelectOption
                    options={stateOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'state')}
                    value={stateOption(newFormData)?.find(
                      (option) => option.value === createCommission.state
                    )}
                  />
                  {errors?.state && (
                    <span style={{ display: 'block', color: '#FF204E' }}>
                      {errors.state}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Sales Type"
                    value={createCommission.sale_type}
                    name="sale_type"
                    placeholder={'Sales Type'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.sale_type && (
                    <span style={{ display: 'block', color: '#FF204E' }}>
                      {errors.sale_type.replace('sale_type', 'sale type')}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Sales Price"
                    value={createCommission.sale_price}
                    name="sale_price"
                    placeholder={'sale price'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.sale_price && (
                    <span style={{ display: 'block', color: '#FF204E' }}>
                      {errors.sale_price.replace('sale_price', 'sale price')}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">
                    Representative Type
                  </label>
                  <SelectOption
                    options={repTypeOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'rep_type')}
                    value={repTypeOption(newFormData)?.find(
                      (option) => option.value === createCommission.rep_type
                    )}
                  />
                  {errors?.rep_type && (
                    <span style={{ display: 'block', color: '#FF204E' }}>
                      {errors.rep_type.replace(
                        'rep_type',
                        'Representative Type'
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="create-input-container">
                <div className="rate-input-container">
                  <div className="rate-input-field">
                    <Input
                      type={'number'}
                      label="Rate"
                      value={createCommission.rate}
                      name="rate"
                      placeholder={'Rate'}
                      onChange={(e) => handleInputChange(e)}
                    />
                    {errors?.rate && (
                      <span style={{ display: 'block', color: '#FF204E' }}>
                        {errors.rate}
                      </span>
                    )}
                  </div>
                  <div className="rate-input-field">
                    <Input
                      type={'number'}
                      label="Rate List"
                      value={createCommission.rl}
                      name="rl"
                      placeholder={'Rate List'}
                      onChange={(e) => handleInputChange(e)}
                    />
                    {errors?.rl && (
                      <span style={{ display: 'block', color: '#FF204E' }}>
                        {errors.rl.replace('rl', 'Rate List')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="start-input-container">
                  <div className="rate-input-field">
                    <Input
                      type={'date'}
                      label="Start Date"
                      value={createCommission.start_date}
                      name="start_date"
                      placeholder={'1/04/2004'}
                      onChange={(e) => handleInputChange(e)}
                    />
                    {errors?.start_date && (
                      <span style={{ display: 'block', color: '#FF204E' }}>
                        {errors.start_date.replace('start_date', 'start date ')}
                      </span>
                    )}
                  </div>
                  <div className="rate-input-field">
                    <Input
                      type={'date'}
                      label="End Date"
                      value={createCommission.end_date}
                      name="end_date"
                      placeholder={'10/04/2004'}
                      onChange={(e) => handleInputChange(e)}
                    />
                    {errors?.end_date && (
                      <span style={{ display: 'block', color: '#FF204E' }}>
                        {errors.end_date.replace('end_date', 'end date ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="createUserActionButton">
          <ActionButton title={'Cancel'} type="button" onClick={handleClose} />
          <ActionButton
            title={editMode === false ? 'Save' : 'Update'}
            type="submit"
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateRebateData;
