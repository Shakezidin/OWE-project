import React, { useState, useEffect } from "react";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { useDispatch } from "react-redux";
import { updateUserForm } from "../../../../redux/apiSlice/userManagementSlice/createUserSlice";
import {
  userSelectData,
} from "../../../../resources/static_data/StaticData";
import CheckBox from "../../../components/chekbox/CheckBox";
import { ICONS } from "../../../icons/Icons";
import SelectTable from "./SeletTable";
import UserBasedInput from "./UserBasedInput";
import SelectOption from "../../../components/selectOption/SelectOption";
import {
  CreateUserModel,
} from "../../../../core/models/api_models/UserManagementModel";
import { useAppSelector } from "../../../../redux/hooks";

interface createUserProps {
  editMode: boolean;
  handleClose: () => void;
  userOnboard: CreateUserModel | null;
  onSubmitCreateUser: (e: any) => void;
  onChangeRole: (role: string, value: string) => void;
  dealerList: any[];
  regionList: any[];
}

const UserOnboardingCreation: React.FC<createUserProps> = ({
  handleClose,
  onSubmitCreateUser,
  onChangeRole,
  dealerList,
  regionList,
  userOnboard,
  editMode,
}) => {
  const dispatch = useDispatch();
  const { formData } = useAppSelector((state) => state.createOnboardUser);
  const [selectTable, setSelectTable] = useState<boolean>(false);

  /** handle change for role */
  const handleChange = (newValue: any, fieldName: string) => {
    dispatch(updateUserForm({ field: "assigned_dealer_name", value: "" }));
    dispatch(updateUserForm({ field: "add_region", value: "" }));
    dispatch(updateUserForm({ field: "team_name", value: "" }));
    dispatch(updateUserForm({ field: "report_to", value: "" }));
    const { value } = newValue;
    onChangeRole("Role", value);
    dispatch(updateUserForm({ field: fieldName, value }));
  };

  /**handle change for dealer */
  const handleChangeForDealer = (newValue: any, fieldName: string) => {
    const { value } = newValue;
    onChangeRole("Dealer", value);
    dispatch(updateUserForm({ field: fieldName, value }));
  };

  /**handle change for dealer */
  const handleChangeForRegion = (newValue: any, fieldName: string) => {
    const { value } = newValue;
    dispatch(updateUserForm({ field: fieldName, value }));
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(updateUserForm({ field: name, value }));
  };
  console.log(formData)

  /** render ui */
  return (
    <div className="transparent-model">
      <form onSubmit={(e) => onSubmitCreateUser(e)} className="modal">
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
                    value={formData.first_name}
                    placeholder={"Enter First Name"}
                    onChange={(e) => handleInputChange(e)}
                    name={"first_name"}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Last Name"
                    value={formData.last_name}
                    placeholder={"Enter Last Name"}
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
                      (option) => option?.value === formData.role_name
                    )}
                  />
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Email ID"
                    value={formData.email_id}
                    placeholder={"email@mymail.com"}
                    onChange={(e) => handleInputChange(e)}
                    name={"email_id"}
                    disabled={formData.isEdit}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Phone Number"
                    value={formData.mobile_number}
                    placeholder={"Phone Number"}
                    onChange={(e) => handleInputChange(e)}
                    name={"mobile_number"}
                  />
                </div>
                {formData.role_name === "Admin" ||
                formData.role_name === "SubDealer Owner" ||
                formData.role_name === "Dealer Owner" ? null : (
                  <div className="create-input-field">
                    <label className="inputLabel">Dealer Owner</label>
                    <SelectOption
                      options={dealerList}
                      onChange={(newValue) =>
                        handleChangeForDealer(newValue, "assigned_dealer_name")
                      }
                      value={dealerList?.find(
                        (option) =>
                          option?.value === formData.assigned_dealer_name
                      )}
                    />
                  </div>
                )}
              </div>
              <UserBasedInput
                formData={formData}
                onChange={(e: any) => handleInputChange(e)} 
                regionList={regionList} 
                handleChangeForRegion={(value: any, name: string)=>{
                  handleChangeForRegion(value, name)
                }}

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
                  value={formData.description}
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
