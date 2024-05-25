import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { useDispatch } from 'react-redux';
import { updateUserForm } from '../../../../redux/apiSlice/userManagementSlice/createUserSlice';
import CheckBox from '../../../components/chekbox/CheckBox';
import { ICONS } from '../../../icons/Icons';
import SelectTable from '../userTableList/SeletTable';
import UserBasedInput from './UserBasedInput';
import SelectOption from '../../../components/selectOption/SelectOption';
import { CreateUserModel } from '../../../../core/models/api_models/UserManagementModel';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import Loading from '../../../components/loader/Loading';
import { ALL_USER_ROLE_LIST } from '../../../../resources/static_data/Constant';
import './Userboard.css';
import { TYPE_OF_USER } from '../../../../resources/static_data/Constant';
import { FormInput } from '../../../../core/models/data_models/typesModel';
import { getDataTableName } from '../../../../redux/apiActions/dataTableAction';
interface createUserProps {
  editMode: boolean;
  handleClose: () => void;
  userOnboard: CreateUserModel | null;
  onSubmitCreateUser: (e: any) => void;
  onChangeRole: (role: string, value: string) => void;
  dealerList: any[];
  regionList: any[];
  selectedOption: { label?: string; value?: string };
  tablePermissions: {};
  setTablePermissions: Dispatch<SetStateAction<{}>>;
}

