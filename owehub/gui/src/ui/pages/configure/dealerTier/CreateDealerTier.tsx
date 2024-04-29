import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { updateDealerTierForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createDealerTierSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useDispatch } from "react-redux";
import { dealertierOption } from "../../../../core/models/data_models/SelectDataModel";
import Select from 'react-select';

import { DealerTierModel } from "../../../../core/models/configuration/create/DealerTierModel";
import SelectOption from "../../../components/selectOption/SelectOption";
interface dealerProps {
    handleClose: () => void,
    editMode:boolean,
    editDealerTier: DealerTierModel| null;
  }
const CreateDealerTier:React.FC<dealerProps> = ({handleClose,editMode,editDealerTier}) => {
    const dispatch = useDispatch();

    const [createDealerTierData, setCreateDealerTierData] = useState<DealerTierModel>(
        {
            record_id: editDealerTier? editDealerTier?.record_id: 0,
            dealer_name:editDealerTier? editDealerTier?.dealer_name: "Shushank Sharma",
            tier:editDealerTier? editDealerTier?.tier: "TierName123",
            start_date:editDealerTier? editDealerTier?.start_date: "2024-04-01",
            end_date: editDealerTier? editDealerTier?.end_date:"2024-04-30"
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
         if(createDealerTierData.record_id){
            const res = await postCaller(EndPoints.update_dealertier, createDealerTierData);
            if (res?.status === 200) {
                alert(res.message)
                handleClose()
                window.location.reload()
            }
            else {
                alert(res.message)
            }
         }
         else{
            const { record_id, ...cleanedFormData } = createDealerTierData;
            const res = await postCaller(EndPoints.create_dealertier, cleanedFormData);
            if (res?.status === 200) {
                alert(res.message)
                handleClose()
                window.location.reload()
            }
            else {
                alert(res.message)
            }
         }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    return (
        <div className="transparent-model">
             <form onSubmit={(e)=>submitTierLoan(e)} className="modal">

                <div className="createUserCrossButton" onClick={handleClose}>
                    <CROSS_BUTTON />
                </div>
               
                    <h3 className="createProfileText">Dealer Tier</h3>
               
                  <div className="modal-body">
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
                                    <label className="inputLabel-select">Tier</label>
                                    <SelectOption
                                        options={dealertierOption(newFormData)}
                                        onChange={(newValue) => handleChange(newValue, 'tier')}
                                        value={dealertierOption(newFormData)?.find((option) => option.value === createDealerTierData.tier)}
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
                        </div>
                  </div>
                        <div className="createUserActionButton">
                        <ActionButton title={"Cancel"} type="reset"
                  onClick={() => handleClose()} />
                            <ActionButton title={"Save"} type="submit"
                                onClick={() => { }} />
                        </div>

                
             
         
                </form>
        </div>
    );
};

export default CreateDealerTier;
