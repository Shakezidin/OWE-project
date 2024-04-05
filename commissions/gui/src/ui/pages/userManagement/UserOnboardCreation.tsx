import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../resources/assets/cross_button.svg";

import Input from "../../components/text_input/Input";

import DropdownButton from "../../components/dropdown/DropdownButton";
import { ActionButton } from "../../components/button/ActionButton";
import Select from 'react-select';
import { UserAdmin } from "../../../core/models/UserManagement/UserAdmin";
import { useDispatch } from "react-redux";
import { postCaller } from "../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../infrastructure/web_api/api_client/EndPoints";
import { updateForm } from "../../../redux/apiSlice/userManagementSlice/createUserSlice";
interface ButtonProps {
  editMode: boolean,
  handleClose: () => void,
  userOnboard: UserAdmin | null;

}

const UserOnboardCreation: React.FC<ButtonProps> = ({ handleClose, userOnboard, editMode }) => {

  const dispatch = useDispatch();
  const [createUserOnboarding, setCreateOnboarding] = useState<UserAdmin>(

    {
      // record_id: userOnboard ? userOnboard?.record_id : 0,
      First_Name: userOnboard ? userOnboard?.First_Name : "Deepak",
      Last_Name: userOnboard ? userOnboard?.Last_Name : "Chauhan",
      Role: userOnboard ? userOnboard?.Role : "Admin",
      Email_ID: userOnboard ? userOnboard?.Email_ID : "imdeepak@gmail.com",
      Phone_Number: userOnboard ? userOnboard?.Phone_Number : 9716953624,
      Dealer_Owner: userOnboard ? userOnboard?.Dealer_Owner : "Vinay",
      Description: userOnboard ? userOnboard?.Description : 123456
      // rate: commission? commission?.rate :0,
      // start_date:commission? commission?.start_date : "",
      // end_date:commission? commission?.end_date : ""
    }
  )
  const [newFormData, setNewFormData] = useState<any>([])
  const tableData = {
    tableNames: ["Role", "Dealer_Owner"]
  }
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData)
    setNewFormData(res.data)

  }
  useEffect(() => {
    getNewFormData()
  }, [])

  useEffect(() => {
    if (userOnboard) {
      setCreateOnboarding(userOnboard);
    }
  }, [userOnboard]);

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateOnboarding((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateOnboarding((prevData) => ({
      ...prevData,
      [name]: name === 'Email_ID' || name === 'Phone_Number' ? parseFloat(value) : value,
    }));
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
   
  //     dispatch(updateForm(createUserOnboarding));
  //     if(createUserOnboarding){
  //       const res = await postCaller(EndPoints.update_commission, createUserOnboarding);
  //       if (res.status === 200) {
  //         alert(res.message)
  //         handleClose()
  //         window.location.reload()
  //       }
  //       else {
  //         alert(res.message)
  //       }
  //     }
  //     else{
  //       const res = await postCaller(EndPoints.create_commission, createUserOnboarding);
  //       if (res.status === 200) {
  //         alert(res.message)
  //         handleClose()
  //         window.location.reload()
  //       }
  //       else {
  //         alert(res.message)
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //   }
  // };

  // const handleFormChange = () => { };
  return (
    <div className="transparent-model">
      <div className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>
        <div className="createUserContainer">
          <h3 className="createProfileText">Onboarding</h3>
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="First Name"
                    value={""}
                    placeholder={"Enter Name"}
                    onChange={() => { }}
                    name={""}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Last Name"
                    value={""}
                    placeholder={"Enter"}
                    onChange={() => { }}
                    name={""}
                  />
                </div>
                <div className="create-input-field">
                  <label className="inputLabel">Role</label>
                  <Select
                    // options={}
                    isSearchable
                    // onChange={(newValue) => handleChange(newValue, 'partner')}
                    // value={partnerOption(newFormData)?.find((option) => option?.value === createuserOnboard.partner)}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        marginTop: "4.5px",
                        borderRadius: "8px",
                        outline: "none",
                        height: "2.8rem",
                        border: "1px solid #d0d5dd"

                      }),
                    }}
                  />
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Email ID"
                    value={""}
                    placeholder={"email@mymail.com"}
                    onChange={() => { }}
                    name={""}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Phone Number"
                    value={""}
                    placeholder={"Phone Number"}
                    onChange={() => { }}
                    name={""}
                  />
                </div>
                <div className="create-input-field">
                  <label className="inputLabel">Dealer Owner</label>
                  <Select
                    // options={}
                    isSearchable
                    // onChange={(newValue) => handleChange(newValue, 'partner')}
                    // value={partnerOption(newFormData)?.find((option) => option?.value === createuserOnboard.partner)}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        marginTop: "4.5px",
                        borderRadius: "8px",
                        outline: "none",
                        height: "2.8rem",
                        border: "1px solid #d0d5dd"

                      }),
                    }}
                  />
                </div>
              </div>
              <div className="create-input-field-note">
                <label htmlFor="" className="inputLabel">Description</label> <br />
                <textarea name="description" id="" rows={3}
                  // onChange={(e) => handlemarketingInputChange(e)}
                  // value={createMarketing.description}
                  placeholder="Type"></textarea>
              </div>
            </div>

            <div className="createUserActionButton">
              <ActionButton
                title={"Cancel"}

                onClick={() => { }}
                type={"button"}
              />
              <ActionButton title={"Save"} onClick={() => { }} type={"button"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOnboardCreation;
