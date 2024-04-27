import React from "react";
import Input from "../../components/text_input/Input";
import { ICONS } from "../../icons/Icons";
import Select from "react-select";
import { ActionButton } from "../../components/button/ActionButton";
const MyProfile = () => {
  return (
    <>
      <div className="myProf-section">
        <div className="">
          <p>My Profile</p>
        </div>
        <div className="admin-section">
          <div className="">
            <img src={ICONS.userPic} alt="" />
          </div>

          <div className="caleb-container">
            <div className="caleb-section">
              <h3>Shushank </h3>
              <p>Admin</p>
            </div>
            {/* <div className='edit-section'>
                            <img src={ICONS.editIcon} alt="" />
                            <p>Edit</p>
                        </div> */}
          </div>
        </div>

        <div className="Personal-container">
          <div className="personal-section">
            <div className="">
              <p>Personal Information</p>
            </div>
            <div className="edit-section">
              <img src={ICONS.editIcon} alt="" />
              <p>Edit</p>
            </div>
          </div>

          <div  className="create-input-container"
            style={{ padding: "0.5rem", marginLeft: "1rem" }}   >
            <div className="create-input-field-profile">
              <Input
                type={"text"}
                label="First Name"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
            <div className="create-input-field-profile">
              <Input
                type={"text"}
                label="Last Name"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
          </div>
          <div
            className="create-input-container"
            style={{ padding: "0.5rem", marginLeft: "1rem" }}
          >
            <div className="create-input-field-profile">
              <Input
                type={"text"}
                label="Email"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
            <div className="create-input-field-profile">
              <Input
                type={"text"}
                label="Phone Number"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
          </div>
        </div>

        <div className="Personal-container">
          <div className="personal-section">
            <div className="">
              <p>Address Detail</p>
            </div>
            <div className="edit-section">
              <img src={ICONS.editIcon} alt="" />
              <p>Edit</p>
            </div>
          </div>
          <div
            className="create-input-container"
            style={{ padding: "0.5rem", marginLeft: "1rem" }}
          >
            <div className="create-input-field-address">
              <Input
                type={"text"}
                label="Street"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
            <div className="create-input-field-address">
              <label className="inputLabel">State</label>
              <Select
                // options={repTypeOption(newFormData) || respTypeData}
                isSearchable
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    // marginBottom: "4.5px",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "13px",
                    height: "2.25rem",
                    border: "1px solid #d0d5dd",
                 
                  }),

                  indicatorSeparator: () => ({
                    display: "none", // Hide the indicator separator
                  }),
                }}
              />
            </div>
            <div className="create-input-field-address">
              <label className="inputLabel">City</label>
              <Select
                // options={repTypeOption(newFormData) || respTypeData}
                isSearchable
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    // marginTop: "4.5px",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "13px",
                    height: "2.25rem",
                    border: "1px solid #d0d5dd",
                  }),

                  indicatorSeparator: () => ({
                    display: "none", // Hide the indicator separator
                  }),
                }}
              />
            </div>
          </div>
          <div
            className="create-input-container"
            style={{ padding: "0.5rem", marginLeft: "1rem" }}
          >
            <div className="create-input-field-address">
              <Input
                type={"text"}
                label="Zip Code"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
            <div className="create-input-field-address">
              <Input
                type={"text"}
                label="Country"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
          </div>
        </div>
        <div className="">
          <div className="profile-reset">
            <ActionButton title={"Reset"} type="reset" onClick={() => {}} />
            <ActionButton title={"Update"} type="submit" onClick={() => {}} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;