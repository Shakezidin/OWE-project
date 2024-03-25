import React, { useState } from "react";
import "./EnterOtpScreen.css";
import { ICONS } from "../../icons/Icons";
import { ReactComponent as LOGO_SMALL } from "../../../resources/assets/commisson_small_logo.svg";
import { ReactComponent as UNDER_LINE } from "../../../resources/assets/BlueAndGreenUnderline.svg";
import Input from "../../components/text_input/Input";
import { ActionButton } from "../../components/button/ActionButton";
import { otpModel } from "../../../core/models/api_models/AuthModel";
import { useNavigate } from "react-router-dom";

const EnterOtpScreen = () => {
  const navigate = useNavigate()
  const[otpCred,setOtpCred] = useState<otpModel>({
    email_id:"",
    otp:"",
    new_password:""
  })
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtpCred(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleOtpSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
 e.preventDefault()
 console.log(otpCred)

  }
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
         <form onSubmit={(e)=>handleOtpSubmit(e)}>
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
            <span className="loginLogText">Reset Password</span>
            <br />
            <Input
              type={"text"}
              name="otp"
              value={otpCred.otp}
              placeholder={"Enter OTP"}
              onChange={handleInputChange}
            />
            <br />
            <Input
              type={"password"}
              value={otpCred.new_password}
              name="new_password"
              placeholder={"New Password"}
              onChange={handleInputChange}
            />
            <br />
            <Input
              type={"password"}
              value={""}
              name=""
              placeholder={"Confirm Password"}
              onChange={handleInputChange}
            />

            <br />
            <ActionButton title="Submit"  type="submit"
              onClick={()=>{}} />
          </div>
         </form>
        </div>
      </div>
    </div>
  );
};

export default EnterOtpScreen;
