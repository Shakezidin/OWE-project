import React, { useState } from "react";
import "./ResetPassword.css";
import { ReactComponent as LOGO_SMALL } from "../../../resources/assets/commisson_small_logo.svg";
import { ReactComponent as UNDER_LINE } from "../../../resources/assets/BlueAndGreenUnderline.svg";
import { ICONS } from "../../icons/Icons";

import { useNavigate } from "react-router-dom";
import Input from "../../components/text_input/Input";
import { ActionButton } from "../../components/button/ActionButton";
import { resetPassword } from "../../../core/models/api_models/AuthModel";
import { useAppDispatch } from "../../../redux/hooks";
import { generateOTP } from "../../../redux/apiSlice/authSlice/resetPasswordSlice";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [credentials, setCredentials] = useState<resetPassword>({
    email_id: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (credentials.email_id.length === 0) {
      alert("Please enter email Id.");
    } else {
      dispatch(generateOTP({ email_id: credentials.email_id }));
      navigate("/otp");
    }
  };
  return (
    <div className="mainContainer">
      <div className={"overlay"} />
      <div className={"container"}>
        <div className={"loginBox"}>
          <span id="loginNormalText">
            {"Our World Revolves"}
            <br />
            Around
            <span id="loginColorText">{" Powering "}</span>
            Yours
          </span>
          <div className={"hrLine"}></div>
          <span className={"loginNormalTextDescription"}>
            {"YOUR TRUSTED SOLAR EXPERTS"}
          </span>
        </div>

        <div className={"loginBox2"}>
          <form onSubmit={(e) => handleEmailSubmit(e)}>
            <div className="loginTextView">
              <img className="loginImageLogo" src={ICONS.LOGO} alt="" />
              <br />
              <div className="loginLogowithText">
                <LOGO_SMALL />
                <span className={"loginHeader"}> Commission App</span>
              </div>
              <div className="loginUnderLine">
                <UNDER_LINE />
              </div>
              <span className="loginLogText">Enter Your Email Address</span>
              <br />
              <Input
                type={"text"}
                value={credentials.email_id}
                name="email_id"
                placeholder={"Enter Email"}
                onChange={handleInputChange}
              />

              <br />
              <ActionButton
                title="Request Reset Link"
                type="submit"
                onClick={() => {}}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
