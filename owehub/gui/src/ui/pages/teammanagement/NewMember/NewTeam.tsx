import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { updateUserForm } from '../../../../redux/apiSlice/userManagementSlice/createUserSlice';
import { CreateUserModel } from '../../../../core/models/api_models/UserManagementModel';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import Loading from '../../../components/loader/Loading';
import './AddNew.css';
import { FormInput } from '../../../../core/models/data_models/typesModel';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import SelectOption from '../../../components/selectOption/SelectOption';
import Select from 'react-select';
import { ICONS } from '../../../icons/Icons';

interface createUserProps {
  handleClose2: () => void;
  onSubmitCreateUser: (e: any) => void;
}

const NewTeam: React.FC<createUserProps> = ({
  handleClose2,
  onSubmitCreateUser,
}) => {
  const dispatch = useAppDispatch();
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const { loading, formData } = useAppSelector(
    (state) => state.createOnboardUser
  );

  const handleInputChange = (
    e: FormInput | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'first_name' || name === 'last_name') {
      const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
      dispatch(updateUserForm({ field: name, value: sanitizedValue }));
    } else {
      dispatch(updateUserForm({ field: name, value }));
    }
  };

  const comissionValueData = [
    { value: 'option1', label: 'Select Manager' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const [selectedOption2, setSelectedOption2] = useState<string>(
    comissionValueData[0].value
  );
  const handleSelectChange2 = (
    selectedOption2: { value: string; label: string } | null
  ) => {
    setSelectedOption2(selectedOption2 ? selectedOption2.value : '');
  };

  const members = [
    { value: 'option1', label: 'Select Sales Rep' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const [selectedOption, setSelectedOption] = useState<string>(
    members[0].value
  );
  const [selectedOptions, setSelectedOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const handleSelectChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    if (selectedOption) {
      setSelectedOptions([...selectedOptions, selectedOption]);
    }
    setSelectedOption(selectedOption ? selectedOption.value : '');
  };

  const handleRemoveOption = (optionToRemove: {
    value: string;
    label: string;
  }) => {
    setSelectedOptions(
      selectedOptions.filter((option) => option.value !== optionToRemove.value)
    );
  };

  /** render ui */

  return (
    <div className="transparent-model">
      {loading && (
        <div>
          <Loading /> {loading}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="new-tm-modal"
      >
        <div className="createUserCrossButton" onClick={handleClose2}>
          <CROSS_BUTTON />
        </div>
        <h3 className="createProfileText">Create new team</h3>
        <div className="modal-body">
          <div className="scroll-user">
            <div className="createProfileInputView">
              <div className="createProfileTextView">
                <div className="create-input-container">
                  <div className="tm-new-create-input-field">
                    <Input
                      type={'text'}
                      label="Team Name"
                      value={formData.first_name}
                      placeholder={'Team name'}
                      onChange={(e) => handleInputChange(e)}
                      name={'first_name'}
                      maxLength={100}
                    />
                  </div>
                  <div className="tm-new-create-input-field">
                    <label
                      className="inputLabel-select"
                      style={{ fontWeight: 400 }}
                    >
                      Report to
                    </label>
                    <SelectOption
                      options={comissionValueData}
                      value={comissionValueData.find(
                        (option) => option.value === selectedOption2
                      )}
                      onChange={handleSelectChange2}
                    />
                  </div>
                  <div className="tm-new-create-input-field">
                    <label
                      className="inputLabel-select"
                      style={{ fontWeight: 400 }}
                    >
                      Add Members
                    </label>
                    <SelectOption
                      options={members}
                      value={members.find(
                        (option) => option.value === selectedOption
                      )}
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>

                <div className="tm-select-data">
                  <p>Team Members</p>
                  <div className="nt-select-cust">
                    {selectedOptions.map((option) => (
                      <div key={option.value} className="tm-selected-option">
                        <span>{option.label}</span>
                        <div>
                          <button
                            className="remove-button"
                            onClick={() => handleRemoveOption(option)}
                          >
                            <img
                              src={ICONS.crossIconUser}
                              alt=""
                              className="remove-icon"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="create-input-container"
                  style={{ marginTop: '70px' }}
                >
                  <div className="create-input-field-note">
                    <label htmlFor="" className="inputLabel">
                      Description
                    </label>{' '}
                    <br />
                    <textarea
                      name="description"
                      id=""
                      rows={3}
                      maxLength={500}
                      value={formData.description}
                      onChange={(e) => handleInputChange(e)}
                      placeholder="Description"
                    ></textarea>
                    <p
                      className={`character-count ${
                        formData.description.trim().length >= 500
                          ? 'exceeded'
                          : ''
                      }`}
                    >
                      {formData.description.trim().length}/500 characters
                    </p>
                  </div>
                </div>
                <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tm-createUserActionButton">
          <ActionButton
            title={'Cancel'}
            onClick={handleClose2}
            type={'button'}
          />
          <ActionButton title={'Create'} onClick={() => {}} type={'submit'} />
        </div>
      </form>
    </div>
  );
};

export default NewTeam;
