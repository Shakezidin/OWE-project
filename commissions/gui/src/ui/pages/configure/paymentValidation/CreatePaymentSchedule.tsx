import React, { useEffect, useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";
import { updatePayForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createPayScheduleSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useDispatch } from "react-redux";

import { installerOption, partnerOption, salesTypeOption, stateOption, } from "../../../../core/models/data_models/SelectDataModel";
import Select from 'react-select';
import { partners, paySaleTypeData } from "../../../../resources/static_data/StaticData";
import { PayScheduleModel } from "../../../../core/models/configuration/create/PayScheduleModel";
interface payScheduleProps {
    handleClose: () => void,
    editMode:boolean,
    payEditedData:PayScheduleModel|null
}


const CreatePaymentSchedule:React.FC<payScheduleProps> = ({handleClose,editMode,payEditedData}) => {
    const dispatch = useDispatch();

    const [createPayData, setCreatePayData] = useState<PayScheduleModel>(
        {
            record_id:0,
            partner: "Shushank Sharma",
            partner_name: "FFS",
            installer_name: "OWE",
            sale_type: "BATTERY",
            state: "Alabama",
            rl: "40",
            draw: "50%",
            draw_max: "50%",
            rep_draw: "2000.00",
            rep_draw_max: "2000.00",
            rep_pay: "Yes",
            start_date: "2024-04-01",
            end_date: "2024-04-30"
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
            const res = await postCaller(EndPoints.create_paymentschedule, createPayData);
            if (res?.status === 200) {
                alert(res.message)
                handleClose()
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

                <div className="createUserCrossButton" onClick={handleClose}>
                    <CROSS_BUTTON />

                </div>
                <div className="createUserContainer">
                    <h3 className="createProfileText">{editMode===false?"Payment Schedule":"Update Payment Schedule"}</h3>
                   <form onSubmit={(e)=>submitPaySchedule(e)}>
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
                                <label className="inputLabel">Partner</label>
                                    <Select
                                        options={partnerOption(newFormData)}
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
                                        isSearchable
                                        onChange={(newValue) => handleChange(newValue, 'partner')}
                                        value={partnerOption(newFormData)?.find((option) => option.value === createPayData.partner)}
                                    />
                                </div>
                                <div className="create-input-field">
                                <label className="inputLabel">Installer</label>
                                    <Select
                                        options={installerOption(newFormData)}
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
                                        onChange={(newValue) => handleChange(newValue, 'installer_name')}
                                        value={installerOption(newFormData)?.find((option) => option.value === createPayData.installer_name)}
                                    />
                                </div>
                            </div>

                            <div className="create-input-container">
                                <div className="create-input-field">
                                <label className="inputLabel">Sales Type</label>
                                    <Select
                                        options={salesTypeOption(newFormData)||paySaleTypeData}
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
                                        onChange={(newValue) => handleChange(newValue, 'sale_type')}
                                        value={salesTypeOption(newFormData)||paySaleTypeData?.find((option) => option.value === createPayData.sale_type)}
                                    />
                                </div>
                                <div className="create-input-field">
                                <label className="inputLabel">ST</label>
                                    <Select
                                        options={stateOption(newFormData)}
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
                                        isSearchable
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

export default CreatePaymentSchedule;
