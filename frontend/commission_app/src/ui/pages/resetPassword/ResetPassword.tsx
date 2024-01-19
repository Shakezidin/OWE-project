import React from "react";
import "./ResetPassword.css";
import { Switch } from "@mui/material";
import { ICONS } from "../../icons/Icons";

const ResetPassword = () => {
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
              // navigat(ROUTES.RESET_PASSWORD);
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
