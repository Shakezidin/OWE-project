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
import { repPaySettingModel } from "../../../../core/models/configuration/create/repPaySettingModel";
import SelectOption from "../../../components/selectOption/SelectOption";

interface createRepPayProps {
    handleClose: () => void,
    editMode:boolean,
    
}


const CreateRepPaySettings:React.FC<createRepPayProps> = ({handleClose,editMode}) => {
    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [newFormData,setNewFormData] = useState<any>([])
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
    const [createRePayData, setCreatePayData] = useState<repPaySettingModel>(
        {
            name:"",
            state:"",
            pay_scale:"",
            position:"",
            be:"",
            start:"",
            end:"",
          }
    )


    const handleChange = (newValue: any, fieldName: string) => {
        setCreatePayData((prevData) => ({
            ...prevData,
            [fieldName]: newValue ? newValue.value : '',
        }));
    };
    const handlePayInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreatePayData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const [viewArchived, setViewArchived] = useState<boolean>(false);
    
  


   const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setSelectAllChecked(false);
  };



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
             
                    <h3 className="createProfileText">{editMode===false?"Rep Pay Settings":"Update RepPay Settings"}</h3>
                
                  <div className="modal-body">
                  <div className="createProfileInputView">
                        <div className="createProfileTextView">
                        <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Name"
                      value={createRePayData.name}
                      name="name"
                      placeholder={"Enter"}
                      onChange={(e) => handlePayInputChange(e)}
                    />
                  </div>
                  <div className="create-input-field">
                                <label className="inputLabel-select">ST</label>
                                    <SelectOption
                                        options={stateOption(newFormData)}
                                        onChange={(newValue) => handleChange(newValue, 'state')}
                                        value={stateOption(newFormData)?.find((option) => option.value === createRePayData.state)}
                                    />
                                </div>
                        <div className="create-input-field">
                          <Input
                          type={"text"}
                          label="Pay Scale"
                          value={createRePayData.pay_scale}
                          name="pay_scale"
                          placeholder={"Enter"}
                          onChange={(e) => handlePayInputChange(e)}
                    />
                  </div>
                 
                </div>

             
                         
                <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Position"
                      value={createRePayData.position}
                      name="position"
                      placeholder={"Enter"}
                      onChange={(e) => handlePayInputChange(e)}
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="BE"
                      value={createRePayData.be}
                      name="be"
                      placeholder={"Enter"}
                      onChange={(e) => handlePayInputChange(e)}
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={"date"}
                      label="Start"
                      value={createRePayData.start}
                      name="start"
                      placeholder={"Enter"}
                      onChange={(e) => handlePayInputChange(e)}
                    />
                  </div>
                 
                </div>

                <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={"date"}
                      label="End"
                      value={createRePayData.end}
                      name="end"
                      placeholder={"Enter"}
                      onChange={(e) => handlePayInputChange(e)}
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

export default CreateRepPaySettings;
