/**
 * Created by satishazad on 13/01/24
 * File Name: LoginPage
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/ui/pages
 */

import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { ICONS } from "../../icons/Icons";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as LOGO_SMALL } from "../../../resources/assets/commisson_small_logo.svg";
import { ReactComponent as UNDER_LINE } from "../../../resources/assets/BlueAndGreenUnderline.svg";
import Input from "../../components/text_input/Input";
import { ActionButton } from "../../components/button/ActionButton";
import { Credentials } from "../../../core/models/api_models/AuthModel";
import { ROUTES } from "../../../routes/routes";
import { toast } from "react-toastify";
import { loginAction } from "../../../redux/apiActions/authActions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { HTTP_STATUS } from "../../../core/models/api_models/RequestModel";
import { unwrapResult } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store";
import Loading from "../../components/loader/Loading";
import { TYPE_OF_USER } from "../../../resources/static_data/Constant";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credentials>({
    email_id: "",
    password: "",
    isRememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
 
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: RootState) => state.auth);

  const handleInputChange = (name: string, value: any) => {
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /** handle local storage */
  useEffect(() => {
    let localRememberMe = localStorage.getItem("isRememberMe");
    let localEmail = localStorage.getItem("email");
    let localPassword = localStorage.getItem("password");

    if (localRememberMe === "true") {
      handleInputChange("email_id", localEmail);
      handleInputChange("password", localPassword);
      handleInputChange("isRememberMe", localRememberMe === 'true');
    }
  }, []);

  /** email validation */
  const isValidEmail = (email: string) => {
    // Regular expression pattern for validating email addresses
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (credentials.email_id.length === 0) {
        toast.warn("Please enter email id");
      } else if (!isValidEmail(credentials.email_id)) {
        toast.warning("Please enter a valid email id");
      } else if (credentials.password.length === 0) {
        toast.warning("Please enter the password");
      } else {
        const actionResult = await dispatch(loginAction(credentials));
        const result = unwrapResult(actionResult);
        if (result.status === HTTP_STATUS.OK) {
          toast.success(result.message);
          const {
            email_id,
            user_name,
            role_name,
            access_token,
            time_to_expire_minutes,
            is_password_change_required,
          } = result.data;
          localStorage.setItem("email", email_id);
          localStorage.setItem("userName", user_name);
          localStorage.setItem("role", role_name);
          localStorage.setItem("token", access_token);
          localStorage.setItem("password", credentials.password);
          localStorage.setItem("expirationTimeInMin", '1');
          localStorage.setItem(
            "expirationTime",
            (
              Date.now() +
              parseInt('1') * 60 * 1000
            ).toString()
          );
          localStorage.setItem(
            "isRememberMe",
            credentials.isRememberMe.toString()
          );
          localStorage.setItem(
            "is_password_change_required",
            is_password_change_required
          );
          if(role_name === TYPE_OF_USER.DB_USER){
            navigate(ROUTES.DB_MANAGER_DASHBOARD);
          }else{
            navigate(ROUTES.PROJECT_PERFORMANCE);
          }
         
        } else {
          toast.error(result.message);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }; 

  /** UI render */

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
          <div className={"hrLine"} />
          <span className={"loginNormalTextDescription"}>
            {"YOUR TRUSTED SOLAR EXPERTS"}
          </span>
        </div>

        <div className={"loginBox2"}>
          <form onSubmit={(e) => handleLogin(e)}>
            <div className="loginTextView">
            <object type="image/svg+xml" className="loginImageLogo"  data={ICONS.LOGO} aria-label="login-icon"></object>
              <br />
              <div className="loginLogowithText">
                <LOGO_SMALL />
                <span className={"loginHeader"}>OWE HUB</span>
              </div>
              <div className="loginUnderLine">
                <UNDER_LINE />
              </div>
              <span className="loginLogText">Log In</span>
              <br />

           <div className="login-input">
           <Input
                type={"text"}
                name={"email_id"}
                value={credentials.email_id}
                placeholder={"Enter Email"}
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleInputChange(name, value);
                }}
              />
              <Input
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                name={"password"}
                placeholder={"Enter Password"}
                onChange={(e) => {
                  const { name, value } = e.target;
                  handleInputChange(name, value);
                }}
                isTypePassword={true}
                onClickEyeIcon={() => {
                  setShowPassword(!showPassword);
                }}
              />
           </div>

              <br />
              <div className="loginSwitchView">
                <div className="loginSwitchInnerView">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={credentials.isRememberMe}
                      onChange={(event) => {
                        handleInputChange(
                          "isRememberMe",
                          !credentials.isRememberMe
                        );

                        console.log(event.target.value);
                      }}
                    />

                    <span className="slider round"></span>
                  </label>
                  <div className="loginRBM">Remember Me</div>
                </div>
                <Link to={ROUTES.RESETPASSWORD} className="reset-password">
                  Recover Password
                </Link>
              </div>
              <br />
              <button className="login-button" title="Log In" type="submit" onClick={() => {}}>Log In</button>
            </div>
          </form>
        </div>
        {loading && (
        <div>
          <Loading /> {loading}
        </div>
      )}
      </div>
    </div>
  );
};
