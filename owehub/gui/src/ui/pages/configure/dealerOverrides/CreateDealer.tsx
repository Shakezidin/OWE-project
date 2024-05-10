import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { useDispatch } from "react-redux";

import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import Select from "react-select";
import {
  dealerOption,
  subDealerOption,
} from "../../../../core/models/data_models/SelectDataModel";
import { updateDealerForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createDealerSlice";
import {
  dealer,
  subDealer,
} from "../../../../resources/static_data/StaticData";
import { DealerModel } from "../../../../core/models/configuration/create/DealerModel";
import SelectOption from "../../../components/selectOption/SelectOption";
import { errorSwal, successSwal } from "../../../components/alert/ShowAlert";
import { useAppDispatch } from "../../../../redux/hooks";
import { fetchDealer } from "../../../../redux/apiSlice/configSlice/config_get_slice/dealerSlice";
import { validateConfigForm } from "../../../../utiles/configFormValidation";
import {
  installerOption,
  partnerOption,
  salesTypeOption,
  stateOption,
} from "../../../../core/models/data_models/SelectDataModel";
interface dealerProps {
  handleClose: () => void;
  editMode: boolean;
  dealerData: DealerModel | null;
  page_number: number;
  page_size: number;
}

const CreateDealer: React.FC<dealerProps> = ({
  handleClose,
  editMode,
  page_number,
  page_size,
  dealerData,
}) => {
  const dispatch = useAppDispatch();

  const [createDealer, setCreateDealer] = useState<DealerModel>({
    record_id: dealerData ? dealerData?.record_id : 0,
    sub_dealer: dealerData ? dealerData?.sub_dealer : "",
    dealer: dealerData ? dealerData?.dealer : "",
    pay_rate: dealerData ? dealerData?.pay_rate : "",
    start_date: dealerData ? dealerData?.start_date : "",
    end_date: dealerData ? dealerData?.end_date : "",
    state:dealerData ? dealerData?.state : "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newFormData, setNewFormData] = useState<any>([]);
  const tableData = {
    tableNames: ["sub_dealer", "dealer", "states"],
  };
  const userType={
    role:"sub_dealer"
  }
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  const getUser = async () => {
    const res = await postCaller(EndPoints.get_user_by_role,userType);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getUser()
    getNewFormData();
  }, []);

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateDealer((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : "",
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: ''
    }));
  };
 
  const getnewformData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setCreateDealer((prev) => ({ ...prev, ...res.data }));
  };
  useEffect(() => {
    getnewformData();
  }, []);

  const handleDealerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateDealer((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };
  const page = {
    page_number:page_number,
    page_size: page_size,

  };
  const submitDealer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationRules = {
      sub_dealer: [{ condition: (value: any) => !!value, message: "Sub Dealer is required" }],
      dealer: [{ condition: (value: any) => !!value, message: "Dealer is required" }],
      pay_rate: [{ condition: (value: any) => !!value, message: "Pay rate is required" }],
      state: [{ condition: (value: any) => !!value, message: "State is required" }],
      start_date: [{ condition: (value: any) => !!value, message: "Start Date is required" }],
      end_date: [{ condition: (value: any) => !!value, message: "End Date is required" }],
  
    };
    const { isValid, errors } = validateConfigForm(createDealer!, validationRules);
    if (!isValid) {
      setErrors(errors);
      return;
    }
    try {
      dispatch(updateDealerForm(createDealer));
      if (createDealer.record_id) {
        const res = await postCaller(EndPoints.update_dealer, createDealer);
        if (res.status === 200) {
          await successSwal("", res.message, "success", 2000, false);
          handleClose();
          dispatch(fetchDealer(page))
        } else {
          await errorSwal("", res.message, "error", 2000, false);
        }
      } else {
        const { record_id, ...cleanedFormData } = createDealer;
        const res = await postCaller(EndPoints.create_dealer, cleanedFormData);
        if (res.status === 200) {
          await successSwal("", res.message, "success", 2000, false);
          handleClose();
          dispatch(fetchDealer(page))
        } else {
          await errorSwal("", res.message, "error", 2000, false);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
 

  return (
    <div className="transparent-model">
      <form onSubmit={(e) => submitDealer(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <span className="createProfileText">
          {editMode === false ? "Dealer Overrides" : "Update Dealer Overrides"}
        </span>
        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select select-type-label">Sub Dealer</label>
                  <SelectOption
                    options={subDealer}
                    onChange={(newValue) =>
                      handleChange(newValue, "sub_dealer")
                    }
                    value={
                      subDealer?.find(
                        (option) => option.value === createDealer.sub_dealer
                      )
                    }
                  />
                   {errors.sub_dealer && <span className="error">{errors.sub_dealer}</span>}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select select-type-label">Dealer</label>
                  <SelectOption
                    options={dealer}
                    onChange={(newValue) => handleChange(newValue, "dealer")}
                    value={
                      dealer?.find(
                        (option) => option.value === createDealer.dealer)}
                  />
                   {errors.dealer && <span className="error">{errors.dealer}</span>}
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
                   {errors.pay_rate && <span className="error">{errors.pay_rate}</span>}
                </div>
              
              </div>

              

              <div className="create-input-container">
              <div className="create-input-field">
                  <label className="inputLabel-select select-type-label">State</label>
                  <SelectOption
                    options={stateOption(createDealer)}
                    onChange={(newValue) => {
                      setCreateDealer((prev) => ({
                        ...prev,
                        state: newValue?.value!,
                      }));
                    }}
                    value={stateOption(createDealer)?.find(
                      (option) => option.value === createDealer.state
                    )}
                  />

                  {errors?.state && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.state}
                    </span>
                  )}
                </div>
              
      
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Start Date"
                    value={createDealer.start_date}
                    name="start_date"
                    placeholder={"Enter"}
                    onChange={(e) => handleDealerInputChange(e)}
                  />
                   {errors.start_date && <span className="error">{errors.start_date}</span>}
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
                   {errors.end_date && <span className="error">{errors.end_date}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="createUserActionButton">
          <ActionButton
            title={"Cancel"}
            type="reset"
            onClick={() => handleClose()}
          />
          <ActionButton
            title={editMode === false ? "Save" : "Update"}
            type="submit"
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateDealer;
