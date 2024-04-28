import React from "react";
import "../dashboard/dasboard.css";
import { ICONS } from "../../icons/Icons";
import Input from "../../components/text_input/Input";
import { ActionButton } from "../../components/button/ActionButton";
import { CommissionModel } from "../../../core/models/configuration/create/CommissionModel";

interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
  commission: CommissionModel | null;
}
const HelpDashboard: React.FC<ButtonProps> = ({
  editMode,
  handleClose,
  commission,
}) => {
  return (
    <>
      <div className="transparent-model-down">
      
          <div className="modal">
            <div className="help-section-container" style={{ display: "flex",alignItems:"center" }}>
              <div className="help-section">
                <h3>Help</h3>
              </div>
              <div className="help-icon" onClick={handleClose}>
                <img src={ICONS.crossIconUser} alt="" />
              </div>
            </div>
       <div className="modal-body">
       <div className="help-input-container">
          <div className="create-input-container">
              <div
                className="create-input-field"
                style={{}}
              >
                <Input
                  type={"text"}
                  label="Project ID"
                  value={""}
                  name="fee_rate"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                />
              </div>
            </div>

            <div className="create-input-container">
              <div className="create-input-field-help">
                <Input
                  type={"text"}
                  label="Dealer Name"
                  value={""}
                  name="fee_rate"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                />
              </div>

              <div className="create-input-field-help">
                <Input
                  type={"text"}
                  label="Sale Rep."
                  value={""}
                  name="pay_src"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                />
              </div>
              <div className="create-input-field-help">
                <Input
                  type={"text"}
                  label="Customer Name"
                  value={""}
                  name="pay_src"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                />
              </div>
            </div>

            <div className="create-input-container">
              <div className="create-input-field-help">
                <Input
                  type={"text"}
                  label="Amount Prepaid"
                  value={""}
                  name="fee_rate"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                />
              </div>

              <div className="create-input-field-help">
                <Input
                  type={"text"}
                  label="Pipeline Remaining"
                  value={""}
                  name="pay_src"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                />
              </div>
              <div className="create-input-field-help">
                <Input
                  type={"text"}
                  label="Current Date"
                  value={""}
                  name="pay_src"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                />
              </div>
            </div>
            <div className="create-input-container">
              <div className="create-input-field-help">
                <Input
                  type={"text"}
                  label="Project Status"
                  value={""}
                  name="fee_rate"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                />
              </div>

              <div className="create-input-field-help">
                <Input
                  type={"text"}
                  label="State"
                  value={""}
                  name="pay_src"
                  placeholder={"Enter"}
                  onChange={(e) => {}}
                />
              </div>
            </div>

            <div
              className="create-input-field-note"
              style={{  }}
            >
              <label
                htmlFor=""
                className="inputLabel"
              
              >
                Message
              </label>
              <br />
              <textarea
                name={""}
                id=""
                rows={4}
                onChange={(e) => {}}
                value={""}
                placeholder="Type here..."
                
              ></textarea>
            </div>

          
          </div>
       </div>
          <div
              className="createUserActionButton"
              style={{ marginTop: "1rem" }}
            >
              <ActionButton
                title={"Cancel"}
                type="reset"
                onClick={handleClose}
              />
              <ActionButton title={"Submit"} type="submit" onClick={() => {}} />
            </div>
          </div>
        </div>
   
    </>
  );
};

export default HelpDashboard;
