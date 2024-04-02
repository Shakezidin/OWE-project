import React from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";
import { IoAddSharp } from "react-icons/io5";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";

import Select from 'react-select';


type ButtonProps = {
    handleClose: () => void
}

const FilterDealerTier = (props: ButtonProps) => {
    const handleFormChange = () => {

    }
    return (
        <div className="transparent-model">
            <div className="modal">

                {/* <div className="createUserCrossButton" onClick={props.handleClose}>
                    <CROSS_BUTTON />

                </div> */}
                <div className="createUserContainer">
                    <div className="" style={{ display: "flex", justifyContent: "space-between", padding: "1rem 2rem 0rem 2rem" }}>
                        <div className="">
                            <h4>Apply Filter</h4>
                        </div>
                        <div className="iconsSection2">
                            <button
                                type="button"
                                style={{
                                    // background: "black",
                                    color: "black",
                                    border: "1px solid #9d9d9d",
                                }}
                            // onClick={onpressAddNew}
                            >
                                <IoAddSharp /> Add New
                            </button>

                        </div>
                    </div>
                    <div className="createProfileInputView">
                        <div className="createProfileTextView">
                            <div className="create-input-container">
                            <div className="create-input-field">
                    <label className="inputLabel">Column Name</label>
                    <div className="">
                      <Select
                        // options={dealer}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            marginTop:"4.5px",
                            borderRadius:"8px",
                            outline:"none",
                            height:"2.8rem",
                            border:"1px solid #d0d5dd"
                            
                          }),
                        }}
                    
                        // value={dealer.find((option) => option.value ==='dealer')}
                      />
                    </div>
                  </div>
                  <div className="create-input-field">
                    <label className="inputLabel">Operation</label>
                    <div className="">
                      <Select
                        // options={installers}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            marginTop:"4.5px",
                            borderRadius:"8px",
                            outline:"none",
                            height:"2.8rem",
                            border:"1px solid #d0d5dd"
                            
                          }),
                        }}
                    
                        // value={installers.find((option) => option.value ==='installer')}
                      />
                    </div>
                  </div>

                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Value"
                                        value={""}
                                        name=""
                                        placeholder={"Enter"}
                                        onChange={() => { }}
                                    />
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="createUserActionButton" style={{ gap: "2rem" }}>
                        <ActionButton title={"Save"} type="submit"
                            onClick={() => { }} />

                        <ActionButton title={"cancel"} type="submit"
                            onClick={props.handleClose} />
                    </div>

                </div>
            </div>
        </div>

    );
};

export default FilterDealerTier;
