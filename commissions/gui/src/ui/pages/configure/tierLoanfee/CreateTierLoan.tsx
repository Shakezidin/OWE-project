import React, { useEffect, useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import DropdownButton from "../../../components/dropdown/DropdownButton";
import { ActionButton } from "../../../components/button/ActionButton";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { updateTierLoanForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createTierLoanFeeSlice";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useDispatch } from "react-redux";

import Select from 'react-select';
import { installerOption, oweCostOption, stateOption } from "../../../../core/models/data_models/SelectDataModel";
import { installers } from "../../../../resources/static_data/StaticData";
import { TierLoanFeeModel } from "../../../../core/models/configuration/create/TierLoanFeeModel";
interface tierLoanProps{
  handleClose: () => void,
  tierEditedData:TierLoanFeeModel|null,
  editMode:boolean,
}
const CreateTierLoan:React.FC<tierLoanProps> = ({handleClose,tierEditedData,editMode}) => {
  const dispatch = useDispatch();

  const [createTier, setCreateTier] = useState<TierLoanFeeModel>(
    {
      record_id: tierEditedData? tierEditedData?.record_id:0,
      dealer_tier: tierEditedData? tierEditedData?.dealer_tier:"TierName123",
      installer: tierEditedData? tierEditedData?.installer:"PartnerABC",
      state:tierEditedData? tierEditedData?.state: "Alabama",
      finance_type:tierEditedData? tierEditedData?.finance_type: "1",
      owe_cost:tierEditedData? tierEditedData?.owe_cost: "1000",
      dlr_mu: tierEditedData? tierEditedData?.dlr_mu:"0.5",
      dlr_cost: tierEditedData? tierEditedData?.dlr_cost:"500",
      start_date:tierEditedData? tierEditedData?.start_date: "2024-04-01",
      end_date:tierEditedData? tierEditedData?.end_date: "2024-12-31"
    }
  )
  const [newFormData, setNewFormData] = useState<any>([])
  const tableData = {
    tableNames: ["partners", "states", "installers", "owe_cost"]
  }
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData)
    setNewFormData(res.data)

  }
  useEffect(() => {
    getNewFormData()
  }, [])



  const handleChange = (newValue: any, fieldName: string) => {
    setCreateTier((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : '',
    }));
  };
  const handleTierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateTier((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitTierLoad = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(updateTierLoanForm(createTier));
    if(createTier.record_id){
     
      const res = await postCaller(EndPoints.update_tierloanfee, createTier);
      if (res?.status === 200) {
        alert(res?.message)
        handleClose()
        window.location.reload()
      }
      else {
        alert(res.message)
      }
    }
    else{
      const { record_id, ...cleanedFormData } = createTier;
      const res = await postCaller(EndPoints.create_tierloanfee, cleanedFormData);
      if (res?.status === 200) {
        alert(res?.message)
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
          <h3 className="createProfileText">{editMode===false?"Tier Loan Fee":"Update Tier Loan Fee"}</h3>
          <form onSubmit={(e) => submitTierLoad(e)}>
            <div className="createProfileInputView">
              <div className="createProfileTextView">
                <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Dealer Tier"
                      value={createTier.dealer_tier}
                      name="dealer_tier"
                      placeholder={"Enter"}
                      onChange={(e) => handleTierChange(e)}
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
                          marginTop: "4.5px",
                          borderRadius: "8px",
                          outline: "none",
                          height: "2.25rem",
                          fontSize:"13px",
                          border: "1px solid #d0d5dd"

                        }),
                      }}
                      onChange={(newValue) => handleChange(newValue, 'installer')}
                      value={installerOption(newFormData)?.find((option) => option.value === createTier.installer)}
                    />
                  </div>
                  <div className="create-input-field">
                    <label className="inputLabel">State</label>
                    <Select
                      options={stateOption(newFormData)}
                      isSearchable
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          marginTop: "4.5px",
                          borderRadius: "8px",
                          outline: "none",
                          height: "2.25rem",
                          fontSize:"13px",
                          border: "1px solid #d0d5dd"

                        }),
                      }}
                      onChange={(newValue) => handleChange(newValue, 'state')}
                      value={stateOption(newFormData)?.find((option) => option.value === createTier.state)}
                    />
                  </div>
                </div>

                <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Finance Type Name"
                      value={createTier.finance_type}
                      name="finance_type"
                      placeholder={"Enter"}
                      onChange={(e) => handleTierChange(e)}
                    />
                  </div>
                  <div className="create-input-field">
                    <label className="inputLabel">OWE Cost</label>
                    <Select
                      options={oweCostOption(newFormData)}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          marginTop: "4.5px",
                          borderRadius: "8px",
                          outline: "none",
                          height: "2.25rem",
                          fontSize:"13px",
                          border: "1px solid #d0d5dd"

                        }),
                      }}
                      isSearchable
                      onChange={(newValue) => handleChange(newValue, 'owe_cost')}
                      value={oweCostOption(newFormData)?.find((option) => option.value === createTier.owe_cost)}
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Dealer MU"
                      value={createTier.dlr_mu}
                      name="dlr_mu"
                      placeholder={"Enter"}
                      onChange={(e) => handleTierChange(e)}
                    />
                  </div>
                </div>
                <div className="create-input-container">
                  <div className="create-input-field">
                    <Input
                      type={"text"}
                      label="Dealer Cost"
                      value={createTier.dlr_cost}
                      name="dlr_cost"
                      placeholder={"Enter"}
                      onChange={(e) => handleTierChange(e)}
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={"date"}
                      label="Start Date"
                      value={createTier.start_date}
                      name="start_date"
                      placeholder={"1/04/2004"}
                      onChange={(e) => handleTierChange(e)}
                    />
                  </div>
                  <div className="create-input-field">
                    <Input
                      type={"date"}
                      label="End Date"
                      value={createTier.start_date}
                      name="start_date"
                      placeholder={"10/04/2004"}
                      onChange={(e) => handleTierChange(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="createUserActionButton">
              <ActionButton title={"Cancel"} type="reset"
                  onClick={() => handleClose()} />
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

export default CreateTierLoan;
