/**
 * Created by satishazad on 13/01/24
 * File Name: LoginPage
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/ui/pages
 */

import React, { useCallback, useEffect, useState } from "react";
import "./LoginPage.css";
import { ICONS } from "../../icons/Icons";
import { Navigate, useNavigate } from "react-router-dom";
import { ReactComponent as LOGO_SMALL } from "../../../resources/assets/commisson_small_logo.svg";
import { ReactComponent as UNDER_LINE } from "../../../resources/assets/BlueAndGreenUnderline.svg";
import Input from "../../components/text_input/Input";
import { ActionButton } from "../../components/button/ActionButton";
import { Credentials } from "../../../core/models/api_models/AuthModel";
import { loginSuccess } from '../../../redux/features/authSlice';
import { login } from "../../../infrastructure/web_api/services/apiUrl";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../../redux/store";
export const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credentials>({ email_id: '', password: '' });
  const [error, setError] = useState<string>('');
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const response = await login(credentials);
      const { email_id, role_name, access_token } = response.data;
      localStorage.setItem('email', email_id);
      localStorage.setItem('role', role_name);
      localStorage.setItem('token', access_token);
      dispatch(loginSuccess({ email_id, role_name, access_token }));
      navigate('/dashboard');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

 

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
  }


  //  const handleSubmit=async(e: React.FormEvent<HTMLFormElement>)=>{
  //   e.preventDefault()
  //  const res = await loginAPI(credentials)
  //  if(res.status===HTTP_STATUS.OK){
  //   alert(HTTP_STATUS.OK)
  //   navigate('/dashboard')
  //  }
  //  else{
  //   alert(HTTP_STATUS.BAD_REQUEST)
  //  }
  //  }

  //  useEffect(()=>{
  //  if(localStorage.getItem('token')){
  //   navigate('/dashboard')
  //  }
  //  },[])




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
          <span className={"loginNormalTextDescription"}>{"YOUR TRUSTED SOLAR EXPERTS"}</span>
        </div>

        <div className={"loginBox2"}>
          <form onSubmit={(e) => handleLogin(e)}>
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
              <span className="loginLogText">Log In</span>
              <br />
              <Input type={"text"} name="commission" value={"Commission App"} placeholder={"Commission App"} onChange={() => { }} />
              <br />
              <Input
                type={"text"}
                name={"email_id"}
                value={credentials.email_id}
                placeholder={"Enter Email"}
                onChange={handleInputChange} />
              <br />
              <Input
                type={"password"}
                value={credentials.password}
                name={"password"}
                placeholder={"Enter Password"}
                onChange={handleInputChange} />

              <br />
              <div className="loginSwitchView">
                <div className="loginSwitchInnerView">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                  <div className="loginRBM">Remember Me</div>
                </div>
                <button
                  className="reset-password"
                  onClick={() => {
                    navigate('/resetPassword');
                  }}>
                  Recover Password
                </button>
              </div>
              <br />
              <ActionButton
                title="Log In"
                type="submit"
                onClick={()=>{}}

                
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
