import React, { Dispatch, SetStateAction } from 'react';
import { ActionButton } from '../../../components/button/ActionButton';
import Input from '../../../components/text_input/Input';
import SelectOption from '../../../components/selectOption/SelectOption';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import {
  installerOption,
  partnerOption,
  stateOption,
  salesTypeOption,
} from '../../../../core/models/data_models/SelectDataModel';
import { CommissionModel } from '../../../../core/models/configuration/create/CommissionModel';
import { respTypeData } from '../../../../resources/static_data/StaticData';
import {
  FormEvent,
  FormInput,
} from '../../../../core/models/data_models/typesModel';
import { addDays, format } from 'date-fns';

interface formProps {
  handleSubmit: (e: FormEvent) => void;
  editMode: boolean;
  handleClose: () => void;
  handleChange: (newValue: any, fieldName: string) => void;
  handleInputChange: (e: FormInput) => void;
  errors: any;
  newFormData: any;
  createCommission: CommissionModel;
  isPending: boolean;
}
const CommissionForm: React.FC<formProps> = ({
  handleClose,
  handleSubmit,
  newFormData,
  createCommission,
  editMode,
  handleChange,
  handleInputChange,
  errors,
  isPending,
}) => {
  return (
    <div className="transparent-model">
      <form action="" onSubmit={(e) => handleSubmit(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false
            ? 'Create Commission Rate'
            : 'Update Commission Rate'}
        </h3>
        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select">Partner</label>
                  <SelectOption
                    options={partnerOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'partner')}
                    value={partnerOption(newFormData)?.find(
                      (option) => option?.value === createCommission.partner
                    )}
                  />
                  {errors.partner && (
                    <span className="error">{errors.partner}</span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">Installer</label>
                  <div className="">
                    <SelectOption
                      options={installerOption(newFormData)}
                      onChange={(newValue) =>
                        handleChange(newValue, 'installer')
                      }
                      value={installerOption(newFormData)?.find(
                        (option) => option.value === createCommission.installer
                      )}
                    />
                    {errors.installer && (
                      <span className="error">{errors.installer}</span>
                    )}
                  </div>
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">State</label>
                  <SelectOption
                    options={stateOption(newFormData)}
                    // options={statData}
                    onChange={(newValue) => handleChange(newValue, 'state')}
                    value={stateOption(newFormData)?.find(
                      (option) => option.value === createCommission.state
                    )}
                  />
                  {errors.state && (
                    <span className="error">{errors.state}</span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select">Sales Type</label>
                  {/* <Input
                    type={'text'}
                    label="Sales Type"
                    value={createCommission.sale_type}
                    name="sale_type"
                    placeholder={'Sales Type'}
                    onChange={(e) => handleInputChange(e)}
                  /> */}

                  <SelectOption
                    options={salesTypeOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, 'sale_type')}
                    value={salesTypeOption(newFormData)?.find(
                      (option) => option.value === createCommission.sale_type
                    )}
                  />

                  {errors.sale_type && (
                    <span className="error">{errors.sale_type}</span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'number'}
                    label="Sales Price"
                    value={createCommission.sale_price}
                    name="sale_price"
                    placeholder={'sale price'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.sale_price && (
                    <span className="error">{errors.sale_price}</span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">
                    Representative Type
                  </label>
                  <SelectOption
                    options={respTypeData}
                    onChange={(newValue) => handleChange(newValue, 'rep_type')}
                    value={respTypeData?.find(
                      (option) => option.value === createCommission.rep_type
                    )}
                  />
                  {errors.rep_type && (
                    <span className="error">{errors.rep_type}</span>
                  )}
                </div>
              </div>
              <div
                className="create-input-container"
                style={{ flexWrap: 'nowrap' }}
              >
                <div
                  className="create-input-field"
                  style={{ display: 'flex', gap: 8 }}
                >
                  <div className="rate-input-field">
                    <Input
                      type={'number'}
                      label="Rate"
                      value={createCommission.rate}
                      name="rate"
                      placeholder={'Rate'}
                      onChange={(e) => handleInputChange(e)}
                    />
                    {errors.rate && (
                      <span className="error">{errors.rate}</span>
                    )}
                  </div>
                  <div className="rate-input-field">
                    <Input
                      type={'number'}
                      label="Rate List"
                      value={createCommission.rl}
                      name="rl"
                      placeholder={'Rate List'}
                      onChange={(e) => handleInputChange(e)}
                    />
                    {errors.rl && <span className="error">{errors.rl}</span>}
                  </div>
                </div>
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="Start Date"
                    value={createCommission.start_date}
                    name={'start_date'}
                    placeholder={'1/04/2004'}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors.start_date && (
                    <span className="error">{errors.start_date}</span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={'date'}
                    label="End Date"
                    value={createCommission.end_date}
                    disabled={!createCommission.start_date}
                    name={'end_date'}
                    min={
                      createCommission.start_date &&
                      format(
                        addDays(new Date(createCommission.start_date), 1),
                        'yyyy-MM-dd'
                      )
                    }
                    placeholder={'10/04/2004'}
                    onChange={(e) => handleInputChange(e)}
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
            disabled={isPending}
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CommissionForm;
