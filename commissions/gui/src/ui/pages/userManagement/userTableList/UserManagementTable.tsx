import React from "react";
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
import {
  UserDropdownModel,
  UserRoleBasedListModel,
} from "../../../../core/models/api_models/UserManagementModel";

interface UserTableProos {
  userDropdownData: UserDropdownModel[];
  userRoleBasedList: UserRoleBasedListModel[];
  selectedOption: UserDropdownModel;
  handleSelectChange: (data: UserDropdownModel) => void;
  onClickEdit: (item: UserRoleBasedListModel) => void;
  onClickDelete: () => void;
  selectAllChecked: boolean,
  selectedRows: Set<number>,
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>,
  setSelectAllChecked: React.Dispatch<React.SetStateAction<boolean>>,
}
const UserManagementTable: React.FC<UserTableProos> = ({
  userDropdownData,
  userRoleBasedList,
  selectedOption,
  handleSelectChange,
  onClickEdit,
  onClickDelete,
  selectAllChecked,
  selectedRows,
  setSelectedRows,
  setSelectAllChecked
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
    switch (selectedOption.label) {
      case "Admin":
        return (
          <UserTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={() => {
              onClickDelete()
            }}
            selectedRows={selectedRows}
          selectAllChecked={selectAllChecked}
          setSelectedRows={setSelectedRows}
          setSelectAllChecked={setSelectAllChecked}
          />
        );
      case "DB User":
        return (
          <UserTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={() => {
              onClickDelete()
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case "Appointment Setter":
        return (
          <AppointmentSetterTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={() => {
              onClickDelete()
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case "Partner":
        return (
          <PartnerTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={() => {
              onClickDelete()
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case "Regional Manager":
        return (
          <RegionalManagerTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={() => {
              onClickDelete()
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case "Dealer Owner":
        return (
          <DealerOwnerTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={() => {
              onClickDelete()
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case "Sales Representative":
        return (
          <SalesRepresentativeTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={() => {
              onClickDelete()
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
            
          />
        );
      case "Sales Manager":
        return (
          <SalesManagerTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={() => {
              onClickDelete()
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      default:
        return null;
    }
  };

  /** render UI */
  return (
    <>
      <div className="ManagerUser-container">
        <div className="admin-user">
          <p>{selectedOption.label?.toUpperCase()}</p>
        </div>
        <div className="delete-icon-container">
          <div className="create-input-field">
            <SelectOption
              options={userDropdownData}
              value={selectedOption}
              onChange={(data: any) => {
                handleSelectChange(data);
              }}
            />
          </div>

          <div className="iconsSection-delete" style={{ marginTop: ".2rem" }} onClick={()=>{
            onClickDelete()
          }}>
            
            <button type="button">
              <img src={ICONS.deleteIcon} alt="" />
            </button>
          </div>
        </div>
      </div>
      {selectedOption && renderComponent()}

      <div className="user-page-heading-container">
        {userRoleBasedList?.length > 0 ? (
          <>
            <p className="page-heading">
              {currentPage} - {totalPages} of {userRoleBasedList?.length} item
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              goToNextPage={goToNextPage}
              currentPageData={currentPageData}
              goToPrevPage={goToPrevPage}
            />
          </>
        ) : null}
      </div>
    </>
  );
};

export default UserManagementTable;