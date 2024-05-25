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
import {
  createDealerCredit,updateDealerCredit
} from '../../../../redux/apiActions/config/dealerCreditAction';

interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
   editData:any,
   setViewArchived: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IError {
  [key: string]: string;
}

const CreateDealerCredit: React.FC<ButtonProps> = ({
  handleClose,
  editMode,
  editData,
  setViewArchived,
}) => {
  const dispatch = useAppDispatch();

  const [dealerCredit, setDealerCredit] = useState({
   unique_id: "",
   date:"",
   exact_amt:"",
   per_kw_amt:"",
   approved:"",
   notes:"",




  });
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
    const error: IError = {} as IError;
    for (const key in setDealerCredit) {
      if (key === 'record_id') {
        continue;
      }
      if (!CreateDealerCredit[key as keyof typeof CreateDealerCredit]) {
        error[key as keyof IError] = `${key.toLocaleLowerCase()} is required`;
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length === 0;
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
      const data = {
      unique_id:dealerCredit.unique_id,
      date:dealerCredit.date,
      exact_amount:parseInt(dealerCredit.exact_amt),
      per_kw_amount: parseInt(dealerCredit.per_kw_amt),
      approved_by:dealerCredit.approved,
      notes:dealerCredit.notes
      };
      dispatch(createDealerCredit(data));
   
  
  };

 
  return (
    <div className="transparent-model">
      <form action=""  className="modal"  onSubmit={handleSubmit}>
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
                    label="Unqiue Id"
                    value={dealerCredit.unique_id}
                    name="unique_id"
                    placeholder={'Unique Id'}
                    onChange={handleChange}
                  />
                  {errors?.unique_id && (
                    <span style={{ display: 'block', color: '#FF204E' }}>
                      {errors.unique_id.replace('sale_type', 'sale type')}
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
                    <span style={{ display: 'block', color: '#FF204E' }}>
                      {errors.date.replace('sale_price', 'sale pricee')}
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
                    <span style={{ display: 'block', color: '#FF204E' }}>
                      {errors.date.replace('sale_price', 'sale pricee')}
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
                      <span style={{ display: 'block', color: '#FF204E' }}>
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
                    {errors?.approve && (
                      <span style={{ display: 'block', color: '#FF204E' }}>
                        {errors.approve.replace('approve', 'approve')}
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
                      <span style={{ display: 'block', color: '#FF204E' }}>
                        {errors.start_date.replace('notes', 'Notes')}
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
