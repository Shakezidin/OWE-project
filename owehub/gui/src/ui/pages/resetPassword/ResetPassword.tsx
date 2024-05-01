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
import { generateOTP } from "../../../redux/apiActions/authActions";
import { HTTP_STATUS } from "../../../core/models/api_models/RequestModel";
import { toast } from "react-toastify";
import { updateEmail } from "../../../redux/apiSlice/authSlice/resetPasswordSlice";
import { unwrapResult } from "@reduxjs/toolkit";

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
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (credentials.email_id.length === 0) {
      toast.warning('Please enter email Id.')
    } else {

      const actionResult = await dispatch(generateOTP({ email_id: credentials.email_id }));
      const result = unwrapResult(actionResult);
      if (result.status === HTTP_STATUS.OK) {
       
        dispatch(updateEmail(credentials.email_id))
         toast.success(result.message);
         navigate("/otp");
      }else{
        toast.success(result.message);
      }
    
     
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
                <span className={"loginHeader"}>OWE HUB</span>
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
                title="Request OTP"
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
