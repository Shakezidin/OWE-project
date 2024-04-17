import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";

import Input from "../../../components/text_input/Input";

import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";
import Select from "react-select";
import { UserAdmin } from "../../../../core/models/UserManagement/UserAdmin";
import { useDispatch } from "react-redux";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { updateUserForm } from "../../../../redux/apiSlice/userManagementSlice/createUserSlice";
import {
    dealer,
    userSelectData,
} from "../../../../resources/static_data/StaticData";
import CheckBox from "../../../components/chekbox/CheckBox";
import { ICONS } from "../../../icons/Icons";
import SelectTable from "./SeletTable";

interface ButtonProps {
    editMode: boolean;
    handleClose: () => void;
    userOnboard: UserAdmin | null;
}

const UserOnboardingCreation: React.FC<ButtonProps> = ({
    handleClose,
    userOnboard,
    editMode,
}) => {
    const dispatch = useDispatch();
    const [createUserOnboarding, setCreateOnboarding] = useState<UserAdmin>({
        first_name: "Ankita",
        last_name: "Chauhan",
        email_id: "Vinay@yopmail.com",
        mobile_number: "9911477443",
        password: "1234",
        designation: "Developer",
        assigned_dealer_name: "369 Solar",
        role_name: "admin",
    });
    // const [newFormData, setNewFormData] = useState<any>([])
    const tableData = {
        tableNames: ["Role", "Dealer_Owner"],
    };
    // const getNewFormData = async () => {
    //   const res = await postCaller(EndPoints.get_newFormData, tableData)
    //   setNewFormData(res.data)

    // }
    // useEffect(() => {
    //   getNewFormData()
    // }, [])

    // useEffect(() => {
    //   if (userOnboard) {
    //     setCreateOnboarding(userOnboard);
    //   }
    // }, [userOnboard]);

    const [selectTable, setSelectTable] = useState<boolean>(false)

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
        try {
            dispatch(updateUserForm(createUserOnboarding));
            console.log(createUserOnboarding);
            // const res = await postCaller(EndPoints.update_commission, createUserOnboarding);
            // if (res.status === 200) {
            //   alert(res.message)
            //   handleClose()
            //   window.location.reload()
            // }
            // else {
            //   alert(res.message)
            // }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

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
                                        <Select
                                            options={userSelectData}
                                            isSearchable
                                            onChange={(newValue) => handleChange(newValue, "role")}
                                            value={userSelectData?.find(
                                                (option) =>
                                                    option?.value === createUserOnboarding.role_name
                                            )}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    marginTop: "4.5px",
                                                    borderRadius: "8px",
                                                    outline: "none",
                                                    height: "2.25rem",
                                                    fontSize:"13px",
                                                    border: "1px solid #d0d5dd",
                                                }),
                                                indicatorSeparator: () => ({
                                                    display: 'none' // Hide the indicator separator
                                                  }),
                                                  option: (baseStyles) => ({
                                                    ...baseStyles,
                                                    fontSize: "13px"
                                                  })
                                            }}
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
                                    <div className="create-input-field">
                                        <label className="inputLabel">Dealer</label>
                                        <Select
                                            options={dealer}
                                            isSearchable
                                            onChange={(newValue) =>
                                                handleChange(newValue, "assigned_dealer_name")
                                            }
                                            value={dealer?.find(
                                                (option) =>
                                                    option?.value ===
                                                    createUserOnboarding.assigned_dealer_name
                                            )}
                                            styles={{
                                                control: (baseStyles, state) => ({
                                                    ...baseStyles,
                                                    marginTop: "4.5px",
                                                    borderRadius: "8px",
                                                    outline: "none",
                                                    height: "2.25rem",
                                                    fontSize:"13px",
                                                    border: "1px solid #d0d5dd",
                                                }),
                                                indicatorSeparator: () => ({
                                                    display: 'none' // Hide the indicator separator
                                                  }),
                                                  option: (baseStyles) => ({
                                                    ...baseStyles,
                                                    fontSize: "13px"
                                                  })
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    <div className="" style={{ display: "flex", gap: "0.5rem" }}>
                                        <CheckBox
                                            checked={true}
                                            onChange={() => { }}

                                        // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                                        />
                                        <div className="access-data">
                                            <p>Database Access</p>
                                        </div>
                                    </div>
                                    <div className="" style={{ marginTop: "0.2rem" }}>
                                        <div className="dashboard-payroll">
                                            <div className="Payroll-section">
                                                <label className="inputLabel" style={{ color: "#344054" }}>Table 1</label>
                                                <div className="dash-select-user">
                                                    Edit
                                                </div>

                                            </div>
                                            <div className="Payroll-section">
                                                <label className="inputLabel" style={{ color: "#344054" }}>Table 2</label>
                                                <div className="dash-select-user">
                                                    Full
                                                </div>
                                            </div>
                                            <div className="Payroll-section">
                                                <label className="inputLabel" style={{ color: "#344054" }}>Table 3</label>
                                                <div className="dash-select-user">
                                                    View
                                                </div>
                                            </div>
                                            <div className="Line-container" style={{ marginTop: "0.3rem", cursor: "pointer" }}>
                                                <div className="line-graph" onClick={() => setSelectTable(true)}>
                                                    <div className="edit-line">
                                                        <img src={ICONS.editIconUser} style={{ background: "white" }} alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                        selectTable && (<SelectTable setSelectTable={setSelectTable} />)
                                                    }
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
                                <ActionButton
                                    title={"Save"}
                                    onClick={() => { }}
                                    type={"submit"}
                                />
                            </div>
                   
                    </form>
              
         
        </div>
    );
};

export default UserOnboardingCreation;