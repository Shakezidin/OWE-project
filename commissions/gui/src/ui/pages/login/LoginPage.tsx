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
import { useNavigate } from "react-router-dom";
import { ReactComponent as LOGO_SMALL } from "../../../resources/assets/commisson_small_logo.svg";
import { ReactComponent as UNDER_LINE } from "../../../resources/assets/BlueAndGreenUnderline.svg";
import Input from "../../components/text_input/Input";
import { ActionButton } from "../../components/button/ActionButton";
import { Credentials } from "../../../core/models/api_models/AuthModel";
import { loginSuccess } from "../../../redux/apiSlice/authSlice/authSlice";
import { login } from "../../../infrastructure/web_api/services/apiUrl";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credentials>({
    email_id: "",
    password: "",
    isRememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();

  const handleInputChange = (name: string, value: any) => {
    //const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /** handle local storage */
  useEffect(()=>{

    let localRememberMe = localStorage.getItem('isRememberMe');
    let localEmail = localStorage.getItem('email');
    let localPassword = localStorage.getItem('password');

    console.log(localEmail, localPassword, localRememberMe)
    if(localRememberMe === 'true'){
      handleInputChange('email_id', localEmail)
      handleInputChange('password', localPassword)
      handleInputChange('isRememberMe', localRememberMe)
    }

  },[])

  /** email validation */
  const isValidEmail = (email: string) => {
    // Regular expression pattern for validating email addresses
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  /** handle login action */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (credentials.email_id.length === 0) {
      alert("Please enter email id");
    } else if (!isValidEmail(credentials.email_id)) {
      alert("Please enter vaild email id");
    } else if (credentials.password.length === 0) {
      alert("Please enter the password");
    } else {
      try {
        const response = await login(credentials);
        const { email_id, role_name, access_token } = response.data;
        localStorage.setItem("email", email_id);
        localStorage.setItem("role", role_name);
        localStorage.setItem("token", access_token);
        localStorage.setItem('password', credentials.password)
        localStorage.setItem('isRememberMe', (credentials.isRememberMe).toString());
        dispatch(loginSuccess({ email_id, role_name, access_token }));
          navigate("/commission/dashboard");
      } catch (error) {
        alert("Please enter vaild credentails.");
      }
    }
  };

  if (isAuthenticated) {
    navigate("/commission/dashboard");
  }
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
              <img className="loginImageLogo" src={ICONS.LOGO} alt="" />
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
             
              <Input
                type={"text"}
                name={"email_id"}
                value={credentials.email_id}
                placeholder={"Enter Email"}
                onChange={(e)=>{
                  const {name, value} = e.target
                  handleInputChange(name, value)
                }}
              />
              <br />
              <Input
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                name={"password"}
                placeholder={"Enter Password"}
                onChange={(e)=>{
                  const {name, value} = e.target
                  handleInputChange(name, value)
                }}
                isTypePassword={true}
                onClickEyeIcon={() => {
                  setShowPassword(!showPassword);
                }}
              />

              <br />
              <div className="loginSwitchView">
                <div className="loginSwitchInnerView">
                  <label className="switch">
                    <input type="checkbox" checked={credentials.isRememberMe} onChange={(event)=>{
                      handleInputChange("isRememberMe", !credentials.isRememberMe)

                      console.log(event.target.value)
                    }}/>
                    <span className="slider round"></span>
                  </label>
                  <div className="loginRBM">Remember Me</div>
                </div>
                <button
                  className="reset-password"
                  onClick={() => {
                    navigate("/resetPassword");
                  }}
                >
                  Recover Password
                </button>
              </div>
              <br />
              <ActionButton title="Log In" type="submit" onClick={() => {}} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
