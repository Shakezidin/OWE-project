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
  createApttSetters,
  fetchApptSetters,
  updateApptSetters,
} from '../../../../redux/apiActions/config/apptSetterAction';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/apptSetterSlice';
import { FormInput } from '../../../../core/models/data_models/typesModel';
import { addDays, format } from 'date-fns';

interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: any;
  setRefetch:Dispatch<SetStateAction<number>>
}

const CreateAppSetters: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
  setRefetch
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess,isFormSubmitting } = useAppSelector((state) => state.apptsetters);
  const [createAppSettersData, setAppSettersData] = useState({
    unique_id: editData?.unique_id || '',
    name: editData?.name || '',
    team_name: editData?.team_name || '',
    pay_rate: editData?.pay_rate || '',
    start_date: editData?.start_date || '',
    end_date: editData?.end_date || '',
  });
  type TError = typeof createAppSettersData;
  const [errors, setErrors] = useState<TError>({} as TError);

  const handleValidation = () => {
    const error: TError = {} as TError;
    for (const key in createAppSettersData) {
      if (!createAppSettersData[key as keyof typeof createAppSettersData]) {
        error[key as keyof typeof createAppSettersData] =
          `${key.replaceAll('_', ' ')} is required`;
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
          updateApptSetters({
            ...createAppSettersData,
            record_id: editData?.record_id!,
          })
        );
      } else {
        dispatch(createApttSetters(createAppSettersData));
      }
    }
  };
  useEffect(() => {
    if (isSuccess) {
      handleClose();
      setRefetch(prev=>prev+1)
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
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.unique_id}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Name"
                    value={createAppSettersData.name}
                    name="name"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.name && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.name}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">Team</label>
                  <SelectOption
                    options={teamsOption(newFormData)}
                    onChange={(newValue) =>
                      setAppSettersData((prev) => ({
                        ...prev,
                        team_name: newValue?.value!,
                      }))
                    }
                    value={teamsOption(newFormData)?.find(
                      (option) =>
                        option.value === createAppSettersData.team_name
                    )}
                  />
                  {errors?.team_name && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.team_name}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Pay Rate"
                    value={createAppSettersData.pay_rate}
                    name="pay_rate"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.pay_rate && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.pay_rate}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Start"
                    value={createAppSettersData.start_date}
                    name="start_date"
                    placeholder={'Enter'}
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
                      {errors.start_date}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="End"
                    disabled={!createAppSettersData.start_date}
                    value={createAppSettersData.end_date}
                    min={
                      createAppSettersData.start_date &&
                      format(
                        addDays(new Date(createAppSettersData.start_date), 1),
                        'yyyy-MM-dd'
                      )
                    }
                    name="end_date"
                    placeholder={'Enter'}
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
            disabled={isFormSubmitting}
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateAppSetters;
