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

const CreateMarketingFees = (props: ButtonProps) => {
    const handleFormChange = () => {

    }
    return (
        <div className="transparent-model">
            <div className="modal">

                <div className="createUserCrossButton" onClick={props.handleClose}>
                    <CROSS_BUTTON />

                </div>
                <div className="createUserContainer">
                    <h3 className="createProfileText">Marketing Fees</h3>
                    <div className="createProfileInputView">
                        <div className="createProfileTextView">
                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <DropdownButton id="selectField1"
                                        label="Source"
                                        value={""}
                                        options={['Option 1', 'Option 2', 'Option 3']}
                                        onChange={handleFormChange} />
                                </div>
                                <div className="create-input-field">
                                    <DropdownButton id="selectField1"
                                        label="DBA"
                                        value={""}
                                        options={['Option 1', 'Option 2', 'Option 3']}
                                        onChange={handleFormChange} />
                                </div>
                                <div className="create-input-field">
                                    <DropdownButton id="selectField1"
                                        label="State"
                                        value={""}
                                        options={['Option 1', 'Option 2', 'Option 3']}
                                        onChange={handleFormChange} />
                                </div>
                            </div>

                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Fee Rate"
                                        value={""}
                                        name=""
                                        placeholder={"Enter"}
                                        onChange={() => { }}
                                    />
                                </div>
                                <div className="create-input-field">
                                    <DropdownButton id="selectField1"
                                        label="Chl DLR"
                                        value={""}
                                        options={['Option 1', 'Option 2', 'Option 3']}
                                        onChange={handleFormChange} />
                                </div>
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Pay Src"
                                        value={""}
                                        name=""
                                        placeholder={"Enter"}
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
                                        placeholder={"1/04/2004"}
                                        onChange={() => { }}
                                    />
                                </div>

                                <div className="create-input-field">
                                    <Input
                                        type={"date"}
                                        label="End Date"
                                        value={""}
                                        name=""
                                        placeholder={"10/04/2004"}
                                        onChange={() => { }}
                                    />
                                </div>
                            </div>
                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <label className="textareaContainer">
                                        <p>Note</p>
                                    </label>
                                    <textarea rows={4} cols={137}
                                        placeholder={"Type"} />
                                </div>
                            </div>

                        </div>
                        <div className="createUserActionButton">
                            <ActionButton title={"Save"} type="submit"
                                onClick={() => { }} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateMarketingFees;
