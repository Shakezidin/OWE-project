import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { resetSuccess } from "../../../../redux/apiSlice/configSlice/config_get_slice/ArSchedule"
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
import { IARSchedule, createArSchedule, updateArchSchedule } from "../../../../redux/apiActions/arScheduleAction";
import { format } from "date-fns";
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
  editData:IARSchedule|null
}

const CreatedArSchedule: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
  editData
}) => {
  const dispatch = useAppDispatch();
  const { isSuccess } = useAppSelector(state => state.ArSchedule)

  const [formData, setFormData] = useState({
    partner: editData?.partner_name||"",
    saleType:editData?.sale_type_name|| "",
    installer: editData?.installer_name||"",
    state: editData?.state_name||"",
    redline:editData?.red_line|| "",
    calcDate: editData?.calc_date||"",
    permitPay:editData?.permit_pay|| "",
    permitMax:editData?.permit_max|| "",
    installPay: editData?.install_pay||"",
    ptoPay:editData?.pto_pay|| "",
    start:editData?.start_date|| "",
    end: editData?.start_date||"",
    uniqueId: editData?.start_date||"",
  });

  const tableData = {
    tableNames: ["partners", "states", "installers", "sale_type"],
  };
  const getnewformData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setFormData(prev=>({...prev,...res.data}));
  };
  useEffect(() => {
    getnewformData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "installPay" || name === "permitMax" || name === "redline" || name === "ptoPay" || name === "permitPay") {
      if (value === "0" || value === "" || Number(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }else{
        return
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      unique_id: formData.uniqueId,
      partner_name: formData.partner,
      sale_type_name: formData.saleType||"BATTERY",
      install_pay: formData.installPay,
      installer_name: formData.installer,
      start_date: format(new Date(formData.start), "yyyy-MM-dd"),
      end_date: format(new Date(formData.end), "yyyy-MM-dd"),
      state_name: formData.state,
      permit_max: formData.permitMax,
      permit_pay: formData.permitPay,
      calc_date: format(new Date(formData.calcDate), "yyyy-MM-dd"),
      red_line: formData.redline,
      pto_pay: formData.ptoPay,
    }
    if(editMode){
dispatch(updateArchSchedule({...data,record_id:editData?.record_id!}))
    }else{
      dispatch(
        createArSchedule(data)
      );
    }
  };
  useEffect(() => {
    if (isSuccess) {
      handleClose()
    }

    return (() => {
      isSuccess && dispatch(resetSuccess())
    })
  }, [isSuccess])

  console.log(formData,"formDaaaa")

  return (
    <div className="transparent-model">
      <form className="modal" onSubmit={handleSubmit}>
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? "Ar Schedule Setting" : "Update Ar Schedule Settings"}
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
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">Partners</label>
                  <SelectOption
                    options={partnerOption(formData)}
                    onChange={(newValue) => {
                      setFormData(prev => ({ ...prev, partner: newValue?.value! }))
                    }}
                    value={partnerOption(formData)?.find((option) => option.value === formData.partner)}
                  />
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">Sale Type</label>
                  <SelectOption
                    options={salesTypeOption(formData)}
                    onChange={(newValue) => {
                      setFormData(prev => ({ ...prev, saleType: newValue?.value! }))
                    }}
                    value={salesTypeOption(formData)?.find((option) => option.value === formData.saleType)}
                  />
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
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select">ST</label>
                  <SelectOption
                    options={stateOption(formData)}
                    onChange={(newValue) => {
                      setFormData(prev => ({ ...prev, state: newValue?.value! }))
                    }}
                    value={stateOption(formData)?.find((option) => option.value === formData.state)}
                  />

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
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select">Installer</label>
                  <SelectOption
                    options={installerOption(formData)}
                    onChange={(newValue) => {
                      setFormData(prev => ({ ...prev, installer: newValue?.value! }))
                    }}
                    value={installerOption(formData)?.find((option) => option.value === formData.installer)}
                  />
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
                </div>

                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Start Date"
                    value={formData.start}
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
                    value={formData.end}
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

            onClick={() => { }}
          />
        </div>
      </form >
    </div >
  );
};

export default CreatedArSchedule;
