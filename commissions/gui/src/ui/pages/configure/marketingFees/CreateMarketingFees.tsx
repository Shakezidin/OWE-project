import React, { useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";

import { ActionButton } from "../../../components/button/ActionButton";
import Select from 'react-select';
import { chldlrData, dbaData, sourceData, stateData } from "../../../../core/models/data_models/SelectDataModel";
import { updateMarketingForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createMarketingSlice";
import { MarketingFeeModel } from "../../../../core/models/configuration/MarketingFeeModel";
import { useDispatch } from "react-redux";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
type ButtonProps = {
    handleClose: () => void
}

const CreateMarketingFees = (props: ButtonProps) => {
    const dispatch = useDispatch();

  const [createMarketing, setCreateMarketing] = useState<MarketingFeeModel>( 
    {
        source: "PRINT",
        dba: "Marketing DBA Name1",
        state: "Alabama",
        fee_rate: "100",
        chg_dlr: 100,   // Example integer value for ChgDlr
        pay_src: 200,   // Example integer value for PaySrc
        start_date: "2024-03-22",
        end_date: "2024-04-22",
        description: "Marketing Fee Description1"
      }
  )

 

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateMarketing((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
  };
  const handlemarketingInputChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateMarketing((prevData) => ({
      ...prevData,
      [name] : value,
    }));
  };

  const submitMarketingFees = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(updateMarketingForm(createMarketing));
      const res = await postCaller(EndPoints.create_marketingfee, createMarketing);
      if(res.status===200){
        alert(res.message)
        props.handleClose()
        window.location.reload()
      }
      else{
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
                    <h3 className="createProfileText">Marketing Fees</h3>
                 <form action="" onSubmit={(e)=>submitMarketingFees(e)}>
                 <div className="createProfileInputView">
                        <div className="createProfileTextView">
                            <div className="create-input-container">
                            <div className="create-input-field">
              <label className="inputLabel">Source</label>
              <Select
                      options={sourceData}
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
                      onChange={(newValue) => handleChange(newValue, 'source')}
                      value={sourceData.find((option) => option.value ===createMarketing.source )}
                    />
                </div>
                <div className="create-input-field">
              <label className="inputLabel">DBA</label>
              <Select
                      options={dbaData}
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
                      onChange={(newValue) => handleChange(newValue, 'dba')}
                      value={dbaData.find((option) => option.value ===createMarketing.dba )}
                    />
                </div>
                <div className="create-input-field">
              <label className="inputLabel">State</label>
              <Select
                      options={stateData}
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
                      value={stateData.find((option) => option.value ===createMarketing.state )}
                    />
                </div>
                            </div>

                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Fee Rate"
                                        value={createMarketing.fee_rate}
                                        name="fee_rate"
                                        placeholder={"Enter"}
                                        onChange={(e) => handlemarketingInputChange(e)}
                                    />
                                </div>
                                <div className="create-input-field">
              <label className="inputLabel">Chg DLR</label>
              <Select
                      options={chldlrData}
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
                      onChange={(newValue) => handleChange(newValue, 'chg_dlr')}
                      value={chldlrData.find((option) => option.value ===createMarketing.chg_dlr )}
                    />
                </div>
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Pay Src"
                                        value={createMarketing.pay_src}
                                        name=""
                                        placeholder={"Enter"}
                                        onChange={(e) => handlemarketingInputChange(e)}
                                    />
                                </div>


                            </div>
                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <Input
                                        type={"date"}
                                        label="Start Date"
                                        value={createMarketing.start_date}
                                        name=""
                                        placeholder={"1/04/2004"}
                                        onChange={(e) => handlemarketingInputChange(e)}
                                    />
                                </div>

                                <div className="create-input-field">
                                    <Input
                                        type={"date"}
                                        label="End Date"
                                        value={createMarketing.end_date}
                                        name=""
                                        placeholder={"10/04/2004"}
                                        onChange={(e) => handlemarketingInputChange(e)}
                                    />
                                </div>
                            </div>
                            
                                <div className="create-input-field-note">
                                    <label htmlFor="" className="inputLabel">Note</label> <br />
                                   <textarea name="description" id="" rows={4}
                                  onChange={(e) => handlemarketingInputChange(e)}
                                    value={createMarketing.description} placeholder="Type"></textarea>
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

export default CreateMarketingFees;
