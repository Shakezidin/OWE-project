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
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/repcreditSlice';
import { FormInput } from '../../../../core/models/data_models/typesModel';
import {
  createRepCredit,
  updateRepCredit,
} from '../../../../redux/apiActions/config/repCreditAction';
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
  const { isSuccess, isFormSubmitting } = useAppSelector(
    (state) => state.repCredit
  );

  const [createArData, setCreateArData] = useState({
    unique_id: editData?.unique_id || '',
    Per_kw_amt: editData?.per_kw_amt || '',
    Notes: editData?.notes || '',
    Exact_amt: editData?.exact_amt || '',
    Date: editData?.date || '',
    Approved_by: editData?.approved_by || '',
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
      unique_id: [
        {
          condition: (value: any) => !!value,
          message: 'Unique Id is required',
        },
      ],
      Per_kw_amt: [
        {
          condition: (value: any) => !!value,
          message: 'Per Kw AMT is required',
        },
      ],
      Notes: [
        { condition: (value: any) => !!value, message: 'Notes is required' },
      ],
      Date: [
        { condition: (value: any) => !!value, message: 'Date is required' },
      ],
      Approved_by: [
        {
          condition: (value: any) => !!value,
          message: 'Approved By is required',
        },
      ],
      Exact_amt: [
        {
          condition: (value: any) => !!value,
          message: 'Exact Amt is required',
        },
      ],
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
        updateRepCredit({
          ...createArData,
          unique_id: createArData.unique_id,
          Per_kw_amt: parseInt(createArData.Per_kw_amt),
          Date: createArData.Date,
          Exact_amt: parseInt(createArData.Exact_amt),
          Approved_by: createArData.Approved_by,
          Notes: createArData.Notes,
          record_id: editData.record_id,
        })
      );
    } else {
      dispatch(
        createRepCredit({
          unique_id: createArData.unique_id,
          Per_kw_amt: parseInt(createArData.Per_kw_amt),
          Date: createArData.Date,
          Exact_amt: parseInt(createArData.Exact_amt),
          Approved_by: createArData.Approved_by,
          Notes: createArData.Notes,
        })
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      dispatch(resetSuccess());
    }
  }, [isSuccess, dispatch]);

  return (
    <div className="transparent-model">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? 'Create Rep Credit' : 'Update Rep Credit'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Unique Id"
                    value={createArData.unique_id}
                    name="unique_id"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.unique_id && (
                    <span className="error">{errors.unique_id}</span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Date"
                    value={createArData.Date}
                    name="Date"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.Date && <span className="error">{errors.Date}</span>}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Per Kw AMT"
                    value={createArData.Per_kw_amt}
                    name="Per_kw_amt"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.Per_kw_amt && (
                    <span className="error">{errors.Per_kw_amt}</span>
                  )}
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Approved By"
                    value={createArData.Approved_by}
                    name="Approved_by"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.Approved_by && (
                    <span className="error">{errors.Approved_by}</span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Exact Amt"
                    value={createArData.Exact_amt}
                    name="Exact_amt"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.Exact_amt && (
                    <span className="error">{errors.Exact_amt}</span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Notes"
                    value={createArData.Notes}
                    name="Notes"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.Notes && (
                    <span className="error">{errors.Notes}</span>
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

export default CreateRepCredit;
