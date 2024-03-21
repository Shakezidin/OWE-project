import React from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";

type ButtonProps ={
  handleClose:()=>void
}

const CreateDealer = (props:ButtonProps) => {
 
  return (
    <div className="transparent-model">
      <div className="modal">
    
        <div className="createUserCrossButton" onClick={props.handleClose}>
          <CROSS_BUTTON />
     
       </div>
        <div className="createUserContainer">
          <span className="createProfileText">Dealer Overrides</span>
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
               <div className="create-input-field">
               <Input
                  type={"text"}
                  label="First Name*"
                  value={""}
                  placeholder={"Enter First Name"}
                  onChange={() => {}}
                />
               </div>
               <div className="create-input-field">
                <Input
                  type={"text"}
                  label="Last Name*"
                  value={""}
                  placeholder={"Enter Last Name"}
                  onChange={() => {}}
                />
                </div>
                <div className="create-input-field">
                 <Input
                  type={"text"}
                  label="Last Name*"
                  value={""}
                  placeholder={"Enter Last Name"}
                  onChange={() => {}}
                />
                </div>
              </div>

              <div className="create-input-container">
               <div className="create-input-field">
               <Input
                  type={"date"}
                  label="Start Date"
                  value={""}
                  placeholder={"Enter Email ID"}
                  onChange={() => {}}
                />
               </div>
                <div className="create-input-field">
                <Input
                  type={"date"}
                  label="End Date"
                  value={""}
                  placeholder={"Enter Phone Number"}
                  onChange={() => {}}
                />
                </div>
               
                
              </div>
              </div>
              <div className="createUserActionButton">
                <ActionButton title={"Create"} onClick={() => {}} />
              </div>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDealer;
