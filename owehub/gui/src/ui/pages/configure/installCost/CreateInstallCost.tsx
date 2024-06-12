import React, { useEffect, useState } from 'react';

import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { addDays, format } from 'date-fns';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/installConstSlice';
import {
  createInstallCost,
  ICost,
  updateInstallCost,
} from '../../../../redux/apiActions/config/installCostAction';
import { FormInput } from '../../../../core/models/data_models/typesModel';
import { firstCapitalize } from '../../../../utiles';
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: ICost | null;
  setViewArchived: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: number;
}
interface IErrors {
  uniqueId?: string;
  cost?: string;
  startDate?: string;
  endDate?: string;
}

const CreateInstallCost: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
  setViewArchived,
  currentPage,
}) => {
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<IErrors>({});

  const [newFormData, setNewFormData] = useState({
    cost: editData?.cost ? `${editData?.cost}` : '',
    startDate: editData?.start_date || '',
    endDate: editData?.end_date || '',
  });
  const { isSuccess, isFormSubmitting } = useAppSelector(
    (state) => state.installConstSlice
  );

  const handleValidation = () => {
    const error: IErrors = {};
    for (const key in newFormData) {
      if (!newFormData[key as keyof typeof newFormData]) {
        error[key as keyof typeof newFormData] = firstCapitalize(
          `${key} is required`
        );
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
  };

  const handleChange = (e: FormInput) => {
    const { value, name } = e.target;
    if (name === 'cost') {
      if (value === '' || value === '0' || Number(value)) {
        setNewFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setNewFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setViewArchived(false);
    if (handleValidation()) {
      if (editMode) {
        dispatch(
          updateInstallCost({
            record_id: editData?.record_id!,
            cost: parseFloat(newFormData.cost),
            start_date: format(new Date(newFormData.startDate), 'yyyy-MM-dd'),
            end_date: format(new Date(newFormData.endDate), 'yyyy-MM-dd'),
            currentPage,
          })
        );
      } else {
        dispatch(
          createInstallCost({
            cost: parseFloat(newFormData.cost),
            start_date: format(new Date(newFormData.startDate), 'yyyy-MM-dd'),
            end_date: format(new Date(newFormData.endDate), 'yyyy-MM-dd'),
            currentPage,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
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
          {!editMode ? 'Create Install Cost' : 'Update Install Cost'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Cost"
                    value={newFormData.cost}
                    name="cost"
                    placeholder={'Enter'}
                    // onChange={handleChange}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value.replace(
                        /[^0-9.]/g,
                        ''
                      );
                      e.target.value = sanitizedValue;
                      handleChange(e);
                    }}
                  />

                  {errors?.cost && (
                    <span
                      style={{
                        display: 'block',
                  
                        
                      }}
className="error"
                    >
                      {errors.cost}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Start date"
                    value={newFormData.startDate}
                    name="startDate"
                    placeholder={'Enter'}
                    onChange={(e) => {
                      handleChange(e);
                      setNewFormData((prev) => ({ ...prev, endDate: '' }));
                    }}
                  />
                  {errors?.startDate && (
                    <span
                      style={{
                        display: 'block',
                  
                        
                      }}
className="error"
                    >
                      {errors.startDate}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="End Date"
                    value={newFormData.endDate}
                    name="endDate"
                    disabled={!newFormData.startDate}
                    min={
                      newFormData.startDate &&
                      format(
                        addDays(new Date(newFormData.startDate), 1),
                        'yyyy-MM-dd'
                      )
                    }
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                  {errors?.endDate && (
                    <span
                      style={{
                        display: 'block',
                  
                        
                      }}
className="error"
                    >
                      {errors.endDate}
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

export default CreateInstallCost;
