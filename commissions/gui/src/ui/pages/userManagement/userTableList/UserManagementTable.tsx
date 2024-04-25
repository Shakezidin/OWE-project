import React, { } from "react";
import "../../userManagement/user.css";
import { ICONS } from "../../../icons/Icons";
import "../../configure/configure.css";
import UserTable from "../userManagerAllTable/UserTable";
import AppointmentSetterTable from "../userManagerAllTable/AppointmentSetterTable";
import PartnerTable from "../userManagerAllTable/PartnerTable";
import SalesManagerTable from "../userManagerAllTable/SalesManagerTable";
import SalesRepresentativeTable from "../userManagerAllTable/SalesRepresentativeTable";
import DealerOwnerTable from "../userManagerAllTable/DealerOwnerTable";
import RegionalManagerTable from "../userManagerAllTable/RegionalManagerTable";
import "./UserHeader.css";
import Pagination from "../../../components/pagination/Pagination";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import SelectOption from "../../../components/selectOption/SelectOption";
import { UserDropdownModel, UserRoleBasedListModel } from "../../../../core/models/api_models/UserManagementModel";

interface UserTableProos {
  userDropdownData: UserDropdownModel[];
  userRoleBasedList: UserRoleBasedListModel[];
  selectedOption: string;
  handleSelectChange: (data:UserDropdownModel) => void;

 // onChange: (text: string) => void;
}
const UserManagementTable: React.FC<UserTableProos> = ({
  userDropdownData,
  userRoleBasedList,
  selectedOption,
  handleSelectChange,
}) => {
  const dispatch = useAppDispatch();

  const currentPage = useAppSelector(
    (state) => state.paginationType.currentPage
  );

  /** pagination */
  const itemsPerPage = 10;

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(userRoleBasedList?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = userRoleBasedList?.slice(startIndex, endIndex);

  /** render table based on dropdown */
  const renderComponent = () => {
    switch (selectedOption) {
      case "Admin":
        return <UserTable data={userRoleBasedList} />;
      case "DB User":
        return <UserTable data={userRoleBasedList} />;
      case "Appointment Setter":
        return <AppointmentSetterTable data={userRoleBasedList} />;
      case "Partner":
        return <PartnerTable data={userRoleBasedList} />;
      case "Regional Manager":
        return <RegionalManagerTable data={userRoleBasedList} />;
      case "Dealer Owner":
        return <DealerOwnerTable data={userRoleBasedList} />;
      case "Sales Representative Manager":
        return <SalesRepresentativeTable data={userRoleBasedList} />;
      case "Sales Manager":
        return <SalesManagerTable data={userRoleBasedList} />;
      default:
        return null;
    }
  };

  /** render UI */
  return (
    <>
      <div className="ManagerUser-container">
        <div className="admin-user">
          <p>{selectedOption?.toUpperCase()}</p>
        </div>
        <div className="delete-icon-container">
          <div className="create-input-field">
            <SelectOption
              options={userDropdownData}
              value={userDropdownData.find(
                (option) => option.label === selectedOption
              )}
              onChange={(data:any )=>{
                handleSelectChange(data)
              }}
            />
          </div>

          <div className="iconsSection-delete" style={{ marginTop: ".2rem" }}>
            <button type="button">
              <img src={ICONS.deleteIcon} alt="" />
            </button>
          </div>

          <div className="iconsSection-filter" style={{ marginTop: ".2rem" }}>
            <button type="button">
              <img src={ICONS.FILTER} alt="" />
            </button>
          </div>
        </div>
      </div>
      {selectedOption && renderComponent()}

      <div className="user-page-heading-container">
        <p className="page-heading">
          {currentPage} - {totalPages} of {userRoleBasedList?.length} item
        </p>

        {userRoleBasedList?.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages} // You need to calculate total pages
            paginate={paginate}
            goToNextPage={goToNextPage}
            currentPageData={currentPageData}
            goToPrevPage={goToPrevPage}
          />
        ) : null}
      </div>
    </>
  );
};

export default UserManagementTable;
