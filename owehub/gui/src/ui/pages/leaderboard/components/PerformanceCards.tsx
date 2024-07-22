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
  activeHead: string;
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

  const getCardHeadingStyle = (item: (typeof details)[number]) => {
    if (!item) return { fontSize: '1.2rem' };

    const fontSizeRaw = (18 - item?.rep_name.length) * 0.15;
    const fontSizeClamped = Math.min(Math.max(fontSizeRaw, 0.75), 2); // clamp b/w 0.75 and 2rem
    return { fontSize: `${fontSizeClamped}rem` };
  };
  function formatSaleValue(value:any) {
    if (value === null || value === undefined) return ''; // Handle null or undefined values
    const sale = parseFloat(value);
    if (sale === 0) return '0';
    if (sale % 1 === 0) return sale.toString(); // If the number is an integer, return it as a string without .00
    return sale.toFixed(2); // Otherwise, format it to 2 decimal places
  }
  
  return (
    <div>
      <div className="performance-cards">
        <div className="right-button">
          <div className="relative">
            <button className="share-button" onClick={shareImage} disabled={isGenerating}>
              <MdOutlineIosShare className="share-svg" />
              <p> {isGenerating ? 'Downloading' : 'Share'} </p>
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
                  <h2 style={getCardHeadingStyle(rank2)}>
                    {rank2?.rep_name || 'N/A'}
                  </h2>
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
                  <p>{formatSaleValue(rank2?.sale) ?? 0}</p>
                  <p>Sales ({activeHead == 'kw' ? 'kW' : 'count'})</p>
                </div>
                <div className="below-des">
                  <p>{formatSaleValue(rank2?.ntp) ?? 0}</p>
                  <p>Ntp ({activeHead == 'kw' ? 'kW' : 'count'})</p>
                </div>
                <div
                  className="below-des mx-auto"
                  style={{ gridColumn: '1/3' }}
                >
                  <p className="text-center"> {formatSaleValue(rank2?.install)}</p>
                  <p>Installs ({activeHead == 'kw' ? 'kW' : 'count'})</p>
                </div>
              </div>
            </div>
          ) : null}
          {rank1 ? (
            <div className="card-two">
              <div className="upper-section">
                <img src={ICONS.GoldOne} aria-label="grey-icon"></img>
                <div className="flex flex-column card-title">
                  <h2 style={getCardHeadingStyle(rank1)}>
                    {rank1?.rep_name || 'N/A'}
                  </h2>
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
                  <p>{formatSaleValue(rank1?.sale) ?? 0} </p>
                  <p>Sales ({activeHead == 'kw' ? 'kW' : 'count'})</p>
                </div>
                <div className="below-des">
                  <p>{formatSaleValue(rank1?.ntp)}</p>
                  <p>Ntp ({activeHead == 'kw' ? 'kW' : 'count'})</p>
                </div>
                <div
                  className="below-des mx-auto"
                  style={{ gridColumn: '1/3' }}
                >
                  <p className="text-center">{formatSaleValue(rank1?.install)}</p>

                  <p>Installs ({activeHead == 'kw' ? 'kW' : 'count'})</p>
                </div>
              </div>
            </div>
          ) : null}
          {rank3 ? (
            <div className="card-three">
              <div className="upper-section">
                <img src={ICONS.BrownThree} aria-label="grey-icon"></img>
                <div className="flex flex-column card-title">
                  <h2 style={getCardHeadingStyle(rank3)}>
                    {rank3?.rep_name || 'N/A'}
                  </h2>
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
                  <p>{formatSaleValue(rank3?.sale) ?? 0} </p>
                  <p>Sales ({activeHead == 'kw' ? 'kW' : 'count'})</p>
                </div>
                <div className="below-des">
                  <p>{formatSaleValue(rank3?.ntp) ?? 0} </p>
                  <p>Ntp ({activeHead == 'kw' ? 'kW' : 'count'})</p>
                </div>
                <div
                  className="below-des mx-auto"
                  style={{ gridColumn: '1/3' }}
                >
                  <p className="text-center">{formatSaleValue(rank3?.install)}</p>

                  <p>Installs ({activeHead == 'kw' ? 'kW' : 'count'})</p>
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
