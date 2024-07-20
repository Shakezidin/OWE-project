import './PerformanceCards.css';
import { ICONS } from '../../../icons/Icons';
import { MdOutlineIosShare } from 'react-icons/md';
import { MdContentCopy } from 'react-icons/md';

import React, { Dispatch, SetStateAction, useRef, useState } from 'react';

import SocialShare from '../../batterBackupCalculator/components/SocialShare';

interface performance {
  details: any;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  socialUrl: string;
  shareImage: () => void;
  isGenerating: boolean;
}

const PerformanceCards: React.FC<performance> = ({
  details,
  setIsOpen,
  isOpen,
  socialUrl,
  shareImage,
  isGenerating,
}) => {
  const rank1 = details.find((item: any) => item?.rank === 1);
  const rank2 = details.find((item: any) => item?.rank === 2);
  const rank3 = details.find((item: any) => item?.rank === 3);

  return (
    <div>
      <div className="performance-cards">
        <div className="right-button">
          <div className="relative">
            <button className="share-button" onClick={shareImage}>
              <MdOutlineIosShare className="share-svg" />
              <p> {isGenerating ? 'Generating link' : 'Share'} </p>
            </button>
            {isOpen && (
              <SocialShare setIsOpen={setIsOpen} socialUrl={socialUrl} />
            )}
          </div>
        </div>
        <div className="banner-heading">
          <img src={ICONS.Performars} aria-label="login-icon"></img>
          <p>Based on most sales in the last 1 month.</p>
        </div>
        <div className="cards flex justify-between">
          <div className="card-one">
            <div className="upper-section">
              <img src={ICONS.GreyTwo} aria-label="grey-icon"></img>
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
                <p>{rank2?.count ?? 0} sales</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>{rank2?.kw?.toFixed?.(2)} KW</p>
                <p>For this month</p>
              </div>
              <div className="below-des mx-auto" style={{ gridColumn: '1/3' }}>
                <p className="text-center"> {rank2?.install_count}</p>
                <p>For this month</p>
              </div>
            </div>
          </div>
          <div className="card-two">
            <div className="upper-section">
              <img src={ICONS.GoldOne} aria-label="grey-icon"></img>
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
                <p>{rank1?.count ?? 0} sales</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>{rank1?.kw?.toFixed?.(2)} KW</p>
                <p>For this month</p>
              </div>
              <div className="below-des mx-auto" style={{ gridColumn: '1/3' }}>
                <p className="text-center">{rank1?.install_count}</p>

                <p>For this month</p>
              </div>
            </div>
          </div>
          <div className="card-three">
            <div className="upper-section">
              <img src={ICONS.BrownThree} aria-label="grey-icon"></img>
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
                <p>{rank3?.sale ?? 0} sales</p>
                <p>For this month</p>
              </div>
              <div className="below-des">
                <p>{rank3?.kw?.toFixed?.(2)} KW</p>
                <p>For this month</p>
              </div>
              <div className="below-des mx-auto" style={{ gridColumn: '1/3' }}>
                <p className="text-center">{rank3?.install_count}</p>

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
