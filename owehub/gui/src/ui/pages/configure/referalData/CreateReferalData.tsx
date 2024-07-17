import React, { SetStateAction, useEffect, useState } from 'react';
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
import {
  FormEvent,
  FormInput,
} from '../../../../core/models/data_models/typesModel';
import { addDays, format } from 'date-fns';
import { toast } from 'react-toastify';
import { firstCapitalize } from '../../../../utiles';

interface IError {
  // partner?: string;
  // installer?: string;
  // state?: string;
  // sale_type?: string;
  // sale_price?: number;
  // rep_type?: string;
  // rl?: number;
  // rate?: number;
  // start_date?: string;
  // end_date?: string;
  [key: string]: string;
}
interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
  commission: any;
  setRefresh: React.Dispatch<SetStateAction<number>>;
}

const CreateReferalData: React.FC<ButtonProps> = ({
  handleClose,
  commission,
  editMode,
  setRefresh,
}) => {
  const dispatch = useDispatch();

  const [createCommission, setCreateCommission] = useState({
    record_id: commission ? commission?.record_id : 0,
    unique_id: '',
    new_customer: '',
    referrer_serial: '',
    referrer_name: '',
    amount: '',
    rep_doll_divby_per: '',
    notes: '',
    start_date: '',
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

  const handleValidation = () => {
    const error: IError = {} as IError;
    for (const key in createCommission) {
      if (key === 'record_id') {
        continue;
      }
      if (!createCommission[key as keyof typeof createCommission]) {
        error[key as string] = firstCapitalize(
          `${key.replaceAll('_', ' ')} is required`
        );
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length === 0;
  };
  console.log(errors, 'errprors');

  useEffect(() => {
    if (commission) {
      setCreateCommission({
        ...createCommission,
        unique_id:commission.unique_id,
        new_customer:commission.new_customer,
        referrer_serial:commission.referrer_serial,
        referrer_name:commission.referrer_name,
        amount:commission.amount,
        notes:commission.notes,
        rep_doll_divby_per:commission.rep_doll_divby_per,
        start_date:commission.start_date,


      })
    }
  }, [commission]);

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateCommission((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
  };
  const handleInputChange = (e: FormInput) => {
    let { name, value } = e.target;
    console.log(e.target.name, 'value', e.target.value);
    if (
      name === 'rep_doll_divby_per' ||
      name === 'syz_size' ||
      name === 'rep_count' ||
      name === 'r1_pay_scale' ||
      name === 'r1_referral_credit_$'
    ) {
      const sanitizedValue = value.replace(/[^0-9.]/g, '');
      value = sanitizedValue;
    }
    if (name === 'start_date') {
      setCreateCommission((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }
    setCreateCommission((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(true);
    if (handleValidation()) {
      try {
        if (createCommission.record_id) {
          const res = await postCaller('update_referraldata', {
            record_id: commission.record_id,
            unique_id: createCommission.unique_id,
            new_customer: createCommission.new_customer,
            referrer_serial: createCommission.referrer_serial,
            referrer_name: createCommission.referrer_name,
            start_date: createCommission.start_date,
            amount: parseFloat(createCommission.amount),
            rep_doll_divby_per: parseFloat(createCommission.rep_doll_divby_per),
            notes: createCommission.notes,
          });
          if (res.status === 200) {
            handleClose();
            setRefresh((prev) => prev + 1);
          } else {
            toast.error(res.message);
          }
        } else {
          const { record_id, ...cleanedFormData } = createCommission;
          const data = {
            unique_id: createCommission.unique_id,
            new_customer: createCommission.new_customer,
            referrer_serial: createCommission.referrer_serial,
            referrer_name: createCommission.referrer_name,
            start_date: createCommission.start_date,
            amount: parseFloat(createCommission.amount),
            rep_doll_divby_per: parseFloat(createCommission.rep_doll_divby_per),
            notes: createCommission.notes,
          };
          const res = await postCaller('create_referraldata', data);
          if (res.status === 200) {
            handleClose();
            setRefresh((prev) => prev + 1);
            toast.success(res.message);
          } else {
            toast.error(res.message);
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
          {editMode === false ? 'Create Referral Data' : 'Update Referral Data'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Unique ID"
                    value={createCommission.unique_id}
                    name="unique_id"
                    placeholder={'Unique Id'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.unique_id && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.unique_id}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="New Customer"
                    value={createCommission.new_customer}
                    name="new_customer"
                    placeholder={'New Customer'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.new_customer && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.new_customer}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Referrer Serial"
                    value={createCommission.referrer_serial}
                    name="referrer_serial"
                    placeholder={'Referrer Serial'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.referrer_serial && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.referrer_serial}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Referrer Name"
                    value={createCommission.referrer_name}
                    name="referrer_name"
                    placeholder={'Referrer Name'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.referrer_name && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.referrer_name}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Amount"
                    value={createCommission.amount}
                    name="amount"
                    placeholder={'Amount'}
                    onChange={(e) => handleInputChange(e)}
                    onKeyDown={(e) => {
                      if (e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors?.amount && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.amount}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Rep $ / %"
                    value={createCommission.rep_doll_divby_per}
                    name="rep_doll_divby_per"
                    placeholder={'Rep $ / %'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.rep_doll_divby_per && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.rep_doll_divby_per = "Rep $ / % is required"}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Notes"
                    value={createCommission.notes}
                    name="notes"
                    placeholder={'Notes'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.notes && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.notes}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Start Date"
                    value={createCommission.start_date}
                    name="start_date"
                    placeholder={'Start Date'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.start_date && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.start_date}
                    </span>
                  )}
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

export default CreateReferalData;
