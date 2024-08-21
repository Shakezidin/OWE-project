import React, { useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { validateConfigForm } from '../../../../utiles/configFormValidation';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/rebateDataSlice';
import { FormInput } from '../../../../core/models/data_models/typesModel';
import {
  createRebateData,
  updateRebateData,
} from '../../../../redux/apiActions/config/rebateDataAction';
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: any;
}

const CreateRebate: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess, isFormSubmitting } = useAppSelector(
    (state) => state.rebate
  );
  console.log('revabte update', editData);
  const [createArData, setCreateArData] = useState({
    unique_id: editData?.unique_id || '',
    customer_verf: editData?.customer_verf || '',
    type: editData?.type || '',
    item: editData?.item || '',
    amount: editData?.amount || '',
    rep_doll_divby_per: editData?.rep_doll_divby_per || '',
    notes: editData?.notes || '',
    date: editData?.start_date || '',
  });

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
    const validationRules: { [key: string]: any } = {
      unique_id: [
        {
          condition: (value: any) => !!value,
          message: 'Unique Id is required',
        },
      ],
      customer_verf: [
        {
          condition: (value: any) => !!value,
          message: 'Customer Ver is required',
        },
      ],
      type: [
        { condition: (value: any) => !!value, message: 'Type is required' },
      ],
      item: [
        { condition: (value: any) => !!value, message: 'Item is required' },
      ],

      amount: [
        { condition: (value: any) => !!value, message: 'Amount is required' },
      ],
      rep_doll_divby_per: [
        { condition: (value: any) => !!value, message: 'Rep$/% is required' },
      ],

      notes: [
        { condition: (value: any) => !!value, message: 'Notes is required' },
      ],
      date: [
        { condition: (value: any) => !!value, message: 'Date is required' },
      ],
    };
    if (editMode) {
      validationRules.record_id = [
        {
          condition: (value: any) => !!value,
          message: 'Unique Id is required',
        },
      ];
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
        updateRebateData({
          ...createArData,
          record_id: editData.record_id,
          unique_id: createArData.unique_id,
          customer_verf: createArData.customer_verf,
          item: createArData.item,
          amount: parseInt(createArData.amount),
          rep_doll_divby_per: parseInt(createArData.rep_doll_divby_per),
          notes: createArData.notes,
          type: createArData.type,
          date: createArData.date,
        })
      );
    } else {
      dispatch(
        createRebateData({
          unique_id: createArData.unique_id,
          customer_verf: createArData.customer_verf,
          item: createArData.item,
          amount: parseInt(createArData.amount),
          rep_doll_divby_per: parseInt(createArData.rep_doll_divby_per),
          notes: createArData.notes,
          type: createArData.type,
          date: createArData.date,
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
          {editMode === false ? 'Create Rebate Data' : 'Update Rebate Data'}
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
                    type={'text'}
                    label="Customer Ver"
                    value={createArData.customer_verf}
                    name="customer_verf"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.customer_verf && (
                    <span className="error">{errors.customer_verf}</span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Item"
                    value={createArData.item}
                    name="item"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.item && <span className="error">{errors.item}</span>}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Amount"
                    value={createArData.amount}
                    name="amount"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.amount && (
                    <span className="error">{errors.amount}</span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Rep $/%"
                    value={createArData.rep_doll_divby_per}
                    name="rep_doll_divby_per"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.rep_doll_divby_per && (
                    <span className="error">{errors.rep_doll_divby_per}</span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Notes"
                    value={createArData.notes}
                    name="notes"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.notes && (
                    <span className="error">{errors.notes}</span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Date"
                    value={createArData.date}
                    name="date"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.date && <span className="error">{errors.date}</span>}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Type"
                    value={createArData.type}
                    name="type"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.type && <span className="error">{errors.type}</span>}
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

export default CreateRebate;
