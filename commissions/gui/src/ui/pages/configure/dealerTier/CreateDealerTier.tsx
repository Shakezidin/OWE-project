import React, { useEffect, useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";
import { updateDealerTierForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createDealerTierSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { DealerTierModel } from "../../../../core/models/configuration/DealerTierModel";
import { useDispatch } from "react-redux";
import { dealertierOption } from "../../../../core/models/data_models/SelectDataModel";
import Select from 'react-select';
import { dealerTierData, tierState } from "../../../../resources/static_data/StaticData";
type ButtonProps = {
    handleClose: () => void
}

const CreateDealerTier = (props: ButtonProps) => {
    const dispatch = useDispatch();

    const [createDealerTierData, setCreateDealerTierData] = useState<DealerTierModel>(
        {
            dealer_name: "Shushank Sharma",
            tier: "TierName123",
            start_date: "2024-04-01",
            end_date: "2024-04-30"
        }
    )
    const [newFormData,setNewFormData] = useState<any>([])
    const tableData = {
      tableNames: ["tier"]
    }
   const getNewFormData=async()=>{
    const res = await postCaller(EndPoints.get_newFormData,tableData)
    setNewFormData(res.data)
    
   }
   useEffect(()=>{
  getNewFormData()
   },[])



    const handleChange = (newValue: any, fieldName: string) => {
        setCreateDealerTierData((prevData) => ({
            ...prevData,
            [fieldName]: newValue ? newValue.value : '',
        }));
    };
    const handleTierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreateDealerTierData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submitTierLoan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(updateDealerTierForm(createDealerTierData));
            const res = await postCaller(EndPoints.create_dealertier, createDealerTierData);
            if (res?.status === 200) {
                alert(res.message)
                props.handleClose()
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

                <div className="createUserCrossButton" onClick={props.handleClose}>
                    <CROSS_BUTTON />

                </div>
                <div className="createUserContainer">
                    <h3 className="createProfileText">Dealer Tier</h3>
                   <form onSubmit={(e)=>submitTierLoan(e)}>
                   <div className="createProfileInputView">
                        <div className="createProfileTextView">
                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Dealer Name"
                                        value={createDealerTierData.dealer_name}
                                        name="dealer_name"
                                        placeholder={"Enter"}
                                        onChange={(e) => handleTierChange(e)}
                                    />
                                </div>
                                <div className="create-input-field">
                                    <label className="inputLabel">Tier</label>
                                    <Select
                                        options={dealertierOption(newFormData)||dealerTierData}
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
                                        onChange={(newValue) => handleChange(newValue, 'tier')}
                                        value={dealertierOption(newFormData)||dealerTierData?.find((option) => option.value === createDealerTierData.tier)}
                                    />
                                </div>
                                <div className="create-input-field">
                                    <Input
                                        type={"date"}
                                        label="Start Date"
                                        value={createDealerTierData.start_date}
                                        name="start_date"
                                        placeholder={"1/04/2004"}
                                        onChange={(e) => handleTierChange(e)}
                                    />
                                </div>
                            </div>
                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <Input
                                        type={"date"}
                                        label="End Date"
                                        value={createDealerTierData.end_date}
                                        name="end_date"
                                        placeholder={"10/04/2004"}
                                        onChange={(e) => handleTierChange(e)}
                                    />
                                </div>
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

export default CreateDealerTier;
