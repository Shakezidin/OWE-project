import React, { useEffect, useState } from 'react';

import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';

import { ActionButton } from '../../../components/button/ActionButton';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  createDBA,
  updateDBA,
} from '../../../../redux/apiActions/config/dbaaction';
import { validateConfigForm } from '../../../../utiles/configFormValidation';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/dbaSlice';
import { FormInput } from '../../../../core/models/data_models/typesModel';
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: any;
}

const Createdba: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess, isFormSubmitting } = useAppSelector((state) => state.dba);
  const [createArData, setCreateArData] = useState({
    preferred_name: editData?.preferred_name || '',
    dba: editData?.dba || '',
    record_id: editData?.record_id || ''
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
    const validationRules:{[key:string]:any} = {
      
      preferred_name: [
        { condition: (value: any) => !!value, message: 'Preferred Name is required' },
      ],
      dba: [{ condition: (value: any) => !!value, message: 'DBA is required' }],
    }
    if (editMode) {
      
       validationRules.record_id = [
        {
          condition: (value: any) => !!value,
          message: 'Unique Id is required',
        },
      ]
    }
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
        updateDBA({
          ...createArData,
          
          preferred_name: createArData.preferred_name,
          Dba: createArData.dba,
        })
      );
    } else {
      dispatch(
        createDBA({
          preferred_name: createArData.preferred_name,
          Dba: createArData.dba,
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
          {editMode === false ? 'Create DBA' : 'Update DBA'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Preferred Name"
                    value={createArData.preferred_name}
                    name="preferred_name"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.preferred_name && <span className="error">{errors.preferred_name}</span>}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="DBA"
                    value={createArData.dba}
                    name="dba"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.dba && <span className="error">{errors.dba}</span>}
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

export default Createdba;
