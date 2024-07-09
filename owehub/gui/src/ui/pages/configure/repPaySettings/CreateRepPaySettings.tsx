import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { updatePayForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createPayScheduleSlice';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { useDispatch } from 'react-redux';
import {
  installerOption,
  partnerOption,
  salesTypeOption,
  stateOption,
} from '../../../../core/models/data_models/SelectDataModel';
import Select from 'react-select';
import { paySaleTypeData } from '../../../../resources/static_data/StaticData';
import { repPaySettingModel } from '../../../../core/models/configuration/create/repPaySettingModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import { addDays, format } from 'date-fns';
import {
  createRepaySettings,
  RepayEditParams,
  updateRepaySettings,
} from '../../../../redux/apiActions/config/repPayAction';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/repPaySettingsSlice';
import { FormInput } from '../../../../core/models/data_models/typesModel';
import { firstCapitalize } from '../../../../utiles';

interface createRepPayProps {
  handleClose: () => void;
  editMode: boolean;
  editData: RepayEditParams | null;
  setRefetch: Dispatch<SetStateAction<number>>;
}

const CreateRepPaySettings: React.FC<createRepPayProps> = ({
  handleClose,
  editMode,
  editData,
  setRefetch,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess } = useAppSelector((state) => state.repaySettings);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [newFormData, setNewFormData] = useState<any>([]);
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);

  const [createRePayData, setCreatePayData] = useState({
    unique_id: editData?.unique_id || '',
    name: editData?.name || '',
    state: editData?.state || '',
    pay_scale: editData?.pay_scale || '',
    position: editData?.position || '',
    b_e: editData?.b_e || '',
    start_date: editData?.start_date || '',
    end_date: editData?.end_date || '',
  });

  const [errors, setErrors] = useState<typeof createRePayData>(
    {} as typeof createRePayData
  );

  const handleChange = (newValue: any, fieldName: string) => {
    setCreatePayData((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
  };

  const handleValidation = () => {
    const error: any = {};
    for (const key in createRePayData) {
      if (tableData.tableNames.includes(key)) {
        continue;
      }
      if (!createRePayData[key as keyof typeof createRePayData]) {
        error[key as keyof typeof createRePayData] = firstCapitalize(
          `${key.replaceAll('_', ' ')} is required`
        );
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
  };
  const handlePayInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    if (name === 'start_date') {
      setCreatePayData((prevData) => ({
        ...prevData,
        [name]: value,
        end_date: '',
      }));
      return;
    }
    setCreatePayData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const tableData = {
    tableNames: ['partners', 'states', 'installers', 'sale_type'],
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
      const data = {
        unique_id: createRePayData.unique_id,
        name: createRePayData.name,
        state: createRePayData.state,
        pay_scale: createRePayData.pay_scale,
        position: createRePayData.position,
        b_e: createRePayData.b_e,
        start_date: createRePayData.start_date,
        end_date: createRePayData.end_date,
      };

      if (editMode) {
        dispatch(
          updateRepaySettings({ ...data, record_id: editData?.RecordId! })
        );
      } else {
        dispatch(createRepaySettings(data));
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      setRefetch((prev) => prev + 1);
      dispatch(resetSuccess());
    }
  }, [isSuccess]);
  return (
    <div className="transparent-model">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? 'Create Rep Pay' : 'Update RepPay'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Unique Id"
                    value={createRePayData.unique_id}
                    name="unique_id"
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
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
                    label="Name"
                    value={createRePayData.name}
                    name="name"
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.name && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.name}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">State</label>
                  <SelectOption
                    options={stateOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'state')}
                    value={stateOption(newFormData)?.find(
                      (option) => option.value === createRePayData.state
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
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Position"
                    value={createRePayData.position}
                    name="position"
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.position && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.position}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="BE"
                    value={createRePayData.b_e}
                    name="b_e"
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.b_e && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.b_e.replaceAll("B e","Be")}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Pay Scale"
                    value={createRePayData.pay_scale}
                    name="pay_scale"
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.pay_scale && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.pay_scale}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">

              <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Start Date"
                    value={createRePayData.start_date}
                    name="start_date"
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
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
                    value={createRePayData.end_date}
                    name="end_date"
                    min={
                      createRePayData.start_date &&
                      format(
                        addDays(new Date(createRePayData.start_date), 1),
                        'yyyy-MM-dd'
                      )
                    }
                    disabled={!createRePayData.start_date}
                    placeholder={'Enter'}
                    onChange={(e) => handlePayInputChange(e)}
                  />
                  {errors?.end_date && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
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
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateRepPaySettings;
