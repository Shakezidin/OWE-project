import React, { useRef } from "react";
import Input from "../../components/text_input/Input";
import { ICONS } from "../../icons/Icons";
import "./support.css";
import Select from "react-select";
import { ActionButton } from "../../components/button/ActionButton";
import HelpDashboard from "../dashboard/HelpDashboard";
// import CreateUserProfile from "../accountSettings/CreateUserProfile";

const TechnicalSupport = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: any) => {
    const file = e.target.files?.[0];
    // Do something with the selected file
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
          <div
            className="create-input-container"
            style={{ width: "100%", display: "flex", marginTop: "1rem" }}
          >
            <div className="create-input-field" style={{ width: "290px" }}>
              <Input
                type={"text"}
                label="First Name"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
            <div className="create-input-field" style={{ width: "290px" }}>
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
          <div
            className="create-input-container"
            style={{ width: "100%", display: "flex", marginTop: "1rem" }}
          >
            <div className="create-input-field" style={{ width: "290px" }}>
              <Input
                type={"text"}
                label="Email"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
              />
            </div>
            <div className="create-input-field" style={{ width: "290px" }}>
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
          <div className="" style={{ marginRight: "8rem" }}>
            <div
              className=""
              style={{ display: "flex", gap: "10rem", marginTop: "1rem" }}
            >
              <div className="create-input-field">
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
                      height: "2.25rem",
                      width: "290px",
                      border: "1px solid #d0d5dd",
                    }),

                    indicatorSeparator: () => ({
                      display: "none", // Hide the indicator separator
                    }),
                  }}
                />
              </div>

              <div className="rate-input-container">
                <div
                  className="rate-input-field"
                  style={{ width: "130px", marginRight: "1rem" }}
                >
                  <Input
                    type={"number"}
                    label="Project ID"
                    value={""}
                    name="rate"
                    placeholder={"Enter"}
                    onChange={(e) => {}}
                  />
                </div>

                <div className="rate-input-field">
                  {/* <Input
                    type={"file"}
                    label="Attach File"
                    value={""}
                    name="rl"
                    placeholder={"Select File"}
                    onChange={(e) => { }}
                    
                  /> */}
                  <label>
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
                      <span className="file-input-placeholder">
                        Select File
                      </span>
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
            </div>
          </div>
          <div
            className="create-input-field-note"
            style={{ marginTop: "1rem" }}
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
      {/* <CreateUserProfile /> */}
      <HelpDashboard/>
    </>
  );
};

export default TechnicalSupport;
