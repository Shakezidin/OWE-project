/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import UserPieChart from "./pieChart/UserPieChart";
import UserOnboardingCreation from "./userOnboard/UserOnboardCreation";
import { AddNewButton } from "../../components/button/AddNewButton";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  fetchUserListBasedOnRole,
  fetchUserOnboarding,
} from "../../../redux/apiActions/userManagement/userManagementActions";
import {
  UserDropdownModel,
  UserRoleBasedListModel,
} from "../../../core/models/api_models/UserManagementModel";
import UserManagementTable from "./userTableList/UserManagementTable";
import {
  createUserOnboarding,
  deleteUserOnboarding,
  fetchDealerOwner,
  fetchRegionList,
} from "../../../redux/apiActions/createUserSliceActions";
import { createUserObject, validateForm } from "../../../utiles/Validation";
import {
  updateUserForm,
  userResetForm,
} from "../../../redux/apiSlice/userManagementSlice/createUserSlice";
import { HTTP_STATUS } from "../../../core/models/api_models/RequestModel";
import Loading from "../../components/loader/Loading";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  TYPE_OF_USER,
  ALL_USER_ROLE_LIST,
} from "../../../resources/static_data/Constant";
import { showAlert } from "../../components/alert/ShowAlert";

const UserManagement: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const userName = localStorage.getItem("userName");
  const [selectedOption, setSelectedOption] = useState(ALL_USER_ROLE_LIST[0]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { loading, userOnboardingList, userRoleBasedList } =
    useAppSelector((state) => state.userManagement);
  const {
    formData,
    dealerOwenerList,
    regionList,
    createUserResult,
    deleteUserResult,
  } = useAppSelector((state) => state.createOnboardUser);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    dispatch(userResetForm());
    setOpen(false);
  };
  /** fetch onboarding users data*/
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserOnboarding()); // Using dispatch
      // await dispatch(createTablePermission());
    };

    fetchData();
  }, [createUserResult, deleteUserResult]);

  /** role based get data */
  useEffect(() => {
    const data = {
      page_number: 1,
      page_size: 10,
      filters: [
        {
          Column: "role_name",
          Operation: "=",
          Data: selectedOption.value,
        },
      ],
    };
    const fetchList = async ()=>{
      await dispatch(fetchUserListBasedOnRole(data));
    }
    fetchList();

  }, [selectedOption, createUserResult, deleteUserResult]);

  /** handle dropdown value */
  const handleSelectChange = useCallback((selectOption: UserDropdownModel) => {
    setSelectedOption(selectOption);
  },[selectedOption]);

  // Memoize the subRole value
  const getSubRole = useMemo((): string => {
    let subrole: string = "";
    if (formData.role_name === TYPE_OF_USER.SALE_MANAGER) {
      subrole = TYPE_OF_USER.REGIONAL_MANGER;
    } else if (formData.role_name === TYPE_OF_USER.SALES_REPRESENTATIVE) {
      subrole = TYPE_OF_USER.SALE_MANAGER;
    }
    return subrole;
  }, [formData.role_name]);

  /** check role  */
  const onChangeRole = useCallback(async (role: string, value: string) => {
    if (role === "Role") {
      setSelectedOption(ALL_USER_ROLE_LIST?.find((role)=>role.value === value)!)
      await dispatch(
        fetchDealerOwner({
          role: TYPE_OF_USER.DEALER_OWNER,
        })
      );
    } else {
      if (
        formData.role_name === TYPE_OF_USER.SALE_MANAGER ||
        formData.role_name === TYPE_OF_USER.SALES_REPRESENTATIVE
      )
        await dispatch(
          fetchRegionList({
            role: TYPE_OF_USER.DEALER_OWNER,
            name: value,
            sub_role: getSubRole,
          })
        );
    }
  },[formData.role_name]);

  /** submit button */
  const onSubmitCreateUser = (tablePermissions: any) => {
    const arrayOfPermissions = Object.entries(tablePermissions).map(
      ([tableName, permission]) => ({
        table_name: tableName,
        privilege_type: permission,
      })
    );
    const formErrors = validateForm(formData);
    console.log("formErrors", formErrors);
    if (Object.keys(formErrors).length === 0) {
      createUserRequest(arrayOfPermissions)
    } else {
      toast.info(Object.keys(formErrors)[0] + " is required.");
    }
  };

  /** API call to submit */
  const createUserRequest = async (tablePermissions: any) => {
    let data = createUserObject(formData);
    const actionResult = await dispatch(
      createUserOnboarding({ ...data, tables_permissions: tablePermissions })
    );
    const result = unwrapResult(actionResult);

    if (result.status === HTTP_STATUS.OK) {
      handleClose();
      toast.success(result.message);
    } else {
      toast.warning(result.message);
    }
  };

  /** API call to submit */
  const deleteUserRequest = async (
    deleteRows: string[],
    usernames: string[]
  ) => {
    const confirmed = await showAlert(
      "Delete User",
      "Are you sure you want to delete user?",
      "Yes",
      "No"
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

  /** render UI */
  return (
    <>
      <div className="management-section">
        <div className="manage-user">
          <p>Welcome, {userName}</p>
          <h3>User Management</h3>
        </div>

        <AddNewButton
          title={"Add New"}
          onClick={() => {
            handleOpen();
          }}
        />
      </div>
      {loading && (
        <div>
          <Loading /> {loading}
        </div>
      )}
      {open && (
        <UserOnboardingCreation
          handleClose={handleClose}
          dealerList={dealerOwenerList}
          regionList={regionList}
          editMode={false}
          selectedOption={selectedOption}
          userOnboard={null}
          onSubmitCreateUser={onSubmitCreateUser}
          onChangeRole={(role, value) => {
            onChangeRole(role, value);
          }}
        />
      )}
      <div className="barchart-section">
        <UserPieChart onboardingList={userOnboardingList} />
      </div>

      <div className="onboardrow">
        <UserManagementTable
          selectedRows={selectedRows}
          selectAllChecked={selectAllChecked}
          setSelectedRows={setSelectedRows}
          setSelectAllChecked={setSelectAllChecked}
          userRoleBasedList={userRoleBasedList}
          userDropdownData={ALL_USER_ROLE_LIST}
          selectedOption={selectedOption}
          handleSelectChange={handleSelectChange}
          onClickDelete={(item: UserRoleBasedListModel) => {
            deleteUserRequest(
              [item.user_code],
              [item.name.split(" ").join("_")]
            );
          }}
          onClickMultiDelete={() => {
            const deleteRows = Array.from(selectedRows).map(
              (index) => userRoleBasedList[index].user_code
            );
            const usernames = Array.from(selectedRows).map((index) =>
              userRoleBasedList[index].name.split(" ").join("_")
            );
            if (deleteRows.length > 0) {
              deleteUserRequest(deleteRows, usernames);
            } else {
              toast.info("Please select user");
            }
          }}
          onClickEdit={(item: UserRoleBasedListModel) => {
            // console.log("row data",item)
            const [firstName, lastName] = item.name.split(" ");

            dispatch(updateUserForm({ field: "isEdit", value: true }));
            dispatch(updateUserForm({ field: "first_name", value: firstName }));
            dispatch(updateUserForm({ field: "last_name", value: lastName }));
            dispatch(
              updateUserForm({ field: "email_id", value: item.email_id })
            );
            dispatch(
              updateUserForm({
                field: "mobile_number",
                value: item.mobile_number,
              })
            );
            dispatch(
              updateUserForm({
                field: "assigned_dealer_name",
                value: item.dealer_owner,
              })
            );
            dispatch(
              updateUserForm({ field: "role_name", value: item.role_name })
            );
            dispatch(
              updateUserForm({ field: "add_region", value: item.region })
            );
            dispatch(
              updateUserForm({ field: "team_name", value: item.team_name })
            );
            dispatch(
              updateUserForm({ field: "description", value: item.description })
            );
            dispatch(
              updateUserForm({
                field: "report_to",
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
