import React, { useEffect, useState } from "react";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { updateTierLoanForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createTierLoanFeeSlice";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useDispatch } from "react-redux";
import Select from 'react-select';
import { installerOption, oweCostOption, stateOption, loanOption } from "../../../../core/models/data_models/SelectDataModel";
import { TierLoanFeeModel } from "../../../../core/models/configuration/create/TierLoanFeeModel";
import SelectOption from "../../../components/selectOption/SelectOption";
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
      dealer_tier: tierEditedData? tierEditedData?.dealer_tier:"",
      installer: tierEditedData? tierEditedData?.installer:"",
      state:tierEditedData? tierEditedData?.state: "",
      finance_type:tierEditedData? tierEditedData?.finance_type: "",
      owe_cost:tierEditedData? tierEditedData?.owe_cost: "",
      dlr_mu: tierEditedData? tierEditedData?.dlr_mu:"",
      dlr_cost: tierEditedData? tierEditedData?.dlr_cost:"",
      start_date:tierEditedData? tierEditedData?.start_date: "",
      end_date:tierEditedData? tierEditedData?.end_date: ""
    }
  )
  const [newFormData, setNewFormData] = useState<any>([])
  const tableData = {
    tableNames: ["partners", "states", "installers", "owe_cost", "loan_type"]
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
        console.log(res?.message)
        handleClose()
        window.location.reload()
      }
      else {
        console.log(res.message)
      }
    }
    else{
      const { record_id, ...cleanedFormData } = createTier;
      const res = await postCaller(EndPoints.create_tierloanfee, cleanedFormData);
      if (res?.status === 200) {
        console.log(res?.message)
        handleClose()
        window.location.reload()
      }
      else {
        console.log(res.message) 
      }
    }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className="transparent-model">
      <form onSubmit={(e) => submitTierLoad(e)} className="modal">

        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />

        </div>
      
          <h3 className="createProfileText">{editMode===false?"Create Tier Loan Fee":"Update Tier Loan Fee"}</h3>
        
          <div className="modal-body">
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
                    <label className="inputLabel-select">Installer</label>
                    <SelectOption
                      options={installerOption(newFormData)}
                      onChange={(newValue) => handleChange(newValue, 'installer')}
                      value={installerOption(newFormData)?.find((option) => option.value === createTier.installer)}
                    />
                  </div>
                  <div className="create-input-field">
                    <label className="inputLabel-select">State</label>
                    <SelectOption
                      options={stateOption(newFormData)}
                     
                      onChange={(newValue) => handleChange(newValue, 'state')}
                      value={stateOption(newFormData)?.find((option) => option.value === createTier.state)}
                    />
                  </div>
                </div>

                <div className="create-input-container">
                <div className="create-input-field">
                    <label className="inputLabel-select select-type-label">Loan Type</label>
                    <SelectOption
                    menuListStyles={{height: "230px"}}
                      options={loanOption(newFormData)}
                      onChange={(newValue) => handleChange(newValue, 'finance_type')}
                      value={loanOption(newFormData)?.find((option) => option.value === createTier.finance_type)}
                    />
                  </div>
                  <div className="create-input-field">
                    <label className="inputLabel-select select-type-label">OWE Cost</label>
                    <SelectOption
                    menuListStyles={{height: "230px"}}
                      options={oweCostOption(newFormData)}
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
                      value={createTier.end_date}
                      name="end_date"
                      placeholder={"10/04/2004"}
                      onChange={(e) => handleTierChange(e)}
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

export default CreateTierLoan;
