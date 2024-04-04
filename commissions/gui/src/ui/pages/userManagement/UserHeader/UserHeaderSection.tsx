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
// interface props {
//   name: string;
// }
const UserHeaderSection: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleSelectChange = (selectedOption: { value: string; label: string } | null) => {
    setSelectedOption(selectedOption ? selectedOption.value : '');
  };

  // Render the component based on the selected option
  const renderComponent = () => {
    switch (selectedOption) {
      case 'Admin User':
        return <UserTable />;
      case 'Appointment Setter':
        return <AppointmentSetterTable />;
      case 'Partner':
        return <PartnerTable />;
      case 'Regional Manager':
        return <PartnerTable />;
      case 'Dealer Owner':
        return <DealerOwnerTable />;
      case 'Sales Representative':
        return <SalesRepresentativeTable />;
      case 'Sales Manager':
        return <SalesManagerTable />;
      default:
        return null;
    }
  };
  return (
    <div className="ManagerUser-container" style={{backgroundColor:"green"}}>
      <div className="admin-user">
        <p>Admin User</p>
      </div>
      <div className="delete-icon-container">
        <div className=" rate-input-field" >
          <Select
            options={userSelectData}
            value={userSelectData.find(option => option.value === selectedOption)}
            onChange={handleSelectChange}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                marginTop: "4.5px",
                borderRadius: "8px",
                outline: "none",
                height: "1.8rem",
                width: "200px",
                border: "1px solid #d0d5dd",
              }),
            }}
          />
          {selectedOption && renderComponent()}

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
  );
};

export default UserHeaderSection;



          {/* <label className="inputLabel">Adder Type</label> */}
          {/* <Select
            options={userSelectData}
            isSearchable
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                marginTop: "4.5px",
                borderRadius: "8px",
                outline: "none",
                height: "1.8rem",
                width: "200px",
                border: "1px solid #d0d5dd",
              }),
            }}
            // onChange={(newValue) => handleChange(newValue, 'adder_type')}
            value={userSelectData?.find(
              (option) => option.value === "admin_user"
            )}
          /> */}