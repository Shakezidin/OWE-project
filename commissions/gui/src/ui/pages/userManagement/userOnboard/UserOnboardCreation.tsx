import React, { useState } from "react";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { useDispatch } from "react-redux";
import { updateUserForm } from "../../../../redux/apiSlice/userManagementSlice/createUserSlice";
import {
  dealer,
  userSelectData,
} from "../../../../resources/static_data/StaticData";
import CheckBox from "../../../components/chekbox/CheckBox";
import { ICONS } from "../../../icons/Icons";
import SelectTable from "./SeletTable";
import UserBasedInput from "./UserBasedInput";
import SelectOption from "../../../components/selectOption/SelectOption";
import { CreateUserModel } from "../../../../core/models/api_models/UserManagementModel";
import { useAppSelector } from "../../../../redux/hooks";
import { stat } from "fs";

interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
  userOnboard: CreateUserModel | null;
}

const UserOnboardingCreation: React.FC<ButtonProps> = ({
  handleClose,
  userOnboard,
  editMode,
}) => {
  const dispatch = useDispatch();
  const [createUserOnboarding, setCreateOnboarding] = useState<CreateUserModel>(
    {
      first_name: "",
      last_name: "",
      email_id: "",
      mobile_number: "",
      password: "",
      designation: "",
      description: "",
      assigned_dealer_name: "",
      role_name: "",
      add_region: "",
      team_name: "",
      report_to: "",
      reporting_to: "",
    }
  );

  const formData = useAppSelector((state) => state.createOnboardUser);

  console.log("formdata...", formData);
  const [selectTable, setSelectTable] = useState<boolean>(false);

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateOnboarding((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : "",
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateOnboarding((prevData) => ({
      ...prevData,
      [name]:
        name === "Email_ID" || name === "Phone_Number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updateUserForm(createUserOnboarding));
  };

  /** render ui */
  return (
    <div className="transparent-model">
      <form onSubmit={(e) => handleUserSubmit(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>
        <h3 className="createProfileText">Onboarding</h3>
        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="First Name"
                    value={createUserOnboarding.first_name}
                    placeholder={"Enter Name"}
                    onChange={(e) => handleInputChange(e)}
                    name={"first_name"}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Last Name"
                    value={createUserOnboarding.last_name}
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                    name={"last_name"}
                  />
                </div>
                <div className="create-input-field">
                  <label className="inputLabel">Role</label>
                  <SelectOption
                    options={userSelectData}
                    onChange={(newValue) => handleChange(newValue, "role_name")}
                    value={userSelectData?.find(
                      (option) =>
                        option?.value === createUserOnboarding.role_name
                    )}
                  />
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Email ID"
                    value={createUserOnboarding.email_id}
                    placeholder={"email@mymail.com"}
                    onChange={(e) => handleInputChange(e)}
                    name={"email_id"}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Phone Number"
                    value={createUserOnboarding.mobile_number}
                    placeholder={"Phone Number"}
                    onChange={(e) => handleInputChange(e)}
                    name={"mobile_number"}
                  />
                </div>
                {createUserOnboarding.role_name === "admin" ||
                createUserOnboarding.role_name === "SubDealer Owner" ||
                createUserOnboarding.role_name === "Dealer Owner" ? null : (
                  <div className="create-input-field">
                    <label className="inputLabel">Dealer Owner</label>
                    <SelectOption
                      options={dealer}
                      onChange={(newValue) =>
                        handleChange(newValue, "assigned_dealer_name")
                      }
                      value={dealer?.find(
                        (option) =>
                          option?.value ===
                          createUserOnboarding.assigned_dealer_name
                      )}
                    />
                  </div>
                )}
              </div>
              <UserBasedInput
                createUserOnboarding={createUserOnboarding}
                onChange={(e: any) => handleInputChange(e)}
              />
              <div className="">
                <div className="" style={{ display: "flex", gap: "0.5rem" }}>
                  <CheckBox
                    checked={true}
                    onChange={() => {}}

                    // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                  />
                  <div className="access-data">
                    <p>Database Access</p>
                  </div>
                </div>
                <div className="" style={{ marginTop: "0.2rem" }}>
                  <div className="dashboard-payroll">
                    <div className="Payroll-section">
                      <label
                        className="inputLabel"
                        style={{ color: "#344054" }}
                      >
                        Table 1
                      </label>
                      <div className="dash-select-user">Edit</div>
                    </div>
                    <div className="Payroll-section">
                      <label
                        className="inputLabel"
                        style={{ color: "#344054" }}
                      >
                        Table 2
                      </label>
                      <div className="dash-select-user">Full</div>
                    </div>
                    <div className="Payroll-section">
                      <label
                        className="inputLabel"
                        style={{ color: "#344054" }}
                      >
                        Table 3
                      </label>
                      <div className="dash-select-user">View</div>
                    </div>
                    <div
                      className="Line-container"
                      style={{ marginTop: "0.3rem", cursor: "pointer" }}
                    >
                      <div
                        className="line-graph"
                        onClick={() => setSelectTable(true)}
                      >
                        <div className="edit-line">
                          <img
                            src={ICONS.editIconUser}
                            style={{ background: "white" }}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    {selectTable && (
                      <SelectTable setSelectTable={setSelectTable} />
                    )}
                  </div>
                </div>
              </div>
              <div className="create-input-field-note">
                <label htmlFor="" className="inputLabel">
                  Description
                </label>{" "}
                <br />
                <textarea
                  name="description"
                  id=""
                  rows={3}
                  // onChange={(e) => handlemarketingInputChange(e)}
                  value={createUserOnboarding.designation}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Type"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="createUserActionButton">
          <ActionButton
            title={"Cancel"}
            onClick={handleClose}
            type={"button"}
          />
          <ActionButton title={"Save"} onClick={() => {}} type={"submit"} />
        </div>
      </form>
    </div>
  );
};

export default UserOnboardingCreation;
