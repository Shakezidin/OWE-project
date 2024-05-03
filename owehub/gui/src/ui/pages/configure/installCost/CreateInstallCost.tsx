import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { createAdjustments } from "../../../../redux/apiActions/arAdjustmentsAction";
import {
  installerOption,
  partnerOption,
  salesTypeOption,
  stateOption,
} from "../../../../core/models/data_models/SelectDataModel";
import { format } from "date-fns";
import SelectOption from "../../../components/selectOption/SelectOption";
import { resetSuccess } from "../../../../redux/apiSlice/configSlice/config_get_slice/arAdjusments";
import { createInstallCost } from "../../../../redux/apiActions/installCostAction";
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
}

const CreateInstallCost: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
}) => {
  const dispatch = useAppDispatch();

  const [newFormData, setNewFormData] = useState({
    uniqueId: "",
    cost: "",
    startDate: "",
    endDate: "",
  });
  const { isSuccess } = useAppSelector((state) => state.installConstSlice);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (name === "cost") {
      if (value === "" || value === "0" || Number(value)) {
        setNewFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setNewFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // "unique_id": "1212",
    // "cost": 123.45,
    // "start_date": "2024-05-01",
    // "end_date": "2024-05-31"
    dispatch(
      createInstallCost({
        unique_id: newFormData.uniqueId,
        cost: parseInt(newFormData.cost),
        start_date: format(new Date(newFormData.startDate),"yyyy-MM-dd"),
        end_date: format(new Date(newFormData.endDate ),"yyyy-MM-dd"),
      })
    );
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
    return () => {
      isSuccess && dispatch(resetSuccess());
    };
  }, []);
  return (
    <div className="transparent-model">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {!editMode
            ? "Create Install Cost Settings"
            : "Update Install Cost Settings"}
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
                  <Input
                    type={"text"}
                    label="Cost"
                    value={newFormData.cost}
                    name="cost"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                    <Input
                      type={"date"}
                      label="start date"
                      value={newFormData.startDate}
                      name="startDate"
                      placeholder={"Enter"}
                      onChange={handleChange}
                    />
                  </div>
              </div>

              <div className="create-input-field">
                <Input
                  type={"date"}
                  label="End Date"
                  value={newFormData.endDate}
                  name="endDate"
                  placeholder={"Enter"}
                  onChange={handleChange}
                />
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

export default CreateInstallCost;
