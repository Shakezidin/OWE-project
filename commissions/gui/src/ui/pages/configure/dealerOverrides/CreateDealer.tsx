import React, { useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";
import { useDispatch } from "react-redux";
import { DealerModel } from "../../../../core/models/configuration/DealerModel";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import Select from 'react-select';
import { dealer, subDealer } from "../../../../core/models/data_models/SelectDataModel";
import { updateDealerForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createDealerSlice";

type ButtonProps = {
  handleClose: () => void
}

const CreateDealer = (props: ButtonProps) => {
  const dispatch = useDispatch();

  const [createDealer, setCreateDealer] = useState<DealerModel>( 
    {
      sub_dealer: "Sub Dealer Name1",
      dealer: "Shushank Sharma",
      pay_rate: "500",
      start_date: "2024-04-01",
      end_date: "2024-04-30"
  }
  )

 

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateDealer((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
  };
  const handleDealerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateDealer((prevData) => ({
      ...prevData,
      [name] : value,
    }));
  };

  const submitDealer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(updateDealerForm(createDealer));
      const res = await postCaller(EndPoints.create_dealer, createDealer);
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
          <span className="createProfileText">Dealer Overrides</span>
        <form onSubmit={(e)=>submitDealer(e)}>
        <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
              <div className="create-input-field">
              <label className="inputLabel">Sub Dealer</label>
              <Select
                      options={subDealer}
                      isSearchable
                      onChange={(newValue) => handleChange(newValue, 'sub_dealer')}
                      value={subDealer.find((option) => option.value ===createDealer.sub_dealer )}
                    />
                </div>
                <div className="create-input-field">
                <label className="inputLabel">Dealer</label>
                <Select
                      options={dealer}
                      isSearchable
                      onChange={(newValue) => handleChange(newValue, 'dealer')}
                      value={dealer.find((option) => option.value === createDealer.dealer)}
                    />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Pay Rate"
                    name="pay_rate"
                    value={createDealer.pay_rate}
                    placeholder={"Enter"}
                    onChange={(e) => handleDealerInputChange(e)}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Start Date"
                    value={createDealer.start_date}
                    name="start_date"
                    placeholder={"Enter"}
                    onChange={(e) => handleDealerInputChange(e)}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="End Date"
                    name="end_date"
                    value={createDealer.end_date}
                    placeholder={"Enter"}
                    onChange={(e) => handleDealerInputChange(e)}
                  />
                </div>


              </div>
            </div>
            <div className="createUserActionButton">
              <ActionButton title={"Create"} type="submit"
                onClick={() => { }} />
            </div>

          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDealer;
