import './Banner.css';
import { ICONS } from '../../../icons/Icons';
import { LiaEdit } from "react-icons/lia";
import EditModal from './EditModal';
import { useState } from 'react';


const Banner = () => {
  const [showModal, setShowModal] = useState(false)
  return (
    <div className="banner-main flex items-center">
      {/* left side  */}
      <div className="flex items-center pl4 banner-left">
        <object
          type="image/svg+xml"
          data={ICONS.BannerLogo}
          aria-label="solar-name-icon"
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
            aria-label="login-icon"
          ></object>
        </div>
        <button className="edit-button" onClick={() => setShowModal(true)}>
            <LiaEdit className="edit-svg" />
            <p>Edit</p>
          </button>
      </div>
      {showModal && <EditModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Banner;
