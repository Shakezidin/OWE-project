import React, { useEffect, useState } from 'react';

import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  createAdjustments,
  updateAdjustments,
  IRateRow,
} from '../../../../redux/apiActions/config/arAdjustmentsAction';
import {
  installerOption,
  partnerOption,
  salesTypeOption,
  stateOption,
} from '../../../../core/models/data_models/SelectDataModel';
import { format } from 'date-fns';
import SelectOption from '../../../components/selectOption/SelectOption';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/arAdjusments';
import { FormInput } from '../../../../core/models/data_models/typesModel';
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  setViewArchived: React.Dispatch<React.SetStateAction<boolean>>;
  editData: IRateRow | null;
}

const CreatedAdjustments: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  setViewArchived,
  editData,
}) => {
  const dispatch = useAppDispatch();

  const [newFormData, setNewFormData] = useState({
    uniqueId: editData?.unique_id || '',
    date: editData?.date || '',
    amount: editData?.amount ? `${editData?.amount}` : '',
    notes: editData?.notes || '',
  });

  const [errors, setErrors] = useState<typeof newFormData>(
    {} as typeof newFormData
  );
  const { isSuccess, isFormSubmitting } = useAppSelector(
    (state) => state.arAdjusments
  );

  const handleValidation = () => {
    const error: typeof newFormData = {} as typeof newFormData;
    for (const key in newFormData) {
      if (!newFormData[key as keyof typeof newFormData]) {
        error[key as keyof typeof newFormData] =
          `${key.toLocaleLowerCase()} is required`;
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
  };

  const tableData = {
    tableNames: ['partners', 'states', 'installers', 'sale_type'],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData((prev) => ({ ...prev, ...res.data }));
  };
  React.useEffect(() => {
    getNewFormData();
  }, []);

  const handleChange = (e: FormInput) => {
    const { value, name } = e.target;
    if (name === 'amount' || name === 'epc' || name === 'sysSize') {
      if (value === '' || value === '0' || Number(value)) {
        setNewFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setNewFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      setViewArchived(false);
      if (editMode) {
        dispatch(
          updateAdjustments({
            unique_id: newFormData.uniqueId,

            date: format(new Date(newFormData.date), 'yyyy-MM-dd'),
            notes: newFormData.notes,
            amount: parseFloat(newFormData.amount),

            record_id: editData?.record_id!,
          })
        );
      } else {
        dispatch(
          createAdjustments({
            unique_id: newFormData.uniqueId,

            date: format(new Date(newFormData.date), 'yyyy-MM-dd'),
            notes: newFormData.notes,
            amount: parseFloat(newFormData.amount),
          })
        );
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      isSuccess && dispatch(resetSuccess());
    }
  }, [isSuccess]);
  return (
    <div className="transparent-model">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? 'Create Adjustment' : 'Update Adjustment'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Unique ID"
                    value={newFormData.uniqueId}
                    name="uniqueId"
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                  {errors?.uniqueId && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.uniqueId}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Date"
                    value={newFormData.date}
                    name="date"
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                  {errors?.date && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.date}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Amount"
                    value={newFormData.amount}
                    name="amount"
                    placeholder={'Enter'}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value.replace(
                        /[^0-9.]/g,
                        ''
                      );
                      e.target.value = sanitizedValue;
                      handleChange(e);
                    }}
                  />
                  {errors?.amount && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.amount}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Notes"
                    value={newFormData.notes}
                    name="notes"
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                  {errors?.notes && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.notes}
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

export default CreatedAdjustments;
