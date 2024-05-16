import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { resetSuccess } from "../../../../redux/apiSlice/configSlice/config_get_slice/leaderOverride";
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
  teamsOption,
} from "../../../../core/models/data_models/SelectDataModel";
import Select from "react-select";
import { paySaleTypeData } from "../../../../resources/static_data/StaticData";
import { PayScheduleModel } from "../../../../core/models/configuration/create/PayScheduleModel";
import SelectOption from "../../../components/selectOption/SelectOption";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  createleaderOverride,
  ILeaderRow,
  updateleaderOverride,
} from "../../../../redux/apiActions/leaderOverrideAction";

interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: ILeaderRow | null;
  setViewArchived:React.Dispatch<React.SetStateAction<boolean>>
}

interface IErrors {
  teamName?: string;
  leaderName?: string;
  type?: string;
  term?: string;
  qual?: string;
  salesQ?: string;
  teamKwQ?: string;
  payRate?: string;
  start?: string;
  end?: string;
  uniqueId?: string;
}
const CreateLeaderOverride: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
  setViewArchived
}) => {
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<IErrors>({});

  const [formData, setFormData] = useState({
    teamName: editData?.team_name || "",
    leaderName: editData?.leader_name || "",
    type: editData?.type || "",
    term: editData?.term || "",
    qual: editData?.qual || "",
    salesQ: editData?.sales_q ? `${editData?.sales_q}` : "",
    teamKwQ: editData?.team_kw_q ? `${editData?.team_kw_q}` : "",
    payRate: editData?.pay_rate || "",
    start: editData?.start_date || "",
    end: editData?.end_date || "",
    uniqueId: editData?.unique_id || "",
  });
  const [newFormData, setNewFormData] = useState<any>([]);
  const { isSuccess } = useAppSelector((state) => state.leaderOverride);

  const tableData = {
    tableNames: ["partners", "states", "installers", "sale_type", "teams"],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };

  const handleValidation = () => {
    const error: IErrors = {};
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]) {
        error[
          key as keyof typeof formData
        ] = `${key.toLocaleLowerCase()} is required`;
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
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
    setViewArchived(false)
    if (handleValidation()) {
      const data = {
        unique_id: formData.uniqueId,
        team_name: formData.teamName,
        leader_name: formData.leaderName,
        type: formData.type,
        term: formData.term,
        qual: formData.qual,
        sales_q: parseFloat(formData.salesQ),
        team_kw_q: parseFloat(formData.teamKwQ),
        pay_rate: formData.payRate,
        start_date: format(new Date(formData.start), "yyyy-MM-dd"),
        end_date: format(new Date(formData.end), "yyyy-MM-dd"),
      };

      if (editMode) {
        dispatch(
          updateleaderOverride({ ...data, record_id: editData?.record_id! })
        );
      } else {
        dispatch(createleaderOverride(data));
      }
    }
  };
  useEffect(() => {
    getNewFormData();
  }, []);

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
          {editMode === false ? "Create Leader Override" : "Update RepPay Settings"}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select">Team Name</label>
                  <SelectOption
                    options={teamsOption(newFormData)}
                    onChange={(newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        teamName: newValue?.value!,
                      }))
                    }
                    value={teamsOption(newFormData)?.find(
                      (option) => option.value === formData.teamName
                    )}
                  />
                  {errors?.teamName && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.teamName}
                    </span>
                  )}
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
                  {errors?.leaderName && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.leaderName}
                    </span>
                  )}
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
                  {errors?.type && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.type}
                    </span>
                  )}
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
                  {errors?.term && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.type}
                    </span>
                  )}
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
                  {errors?.qual && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.qual}
                    </span>
                  )}
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
                  {errors?.salesQ && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.salesQ}
                    </span>
                  )}
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
                  {errors?.teamKwQ && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.teamKwQ}
                    </span>
                  )}
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

                  {errors?.payRate && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.payRate}
                    </span>
                  )}
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
                   {errors?.start && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.start.replace("start","start date")}
                    </span>
                  )}
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
                   {errors?.end && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.end.replace("end","end date")}
                    </span>
                  )}
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
                   {errors?.uniqueId && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.uniqueId}
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

export default CreateLeaderOverride;
