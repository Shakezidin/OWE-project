import './PerformanceCards.css';
import { ICONS } from '../../../icons/Icons';
import { MdOutlineIosShare } from 'react-icons/md';
import { MdContentCopy } from 'react-icons/md';

const PerformanceCards = () => {
  return (
    <div>
      <div className="performance-cards">
        <div className="right-button">
          <button className="share-button">
            <MdOutlineIosShare className="share-svg" />
            <p>share</p>
          </button>
        </div>
        <div className="banner-heading">
          <object
            type="image/svg+xml"
            data={ICONS.Performars}
            aria-label="login-icon"
          ></object>
          <p>Based on most sales in the last 1 month.</p>
        </div>
        <div className="cards flex justify-between">
          <div className="card-one">
            <div className="upper-section">
              <object
                type="image/svg+xml"
                data={ICONS.GreyTwo}
                width={70}
                aria-label="grey-icon"
              ></object>
              <div className="flex flex-column card-title">
                <h2>Simon</h2>
                <p>
                  OUR31245
                  <span>
                    <MdContentCopy />
                  </span>
                </p>
              </div>
            </div>
            <div className="dashed-border"></div>
            <div className="below-section">
              <div className="below-des">
                <p>120 sales</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>1265.65 KW</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>54 Installs</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>$2564.23</p>
                <p>For this month</p>
              </div>
            </div>
          </div>
          <div className="card-two">
            <div className="upper-section">
              <object
                type="image/svg+xml"
                data={ICONS.GoldOne}
                width={70}
                aria-label="grey-icon"
              ></object>
              <div className="flex flex-column card-title">
                <h2>Royal Ankir</h2>
                <p>
                  OUR31245
                  <span>
                    <MdContentCopy />
                  </span>
                </p>
              </div>
            </div>
            <div className="dashed-border"></div>
            <div className="below-section">
              <div className="below-des">
                <p>120 sales</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>1265.65 KW</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>54 Installs</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>$2564.23</p>
                <p>For this month</p>
              </div>
            </div>
          </div>
          <div className="card-three">
            <div className="upper-section">
              <object
                type="image/svg+xml"
                data={ICONS.BrownThree}
                width={70}
                aria-label="grey-icon"
              ></object>
              <div className="flex flex-column card-title">
                <h2>Washi Bin</h2>
                <p>
                  OUR31245
                  <span>
                    <MdContentCopy />
                  </span>
                </p>
              </div>
            </div>
            <div className="dashed-border"></div>
            <div className="below-section">
              <div className="below-des">
                <p>120 sales</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>1265.65 KW</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>54 Installs</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>$2564.23</p>
                <p>For this month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCards;
