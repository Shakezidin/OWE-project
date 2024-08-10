import React, { useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { updateAdderV } from '../../../../redux/apiSlice/configSlice/config_post_slice/createAdderVSlice';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { useAppDispatch } from '../../../../redux/hooks';

import { adderTypeOption } from '../../../../core/models/data_models/SelectDataModel';
import { priceTypeData } from '../../../../resources/static_data/StaticData';
import { AdderVModel } from '../../../../core/models/configuration/create/AdderVModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import { validateConfigForm } from '../../../../utiles/configFormValidation';
import { errorSwal, successSwal } from '../../../components/alert/ShowAlert';
import { fetchAdderV } from '../../../../redux/apiSlice/configSlice/config_get_slice/adderVSlice';
import { FormEvent } from '../../../../core/models/data_models/typesModel';
interface vadderProps {
  editMode: boolean;
  handleClose: () => void;
  vAdderData: AdderVModel | null;
  pageNumber: number;
  pageSize: number;
}
const CreateAdder: React.FC<vadderProps> = ({
  editMode,
  handleClose,
  pageNumber,
  pageSize,
  vAdderData,
}) => {
  const dispatch = useAppDispatch();
  console.log(vAdderData);
  const [createAdderV, setCreateAdderV] = useState<AdderVModel>({
    record_id: vAdderData ? vAdderData?.record_id : 0,
    adder_name: vAdderData ? vAdderData?.adder_name : '',
    adder_type: vAdderData ? vAdderData?.adder_type : '',
    price_type: vAdderData ? vAdderData?.price_type : '',
    price_amount: vAdderData ? vAdderData?.price_amount : '',
    active: vAdderData ? vAdderData?.active : 1,
    description: vAdderData
      ? vAdderData?.description
      : 'This is an example description',
  });

  const [newFormData, setNewFormData] = useState<any>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const tableData = {
    tableNames: ['adder_type', 'price_type'],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateAdderV((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '',
    }));
  };
  const handleAdderChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateAdderV((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };
  const page = {
    page_number: pageNumber,
    page_size: pageSize,
  };
  const submitMarketingFees = async (e: FormEvent) => {
    e.preventDefault();
    const validationRules = {
      adder_name: [
        {
          condition: (value: any) => !!value,
          message: 'Adder Name is required',
        },
      ],
      adder_type: [
        {
          condition: (value: any) => !!value,
          message: 'Adder Type is required',
        },
      ],
      description: [
        {
          condition: (value: any) => !!value,
          message: 'Description is required',
        },
      ],
      price_amount: [
        {
          condition: (value: any) => !!value,
          message: 'Price Amount is required',
        },
      ],
      price_type: [
        {
          condition: (value: any) => !!value,
          message: 'Price Type is required',
        },
      ],
    };
    const { isValid, errors } = validateConfigForm(
      createAdderV!,
      validationRules
    );
    if (!isValid) {
      setErrors(errors);
      return;
    }
    try {
      dispatch(updateAdderV(createAdderV));
      if (createAdderV.record_id) {
        const res = await postCaller(EndPoints.update_vadders, createAdderV);
        if (res.status === 200) {
          await successSwal('', res.message);
          handleClose();
          dispatch(fetchAdderV(page));
        } else {
          await errorSwal('', res.message);
        }
      } else {
        const { record_id, ...cleanedFormData } = createAdderV;
        const res = await postCaller(EndPoints.create_vadder, cleanedFormData);
        if (res.status === 200) {
          await successSwal('', res.message);
          handleClose();
        } else {
          await errorSwal('', res.message);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className="transparent-model">
      <form onSubmit={(e) => submitMarketingFees(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>
        <h3 className="createProfileText">
          {editMode === false ? 'Adder' : 'Update Adder'}
        </h3>
        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="rate-input-field">
                  <Input
                    type={'text'}
                    label="Adder Name"
                    value={createAdderV.adder_name}
                    name="adder_name"
                    placeholder={'Enter'}
                    onChange={(e) => handleAdderChange(e)}
                  />
                  {errors.adder_name && (
                    <span className="error">{errors.adder_name}</span>
                  )}
                </div>
                <div className=" rate-input-field">
                  <label className="inputLabel-select">Adder Type</label>
                  <SelectOption
                    options={adderTypeOption(newFormData)}
                    onChange={(newValue) =>
                      handleChange(newValue, 'adder_type')
                    }
                    value={adderTypeOption(newFormData)?.find(
                      (option) => option.value === createAdderV.adder_type
                    )}
                  />
                  {errors.adder_type && (
                    <span className="error">{errors.adder_type}</span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="rate-input-field">
                  <Input
                    type={'text'}
                    label="Price Amount"
                    value={createAdderV.price_amount}
                    name="price_amount"
                    placeholder={'Amount'}
                    onChange={(e) => handleAdderChange(e)}
                  />
                  {errors.price_amount && (
                    <span className="error">{errors.price_amount}</span>
                  )}
                </div>
                <div className=" rate-input-field">
                  <label className="inputLabel-select">Price Type</label>
                  <SelectOption
                    options={priceTypeData}
                    onChange={(newValue) =>
                      handleChange(newValue, 'price_type')
                    }
                    value={priceTypeData?.find(
                      (option) => option.value === createAdderV.price_type
                    )}
                  />
                  {errors.price_type && (
                    <span className="error">{errors.price_type}</span>
                  )}
                </div>
              </div>
              <div className="create-input-field-note">
                <label htmlFor="" className="inputLabel">
                  Note
                </label>{' '}
                <br />
                <textarea
                  name="description"
                  id=""
                  rows={4}
                  value={createAdderV.description}
                  onChange={(e) => handleAdderChange(e)}
                  placeholder="Type"
                ></textarea>
                {errors.description && (
                  <span className="error">{errors.description}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="createUserActionButton">
          <ActionButton
            title={'Cancel'}
            type="reset"
            onClick={() => handleClose()}
          />
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

export default CreateAdder;
