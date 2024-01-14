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
import CustomBox from "../../components/box/CustomBox";
import CommissionIcon from "../../../resources/assets/commission.svg";
import OweIcon from "../../../resources/assets/OWE.svg";
import ContractorIcon from "../../../resources/assets/contractor.svg";
import pandoIcon from "../../../resources/assets/pando.svg";
import AboutUsBig from "../../../resources/assets/aboutUsBig.png";
import AboutUsSmall from "../../../resources/assets/aboutUsSmall.png";
import { Link } from "react-router-dom";

export const WelcomePage = () => {
  return (
    <div className="welcomeMainContainer">
      <div className="welcomeBannerView">
        <div className="welcomeInnerBannerView">
          <div className="welcome-left-view">
            <div>
              <img className="welcome-logo" src={LogoImage} alt={"laptop"} />
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
            <img
              className="welcome-laptop-image"
              src={LaptopImage}
              alt="laptop"
            />
          </div>
        </div>
      </div>
      <div className="welcomeApplicationView">
        <div className="welcomeInnerApplicationView">
          <span className="welcome-our-text">Our Applications</span>

          <div className="welcomeBoxView">
            <CustomBox
              icon={CommissionIcon}
              title="Commission App"
              description="More than that, you can have any amount of layers attached "
              onClick={() => {
                alert("Commission");
              }}
            />
            <CustomBox
              icon={OweIcon}
              title="OWE ChatBot"
              description="More than that, you can have any amount of layers attached "
              onClick={() => {
                alert("Owe");
              }}
            />
            <CustomBox
              icon={ContractorIcon}
              title="Sub Contractor Hub"
              description="More than that, you can have any amount of layers attached "
              onClick={() => {
                alert("Sub Hub");
              }}
            />
            <CustomBox
              icon={pandoIcon}
              title="Pando"
              description="More than that, you can have any amount of layers attached "
              onClick={() => {
                alert("Pando");
              }}
            />
          </div>
        </div>
      </div>
      <div className="welcomeAboutUsView">
        <div className="welcomeAboutUsLeftView">
          <img className="welcomeAboutUsBig" src={AboutUsBig} alt="Icon" />
          <img className="welcomeAboutUsSmall" src={AboutUsSmall} alt="Icon" />
        </div>

        <div className="welcomeAboutUsRightView">
          <span className="welcomeAboutUsText">Know About Us</span>
          <p className="welcomeAboutPara">
            You can have any amount of paths for any layer properties. More than
            that, you can have any amount of layers attached to one path.
          </p>
          <p className="welcomeAboutPara">
            First, let's talk a little about what tool we will use. You can use{" "}
            <Link to="/">presets animation</Link>, keyframes animation, paths
            animation or <Link to="/">link animation</Link> for layer
            properties. We will work with paths. First, let's talk a little
            about what tool we will use. You can use{" "}
            <Link to="/">presets animation</Link>, keyframes animation, paths
            animation or <Link to="/">link animation</Link> for layer
            properties. We will work with paths.
          </p>
          <p className="welcomeAboutPara">
            You can animate objects along the path. They can rotate according to
            the path curvature and have X, Y and Rotation offsets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
