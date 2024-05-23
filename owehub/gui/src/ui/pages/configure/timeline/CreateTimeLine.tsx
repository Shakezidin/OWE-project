import React, { useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { updateTimeLineForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createTimeLineSlaSlice';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { stateOption } from '../../../../core/models/data_models/SelectDataModel';
import { TimeLineSlaModel } from '../../../../core/models/configuration/create/TimeLineSlaModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import { toast } from 'react-toastify';
import { FormEvent, FormInput } from '../../../../core/models/data_models/typesModel';
interface timeLineProps {
  handleClose: () => void;
  editMode: boolean;
  timeLineSlaData: TimeLineSlaModel | null;
}

interface IError {
  type_m2m: string;
  state: string;
  days: string;
  start_date: string;
  end_date: string;
}
const CreateTimeLine: React.FC<timeLineProps> = ({
  handleClose,
  editMode,
  timeLineSlaData,
}) => {
  const dispatch = useDispatch();
  const [createTimeLine, setCreateTimeLine] = useState<TimeLineSlaModel>({
    record_id: timeLineSlaData ? timeLineSlaData?.record_id : 0,
    type_m2m: timeLineSlaData ? timeLineSlaData?.type_m2m : '',
    state: timeLineSlaData ? timeLineSlaData?.state : '',
    days: timeLineSlaData ? timeLineSlaData?.days : '',
    start_date: timeLineSlaData ? timeLineSlaData?.start_date : '',
    end_date: timeLineSlaData ? timeLineSlaData?.end_date : '',
  });
  const [errors, setErrors] = useState<IError>({} as IError);
  const [newFormData, setNewFormData] = useState<any>([]);
  const tableData = {
    tableNames: ['states'],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  const handleValidation = () => {
    const error = {} as IError;
    for (const key in createTimeLine) {
      if (key === 'record_id') {
        continue;
      }
      if (!createTimeLine[key as keyof IError]) {
        error[key as keyof IError] = `${key.toLocaleLowerCase()} is required`;
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length === 0;
  };

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateTimeLine((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
  };
  const handleTimeLineInput = (e: FormInput) => {
    const { name, value } = e.target;

    if (name === 'end_date') {
      if (createTimeLine.start_date && value < createTimeLine.start_date) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          end_date: 'End date cannot be before the start date',
        }));
        return;
      }
    }

    setCreateTimeLine((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const submitTimeLineSla = async (e: FormEvent) => {
    e.preventDefault();
    console.log('working');

    if (handleValidation()) {
      try {
        dispatch(updateTimeLineForm(createTimeLine));
        if (createTimeLine.record_id) {
          const res = await postCaller(EndPoints.update_timelinesla, {
            ...createTimeLine,
            days: parseInt(createTimeLine.days),
          });
          if (res?.status === 200) {
            toast.success(res.message);
            handleClose();
            window.location.reload();
          } else {
            toast.error(res.message);
          }
        } else {
          const { record_id, ...cleanedFormData } = createTimeLine;
          const res = await postCaller(EndPoints.create_timelinesla, {
            ...cleanedFormData,
            days: parseInt(cleanedFormData.days),
          });
          if (res?.status === 200) {
            toast.success(res.message);
            handleClose();
            window.location.reload();
          } else {
            toast.error(res.message);
          }
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };
  return (
    <div className="transparent-model">
      <form onSubmit={(e) => submitTimeLineSla(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? 'Create TimeLine SLA' : 'Update TimeLine SLA'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Type/M2M"
                    value={createTimeLine.type_m2m}
                    name="type_m2m"
                    placeholder={'Enter'}
                    onChange={(e) => handleTimeLineInput(e)}
                  />
                  {errors?.type_m2m && (
                    <span style={{display: 'block', color: '#FF204E',textTransform:"capitalize" }}>
                      {errors.type_m2m}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">State</label>
                  <SelectOption
                    options={stateOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'state')}
                    value={stateOption(newFormData)?.find(
                      (option) => option.value === createTimeLine.state
                    )}
                  />
                  {errors?.state && (
                    <span style={{display: 'block', color: '#FF204E',textTransform:"capitalize" }}>
                      {errors.state}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Days"
                    value={createTimeLine.days}
                    name="days"
                    placeholder={'Enter'}
                    onChange={(e) => handleTimeLineInput(e)}
                  />
                  {errors?.days && (
                    <span style={{display: 'block', color: '#FF204E',textTransform:"capitalize" }}>
                      {errors.days}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Start Date"
                    value={createTimeLine.start_date}
                    name="start_date"
                    placeholder={'1/04/2004'}
                    onChange={(e) => handleTimeLineInput(e)}
                  />
                  {errors?.start_date && (
                    <span style={{display: 'block', color: '#FF204E',textTransform:"capitalize" }}>
                      {errors.start_date.replace('start_date', 'start date')}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="End Date"
                    value={createTimeLine.end_date}
                    name="end_date"
                    placeholder={'10/04/2004'}
                    onChange={(e) => handleTimeLineInput(e)}
                  />
                  {errors?.end_date && (
                    <span style={{display: 'block', color: '#FF204E',textTransform:"capitalize" }}>
                      {errors.end_date.replace('end_date', 'end date')}
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
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateTimeLine;
