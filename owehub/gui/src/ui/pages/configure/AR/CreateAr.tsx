import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";

import { ActionButton } from "../../../components/button/ActionButton";
import { updatePayForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createPayScheduleSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  installerOption,
  partnerOption,
  salesTypeOption,
  stateOption,
} from "../../../../core/models/data_models/SelectDataModel";
import Select from "react-select";
import { createAr, updateAr } from "../../../../redux/apiActions/arConfigAction";
import { paySaleTypeData } from "../../../../resources/static_data/StaticData";
import { PayScheduleModel } from "../../../../core/models/configuration/create/PayScheduleModel";
import SelectOption from "../../../components/selectOption/SelectOption";
import { validateConfigForm } from "../../../../utiles/configFormValidation";
import { resetSuccess } from "../../../../redux/apiSlice/configSlice/config_get_slice/arSlice";
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData:any
}

const CreatedAr: React.FC<payScheduleProps> = ({ handleClose, editMode, editData }) => {
  const dispatch = useAppDispatch();
  const { isSuccess } = useAppSelector(state => state.ar)

  const [createArData, setCreateArData] = useState({
    // customer_name:editData?.customer_name || "",
    unique_id:editData?.unique_id || "",
    date: editData?.date || "",
    amount:editData?.amount || "",
    payment_type:editData?.payment_type || "",
    bank: editData?.bank || "",
    ced:editData?.ced || "",


  });

  const [newFormData, setNewFormData] = useState<any>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const tableData = {
    tableNames: ["partners", "states", "installers", "sale_type"],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateArData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationRules = {
      unique_id: [{ condition: (value: any) => !!value, message: "Unique Id is required" }],
      date: [{ condition: (value: any) => !!value, message: "Date is required" }],
      amount: [{ condition: (value: any) => !!value, message: "Amount is required" }],
      payment_type: [{ condition: (value: any) => !!value, message: "Payment Type is required" }],
      bank: [{ condition: (value: any) => !!value, message: "Bank is required" }],
      ced: [{ condition: (value: any) => !!value, message: "Ced is required" }],
  
    };
    const { isValid, errors } = validateConfigForm(createArData!, validationRules);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    if(editMode){
      dispatch(updateAr({...createArData,record_id:editData?.record_id!}))
    } else{
      dispatch(createAr({
        unique_id:createArData.unique_id,
        amount: parseFloat(createArData.amount),
        date:createArData.date,
        payment_type:createArData.payment_type,
        bank:createArData.bank,
        ced:createArData.ced

      }))
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
       
    }
    return () => {
      isSuccess && dispatch(resetSuccess());
    };
  }, [isSuccess]);

  return (
    <div className="transparent-model">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? "Create AR" : "Update AR"}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
 
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Unique ID"
                    value={createArData.unique_id}
                    name="unique_id"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                   {errors.unique_id && <span className="error">{errors.unique_id}</span>}
                </div>
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Date"
                    value={createArData.date}
                    name="date"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                   {errors.date && <span className="error">{errors.date}</span>}
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Amount"
                    value={createArData.amount}
                    name="amount"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                   {errors.amount && <span className="error">{errors.amount}</span>}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Payment Type"
                    value={createArData.payment_type}
                    name="payment_type"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                   {errors.payment_type && <span className="error">{errors.payment_type}</span>}
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Bank"
                    value={createArData.bank}
                    name="bank"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                   {errors.bank && <span className="error">{errors.bank}</span>}
                </div>
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="CED"
                    value={createArData.ced}
                    name="ced"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                   {errors.ced && <span className="error">{errors.ced}</span>}
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

export default CreatedAr;
