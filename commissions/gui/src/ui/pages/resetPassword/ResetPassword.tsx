import React from "react";
import "./ResetPassword.css";
import { ReactComponent as LOGO_SMALL } from "../../../resources/assets/commisson_small_logo.svg";
import { ReactComponent as UNDER_LINE } from "../../../resources/assets/BlueAndGreenUnderline.svg";
import { ICONS } from "../../icons/Icons";

import { useNavigate } from "react-router-dom";
import Input from "../../components/text_input/Input";
import { ActionButton } from "../../components/button/ActionButton";

const ResetPassword = () => {
  const navigate = useNavigate();
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
              value={""}
              placeholder={"Enter Email"}
              onChange={() => {}}
            />

            <br />
            <ActionButton
              title="Request  Reset Link"
              onClick={() => {
                navigate('/otp');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
