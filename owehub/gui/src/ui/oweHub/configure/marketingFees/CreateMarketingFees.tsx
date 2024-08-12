import React, { useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import {
  sourceOption,
  stateOption,
} from '../../../../core/models/data_models/SelectDataModel';
import { updateMarketingForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createMarketingSlice';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { MarketingFeeModel } from '../../../../core/models/configuration/create/MarketingFeeModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import { useAppDispatch } from '../../../../redux/hooks';
import { validateConfigForm } from '../../../../utiles/configFormValidation';
import { fetchmarketingFees } from '../../../../redux/apiSlice/configSlice/config_get_slice/marketingSlice';
import { FormEvent } from '../../../../core/models/data_models/typesModel';
import { addDays, format } from 'date-fns';
import { toast } from 'react-toastify';
interface marketingProps {
  handleClose: () => void;
  editMode: boolean;
  marketingData: MarketingFeeModel | null;
  page_number: number;
  page_size: number;
}

const CreateMarketingFees: React.FC<marketingProps> = ({
  handleClose,
  editMode,
  marketingData,
  page_number,
  page_size,
}) => {
  const dispatch = useAppDispatch();
  console.log(marketingData);
  const [createMarketing, setCreateMarketing] = useState<MarketingFeeModel>({
    record_id: marketingData ? marketingData.record_id : 0,
    source: marketingData ? marketingData.source : '',
    dba: marketingData ? marketingData.dba?.trim() : '',
    state: marketingData ? marketingData.state : '',
    fee_rate: marketingData ? marketingData.fee_rate : '',
    chg_dlr: marketingData?.chg_dlr ? 'yes' : 'no',
    pay_src: marketingData?.pay_src ? 'yes' : 'no',
    start_date: marketingData?.start_date
      ? format(new Date(marketingData?.start_date?.trim()), 'yyyy-MM-dd')
      : '',
    end_date: marketingData?.end_date
      ? format(new Date(marketingData.end_date?.trim()), 'yyyy-MM-dd')
      : '',
    description: marketingData ? marketingData.description?.trim() : '',
  });
  const [newFormData, setNewFormData] = useState<any>([]);
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const tableData = {
    tableNames: ['states', 'source', 'dba', 'chg_dlr'],
  };
  const page = {
    page_number: page_number,
    page_size: page_size,
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateMarketing((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '',
    }));
  };
  const handlemarketingInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'start_date') {
      setCreateMarketing((prevData) => ({
        ...prevData,
        [name]: value,
        end_date: '',
      }));
      return;
    }
    setCreateMarketing((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitMarketingFees = async (e: FormEvent) => {
    e.preventDefault();
    const validationRules = {
      source: [
        { condition: (value: any) => !!value, message: 'Source is required' },
      ],
      dba: [{ condition: (value: any) => !!value, message: 'DBA is required' }],
      state: [
        { condition: (value: any) => !!value, message: 'State is required' },
      ],
      fee_rate: [
        { condition: (value: any) => !!value, message: 'Fee Rate is required' },
      ],
      chg_dlr: [
        {
          condition: (value: any) => value !== undefined,
          message: 'CHG DLR is required',
        },
      ],
      pay_src: [
        {
          condition: (value: any) => value !== undefined,
          message: 'Pay Src is required',
        },
      ],
      description: [
        {
          condition: (value: any) => !!value,
          message: 'Notes is required',
        },
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
      createMarketing!,
      validationRules
    );
    if (!isValid) {
      setErrors(errors);
      return;
    }
    try {
      setIsPending(true);
      const marketingData = {
        ...createMarketing,
        pay_src: createMarketing.pay_src === 'yes',
        chg_dlr: createMarketing.chg_dlr === 'yes',
      };
      dispatch(updateMarketingForm(marketingData));
      if (marketingData.record_id) {
        const res = await postCaller(
          EndPoints.update_marketingfee,
          marketingData
        );
        if (res.status === 200) {
          toast.success(res.message);
          handleClose();
          setIsPending(false);
          dispatch(fetchmarketingFees(page));
        } else {
          setIsPending(false);
          toast.error(res.message);
        }
      } else {
        const { record_id, ...cleanedFormData } = marketingData;
        const res = await postCaller(
          EndPoints.create_marketingfee,
          cleanedFormData
        );
        if (res.status === 200) {
          toast.success(res.message);
          handleClose();
          setIsPending(false);
          dispatch(fetchmarketingFees(page));
        } else {
          toast.error(res.message);
          setIsPending(false);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className="transparent-model">
      <form onSubmit={(e) => submitMarketingFees(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>
        <h3 className="createProfileText">
          {editMode === false
            ? 'Create Marketing Fees'
            : 'Update Marketing Fees'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select">Source</label>
                  <SelectOption
                    options={sourceOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'source')}
                    value={sourceOption(newFormData)?.find(
                      (option) => option.value === createMarketing.source
                    )}
                  />
                  {errors.source && (
                    <span className="error">{errors.source}</span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="DBA"
                    value={createMarketing.dba}
                    name="dba"
                    placeholder={'Enter'}
                    onChange={(e) => handlemarketingInputChange(e)}
                  />
                  {errors.dba && <span className="error">{errors.dba}</span>}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">State</label>
                  <SelectOption
                    options={stateOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'state')}
                    value={stateOption(newFormData)?.find(
                      (option) => option.value === createMarketing.state
                    )}
                  />
                  {errors.state && (
                    <span className="error">{errors.state}</span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Fee Rate"
                    value={createMarketing.fee_rate}
                    name="fee_rate"
                    placeholder={'Enter'}
                    onChange={(e) => handlemarketingInputChange(e)}
                  />
                  {errors.fee_rate && (
                    <span className="error">{errors.fee_rate}</span>
                  )}
                </div>
                <div className="create-input-field">
                  {/* <Input
                    type={'text'}
                    label="Chg DLR"
                    value={createMarketing.chg_dlr || ''}
                    name="chg_dlr"
                    placeholder={'Enter'}
                    onChange={(e) => handlemarketingInputChange(e)}
                  /> */}
                  <label className="inputLabel-select">Chg DLR</label>
                  <SelectOption
                    options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                    ]}
                    onChange={(newValue) => handleChange(newValue, 'chg_dlr')}
                    value={{
                      value: createMarketing.chg_dlr,
                      label: createMarketing.chg_dlr === 'yes' ? 'Yes' : 'No',
                    }}
                  />
                  {errors.chg_dlr && (
                    <span className="error">{errors.chg_dlr}</span>
                  )}
                </div>

                <div className="create-input-field">
                  {/* <Input
                    type={'text'}
                    label="Pay Src"
                    value={createMarketing.pay_src || ''}
                    name="pay_src"
                    placeholder={'Enter'}
                    onChange={(e) => handlemarketingInputChange(e)}
                  /> */}
                  <label className="inputLabel-select">Pay Src</label>
                  <SelectOption
                    options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                    ]}
                    onChange={(newValue) => handleChange(newValue, 'pay_src')}
                    value={{
                      value: createMarketing.pay_src,
                      label: createMarketing.pay_src === 'yes' ? 'Yes' : 'No',
                    }}
                  />
                  {errors.pay_src && (
                    <span className="error">{errors.pay_src}</span>
                  )}
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Start Date"
                    value={createMarketing.start_date}
                    name="start_date"
                    placeholder={'1/04/2004'}
                    onChange={(e) => handlemarketingInputChange(e)}
                  />
                  {errors.start_date && (
                    <span className="error">{errors.start_date}</span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="End Date"
                    value={createMarketing.end_date}
                    disabled={!createMarketing.start_date}
                    name="end_date"
                    placeholder={'10/04/2004'}
                    min={
                      createMarketing.start_date &&
                      format(
                        addDays(new Date(createMarketing.start_date), 1),
                        'yyyy-MM-dd'
                      )
                    }
                    onChange={(e) => handlemarketingInputChange(e)}
                  />
                  {errors.end_date && (
                    <span className="error">{errors.end_date}</span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Notes"
                    value={createMarketing.description}
                    name="notes"
                    placeholder={'Enter'}
                    onChange={(e) =>
                      setCreateMarketing((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                  {errors?.description && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.description}
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
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateMarketingFees;
