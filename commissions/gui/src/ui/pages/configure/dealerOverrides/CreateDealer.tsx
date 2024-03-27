import React from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";

type ButtonProps = {
  handleClose: () => void
}

const CreateDealer = (props: ButtonProps) => {

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
                    label="Sub Dealer"
                    value={""}
                    name=""
                    placeholder={"Sub Dealer"}
                    onChange={() => { }}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Dealer"
                    name=""
                    value={""}
                    placeholder={"Dealer"}
                    onChange={() => { }}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Pay Rate"
                    name=""
                    value={""}
                    placeholder={"Pay Rate"}
                    onChange={() => { }}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Start Date"
                    value={""}
                    name=""
                    placeholder={"Enter Email ID"}
                    onChange={() => { }}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="End Date"
                    name=""
                    value={""}
                    placeholder={"Enter Phone Number"}
                    onChange={() => { }}
                  />
                </div>


              </div>
            </div>
            <div className="createUserActionButton">
              <ActionButton title={"Create"} type="submit"
                onClick={() => { }} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDealer;
