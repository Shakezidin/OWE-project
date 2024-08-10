import React, { useEffect, useState } from 'react';

import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';

import { ActionButton } from '../../../components/button/ActionButton';
import { updatePayForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createPayScheduleSlice';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  installerOption,
  partnerOption,
  salesTypeOption,
  stateOption,
} from '../../../../core/models/data_models/SelectDataModel';
import Select from 'react-select';
import {
  createApRep,
  updateApRep,
} from '../../../../redux/apiActions/config/apRepAction';
import { paySaleTypeData } from '../../../../resources/static_data/StaticData';
import { PayScheduleModel } from '../../../../core/models/configuration/create/PayScheduleModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import { validateConfigForm } from '../../../../utiles/configFormValidation';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/apRepSlice';
import { FormInput } from '../../../../core/models/data_models/typesModel';
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: any;
}

const CreatedApRep: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess, isFormSubmitting } = useAppSelector(
    (state) => state.apRepSlice
  );

  const [createArData, setCreateArData] = useState({
    // customer_name:editData?.customer_name || "",
    unique_id: editData?.unique_id || '',
    rep: editData?.rep || '',
    dba: editData?.dba || '',
    type: editData?.type || '',
    date: editData?.date || '',
    amount: editData?.amount || '',
    method: editData?.method || '',
    cbiz: editData?.cbiz || '',
    transaction: editData?.transaction || '',
    notes: editData?.notes || '',
  });

  const [newFormData, setNewFormData] = useState<any>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      rep: [{ condition: (value: any) => !!value, message: 'Rep is required' }],
      dba: [{ condition: (value: any) => !!value, message: 'DBA is required' }],
      type: [
        {
          condition: (value: any) => !!value,
          message: 'Type is required',
        },
      ],
      date: [
        { condition: (value: any) => !!value, message: 'date is required' },
      ],
      amount: [
        { condition: (value: any) => !!value, message: 'amount is required' },
      ],
      method: [
        { condition: (value: any) => !!value, message: 'method is required' },
      ],
      cbiz: [
        { condition: (value: any) => !!value, message: 'cbiz is required' },
      ],
      transaction: [
        {
          condition: (value: any) => !!value,
          message: 'Transaction is required',
        },
      ],
      notes: [
        { condition: (value: any) => !!value, message: 'Notes is required' },
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

    // dispatch(
    //   createApRep({
    //     unique_id: createArData.unique_id,
    //     rep: createArData.rep,
    //     dba: createArData.dba,
    //     type: createArData.type,
    //     date: createArData.date,
    //     amount: parseInt(createArData.amount),
    //     method:createArData.method,
    //     cbiz:createArData.cbiz,
    //     transaction:createArData.transaction,
    //     notes:createArData.notes
    //   })
    // );
    if (editMode) {
      dispatch(
        updateApRep({
          ...createArData,
          record_id: editData?.record_id!,
          amount: parseInt(createArData.amount),
        })
      );
    } else {
      const data = {
        ...createArData,
        amount: parseFloat(createArData.amount), // Convert to number
      };
      dispatch(createApRep(data));
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
          {editMode === false ? 'Create AP Rep' : 'Update Ap Rep'}
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
                    label="REP"
                    value={createArData.rep}
                    name="rep"
                    placeholder={'Enter'}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                  />
                  {errors.rep && <span className="error">{errors.rep}</span>}
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

              <div className="create-input-container">
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
                    label="Amount"
                    value={createArData.amount}
                    name="amount"
                    placeholder={'Enter'}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value.replace(
                        /[^0-9.]/g,
                        ''
                      );
                      e.target.value = sanitizedValue;
                      handleInputChange(e);
                    }}
                  />
                  {errors.amount && (
                    <span className="error">{errors.amount}</span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Method"
                    value={createArData.method}
                    name="method"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.method && (
                    <span className="error">{errors.method}</span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="CBIZ"
                    value={createArData.cbiz}
                    name="cbiz"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.cbiz && <span className="error">{errors.cbiz}</span>}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Transaction"
                    value={createArData.transaction}
                    name="transaction"
                    placeholder={'Enter'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.transaction && (
                    <span className="error">{errors.transaction}</span>
                  )}
                </div>
              </div>
              <div className="create-input-container">
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

export default CreatedApRep;
