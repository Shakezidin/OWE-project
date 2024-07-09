import React, { useEffect, useState } from 'react';

import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';

import { ActionButton } from '../../../components/button/ActionButton';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { validateConfigForm } from '../../../../utiles/configFormValidation';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/arSlice';
import { FormInput } from '../../../../core/models/data_models/typesModel';
import { createRepCredit, updateRepCredit } from '../../../../redux/apiActions/config/repCreditAction';
import { createRepStatus, updateRepStatus } from '../../../../redux/apiActions/config/repstatusAction';
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: any;
}


const CreateRepCredit: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess, isFormSubmitting } = useAppSelector((state) => state.ar);
  console.log("edit data", editData)
  const [createArData, setCreateArData] = useState({
    name: editData?.name || '',
    status: editData?.status || '',
  });

  const [newFormData, setNewFormData] = useState<any>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});



  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    setCreateArData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationRules = {
      record_id: [
        {
          condition: (value: any) => !!value,
          message: 'Unique Id is required',
        },
      ],
      preferred_name: [
        { condition: (value: any) => !!value, message: 'Name is required' },
      ],
      DBA: [{ condition: (value: any) => !!value, message: 'DBA is required' }],
    };
    const { isValid, errors } = validateConfigForm(
      createArData!,
      validationRules
    );
    if (!isValid) {
      setErrors(errors);
      return;
    }

    if (editMode) {
      dispatch(
        updateRepStatus({
          ...createArData,
          name: createArData.name,
          status: createArData.status,
        })
      );
    } else {
      dispatch(
        createRepStatus({
          name: createArData.name,
          status: createArData.status,
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
          {editMode === false ? 'Create Rep Status' : 'Update Rep Status'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Name"
                    value={createArData.name}
                    name="name"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Status"
                    value={createArData.status}
                    name="status"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.status && <span className="error">{errors.status}</span>}
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
            onClick={() => { }}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateRepCredit;
