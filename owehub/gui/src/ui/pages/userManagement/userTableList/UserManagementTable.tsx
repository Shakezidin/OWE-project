import React, { useEffect, useState } from "react";
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
import { TYPE_OF_USER } from "../../../../resources/static_data/TypeOfUser";
import PaginationComponent from "../../../components/pagination/PaginationComponent";
import { fetchUserListBasedOnRole } from "../../../../redux/apiActions/userManagementActions";

interface UserTableProos {
  userDropdownData: UserDropdownModel[];
  userRoleBasedList: UserRoleBasedListModel[];
  selectedOption: UserDropdownModel;
  handleSelectChange: (data: UserDropdownModel) => void;
  onClickEdit: (item: UserRoleBasedListModel) => void;
  onClickDelete: (item: UserRoleBasedListModel) => void;
  selectAllChecked: boolean;
  selectedRows: Set<number>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  setSelectAllChecked: React.Dispatch<React.SetStateAction<boolean>>;
  onClickMultiDelete: () => void;
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
  setSelectAllChecked,
  onClickMultiDelete,
}) => {
  const dispatch = useAppDispatch();
  const [pageSize1, setPageSize1] = useState(10); // Set your desired page size here
  const [currentPage1, setCurrentPage1] = useState(1);
  const count = useAppSelector((state) => state.userManagement.totalCount);
  useEffect(() => {
    const data = {
      page_number: currentPage1,
      page_size: pageSize1,
      filters: [
        {
          Column: "role_name",
          Operation: "=",
          Data: selectedOption.value,
        },
      ],
    };
    dispatch(fetchUserListBasedOnRole(data));
  }, [dispatch, currentPage1, pageSize1]);

  const handlePageChange = (page: number) => {
    setCurrentPage1(page);
  };
  const handleItemsPerPageChange = (e: any) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setPageSize1(newItemsPerPage);
    setCurrentPage1(1); // Reset to the first page when changing items per page
  };

  const currentPage = useAppSelector(
    (state) => state.paginationType.currentPage
  );

  const totalPages = Math.ceil(count! / pageSize1);

  const startIndex = (currentPage1 - 1) * pageSize1 + 1;

  /** render table based on dropdown */
  const renderComponent = () => {
    switch (selectedOption.label) {
      case TYPE_OF_USER.ADMIN:
        return (
          <UserTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={(item: UserRoleBasedListModel) => {
              onClickDelete(item);
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case TYPE_OF_USER.FINANCE_ADMIN:
        return (
          <UserTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={(item: UserRoleBasedListModel) => {
              onClickDelete(item);
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case TYPE_OF_USER.SUB_DEALER_OWNER:
        return (
          <UserTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={(item: UserRoleBasedListModel) => {
              onClickDelete(item);
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case TYPE_OF_USER.APPOINTMENT_SETTER:
        return (
          <AppointmentSetterTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={(item: UserRoleBasedListModel) => {
              onClickDelete(item);
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case TYPE_OF_USER.PARTNER:
        return (
          <PartnerTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={(item: UserRoleBasedListModel) => {
              onClickDelete(item);
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case TYPE_OF_USER.REGIONAL_MANGER:
        return (
          <RegionalManagerTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={(item: UserRoleBasedListModel) => {
              onClickDelete(item);
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case TYPE_OF_USER.DEALER_OWNER:
        return (
          <DealerOwnerTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={(item: UserRoleBasedListModel) => {
              onClickDelete(item);
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case TYPE_OF_USER.SALES_REPRESENTATIVE:
        return (
          <SalesRepresentativeTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={(item: UserRoleBasedListModel) => {
              onClickDelete(item);
            }}
            selectedRows={selectedRows}
            selectAllChecked={selectAllChecked}
            setSelectedRows={setSelectedRows}
            setSelectAllChecked={setSelectAllChecked}
          />
        );
      case TYPE_OF_USER.SALE_MANAGER:
        return (
          <SalesManagerTable
            data={userRoleBasedList}
            onClickEdit={(item: UserRoleBasedListModel) => {
              onClickEdit(item);
            }}
            onClickDelete={(item: UserRoleBasedListModel) => {
              onClickDelete(item);
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
          <h3>{selectedOption.label?.toUpperCase()}</h3>
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

          <div
            className="iconsSection-delete"
            style={{ marginTop: "1.2rem" }}
            onClick={() => {
              onClickMultiDelete();
            }}
          >
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
              {startIndex} - {count} of {userRoleBasedList?.length} item
            </p>
            <PaginationComponent
              currentPage={currentPage1}
              itemsPerPage={pageSize1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              handleItemsPerPageChange={handleItemsPerPageChange}
            />
          </>
        ) : null}
      </div>
    </>
  );
};

export default UserManagementTable;
