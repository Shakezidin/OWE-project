import React from "react";
import "./ResetPassword.css";

import { ICONS } from "../../icons/Icons";
import { ROUTES } from "../../../navigation/Routes";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  return (
    <div className={"container"}>
      <div className={"overlay"} />

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
          <img src={ICONS.LOGO} />
          <br />
          <br />
          <span className={"loginHeader"}>{"Log In Your Account"}</span>
          <br />
          <span className={"loginSubtitle"}>
            {"Enter below details to acces your"}
            <span className={"loginSubtitleColor"}>{" Commission App "}</span>
            {"account"}
          </span>
          <br />
          <br />
          <input className={"inputField"} placeholder="Enter Email" />
          <br />
          <br />
          <button
            className={"loginButton"}
            onClick={() => {
              navigate(ROUTES.ENTER_OTP);
            }}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
