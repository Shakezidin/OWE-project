import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { createAdjustments,updateAdjustments,IRateRow } from "../../../../redux/apiActions/arAdjustmentsAction";
import {
  installerOption,
  partnerOption,
  salesTypeOption,
  stateOption,
} from "../../../../core/models/data_models/SelectDataModel";
import { format } from "date-fns";
import SelectOption from "../../../components/selectOption/SelectOption";
import { resetSuccess } from "../../../../redux/apiSlice/configSlice/config_get_slice/arAdjusments";
interface payScheduleProps {
  handleClose: () => void,
  editMode: boolean,
  setViewArchived:React.Dispatch<React.SetStateAction<boolean>>
  editData:IRateRow|null
}


const CreatedAdjustments: React.FC<payScheduleProps> = ({ handleClose, editMode,setViewArchived,editData }) => {
  const dispatch = useAppDispatch();


  const [newFormData, setNewFormData] = useState({
    uniqueId:editData?.unique_id|| "",
    customer:editData?.customer|| "",
    partnerName:editData?.partner_name|| "",
    installerName: editData?.installer_name||"",
    sysSize:editData?.sys_size?`${editData?.sys_size}`: "",
    bl:editData?.bl|| "",
    epc:editData?.epc?`${editData?.epc}`: "",
    date:editData?.date|| "",
    amount: editData?.amount?`${editData?.amount}`: "",
    notes: editData?.notes||"",
    startDate:editData?.start_date|| "",
    endDate:editData?.end_date||  "",
    stateName: editData?.state_name||""
  })
  const { isSuccess } = useAppSelector(state => state.arAdjusments)

  const tableData = {
    tableNames: ["partners", "states", "installers", "sale_type"]
  }
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData)
    setNewFormData(prev => ({ ...prev, ...res.data }))
  }
  React.useEffect(() => {
    getNewFormData()
  }, [])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    if (name === "amount" || name === "epc" || name === "sysSize") {
      if (value === "" || value === "0" || Number(value)) {
        setNewFormData(prev => ({ ...prev, [name]: value }))
      }
    }
    else {
      setNewFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setViewArchived(false)
    if(editMode){
dispatch(updateAdjustments({
  unique_id: newFormData.uniqueId,
  customer: newFormData.customer,
  partner_name: newFormData.partnerName,
  state_name: newFormData.stateName,
  installer_name: newFormData.installerName,
  sys_size: parseFloat(newFormData.sysSize),
  bl: newFormData.bl,
  epc: parseFloat(newFormData.epc),
  date: format(new Date(newFormData.date), "yyyy-MM-dd"),
  notes: newFormData.notes,
  amount: parseFloat(newFormData.amount),
  "start_date": format(new Date(newFormData.startDate), "yyyy-MM-dd"),
  "end_date": format(new Date(newFormData.endDate), "yyyy-MM-dd"),
  record_id:editData?.record_id!
}))
    }else{

      dispatch(createAdjustments({
        unique_id: newFormData.uniqueId,
        customer: newFormData.customer,
        partner_name: newFormData.partnerName,
        state_name: newFormData.stateName,
        installer_name: newFormData.installerName,
        sys_size: parseFloat(newFormData.sysSize),
        bl: newFormData.bl,
        epc: parseFloat(newFormData.epc),
        date: format(new Date(newFormData.date), "yyyy-MM-dd"),
        notes: newFormData.notes,
        amount: parseFloat(newFormData.amount),
        "start_date": format(new Date(newFormData.startDate), "yyyy-MM-dd"),
        "end_date": format(new Date(newFormData.endDate), "yyyy-MM-dd")
      }))
    }
  }



  useEffect(() => {
    if (isSuccess) {
      handleClose()
      isSuccess && dispatch(resetSuccess()) 
    }
  }, [isSuccess])
  return (
    <div className="transparent-model">
      <form className="modal" onSubmit={handleSubmit} >

        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />

        </div>

        <h3 className="createProfileText">{editMode === false ? "Rep Pay Settings" : "Update RepPay Settings"}</h3>

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
                    label="Customer"
                    value={newFormData.customer}
                    name="customer"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">


                  <label className="inputLabel-select">Partners</label>
                  <SelectOption
                    options={partnerOption(newFormData)}
                    onChange={(newValue) => {
                      setNewFormData(prev => ({ ...prev, partnerName: newValue?.value! }))
                    }}
                    value={partnerOption(newFormData)?.find((option) => option.value === newFormData.partnerName)}
                  />
                </div>

              </div>



              <div className="create-input-container">

                <div className="create-input-field">
                  <label className="inputLabel-select">State</label>
                  <SelectOption
                    options={stateOption(newFormData)}
                    onChange={(newValue) => {
                      setNewFormData(prev => ({ ...prev, stateName: newValue?.value! }))
                    }}
                    value={stateOption(newFormData)?.find((option) => option.value === newFormData.stateName)}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Sys. Size"
                    value={newFormData.sysSize}
                    name="sysSize"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>

                <div className="create-input-field">

                  <label className="inputLabel-select">Installer</label>
                  <SelectOption
                    options={installerOption(newFormData)}
                    onChange={(newValue) => {
                      setNewFormData(prev => ({ ...prev, installerName: newValue?.value! }))
                    }}
                    value={installerOption(newFormData)?.find((option) => option.value === newFormData.installerName)}
                  />
                </div>


              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="BL"
                    value={newFormData.bl}
                    name="bl"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Epc"
                    value={newFormData.epc}
                    name="epc"
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
                    label="Amount"
                    value={newFormData.amount}
                    name="amount"
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

                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="startDate"
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
          <ActionButton title={"Cancel"} type="reset"
            onClick={() => handleClose()} />
          <ActionButton title={editMode === false ? "Save" : "Update"} type="submit"
            onClick={() => { }} />
        </div>




      </form>
    </div>
  );
};

export default CreatedAdjustments;
