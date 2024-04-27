/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import UserPieChart from "./pieChart/UserPieChart";
import UserOnboardingCreation from "./userOnboard/UserOnboardCreation";
import { AddNewButton } from "../../components/button/AddNewButton";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  fetchUserListBasedOnRole,
  fetchUserOnboarding,
} from "../../../redux/apiActions/userManagementActions";
import { userSelectData } from "../../../resources/static_data/StaticData";
import { UserDropdownModel, UserRoleBasedListModel } from "../../../core/models/api_models/UserManagementModel";
import UserManagementTable from "./userTableList/UserManagementTable";
import { createUserOnboarding, deleteUserOnboarding, fetchDealerOwner, fetchRegionList } from "../../../redux/apiActions/createUserSliceActions";
import { createUserObject, validateForm } from "../../../utiles/Validation";
import { updateUserForm, userResetForm } from "../../../redux/apiSlice/userManagementSlice/createUserSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { HTTP_STATUS } from "../../../core/models/api_models/RequestModel";

const UserManagement: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const userName = localStorage.getItem("userName");
  const [selectedOption, setSelectedOption] = useState(userSelectData[0]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { userOnboardingList, userRoleBasedList, } = useAppSelector(
    (state) => state.userManagement
  );
  const { formData, dealerOwenerList, regionList, createUserResult, deleteUserResult} = useAppSelector((state) => state.createOnboardUser);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    dispatch(userResetForm())
    setOpen(false)
  };
  /** fetch onboarding users data*/
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserOnboarding()); // Using dispatch
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

    dispatch(fetchUserListBasedOnRole(data));
  }, [selectedOption, createUserResult,deleteUserResult]);

  /** handle dropdown value */
  const handleSelectChange = (selectedOption: UserDropdownModel) => {
    setSelectedOption(selectedOption);
  };

  /** get sub role */
  const getSubRole = (): string=>{
    console.log(formData)
    let subrole = ''
    if (formData.role_name === 'Sales Manager'){
      subrole = 'Regional Manager'
    }else if (formData.role_name === 'Sale Representative'){
      subrole = 'Sales Manager'
    }

    return subrole;
  }

  /** check role  */
  const onChangeRole = async (role: string, value: string)=>{
    if(role === 'Role'){
     await dispatch(fetchDealerOwner({
        role:'Dealer Owner'
      }))
    }else{
     if(formData.role_name === 'Sales Manager' || formData.role_name === 'Sale Representative')
     await dispatch(fetchRegionList({
        role:'Dealer Owner',
        name: value,
        sub_role: getSubRole()
      }))
    }
  }

  /** submit button */
  const onSubmitCreateUser = (event: any) => {
    event.preventDefault(); 
    console.log(formData)

   const formErrors = validateForm(formData);
    console.log("formErrors",formErrors);
    if (Object.keys(formErrors).length === 0) {
      createUserRequest()
    }else{
      //const firstKey = Object.keys(formErrors)[0]; //Todo: change in future
      alert(Object.keys(formErrors)[0] + ' is required.')
    }
  
  };

  /** API call to submit */
  const createUserRequest = async ()=>{
    let data = createUserObject(formData)
    const actionResult =  await dispatch(createUserOnboarding(data))
    const result = unwrapResult(actionResult);

    if (result.status === HTTP_STATUS.OK){
      handleClose();
      alert(result.message)
    }else{
      alert(result.message)
    }
  }

   /** API call to submit */
   const deleteUserRequest = async (deleteRows: string[])=>{
    
   
    // if (deleteRows.length === 0){
    //   return
    // }
   
    const actionResult =  await dispatch(deleteUserOnboarding({user_codes:deleteRows}))
    const result = unwrapResult(actionResult);

    if (result.status === HTTP_STATUS.OK){
      handleClose();
      setSelectedRows(new Set());
      setSelectAllChecked(false)
      alert(result.message)
    }else{
      alert(result.message)
    }
  }

  /** render UI */
  return (
    <>
      <div className="management-section">
        <div className="manage-user">
          <p>Welcome, {userName}</p>
          <h2>User Management</h2>
        </div>

        <AddNewButton
          title={"Add New"}
          onClick={() => {
            handleOpen();
          }}
        />
      </div>
      {open && (
        <UserOnboardingCreation
          handleClose={handleClose}
          dealerList={dealerOwenerList}
          regionList={regionList}
          editMode={false}
          userOnboard={null}
          onSubmitCreateUser={(e)=> onSubmitCreateUser(e)}
          onChangeRole={(role, value)=>{
           onChangeRole(role, value)
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
          userDropdownData={userSelectData}
          selectedOption={selectedOption}
          handleSelectChange={handleSelectChange}
          onClickDelete={(item: UserRoleBasedListModel)=>{
            console.log(item.user_code)
            deleteUserRequest([item.user_code])
          }}
          onClickMultiDelete={()=>{
           const deleteRows = Array.from(selectedRows).map(index => userRoleBasedList[index].user_code);
          if(deleteRows.length > 0){
            deleteUserRequest(deleteRows)
          }else{
            alert('Please select user.')
          }
          }}
          onClickEdit={(item: UserRoleBasedListModel) => {
            // console.log("row data",item)
            const [firstName, lastName] = item.name.split(' ');

            dispatch(updateUserForm({ field: "isEdit", value: true }));
            dispatch(updateUserForm({ field: "first_name", value: firstName }));
            dispatch(updateUserForm({ field: "last_name", value: lastName }));
            dispatch(updateUserForm({ field: "email_id", value: item.email_id }));
            dispatch(updateUserForm({ field: "mobile_number", value: item.mobile_number }));
            dispatch(updateUserForm({ field: "assigned_dealer_name", value: item.dealer_owner }));
            dispatch(updateUserForm({ field: "role_name", value: item.role_name }));
            dispatch(updateUserForm({ field: "add_region", value: item.region }));
            dispatch(updateUserForm({ field: "team_name", value: item.team_name }));
            dispatch(updateUserForm({ field: "description", value: item.description }));
            dispatch(updateUserForm({ field: "report_to", value: item.reporting_manager }));
            setOpen(true);
          } } 
          />
      </div>
    </>
  );
};

export default UserManagement;
