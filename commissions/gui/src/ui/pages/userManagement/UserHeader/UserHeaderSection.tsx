import React from "react";
import "../../userManagement/user.css";
import { ICONS } from "../../../icons/Icons";
import Select from "react-select";
import "../../configure/configure.css";
import { userSelectData } from "../../../../resources/static_data/StaticData";
interface props {
  name: string;
}
const UserHeaderSection: React.FC<props> = ({ name }) => {
  return (
    <div className="ManagerUser-container">
      <div className="admin-user">
        <p>{name}</p>
      </div>
      <div className="delete-icon-container">
        <div className=" rate-input-field">
          {/* <label className="inputLabel">Adder Type</label> */}
          <Select
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
  );
};

export default UserHeaderSection;
