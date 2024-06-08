import React, { useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { dealerOption } from '../../../../core/models/data_models/SelectDataModel';
import { updateDealerForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createDealerSlice';
import { DealerModel } from '../../../../core/models/configuration/create/DealerModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import { useAppDispatch } from '../../../../redux/hooks';
import { fetchDealer } from '../../../../redux/apiSlice/configSlice/config_get_slice/dealerSlice';
import { validateConfigForm } from '../../../../utiles/configFormValidation';
import { stateOption } from '../../../../core/models/data_models/SelectDataModel';
import { addDays, format } from 'date-fns';
import { toast } from 'react-toastify';
import { FormInput } from '../../../../core/models/data_models/typesModel';
interface dealerProps {
  handleClose: () => void;
  editMode: boolean;
  dealerData: DealerModel | null;
  page_number: number;
  page_size: number;
}

const CreateDealer: React.FC<dealerProps> = ({
  handleClose,
  editMode,
  page_number,
  page_size,
  dealerData,
}) => {
  const dispatch = useAppDispatch();

  const [createDealer, setCreateDealer] = useState({
    record_id: dealerData ? dealerData?.record_id : 0,
    sub_dealers: dealerData ? dealerData?.sub_dealer : '',

    pay_rate: dealerData ? dealerData?.pay_rate : '',
    start_date: dealerData ? dealerData?.start_date : '',
    end_date: dealerData ? dealerData?.end_date : '',
    state: dealerData ? dealerData?.state : '',
  });
  const [delaerVal, setDealerVal] = useState(dealerData?.dealer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newFormData, setNewFormData] = useState<any>([]);
  const tableData = {
    tableNames: ['sub_dealer', 'dealer', 'states'],
  };

  const userType = {
    role: 'sub_dealer',
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  const getUser = async () => {
    const res = await postCaller(EndPoints.get_user_by_role, userType);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getUser();
    getNewFormData();
  }, []);

  const getnewformData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setCreateDealer((prev) => ({ ...prev, ...res.data }));
  };
  useEffect(() => {
    getnewformData();
  }, []);

  const handleDealerInputChange = (e: FormInput) => {
    const { name, value } = e.target;

    if (name === 'end_date') {
      if (createDealer.start_date && value < createDealer.start_date) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          end_date: 'End date cannot be before the start date',
        }));
        return;
      }
    }
    setCreateDealer((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const page = {
    page_number: page_number,
    page_size: page_size,
  };

  /** on submit form */
  const submitDealer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(newFormData.sub_dealer);

    const validationRules = {
      sub_dealers: [
        {
          condition: (value: any) => !!value,
          message: 'Sub Dealer is required',
        },
      ],
      delaerVal: [
        { condition: (value: any) => !!value, message: 'Dealer is required' },
      ],
      pay_rate: [
        { condition: (value: any) => !!value, message: 'Pay rate is required' },
      ],
      state: [
        { condition: (value: any) => !!value, message: 'State is required' },
      ],
      start_date: [
        {
          condition: (value: any) => !!value,
          message: 'Start Date is required',
        },
      ],
      end_date: [
        { condition: (value: any) => !!value, message: 'End Date is required' },
      ],
    };
    const { isValid, errors } = validateConfigForm(
      { ...createDealer, delaerVal }!,
      validationRules
    );
    if (!isValid) {
      setErrors(errors);
      return;
    }
    try {
      setIsSubmitting(true);
      dispatch(
        updateDealerForm({
          ...createDealer,
          dealer: delaerVal,
          sub_dealer: createDealer.sub_dealers,
        })
      );
      if (createDealer.record_id) {
        const res = await postCaller(EndPoints.update_dealer, {
          ...createDealer,
          dealer: delaerVal,
          sub_dealer: createDealer.sub_dealers,
        });
        if (res.status === 200) {
          toast.success(res.message);
          handleClose();
          dispatch(fetchDealer(page));
        } else {
          toast.error(res.message);
        }
      } else {
        const { record_id, ...cleanedFormData } = createDealer;
        const res = await postCaller(EndPoints.create_dealer, {
          ...cleanedFormData,
          dealer: delaerVal,
          sub_dealer: createDealer.sub_dealers,
        });
        if (res.status === 200) {
          toast.success(res.message);
          handleClose();
          dispatch(fetchDealer(page));
        } else {
          toast.error(res.message);
        }
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error submitting form:', error);
    }
  };

  /**render UI */
  return (
    <div className="transparent-model">
      <form onSubmit={(e) => submitDealer(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <span className="createProfileText">
          {editMode === false
            ? 'Create Dealer Overrides'
            : 'Update Dealer Overrides'}
        </span>
        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    label="Sub Dealer"
                    type="text"
                    name="sub_dealer"
                    placeholder="Enter"
                    onChange={(e) =>
                      setCreateDealer({
                        ...createDealer,
                        sub_dealers: e.target.value,
                      })
                    }
                    value={createDealer.sub_dealers}
                  />
                  {errors.sub_dealers && (
                    <span className="error">{errors.sub_dealers}</span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select select-type-label">
                    Dealer
                  </label>
                  <SelectOption
                    options={dealerOption(newFormData)}
                    onChange={(newValue) => setDealerVal(newValue?.value!)}
                    value={
                      dealerOption(newFormData)?.find(
                        (option) => option.value === delaerVal
                      ) || undefined
                    }
                    
                  />
                  {errors.delaerVal && (
                    <span className="error">{errors.delaerVal}</span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Pay Rate"
                    name="pay_rate"
                    value={createDealer.pay_rate}
                    placeholder={'Enter'}
                    onChange={(e) => handleDealerInputChange(e)}
                  />
                  {errors.pay_rate && (
                    <span className="error">{errors.pay_rate}</span>
                  )}
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select select-type-label">
                    State
                  </label>
                  <SelectOption
                    menuListStyles={{ height: '230px' }}
                    options={stateOption(createDealer)}
                    onChange={(newValue) => {
                      setCreateDealer((prev) => ({
                        ...prev,
                        state: newValue?.value!,
                      }));
                    }}
                    value={stateOption(createDealer)?.find(
                      (option) => option.value === createDealer.state
                    )}
                  />

                  {errors?.state && (
                    <span
                    className="error"
                    >
                      {errors.state}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Start Date"
                    value={createDealer.start_date}
                    name="start_date"
                    placeholder={'Enter'}
                    onChange={(e) => {
                      handleDealerInputChange(e);
                      setCreateDealer((prev) => ({ ...prev, end_date: '' }));
                    }}
                  />
                  {errors.start_date && (
                    <span className="error">{errors.start_date}</span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="End Date"
                    name="end_date"
                    value={createDealer.end_date}
                    min={
                      createDealer.start_date &&
                      format(
                        addDays(new Date(createDealer.start_date), 1),
                        'yyyy-MM-dd'
                      )
                    }
                    disabled={!createDealer.start_date}
                    placeholder={'Enter'}
                    onChange={(e) => handleDealerInputChange(e)}
                  />
                  {errors.end_date && (
                    <span className="error">{errors.end_date}</span>
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
            onClick={() => {}}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateDealer;
