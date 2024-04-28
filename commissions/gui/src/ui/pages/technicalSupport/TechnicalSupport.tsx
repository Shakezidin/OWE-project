import React, { useRef, useState } from "react";
import Input from "../../components/text_input/Input";
import { ICONS } from "../../icons/Icons";
import "./support.css";
import Select from "react-select";
import { ActionButton } from "../../components/button/ActionButton";

const TechnicalSupport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic
    const newErrors = {
      firstName: firstName ? "" : "First name is required",
      lastName: lastName ? "" : "Last name is required",
      email: emailRegex.test(email) ? "" : "Invalid email address",
      phoneNumber: phoneRegex.test(phoneNumber) ? "" : "Invalid phone number",
      message: message ? "" : "Message is required",
    };
    setErrors(newErrors);

    // If there are no errors, submit the form
    if (!Object.values(newErrors).some((error) => error)) {
      // Your form submission logic here
      console.log("Form submitted successfully");
    }
  };
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void => {
  //   setState({
  //     user: {
  //       ...state.user,
  //       [event.target.name]: event.target.value,
  //     }
  //   })
  // }

  //   if (state.user.firstName.length === 0) {
  //     alert('please provide first name')

  //   } else if (state.user.lastName.length === 0) {
  //     alert('please provide last name')
  //   }
  //   else if (state.user.email.length === 0) {
  //     alert('please provide Email name')
  //   }
  //   else if (state.user.phoneNum.length === 0) {
  //     alert('please provide Phone number')
  //   }
  //   else if (state.user.message.length === 0) {
  //     alert('please provide message')
  //   }
  //    else {

  //     console.log(state.user)
  //   }

  // }

  const options = [
    { value: "option1", label: "OWE" },
    { value: "option2", label: "OWE 2" },
    { value: "option3", label: "OWE 3" },
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
      <form onSubmit={handleSubmit}>
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
                  value={firstName}
                  name="firstName"
                  placeholder={"Enter"}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName}</span>
                )}
              </div>
              <div className="create-input-field-support">
                <Input
                  type={"text"}
                  label="Last Name"
                  value={lastName}
                  name="lastName"
                  placeholder={"Enter"}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName}</span>
                )}
              </div>
            </div>
            <div className="create-input-container-support">
              <div className="create-input-field-support">
                <Input
                  type={"text"}
                  label="Email"
                  value={email}
                  name="email"
                  placeholder={"Enter"}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="create-input-field-support">
                <Input
                  type={"text"}
                  label="Phone Number"
                  value={phoneNumber}
                  name="phoneNum"
                  placeholder={"Enter"}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {errors.phoneNumber && (
                  <span className="error">{errors.phoneNumber}</span>
                )}
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
                      fontSize: "10px",
                      // height: "2.25rem",

                      border: "1px solid #d0d5dd",
                    }),

                    indicatorSeparator: () => ({
                      display: "none", // Hide the indicator separator
                    }),
                  }}
                />
              </div>

              <div
                className="create-input-field-support"
                style={{ marginTop: ".2rem" }}
                >
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
              style={{ marginTop: "0.3rem" }} >
              <label htmlFor="" className="inputLabel">
                Message
              </label>
              <br />
              <textarea
                name="message"
                id=""
                rows={4}
                value={message}
                placeholder="Type here..."
                style={{ marginTop: "0.3rem" }}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              {errors.message && (
                <span className="error">{errors.message}</span>
              )}
            </div>

            <div className="reset-Update-support">
              <button type="submit">Submit</button>

              {/* <ActionButton title={"Submit"} type="submit" onClick={() => {handleSubmit}} /> */}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default TechnicalSupport;
