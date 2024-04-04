import React, { useEffect, useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";
import { updateTimeLineForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createTimeLineSlaSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";

import { useDispatch } from "react-redux";
import Select from 'react-select';
import { stateOption } from "../../../../core/models/data_models/SelectDataModel";
import { TimeLineSlaModel } from "../../../../core/models/configuration/create/TimeLineSlaModel";
type ButtonProps = {
    handleClose: () => void
}

const CreateTimeLine = (props: ButtonProps) => {
    const dispatch = useDispatch();

    const [createPayData, setCreatePayData] = useState<TimeLineSlaModel>(
        {
            record_id:0,
            type_m2m: "YourTypeM2MValue2",
            state: "Alabama",
            days: "10",
            start_date: "2024-04-01",
            end_date: "2024-04-10"
        }
    )
    const [newFormData,setNewFormData] = useState<any>([])
    const tableData = {
      tableNames: ["states"]
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
    const handleTimeLineInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreatePayData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submitTimeLineSla = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(updateTimeLineForm(createPayData));
            const res = await postCaller(EndPoints.create_timelinesla, createPayData);
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
                    <h3 className="createProfileText">TimeLine SLA</h3>
                <form onSubmit={(e)=>submitTimeLineSla(e)}>
                <div className="createProfileInputView">
                        <div className="createProfileTextView">
                            <div className="create-input-container">
                            <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Type/M2M"
                                        value={createPayData.type_m2m}
                                        name="type_m2m"
                                        placeholder={"Enter"}
                                        onChange={(e) => handleTimeLineInput(e)}
                                    />
                                </div>
                                <div className="create-input-field">
                                <label className="inputLabel">ST</label>
                                    <Select
                                        options={stateOption(newFormData)}
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
                                        onChange={(newValue) => handleChange(newValue, 'state')}
                                        value={stateOption(newFormData)?.find((option) => option.value === createPayData.state)}
                                    />
                                </div>
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Days"
                                        value={createPayData.days}
                                        name="days"
                                        placeholder={"Enter"}
                                        onChange={(e) => handleTimeLineInput(e)}
                                    />
                                </div>
                            </div>

                            <div className="create-input-container">
                               
                                <div className="create-input-field">
                                    <Input
                                        type={"date"}
                                        label="Start Date"
                                        value={createPayData.start_date}
                                        name="start_date"
                                        placeholder={"1/04/2004"}
                                        onChange={(e) => handleTimeLineInput(e)}
                                    />
                                </div>
                                <div className="create-input-field">
                                    <Input
                                        type={"date"}
                                        label="End Date"
                                        value={createPayData.end_date}
                                        name="end_date"
                                        placeholder={"10/04/2004"}
                                        onChange={(e) => handleTimeLineInput(e)}
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

export default CreateTimeLine;
