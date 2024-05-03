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
import { paySaleTypeData } from "../../../../resources/static_data/StaticData";
import { PayScheduleModel } from "../../../../core/models/configuration/create/PayScheduleModel";
import SelectOption from "../../../components/selectOption/SelectOption";
import { format } from "date-fns";
import { useAppDispatch } from "../../../../redux/hooks";
import {
  createleaderOverride,
  ILeaderRow,
  updateleaderOverride,
} from "../../../../redux/apiActions/leaderOverrideAction";

interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: ILeaderRow | null;
}

const CreateLeaderOverride: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
}) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    teamName: editData?.team_name || "",
    leaderName: editData?.leader_name || "",
    type: editData?.type || "",
    term: editData?.term || "",
    qual: editData?.qual || "",
    salesQ: editData?.sales_q? `${editData?.sales_q}`: "",
    teamKwQ: editData?.team_kw_q? `${editData?.team_kw_q}` : "",
    payRate: editData?.pay_rate || "",
    start: editData?.start_date || "",
    end: editData?.end_date || "",
    uniqueId: editData?.unique_id || "",
  });
  const [newFormData, setNewFormData] = useState<any>([]);

  const tableData = {
    tableNames: ["partners", "states", "installers", "sale_type"],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (name === "salesQ" || name === "teamKwQ") {
      if (value === "" || value === "0" || Number(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     const data =  {
        "unique_id": formData.uniqueId,
        "team_name": formData.teamName,
        "leader_name":formData.leaderName,
        "type": formData.type,
        "term": formData.term,
        "qual":formData.qual,
        "sales_q": parseFloat(formData.salesQ),
        "team_kw_q":parseFloat( formData.teamKwQ),
        "pay_rate": formData.payRate,
        "start_date": format(new Date(formData.start),"yyyy-MM-dd"),
        "end_date":format(new Date(formData.end),"yyyy-MM-dd")
      }

    // const data = {
    //   unique_id: "123456789",
    //   team_name: "Sales Team A",
    //   leader_name: "John Doe",
    //   type: "Performance",
    //   term: "Quarterly",
    //   qual: "High",
    //   sales_q: 1000000.0,
    //   team_kw_q: 50000.0,
    //   pay_rate: "$25/hour",
    //   start_date: "2024-01-01",
    //   end_date: "2024-03-31",
    // };
    if (editMode) {
      dispatch(
        updateleaderOverride({ ...data, record_id: editData?.record_id! })
      );
    } else {
      dispatch(createleaderOverride(data));
    }
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  return (
    <div className="transparent-model">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? "Leader Override" : "Update RepPay Settings"}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Team Name"
                    value={formData.teamName}
                    name="teamName"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Leader Name"
                    value={formData.leaderName}
                    name="leaderName"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Type"
                    value={formData.type}
                    name="type"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Term"
                    value={formData.term}
                    name="term"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Qual"
                    value={formData.qual}
                    name="qual"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Sales Q"
                    value={formData.salesQ}
                    name="salesQ"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Team KW Q"
                    value={formData.teamKwQ}
                    name="teamKwQ"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Pay Rate"
                    value={formData.payRate}
                    name="payRate"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Start"
                    value={formData.start}
                    name="start"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="End"
                    value={formData.end}
                    name="end"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Unique ID"
                    value={formData.uniqueId}
                    name="uniqueId"
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

export default CreateLeaderOverride;
