import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  createAdderResponsibility,
  updateAdderResponsibility,
} from '../../../../redux/apiActions/config/adderResponsbilityAction';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/adderResponsbilitySlice';
import { FormInput } from '../../../../core/models/data_models/typesModel';
import { firstCapitalize } from '../../../../utiles';

interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: {
    pay_scale: string;
    percentage: string;
    record_id: number;
  } | null;
  setRefetch: Dispatch<SetStateAction<number>>;
}

const CreateAdderResponsibility: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
  setRefetch,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess, isFormSubmitting } = useAppSelector(
    (state) => state.adderresponsbility
  );

  const [createAdderResponsbilityData, setAdderResponsbilityData] = useState({
    pay_scale: editData ? editData?.pay_scale : '',
    percentage: editData ? editData?.percentage : '',
    record_id: editData ? editData?.record_id : 0,
  });
  type TError = typeof createAdderResponsbilityData;
  const [errors, setErrors] = useState<TError>({} as TError);

  const handleValidation = () => {
    const error: TError = {} as TError;
    for (const key in createAdderResponsbilityData) {
      if (key === 'record_id') {
        continue;
      }
      if (!createAdderResponsbilityData[key as keyof TError]) {
        // @ts-ignore
        error[key as keyof TError] = firstCapitalize(
          `${key.replaceAll('_', ' ')} is required`
        );
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
  };
  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    setAdderResponsbilityData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      if (editMode) {
        dispatch(
          updateAdderResponsibility({
            pay_scale: createAdderResponsbilityData.pay_scale,
            percentage: parseInt(createAdderResponsbilityData.percentage, 10),
            record_id: editData?.record_id!,
          })
        );
      } else {
        dispatch(
          createAdderResponsibility({
            pay_scale: createAdderResponsbilityData.pay_scale,
            percentage: parseInt(createAdderResponsbilityData.percentage, 10),
          })
        );
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
          {editMode === false
            ? 'Create Adder Responsibility'
            : 'Update Adder Responsibility'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Pay Scale"
                    value={createAdderResponsbilityData.pay_scale}
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
                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Percentage"
                    value={createAdderResponsbilityData.percentage}
                    name="percentage"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />

                  {errors?.percentage && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.percentage}
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

export default CreateAdderResponsibility;
