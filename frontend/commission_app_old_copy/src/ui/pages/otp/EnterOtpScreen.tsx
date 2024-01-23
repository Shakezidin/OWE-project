import React from "react";
import "./EnterOtpScreen.css";
import { ICONS } from "../../icons/Icons";
import { ReactComponent as LOGO_SMALL } from "../../../resources/assets/commisson_small_logo.svg";
import { ReactComponent as UNDER_LINE } from "../../../resources/assets/BlueAndGreenUnderline.svg";
import Input from "../../components/text_input/Input";
import { ActionButton } from "../../components/button/ActionButton";

const EnterOtpScreen = () => {
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
            <img className="loginImageLogo" src={ICONS.LOGO} />
            <br />
            <div className="loginLogowithText">
              <LOGO_SMALL />
              <span className={"loginHeader"}> Commission App</span>
            </div>
            <div className="loginUnderLine">
              <UNDER_LINE />
            </div>
            <span className="loginLogText">Reset Password</span>
            <br />
            <Input
              type={"text"}
              value={""}
              placeholder={"Enter OTP"}
              onChange={() => {}}
            />
            <br />
            <Input
              type={"password"}
              value={""}
              placeholder={"New Password"}
              onChange={() => {}}
            />
            <br />
            <Input
              type={"password"}
              value={""}
              placeholder={"Confirm Password"}
              onChange={() => {}}
            />

            <br />
            <ActionButton title="Submit" onClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterOtpScreen;
