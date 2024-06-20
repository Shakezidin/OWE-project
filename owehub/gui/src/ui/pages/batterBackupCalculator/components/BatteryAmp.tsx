import React, { useEffect, useState } from 'react';
import on from '../lib/on_switch.png';
import off from '../lib/off_switch.png';
import screw from '../lib/construction.svg';
import { GoCheckCircleFill } from 'react-icons/go';
import { MdCancel } from 'react-icons/md';
import { PiWarningCircleLight } from 'react-icons/pi';
const BatteryAmp = ({
  battery,
}: {
  battery: {
    quantity: number;
    amp: string;
    note: string;
  }[];
}) => {
  const arrayGen = () => {
    const arr = [];
    for (let index = 0; index < battery.length; index++) {
      let count = 0;
      if (battery[index].quantity > 1) {
        while (battery[index].quantity > count) {
          arr.push({ ...battery[index], isOn: true });
          count++;
        }
      } else {
        arr.push({ ...battery[index], isOn: true });
      }
    }
    return arr;
  };
  const [batteryPower, setBatteryPower] = useState(arrayGen());
  const [mainOn, setMainOn] = useState(true);

  const toggle = (index: number) => {
    const batteries = [...batteryPower];
    batteries[index].isOn = !batteries[index].isOn;
    setBatteryPower(batteries);
  };

  useEffect(() => {
    if (batteryPower.some((item) => item.amp === '70+ AMP')) {
      setMainOn(false);
    }
  }, [batteryPower]);
  return (
    <div>
      <div
        className="bg-white p3 relative"
        style={{ maxWidth: 600, borderRadius: 20 }}
      >
        <div className="absolute screw-top">
            <img src={screw} alt="" />
        </div>

        <div className="absolute screw-top-right">
            <img src={screw} alt="" />
        </div>
        
        <div className="absolute screw-bottom-right">
            <img src={screw} alt="" />
        </div>
          
        <div className="absolute screw-bottom-left">
            <img src={screw} alt="" />
        </div>
        <div className="battery-amp-wrapper">
          <div className="bg-navy-dark mx-auto">
            <div className="home-battery relative flex items-center mx-auto">
              <div className="battery flex items-center flex-grow-1">
                <div className="battery-chip">
                  <svg
                    width="76"
                    height="91"
                    viewBox="0 0 76 91"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d_917_2)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M32.8936 20.6523H24.4688V62.7763H32.8936V57.5106H51.8479V25.9176H32.8936V20.6523Z"
                        fill="#E5A21E"
                      />
                    </g>
                    <circle
                      cx="37.6984"
                      cy="33.8805"
                      r="2.64564"
                      fill="#956915"
                    />
                    <circle
                      cx="37.6984"
                      cy="49.7545"
                      r="2.64564"
                      fill="#956915"
                    />
                    <defs>
                      <filter
                        id="filter0_d_917_2"
                        x="0.483856"
                        y="0.664932"
                        width="75.3487"
                        height="90.0938"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feMorphology
                          radius="11.9924"
                          operator="dilate"
                          in="SourceAlpha"
                          result="effect1_dropShadow_917_2"
                        />
                        <feOffset dy="3.99748" />
                        <feGaussianBlur stdDeviation="5.99622" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_917_2"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_917_2"
                          result="shape"
                        />
                      </filter>
                    </defs>
                  </svg>
                </div>
                <div className="battery-amp flex-grow-1 flex items-center">
                  <GoCheckCircleFill
                    className="mr1"
                    color="#129537"
                    size={21}
                  />
                  <span>Full Home Backup</span>
                </div>
              </div>
              <div className="batter-amp-switch flex items-center justify-center">
                <img src={mainOn ? on : off} alt="" className="pointer" />
              </div>
            </div>
            {!mainOn && (
              <div className="flex items-center justify-center mt2">
                <PiWarningCircleLight color="#F44336" />
                <span className="error ml1 mt0" style={{ color: '#F44336' }}>
                  {' '}
                  {'This home does not qualify for a full home back-up'}{' '}
                </span>
              </div>
            )}
          </div>

          <div className="mt4 flex flex-wrap items-center justify-between">
            {batteryPower.map((item, index) => {
              return (
                <div className="flex mb3" style={{ width: '50%' }}>
                  <div
                    className={`flex-149 flex items-center relative ${(index + 1) % 2 === 0 ? 'ml-auto' : 'translate-28'}`}
                  >
                    <div className="battery flex items-center flex-grow-1">
                      <div className="battery-chip sm-battery-chip">
                        <svg
                          width="53"
                          height="63"
                          viewBox="0 0 53 63"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g filter="url(#filter0_d_919_3)">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M22.4477 14.0454H16.6211V43.1786H22.4477V39.5372H35.5587V17.6873H22.4477V14.0454Z"
                              fill="#D1D1D1"
                            />
                          </g>
                          <circle
                            cx="25.7672"
                            cy="23.194"
                            r="1.82974"
                            fill="#DEDEDE"
                          />
                          <circle
                            cx="25.7672"
                            cy="34.173"
                            r="1.82974"
                            fill="#DEDEDE"
                          />
                          <defs>
                            <filter
                              id="filter0_d_919_3"
                              x="0.0329838"
                              y="0.221985"
                              width="52.1137"
                              height="62.3095"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                            >
                              <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feMorphology
                                radius="8.29405"
                                operator="dilate"
                                in="SourceAlpha"
                                result="effect1_dropShadow_919_3"
                              />
                              <feOffset dy="2.76468" />
                              <feGaussianBlur stdDeviation="4.14703" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow_919_3"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect1_dropShadow_919_3"
                                result="shape"
                              />
                            </filter>
                          </defs>
                        </svg>
                      </div>
                      <div className="battery-amp sm-amp flex-grow-1 flex items-center">
                        {item.isOn ? (
                          <GoCheckCircleFill
                            className="mr1"
                            color="#129537"
                            size={14}
                          />
                        ) : (
                          <MdCancel className="mr1" color="#F44336" size={14} />
                        )}
                        <span> {item.amp} </span>
                      </div>
                    </div>
                    <div className="batter-amp-switch sm-switch flex items-center justify-center">
                      {item.isOn ? (
                        <img
                          src={on}
                          onClick={() => toggle(index)}
                          width={23}
                          height={27}
                          alt=""
                          className="pointer"
                        />
                      ) : (
                        <img
                          src={off}
                          onClick={() => toggle(index)}
                          width={23}
                          height={27}
                          alt=""
                          className="pointer"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryAmp;
