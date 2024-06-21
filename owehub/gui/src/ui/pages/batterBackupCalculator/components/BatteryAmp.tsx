import React, { SetStateAction, useEffect, useState } from 'react';
import on from '../lib/on_switch.png';
import off from '../lib/off_switch.png';
import screw from '../lib/construction.svg';
import { GoCheckCircleFill } from 'react-icons/go';
import { MdCancel } from 'react-icons/md';
import { PiCircle, PiWarningCircleLight } from 'react-icons/pi';
import { FaPlus } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa';
import { IoIosArrowRoundBack } from 'react-icons/io';
import {
  AirConditioner,
  Clock,
  Dishwasher,
  ElectricOven,
  EvCharger,
  PoolPump,
  ThunderBolt,
  Timer,
  VaccumCleaner,
  WashingMachine,
  WellPump,
} from '../icons';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import ToggleSwitch from '../../../components/Switch';
import WarningPopup from './WarningPopup';
const appliance = [
  {
    name: 'Air Conditioner',
    quantity: 1,
    icon: (color: string) => <AirConditioner color={color} />,
    isOn: true,
  },
  {
    name: 'Washing Machine',
    quantity: 1,
    icon: (color: string) => <WashingMachine color={color} />,
    isOn: false,
  },

  {
    name: 'Electric Oven',
    quantity: 1,
    icon: (color: string) => <ElectricOven color={color} />,
    isOn: true,
  },

  {
    name: 'Vacuum Cleaner',
    quantity: 1,
    icon: (color: string) => <VaccumCleaner color={color} />,
    isOn: false,
  },

  {
    name: 'Well Pump',
    quantity: 1,
    icon: (color: string) => <WellPump color={color} />,
    isOn: true,
  },
  {
    name: 'Dishwasher',
    quantity: 1,
    icon: (color: string) => <Dishwasher color={color} />,
    isOn: true,
  },
  {
    name: 'Pool Pump',
    quantity: 1,
    icon: (color: string) => <PoolPump color={color} />,
    isOn: false,
  },
  {
    name: 'EV Charger',
    quantity: 1,
    icon: (color: string) => <EvCharger color={color} />,
    isOn: true,
  },
];
const BatteryAmp = ({
  battery,
  setStep,
}: {
  battery: {
    quantity: number;
    amp: string;
    note: string;
  }[];
  setStep: React.Dispatch<SetStateAction<number>>;
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
  const [appliances, setAppliances] = useState(appliance);
  const [batteryPower, setBatteryPower] = useState(arrayGen());
  const [mainOn, setMainOn] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (index: number) => {
    const batteries = [...batteryPower];
    batteries[index].isOn = !batteries[index].isOn;
    setBatteryPower([...batteries]);
  };

  const handleQuantity = (index: number, type: 'dec' | 'inc') => {
    const appliance = [...appliances];
    if (type === 'inc') {
      appliance[index].quantity += 1;
    }
    if (type === 'dec' && appliance[index].quantity >= 2) {
      appliance[index].quantity -= 1;
    }
    setAppliances([...appliance]);
  };

  useEffect(() => {
    if (batteryPower.some((item) => item.amp === '70+ AMP')) {
      setMainOn(false);
    }
  }, [batteryPower]);
  return (
    <div
      className="scrollbar batter-amp-container  px4 relative"
      style={{ backgroundColor: '#F2F2F2' }}
    >
      <div>
        <div className="py3  flex " style={{ minHeight: '100vh', gap: 64 }}>
          <div
            className="bg-white p3 flex-grow-1 relative"
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
                    <span
                      className="error ml1 mt0"
                      style={{ color: '#F44336' }}
                    >
                      {' '}
                      {
                        'This home does not qualify for a full home back-up'
                      }{' '}
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
                              <MdCancel
                                className="mr1"
                                color="#F44336"
                                size={14}
                              />
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
          <div className="flex-grow-1">
            <div className="bg-white flex justify-between battery-watt-wrapper">
              <div>
                <h3 className="battery-watt-heading"> 4 Batteries</h3>
                <p
                  className="mt2"
                  style={{ color: '#7C7C7C', fontSize: 12, fontWeight: 500 }}
                >
                  Number of batteries required for full home backup
                </p>
              </div>
              <div className="flex counter-btn-wrapper items-center">
                <div
                  onClick={() => setIsOpen(true)}
                  className="watt-counter-btn justify-center flex items-center"
                >
                  <FaMinus color="#fff" size={24} />
                </div>
                <div
                  onClick={() => setIsOpen(true)}
                  className="watt-counter-btn justify-center flex items-center"
                >
                  <FaPlus color="#fff" size={24} />
                </div>
              </div>
            </div>
            <div className=" bg-white appliance-container">
              <div>
                <h4 className="appliance-heading">Large Appliances</h4>
                <div className="flex items-center ">
                  <p
                    style={{
                      color: '#7C7C7C',
                      fontSize: 12,
                      fontWeight: 500,
                      flexBasis: '70%',
                    }}
                  >
                    High Consumption, regular use
                  </p>
                  <span
                    style={{
                      color: '#898989',
                      fontSize: 12,
                      flexBasis: '15%',
                      textAlign: 'center',
                    }}
                  >
                    Qty
                  </span>
                  <span
                    style={{
                      color: '#898989',
                      fontSize: 12,
                      flexBasis: '15%',
                      textAlign: 'center',
                    }}
                  >
                    Backup
                  </span>
                </div>
              </div>
              <div className="mt3">
                {appliance.map((app, ind) => {
                  return (
                    <div key={ind} className="flex mb3 items-center">
                      <div
                        className="appliance-icon flex items-center"
                        style={{ flexBasis: '70%' }}
                      >
                        <div
                          className="check flex items-center "
                          style={{ flexBasis: '7%', flexShrink: 0 }}
                        >
                          {app.isOn ? (
                            <IoIosCheckmarkCircle color="#37B745" size={21} />
                          ) : (
                            <PiCircle size={21} color="#7C7C7C" />
                          )}
                        </div>
                        <div
                          className="icon flex items-center justify-center"
                          style={{ flexBasis: '11%', flexShrink: 0 }}
                        >
                          {app.icon(app.isOn ? '#000000' : 'rgba(0,0,0,0.3)')}
                        </div>
                        <div className="appliance-name">
                          <h5
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: app.isOn ? '#000000' : 'rgba(0,0,0,0.3)',
                            }}
                          >
                            {' '}
                            {app.name}{' '}
                          </h5>
                        </div>
                      </div>
                      <div
                        className="appliance-quantity items-center flex justify-center"
                        style={{
                          flexBasis: '15%',
                          textAlign: 'center',
                          color: app.isOn ? '#000000' : 'rgba(0,0,0,0.3)',
                          gap: 12,
                        }}
                      >
                        <FaMinus
                          className="pointer"
                          onClick={() => app.isOn && handleQuantity(ind, 'dec')}
                          color={app.isOn ? '#000000' : 'rgba(0,0,0,0.3)'}
                          size={14}
                        />
                        <span>{app.quantity}</span>
                        <FaPlus
                          className="pointer"
                          onClick={() => app.isOn && handleQuantity(ind, 'inc')}
                          color={app.isOn ? '#000000' : 'rgba(0,0,0,0.3)'}
                          size={14}
                        />
                      </div>
                      <div
                        className="applicane-switch-container flex justify-center"
                        style={{ flexBasis: '15%' }}
                      >
                        <ToggleSwitch
                          onChange={() => {
                            const current = [...appliances];
                            current[ind].isOn = !current[ind].isOn;
                            setAppliances([...current]);
                          }}
                          checked={app.isOn}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="my4">
          <div className="flex px3">
            <div className="col-4 px3">
              <div className="flex items-start">
                <div className="mr2 mt1">
                  <Clock />
                </div>
                <div className="">
                  <h4 className="stats-heading" style={{ fontWeight: 600 }}>
                    12 Hrs
                  </h4>
                  <p
                    className="mt-0"
                    style={{ fontSize: 16, fontWeight: 500, color: '#7C7C7C' }}
                  >
                    Expected hours of backup
                  </p>
                  <button className="stats-btn">See details</button>
                </div>
              </div>
            </div>
            <div className="col-4 px3">
              <div className="flex items-start">
                <div className="mr2 mt1">
                  <ThunderBolt />
                </div>
                <div className="">
                  <h4 className="stats-heading" style={{ fontWeight: 600 }}>
                    365 Watt
                  </h4>
                  <p
                    className="mt-0"
                    style={{ fontSize: 16, fontWeight: 500, color: '#7C7C7C' }}
                  >
                    Expected hours of backup
                  </p>
                  <button className="stats-btn">See details</button>
                </div>
              </div>
            </div>
            <div className="col-4 px3">
              <div className="flex items-start">
                <div className="mr2 mt1">
                  <Timer />
                </div>
                <div className="">
                  <h4 className="stats-heading" style={{ fontWeight: 600 }}>
                    6 Hrs
                  </h4>
                  <p
                    className="mt-0"
                    style={{ fontSize: 16, fontWeight: 500, color: '#7C7C7C' }}
                  >
                    Total average daily consumption
                  </p>
                  <button className="stats-btn">See details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex fixed-btn-wrapper justify-center calc-btn-wrapper items-center">
        <button
          onClick={() => setStep(0)}
          className="calc-btn flex items-center justify-center calc-grey-btn pointer"
        >
          <IoIosArrowRoundBack size={24} className="mr1 " />

          <span>Go Back</span>
        </button>

        <button className="calc-btn text-white pointer calc-green-btn">
          Submit
        </button>
      </div>
      {isOpen && <WarningPopup isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default BatteryAmp;
