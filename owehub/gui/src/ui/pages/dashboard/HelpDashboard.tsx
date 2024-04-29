import React,{useRef} from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileInputChange = (e: any) => {
    const file = e.target.files?.[0];
    console.log(file);
  };


  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Trigger file input click event
  };
  return (
    <>
      <div className="transparent-model-down">
      
          <div className="modal">
            <div className="help-section-container">
              <div className="help-section">
                <h3>Help</h3>
              </div>
              <div className="help-icon" onClick={handleClose}>
                <img src={ICONS.whiteCross} alt="" />
              </div>
            </div>
       <div className="modal-body">
       <div className="help-input-container">
          <div className="create-input-container" style={{width:"1740px"}}>
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
              <div className="create-input-field-help">
                <label className="inputLabel-help">
                  <p>Attach File</p>
                </label>
                <div className="file-input-container-help">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    className="file-input"
                  />
                  <div className="custom-button-container">
                    <span className="file-input-placeholder">Select File</span>
                    <button
                      className="custom-button"
                      
                      onClick={handleButtonClick}
                    >
                      <img src={ICONS.browserIcon} alt=""/>
                      Browse
                    </button>
                  </div>
                </div>
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