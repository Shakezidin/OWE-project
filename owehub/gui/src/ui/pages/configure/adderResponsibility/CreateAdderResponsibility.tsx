import React, { useEffect, useState } from "react";
 
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
 
import { ActionButton } from "../../../components/button/ActionButton";
import { updatePayForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createPayScheduleSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { installerOption, partnerOption, salesTypeOption, stateOption, } from "../../../../core/models/data_models/SelectDataModel";
import Select from 'react-select';
import {paySaleTypeData } from "../../../../resources/static_data/StaticData";
import { PayScheduleModel } from "../../../../core/models/configuration/create/PayScheduleModel";
import SelectOption from "../../../components/selectOption/SelectOption";
import { createAdderResponsibility, updateAdderResponsibility } from "../../../../redux/apiActions/adderResponsbilityAction";
import { resetSuccess } from "../../../../redux/apiSlice/configSlice/config_get_slice/adderResponsbilitySlice";

interface payScheduleProps {
    handleClose: () => void,
    editMode:boolean,
    editData:any,
}
 
 
const CreateAdderResponsibility:React.FC<payScheduleProps> = ({handleClose,editMode, editData}) => {
    const dispatch = useAppDispatch();
    const { isSuccess } = useAppSelector(state => state.adderresponsbility)
    function generateRandomId(length: number): string {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let result = '';
    
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
      }
    
      return result;
    }
    const [createAdderResponsbilityData, setAdderResponsbilityData] = useState({
      unique_id: editData?.unique_id || generateRandomId(6),
      pay_scale: editData?.pay_scale || 0,
      percentage: editData?.percentage || 0,
      
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setAdderResponsbilityData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
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
 
 
   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
 
    if (editMode) {
      
      dispatch(updateAdderResponsibility({
        unique_id:createAdderResponsbilityData.unique_id,
        pay_scale: createAdderResponsbilityData.pay_scale,
        percentage: parseInt(createAdderResponsbilityData.percentage, 10),
        record_id: editData?.record_id!
      }));
    } else {
       
      dispatch(
        createAdderResponsibility({
    
          unique_id:createAdderResponsbilityData.unique_id,
          pay_scale: createAdderResponsbilityData.pay_scale,
          percentage: parseInt(createAdderResponsbilityData.percentage, 10)
        })
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
       
    }
    return () => {
      isSuccess && dispatch(resetSuccess());
    };
  }, [isSuccess]);
 
    return (
        <div className="transparent-model">
             <form  className="modal" onSubmit={handleSubmit}>
 
                <div className="createUserCrossButton" onClick={handleClose}>
                    <CROSS_BUTTON />
 
                </div>
             
                    <h3 className="createProfileText">{editMode===false?"Create Adder Responsibility":"Update Adder Responsibility"}</h3>
               
                  <div className="modal-body">
                  <div className="createProfileInputView">
                        <div className="createProfileTextView">
                        <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Pay Scale"
                      value={createAdderResponsbilityData.pay_scale}
                      name="pay_scale"
                      placeholder={"Enter"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={"number"}
                      label="Percentage"
                      value={createAdderResponsbilityData.percentage}
                      name="percentage"
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
 
export default CreateAdderResponsibility;