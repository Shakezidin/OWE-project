import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { useDispatch } from 'react-redux';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import Select from 'react-select';
import {
  dealerOption,
  dbaOption,
} from '../../../../core/models/data_models/SelectDataModel';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/nonComm';
import {
  IRowDLR,
  createDlrOth,
  updateDlrOth,
} from '../../../../redux/apiActions/config/dlrAction';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  INonCommRowDLR,
  createNonComm,
  updateNoncom,
} from '../../../../redux/apiActions/config/nocCommAction';
import SelectOption from '../../../components/selectOption/SelectOption';
import {
  FormEvent,
  FormInput,
} from '../../../../core/models/data_models/typesModel';
import { addDays, format } from 'date-fns';
interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
  commission: INonCommRowDLR | null;
  setRefetch: Dispatch<SetStateAction<number>>;
}

interface IError {
  [key: string]: string;
}

const CreateNonComm: React.FC<ButtonProps> = ({
  handleClose,
  commission,
  editMode,
  setRefetch,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess } = useAppSelector((state) => state.nonComm);
  const [createCommission, setCreateCommission] = useState({
    unique_id: commission?.unique_id || '',
    customer: commission?.customer || '',
    dealer_name: commission?.dealer_name || '',
    dealer_dba: commission?.dealer_dba || '',
    exact_amount: commission?.exact_amount || '',
    approved_by: commission?.approved_by || '',
    notes: commission?.notes || '',
    balance: commission?.balance ? `${commission?.balance}` : '',
    paid_amount: commission?.paid_amount ? `${commission?.paid_amount}` : '',
    dba: commission?.dba || '',
    start_date: commission?.start_date || '',
    end_date: commission?.end_date || '',
  });
  const [errors, setErrors] = useState<IError>({} as IError);
  const [newFormData, setNewFormData] = useState<any>([]);
  const tableData = {
    tableNames: ['dbas', 'dealer'],
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
        error[key as keyof IError] = `${key.replaceAll("_"," ")} is required`;
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

    if (name === 'start_date') {
      setCreateCommission((prev) => ({
        ...prev,
        end_date: '',
        [name]: value,
      }));
      return;
    }

    if (name === 'balance' || name === 'paid_amount') {
      // Remove non-numeric characters and "--" from the input value
      const sanitizedValue = value.replace(/[^0-9.]/g, '').replace(/-/g, '');

      if (
        sanitizedValue === '' ||
        sanitizedValue === '0' ||
        Number(sanitizedValue)
      ) {
        setCreateCommission((prev) => ({
          ...prev,
          [name]: sanitizedValue,
        }));
      }
    } else {
      setCreateCommission((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (handleValidation()) {
      if (editMode) {
        dispatch(
          updateNoncom({
            ...createCommission,
            paid_amount: parseFloat(createCommission.paid_amount),
            balance: parseFloat(createCommission.balance),
            record_id: commission?.record_id!,
            dba: createCommission.dba || 'XYZ Motors',
            dealer_dba: createCommission.dealer_dba || 'XYZ Motors',
            dealer_name: createCommission.dealer_name || 'M Asif',
          })
        );
      } else {
        dispatch(
          createNonComm({
            ...createCommission,
            paid_amount: parseFloat(createCommission.paid_amount),
            balance: parseFloat(createCommission.balance),
            dba: createCommission.dba || 'XYZ Motors',
            dealer_dba: createCommission.dealer_dba || 'XYZ Motors',
            dealer_name: createCommission.dealer_name || 'M Asif',
          })
        );
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      dispatch(resetSuccess());
      setRefetch((prev) => prev + 1);
    }
  }, [isSuccess]);
  return (
    <div className="transparent-model">
      <form action="" onSubmit={(e) => handleSubmit(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? 'Create NON-Comm' : 'Update NON-Comm'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Unique id"
                    value={createCommission.unique_id}
                    name="unique_id"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.unique_id && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.unique_id.replace('unique_id', 'unique id')}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">Dealer</label>
                  <SelectOption
                    options={dealerOption(newFormData)}
                    onChange={(newValue) => {
                      setCreateCommission((prev) => ({
                        ...prev,
                        dealer_name: newValue?.value!,
                      }));
                    }}
                    value={dealerOption(newFormData)?.find(
                      (option) => option.value === createCommission.dealer_name
                    )}
                  />
                  {errors?.dealer_name && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.dealer_name}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="DBA"
                    value={createCommission.dba}
                    name="dba"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.dba && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.dba}
                    </span>
                  )}
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Balance"
                    value={createCommission.balance}
                    name="balance"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.balance && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.balance}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Amount"
                    value={createCommission.exact_amount}
                    name="exact_amount"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.exact_amount && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.exact_amount.replace('exact amount', 'amount')}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Start Date"
                    value={createCommission.start_date}
                    name="start_date"
                    placeholder={'1/04/2004'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.start_date && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.start_date.replace('start_date', 'start date')}
                    </span>
                  )}
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    disabled={!createCommission.start_date}
                    label="End Date"
                    min={
                      createCommission.start_date &&
                      format(
                        addDays(new Date(createCommission.start_date), 1),
                        'yyyy-MM-dd'
                      )
                    }
                    value={createCommission.end_date}
                    name="end_date"
                    placeholder={'10/04/2004'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.end_date && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.end_date.replace('end_date', 'end date')}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Dealer DBA"
                    value={createCommission.dealer_dba}
                    name="dealer_dba"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.dealer_dba && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.dealer_dba}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Paid Amount"
                    value={createCommission.paid_amount}
                    name="paid_amount"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.balance && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.balance}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Notes"
                    value={createCommission.notes}
                    name="notes"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.notes && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.notes}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Approved by"
                    value={createCommission.approved_by}
                    name="approved_by"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.approved_by && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.approved_by}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Customer"
                    value={createCommission.customer}
                    name="customer"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.customer && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.customer}
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

export default CreateNonComm;
