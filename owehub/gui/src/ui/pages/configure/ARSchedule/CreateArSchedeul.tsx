import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { resetSuccess } from "../../../../redux/apiSlice/configSlice/config_get_slice/ArSchedule";
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

import { paySaleTypeData } from "../../../../resources/static_data/StaticData";
import { PayScheduleModel } from "../../../../core/models/configuration/create/PayScheduleModel";
import SelectOption from "../../../components/selectOption/SelectOption";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  IARSchedule,
  createArSchedule,
  updateArchSchedule,
} from "../../../../redux/apiActions/arScheduleAction";
import { addDays, format } from "date-fns";
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData: IARSchedule | null;
  setViewArchived: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatedArSchedule: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData,
  setViewArchived,
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess } = useAppSelector((state) => state.ArSchedule);

  const [formData, setFormData] = useState({
    partner: editData?.partner_name || "",
    saleType: editData?.sale_type_name || "",
    installer: editData?.installer_name || "",
    state: editData?.state_name || "",
    redline: editData?.red_line || "",
    calcDate: editData?.calc_date || "",
    permitPay: editData?.permit_pay || "",
    permitMax: editData?.permit_max || "",
    installPay: editData?.install_pay || "",
    ptoPay: editData?.pto_pay || "",
    start: editData?.start_date || "",
    end: editData?.start_date || "",
    uniqueId: editData?.start_date || "",
  });

  const [errors, setErrors] = useState<typeof formData>({} as typeof formData);

  const tableData = {
    tableNames: ["partners", "states", "installers", "sale_type"],
  };
  const getnewformData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setFormData((prev) => ({ ...prev, ...res.data }));
  };
  useEffect(() => {
    getnewformData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      name === "installPay" ||
      name === "permitMax" ||
      name === "redline" ||
      name === "ptoPay" ||
      name === "permitPay"
    ) {
      if (value === "0" || value === "" || Number(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      } else {
        return;
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleValidation = () => {
    const error: typeof formData = {} as typeof formData;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      setViewArchived(false);
      const data = {
        unique_id: formData.uniqueId,
        partner_name: formData.partner,
        sale_type_name: formData.saleType || "BATTERY",
        install_pay: parseInt(formData.installPay),
        installer_name: formData.installer,
        start_date: format(new Date(formData.start), "yyyy-MM-dd"),
        end_date: format(new Date(formData.end), "yyyy-MM-dd"),
        state_name: formData.state,
        permit_max: parseInt(formData.permitMax),
        permit_pay: parseInt(formData.permitPay),
        calc_date: format(new Date(formData.calcDate), "yyyy-MM-dd"),
        red_line: parseInt(formData.redline),
        pto_pay: parseInt(formData.ptoPay),
      };
      if (editMode) {
        dispatch(
          updateArchSchedule({ ...data, record_id: editData?.record_id! })
        );
      } else {
        dispatch(createArSchedule(data));
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
          {editMode === false
            ? "Create AR Schedule"
            : "Update AR Schedule"}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Unique Id"
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
                <div className="create-input-field">
                  <label className="inputLabel-select select-type-label">Partners</label>
                  <SelectOption
                    options={partnerOption(formData)}
                    onChange={(newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        partner: newValue?.value!,
                      }));
                    }}
                    value={partnerOption(formData)?.find(
                      (option) => option.value === formData.partner
                    )}
                  />
                  {errors?.partner && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.partner}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select select-type-label">Sale Type</label>
                  <SelectOption
                    options={salesTypeOption(formData)}
                    onChange={(newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        saleType: newValue?.value!,
                      }));
                    }}
                    value={salesTypeOption(formData)?.find(
                      (option) => option.value === formData.saleType
                    )}
                  />
                  {errors?.saleType && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.saleType}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="PTO Pay"
                    value={formData.ptoPay}
                    name="ptoPay"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                  {errors?.ptoPay && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.ptoPay}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Red Line"
                    value={formData.redline}
                    name="redline"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                  {errors?.redline && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.redline}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Permit Max"
                    value={formData.permitMax}
                    name="permitMax"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                  {errors?.permitMax && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.permitMax}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select select-type-label">State</label>
                  <SelectOption
                  menuListStyles={{height: "165px"}}
                    options={stateOption(formData)}
                    onChange={(newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        state: newValue?.value!,
                      }));
                    }}
                    value={stateOption(formData)?.find(
                      (option) => option.value === formData.state
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
                    label="Permit Pay"
                    value={formData.permitPay}
                    name="permitPay"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />

                  {errors?.permitPay && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.permitPay}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Install Pay"
                    value={formData.installPay}
                    name="installPay"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />

                  {errors?.installPay && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.installPay}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select select-type-label">Installer</label>
                  <SelectOption
                  menuListStyles={{height: "85px"}}
                    options={installerOption(formData)}
                    onChange={(newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        installer: newValue?.value!,
                      }));
                    }}
                    value={installerOption(formData)?.find(
                      (option) => option.value === formData.installer
                    )}
                  />
                    {errors?.installer && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.installer}
                    </span>
                  )}
                </div>
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Calc Date"
                    value={formData.calcDate}
                    name="calcDate"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />

{errors?.calcDate && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.calcDate}
                    </span>
                  )}
                </div>

                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Start Date"
                    value={formData.start}
                    name="start"
                    placeholder={"Enter"}
                    onChange={(e)=>{
                      handleChange(e)
                      setFormData((prev) => ({...prev, end:""}))
                    }}
                  />
                  {errors?.start && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.start.replace("start","start date")}
                    </span>
                  )}
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="End Date"
                    value={formData.end}
                    name="end"
                    min={formData.start && format(addDays(new Date(formData.start),1),"yyyy-MM-dd")}
                    disabled={!formData.start}
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                  {errors?.start && (
                    <span style={{ display: "block", color: "#FF204E" }}>
                      {errors.start.replace("end","end date")}
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

export default CreatedArSchedule;
