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
import "./UserHeader.css"
// interface props {
//   name: string;
// }
const UserHeaderSection: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>(
    userSelectData[0].label
  );

  const handleSelectChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedOption(selectedOption ? selectedOption.value : "");
  };

  const renderComponent = () => {
    switch (selectedOption) {
      case "Admin User":
        return <UserTable />;
      case "Appointment Setter":
        return <AppointmentSetterTable />;
      case "Partner":
        return <PartnerTable />;
      case "Regional Manager":
        return <RegionalManagerTable />;
      case "Dealer Owner":
        return <DealerOwnerTable />;
      case "Sales Representative":
        return <SalesRepresentativeTable />;
      case "Sales Manager":
        return <SalesManagerTable />;
      default:
        return null;
    }
  };
  return (
    <>
      <div className="ManagerUser-container">
        <div className="admin-user">
          <p>{selectedOption}</p>
        </div>
        <div className="delete-icon-container">
          <div className="create-input-field">
            <Select
              options={userSelectData}
              value={userSelectData.find(
                (option) => option.value === selectedOption
              )}
              onChange={handleSelectChange}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  fontSize: "13px",
                  fontWeight: "500",
                  borderRadius: "8px",
                  outline: "none",
                  height: "2.25rem",
                  width: "12rem",
                
                  border: "1px solid #d0d5dd",
                }),
                indicatorSeparator: () => ({
                  display: 'none' // Hide the indicator separator
                }),
              }}
            />
          </div>

          <div className="iconsSection-delete">
            <button type="button">
              <img src={ICONS.deleteIcon} alt="" />
              <h4>Delete</h4>
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
    </>
  );
};

export default UserHeaderSection;


