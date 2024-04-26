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
import { UserDropdownModel } from "../../../core/models/api_models/UserManagementModel";
import UserManagementTable from "./userTableList/UserManagementTable";
import { cretaeUserOnboarding, fetchDealerOwner } from "../../../redux/apiActions/createUserSliceActions";

const UserManagement: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const userName = localStorage.getItem("userName");
  const [selectedOption, setSelectedOption] = useState(userSelectData[0]);

  const dispatch = useAppDispatch();
  const { userOnboardingList, userRoleBasedList } = useAppSelector(
    (state) => state.userManagement
  );
  const { dealerOwenerList } = useAppSelector((state) => state.createOnboardUser);

  /** fetch onboarding users data*/
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserOnboarding()); // Using dispatch
    };

    fetchData();
  }, []);

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
  }, [selectedOption]);

  /** handle dropdown value */
  const handleSelectChange = (selectedOption: UserDropdownModel) => {
    setSelectedOption(selectedOption);
  };

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
          editMode={false}
          userOnboard={null}
          onSubmitCreateUser={() => {
            //dispatch(cretaeUserOnboarding({})) dispatch(fetchDealerOwner({}))
          }}
          onChangeRole={(role)=>{

            dispatch(fetchDealerOwner({
              role:'Dealer Owner'
            }))
        
          }}
        />
      )}
      <div className="barchart-section">
        <UserPieChart onboardingList={userOnboardingList} />
      </div>

      <div className="onboardrow">
        <UserManagementTable
          userRoleBasedList={userRoleBasedList}
          userDropdownData={userSelectData}
          selectedOption={selectedOption}
          handleSelectChange={handleSelectChange}
        />
      </div>
    </>
  );
};

export default UserManagement;
