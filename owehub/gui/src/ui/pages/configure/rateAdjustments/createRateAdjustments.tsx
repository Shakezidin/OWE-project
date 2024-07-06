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
} from '../../../../redux/apiActions/config/RateAdjustmentsAction';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';

import { FormInput } from '../../../../core/models/data_models/typesModel';
import { firstCapitalize } from '../../../../utiles';
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
  const { isFormSubmitting } = useAppSelector((state) => state.rateAdjustment);
  const [createRateAdjustmentData, setCreateRateAdjustmentPayData] =
    useState<rateAdjustmentModel>({

      pay_scale: editData?.pay_scale || '',
      position: editData?.position || '',
      adjustment: editData?.adjustment || '',
      min_rate: editData?.min_rate || '',
      max_rate: editData?.max_rate || '',
    });

  const [errors, setErrors] = useState<rateAdjustmentModel>(
    {} as rateAdjustmentModel
  );

  const handleValidation = () => {
    const error: rateAdjustmentModel = {} as rateAdjustmentModel;
    for (const key in createRateAdjustmentData) {
      if (
        !createRateAdjustmentData[key as keyof typeof createRateAdjustmentData]
      ) {
        error[key as keyof typeof createRateAdjustmentData] =
          firstCapitalize(`${key.replaceAll('_', ' ')} is required`);
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
  };
  const handleInputChange = (e: FormInput) => {
    let { name, value } = e.target;
    if (name === 'min_rate' || name === 'max_rate') {
      const sanitizedValue = value.replace(/[^0-9.]/g, '');
      value = sanitizedValue;
    }
    setCreateRateAdjustmentPayData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      if (editMode) {
        dispatch(
          updateRateAdjustment({
            pay_scale: createRateAdjustmentData.pay_scale,
            position: createRateAdjustmentData.position,
            adjustment: createRateAdjustmentData.adjustment,
            min_rate: parseFloat(createRateAdjustmentData.min_rate),
            max_rate: parseFloat(createRateAdjustmentData.max_rate),
            record_id: editData?.record_id!,
          })
        );
      } else {
        dispatch(
          createRateAdjustments({
            pay_scale: createRateAdjustmentData.pay_scale,
            position: createRateAdjustmentData.position,
            adjustment: createRateAdjustmentData.adjustment,
            min_rate: parseFloat(createRateAdjustmentData.min_rate),
            max_rate: parseFloat(createRateAdjustmentData.max_rate),
          })
        );
      }
    }
  };

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
                    label="Position"
                    value={createRateAdjustmentData.position}
                    name="position"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
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
                    label="Adjustment"
                    value={createRateAdjustmentData.adjustment}
                    name="adjustment"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.adjustment && (
                    <span
                      style={{
                        display: 'block',
                  
                        
                      }}
className="error"
                    >
                      {errors.adjustment}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Pay Scale"
                    value={createRateAdjustmentData.pay_scale}
                    name="pay_scale"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
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
                    type={'text'}
                    label="Min Rate"
                    value={createRateAdjustmentData.min_rate}
                    name="min_rate"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.min_rate && (
                    <span
                      style={{
                        display: 'block',
                  
                        
                      }}
className="error"
                    >
                      {errors.min_rate}
                    </span>
                  )}
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
                  {errors?.max_rate && (
                    <span
                      style={{
                        display: 'block',
                  
                        
                      }}
className="error"
                    >
                      {errors.max_rate}
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

export default CreateRateAdjustments;
