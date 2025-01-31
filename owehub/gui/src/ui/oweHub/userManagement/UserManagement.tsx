import React, { useCallback, useEffect, useMemo, useState } from 'react';
import UserPieChart from './pieChart/UserPieChart';
import UserOnboardingCreation from './userOnboard/UserOnboardCreation';
import ImportUser from './userOnboard/ImportUser';
import { AddNewButton } from '../../components/button/AddNewButton';
import { ImportButton } from '../../components/button/ImportButton';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  fetchUserListBasedOnRole,
  fetchUserOnboarding,
  fetchDealerList,
} from '../../../redux/apiActions/userManagement/userManagementActions';
import {
  UserDropdownModel,
  UserRoleBasedListModel,
} from '../../../core/models/api_models/UserManagementModel';
import UserManagementTable from './userTableList/UserManagementTable';
import {
  createUserOnboarding,
  createDealer,
  deleteUserOnboarding,
  fetchDealerOwner,
  fetchRegionList,
  deleteUserDealer,
} from '../../../redux/apiActions/auth/createUserSliceActions';
import { createUserObject, validateForm } from '../../../utiles/Validation';
import {updatevalidateForm} from '../../../utiles/updateValidation';
import {
  updateUserForm,
  userResetForm,
} from '../../../redux/apiSlice/userManagementSlice/createUserSlice';
import { HTTP_STATUS } from '../../../core/models/api_models/RequestModel';
import { toast } from 'react-toastify';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  TYPE_OF_USER,
  ALL_USER_ROLE_LIST as USERLIST,
} from '../../../resources/static_data/Constant';
import { showAlert } from '../../components/alert/ShowAlert';
import useAuth from '../../../hooks/useAuth';
import UserUpdate from './userOnboard/UpdateUser';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';


