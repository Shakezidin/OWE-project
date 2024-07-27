import React, { useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { updateLoanTypeForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createLoanTypeSlice';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { useDispatch } from 'react-redux';
import { LoanTypeModel } from '../../../../core/models/configuration/create/LoanTypeModel';
import { useAppDispatch } from '../../../../redux/hooks';
import { validateConfigForm } from '../../../../utiles/configFormValidation';
import { fetchLoanType } from '../../../../redux/apiSlice/configSlice/config_get_slice/loanTypeSlice';
import { errorSwal, successSwal } from '../../../components/alert/ShowAlert';
import {
  FormEvent,
  FormInput,
} from '../../../../core/models/data_models/typesModel';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import { toast } from 'react-toastify';

interface loanProps {
  handleClose: () => void;
  editMode: boolean;
  loanData: LoanTypeModel | null;
  page_number: number;
  page_size: number;
  filters: FilterModel[];
}

const CreateLoanType: React.FC<loanProps> = ({
  handleClose,
  editMode,
  loanData,
  page_number,
  page_size,
  filters,
}) => {
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [createLoanTypeData, setCreateLoanTypeData] = useState<LoanTypeModel>({
    record_id: loanData ? loanData?.record_id : 0,
    product_code: loanData ? loanData?.product_code : '',
    active: loanData ? loanData?.active : '',
    adder: loanData ? loanData?.adder : '',
    description: loanData ? loanData?.description : '',
  });
  const [isPending, setIsPending] = useState(false);

  const page = {
    page_number: page_number,
    page_size: page_size,
    filters,
  };
  const handleOptionChange = (e: FormInput) => {
    const { value } = e.target;
    setCreateLoanTypeData((prevData) => ({
      ...prevData,
      active: parseInt(value),
    }));
  };

  const handleloanTypeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateLoanTypeData((prevData) => ({
      ...prevData,
      [name]: name === 'adder' ? parseFloat(value) : value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const submitLoanType = async (e: FormEvent) => {
    e.preventDefault();
    const validationRules = {
      product_code: [
        {
          condition: (value: any) => !!value,
          message: 'Product Code Name is required',
        },
      ],
      adder: [
        { condition: (value: any) => !!value, message: 'Adder is required' },
      ],

      description: [
        {
          condition: (value: any) => !!value,
          message: 'Description is required',
        },
      ],
    };
    const { isValid, errors } = validateConfigForm(
      createLoanTypeData!,
      validationRules
    );
    if (!isValid) {
      setErrors(errors);
      return;
    }
    try {
      setIsPending(true);
      dispatch(updateLoanTypeForm(createLoanTypeData));
      if (createLoanTypeData.record_id) {
        const res = await postCaller(EndPoints.update_loantype, {
          ...createLoanTypeData,
          active: createLoanTypeData.active ? 1 : 0,
        });
        if ((await res.status) === 200) {
          toast.success('Loan Type Updated successfully');
          handleClose();
          dispatch(fetchLoanType(page));
          setIsPending(false);
        } else {
          await errorSwal('', res.message);
          setIsPending(false);
        }
      } else {
        const { record_id, ...cleanedFormData } = createLoanTypeData;
        const res = await postCaller(EndPoints.create_loantype, {
          ...cleanedFormData,
          active: cleanedFormData.active ? 1 : 0,
        });
        if ((await res.status) === 200) {
          toast.success('Loan Type Created successfully');
          handleClose();
          dispatch(fetchLoanType(page));
          setIsPending(false);
        } else {
          await errorSwal('', res.message);
          setIsPending(false);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className="transparent-model">
      <form onSubmit={(e) => submitLoanType(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? 'Create Loan Type' : 'Update Loan Type'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Product Code"
                    value={createLoanTypeData.product_code}
                    name="product_code"
                    placeholder={'Enter'}
                    onChange={(e) => handleloanTypeChange(e)}
                  />
                  {errors.product_code && (
                    <span className="error">{errors.product_code}</span>
                  )}
                </div>
                {/* Radio buttons for Yes/No */}
                <div className="create-input-field">
                  <label className="inputLabel">Active</label>
                  <div className="radio-container">
                    <div className="radio-content">
                      <input
                        type="radio"
                        className="radio"
                        name="active"
                        value={'1'}
                        checked={createLoanTypeData.active === 1}
                        onChange={handleOptionChange}
                      />
                      Yes
                    </div>
                    <div className="radio-content">
                      <input
                        type="radio"
                        name="active"
                        className="radio"
                        value={'0'}
                        checked={createLoanTypeData.active === 0}
                        onChange={(e) => handleOptionChange(e)}
                      />
                      No
                    </div>
                  </div>
                </div>

                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Adder"
                    value={createLoanTypeData.adder}
                    name="adder"
                    placeholder={'Enter'}
                    // onChange={(e) => handleloanTypeChange(e)}
                    onChange={(e) => {
                      const sanitizedValue = e.target.value.replace(
                        /[^0-9.]/g,
                        ''
                      );
                      e.target.value = sanitizedValue;
                      handleloanTypeChange(e);
                    }}
                  />
                  {errors.adder && (
                    <span className="error">{errors.adder}</span>
                  )}
                </div>
              </div>
              <div className="create-input-field-note">
                <label htmlFor="" className="inputLabel">
                  Note
                </label>{' '}
                <br />
                <textarea
                  name="description"
                  id=""
                  rows={4}
                  onChange={(e) => handleloanTypeChange(e)}
                  value={createLoanTypeData.description}
                  placeholder="Type"
                ></textarea>
                {errors.description && (
                  <span className="error">{errors.description}</span>
                )}
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
            disabled={isPending}
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateLoanType;
