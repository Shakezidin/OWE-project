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
import {partners, paySaleTypeData } from "../../../../resources/static_data/StaticData";
import { ReconcileModel } from "../../../../core/models/configuration/create/ReconcileModel";
import SelectOption from "../../../components/selectOption/SelectOption";
import { createReconcile, updateReconcile } from "../../../../redux/apiActions/reconcileAction";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  fetchRepaySettings,
  RepayEditParams,
} from "../../../../redux/apiActions/repPayAction";
import { resetSuccess } from "../../../../redux/apiSlice/configSlice/config_get_slice/repPaySettingsSlice"
interface payScheduleProps {
    handleClose: () => void,
    editMode:boolean,
    editData:any,
    
}


const CreateReconcile:React.FC<payScheduleProps> = ({handleClose,editMode, editData}) => {
    const dispatch = useAppDispatch();
    const { isSuccess } = useAppSelector(state => state.reconcile)
    
    const [createReconcileData, setCreateReconcileData] = useState(
      {
          unique_id:editData?.unique_id || "",
          customer:editData?.customer || "",
          partner_name:editData?.partner_name || "",
          state:editData?.state_name || "",
          sys_size:editData?.sys_size || "",
          status:editData?.status || "",
          date:editData?.date || "",
          amount:editData?.amount || "",
          notes:editData?.notes || ""
           
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
    setCreateReconcileData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};

const handleChange = (newValue: any, fieldName: string) => {
  setCreateReconcileData((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
  }));
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
 
     const data = {
      unique_id: createReconcileData?.unique_id,
      customer: createReconcileData?.customer,
      partner_name:createReconcileData?.partner_name,
      state_name: createReconcileData.state,
      sys_size: parseInt(createReconcileData.sys_size),
      status: createReconcileData.status,
      date: createReconcileData.date,
      amount: parseInt(createReconcileData.amount),
      notes: createReconcileData.notes,
     }

    
 
  if(editMode){
    dispatch(updateReconcile({...data,record_id:editData?.record_id!}))
        }else{
          dispatch(
            createReconcile(data)
          );
        }

}

useEffect(() => {
  if (isSuccess) {
    handleClose()
  }

  return (() => {
    isSuccess && dispatch(resetSuccess())
  })
}, [isSuccess])

 
    return (
        <div className="transparent-model">
             <form  className="modal" onSubmit={handleSubmit}>

                <div className="createUserCrossButton" onClick={handleClose}>
                    <CROSS_BUTTON />

                </div>
             
                    <h3 className="createProfileText">{editMode===false?"Create Reconcile":"Update Reconcile"}</h3>
                
                  <div className="modal-body">
                  <div className="createProfileInputView">
                        <div className="createProfileTextView">
                        <div className="create-input-container">
                      <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Unique ID"
                      value={createReconcileData.unique_id}
                      name="unique_id"
                      placeholder={"Enter"}
                      onChange={(e) => handleInputChange(e)}
                     
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Customer Name"
                      value={createReconcileData.customer}
                      name="customer"
                      placeholder={"Enter"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <div className="create-input-field">
                                <label className="inputLabel-select">Parnter</label>
                                    <SelectOption
                                        options={partnerOption(newFormData)}
                                        onChange={(newValue) => handleChange(newValue, 'partner_name')}
                                        value={partnerOption(newFormData)?.find((option) => option.value === createReconcileData.partner_name)}
                                    />
                                </div>
                 
                </div>

             
                         
                <div className="create-input-container">
                   
                <div className="create-input-field">
                                <label className="inputLabel-select">ST</label>
                                    <SelectOption
                                        options={stateOption(newFormData)}
                                        onChange={(newValue) => handleChange(newValue, 'state')}
                                        value={stateOption(newFormData)?.find((option) => option.value === createReconcileData.state)}
                                    />
                                </div>
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Sys. Size"
                      value={createReconcileData.sys_size}
                      name="sys_size"
                      placeholder={"Enter"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>

                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Status"
                      value={createReconcileData.status}
                      name="status"
                      placeholder={"Enter"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>  
                </div>


                <div className="create-input-container">   
                <div className="create-input-field">
                    <Input
                      type={"date"}
                      label="Date"
                      value={createReconcileData.date}
                      name="date"
                      placeholder={"Enter"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>

                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Amount"
                      value={createReconcileData.amount}
                      name="amount"
                      placeholder={"Enter"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>

                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Notes"
                      value={createReconcileData.notes}
                      name="notes"
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

export default CreateReconcile;
