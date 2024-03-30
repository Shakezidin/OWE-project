import React, { useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";
import { useDispatch } from "react-redux";
import { AdderVModel } from "../../../../core/models/configuration/AdderVModel";
import { updateSalesForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createSalesTypeSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { SalesTypeModel } from "../../../../core/models/configuration/SalesTypeModel";

type ButtonProps = {
    handleClose: () => void
}

const CreateSaleType = (props: ButtonProps) => {
    const dispatch = useDispatch();

    const [createSales, setCreateSales] = useState<SalesTypeModel>( 
        {
            type_name: "Example sale type 2",
            description: "This is an example sale type 2"
        }
        
    )
  
    const handleSalesChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setCreateSales((prevData) => ({
        ...prevData,
        [name] : value,
      }));
    };
  
    const submitSalesType = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        dispatch(updateSalesForm(createSales));
        const res = await postCaller(EndPoints.create_saletype, createSales);
        if(res.status===200){
          alert("Created Successfully")
          props.handleClose()
          window.location.reload()
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };
    return (
        <div className="transparent-model">
            <div className="sales-modal">

                <div className="createUserCrossButton" onClick={props.handleClose}>
                    <CROSS_BUTTON />

                </div>
                <div className="createUserContainer">
                    <h3 className="createProfileText">Sale Type</h3>
                <form onSubmit={(e)=>submitSalesType(e)}>
                <div className="createProfileInputView">
                        <div className="createProfileTextView">
                            <div className="create-input-container">
                                <div className="create-input-field-note">
                                    <Input
                                        type={"text"}
                                        label="Name"
                                        value={createSales.type_name}
                                        name="type_name"
                                        placeholder={"Name"}
                                        onChange={(e) => handleSalesChange(e)}
                                    />
                                </div>

                            </div>
                            <div className="create-input-field-note">
                                <label htmlFor="" className="inputLabel">Note</label> <br />
                                <textarea name="description" id="" rows={4} value={createSales.description}
                                   onChange={(e) => handleSalesChange(e)}
                                    placeholder="Type"></textarea>
                            </div>

                        </div>
                        <div className="createUserActionButton">
                            <ActionButton title={"Create"} type="submit"
                                onClick={() => { }} />
                        </div>

                    </div>
                </form>
                </div>
            </div>
        </div>
    );
};

export default CreateSaleType;
