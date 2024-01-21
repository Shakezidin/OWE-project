/**
 * Created by satishazad on 13/01/24
 * File Name: LoginPage
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/ui/pages
 */

import React, {useCallback, useState} from "react";
import Switch from "@mui/material/Switch";
import "./LoginPage.css";
import { ICONS } from "../../icons/Icons";
import { useNavigate } from "react-router-dom";
import { ReactComponent as LOGO_SMALL } from "../../../resources/assets/commisson_small_logo.svg";
import { ReactComponent as UNDER_LINE } from "../../../resources/assets/BlueAndGreenUnderline.svg";
import Input from "../../components/text_input/Input";
import Button from "@mui/material/Button";
import { ActionButton } from "../../components/button/ActionButton";
import { ROUTES } from "../../../navigation/Routes";
import {loginAPI} from "../../../infrastructure/web_api/services/AuthService";
import {useAuthData} from "../../../redux/context/AuthWrapper";
import {Credentials} from "../../../core/models/api_models/AuthModel";

const label = { inputProps: { "aria-label": "Switch demo" } };

export const LoginPage = () => {

  const navigate = useNavigate();
  const { login } = useAuthData();
  const [ credential, setCredential ] = useState<Credentials>({ username: '', password: ''});

  const doLogin = useCallback(() => {
      if (login) {
          login(credential.username, credential.password).then(() => {
              navigate(ROUTES.HOME);
          }).catch((e: unknown) => {
              console.log('ERROR: ', e);
          });
      }
  }, []);

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
          <div className={"hrLine"}/>
          <span className={"loginNormalTextDescription"}>{"YOUR TRUSTED SOLAR EXPERTS"}</span>
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
            <span className="loginLogText">Log In</span>

            <Input type={"text"} value={"Commission App"} placeholder={"Commission App"} onChange={() => {} }/>

            <Input
                type={"text"}
                value={credential.username}
                placeholder={"Enter Email"}
                onChange={(e) => setCredential({ ...credential, username: e.target.value}) }/>

            <Input
                type={"password"}
                value={credential.password}
                placeholder={"Enter Password"}
                onChange={(e) => setCredential({ ...credential, password: e.target.value})}/>

            <br />

            <div className="loginSwitchView">
              <div className="loginSwitchInnerView">
                <Switch {...label} defaultChecked />
                <div className="loginRBM">Remember Me</div>
              </div>
              <Button style={{
                  color: "#d93f21",
                  fontFamily: "Poppins",
                  fontSize: "12px",
                  fontWeight: 400,
                }}
                size="small"
                onClick={() => {
                  navigate(ROUTES.RESET_PASSWORD);
                }}>
                Recover Password
              </Button>
            </div>
            <br />
            <ActionButton
              title="Log In"
              onClick={() => {
                  doLogin()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
