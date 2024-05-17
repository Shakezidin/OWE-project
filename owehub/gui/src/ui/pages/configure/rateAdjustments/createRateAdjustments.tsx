import React, { useEffect, useState } from 'react';

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
import { rateAdjustmentModel } from '../../../../core/models/configuration/create/RateAdjustmentModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import {
  createRateAdjustments,
  updateRateAdjustment,
} from '../../../../redux/apiActions/RateAdjustmentsAction';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/rateAdjustmentsSlice';
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  setViewArchived: React.Dispatch<React.SetStateAction<boolean>>;
  editData: any;
}

const CreateRateAdjustments: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  setViewArchived,
  editData,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess } = useAppSelector((state) => state.rateAdjustment);
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

  const [createRateAdjustmentData, setCreateRateAdjustmentPayData] =
    useState<rateAdjustmentModel>({
      unique_id: editData?.unique_id || generateRandomId(6),
      pay_scale: editData?.pay_scale || '',
      position: editData?.position || '',
      adjustment: editData?.adjustment || '',
      min_rate: editData?.min_rate || '',
      max_rate: editData?.max_rate || '',
      start_date: '04-05-2024',
      end_date: '05-05-2024',
    });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateRateAdjustmentPayData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setViewArchived(false);
    if (editMode) {
      dispatch(
        updateRateAdjustment({
          unique_id: createRateAdjustmentData.unique_id,
          pay_scale: createRateAdjustmentData.pay_scale,
          position: createRateAdjustmentData.position,
          adjustment: createRateAdjustmentData.adjustment,
          min_rate: parseInt(createRateAdjustmentData.min_rate),
          max_rate: parseInt(createRateAdjustmentData.max_rate),
          start_date: createRateAdjustmentData.start_date,
          end_date: createRateAdjustmentData.end_date,
          record_id: editData?.record_id!,
        })
      );
    } else {
      dispatch(
        createRateAdjustments({
          unique_id: createRateAdjustmentData.unique_id,
          pay_scale: createRateAdjustmentData.pay_scale,
          position: createRateAdjustmentData.position,
          adjustment: createRateAdjustmentData.adjustment,
          min_rate: parseInt(createRateAdjustmentData.min_rate),
          max_rate: parseInt(createRateAdjustmentData.max_rate),
          start_date: createRateAdjustmentData.start_date,
          end_date: createRateAdjustmentData.end_date,
        })
      );
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
          {editMode === false
            ? 'Create Rate Adjustment'
            : 'Update Rate Adjustment'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Pay Scale"
                    value={createRateAdjustmentData.pay_scale}
                    name="pay_scale"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Position"
                    value={createRateAdjustmentData.position}
                    name="position"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Adjustment"
                    value={createRateAdjustmentData.adjustment}
                    name="adjustment"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="MIN Rate"
                    value={createRateAdjustmentData.min_rate}
                    name="min_rate"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Max Rate"
                    value={createRateAdjustmentData.max_rate}
                    name="max_rate"
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

export default CreateRateAdjustments;
