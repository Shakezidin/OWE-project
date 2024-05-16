import React, { useEffect, useState } from "react";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { useDispatch } from "react-redux";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import Select from "react-select";
import {
  installerOption,
  partnerOption,
  repTypeOption,
  stateOption,
} from "../../../../core/models/data_models/SelectDataModel";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { resetSuccess } from "../../../../redux/apiSlice/configSlice/config_get_slice/dlrOth";
import { IRowDLR, createDlrOth, updateDlrOth } from "../../../../redux/apiActions/dlrAction";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
  commission: IRowDLR | null;
}

interface IError {
  [key: string]: string;
}

const CreateDlrOth: React.FC<ButtonProps> = ({
  handleClose,
  commission,
  editMode,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess } = useAppSelector((state) => state.dlrOth);
  const [createCommission, setCreateCommission] = useState({
    unique_id: commission?.unique_id || "",
    payee: commission?.payee || "",
    amount: commission?.amount || "",
    description: commission?.description || "",
    balance: commission?.balance ? `${commission?.balance}` : "",
    paid_amount: commission?.paid_amount ? `${commission?.balance}` : "",
    start_date: commission?.start_date || "",
    end_date: commission?.end_date || "",
  });
  const [errors, setErrors] = useState<IError>({} as IError);
  const [newFormData, setNewFormData] = useState<any>([]);
  const tableData = {
    tableNames: ["partners", "states", "installers", "rep_type"],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  const handleValidation = () => {
    const error: IError = {} as IError;
    for (const key in createCommission) {
      if (key === "record_id") {
        continue;
      }
      if (!createCommission[key as keyof typeof createCommission]) {
        error[key as keyof IError] = `${key.toLocaleLowerCase()} is required`;
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length === 0;
  };

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateCommission((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : "",
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "end_date") {
      if (createCommission.start_date && value < createCommission.start_date) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          end_date: "End date cannot be before the start date",
        }));
        return;
      }
    }
    if (name === "balance" || name === "paid_amount") {
      if (value === "" || value === "0" || Number(value)) {
        setCreateCommission((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setCreateCommission((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (handleValidation()) {
      if (editMode) {
        dispatch(updateDlrOth({
          ...createCommission,
          balance: parseFloat(createCommission.balance),
          paid_amount: parseFloat(createCommission.paid_amount),
          record_id: commission?.record_id!
        }))
      } else {
        dispatch(
          createDlrOth({
            ...createCommission,
            balance: parseFloat(createCommission.balance),
            paid_amount: parseFloat(createCommission.paid_amount),
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
      <form action="" onSubmit={(e) => handleSubmit(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? "Create DLR-OTH" : "Update Dealer DLR-OTH"}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Unique id"
                    value={createCommission.unique_id}
                    name="unique_id"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.unique_id && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.unique_id.replace("unique_id", "unique id")}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Payee"
                    value={createCommission.payee}
                    name="payee"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.payee && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.payee}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={"number"}
                    label="Amount"
                    value={createCommission.amount}
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
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"number"}
                    label="Balance"
                    value={createCommission.balance}
                    name="balance"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.balance && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.balance}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Description"
                    value={createCommission.description}
                    name="description"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.description && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.description}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Start Date"
                    value={createCommission.start_date}
                    name="start_date"
                    placeholder={"1/04/2004"}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.start_date && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.start_date.replace("start_date", "start date")}
                    </span>
                  )}
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="End Date"
                    value={createCommission.end_date}
                    name="end_date"
                    placeholder={"10/04/2004"}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.end_date && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.end_date.replace("end_date", "end date")}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={"number"}
                    label="Paid Amount"
                    value={createCommission.paid_amount}
                    name="paid_amount"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {errors?.amount && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.amount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="createUserActionButton">
          <ActionButton title={"Cancel"} type="button" onClick={handleClose} />
          <ActionButton
            title={editMode === false ? "Save" : "Update"}
            type="submit"
            onClick={() => { }}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateDlrOth;