interface UserData {
  name?: string;
  email_id?: string;
  mobile_number?: string;
  role_name?: string;
  dealer?: string;
  description?: string;
}
const UserManagement: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openn, setOpenn] = useState<boolean>(false);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useAppDispatch();
  const [tablePermissions, setTablePermissions] = useState({});
  const [page, setPage] = useState(1);
  const [logoUrl, setLogoUrl] = useState('');

  const [selectedOption, setSelectedOption] = useState<any>(USERLIST[0]);

  console.log(selectedOption, 'selectedoption');

  const ALL_USER_ROLE_LIST = useMemo(() => {
    let role = USERLIST;
    const userRole = localStorage.getItem('role');
    if (userRole === TYPE_OF_USER.DEALER_OWNER) {
      role = role.filter(
        (role) =>
          role.value !== TYPE_OF_USER.ADMIN &&
          role.value !== TYPE_OF_USER.FINANCE_ADMIN &&
          role.value !== TYPE_OF_USER.DB_USER &&
          role.value !== TYPE_OF_USER.PARTNER
      );
      setSelectedOption(role[0]);
    }
    return role;
  }, []);
  const {
    loading,
    userOnboardingList,
    userRoleBasedList,
    userPerformanceList,
    totalCount
  } = useAppSelector((state) => state.userManagement);
  const {
    formData,
    dealerOwenerList,
    regionList,
    createUserResult,
    deleteUserResult,
  } = useAppSelector((state) => state.createOnboardUser);

  const [activeSalesRep, setActiveSalesRep] = useState('');

  const handleCrossClick = () => {
    setActiveSalesRep('');
  };

  const [isClicked, setIsClicked] = useState(false);
  const [isClicked1, setIsClicked1] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editData, setEditData] = useState<any>([]);
  const [updateTablePermission, setUpdateTablePermission] = useState<any>({})

  const handleOpen = () => setOpen(true);
  const handleImport = () => setOpenn(true);

  const handleEdit = async (id?: string) => {
    setIsEdit(true);

    const requestData = {
      page_number: 1,
      page_size: 25,
      filters: [
        {
          Column: 'email_id',
          Operation: '=',
          Data: id || null, // Use `id` or a fallback value
        },
      ],
    };

    setLoadingEdit(true);

    try {
      // API call using postCaller
      const response = await postCaller('get_users', requestData);

      if (response.status > 201) {
        toast.error(response.message);
        setLoadingEdit(false);
        setEditData([]);
        return;
      }

      // Process and store the fetched data
      setEditData(response.data.users_data_list);
      setUpdateTablePermission(response.data.users_data_list[0].table_permission)
      console.log(response.data.users_data_list, 'editData');
    } catch (error) {
      console.error('Error', error);
      toast.error('An error occurred while fetching user data');
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleClose = () => {
    dispatch(userResetForm());
    setOpen(false);
  };

  const handleCloseEdit = () => {
    dispatch(userResetForm());
    setIsEdit(false);
  };
  const handleClosee = () => {
    dispatch(userResetForm());
    setOpenn(false);
  };
  /** fetch onboarding users data*/
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserOnboarding());
    };

    fetchData();
  }, [createUserResult, deleteUserResult]);

  useEffect(() => {
    if (selectedOption) {
      setPage(1);
    }
  }, [selectedOption]);

  useEffect(() => {
    const data = {
      page_number: page,
      page_size: 25,
      sales_rep_status: activeSalesRep,
      filters: [
        {
          Column: 'name',
          Operation: 'cont',
          Data: searchTerm,
        },
      ],
    };

    const dataa = {
      page_number: page,
      page_size: 25,
      filters: [
        {
          Column: 'dealer_name',
          Operation: 'cont',
          Data: searchTerm,
        },
      ],
    };

    const fetchList = async () => {
      if (selectedOption.value !== '') {
        data.filters.push({
          Column: 'role_name',
          Operation: '=',
          Data: selectedOption.value,
        });
      }
      await dispatch(fetchUserListBasedOnRole(data));
    };

    if (selectedOption.value !== 'Partner') {
      fetchList();
    }

    const fetchDealer = async () => {
      await dispatch(fetchDealerList(dataa));
    };

    if (selectedOption.value === 'Partner') {
      fetchDealer();
    }
  }, [
    selectedOption,
    createUserResult,
    deleteUserResult,
    page,
    searchTerm,
    activeSalesRep,
  ]);

  
  /** handle dropdown value */
  const handleSelectChange = useCallback(
    (selectOption: UserDropdownModel) => {
      setSelectedOption(selectOption);
    },
    [selectedOption]
  );

  /** check role  */
  const onChangeRole = async (role: string, value: string) => {
    console.log('working on first change');
    if (role === 'Role') {
      setSelectedOption(
        ALL_USER_ROLE_LIST?.find((role) => role.value === value)!
      );
      await dispatch(
        fetchDealerOwner({
          role: TYPE_OF_USER.DEALER_OWNER,
        })
      );
    } else {
      if (
        formData.role_name === TYPE_OF_USER.SALE_MANAGER ||
        formData.role_name === TYPE_OF_USER.SALES_REPRESENTATIVE ||
        formData.role_name === TYPE_OF_USER.REGIONAL_MANGER ||
        formData.role_name === TYPE_OF_USER.APPOINTMENT_SETTER
      ) {
        if (value) {
          await dispatch(
            fetchRegionList({
              dealer_name: formData.dealer || '',
              role: value,
            })
          );
        }
      }
    }
  };
  const handleValueChange = (value: string) => {
    setActiveSalesRep(value);
  };

  /** submit button */
  const onSubmitCreateUser = (tablePermissions: any) => {
    const arrayOfPermissions = Object.entries(tablePermissions).map(
      ([tableName, permission]) => ({
        table_name: tableName,
        privilege_type: permission,
      })
    );
    const formErrors = validateForm(formData);
    console.log('formErrors', formErrors);
    if (Object.keys(formErrors).length === 0) {
      createUserRequest(arrayOfPermissions);
    } else {
      toast.info(Object.keys(formErrors)[0] + ' is required.');
    }
  };

  /** API call to submit */
  const createUserRequest = async (tablePermissions: any) => {
    console.log(formData, 'formData');
    if (formData.role_name !== 'Partner') {
      let data = createUserObject(formData);
      const actionResult = await dispatch(
        createUserOnboarding({
          ...data,
          tables_permissions: tablePermissions,
          description: formData.description.trim(),
          dealer_logo: logoUrl,
          podio_checked:
            formData.role_name === TYPE_OF_USER.SALE_MANAGER ||
            formData.role_name === TYPE_OF_USER.SALES_REPRESENTATIVE ||
            formData.role_name === TYPE_OF_USER.REGIONAL_MANGER ||
            formData.role_name === TYPE_OF_USER.DEALER_OWNER
              ? data.podio_checked
              : undefined,
        })
      );
      const result = unwrapResult(actionResult);

      if (result.status === HTTP_STATUS.OK) {
        handleClose();
        toast.success(result.message);
      } else {
        toast.warning(result.message);
      }
    } else {
      const dealerDate = {
        dealer_code: formData.dealer_code,
        dealer_name: formData.dealer,
        Description: formData.description,
        preferred_name: formData.preferred_name,
      };
      const actionResult = await dispatch(createDealer(dealerDate));
      const result = unwrapResult(actionResult);

      if (result.status === HTTP_STATUS.OK) {
        handleClose();
        toast.success(result.message);
      } else {
        toast.warning(result.message);
      }
    }
  };

  /** Update button */
  const onSubmitUpdateUser = (tablePermissions: any) => {
    const arrayOfPermissions = Object.entries(tablePermissions).map(
      ([tableName, permission]) => ({
        table_name: tableName,
        privilege_type: permission,
      })
    );
    const formErrors = updatevalidateForm(formData);
    console.log('formErrors', formErrors);
    if (Object.keys(formErrors).length === 0) {
      updateUserRequest(arrayOfPermissions);
    } else {
      toast.info(Object.keys(formErrors)[0] + ' is required.');
    }
  };

  /** API call to update */
  const updateUserRequest = async (tablePermissions: any) => {
    console.log(formData, 'formData');
    const fetchuserdata = {
      page_number: page,
      page_size: 25,
      sales_rep_status: activeSalesRep,
      filters: [
        {
          Column: 'role_name',
          Operation: 'cont',
          Data: formData?.role_name,
        },
      ],
    };

    console.log(formData, 'updateuser data')
    try {
      if (formData.role_name !== 'Partner') {
        const data = createUserObject(formData);

        const response = await postCaller('update_user', {
          ...data,
          tables_permissions: tablePermissions,
          revoke_table_permission: updateTablePermission || null ,
          description: formData.description.trim(),
          dealer_logo: logoUrl,
          podio_checked: null,
        
        });

        // Handle response
        if (response.status > 201) {
          toast.error(response.message);
         

          return;
        }

        toast.success(response.message);
        handleCloseEdit();
        await dispatch(fetchUserListBasedOnRole(fetchuserdata));

      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  /** API call to submit */
  const deleteUserRequest = async (
    deleteRows: string[],
    usernames: string[]
  ) => {
    const confirmed = await showAlert(
      'Delete User',
      'Are you sure you want to delete user?',
      'Yes',
      'No'
    );

    if (confirmed) {
      const actionResult = await dispatch(
        deleteUserOnboarding({ user_codes: deleteRows, usernames })
      );
      const result = unwrapResult(actionResult);

      if (result.status === HTTP_STATUS.OK) {
        handleClose();
        setSelectedRows(new Set());
        setSelectAllChecked(false);
        toast.success(result.message);
      } else {
        toast.warning(result.message);
      }
    }
  };

  /** API call to submit */
  const deleteDealerRequest = async (item: any) => {
    const confirmed = await showAlert(
      'Delete User',
      'Are you sure you want to delete user?',
      'Yes',
      'No'
    );
    const dataa = {
      page_number: page,
      page_size: 25,
    };

    if (confirmed) {
      const actionResult = await dispatch(
        deleteUserDealer({ record_id: [item.record_id], is_archived: true })
      );
      const result = unwrapResult(actionResult);

      if (result.status === HTTP_STATUS.OK) {
        handleClose();
        setSelectedRows(new Set());
        setSelectAllChecked(false);
        toast.success(result.message);
        dispatch(fetchDealerList(dataa));
        dispatch(fetchUserOnboarding());
      } else {
        toast.warning(result.message);
      }
    }
  };
  
  /** render UI */
  return (
    <>
      {open && (
        <UserOnboardingCreation
          handleClose={handleClose}
          dealerList={dealerOwenerList}
          regionList={regionList}
          editMode={false}
          selectedOption={selectedOption}
          tablePermissions={tablePermissions}
          setTablePermissions={setTablePermissions}
          userOnboard={null}
          onSubmitCreateUser={onSubmitCreateUser}
          onChangeRole={(role, value) => {
            console.log('formData', formData);
            onChangeRole(role, value);
          }}
          setLogoUrl={setLogoUrl}
        />
      )}

      {isEdit && (
        <UserUpdate
          handleClose={handleCloseEdit}
          dealerList={dealerOwenerList}
          regionList={regionList}
          editMode={false}
          selectedOption={selectedOption}
          tablePermissions={tablePermissions}
          setTablePermissions={setTablePermissions}
          userOnboard={null}
          onSubmitUpdateUser={onSubmitUpdateUser}
          onChangeRole={(role, value) => {
            console.log('formData', formData);
            onChangeRole(role, value);
          }}
          setLogoUrl={setLogoUrl}
          editData={editData}
        />
      )}
      {openn && (
        <ImportUser
          handleClose={handleClosee}
          tablePermissions={tablePermissions}
          onSubmitCreateUser={onSubmitCreateUser}
        />
      )}
      <div className="barchart-section">
        <UserPieChart
          onboardingList={userOnboardingList}
          userPerformanceList={userPerformanceList}
          loading={loading}
          setSelectedOption={setSelectedOption}
          onValueChange={handleValueChange}
          activeSalesRep={activeSalesRep}
        />
      </div>
      <div className="onboardrow">
        <UserManagementTable
          AddBtn={
            <AddNewButton
              title={'Add New'}
              onClick={() => {
                handleOpen();
              }}
            />
          }
          ImportBtn={
            <ImportButton
              title={'Import'}
              onClick={() => {
                handleImport();
              }}
            />
          }
          activeSalesRep={activeSalesRep}
          handleEdit={handleEdit}
          editData={editData}
          handleCrossClick={handleCrossClick}
          currentPage1={page}
          setCurrentPage1={setPage}
          selectedRows={selectedRows}
          selectAllChecked={selectAllChecked}
          setSelectedRows={setSelectedRows}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          setSelectAllChecked={setSelectAllChecked}
          userRoleBasedList={userRoleBasedList}
          totalCount={totalCount}
          userDropdownData={ALL_USER_ROLE_LIST}
          selectedOption={selectedOption}
          handleSelectChange={handleSelectChange}
          onClickDelete={(item: any) => {
            selectedOption.value === 'Partner'
              ? deleteDealerRequest(item)
              : deleteUserRequest(
                  [item.user_code],
                  item.role_name === 'DB User'
                    ? [item.db_username]
                    : [item.name.split(' ').join('_')]
                );
          }}
          onClickMultiDelete={() => {
            const deleteRows = Array.from(selectedRows).map(
              (index) => userRoleBasedList[index].user_code
            );
            const usernames = Array.from(selectedRows).map((index) => {
              const user = userRoleBasedList[index];
              return user.role_name === TYPE_OF_USER.DB_USER
                ? user.db_username
                : user.name.split(' ').join('_');
            });
            if (deleteRows.length > 0) {
              deleteUserRequest(deleteRows, usernames);
              console.log(
                deleteRows,
                usernames,
                userRoleBasedList,
                'deleteRows, usernames,userRoleBasedList'
              );
            } else {
              toast.info('Please select user');
            }
          }}
          onClickEdit={(item: UserRoleBasedListModel) => {
            const [firstName, lastName] = item.name.split(' ');
            dispatch(updateUserForm({ field: 'isEdit', value: true }));
            dispatch(updateUserForm({ field: 'first_name', value: firstName }));
            dispatch(updateUserForm({ field: 'last_name', value: lastName }));
            dispatch(
              updateUserForm({ field: 'email_id', value: item.email_id })
            );
            dispatch(
              updateUserForm({
                field: 'mobile_number',
                value: item.mobile_number,
              })
            );
            dispatch(
              updateUserForm({
                field: 'assigned_dealer_name',
                value: item.dealer_owner,
              })
            );
            dispatch(
              updateUserForm({ field: 'role_name', value: item.role_name })
            );
            dispatch(
              updateUserForm({ field: 'add_region', value: item.region })
            );
            dispatch(
              updateUserForm({ field: 'team_name', value: item.team_name })
            );
            dispatch(
              updateUserForm({ field: 'description', value: item.description })
            );
            dispatch(
              updateUserForm({
                field: 'report_to',
                value: item.reporting_manager,
              })
            );
            setOpen(true);
          }}
        />
      </div>
    </>
  );
};

export default UserManagement;
