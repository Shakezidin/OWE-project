import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';

import { ActionButton } from '../../../components/button/ActionButton';
import { updatePayForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createPayScheduleSlice';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { useDispatch } from 'react-redux';
import {
  dealerOption,
  installerOption,
  partnerOption,
  salesTypeOption,
  stateOption,
} from '../../../../core/models/data_models/SelectDataModel';
import Select from 'react-select';
import { paySaleTypeData } from '../../../../resources/static_data/StaticData';
import { PayScheduleModel } from '../../../../core/models/configuration/create/PayScheduleModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import {
  FormEvent,
  FormInput,
} from '../../../../core/models/data_models/typesModel';
import { useAppSelector } from '../../../../redux/hooks';
import { errorSwal } from '../../../components/alert/ShowAlert';
import { addDays, format } from 'date-fns';
import { toast } from 'react-toastify';
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  payEditedData: PayScheduleModel | null;
  setRefetch: Dispatch<SetStateAction<number>>;
}

const CreatePaymentSchedule: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  payEditedData,
  setRefetch,
}) => {
  const dispatch = useDispatch();

  const [isPending, setIsPending] = useState(false);
  const [createPayData, setCreatePayData] = useState<PayScheduleModel>({
    record_id: payEditedData ? payEditedData?.record_id : 0,
    partner: payEditedData ? payEditedData?.partner : '',
    partner_name: payEditedData ? payEditedData?.partner_name : '',
    installer_name: payEditedData ? payEditedData?.installer_name : '',
    sale_type: payEditedData ? payEditedData?.sale_type : '',
    state: payEditedData ? payEditedData?.state : '',
    rl: payEditedData ? payEditedData?.rl : '',
    draw: payEditedData ? payEditedData?.draw : '',
    draw_max: payEditedData ? payEditedData?.draw_max : '',
    rep_draw: payEditedData ? payEditedData?.rep_draw : '',
    rep_draw_max: payEditedData ? payEditedData?.rep_draw_max : '',
    rep_pay: payEditedData ? payEditedData?.rep_pay : '',
    start_date: payEditedData ? payEditedData?.start_date : '',
    end_date: payEditedData ? payEditedData?.end_date : '',
  });
  const [newFormData, setNewFormData] = useState<any>([]);

  const [errors, setErrors] = useState<PayScheduleModel>(
    {} as PayScheduleModel
  );

  const tableData = {
    tableNames: ['partners', 'states', 'installers', 'sale_type',"dealer"],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  const handleValidation = () => {
    const error: PayScheduleModel = {} as PayScheduleModel;
    for (const key in createPayData) {
      if (key === 'record_id') {
        continue;
      }
      if (!createPayData[key as keyof PayScheduleModel]) {
        // @ts-ignore
        error[key as keyof PayScheduleModel] =
          `${key.replaceAll('_', ' ')} is required`;
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
  };

  const handleChange = (newValue: any, fieldName: string) => {
    setCreatePayData((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
  };
  const handlePayInputChange = (e: FormInput) => {
    let { name, value } = e.target;
    if (name === 'start_Date') {
      setCreatePayData((prevData) => ({
        ...prevData,
        [name]: value,
        end_date: '',
      }));
      return;
    }
    if (
      name === 'rl' ||
      name === 'draw' ||
      name === 'draw_max' ||
      name === 'rep_draw' ||
      name === 'rep_draw_max'
    ) {
      const sanitizedValue = value.replace(/[^0-9.]/g, '');
      value = sanitizedValue;
      setCreatePayData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      return;
    }
    setCreatePayData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitPaySchedule = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (handleValidation()) {
        setIsPending(true);
        dispatch(
          updatePayForm({
            ...createPayData,
            rl: parseFloat(createPayData.rl as string),
            draw: parseFloat(createPayData.draw as string),
            draw_max: parseFloat(createPayData.draw_max as string),
            rep_draw: parseFloat(createPayData.rep_draw as string),
            rep_draw_max: parseFloat(createPayData.rep_draw_max as string),
          })
        );
        if (createPayData.record_id) {
          const res = await postCaller(EndPoints.update_paymentschedule, {
            ...createPayData,
            rl: parseFloat(createPayData.rl as string),
            draw: parseFloat(createPayData.draw as string),
            draw_max: parseFloat(createPayData.draw_max as string),
            rep_draw: parseFloat(createPayData.rep_draw as string),
            rep_draw_max: parseFloat(createPayData.rep_draw_max as string),
          });
          if ((await res?.status) === 200) {
            handleClose();
            toast.success(res.message);
            setIsPending(false);
            setRefetch((prev) => prev + 1);
          } else {
            setIsPending(false);
            toast.error(res.message);
          }
        } else {
          const { record_id, ...cleanedFormData } = createPayData;
          const res = await postCaller(EndPoints.create_paymentschedule, {
            ...cleanedFormData,
            rl: parseFloat(createPayData.rl as string),
            draw: parseFloat(createPayData.draw as string),
            draw_max: parseFloat(createPayData.draw_max as string),
            rep_draw: parseFloat(createPayData.rep_draw as string),
            rep_draw_max: parseFloat(createPayData.rep_draw_max as string),
          });
          if ((await res?.status) === 200) {
            handleClose();
            toast.success(res.message);
            setIsPending(false);
            setRefetch((prev) => prev + 1);
          } else {
            setIsPending(false);
            toast.error('Error', res.message);
          }
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className="transparent-model">
      <form onSubmit={(e) => submitPaySchedule(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false
            ? 'Create Payment Schedule'
            : 'Update Payment Schedule'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select">Partner Name</label>
                  <SelectOption
                    options={dealerOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'partner')}
                    value={dealerOption(newFormData)?.find(
                      (option) => option.value === createPayData.partner
                    )}
                  />
                  {errors?.partner && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.partner}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">Partner Name</label>
                  <SelectOption
                    options={partnerOption(newFormData)}
                    onChange={(newValue) =>
                      handleChange(newValue, 'partner_name')
                    }
                    value={partnerOption(newFormData)?.find(
                      (option) => option.value === createPayData.partner_name
                    )}
                  />
                  {errors?.partner_name && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.partner_name}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">Installer</label>
                  <SelectOption
                    options={installerOption(newFormData)}
                    onChange={(newValue) =>
                      handleChange(newValue, 'installer_name')
                    }
                    value={installerOption(newFormData)?.find(
                      (option) => option.value === createPayData.installer_name
                    )}
                  />
                  {errors?.installer_name && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.installer_name}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select select-type-label">
                    Sales Type
                  </label>
                  <SelectOption
                    menuListStyles={{ height: '230px' }}
                    options={salesTypeOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'sale_type')}
                    value={salesTypeOption(newFormData)?.find(
                      (option) => option.value === createPayData.sale_type
                    )}
                  />
                  {errors?.sale_type && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.sale_type}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select select-type-label">
                    State
                  </label>
                  <SelectOption
                    menuListStyles={{ height: '230px' }}
                    options={stateOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'state')}
                    value={stateOption(newFormData)?.find(
                      (option) => option.value === createPayData.state
                    )}
                  />
                  {errors?.state && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.state}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Rate List"
                    value={createPayData.rl}
                    name="rl"
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.rl && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.rl}
                    </span>
                  )}
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Draw"
                    value={createPayData.draw}
                    name="draw"
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.draw && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.draw}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Draw Max"
                    value={createPayData.draw_max}
                    name="draw_max"
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.draw_max && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.draw_max}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Rep. Draw"
                    value={createPayData.rep_draw}
                    name="rep_draw"
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.rep_draw && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.rep_draw}
                    </span>
                  )}
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Rep. Max Draw"
                    value={createPayData.rep_draw_max}
                    name="rep_draw_max"
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.rep_draw_max && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.rep_draw_max}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Rep. Pay"
                    value={createPayData.rep_pay}
                    name="rep_pay"
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.rep_pay && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.rep_pay}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Start Date"
                    value={createPayData.start_date}
                    name="start_date"
                    placeholder={'1/04/2004'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.start_date && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.start_date}
                    </span>
                  )}
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="End Date"
                    value={createPayData.end_date}
                    name="end_date"
                    disabled={!createPayData.start_date}
                    min={
                      createPayData.start_date &&
                      format(
                        addDays(new Date(createPayData.start_date), 1),
                        'yyyy-MM-dd'
                      )
                    }
                    placeholder={'1/04/2004'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.end_date && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.end_date}
                    </span>
                  )}
                </div>
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
            disabled={isPending}
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreatePaymentSchedule;
