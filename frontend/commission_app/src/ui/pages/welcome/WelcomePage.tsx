/**
 * Created by satishazad on 13/01/24
 * File Name: WelcomePage
 * Product Name: WebStorm
 * Project Name: owe_web_app
 * Path: src/ui/pages/welcome
 */

import React from "react";
// import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";
import LogoImage from "../../../resources/assets/logo.png";
import LaptopImage from "../../../resources/assets/laptop.png";
import { ReactComponent as CallIcon } from "../../../resources/assets/phone-fill.svg";

export const WelcomePage = () => {
  return (
    <div className="welcomeMainContainer">
      <div className="welcomeBannerView">
        <div className="welcomeInnerBannerView">
          <div className="welcome-left-view">
            <div>
              <img className="welcome-logo" src={LogoImage} />
            </div>

            <h1 className="welcome-text-black">
              Our <span className="welcome-text-blue">World</span> Revolves
              <br />
              Around <span className="welcome-text-green">Powering</span> Yours
              <br />
              <span className="welcome-sub-text">
                Your Trusted Solar Expert
              </span>
            </h1>
          </div>
          <div className="welcome-right-view">
            <div className="welcome-phone-view">
              <CallIcon />
              <h3 className="welcome-phone-text">Call Us (623) 850-5700</h3>
            </div>
            <img className="welcome-laptop-image" src={LaptopImage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
