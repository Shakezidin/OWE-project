import React, { useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";

import { useAppDispatch } from "../../../../redux/hooks";
import { createAdjustments } from "../../../../redux/apiActions/arAdjustmentsAction";
import { format } from "date-fns";
interface payScheduleProps {
  handleClose: () => void,
  editMode: boolean,

}


const CreatedAdjustments: React.FC<payScheduleProps> = ({ handleClose, editMode }) => {
  const dispatch = useAppDispatch();


  const [newFormData, setNewFormData] = useState({
    uniqueId: "",
    customer: "",
    partnerName: "",
    installerName: "",
    sysSize: "",
    bl: "",
    epc: "",
    date: "",
    amount: "",
    notes: "",
    startDate: "",
    endDate: "",
    stateName: ""
  })

  const tableData = {
    tableNames: ["partners", "states", "installers", "sale_type"]
  }
  // const getNewFormData = async () => {
  //   const res = await postCaller(EndPoints.get_newFormData, tableData)
  //   setNewFormData(res.data)

  // }
  // useEffect(() => {
  //   getNewFormData()
  // }, [])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    if (name === "amount" || name==="epc"||name==="sysSize" ) {
      if (value==="" ||  value==="0"|| Number(value) ) {
        setNewFormData(prev => ({ ...prev, [name]: value }))
      }
    }
    else {
      setNewFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(createAdjustments({
      unique_id: newFormData.uniqueId,
      customer: newFormData.customer,
      partner_name: newFormData.partnerName,
      state_name: newFormData.stateName,
      installer_name: newFormData.installerName,
      sys_size: parseFloat(newFormData.sysSize),
      bl: newFormData.bl,
      epc: parseFloat(newFormData.epc),
      date: "2024-04-30T12:00:00Z",
      notes: newFormData.notes,
      amount: parseFloat(newFormData.amount),
    }))
  }



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
                  <Input
                    type={"text"}
                    label="Partner"
                    value={newFormData.partnerName}
                    name="partnerName"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>

              </div>



              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Installer"
                    value={newFormData.installerName}
                    name="installerName"
                    placeholder={"Enter"}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="State"
                    value={newFormData.stateName}
                    name="stateName"
                    placeholder={"Enter"}
                    onChange={handleChange}
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
