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
  activeHead:string;
}

const PerformanceCards: React.FC<performance> = ({
  details,
  setIsOpen,
  isOpen,
  socialUrl,
  shareImage,
  isGenerating,
  activeHead,
}) => {
  const rank1 = details.find((item: any) => item?.rank === 1);
  const rank2 = details.find((item: any) => item?.rank === 2);
  const rank3 = details.find((item: any) => item?.rank === 3);


  console.log(rank1, rank2, rank3, "hyrydfhgdf")

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
          <p>
            Adjust criteria below to see who leads in different categories..
          </p>
        </div>
        <div className="cards flex justify-between">
          {rank2 ? (
            <div className="card-one">
              <div className="upper-section">
                <img src={ICONS.GreyTwo} aria-label="grey-icon"></img>
                <div className="flex flex-column card-title">
                  <h2>{rank2?.rep_name || "N/A"}</h2>
                  {/* <p>
                    OUR31245
                    <span>
                      <MdContentCopy />
                    </span>
                  </p> */}
                </div>
              </div>
              <div className="dashed-border"></div>
              <div className="below-section">
                <div className="below-des">
                  <p>{rank2?.sale.toFixed(2) ?? 0}</p>
                  <p>Sales ({activeHead == "kw" ? "kW" : "count"})</p>
                </div>
                <div className="below-des">
                  <p>{rank2?.ntp?.toFixed(2) ?? 0}</p>
                  <p>Ntp ({activeHead == "kw" ? "kW" : "count"})</p>
                </div>
                <div
                  className="below-des mx-auto"
                  style={{ gridColumn: '1/3' }}
                >
                  <p className="text-center"> {rank2?.install.toFixed(2)}</p>
                  <p>Installs ({activeHead == "kw" ? "kW" : "count"})</p>
                </div>
              </div>
            </div>
          ) : null}
          {rank1 ? (
            <div className="card-two">
              <div className="upper-section">
                <img src={ICONS.GoldOne} aria-label="grey-icon"></img>
                <div className="flex flex-column card-title">
                  <h2>{rank1?.rep_name || "N/A"}</h2>
                  {/* <p>
                    OUR31245
                    <span>
                      <MdContentCopy />
                    </span>
                  </p> */}
                </div>
              </div>
              <div className="dashed-border"></div>
              <div className="below-section">
                <div className="below-des">
                  <p>{rank1?.sale.toFixed(2) ?? 0} </p>
                  <p>Sales ({activeHead == "kw" ? "kW" : "count"})</p>
                </div>
                <div className="below-des">
                  <p>{rank1?.ntp.toFixed(2)}</p>
                  <p>Ntp ({activeHead == "kw" ? "kW" : "count"})</p>
                </div>
                <div
                  className="below-des mx-auto"
                  style={{ gridColumn: '1/3' }}
                >
                  <p className="text-center">{rank1?.install.toFixed(2)}</p>

                  <p>Installs ({activeHead == "kw" ? "kW" : "count"})</p>
                </div>
              </div>
            </div>
          ) : null}
          {rank3 ? (
            <div className="card-three">
              <div className="upper-section">
                <img src={ICONS.BrownThree} aria-label="grey-icon"></img>
                <div className="flex flex-column card-title">
                  <h2>{rank3?.rep_name || "N/A"}</h2>
                  {/* <p>
                    OUR31245
                    <span>
                      <MdContentCopy />
                    </span>
                  </p> */}
                </div>
              </div>
              <div className="dashed-border"></div>
              <div className="below-section">
                <div className="below-des">
                  <p>{rank3?.sale.toFixed(2) ?? 0} </p>
                  <p>Sales ({activeHead == "kw" ? "kW" : "count"})</p>
                </div>
                <div className="below-des">
                  <p>{rank3?.ntp.toFixed(2) ?? 0} </p>
                  <p>Ntp ({activeHead == "kw" ? "kW" : "count"})</p>
                </div>
                <div
                  className="below-des mx-auto"
                  style={{ gridColumn: '1/3' }}
                >
                  <p className="text-center">{rank3?.install.toFixed(2)}</p>

                  <p>Installs ({activeHead == "kw" ? "kW" : "count"})</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PerformanceCards;
