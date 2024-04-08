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
interface timeLineProps {
    handleClose: () => void,
    editMode:boolean,
    timeLineSlaData:TimeLineSlaModel|null
}
const CreateTimeLine:React.FC<timeLineProps> = ({handleClose,editMode,timeLineSlaData}) => {
    const dispatch = useDispatch();
  console.log(timeLineSlaData)
    const [createTimeLine, setCreateTimeLine] = useState<TimeLineSlaModel>(
        {
            record_id:timeLineSlaData? timeLineSlaData?.record_id: 0,
            type_m2m:timeLineSlaData? timeLineSlaData?.type_m2m: "YourTypeM2MValue2",
            state: timeLineSlaData? timeLineSlaData?.state: "Alabama",
            days: timeLineSlaData? timeLineSlaData?.days: "10",
            start_date: timeLineSlaData? timeLineSlaData?.start_date: "2024-04-01",
            end_date:timeLineSlaData? timeLineSlaData?.end_date: "2024-04-10"
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
        setCreateTimeLine((prevData) => ({
            ...prevData,
            [fieldName]: newValue ? newValue.value : '',
        }));
    };
    const handleTimeLineInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreateTimeLine((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submitTimeLineSla = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            dispatch(updateTimeLineForm(createTimeLine));
          if(createTimeLine.record_id){
        
            const res = await postCaller(EndPoints.update_timelinesla, createTimeLine);
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
            const { record_id, ...cleanedFormData } = createTimeLine;
            const res = await postCaller(EndPoints.create_timelinesla, cleanedFormData);
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
            <div className="modal">

                <div className="createUserCrossButton" onClick={handleClose}>
                    <CROSS_BUTTON />

                </div>
                <div className="createUserContainer">
                    <h3 className="createProfileText">{editMode===false?"TimeLine SLA":"Update TimeLine SLA"}</h3>
                <form onSubmit={(e)=>submitTimeLineSla(e)}>
                <div className="createProfileInputView">
                        <div className="createProfileTextView">
                            <div className="create-input-container">
                            <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Type/M2M"
                                        value={createTimeLine.type_m2m}
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
                                        value={stateOption(newFormData)?.find((option) => option.value === createTimeLine.state)}
                                    />
                                </div>
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Days"
                                        value={createTimeLine.days}
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
                                        value={createTimeLine.start_date}
                                        name="start_date"
                                        placeholder={"1/04/2004"}
                                        onChange={(e) => handleTimeLineInput(e)}
                                    />
                                </div>
                                <div className="create-input-field">
                                    <Input
                                        type={"date"}
                                        label="End Date"
                                        value={createTimeLine.end_date}
                                        name="end_date"
                                        placeholder={"10/04/2004"}
                                        onChange={(e) => handleTimeLineInput(e)}
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

export default CreateTimeLine;
