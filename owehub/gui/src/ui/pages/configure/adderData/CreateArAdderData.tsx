import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { format } from "date-fns";
import { resetSuccess } from "../../../../redux/apiSlice/configSlice/config_get_slice/adderDataSlice";
import {
  createarAdderData,
  IAdderRowData,
  updatearAdderData,
} from "../../../../redux/apiActions/arAdderDataAction";
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData?: IAdderRowData | null;
}

const CreateArAdderData: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
}) => {
  const dispatch = useAppDispatch();

  const [newFormData, setNewFormData] = useState({
    unique_id: editData?.unique_id || "",
    date: editData?.date || "",
    type_ad_mktg: editData?.type_ad_mktg || "",
    type: editData?.type || "",
    gc: editData?.gc || "",
    exact_amount: editData?.exact_amount || "",
    per_kw_amt: editData?.per_kw_amt ? `${editData?.per_kw_amt}` : "",
    rep_percent: editData?.rep_percent ? `${editData?.rep_percent}` : "",
    description: editData?.description || "",
    notes: editData?.notes || "",
    // sys_size: editData?.sys_size ? `${editData?.sys_size}` : "",
    // adder_cal: editData?.adder_cal ? `${editData?.adder_cal}` : "",
  });
  const { isSuccess } = useAppSelector((state) => state.adderDataSlice);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (
      name === "per_kw_amt" ||
      name === "exact_amount" ||
      name === "rep_percent" ||
      name === "sys_size" ||
      name === "adder_cal"
    ) {
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
        updatearAdderData({
          ...newFormData,
          record_id: editData?.record_id!,
          per_kw_amt: parseFloat(newFormData.per_kw_amt),
          exact_amount:parseInt(newFormData.exact_amount),
          rep_percent: parseFloat(newFormData.rep_percent),
          // sys_size: parseFloat(newFormData.sys_size),
          // adder_cal: parseFloat(newFormData.adder_cal),
        })
      );
    } else {
      dispatch(
        createarAdderData({
          ...newFormData,
          per_kw_amt: parseFloat(newFormData.per_kw_amt),
          exact_amount:parseInt(newFormData.exact_amount),
          rep_percent: parseFloat(newFormData.rep_percent),
          // sys_size: parseFloat(newFormData.sys_size),
          // adder_cal: parseFloat(newFormData.adder_cal),
        })
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      dispatch(resetSuccess());
    }
  }, []);
  return (
    <div className="transparent-model">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {!editMode
            ? "Create Ar Adder Data Settings"
            : "Update Ar Adder Data Settings"}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Unique ID"
                    value={newFormData.unique_id}
                    name="unique_id"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Type"
                    value={newFormData.type}
                    name="type"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Date"
                    value={newFormData.date}
                    name="date"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="create-input-container">
              
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="GC"
                    value={newFormData.gc}
                    name="gc"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Exct Amount"
                    value={newFormData.exact_amount}
                    name="exact_amount"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Per Kw Amt"
                    value={newFormData.per_kw_amt}
                    name="per_kw_amt"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="create-input-container">
              
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Rep Percent"
                    value={newFormData.rep_percent}
                    name="rep_percent"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Description"
                    value={newFormData.description}
                    name="description"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Notes"
                    value={newFormData.notes}
                    name="notes"
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

export default CreateArAdderData;
