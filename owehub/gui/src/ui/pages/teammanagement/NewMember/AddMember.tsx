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
import { ICONS } from '../../../icons/Icons';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import {getTeamMemberDropdown} from '../../../../redux/apiActions/teamManagement/teamManagement'
import { toast } from 'react-toastify';
 
interface createUserProps {
  handleClose: () => void;
  onSubmitCreateUser: (e: any) => void;
  team:any
  setIsRefresh:React.Dispatch<React.SetStateAction<boolean>>
 
}
 
interface Option {
  value: string;
  label: string;
}
 
interface SelectOptionProps {
  options: Option[];
  value: Option | undefined; // The value should be an Option or undefined
  onChange: (selectedOption: Option | undefined) => void; // The onChange should receive Option or undefined
}
 
const AddMember: React.FC<createUserProps> = ({
  handleClose,
  onSubmitCreateUser,
  team,
  setIsRefresh,
 

}) => {
  const dispatch = useAppDispatch();
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const { loading, formData } = useAppSelector(
    (state) => state.createOnboardUser
  );
 
  const { team_dropdown } = useAppSelector((state) => state.teamManagmentSlice);

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
 
  const [selectedOptions, setSelectedOptions] = useState<any>([]);
  const [selectedRole, setSelectedRole] = useState<any>(undefined);
  const [selectedDropdown, setSelectDropdown] = useState<any>([])
 
  const handleSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      setSelectedOptions({ ...selectedOptions });
      setSelectedRole(selectedOption);
    }
  };
  interface User {
    user_roles: string;
    rep_id: number;
    rep_code: string;
    name: string;
    phone: string;
    email: string;
  }
  // const handleSelectChange = (selectedOption: Option | undefined) => {
  //   setSelectedRole(selectedOption);
  // };
 
  // const handleRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedRole(event.target.value);
  // };
 
 
  const handleRemoveOption = (optionToRemove: Option) => {
    //@ts-ignore
    setSelectedOptions(selectedOptions?.filter((option) => option.value !== optionToRemove.value));
  };
 
  const users = {
    id: 1234567, name: 'Alex', email: 'Alex@gmail.com', phone: '+1 7594594545'
  }
 
 
  const roles: Option[] = [
    { value: 'manager', label: 'Manager' },
    { value: 'member', label: 'Member' }
  ]
 
  /** render ui */
//team-dropdown
useEffect(() => {
  const data = {
    dealer_name: team?.dealer_name,
    team_id:team?.team_id,
  }
dispatch(getTeamMemberDropdown(data))
},[])
  
const userOptions: Option[] = team_dropdown?.map((user: User) => ({
  label: user.name,
  value: user.rep_code
}));

const handleSelectDropdown = (selectedDropdown: Option | null) => {
  if (selectedDropdown) {
    setSelectDropdown({ ...selectedDropdown });
    
  }
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  try {
    
    const data = {
      team_id: team?.team_id,
      rep_ids: selectedRole?.value === 'member' ? [selectedDropdown?.value] : [],
      manager_ids: selectedRole?.value === 'manager' ? [selectedDropdown?.value] : []
    };
    const response = await postCaller('add_team_member', 
      data
    );

    console.log(response, "response")

    if (response.status > 201) {
      throw new Error('Network response was not ok');
    }
   if(response.status === 200){
    toast.success('Added in Team Successfully');
    handleClose()
    setIsRefresh((prev) => !prev);
   }
  } catch (error) {
    console.error('There was an error submitting the form:', error);
  }
};

 

  return (
    <div className="transparent-model">
      {loading && (
        <div>
          <Loading /> {loading}
        </div>
      )}
      <form
        onSubmit={(e) => {
         handleSubmit(e)
        }}
        className="tm-modal"
      >
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>
        <h3 className="createProfileText">Add member</h3>
        <div className="modal-body">
          <div className="scroll-user">
            <div className="createProfileInputView">
              <div className="createProfileTextView">
                <div className="create-input-container">

                <div className="tm-create-input-field">
                    <label className="inputLabel-select" style={{ fontWeight: 400 }}>Select User</label>
                    <SelectOption
                      options={userOptions}
                      value={selectedDropdown}
                      onChange={handleSelectDropdown}
                    />
                  </div>
                  <div className="tm-create-input-field">
                    <label className="inputLabel-select" style={{ fontWeight: 400 }}>Select Role</label>
                    <SelectOption
                      options={roles}
                      value={selectedRole}
                      onChange={handleSelectChange}
                    />
                  </div>

          
                </div>
                <div className="create-input-container">
                 

              


                  {/* <div
                    className="tm-create-input-field"
                    style={{ marginTop: -3 }}
                  >
                    <Input
                      type={'number'}
                      label="Phone Number"
                      value={users.phone}
                      placeholder={'9847463434'}
                      onChange={(e) => handleInputChange(e)}
                      name={'mobile_number'}
                      disabled={formData.isEdit}
                    />
 
                    {phoneNumberError && (
                      <p className="error-message">{phoneNumberError}</p>
                    )}
                  </div> */}
                
                </div>
                {/* <div className="tm-select-data">
                  <p>Managers</p>
                  <div className="nt-select-cust">
                    {
                      //@ts-ignore
                    selectedOptions?.map(option => (
                      <div key={option.value} className="tm-selected-option">
                        <span>{option.label}</span>
                        <div>
                          <button type="button" className="remove-button" onClick={() => handleRemoveOption(option)}>
                            <img src={ICONS.crossIconUser} alt="" className="remove-icon" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="tm-select-data">
                  <p>Sales Rep</p>
                  <div className="nt-select-cust">
                    {
                      //@ts-ignore
                    selectedOptions?.map(option => (
                      <div key={option.value} className="tm-selected-option">
                        <span>{option.label}</span>
                        <div>
                          <button type="button" className="remove-button" onClick={() => handleRemoveOption(option)}>
                            <img src={ICONS.crossIconUser} alt="" className="remove-icon" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
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
            onClick={() => { }}
            type={'submit'}
            style={{ background: "#0493CE", padding: "18px 100px", width: "unset", textTransform: "none", height: "unset" }}
          />
        </div>
      </form>
    </div>
  );
};
 
export default AddMember;
 