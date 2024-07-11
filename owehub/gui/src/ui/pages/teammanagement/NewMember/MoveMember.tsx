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

interface createUserProps {
    handleClose1: () => void;
    onSubmitCreateUser: (e: any) => void;
}

const MoveMember: React.FC<createUserProps> = ({
    handleClose1,
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
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
    ]

    const [selectedOption2, setSelectedOption2] = useState<string>(
        comissionValueData[0].label
      );
      const handleSelectChange2 = (
        selectedOption2: { value: string; label: string } | null
      ) => {
        setSelectedOption2(selectedOption2 ? selectedOption2.value : '');
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
                <div className="createUserCrossButton" onClick={handleClose1}>
                    <CROSS_BUTTON />
                </div>
                <h3 className="createProfileText">Move to another team</h3>
                <div className="modal-body">
                    <div className="scroll-user">
                        <div className="createProfileInputView">
                            <div className="createProfileTextView">
                                <div className="create-input-container">
                                    <div className="tm-create-input-field">
                                        <Input
                                            type={'text'}
                                            label="Current Team"
                                            value={formData.first_name}
                                            placeholder={'United Wholesales'}
                                            onChange={(e) => handleInputChange(e)}
                                            name={'first_name'}
                                            maxLength={100}
                                        />
                                    </div>
                                    <div className="tm-create-input-field">
                                    <label className="inputLabel-select" style={{ fontWeight: 400 }}>New Team</label>
                                        <SelectOption
                                            options={comissionValueData}
                                            value={comissionValueData.find(
                                                (option) => option.value === selectedOption2
                                              )}
                                              onChange={handleSelectChange2}
                                        />
                                    </div>

                                </div>
                                <div className="create-input-container">
                                    <div className="tm-create-input-field">
                                        <Input
                                            type={'text'}
                                            label="Current Role"
                                            value={formData.email_id}
                                            placeholder={'Sales Rep'}
                                            onChange={(e) => handleInputChange(e)}
                                            name={'email_id'}
                                            disabled={formData.isEdit}
                                        />
                                    </div>

                                    <div
                                        className="tm-create-input-field"
                                    >
                                        <label className="inputLabel-select" style={{ fontWeight: 400 }}>New Role</label>
                                        <SelectOption
                                            options={comissionValueData}
                                            value={comissionValueData.find(
                                                (option) => option.value === selectedOption2
                                              )}
                                              onChange={handleSelectChange2}
                                        />
                                    </div>

                                </div>
                                <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="tm-createUserActionButton">
                    <ActionButton title={'Move'} onClick={() => { }} type={'submit'} />
                </div>
            </form>
        </div>
    );
};

export default MoveMember;
