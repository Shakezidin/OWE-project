import './PerformanceCards.css';
import { ICONS } from '../../../icons/Icons';
import { MdOutlineIosShare } from 'react-icons/md';
import { MdContentCopy } from 'react-icons/md';

interface performance {
  details: any;
}

const PerformanceCards: React.FC<performance> = ({ details }) => {
  console.log(details, 'details');
  const rank1 = details.find((item: any) => item?.rank === 1);
  const rank2 = details.find((item: any) => item?.rank === 2);
  const rank3 = details.find((item: any) => item?.rank === 3);

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
        <div className="cards flex justify-between" style={{ gap: 60 }}>
          <div className="card-one">
            <div className="upper-section">
              <object
                type="image/svg+xml"
                data={ICONS.GreyTwo}
                width={70}
                aria-label="grey-icon"
              ></object>
              <div className="flex flex-column card-title">
                <h2>{rank2?.rep_name}</h2>
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
                <p>{rank2?.count} sales</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>{rank2?.kw?.toFixed?.(2)} KW</p>
                <p>For this month</p>
              </div>
              <div className="below-des mx-auto" style={{ gridColumn: '1/3' }}>
                <p>54 Installs</p>
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
                <h2>{rank1?.rep_name}</h2>
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
                <p>{rank1?.count} sales</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>{rank1?.kw?.toFixed?.(2)} KW</p>
                <p>For this month</p>
              </div>
              <div className="below-des mx-auto" style={{ gridColumn: '1/3' }}>
                <p>54 Installs</p>
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
                <h2>{rank3?.rep_name}</h2>
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
                <p>{rank3?.sale} sales</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>{rank3?.kw?.toFixed?.(2)} KW</p>
                <p>For this month</p>
              </div>
              <div className="below-des mx-auto" style={{ gridColumn: '1/3' }}>
                <p>54 Installs</p>
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
