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

  const [selectedOption2, setSelectedOption2] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  useEffect(() => {
    const data = { role: 'Sales Manager' };
    const dataa = {
      role: 'Sales Manager',
      name: selectedOption2,
      sub_role: 'Sale Representative',
    };
    dispatch(getSalesManagerList(data));
    dispatch(getsaleRepList(dataa));
  }, [dispatch, selectedOption2]);

  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const comissionValueDataa: Option[] = [
    { value: 'option0', label: 'Select Manager' },
    ...sales_manager_list.map((manager: any) => ({
      value: manager.name,
      label: manager.name,
    })),
  ];

  const members: Option[] = sale_rep_list.map((rep: any) => ({
    value: rep.rep_id,
    label: rep.name,
  }));

  // Adding the initial option
  members.unshift({ value: 'option1', label: 'Select Sales Rep' });

  const handleSelectChange2 = (selectedOption: Option | null) => {
    setSelectedOption2(selectedOption ? selectedOption.value : '');
  };

  const handleSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      setSelectedOptions([...selectedOptions, selectedOption]);
    }
  };

  const handleRemoveOption = (optionToRemove: Option) => {
    setSelectedOptions(
      selectedOptions.filter((option) => option.value !== optionToRemove.value)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      team_name: formData.first_name,
      rep_ids: selectedOptions.map((option) => option.value),
      description: formData.description,
    };
    dispatch(createTeam(data));
  };

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

  console.log(sale_rep_list, 'oihd');
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
              <div className="createProfileTextView">
                <div className="create-input-container">
                  <div className="tm-new-create-input-field">
                    <Input
                      type="text"
                      label="Team Name"
                      value={formData.first_name}
                      placeholder="Team name"
                      onChange={handleInputChange}
                      name="first_name"
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
                      options={comissionValueDataa}
                      value={comissionValueDataa.find(
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
                      value={members.find((option) => option.value === '')}
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
                <div
                  className="create-input-container"
                  style={{ marginTop: '70px' }}
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
