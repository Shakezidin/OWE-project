import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import Loading from '../../../components/loader/Loading';
import './AddNew.css';
import SelectOption from '../../../components/selectOption/SelectOption';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  getSalesManagerList,
  getsaleRepList,
  createTeam,
} from '../../../../redux/apiActions/teamManagement/teamManagement';
import { ICONS } from '../../../icons/Icons';
import { resetSuccess } from '../../../../redux/apiSlice/teamManagementSlice.tsx/teamManagmentSlice';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { dealerOption } from '../../../../core/models/data_models/SelectDataModel';
import { TYPE_OF_USER } from '../../../../resources/static_data/Constant';

interface CreateUserProps {
  handleClose2: () => void;
  setRefetch: Dispatch<SetStateAction<number>>;
}

interface Option {
  value: string;
  label: string;
}

interface FormInput
  extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}

const NewTeam: React.FC<CreateUserProps> = ({ handleClose2, setRefetch }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.createOnboardUser);
  const { sales_manager_list, sale_rep_list, isSuccess } = useAppSelector(
    (state) => state.teamManagmentSlice
  );
  const [formData, setFormData] = useState({
    description: '',
    first_name: '',
  });

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [selectedOption2, setSelectedOption2] = useState<string>('');
  const [selectedOption3, setSelectedOption3] = useState<string>('');
  const [selectedOptions2, setSelectedOptions2] = useState<Option[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [membersOption, setMembersOption] = useState<Option[]>([]);
  const [newFormData, setNewFormData] = useState<string[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
 
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Added for validation errors // Added for validation error message

  const getnewformData = async () => {
    const tableData = {
      tableNames: ['dealer'],
    };
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data?.dealer as string[]);
  };
  useEffect(() => {
    getnewformData();
  }, []);
  console.log(newFormData, 'form data');

  useEffect(() => {
    if (localStorage.getItem('role')) {
      const roleAdmin = localStorage.getItem('role');
      if (roleAdmin !== null) {
        setUserRole(roleAdmin);
      } else {
        console.log('role value is null');
      }
    } else {
      console.log('role key does not exist in localStorage');
    }
  }, []);

  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [managerOptions, setManagerOptions] = useState<Option[]>([]);

  const getUsersByDealer = async (dealer?: string) => {
    try {
      const data = await postCaller('get_team_member_dropdown', {
        dealer_name: dealer,
      });
      if (data.status > 201) {
        return new Error(data);
      }
      return await data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectChange2 = (selectedOption: Option | null) => {
    if (selectedOption) {
      setSelectedOptions2((prevOptions) => {
        const optionExists = prevOptions.some(
          (option) => option.value === selectedOption.value
        );
        if (!optionExists) {
          return [...prevOptions, selectedOption];
        }
        return prevOptions;
      });
      setMembersOption((prev) =>
        prev.filter((opt) => opt.value !== selectedOption.value)
      );
    }
  };

  const handleRemoveOption2 = (optionToRemove: Option) => {
    setSelectedOptions2((prevOptions) =>
      prevOptions.filter((option) => option !== optionToRemove)
    );
    setMembersOption((prev) => [...prev, { ...optionToRemove }]);
  };

  const handleSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      const optionExists = selectedOptions.some(
        (option) => option.value === selectedOption.value
      );

      if (!optionExists) {
        setSelectedOptions([...selectedOptions, selectedOption]);
      }
      setManagerOptions((prev) =>
        prev.filter((opt) => opt.value !== selectedOption.value)
      );
    }
  };

  const handleRemoveOption = (optionToRemove: Option) => {
    setSelectedOptions(
      selectedOptions.filter((option) => option !== optionToRemove)
    );
    setManagerOptions((prev) => [...prev, { ...optionToRemove }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("jdkfgh");
    e.preventDefault();
    const roleAdmin = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    let userCode;
    if (roleAdmin === TYPE_OF_USER.SALE_MANAGER) {
      userCode = managers.find((item) => item.email === email);
    }

    const validationErrors: { [key: string]: string } = {};

    if (formData.first_name.trim() === '') {
      validationErrors.first_name = 'Team Name is required.';
    }
   
    
    if (selectedOptions2.length === 0) {
      validationErrors.managers = 'Please select at least one manager';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = {
      team_name: formData.first_name,
      sale_rep_ids: selectedOptions2.map((option) => option.value),
      manager_ids:
        roleAdmin === TYPE_OF_USER.SALE_MANAGER
          ? [
              userCode?.rep_code,
              ...selectedOptions.map((option) => option.value),
            ]
          : selectedOptions.map((option) => option.value),
      description: formData.description,
      dealer_name: selectedOption3 || undefined,
    };
    dispatch(createTeam(data));
  };

  useEffect(() => {
    const roleAdmin = localStorage.getItem('role');
    if (roleAdmin !== TYPE_OF_USER.ADMIN) {
      (async () => {
        const data: { [key: string]: any } = await getUsersByDealer('');
        if (data?.data?.sale_rep_list) {
          const managers =
            data?.data?.sale_rep_list
              ?.filter(
                (item: any) =>
                  item.user_roles !== TYPE_OF_USER.SALES_REPRESENTATIVE
              )
              .map((item: any) => ({
                label: `${item.name}-${item.rep_code}`,
                value: item.rep_code,
              })) || [];
          setManagers(data?.data?.sale_rep_list || []);
          const members =
            data?.data?.sale_rep_list.map((item: any) => ({
              label: `${item.name}-${item.rep_code}`,
              value: item.rep_code,
            })) || [];
          setManagerOptions(managers);
          setMembersOption(members);
        }
      })();
    }
  }, [userRole]);

  useEffect(() => {
    if (isSuccess) {
      handleClose2();
      setRefetch((prev) => prev + 1);
    }
    return () => {
      isSuccess && dispatch(resetSuccess());
    };
  }, [isSuccess]);

  const handleClose = () => {};

  const handleSelectChange3 = async (selectedOption3: Option | null) => {
    setSelectedOption3(selectedOption3 ? selectedOption3.value : '');
    if (selectedOption3?.value) {
      const data: { [key: string]: any } = await getUsersByDealer(
        selectedOption3.value
      );
      if (data?.data?.sale_rep_list) {
        const managers =
          data?.data?.sale_rep_list
            ?.filter(
              (item: any) =>
                item.user_roles !== TYPE_OF_USER.SALES_REPRESENTATIVE
            )
            .map((item: any) => ({ label: item.name, value: item.rep_code })) ||
          [];

        const members =
          data?.data?.sale_rep_list.map((item: any) => ({
            label: item.name,
            value: item.rep_code,
          })) || [];
        setManagerOptions(managers);
        setMembersOption(members);
      }
    }
  };
  const slectedDealer = newFormData.find(
    (option) => option === selectedOption3
  );

 

  return (
    <div className="transparent-model">
      {loading && <Loading />}
      <form onSubmit={handleSubmit} className="new-tm-modal">
        <div className="createUserCrossButton" onClick={handleClose2}>
          <CROSS_BUTTON />
        </div>
        <h3 className="createProfileText">Create new team</h3>
        <div className="modal-body">
          <div className="scroll-user">
            <div className="createProfileInputView">
              <div className="createProfileTextView" style={{minHeight:200}}>
                <div className="create-input-container">
                  <div className="tm-new-create-input-field">
                    <Input
                      type="text"
                      label="Team Name"
                      value={formData.first_name}
                      placeholder="Enter Team name"
                      onChange={handleInputChange}
                      name="first_name"
                      maxLength={100}
                    />
                  {errors.first_name && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.first_name}
                    </span>
                  )}
                  </div>

                  {userRole === 'Admin' && (
                    <div className="tm-new-create-input-field">
                      <label
                        className="inputLabel-select"
                        style={{ fontWeight: 400 }}
                      >
                        Dealer Name
                      </label>
                      <SelectOption
                        options={newFormData.map((item) => ({
                          label: item,
                          value: item,
                        }))}
                        value={
                          slectedDealer
                            ? {
                                label: slectedDealer,
                                value: slectedDealer,
                              }
                            : undefined
                        }
                        onChange={handleSelectChange3}
                      />               
                    </div>
                  )}
                  <div className="tm-new-create-input-field">
                    <label
                      className="inputLabel-select"
                      style={{ fontWeight: 400 }}
                    >
                      Select Managers
                    </label>
                    <SelectOption
                      options={managerOptions}
                      value={managerOptions.find(
                        (option) => option.value === selectedOption2
                      )}
                      onChange={handleSelectChange2}
                    />
                      {errors.managers && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error"
                    >
                      {errors.managers}
                    </span>
                  )}
                  </div>
                  <div className="tm-new-create-input-field">
                    <label
                      className="inputLabel-select"
                      style={{ fontWeight: 400 }}
                    >
                      Select Members
                    </label>
                    <SelectOption
                      options={membersOption}
                      value={membersOption.find(
                        (option) => option.value === ''
                      )}
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>

                {!!selectedOptions2.length && (
                  <div className="tm-select-data">
                    <p>Managers</p>
                    <div className="nt-select-cust">
                      {selectedOptions2.map((option) => (
                        <div key={option.value} className="tm-selected-option">
                          <span>{option.label}</span>
                          <button
                            type="button"
                            className="remove-button"
                            onClick={() => handleRemoveOption2(option)}
                          >
                            <img
                              src={ICONS.crossIconUser}
                              alt=""
                              className="remove-icon"
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!!selectedOptions.length && (
                  <div className="tm-select-data" style={{ marginTop: '20px' }}>
                    <p>Sales Rep</p>
                    <div className="nt-select-cust">
                      {selectedOptions.map((option) => (
                        <div key={option.value} className="tm-selected-option">
                          <span>{option.label}</span>
                          <div>
                            <button
                              type="button"
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
                )}
                <div
                  className="create-input-container"
                  style={{ marginTop: '20px' }}
                >
                  <div className="create-input-field-note">
                    <label htmlFor="" className="inputLabel">
                      Description
                    </label>
                    <br />
                    <textarea
                      name="description"
                      rows={3}
                      maxLength={500}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Description"
                    ></textarea>
                    <p
                      className={`character-count ${formData.description.trim().length >= 500 ? 'exceeded' : ''}`}
                    >
                      {formData.description.trim().length}/500 characters
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tm-createUserActionButton">
          <ActionButton title="Cancel" onClick={handleClose2} type="button" />
          <ActionButton title="Create" type="submit" onClick={handleClose} />
        </div>
      </form>
    </div>
  );
};

export default NewTeam;
