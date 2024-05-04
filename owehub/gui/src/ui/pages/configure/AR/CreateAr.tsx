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
import { createAr } from "../../../../redux/apiActions/arAction";
import { paySaleTypeData } from "../../../../resources/static_data/StaticData";
import { PayScheduleModel } from "../../../../core/models/configuration/create/PayScheduleModel";
import SelectOption from "../../../components/selectOption/SelectOption";
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
}

const CreatedAr: React.FC<payScheduleProps> = ({ handleClose, editMode }) => {
  const dispatch = useAppDispatch();

  const [createArData, setCreateArData] = useState({
    customer_name:"",
    unique_id:"",
    date:"",
    amount:"",
    notes:"",
  });

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
    setCreateArData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createAr(createArData));
  };

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
                    label="Customer Name"
                    value={createArData.customer_name}
                    name="customer_name"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Unique ID"
                    value={createArData.unique_id}
                    name="unique_id"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Date"
                    value={createArData.date}
                    name="dealer_tier"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Amount"
                    value={createArData.amount}
                    name="amount"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Note"
                    value={createArData.notes}
                    name="note"
                    placeholder={"Enter"}
                    onChange={(e) => handleInputChange(e)}
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

export default CreatedAr;
