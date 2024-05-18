import React, { useEffect, useState } from 'react';

import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';

import { ActionButton } from '../../../components/button/ActionButton';
import { updatePayForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createPayScheduleSlice';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  installerOption,
  partnerOption,
  salesTypeOption,
  stateOption,
} from '../../../../core/models/data_models/SelectDataModel';
import Select from 'react-select';
import { paySaleTypeData } from '../../../../resources/static_data/StaticData';
import { PayScheduleModel } from '../../../../core/models/configuration/create/PayScheduleModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import {
  createApttSetters,
  fetchApptSetters,
  updateApptSetters,
} from '../../../../redux/apiActions/apptSetterAction';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/apptSetterSlice';

interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: any;
}

const CreateAppSetters: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess } = useAppSelector((state) => state.apptsetters);
  function generateRandomId(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
  const [createAppSettersData, setAppSettersData] = useState({
    unique_id: editData?.unique_id || generateRandomId(6),
    name: editData?.name || '',
    team_name: editData?.team_name || '',
    pay_rate: editData?.pay_rate || '',
    start_date: editData?.start_date || '',
    end_date: editData?.end_date || '',
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppSettersData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [newFormData, setNewFormData] = useState<any>([]);

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
  };
  useEffect(() => {
    if (isSuccess) {
      handleClose();
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
                    label="Name"
                    value={createAppSettersData.name}
                    name="name"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Team"
                    value={createAppSettersData.team_name}
                    name="team_name"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
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
                </div>
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="End"
                    value={createAppSettersData.end_date}
                    name="end_date"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
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

export default CreateAppSetters;
