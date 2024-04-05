import React, { useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";
import { updateLoanTypeForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createLoanTypeSlice";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";

import { useDispatch } from "react-redux";
import { LoanTypeModel } from "../../../../core/models/configuration/create/LoanTypeModel";

interface loanProps {
    handleClose: () => void,
    editMode:boolean,
    loanData:LoanTypeModel|null
}

const CreateLoanType:React.FC<loanProps> = ({handleClose,editMode,loanData}) => {
    const dispatch = useDispatch();

    const [createLoanTypeData, setCreateLoanTypeData] = useState<LoanTypeModel>(
        {
            record_id: loanData? loanData?.record_id: 0,
            product_code:loanData? loanData?.product_code: "Prd2",
            active: loanData? loanData?.active: 1,
            adder: loanData? loanData?.adder: 2,
            description: loanData? loanData?.description:"description"
        }
    )
   

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setCreateLoanTypeData((prevData) => ({
          ...prevData,
          active: parseInt(value),
        }));
      };
  
    const handleloanTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCreateLoanTypeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submitLoanType = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(updateLoanTypeForm(createLoanTypeData));
            const res = await postCaller(EndPoints.create_loantype, createLoanTypeData);
            if (res.status === 200) {
                alert(res.message)
                handleClose()
                window.location.reload()
            }
            else {
                alert(res.message)
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    return (
        <div className="transparent-model">
            <div className="modal">

                <div className="createUserCrossButton" onClick={handleClose}>
                    <CROSS_BUTTON />

                </div>
                <div className="createUserContainer">
                    <h3 className="createProfileText">{editMode===false?"Loan Type":"Update Loan Type"}</h3>
                  <form onSubmit={(e)=>submitLoanType(e)}>
                  <div className="createProfileInputView">
                        <div className="createProfileTextView">
                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Product Code"
                                        value={createLoanTypeData.product_code}
                                        name="product_code"
                                        placeholder={"Enter"}
                                        onChange={(e) => handleloanTypeChange(e)}
                                    />
                                </div>
                                {/* Radio buttons for Yes/No */}
                             <div className="create-input-field">
                             <label className="inputLabel">Active</label>
                                <div className="radio-container">
                              <div className="radio-content">
                                        <input
                                            type="radio"
                                            className="radio"
                                            name="active"
                                            value={"1"}
                                            checked={createLoanTypeData.active === 1}
                                            onChange={handleOptionChange}
                                        />
                                        Yes
                                    </div>
                                    <div className="radio-content">
                                        <input
                                            type="radio"
                                            name="active"
                                            className="radio"
                                            value={"0"}
                                            checked={createLoanTypeData.active === 0}
                                            onChange={(e)=>handleOptionChange(e)}
                                        />
                                        No
                                    </div>
                            
                                </div>
                             </div>

                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Adder"
                                        value={createLoanTypeData.adder}
                                        name="adder"
                                        placeholder={"Enter"}
                                        onChange={(e) => handleloanTypeChange(e)}
                                    />
                                </div>
                            </div>
                            <div className="create-input-field-note">
                                <label htmlFor="" className="inputLabel">Note</label> <br />
                                <textarea name="description" id="" rows={4}
                                    onChange={(e) => handleloanTypeChange(e)}
                                    value={createLoanTypeData.description} placeholder="Type"></textarea>
                            </div>

                        </div>
                        <div className="createUserActionButton">
                            <ActionButton title={editMode===false?"Save":"Update"} type="submit"
                                onClick={() => { }} />
                        </div>

                    </div>
                  </form>
                </div>
            </div>
        </div>
    );
};

export default CreateLoanType;
