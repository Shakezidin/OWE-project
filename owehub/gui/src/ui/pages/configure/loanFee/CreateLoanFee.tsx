import React, { memo, useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { createAdjustments } from "../../../../redux/apiActions/arAdjustmentsAction";
import {
  createLoanFee,
  ILoanRow,
  updateLoanFee,
} from "../../../../redux/apiActions/loanFeeActions";
import {
  installerOption,
  stateOption,
  dealerOption,
  loanOption,
} from "../../../../core/models/data_models/SelectDataModel";
import { format } from "date-fns";
import SelectOption from "../../../components/selectOption/SelectOption";
import { resetSuccess } from "../../../../redux/apiSlice/configSlice/config_get_slice/loanFeeSlice";
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData?: ILoanRow | null;
}

const CreatedLoanFee: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
}) => {
  const dispatch = useAppDispatch();
  const [newFormData, setNewFormData] = useState({
    dealerName:"Shushank Sharma",
    installerName: "",
    loanType:   "P123",
    dlrMu: "",
    dlrCost:  "",
    startDate: "",
    endDate:"",
    stateName:  "",
    oweCost: editData?.owe_cost ? `${editData?.owe_cost}` : ""
  });

  const [errors, setErrors] = useState<typeof newFormData>({} as typeof newFormData);
 
  const { isSuccess } = useAppSelector((state) => state.loanFeeSlice);
  

  const tableData = {
    tableNames: [
      "partners",
      "states",
      "installers",
      "sale_type",
      "dealers",
      "loan_type",
    ],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
     setNewFormData((prev) => ({ ...prev, ...res.data }));
  };

  const handleValidation = () => {
    const error: typeof newFormData = {} as typeof newFormData;
    for (const key in newFormData) {
      if (key==="loan_type" || key==="dealers") {
        continue
      }
      if (!newFormData[key as keyof typeof newFormData]) {
        error[
          key as keyof typeof newFormData
        ] = `${key.toLocaleLowerCase()} is required`;
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
  };
  React.useEffect(() => {
    setNewFormData({
        dealerName: editData?.dealer || "Shushank Sharma",
        installerName: editData?.installer || "",
        loanType: editData?.loan_type || "P123",
        dlrMu: editData?.dlr_mu?`${editData?.dlr_mu}` : "",
        dlrCost: editData?.dlr_cost?`${editData?.dlr_cost}` : "",
        startDate: editData?.start_date || "",
        endDate: editData?.end_date || "",
        stateName: editData?.state || "",
        oweCost:editData?.owe_cost ? `${editData?.owe_cost}` : ""
      })
    getNewFormData();
  }, [editMode,editData]);
console.log(newFormData,"formdddd");

  //   const loanTypes = (newFormData["loan_types"]   ).map()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (name === "oweCost") {
      if (value === "" || value === "0" || Number(value)) {
        setNewFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setNewFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      if (editMode) {
        dispatch(
          updateLoanFee({
            record_id: editData?.record_id!,
       
            state: newFormData.stateName,
            installer: newFormData.installerName,
            start_date: newFormData.startDate
              ? format(new Date(newFormData.startDate), "yyyy-MM-dd")
              : "",
            end_date: newFormData.endDate
              ? format(new Date(newFormData.endDate), "yyyy-MM-dd")
              : "",
            dlr_cost:parseFloat( newFormData.dlrCost),
            dlr_mu:parseFloat( newFormData.dlrMu) ,
            owe_cost: parseFloat(newFormData.oweCost),
            dealer: newFormData.dealerName || "Shushank Sharma",
            loan_type: newFormData.loanType || "P123",
          })
        );
      } else {
        dispatch(
          createLoanFee({
       
            state: newFormData.stateName,
            installer: newFormData.installerName,
            start_date: newFormData.startDate
              ? format(new Date(newFormData.startDate), "yyyy-MM-dd")
              : "",
            end_date: newFormData.endDate
              ? format(new Date(newFormData.endDate), "yyyy-MM-dd")
              : "",
              dlr_cost:parseFloat( newFormData.dlrCost),
              dlr_mu:parseFloat( newFormData.dlrMu) ,
            owe_cost: parseFloat(newFormData.oweCost),
            dealer: newFormData.dealerName || "Shushank Sharma",
            loan_type: newFormData.loanType || "P123",
          })
        );
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
          {editMode === false ? "Create Loan Fee" : "Update Loan Fee"}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
              <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="DLR MU"
                    value={newFormData.dlrMu}
                    name="dlrMu"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                  {errors?.dlrMu && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.dlrMu}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <label className="inputLabel-select">Dealer</label>
                  <SelectOption
                    options={dealerOption(newFormData)}
                    onChange={(newValue) => {
                      setNewFormData((prev) => ({
                        ...prev,
                        dealerName: newValue?.value!,
                      }));
                    }}
                    value={dealerOption(newFormData)?.find(
                      (option) => option.value === newFormData.dealerName
                    )}
                  />
                  {errors?.dealerName && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.dealerName}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <label className="inputLabel-select">State</label>
                  <SelectOption
                    options={stateOption(newFormData)}
                    onChange={(newValue) => {
                      setNewFormData((prev) => ({
                        ...prev,
                        stateName: newValue?.value!,
                      }));
                    }}
                    value={stateOption(newFormData)?.find(
                      (option) => option.value === newFormData.stateName
                    )}
                  />
                  {errors?.stateName && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.stateName}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select">Loan Type</label>
                  <SelectOption
                    options={loanOption(newFormData)}
                    onChange={(newValue) => {
                      setNewFormData((prev) => ({
                        ...prev,
                        dealerName: newValue?.value!,
                      }));
                    }}
                    value={loanOption(newFormData)?.find(
                      (option) => option.value === newFormData.loanType
                    )}
                  />
                  {errors?.loanType && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.loanType}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <label className="inputLabel-select">Installer</label>
                  <SelectOption
                    options={installerOption(newFormData)}
                    onChange={(newValue) => {
                      setNewFormData((prev) => ({
                        ...prev,
                        installerName: newValue?.value!,
                      }));
                    }}
                    value={installerOption(newFormData)?.find(
                      (option) => option.value === newFormData.installerName
                    )}
                  />
                   {errors?.installerName && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.installerName}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="DLR Cost"
                    value={newFormData.dlrCost}
                    name="dlrCost"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                  {errors?.dlrCost && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.dlrCost}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Owe Cost"
                    value={newFormData.oweCost}
                    name="oweCost"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                  {errors?.oweCost && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.oweCost}
                    </span>
                  )}
                </div>

              

                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Start "
                    value={newFormData.startDate}
                    name="startDate"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                   {errors?.startDate && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.startDate}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="End"
                    value={newFormData.endDate}
                    name="endDate"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                   {errors?.endDate && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.endDate}
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

export default memo(CreatedLoanFee);
