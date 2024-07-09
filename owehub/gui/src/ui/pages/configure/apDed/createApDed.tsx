import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';

import { ActionButton } from '../../../components/button/ActionButton';
import { updatePayForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createPayScheduleSlice';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { teamsOption } from '../../../../core/models/data_models/SelectDataModel';
import Select from 'react-select';
import { paySaleTypeData } from '../../../../resources/static_data/StaticData';
import { PayScheduleModel } from '../../../../core/models/configuration/create/PayScheduleModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import {
  createApDed,
  fetchApDed,
  updateApDed,
} from '../../../../redux/apiActions/config/apDedAction';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/apptSetterSlice';
import { FormInput } from '../../../../core/models/data_models/typesModel';
import { addDays, format } from 'date-fns';
import { firstCapitalize } from '../../../../utiles';

interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: any;
  setRefetch: Dispatch<SetStateAction<number>>;
}

const CreateApDed: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
  setRefetch,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess, isFormSubmitting } = useAppSelector(
    (state) => state.apptsetters
  );
  const [createAppSettersData, setAppSettersData] = useState({
    unique_id: editData?.unique_id || '',
    payee: editData?.payee || '',
    amount: editData?.amount || '',
    date: editData?.date || '',
    short_code: editData?.short_code || '',
    description: editData?.description || '',
  });
  type TError = typeof createAppSettersData;
  const [errors, setErrors] = useState<TError>({} as TError);

  const handleValidation = () => {
    const error: TError = {} as TError;
    for (const key in createAppSettersData) {
      if (!createAppSettersData[key as keyof typeof createAppSettersData]) {
        error[key as keyof typeof createAppSettersData] =
          firstCapitalize(`${key.replaceAll('_', ' ')} is required`);
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
  };
  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    if (name === 'start_date') {
      setAppSettersData((prevData) => ({
        ...prevData,
        [name]: value,
        end_date: '',
      }));
    } else {
      setAppSettersData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const [newFormData, setNewFormData] = useState<any>([]);

  const tableData = {
    tableNames: ['partners', 'states', 'installers', 'sale_type', 'teams'],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      if (editMode) {
        dispatch(
          updateApDed({
            ...createAppSettersData,
            record_id: editData?.record_id!,
          })
        );
      } else {
        const data = {
          ...createAppSettersData,
          amount: parseInt(createAppSettersData.amount), // Convert to number
        };
        dispatch(createApDed(data));
      }
    }
  };
  useEffect(() => {
    if (isSuccess) {
      handleClose();
      setRefetch((prev) => prev + 1);
    }
    return () => {
      isSuccess && dispatch(resetSuccess());
    };
  }, [isSuccess]);

  return (
    <div className="transparent-model">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? 'Create Appt Setters' : 'Update Appt Setters'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
            <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Unique Id"
                    value={createAppSettersData.unique_id}
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
                      {errors.unique_id}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Payee"
                    value={createAppSettersData.payee}
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
                    value={createAppSettersData.amount}
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

                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Date"
                    value={createAppSettersData.date}
                    name="date"
                    placeholder={'Enter'}
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

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Short Code"
                    value={createAppSettersData.short_code}
                    name="short_code"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.short_code && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.short_code}
                    </span>
                  )}
                </div>


                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Description"
                    value={createAppSettersData.description}
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
            disabled={isFormSubmitting}
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateApDed;
