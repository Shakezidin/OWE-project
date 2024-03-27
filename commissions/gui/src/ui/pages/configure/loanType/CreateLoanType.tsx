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

const CreateLoanType = (props: ButtonProps) => {
    const handleFormChange = () => {

    }
    return (
        <div className="transparent-model">
            <div className="modal">

                <div className="createUserCrossButton" onClick={props.handleClose}>
                    <CROSS_BUTTON />

                </div>
                <div className="createUserContainer">
                    <h3 className="createProfileText">Loan Type</h3>
                    <div className="createProfileInputView">
                        <div className="createProfileTextView">
                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <DropdownButton id="selectField1"
                                        label="Product Code"
                                        value={""}
                                        options={['Option 1', 'Option 2', 'Option 3']}
                                        onChange={handleFormChange} />
                                </div>

                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Description"
                                        value={""}
                                        name=""
                                        placeholder={"Description"}
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

export default CreateLoanType;
