import React, { useRef, useState } from "react";
import Input from "../../components/text_input/Input";
import { ICONS } from "../../icons/Icons";
import "./support.css";
import Select from "react-select";
import { ActionButton } from "../../components/button/ActionButton";
import { SupportModel } from "../../../core/models/supportModel/SupportModel";

interface IState {
  user: SupportModel
}

const TechnicalSupport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setFormError] = useState({})
  const [selectedOption, setSelectedOption] = useState(null);

  const [state, setState] = useState<IState>({
    user: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
      phoneNum: ""

    }
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void => {
    setState({
      user: {
        ...state.user,
        [event.target.name]: event.target.value,
      }
    })
  }

  const handleSubmit = () => {
    //alert("Email Send Successfully")

    if (state.user.firstName.length === 0) {
      alert('please provide first name')
    } else if (state.user.lastName.length === 0) {
      alert('please provide last name')
    } else {

      console.log(state.user)
    }

  }

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" }
  ];
  const handleSelectChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };
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
            <h3>Support</h3>
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
                value={state.user.firstName}
                name="firstName"
                placeholder={"Enter"}
                onChange={handleChange}
              />
            </div>
            <div className="create-input-field-support">
              <Input
                type={"text"}
                label="Last Name"
                value={state.user.lastName}
                name="lastName"
                placeholder={"Enter"}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="create-input-container-support">
            <div className="create-input-field-support">
              <Input
                type={"text"}
                label="Email"
                value={state.user.email}
                name="email"
                placeholder={"Enter"}
                onChange={handleChange}
              />
            </div>
            <div className="create-input-field-support">
              <Input
                type={"text"}
                label="Phone Number"
                value={state.user.phoneNum}
                name="phoneNum"
                placeholder={"Enter"}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="create-input-container-support">
            <div className="create-input-field-support">
              <label className="inputLabel">Issue</label>
              <Select
                options={options}
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

            <div className="create-input-field-support" style={{ marginTop: ".2rem" }}>
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
              name="message"
              id=""
              rows={4}
              value={state.user.message}
              placeholder="Type here..."
              style={{ marginTop: "0.3rem" }}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="reset-Update-support">
            <ActionButton title={"Submit"} type="submit" onClick={() => {
              handleSubmit()
            }} />
          </div>
        </div>
      </div>

    </>
  );
};

export default TechnicalSupport;
