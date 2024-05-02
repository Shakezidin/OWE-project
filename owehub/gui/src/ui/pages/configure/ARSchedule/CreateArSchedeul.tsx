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
import { useAppDispatch } from "../../../../redux/hooks";
import { createArSchedule } from "../../../../redux/apiActions/arScheduleAction";
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
}

const CreatedArSchedule: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
}) => {
  const dispatch = useAppDispatch();

  // const [createPayData, setCreatePayData] = useState<PayScheduleModel>(
  //     {
  //         record_id: payEditedData? payEditedData?.record_id: 0,
  //         partner: payEditedData? payEditedData?.partner: "Shushank Sharma",
  //         partner_name:payEditedData? payEditedData?.partner_name: "FFS",
  //         installer_name: payEditedData? payEditedData?.installer_name:"OWE",
  //         sale_type: payEditedData? payEditedData?.sale_type:"BATTERY",
  //         state: payEditedData? payEditedData?.state:"Alabama",
  //         rl: payEditedData? payEditedData?.rl:"40",
  //         draw:payEditedData? payEditedData?.draw: "50%",
  //         draw_max: payEditedData? payEditedData?.draw_max:"50%",
  //         rep_draw:payEditedData? payEditedData?.rep_draw: "2000.00",
  //         rep_draw_max:payEditedData? payEditedData?.rep_draw_max: "2000.00",
  //         rep_pay:payEditedData? payEditedData?.rep_pay: "Yes",
  //         start_date: payEditedData? payEditedData?.start_date:"2024-04-01",
  //         end_date: payEditedData? payEditedData?.end_date:"2024-04-30"
  //       }
  // )
  const [newFormData, setNewFormData] = useState({
    partner: "",
    saleType: "",
    installer: "",
    state: "",
    redline: "",
    calcDate: "",
    permitPay: "",
    permitMax: "",
    installPay: "",
    ptoPay: "",
    start: "",
    end: "",
    uniqueId: "",
  });

  // const tableData = {
  //   tableNames: ["partners", "states", "installers", "sale_type"],
  // };
  // const getNewFormData = async () => {
  //   const res = await postCaller(EndPoints.get_newFormData, tableData);
  //   setNewFormData(res.data);
  // };
  // useEffect(() => {
  //   getNewFormData();
  // }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createArSchedule({
        unique_id: newFormData.uniqueId,
        partner_name: newFormData.partner,
        sale_type_name: newFormData.saleType,
        install_pay: newFormData.installPay,
        installer_name: newFormData.installer,
        start_date: newFormData.start,
        end_date: newFormData.end,
        state_name: newFormData.state,
        permit_max: newFormData.permitMax,
        permit_pay: newFormData.permitPay,
        calc_date: newFormData.calcDate,
        red_line: newFormData.redline,
        pto_pay: newFormData.ptoPay,
      })
    );
  };

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
                    label="Unique Id"
                    value={newFormData.uniqueId}
                    name="uniqueId"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Partner"
                    value={newFormData.partner}
                    name="partner"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Sale Type"
                    value={newFormData.saleType}
                    name="saleType"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="PTO Pay"
                    value={newFormData.ptoPay}
                    name="ptoPay"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>

                

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Red Line"
                    value={newFormData.redline}
                    name="redline"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Permit Max"
                    value={newFormData.permitMax}
                    name="permitMax"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="State"
                    value={newFormData.state}
                    name="state"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Permit Pay"
                    value={newFormData.permitPay}
                    name="permitPay"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
               

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Install Pay"
                    value={newFormData.installPay}
                    name="installPay"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Installer name"
                    value={newFormData.installer}
                    name="installer"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Calc Date"
                    value={newFormData.calcDate}
                    name="calcDate"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>

                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Start Date"
                    value={newFormData.start}
                    name="start"
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
                    value={newFormData.end}
                    name="end"
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

export default CreatedArSchedule;
