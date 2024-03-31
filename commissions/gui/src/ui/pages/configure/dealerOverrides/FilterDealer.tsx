import React from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";
import { IoAddSharp } from "react-icons/io5";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";
import Select from 'react-select';
import { dealer, subDealer } from "../../../../core/models/data_models/SelectDataModel";

type ButtonProps = {
    handleClose: () => void
}

const FilterDealer = (props: ButtonProps) => {
    const handleFormChange = () => {

    }
    return (
        <div className="transparent-model">
            <div className="modal">

                <div className="createUserCrossButton" onClick={props.handleClose}>
                    <CROSS_BUTTON />

                </div>
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
                    <label className="inputLabel">Sub Dealer</label>
                    <div className="">
                      <Select
                        options={subDealer}
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
                    
                        value={subDealer.find((option) => option.value ==='subDealer')}
                      />
                    </div>
                  </div>
                  <div className="create-input-field">
                    <label className="inputLabel">Dealer</label>
                    <div className="">
                      <Select
                        options={dealer}
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
                    
                        value={dealer.find((option) => option.value ==='dealer')}
                      />
                    </div>
                  </div>

                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Sales Type"
                                        value={""}
                                        name=""
                                        placeholder={"Sales Type"}
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
                            onClick={() => { }} />
                    </div>

                </div>
            </div>
        </div>

    );
};

export default FilterDealer;
