import React, { useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";
import Select from 'react-select';
import { updateAdderV } from "../../../../redux/apiSlice/configSlice/config_post_slice/createAdderVSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useDispatch } from "react-redux";
import { AdderVModel } from "../../../../core/models/configuration/AdderVModel";
import { adderTypeData, priceTypeData } from "../../../../core/models/data_models/SelectDataModel";
type ButtonProps = {
    handleClose: () => void
}
const CreateAdder = (props: ButtonProps) => {
    const dispatch = useDispatch();

    const [createAdderV, setCreateAdderV] = useState<AdderVModel>(
        {
            adder_name: "Example Adder",
            adder_type: "Type A",
            price_type: "Type X",
            price_amount: "12.34",
            active: 1,
            description: "This is an example description"
        }
    )



    const handleChange = (newValue: any, fieldName: string) => {
        setCreateAdderV((prevData) => ({
            ...prevData,
            [fieldName]: newValue ? newValue.value : '',
        }));
    };
    const handleAdderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCreateAdderV((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submitMarketingFees = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(updateAdderV(createAdderV));
            const res = await postCaller(EndPoints.adderV, createAdderV);
            if (res.status === 200) {
                alert(res.message)
                props.handleClose()
                window.location.reload()
            }
            else{
                alert(res.message)
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    return (
        <div className="transparent-model">
            <div className="modal">

                <div className="createUserCrossButton" onClick={props.handleClose}>
                    <CROSS_BUTTON />

                </div>
                <div className="createUserContainer">
                    <h3 className="createProfileText">Adder</h3>
                    <form onSubmit={(e) => submitMarketingFees(e)}>
                        <div className="createProfileInputView">
                            <div className="createProfileTextView">
                                <div className="create-input-container">
                                    <div className="rate-input-field">
                                        <Input
                                            type={"text"}
                                            label="Adder Name"
                                            value={createAdderV.adder_name}
                                            name="adder_name"
                                            placeholder={"Enter"}
                                            onChange={(e) => handleAdderChange(e)}
                                        />
                                    </div>
                                    <div className=" rate-input-field">
                                        <label className="inputLabel">Adder Type</label>
                                        <Select
                                            options={adderTypeData}
                                            isSearchable
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
                                            onChange={(newValue) => handleChange(newValue, 'adder_type')}
                                            value={adderTypeData.find((option) => option.value === createAdderV.adder_type)}
                                        />
                                    </div>


                                </div>

                                <div className="create-input-container">
                                    <div className="rate-input-field">
                                        <Input
                                            type={"text"}
                                            label="Price Amount"
                                            value={createAdderV.price_amount}
                                            name="price_amount"

                                            placeholder={"Amount"}
                                            onChange={(e) => handleAdderChange(e)}
                                        />
                                    </div>
                                    <div className=" rate-input-field">
                                        <label className="inputLabel">Price Type</label>
                                        <Select
                                            options={priceTypeData}
                                            isSearchable
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
                                            onChange={(newValue) => handleChange(newValue, 'price_type')}
                                            value={priceTypeData.find((option) => option.value === createAdderV.price_type)}
                                        />
                                    </div>

                                </div>
                                <div className="create-input-field-note">
                                    <label htmlFor="" className="inputLabel">Note</label> <br />
                                    <textarea name="description" id="" rows={4} value={createAdderV.description}
                                        onChange={(e) => handleAdderChange(e)}
                                        placeholder="Type"></textarea>
                                </div>

                            </div>
                            <div className="createUserActionButton">
                                <ActionButton title={"Save"} type="submit"
                                    onClick={() => { }} />
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateAdder;
