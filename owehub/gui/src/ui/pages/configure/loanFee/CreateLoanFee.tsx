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
    uniqueId: "",
    dealerName:  "",
    installerName: "",
    loanType:  "",
    dlrMu: "",
    dlrCost:  "",
    startDate: "",
    endDate:"",
    stateName:  "",
  });
  const [oweCost, setOweCost] = useState(
    editData?.owe_cost ? `${editData?.owe_cost}` : ""
  );
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
  React.useEffect(() => {
    setNewFormData({
        uniqueId: editData?.unique_id || "",
        dealerName: editData?.dealer || "",
        installerName: editData?.installer || "",
        loanType: editData?.loan_type || "",
        dlrMu: editData?.dlr_mu || "",
        dlrCost: editData?.dlr_cost || "",
        startDate: editData?.start_date || "",
        endDate: editData?.end_date || "",
        stateName: editData?.state || "",
      })
    getNewFormData();
  }, [editMode,editData]);

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
    if (editMode) {
      dispatch(
        updateLoanFee({
          record_id: editData?.record_id!,
          unique_id: newFormData.uniqueId,
          state: newFormData.stateName,
          installer: newFormData.installerName,
          start_date: newFormData.startDate
            ? format(new Date(newFormData.startDate), "yyyy-MM-dd")
            : "",
          end_date: newFormData.endDate
            ? format(new Date(newFormData.endDate), "yyyy-MM-dd")
            : "",
          dlr_cost: newFormData.dlrCost,
          dlr_mu: newFormData.dlrMu,
          owe_cost: parseFloat(oweCost),
          dealer: newFormData.dealerName || "Shushank Sharma",
          loan_type: newFormData.loanType || "P123",
        })
      );
    } else {
      dispatch(
        createLoanFee({
          unique_id: newFormData.uniqueId,
          state: newFormData.stateName,
          installer: newFormData.installerName,
          start_date: newFormData.startDate
            ? format(new Date(newFormData.startDate), "yyyy-MM-dd")
            : "",
          end_date: newFormData.endDate
            ? format(new Date(newFormData.endDate), "yyyy-MM-dd")
            : "",
          dlr_cost: newFormData.dlrCost,
          dlr_mu: newFormData.dlrMu,
          owe_cost: parseFloat(oweCost),
          dealer: newFormData.dealerName || "Shushank Sharma",
          loan_type: newFormData.loanType || "P123",
        })
      );
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
          {editMode === false ? "Rep Pay Settings" : "Update RepPay Settings"}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Unique ID"
                    value={newFormData.uniqueId}
                    name="uniqueId"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
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
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Owe Cost"
                    value={oweCost}
                    name="oweCost"
                    placeholder={"Enter"}
                    onChange={(e) => setOweCost(e.target.value)}
                  />
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="DLR MU"
                    value={newFormData.dlrMu}
                    name="dlrMu"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
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
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="End"
                    value={newFormData.endDate}
                    name="endDate"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
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
