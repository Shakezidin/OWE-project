import React, { useState } from "react";
import "../../userManagement/user.css";
import { ICONS } from "../../../icons/Icons";
import Select from "react-select";
import "../../configure/configure.css";
import { userSelectData } from "../../../../resources/static_data/StaticData";
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
import { dataUser, appointmentList, partnerList, RMManagerList, dealerList, saleReprestList, SaleManagerList } from "../../../../resources/static_data/StaticUserList";

// interface props {
//   name: string;
// }
const UserHeaderSection = () => {


  const [selectedOption, setSelectedOption] = useState<string>(
    userSelectData[0].label
  );

  const handleSelectChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedOption(selectedOption ? selectedOption.label : "");
  };

  const despatch = useAppDispatch();
  const currentPage = useAppSelector(
    (state) => state.paginationType.currentPage
  );
  const itemsPerPage = 10;

  const paginate = (pageNumber: number) => {
    despatch(setCurrentPage(pageNumber));
  };

  const goToNextPage = () => {
    despatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    despatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(dataUser?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = dataUser?.slice(startIndex, endIndex);

  const renderComponent = () => {
    switch (selectedOption) {
      case "Admin":
        return <UserTable data={dataUser} />;
      case "DB User":
        return <UserTable data={dataUser} />;
      case "Appointment Setter":
        return <AppointmentSetterTable data={appointmentList} />;
      case "Partner":
        return <PartnerTable data={partnerList} />;
      case "Regional Manager":
        return <RegionalManagerTable data={RMManagerList} />;
      case "Dealer Owner":
        return <DealerOwnerTable data={dealerList} />;
      case "Sales Representative Manager":
        return <SalesRepresentativeTable data={saleReprestList} />;
      case "Sales Manager":
        return <SalesManagerTable data={SaleManagerList} />;
      default:
        return null;
    }
  };

  console.log('userSelectData',userSelectData)
  return (
    <>
      <div className="ManagerUser-container">
        <div className="admin-user">
          <p>{selectedOption?.toUpperCase()}</p>
        </div>
        <div className="delete-icon-container">
          <div className="create-input-field">
            <Select
              options={userSelectData}
              value={userSelectData.find(
                (option) => option.label === selectedOption
              )}
              onChange={handleSelectChange}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  fontSize: "13px",
                  fontWeight: "500",
                  borderRadius: "8px",
                  outline: "none",
                  // height: "2.25rem",
                  width: "12rem",
                  border: "1px solid #d0d5dd",
                }),
                indicatorSeparator: () => ({
                  display: "none",
                }),
                option: (baseStyles) => ({
                  ...baseStyles,
                  fontSize: "13px",
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  minWidth: "12rem",
                  width: "12rem",
                }),
              }}
            />
          </div>

          <div className="iconsSection-delete">
            <button type="button">
              <img src={ICONS.deleteIcon} alt="" />
            </button>
            </div>

          <div className="iconsSection-filter">
            <button type="button">
              <img src={ICONS.FILTER} alt="" />
            </button>
          </div>
        </div>
      </div>
      {selectedOption && renderComponent()}

      <div className="user-page-heading-container">
        <p className="page-heading">
          {currentPage} - {totalPages} of {dataUser?.length} item
        </p>

        {dataUser?.length > 0 ? (
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

export default UserHeaderSection;
