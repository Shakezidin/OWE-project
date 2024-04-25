import React, { useEffect, useState } from "react";
import UserHeaderSection from "./UserHeader/UserHeaderSection";
import UserPieChart from "./pieChart/UserPieChart";
import UserOnboardingCreation from "./userOnboard/UserOnboardCreation";
import { AddNewButton } from "../../components/button/AddNewButton";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchUserOnboarding } from "../../../redux/apiSlice/userManagementSlice/userManagementSlice";

const UserManagement: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const userName = localStorage.getItem("userName");

  const dispatch = useAppDispatch();
  const { userOnboardingList } = useAppSelector(
    (state) => state.userManagement
  );

  /** fetch onboarding users data*/
  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchUserOnboarding()); // Using dispatch
    };

    fetchData();
  }, []);

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
          editMode={false}
          userOnboard={null}
        />
      )}
      <div className="barchart-section">
        <UserPieChart onboardingList={userOnboardingList} />
      </div>

      <div className="onboardrow">
        <UserHeaderSection />
      </div>
    </>
  );
};

export default UserManagement;
