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
import { PayScheduleModel } from "../../../../core/models/configuration/create/PayScheduleModel";
import SelectOption from "../../../components/selectOption/SelectOption";

interface payScheduleProps {
    handleClose: () => void,
    editMode:boolean,
}
 
 
const CreateAdderResponsibility:React.FC<payScheduleProps> = ({handleClose,editMode}) => {
    const dispatch = useDispatch();
 
    // const [createPayData, setCreatePayData] = useState<PayScheduleModel>(
    //     {
    //         record_id: payEditedData? payEditedData?.record_id: 0,
    //         partner: payEditedData? payEditedData?.partner: "Shushank Sharma",
    //         partner_name:payEditedData? payEditedData?.partner_name: "FFS",
    //         installer_name: payEditedData? payEditedData?.installer_name:"OWE",
    //         sale_type: payEditedData? payEditedData?.sale_type:"BATTERY",
    //         state: payEditedData? payEditedData?.state:"Alabama",
    //         rl: payEditedData? payEditedData?.rl:"40",
    //         draw:payEditedData? payEditedData?.draw: "50%",
    //         draw_max: payEditedData? payEditedData?.draw_max:"50%",
    //         rep_draw:payEditedData? payEditedData?.rep_draw: "2000.00",
    //         rep_draw_max:payEditedData? payEditedData?.rep_draw_max: "2000.00",
    //         rep_pay:payEditedData? payEditedData?.rep_pay: "Yes",
    //         start_date: payEditedData? payEditedData?.start_date:"2024-04-01",
    //         end_date: payEditedData? payEditedData?.end_date:"2024-04-30"
    //       }
    // )
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
 
 
 
 
    return (
        <div className="transparent-model">
             <form  className="modal">
 
                <div className="createUserCrossButton" onClick={handleClose}>
                    <CROSS_BUTTON />
 
                </div>
             
                    <h3 className="createProfileText">{editMode===false?"Leader Override":"Update RepPay Settings"}</h3>
               
                  <div className="modal-body">
                  <div className="createProfileInputView">
                        <div className="createProfileTextView">
                        <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Pay Scale"
                      value={""}
                      name="dealer_tier"
                      placeholder={"Enter"}
                      onChange={() => {}}
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={"number"}
                      label="Percentage"
                      value={""}
                      name="dealer_tier"
                      placeholder={"Enter"}
                      onChange={() => {}}
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