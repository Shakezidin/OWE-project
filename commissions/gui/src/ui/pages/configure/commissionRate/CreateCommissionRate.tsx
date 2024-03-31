import React, { useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";
import { CommissionModel } from "../../../../core/models/configuration/CommissionModel";
import { useDispatch, useSelector } from 'react-redux';
import { updateForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createCommissionSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import Select from 'react-select';
import { installers, partners, respTypeData, statData } from "../../../../core/models/data_models/SelectDataModel";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
type ButtonProps = {
  handleClose: () => void
}

const CreateCommissionRate = (props: ButtonProps) => {
  const dispatch = useDispatch();
  const [createCommission, setCreateCommission] = useState<CommissionModel>(
    {
      partner: "OWE",
      installer: "OWE",
      state: "Alaska",
      sale_type: "BATTERY",
      sale_price: 1500.0,
      rep_type: "EMPLOYEE",
      rl: 0.5,
      rate: 0.1,
      start_date: "2024-04-01",
      end_date: "2024-06-30"
    }
  )

  const customStyle = {
    select: {
      // padding:".5rem",
      height: 10
    }
  }

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateCommission((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateCommission((prevData) => ({
      ...prevData,
      [name]: name === 'rl' || name === 'sale_price' || name === 'rate' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(createCommission)
      dispatch(updateForm(createCommission));
      const res = await postCaller(EndPoints.create_commission, createCommission);
      if(res.status===200){
        alert(res.message)
        props.handleClose()
        window.location.reload()
      }
      else{
        alert(res.message)
      }
      // dispatch(resetForm());
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  console.log(typeof createCommission.rl)

  return (
    <div className="transparent-model">
      <div className="modal">

        <div className="createUserCrossButton" onClick={props.handleClose}>
          <CROSS_BUTTON />

        </div>
        <div className="createUserContainer">
          <h3 className="createProfileText">Commission Rate</h3>
          <form action="" onSubmit={(e) => handleSubmit(e)}>
            <div className="createProfileInputView">
              <div className="createProfileTextView">
                <div className="create-input-container">
                  <div className="create-input-field">
                    <label className="inputLabel">Partner</label>
                    <Select
                      options={partners}
                      isSearchable
                      defaultValue={partners[0]}
                      onChange={(newValue) => handleChange(newValue, 'partner')}
                      value={partners.find((option) => option.value === createCommission.partner)}
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
                    />
                  </div>
                  <div className="create-input-field">
                    <label className="inputLabel">Installer</label>
                    <div className="" style={customStyle.select}>
                      <Select
                        options={installers}
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
                        onChange={(newValue) => handleChange(newValue, 'installer')}
                        value={installers.find((option) => option.value === createCommission.installer)}
                      />
                    </div>
                  </div>
                  <div className="create-input-field">
                    <label className="inputLabel">Partner</label>
                    <Select
                      options={statData}
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
                      // options={statData}
                      onChange={(newValue) => handleChange(newValue, 'state')}
                      value={statData.find((option) => option.value === createCommission.state)}
                    />
                  </div>
                </div>

                <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Sales Type"
                      value={createCommission.sale_type}
                      name="sale_type"
                      placeholder={"Sales Type"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={"number"}
                      label="Sales Price"
                      value={createCommission.sale_price}
                      name="sale_price"
                      placeholder={"sale price"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <div className="create-input-field">
                    <label className="inputLabel">Representative Type</label>
                    <Select
                      options={respTypeData}
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
                      // options={partners}
                      onChange={(newValue) => handleChange(newValue, 'rep_type')}
                      value={respTypeData.find((option) => option.value === createCommission.rep_type)}
                    />
                  </div>
                </div>
                <div className="create-input-container">
                  <div className="rate-input-container">
                    <div className="rate-input-field">
                      <Input
                        type={"number"}
                        label="Rate"
                        value={createCommission.rate}
                        name="rate"
                        placeholder={"Rate"}
                        onChange={(e) => handleInputChange(e)}
                      />
                    </div>
                    <div className="rate-input-field">
                      <Input
                        type={"number"}
                        label="Rate List"
                        value={createCommission.rl}
                        name="rl"
                        placeholder={"Rate List"}
                        onChange={(e) => handleInputChange(e)}
                      />
                    </div>
                  </div>
                  <div className="start-input-container" >
                    <div className="rate-input-field">
                      <Input
                        type={"date"}
                        label="Start Date"
                        value={createCommission.start_date}
                        name="start_date"
                        placeholder={"1/04/2004"}
                        onChange={(e) => handleInputChange(e)}
                      />
                    </div>
                    <div className="rate-input-field" >
                      <Input
                        type={"date"}
                        label="End Date"
                        value={createCommission.end_date}
                        name="end_date"
                        placeholder={"10/04/2004"}
                        onChange={(e) => handleInputChange(e)}
                      />
                    </div>
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

export default CreateCommissionRate;
