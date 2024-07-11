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
    type: '',
    rep_1_name: '',
    rep_2_name: '',
    sys_size: '',
    rep_count: '',
    state: '',
    per_rep_addr_share: '',
    per_rep_ovrd_share: '',
    r1_pay_scale: '',
    r1_referral_credit_$: '',
    r1_referral_credit_perc: '',
    r1_addr_resp: '',
    r2_pay_scale: '',
    r2_referral_credit_$: '',
    r2_referral_credit_perc: '',
    r2_addr_resp: '',
    start_date: '',
    end_date: '',
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
      setCreateCommission(commission);
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
    console.log(e.target.name,"value",e.target.value);
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
        end_date: '',
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
    if (handleValidation()) {
      try {
        if (createCommission.record_id) {
          const res = await postCaller('update_referraldata', {
            ...createCommission,
            rep_doll_divby_per: parseFloat(createCommission.rep_doll_divby_per),
            sys_size: parseFloat(createCommission.sys_size),
            rep_count: parseFloat(createCommission.rep_count),
            r1_pay_scale: parseFloat(createCommission.r1_pay_scale),
            r2_pay_scale: parseFloat(createCommission.r2_pay_scale),
            per_rep_addr_share: parseFloat(createCommission.per_rep_addr_share),
            per_rep_ovrd_share: parseFloat(createCommission.per_rep_ovrd_share),
          });
          if (res.status === 200) {
            handleClose();
            setRefresh((prev) => prev + 1);
          } else {
            toast.error(res.message);
          }
        } else {
          const { record_id, ...cleanedFormData } = createCommission;
          const res = await postCaller('create_referraldata', {
            ...cleanedFormData,
            rep_doll_divby_per: parseFloat(cleanedFormData.rep_doll_divby_per),
            sys_size: parseFloat(cleanedFormData.sys_size),
            rep_count: parseFloat(cleanedFormData.rep_count),
            r1_pay_scale: parseFloat(cleanedFormData.r1_pay_scale),
            r2_pay_scale: parseFloat(cleanedFormData.r2_pay_scale),
            per_rep_addr_share: parseFloat(createCommission.per_rep_addr_share),
            per_rep_ovrd_share: parseFloat(createCommission.per_rep_ovrd_share),
          });
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
          {editMode === false ? 'Create Referal Data' : 'Update Referal Data'}
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
                  <label className="inputLabel-select">State</label>
                  <SelectOption
                    options={stateOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'state')}
                    value={stateOption(newFormData)?.find(
                      (option) => option.value === createCommission.state
                    )}
                  />
                  {errors?.state && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.state}
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
                    type={'text'}
                    label="Amount"
                    value={createCommission.amount}
                    name="amount"
                    placeholder={'Amount'}
                    onChange={(e) => handleInputChange(e)}
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
                    label="Rep Doll / Per"
                    value={createCommission.rep_doll_divby_per}
                    name="rep_doll_divby_per"
                    placeholder={'Rep Doll / Per'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.rep_doll_divby_per && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.rep_doll_divby_per}
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
                    type={'text'}
                    label="Type"
                    value={createCommission.type}
                    name="type"
                    placeholder={'Type'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.type && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.type}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Rep1 Name"
                    value={createCommission.rep_1_name}
                    name="rep_1_name"
                    placeholder={'Notes'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.rep_1_name && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.rep_1_name}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="R1 Adder Resp"
                    value={createCommission.r1_addr_resp}
                    name="r1_addr_resp"
                    placeholder={'R1 Adder Resp'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.r1_addr_resp && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.r1_addr_resp}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Rep2 Name"
                    value={createCommission.rep_2_name}
                    name="rep_2_name"
                    placeholder={'Rep2 Name'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.rep_2_name && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.rep_2_name}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Sys Size"
                    value={createCommission.sys_size}
                    name="sys_size"
                    placeholder={'Sys Size'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.sys_size && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.sys_size}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Rep Count"
                    value={createCommission.rep_count}
                    name="rep_count"
                    placeholder={'Rep Count'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.rep_count && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.rep_count}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Per Rep Addr Share"
                    value={createCommission.per_rep_addr_share}
                    name="per_rep_addr_share"
                    placeholder={'Per Rep Addr Share'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.per_rep_addr_share && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.per_rep_addr_share}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Per Rep Ovrd Share"
                    value={createCommission.per_rep_ovrd_share}
                    name="per_rep_ovrd_share"
                    placeholder={'Per Rep Ovrd Share'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.per_rep_ovrd_share && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.per_rep_ovrd_share}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="R1 Pay Scale"
                    value={createCommission.r1_pay_scale}
                    name="r1_pay_scale"
                    placeholder={'R1 Pay Scale'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.r1_pay_scale && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.r1_pay_scale}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="R1 Referral Credit_$"
                    value={createCommission.r1_referral_credit_$}
                    name="r1_referral_credit_$"
                    placeholder={'R1 Pay Scale'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.r1_referral_credit_$ && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.r1_referral_credit_$}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="R1 Referral Credit Perc"
                    value={createCommission.r1_referral_credit_perc}
                    name="r1_referral_credit_perc"
                    placeholder={'R1 Referral Credit Perc'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.r1_referral_credit_perc && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.r1_referral_credit_perc}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="R2 Pay Scale"
                    value={createCommission.r2_pay_scale}
                    name="r2_pay_scale"
                    placeholder={'R2 Pay Scale'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.r2_pay_scale && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.r2_pay_scale}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="R2 Referral Credit"
                    value={createCommission.r2_referral_credit_$}
                    name="r2_referral_credit_$"
                    placeholder={'R2 Referral credit $'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.r2_referral_credit_$ && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.r2_referral_credit_$}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="R2 Adder Resp"
                    value={createCommission.r2_addr_resp}
                    name="r2_addr_resp"
                    placeholder={'R2 Adder Resp'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.r2_addr_resp && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.r2_addr_resp}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="R2 Referral Credit Perc"
                    value={createCommission.r2_referral_credit_perc}
                    name="r2_referral_credit_perc"
                    placeholder={'R2 Referral Credit Perc'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.r2_referral_credit_perc && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.r2_referral_credit_perc}
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

                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="End Date"
                    value={createCommission.end_date}
                    name="end_date"
                    min={
                      createCommission.start_date &&
                      format(
                        addDays(new Date(createCommission.start_date), 1),
                        'yyyy-MM-dd'
                      )
                    }
                    disabled={!createCommission.start_date}
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
