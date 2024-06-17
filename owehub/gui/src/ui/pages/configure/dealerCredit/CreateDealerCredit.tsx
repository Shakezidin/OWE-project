import React, { useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import Select from 'react-select';
import {
  installerOption,
  partnerOption,
  repTypeOption,
  stateOption,
} from '../../../../core/models/data_models/SelectDataModel';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { respTypeData } from '../../../../resources/static_data/StaticData';
import { updateForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createCommissionSlice';
import { CommissionModel } from '../../../../core/models/configuration/create/CommissionModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/dealerCreditSlice';
import {
  createDealerCredit,
  updateDealerCredit,
} from '../../../../redux/apiActions/config/dealerCreditAction';

interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
  editData: any;
  setViewArchived: React.Dispatch<React.SetStateAction<boolean>>;
  page_number: number;
  page_size: number;
}

interface IError {
  [key: string]: string;
}

const CreateDealerCredit: React.FC<ButtonProps> = ({
  handleClose,
  editMode,
  editData,
  setViewArchived,
  page_number,
  page_size,
}) => {
  const dispatch = useAppDispatch();

  const [dealerCredit, setDealerCredit] = useState({
    unique_id: editData ? editData.unique_id : '',
    date: editData ? editData.date : '',
    exact_amt: editData ?editData.exact_amount : '',
    per_kw_amt: editData ? editData.per_kw_amount : '',
    approved:editData ?editData.approved_by: '',
    notes: editData ? editData.notes : '',
  });
  const { isSuccess, isFormSubmitting } = useAppSelector((state) => state.dealerCredit);
  const [errors, setErrors] = useState<IError>({} as IError);
  const [newFormData, setNewFormData] = useState<any>([]);
  const tableData = {
    tableNames: ['partners', 'states', 'installers', 'rep_type'],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  const handleValidation = () => {
    const error: typeof dealerCredit = {} as typeof dealerCredit;

    for (const key in dealerCredit) {
      if (!dealerCredit[key as keyof typeof dealerCredit]) {
        // Capitalize the first letter of the key'
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        // Assign an error message with the capitalized key
        error[key as keyof typeof dealerCredit] = `${capitalizedKey} is required`;
      }
    }

    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      name === 'installPay' ||
      name === 'permitMax' ||
      name === 'redline' ||
      name === 'ptoPay' ||
      name === 'permitPay'
    ) {
      if (/^\d+(\.\d*)?$/.test(value) || value === '') {
        setDealerCredit((prev) => ({ ...prev, [name]: value }));
      } else {
        return;
      }
    } else {
      setDealerCredit((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
    if(editMode){
      const data = {
        unique_id:dealerCredit.unique_id,
        date:dealerCredit.date,
        exact_amount : parseInt(dealerCredit.exact_amt),
        per_kw_amount:parseInt(dealerCredit.per_kw_amt),
        approved_by:dealerCredit.approved,
        notes:dealerCredit.notes,
        record_id:editData.record_id,
        
      }
      dispatch(updateDealerCredit(data))
    } else {
      const data = {
        unique_id: dealerCredit.unique_id,
        date: dealerCredit.date,
        exact_amount: parseInt(dealerCredit.exact_amt),
        per_kw_amount: parseInt(dealerCredit.per_kw_amt),
        approved_by: dealerCredit.approved,
        notes: dealerCredit.notes,
      };
    dispatch(createDealerCredit(data));
    }
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
      <form action="" className="modal" onSubmit={handleSubmit}>
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? 'Create Dealer Credit' : 'Update Dealer Credit'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Unique Id"
                    value={dealerCredit.unique_id}
                    name="unique_id"
                    placeholder={'Unique Id'}
                    onChange={handleChange}
                  />
                   {errors?.unique_id && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.unique_id}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Date"
                    value={dealerCredit.date}
                    name="date"
                    placeholder={'Date'}
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
                    label="Exact Amt"
                    value={dealerCredit.exact_amt}
                    name="exact_amt"
                    placeholder={'Exact Amt'}
                    onChange={handleChange}
                  />
                      {errors?.exact_amt && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.exact_amt}
                    </span>
                  )}
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Per Kw Amt"
                    value={dealerCredit.per_kw_amt}
                    name="per_kw_amt"
                    placeholder={'Per Kw Amt'}
                    onChange={handleChange}
                  />
                   {errors?.per_kw_amt && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.per_kw_amt}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Approved By"
                    value={dealerCredit.approved}
                    name="approved"
                    placeholder={'Approved By'}
                    onChange={handleChange}
                  />
                   {errors?.approved && (
                    <span
                      style={{
                        display: 'block',
                        color: '#FF204E',
                        textTransform: 'capitalize',
                      }}
                    >
                      {errors.approved}
                    </span>
                  )} 
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Notes"
                    value={dealerCredit.notes}
                    name="notes"
                    placeholder={'notes'}
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
          <ActionButton title={'Cancel'} type="button" onClick={handleClose} />
          <ActionButton
            title={editMode === false ? 'Save' : 'Update'}
            type="submit"
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateDealerCredit;