const UserOnboardingCreation: React.FC<createUserProps> = ({
  handleClose,
  onSubmitCreateUser,
  onChangeRole,
  dealerList,
  regionList,
  selectedOption,
  tablePermissions,
  setTablePermissions,
}) => {
  const dispatch = useAppDispatch();
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [dbAccess, setDbAcess] = useState(false);
  const { loading, formData } = useAppSelector(
    (state) => state.createOnboardUser
  );
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selectTable, setSelectTable] = useState<boolean>(false);
  const tables = useAppSelector((state) => state.dataTableSlice.option);

  /** handle change for role */
  const handleChange = (newValue: any, fieldName: string) => {
    dispatch(updateUserForm({ field: 'assigned_dealer_name', value: '' }));
    dispatch(updateUserForm({ field: 'add_region', value: '' }));
    dispatch(updateUserForm({ field: 'team_name', value: '' }));
    dispatch(updateUserForm({ field: 'report_to', value: '' }));
    const { value } = newValue;
    onChangeRole('Role', value);
    setTablePermissions({});
    dispatch(updateUserForm({ field: fieldName, value }));
  };

  /**handle change for dealer */
  const handleChangeForDealer = (newValue: any, fieldName: string) => {
    const { value } = newValue;
    onChangeRole('Dealer', value);
    dispatch(updateUserForm({ field: fieldName, value }));
    dispatch(updateUserForm({ field: 'report_to', value: '' }));
  };

  /**handle change for dealer */
  const handleChangeForRegion = (newValue: any, fieldName: string) => {
    const { value } = newValue;
    dispatch(updateUserForm({ field: fieldName, value }));
  };

  const handleInputChange = (
    e:
      | FormInput
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'first_name' || name === 'last_name') {
      dispatch(updateUserForm({ field: name, value }));
    } else if (name === 'mobile_number') {
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 16);
      if (numericValue.length < 7) {
        setPhoneNumberError('Phone Number should be at least 7 digits');
      } else if (numericValue.length > 16) {
        setPhoneNumberError('Phone Number should not exceed 16 digits');
      } else {
        setPhoneNumberError('');
      }
      dispatch(updateUserForm({ field: name, value: numericValue }));
    } else {
      dispatch(updateUserForm({ field: name, value }));
    }
  };

  useEffect(() => {
    if (selectedOption.value === TYPE_OF_USER.ADMIN) {
      setDbAcess(true);
      const set = new Set(
        Array.from({ length: tables?.length }).map((_, i: number) => i)
      );
      setSelected(set);
      const obj: { [key: string]: string } = {};
      tables.forEach((table: { table_name: string }) => {
        obj[table.table_name] = 'Full';
      });
      setTablePermissions(obj);
    } else {
      setTablePermissions({});
      setDbAcess(false);
    }
  }, [selectedOption, tables]);

  useEffect(() => {
    dispatch(getDataTableName({get_all_table:true}));
  }, []);
  
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
          onSubmitCreateUser(tablePermissions);
        }}
        className="modal"
      >
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>
        <h3 className="createProfileText">Onboarding</h3>
        <div className="modal-body">
          <div className="scroll-user">
            <div className="createProfileInputView">
              <div className="createProfileTextView">
                <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={'text'}
                      label="First Name"
                      value={formData.first_name}
                      placeholder={'Enter First Name'}
                      onChange={(e) => handleInputChange(e)}
                      name={'first_name'}
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={'text'}
                      label="Last Name"
                      value={formData.last_name}
                      placeholder={'Enter Last Name'}
                      onChange={(e) => handleInputChange(e)}
                      name={'last_name'}
                    />
                  </div>
                  <div className="create-input-field">
                    <label className="inputLabel-select selected-fields-onboard">
                      Role
                    </label>
                    <SelectOption
                      options={ALL_USER_ROLE_LIST}
                      onChange={(newValue) => {
                        handleChange(newValue, 'role_name');
                        if (newValue?.value !== TYPE_OF_USER.ADMIN) {
                          setTablePermissions({});
                          setSelected(new Set());
                          setDbAcess(false);
                        }
                        if (newValue?.value === TYPE_OF_USER.ADMIN) {
                          setDbAcess(true);
                          const set = new Set(
                            Array.from({ length: tables.length }).map(
                              (_, i: number) => i
                            )
                          );
                          setSelected(set);
                          const obj: { [key: string]: string } = {};
                          tables.forEach((table: { table_name: string }) => {
                            obj[table.table_name] = 'Full';
                          });
                          setTablePermissions(obj);
                        }
                      }}
                      value={ALL_USER_ROLE_LIST?.find(
                        (option) => option?.value === formData.role_name
                      )}
                    />
                  </div>
                </div>
                <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={'text'}
                      label="Email ID"
                      value={formData.email_id}
                      placeholder={'email@mymail.com'}
                      onChange={(e) => handleInputChange(e)}
                      name={'email_id'}
                      disabled={formData.isEdit}
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={'text'}
                      label="Phone Number"
                      value={formData.mobile_number}
                      placeholder={'Phone Number'}
                      onChange={(e) => handleInputChange(e)}
                      name={'mobile_number'}
                    />
                    {phoneNumberError && (
                      <p className="error-message">{phoneNumberError}</p>
                    )}
                  </div>
                  {formData.role_name === 'Admin' ||
                  formData.role_name === 'SubDealer Owner' ||
                  formData.role_name === 'DB User' ||
                  formData.role_name === 'Dealer Owner' ||
                  formData.role_name === 'Finance Admin' ? null : (
                    <div className="create-input-field">
                      <label className="inputLabel-select selected-fields-onboard">
                        Dealer Owner
                      </label>
                      <SelectOption
                        options={dealerList}
                        onChange={(newValue) =>
                          handleChangeForDealer(
                            newValue,
                            'assigned_dealer_name'
                          )
                        }
                        value={dealerList?.find(
                          (option) =>
                            option?.value === formData.assigned_dealer_name
                        )}
                      />
                    </div>
                  )}
                </div>
                <UserBasedInput
                  formData={formData}
                  onChange={(e: any) => handleInputChange(e)}
                  regionList={regionList}
                  handleChangeForRegion={(value: any, name: string) => {
                    handleChangeForRegion(value, name);
                  }}
                />
                <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <CheckBox
                      checked={dbAccess}
                      disabled={
                        selectedOption.value !== TYPE_OF_USER.ADMIN &&
                        selectedOption.value !== TYPE_OF_USER.DB_USER
                      }
                      onChange={() => {
                        setDbAcess((prev) => !prev);
                        if (dbAccess) {
                          setTablePermissions({});
                        }
                      }}
                    />
                    <div className="access-data">
                      <p>Database Access</p>
                    </div>
                  </div>
                  <div className="" style={{ marginTop: '0.2rem' }}>
                    <div className="dashboard-payroll">
                      {Object.keys(tablePermissions).map((key) => (
                        <div className="Payroll-section" key={key}>
                          <label
                            className="inputLabel"
                            style={{ color: '#344054' }}
                          >
                            {key}
                          </label>
                          <div
                            className="dash-select-user"
                            onClick={() => setSelectTable(true)}
                          >
                            Edit
                          </div>
                        </div>
                      ))}

                      {(TYPE_OF_USER.DB_USER === selectedOption.value ||
                        TYPE_OF_USER.ADMIN === selectedOption.value) &&
                        dbAccess && (
                          <div
                            className="Line-container"
                            style={{ marginTop: '0.3rem' }}
                          >
                            <div
                              className="line-graph"
                              onClick={() => setSelectTable(true)}
                            >
                              <div className="edit-line">
                                <img
                                  src={ICONS.editIconUser}
                                  style={{ background: 'white' }}
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      {selectTable && (
                        <SelectTable
                          selected={selected}
                          setSelected={setSelected}
                          setSelectTable={setSelectTable}
                          setTablePermissions={setTablePermissions}
                          tablePermissions={tablePermissions}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="create-input-field-note">
                  <label htmlFor="" className="inputLabel">
                    Description
                  </label>{' '}
                  <br />
                  <textarea
                    name="description"
                    id=""
                    rows={3}
                    maxLength={255}
                    value={formData.description}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="Type"
                  ></textarea>
                  <p
                    className={`character-count ${
                      formData.description.length >= 255 ? 'exceeded' : ''
                    }`}
                  >
                    {formData.description.length}/255 characters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="um-createUserActionButton">
          <ActionButton
            title={'Cancel'}
            onClick={handleClose}
            type={'button'}
          />
          <ActionButton title={'Create'} onClick={() => {}} type={'submit'} />
        </div>
      </form>
    </div>
  );
};

export default UserOnboardingCreation;
