import React, { useEffect, useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import Select from 'react-select';
import { updateAdderV } from "../../../../redux/apiSlice/configSlice/config_post_slice/createAdderVSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useDispatch } from "react-redux";

import { adderTypeOption, priceTypeOption } from "../../../../core/models/data_models/SelectDataModel";
import { adderTypeData, priceTypeData } from "../../../../resources/static_data/StaticData";
import { AdderVModel } from "../../../../core/models/configuration/create/AdderVModel";
interface vadderProps {
    editMode:boolean,
    handleClose: () => void,
    vAdderData: AdderVModel | null;
}
const CreateAdder:React.FC<vadderProps>= ({editMode,handleClose,vAdderData}) => {
    const dispatch = useDispatch();
   console.log(vAdderData)
    const [createAdderV, setCreateAdderV] = useState<AdderVModel>(
        {
            record_id:vAdderData? vAdderData?.record_id:0,
            adder_name:vAdderData ? vAdderData?.adder_name:"",
            adder_type: vAdderData? vAdderData?.adder_type: "",
            price_type: vAdderData? vAdderData?.price_type: "",
            price_amount: vAdderData? vAdderData?.price_amount:"",
            active:vAdderData? vAdderData?.active: 1,
            description:vAdderData? vAdderData?.description: "This is an example description"
        }
    )

    const [newFormData,setNewFormData] = useState<any>([])
    const tableData = {
      tableNames: ["adder_type","price_type",]
    }
   const getNewFormData=async()=>{
    const res = await postCaller(EndPoints.get_newFormData,tableData)
    setNewFormData(res.data)
    
   }
   useEffect(()=>{
  getNewFormData()
   },[])

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
           if(createAdderV.record_id){
            const res = await postCaller(EndPoints.update_vadders, createAdderV);
            if (res.status === 200) {
                alert(res.message)
                handleClose()
                window.location.reload()
            }
            else{
                alert(res.message)
            }
           }
           else{
            const { record_id, ...cleanedFormData } = createAdderV;
            const res = await postCaller(EndPoints.adderV, cleanedFormData);
            if (res.status === 200) {
                alert(res.message)
                handleClose()
                window.location.reload()
            }
            else{
                alert(res.message)
            }
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
                    <h3 className="createProfileText">{editMode===false?"Adder":"Update Adder"}</h3>
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
                                            options={adderTypeOption(newFormData)}
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
                                            value={adderTypeOption(newFormData)?.find((option) => option.value === createAdderV.adder_type)}
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
                                            options={priceTypeOption(newFormData)||priceTypeData}
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
                                            value={priceTypeOption(newFormData)||priceTypeData?.find((option) => option.value === createAdderV.price_type)}
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

export default CreateAdder;
