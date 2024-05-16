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
    payEditedData:PayScheduleModel|null
}


const CreatePaymentSchedule:React.FC<payScheduleProps> = ({handleClose,editMode,payEditedData}) => {
    const dispatch = useDispatch();

    const [createPayData, setCreatePayData] = useState<PayScheduleModel>(
        {
            record_id: payEditedData? payEditedData?.record_id: 0,
            partner: payEditedData? payEditedData?.partner: "Shushank Sharma",
            partner_name:payEditedData? payEditedData?.partner_name: "FFS",
            installer_name: payEditedData? payEditedData?.installer_name:"OWE",
            sale_type: payEditedData? payEditedData?.sale_type:"BATTERY",
            state: payEditedData? payEditedData?.state:"Alabama",
            rl: payEditedData? payEditedData?.rl:"40",
            draw:payEditedData? payEditedData?.draw: "50%",
            draw_max: payEditedData? payEditedData?.draw_max:"50%",
            rep_draw:payEditedData? payEditedData?.rep_draw: "2000.00",
            rep_draw_max:payEditedData? payEditedData?.rep_draw_max: "2000.00",
            rep_pay:payEditedData? payEditedData?.rep_pay: "Yes",
            start_date: payEditedData? payEditedData?.start_date:"2024-04-01",
            end_date: payEditedData? payEditedData?.end_date:"2024-04-30"
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

    const submitPaySchedule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(updatePayForm(createPayData));
            if(createPayData.record_id){
             
                const res = await postCaller(EndPoints.update_paymentschedule, createPayData);
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
                const { record_id, ...cleanedFormData } = createPayData;
                const res = await postCaller(EndPoints.create_paymentschedule, cleanedFormData);
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
             <form onSubmit={(e)=>submitPaySchedule(e)} className="modal">

                <div className="createUserCrossButton" onClick={handleClose}>
                    <CROSS_BUTTON />

                </div>
             
                    <h3 className="createProfileText">{editMode===false?"Payment Schedule":"Update Payment Schedule"}</h3>
                
                  <div className="modal-body">
                  <div className="createProfileInputView">
                        <div className="createProfileTextView">
                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Partner Name"
                                        value={createPayData.partner_name}
                                        name="partner_name"
                                        placeholder={"Enter"}
                                        onChange={(e) => handlePayInputChange(e)}
                                    />
                                </div>
                                <div className="create-input-field">
                                <label className="inputLabel-select">Partner</label>
                                    <SelectOption
                                        options={partnerOption(newFormData)}
                                        onChange={(newValue) => handleChange(newValue, 'partner')}
                                        value={partnerOption(newFormData)?.find((option) => option.value === createPayData.partner)}
                                    />
                                </div>
                                <div className="create-input-field">
                                <label className="inputLabel-select">Installer</label>
                                    <SelectOption
                                        options={installerOption(newFormData)}
                                        onChange={(newValue) => handleChange(newValue, 'installer_name')}
                                        value={installerOption(newFormData)?.find((option) => option.value === createPayData.installer_name)}
                                    />
                                </div>
                            </div>

                            <div className="create-input-container">
                                <div className="create-input-field">
                                <label className="inputLabel-select select-type-label">Sales Type</label>
                                    <SelectOption
                                    menuListStyles={{height: "230px"}}
                                        options={salesTypeOption(newFormData)}
                                        onChange={(newValue) => handleChange(newValue, 'sale_type')}
                                        value={salesTypeOption(newFormData)?.find((option) => option.value === createPayData.sale_type)}
                                    />
                                </div>
                                <div className="create-input-field">
                                <label className="inputLabel-select select-type-label">State</label>
                                    <SelectOption
                                    menuListStyles={{height: "230px"}}
                                        options={stateOption(newFormData)}
                                        onChange={(newValue) => handleChange(newValue, 'state')}
                                        value={stateOption(newFormData)?.find((option) => option.value === createPayData.state)}
                                    />
                                </div>
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Rate List"
                                        value={createPayData.rl}
                                        name="rl"
                                        placeholder={"Enter"}
                                        onChange={(e) => handlePayInputChange(e)}
                                    />
                                </div>
                            </div>
                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Draw"
                                        value={createPayData.draw}
                                        name="draw"
                                        placeholder={"Enter"}
                                        onChange={(e) => handlePayInputChange(e)}
                                    />
                                </div>
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Draw Max"
                                        value={createPayData.draw_max}
                                        name="draw_max"
                                        placeholder={"Enter"}
                                        onChange={(e) => handlePayInputChange(e)}
                                    />
                                </div>
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Rep. Draw"
                                        value={createPayData.rep_draw}
                                        name="rep_draw"
                                        placeholder={"Enter"}
                                        onChange={(e) => handlePayInputChange(e)}
                                    />
                                </div>


                            </div>
                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Rep. Max Draw"
                                        value={createPayData.rep_draw_max}
                                        name="rep_draw_max"
                                        placeholder={"Enter"}
                                        onChange={(e) => handlePayInputChange(e)}
                                    />
                                </div>

                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Rep. Pay"
                                        value={createPayData.rep_pay}
                                        name="rep_pay"
                                        placeholder={"Enter"}
                                        onChange={(e) => handlePayInputChange(e)}
                                    />
                                </div>

                                <div className="create-input-field">
                                    <Input
                                        type={"date"}
                                        label="Start Date"
                                        value={createPayData.start_date}
                                        name="start_date"
                                        placeholder={"1/04/2004"}
                                        onChange={(e) => handlePayInputChange(e)}
                                    />
                                </div>
                               
                            </div>
                            <div className="create-input-container">
                            <div className="create-input-field">
                                    <Input
                                        type={"date"}
                                        label="End Date"
                                        value={createPayData.end_date}
                                        name="end_date"
                                        placeholder={"1/04/2004"}
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

export default CreatePaymentSchedule;
