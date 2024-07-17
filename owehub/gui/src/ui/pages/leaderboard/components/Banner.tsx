import React from 'react';
import './Banner.css';
import { ICONS } from '../../../icons/Icons';

const Banner = () => {
  return (
    <div className="banner-main flex items-center">
      {/* left side  */}
      <div className="flex items-center pl4 banner-left">
        <object
          type="image/svg+xml"
          data={ICONS.BannerLogo}
          width={100}
          aria-label="login-icon"
        ></object>
        <div className="">
          <h1 className="solar-heading">United Solar</h1>
          <div className="flex items-center ">
            <object
              type="image/svg+xml"
              data={ICONS.OWEBannerLogo}
              aria-label="login-icon"
            ></object>
            <p className="left-ban-des">
              Powered by <br /> <span>Our World Energy</span>
            </p>
          </div>
        </div>
      </div>
      <div className="straight-line"></div>
      {/* right side  */}
      <div className="flex items-center banner-right">
        <div className="banner-names flex flex-column">
          <div>
            <p className="owner-heading">Owner Name</p>
            <p className="owner-names">Alex Morgan</p>
          </div>
          <div>
            <p className="owner-heading">Total Teams</p>
            <p className="owner-names">13 Teams</p>
          </div>
          <div>
            <p className="owner-heading">Team Strength</p>
            <p className="owner-names">56 Members</p>
          </div>
        </div>
        <div className="banner-trophy">
          <object
            type="image/svg+xml"
            data={ICONS.BannerTrophy}
            width={200}
            aria-label="login-icon"
          ></object>
        </div>
      </div>
    </div>
  );
};

export default Banner;
