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
  createApAdv,
  updateApAdv,
  fetchApAdv,
} from '../../../../redux/apiActions/config/apAdvAction';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/apAdvSlice';
import { FormInput } from '../../../../core/models/data_models/typesModel';
import { addDays, format } from 'date-fns';
import { firstCapitalize } from '../../../../utiles';

interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: any;
  setRefetch: Dispatch<SetStateAction<number>>;
}

const CreateApAdv: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
  setRefetch,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess, isFormSubmitting } = useAppSelector(
    (state) => state.apAdvSlice
  );
  const [createAppSettersData, setAppSettersData] = useState({
    unique_id: editData?.unique_id || '',
    payee: editData?.payee || '',
    amount_ovrd: editData?.amount_ovrd || '',
    date: editData?.date || '',
    approved_by: editData?.approved_by || '',
    notes: editData?.notes || '',
  });
  type TError = typeof createAppSettersData;
  const [errors, setErrors] = useState<TError>({} as TError);

  const handleValidation = () => {
    const error: TError = {} as TError;
    for (const key in createAppSettersData) {
      if (!createAppSettersData[key as keyof typeof createAppSettersData]) {
        error[key as keyof typeof createAppSettersData] = firstCapitalize(
          `${key.replaceAll('_', ' ')} is required`
        );
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
          updateApAdv({
            ...createAppSettersData,
            record_id: editData?.record_id!,
            amount_ovrd: parseInt(createAppSettersData.amount_ovrd),
          })
        );
      } else {
        const data = {
          ...createAppSettersData,
          amount_ovrd: parseInt(createAppSettersData.amount_ovrd), // Convert to number
        };
        dispatch(createApAdv(data));
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
          {editMode === false ? 'Create Ap Adv' : 'Update Ap Adv'}
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
                    label="Amount Ovrd"
                    value={createAppSettersData.amount_ovrd}
                    name="amount_ovrd"
                    placeholder={'Enter'}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value.replace(
                        /[^0-9.]/g,
                        ''
                      );
                      e.target.value = sanitizedValue;
                      handleInputChange(e);
                    }}
                  />
                  {errors?.amount_ovrd && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.amount_ovrd}
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
                    label="Approved By"
                    value={createAppSettersData.approved_by}
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
                    value={createAppSettersData.notes}
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

export default CreateApAdv;
