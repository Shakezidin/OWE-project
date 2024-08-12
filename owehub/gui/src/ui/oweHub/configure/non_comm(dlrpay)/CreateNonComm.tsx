import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/nonComm';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  INonCommRowDLR,
  createNonComm,
  updateNoncom,
} from '../../../../redux/apiActions/config/nocCommAction';
import {
  FormEvent,
  FormInput,
} from '../../../../core/models/data_models/typesModel';
import { firstCapitalize } from '../../../../utiles';
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
  const { isSuccess, isFormSubmitting } = useAppSelector(
    (state) => state.nonComm
  );
  const [createCommission, setCreateCommission] = useState({
    unique_id: commission?.unique_id || '',
    exact_amount: commission?.exact_amount || '',
    approved_by: commission?.approved_by || '',
    notes: commission?.notes || '',
    date: commission?.date || '',
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
            record_id: commission?.record_id!,
            exact_amount: parseFloat(createCommission.exact_amount as string),
          })
        );
      } else {
        dispatch(
          createNonComm({
            ...createCommission,
            exact_amount: parseFloat(createCommission.exact_amount as string),
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
                      }}
                      className="error"
                    >
                      {errors.unique_id.replace('unique_id', 'unique id')}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Amount"
                    value={createCommission.exact_amount}
                    name="exact_amount"
                    placeholder={'Enter'}
                    onChange={(e) => {
                      const value = e.target.value;
                      //@ts-ignore
                      if (value === '' || value >= 0) {
                        handleInputChange(e);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors?.exact_amount && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.exact_amount.replace('exact amount', 'amount')}
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
                      }}
                      className="error"
                    >
                      {errors.approved_by}
                    </span>
                  )}
                </div>
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
                    label="Date"
                    value={createCommission.date}
                    name="date"
                    placeholder={'10/04/2004'}
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
              </div>
            </div>
          </div>
        </div>
        <div className="createUserActionButton">
          <ActionButton title={'Cancel'} type="button" onClick={handleClose} />
          <ActionButton
            disabled={isFormSubmitting}
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
