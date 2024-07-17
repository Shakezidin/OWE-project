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

interface createUserProps {
  handleClose: () => void;
  onSubmitCreateUser: (e: any) => void;
}

const AddMember: React.FC<createUserProps> = ({
  handleClose,
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
        className="tm-modal"
      >
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>
        <h3 className="createProfileText">Add New Member</h3>
        <div className="modal-body">
          <div className="scroll-user">
            <div className="createProfileInputView">
              <div className="createProfileTextView">
                <div className="create-input-container">
                  <div className="tm-create-input-field">
                    <Input
                      type={'text'}
                      label="Unique ID"
                      value={formData.email_id}
                      placeholder={'OWE012345'}
                      onChange={(e) => handleInputChange(e)}
                      name={'email_id'}
                      disabled={formData.isEdit}
                    />
                  </div>
                  <div className="tm-create-input-field">
                    <Input
                      type={'text'}
                      label="First Name"
                      value={formData.first_name}
                      placeholder={'Enter First Name'}
                      onChange={(e) => handleInputChange(e)}
                      name={'first_name'}
                      maxLength={100}
                    />
                  </div>
                </div>
                <div className="create-input-container">
                  <div className="tm-create-input-field">
                    <Input
                      type={'text'}
                      label="Last Name"
                      value={formData.last_name}
                      placeholder={'Enter Last Name'}
                      onChange={(e) => handleInputChange(e)}
                      name={'last_name'}
                      maxLength={100}
                    />
                  </div>
                  <div
                    className="tm-create-input-field"
                    style={{ marginTop: -3 }}
                  >
                    <Input
                      type={'number'}
                      label="Phone Number"
                      value={formData.mobile_number}
                      placeholder={'123456789'}
                      onChange={(e) => handleInputChange(e)}
                      name={'mobile_number'}
                      disabled={formData.isEdit}
                    />

                    {phoneNumberError && (
                      <p className="error-message">{phoneNumberError}</p>
                    )}
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
            title={'Add to team'}
            onClick={() => {}}
            type={'submit'}
          />
        </div>
      </form>
    </div>
  );
};

export default AddMember;
