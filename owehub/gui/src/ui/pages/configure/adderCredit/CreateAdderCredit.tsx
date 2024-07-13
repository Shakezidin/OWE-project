import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';

import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  createAdderCredit,
  updateAdderCredit,
} from '../../../../redux/apiActions/config/adderCreditAction';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/adderCreditSlice';
import { FormInput } from '../../../../core/models/data_models/typesModel';
import { firstCapitalize } from '../../../../utiles';

interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: any;
  setRefetch: Dispatch<SetStateAction<number>>;
}

const CreateAdderCredit: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
  setRefetch,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess, isFormSubmitting } = useAppSelector(
    (state) => state.addercredit
  );
  const [createAdderCreditData, setAdderCreditData] = useState({

    pay_scale: editData?.pay_scale || '',
    type: editData?.type || '',
    min_rate: editData?.min_rate || '',
    max_rate: editData?.max_rate || '',
  });
  type TError = typeof createAdderCreditData;
  const [errors, setErrors] = useState<TError>({} as TError);

  const handleValidation = () => {
    const error: TError = {} as TError;
    for (const key in createAdderCreditData) {
      if (!createAdderCreditData[key as keyof typeof createAdderCreditData]) {
        error[key as keyof typeof createAdderCreditData] =
          firstCapitalize(`${key.replaceAll('_', ' ')} is required`);
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      if (editMode) {
        dispatch(
          updateAdderCredit({
            pay_scale: createAdderCreditData.pay_scale,
            type: createAdderCreditData.type,
            max_rate: parseFloat(createAdderCreditData.max_rate), // Parsing string to integer
            min_rate: parseFloat(createAdderCreditData.min_rate), // Parsing string to integer
            record_id: editData?.record_id!,
          })
        );
      } else {
        dispatch(
          createAdderCredit({
            
            pay_scale: createAdderCreditData.pay_scale,
            type: createAdderCreditData.type,
            max_rate: parseFloat(createAdderCreditData.max_rate), // Parsing string to integer
            min_rate: parseFloat(createAdderCreditData.min_rate), // Parsing string to integer
          })
        );
      }
    }
  };

  const handleInputChange = (e: FormInput) => {
    let { name, value } = e.target;

    if (name === 'min_rate' || name === 'max_rate') {
      const sanitizedValue = value.replace(/[^0-9.]/g, '');
      value = sanitizedValue;
      setAdderCreditData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      return;
    }
    setAdderCreditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
          {editMode === false ? 'Create Adder Credit' : 'Update Adder Credit'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
              
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Pay Scale"
                    value={createAdderCreditData.pay_scale}
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
                    type={'text'}
                    label="Type"
                    value={createAdderCreditData.type}
                    name="type"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />

                  {errors?.type && (
                    <span
                      style={{
                        display: 'block',
                  
                       
                      }}
className="error"
                    >
                      {errors.type}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Max Rate"
                    value={createAdderCreditData.max_rate}
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
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Min Rate"
                    value={createAdderCreditData.min_rate}
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

export default CreateAdderCredit;
