import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";

import { ActionButton } from "../../../components/button/ActionButton";
import { updatePayForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createPayScheduleSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useDispatch } from "react-redux";
import {
  installerOption,
  partnerOption,
  salesTypeOption,
  stateOption,
} from "../../../../core/models/data_models/SelectDataModel";
import Select from "react-select";
import {
  partners,
  paySaleTypeData,
} from "../../../../resources/static_data/StaticData";
import { ReconcileModel } from "../../../../core/models/configuration/create/ReconcileModel";
import SelectOption from "../../../components/selectOption/SelectOption";
import {
  createReconcile,
  updateReconcile,
} from "../../../../redux/apiActions/reconcileAction";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  fetchRepaySettings,
  RepayEditParams,
} from "../../../../redux/apiActions/repPayAction";
import { resetSuccess } from "../../../../redux/apiSlice/configSlice/config_get_slice/reconcileSlice";
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: any;
}

const CreateReconcile: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess } = useAppSelector((state) => state.reconcile);

  const [createReconcileData, setCreateReconcileData] = useState({
    unique_id: editData?.unique_id || "",
    customer: editData?.customer || "",
    partner_name: editData?.partner_name || "",
    state: editData?.state_name || "",
    sys_size: editData?.sys_size || "",
    status: editData?.status || "",
    start_date: editData?.start_date || "",
    end_date: editData?.end_date || "",
    amount: editData?.amount || "",
    notes: editData?.notes || "",
  });
  const [errors, setErrors] = useState<typeof createReconcileData>({} as typeof createReconcileData);
  const [newFormData, setNewFormData] = useState<any>([]);

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
    if (name === "end_date") {
      if (createReconcileData.start_date && value < createReconcileData.start_date) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          end_date: "End date cannot be before the start date",
        }));
        return;
      }
    }
    if (name === "amount"||name==="sys_size") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setCreateReconcileData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
      return;
    }
    setCreateReconcileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateReconcileData((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : "",
    }));
  };

  const handleValidation = () => {
    const error: any = {} ;
    for (const key in createReconcileData) {
      if (tableData.tableNames.includes(key)) {
        continue
      }
      if (!createReconcileData[key as keyof typeof createReconcileData]) {
        error[
          key as keyof typeof createReconcileData
        ] = `${key.toLocaleLowerCase().replace("_"," ")} is required`;
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
if (handleValidation()) {
  const data = {
    unique_id: createReconcileData?.unique_id,
    customer: createReconcileData?.customer,
    partner_name: createReconcileData?.partner_name,
    state_name: createReconcileData.state,
    sys_size: parseInt(createReconcileData.sys_size),
    status: createReconcileData.status,
    start_date: createReconcileData.start_date,
    end_date: createReconcileData.end_date,
    amount: parseInt(createReconcileData.amount),
    notes: createReconcileData.notes,
  };

  if (editMode) {
    dispatch(updateReconcile({ ...data, record_id: editData?.record_id! }));
  } else {
    dispatch(createReconcile(data));
  }
}
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      dispatch(resetSuccess());
    }
  }, [isSuccess]);

  return (
    <div className="transparent-model">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? "Create Reconcile" : "Update Reconcile"}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Unique ID"
                    value={createReconcileData.unique_id}
                    name="unique_id"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.unique_id && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.unique_id}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Customer Name"
                    value={createReconcileData.customer}
                    name="customer"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                   {errors?.customer && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.customer}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">Partner</label>
                  <SelectOption
                    options={partnerOption(newFormData)}
                    onChange={(newValue) =>
                      handleChange(newValue, "partner_name")
                    }
                    value={partnerOption(newFormData)?.find(
                      (option) =>
                        option.value === createReconcileData.partner_name
                    )}
                  />
                     {errors?.partner_name && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.partner_name}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select select-type-label">State</label>
                  <SelectOption
                  menuListStyles={{height: "230px"}}
                    options={stateOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, "state")}
                    value={stateOption(newFormData)?.find(
                      (option) => option.value === createReconcileData.state
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
                    type={"text"}
                    label="Sys. Size"
                    value={createReconcileData.sys_size}
                    name="sys_size"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                    {errors?.sys_size && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.sys_size}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Status"
                    value={createReconcileData.status}
                    name="status"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                   {errors?.status && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Start Date"
                    value={createReconcileData.start_date}
                    name="start_date"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                    {errors?.start_date && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.start_date}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="End Date"
                    value={createReconcileData.end_date}
                    name="end_date"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.end_date && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.end_date}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Amount"
                    value={createReconcileData.amount}
                    name="amount"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                   {errors?.amount && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.amount}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Notes"
                    value={createReconcileData.notes}
                    name="notes"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                   {errors?.notes && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.notes}
                    </span>
                  )}
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

export default CreateReconcile;
