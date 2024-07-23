import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { useDispatch } from 'react-redux';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/dlrOth';
import {
  IRowDLR,
  createDlrOth,
  updateDlrOth,
} from '../../../../redux/apiActions/config/dlrAction';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  FormEvent,
  FormInput,
} from '../../../../core/models/data_models/typesModel';
import { addDays, format } from 'date-fns';
import { firstCapitalize } from '../../../../utiles';

interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
  commission: IRowDLR | null;
  setRefresh: Dispatch<SetStateAction<number>>
}

interface IError {
  [key: string]: string;
}

const CreateDlrOth: React.FC<ButtonProps> = ({
  handleClose,
  commission,
  editMode,
  setRefresh
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess } = useAppSelector((state) => state.dlrOth);
  const [createCommission, setCreateCommission] = useState({
    unique_id: commission?.unique_id || '',
    payee: commission?.payee || '',
    amount: commission?.amount || '',
    description: commission?.description || '',
    // balance: commission?.balance ? `${commission?.balance}` : '',
    // paid_amount: commission?.paid_amount ? `${commission?.balance}` : '',
    date: commission?.date || '',
  });
  const [errors, setErrors] = useState<IError>({} as IError);
  const [newFormData, setNewFormData] = useState<any>([]);
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
        error[key as keyof IError] = firstCapitalize(
          `${key.replaceAll('_', ' ')} is required`
        );
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

    if (name === 'date') {
      setCreateCommission((prev) => ({ ...prev, [name]: value }));
    }

    if (name === 'balance' || name === 'amount' || name === 'paid_amount') {
      const sanitizedValue = value.replace(/[^0-9.]/g, '');
      if (sanitizedValue === '' || Number(sanitizedValue) >= 0) {
        setCreateCommission((prev) => ({ ...prev, [name]: sanitizedValue }));
        return;
      }
    } else {
      setCreateCommission((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      if (editMode) {
       await dispatch(
          updateDlrOth({
            ...createCommission,
            amount: parseFloat(createCommission.amount as string),
            record_id: commission?.record_id!,
          })
        );
      } else {
       await dispatch(
          createDlrOth({
            ...createCommission,
            amount: parseFloat(createCommission.amount as string),
          })
        );
      }
      setRefresh(prev => prev+1);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      dispatch(resetSuccess());
    }
  }, [isSuccess]);
  console.log(errors, 'hfhfg');

  return (
    <div className="transparent-model">
      <form action="" onSubmit={(e) => handleSubmit(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? 'Create DLR-OTH' : 'Update Dealer DLR-OTH'}
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
                      }}
                      className="error"
                    >
                      {errors.unique_id.replace('unique_id', 'unique id')}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Payee"
                    value={createCommission.payee}
                    name="payee"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.payee && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.payee}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Amount"
                    value={createCommission.amount}
                    name="amount"
                    placeholder={'Enter'}
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
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Description"
                    value={createCommission.description}
                    name="description"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.description && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.description}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Date"
                    value={createCommission.date}
                    name="date"
                    placeholder={'1/04/2004'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.date && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.date}
                    </span>
                  )}
                </div>
                {/* <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="End Date"
                    value={createCommission.end_date}
                    name="end_date"
                    min={createCommission.date && format(addDays(new Date(createCommission.date),1),"yyyy-MM-dd")}
                    disabled={!createCommission.date}
                    placeholder={'10/04/2004'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.end_date && (
                    <span
                      style={{
                        display: 'block',
                  
                       
                      }}
className="error"
                    >
                      {errors.end_date.replace('end_date', 'end date')}
                    </span>
                  )}
                </div> */}
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

export default CreateDlrOth;
