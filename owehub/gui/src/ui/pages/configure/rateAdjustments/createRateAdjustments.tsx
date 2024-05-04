import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";

import { ActionButton } from "../../../components/button/ActionButton";
import { updatePayForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createPayScheduleSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useDispatch } from "react-redux";
import { installerOption, partnerOption, salesTypeOption, stateOption, } from "../../../../core/models/data_models/SelectDataModel";
import Select from 'react-select';
import {paySaleTypeData } from "../../../../resources/static_data/StaticData";
import { rateAdjustmentModel } from "../../../../core/models/configuration/create/RateAdjustmentModel";
import SelectOption from "../../../components/selectOption/SelectOption";
import { createRateAdjustments } from "../../../../redux/apiActions/RateAdjustmentsAction";
import { useAppDispatch } from "../../../../redux/hooks";
interface payScheduleProps {
    handleClose: () => void,
    editMode:boolean,
    setViewArchived:React.Dispatch<React.SetStateAction<boolean>>
}


const CreateRateAdjustments:React.FC<payScheduleProps> = ({handleClose,editMode,setViewArchived}) => {
    const dispatch = useAppDispatch();


    const [createRateAdjustmentData, setCreateRateAdjustmentPayData] = useState<rateAdjustmentModel>(
      {
          unique_id:"1234567sfsfds89kjj",
          pay_scale:"",
          position:"",
          adjustment:"",
          min_rate:"",
          max_rate:"",
           
        }
  )
  
    const [newFormData,setNewFormData] = useState<any>([])
   
    const tableData = {
      tableNames: ["partners", "states","installers","sale_type"]
    }
   const getNewFormData=async()=>{
    const res = await postCaller(EndPoints.get_newFormData,tableData)
    setNewFormData(res.data)
    
   }
   useEffect(()=>{
  getNewFormData()
   },[])

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateRateAdjustmentPayData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};
 
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  setViewArchived(false)
  dispatch(createRateAdjustments({
    
    
      unique_id: "123456789",
      pay_scale: "Hourly",
      position: "Software Engineer",
      adjustment: "10%",
      min_rate: 20.1,
      max_rate: 20.2,
      start_date: "2024-05-01",
      end_date: "2024-06-01"
    
    
    
  }))
}
 
    return (
        <div className="transparent-model">
             <form  className="modal" onSubmit={handleSubmit}>

                <div className="createUserCrossButton" onClick={handleClose}>
                    <CROSS_BUTTON />

                </div>
             
                    <h3 className="createProfileText">{editMode===false?"Create Rate Adjustment":"Update Rate Adjustment"}</h3>
                
                  <div className="modal-body">
                  <div className="createProfileInputView">
                        <div className="createProfileTextView">
                        <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Pay Scale"
                      value={createRateAdjustmentData.pay_scale}
                      name="pay_scale"
                      placeholder={"Enter"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Position"
                      value={""}
                      name="position"
                      placeholder={"Enter"}
                      onChange={(e) => handleInputChange(e)}
                      
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Adjustment"
                      value={""}
                      name="adjustment"
                      placeholder={"Enter"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                 
                </div>

             
                         
                <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="MIN Rate"
                      value={""}
                      name="min_rate"
                      placeholder={"Enter"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Max Rate"
                      value={""}
                      name="max_rate"
                      placeholder={"Enter"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                
                 
                </div>
 
                         
             </div>
        </div>
                  
     </div>
                        <div className="createUserActionButton">
                        <ActionButton title={"Cancel"} type="reset"
                  onClick={() => handleClose()} />
                            <ActionButton title={editMode===false?"Save":"Update"} type="submit"
                                onClick={() => { }} />
                        </div>

                  
             
           
                </form>
        </div>
    );
};

export default CreateRateAdjustments;
