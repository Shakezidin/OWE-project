import React, { useRef } from "react";
import Input from "../../components/text_input/Input";
import { ICONS } from "../../icons/Icons";
import "./support.css";
import Select from "react-select";
import { ActionButton } from "../../components/button/ActionButton";
import CreateProfileUser from "../accountSettings/CreateProfileUser";
import ProjectBreakdown from "../dashboard/ProjectBreakdown";

const TechnicalSupport = () => {
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
      <div className="support-cont-section">
        <div className="support-container">
          <div className="support-section">
            <h3>Support</h3>
          </div>
          <div className="supportImage">
            <img src={ICONS.supportImage} alt="" />
          </div>
        </div>

        <div className="vertical-support"></div>
        <div className="touch-container">
          <div className="touch-info">
            <p>Get In Touch with us for more Information</p>
          </div>
          <div className="create-input-container-support">
            <div className="create-input-field-support">
              <Input
                type={"text"}
                label="First Name"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
            <div className="create-input-field-support">
              <Input
                type={"text"}
                label="Last Name"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
          </div>
          <div className="create-input-container-support">
            <div className="create-input-field-support">
              <Input
                type={"text"}
                label="Email"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
            <div className="create-input-field-support">
              <Input
                type={"text"}
                label="Phone Number"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
          </div>

          <div className="create-input-container-support">
            <div className="create-input-field-support">
              <label className="inputLabel">Issue</label>
              <Select
                // options={repTypeOption(newFormData) || respTypeData}
                isSearchable
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    marginTop: "4.5px",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "13px",
                    // height: "2.25rem",

                    border: "1px solid #d0d5dd",
                  }),

                  indicatorSeparator: () => ({
                    display: "none", // Hide the indicator separator
                  }),
                }}
              />
            </div>

            <div className="create-input-field-support" style={{marginTop:".4rem"}}>
                <label className="inputLabel">
                  <p>Attach File</p>
                </label>
                <div className="file-input-container">
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
                      Browse
                    </button>
                  </div>
             
              </div>
            </div>
          </div>

          <div
            className="create-input-field-note-support"
            style={{ marginTop: "0.3rem" }}
          >
            <label htmlFor="" className="inputLabel">
              Message
            </label>
            <br />
            <textarea
              name="description"
              id=""
              rows={4}
              onChange={(e) => {}}
              value={""}
              placeholder="Type here..."
              style={{ marginTop: "0.3rem" }}
            ></textarea>
          </div>

          <div className="reset-Update-support">
            <ActionButton title={"Submit"} type="submit" onClick={() => {}} />
          </div>
        </div>
      </div>
      {/* <ProjectBreakdown/> */}
      {/* <CreateProfileUser/> */}
    </>
  );
};

export default TechnicalSupport;
