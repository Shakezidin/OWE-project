import React, {
  SetStateAction,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import on from '../lib/on_switch.png';
import off from '../lib/off_switch.png';
import screw from '../lib/construction.svg';
import { GoCheckCircleFill } from 'react-icons/go';
import { MdCancel } from 'react-icons/md';
import { PiCircle, PiWarningCircleLight } from 'react-icons/pi';
import { FaPlus } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa';
import { IoIosArrowRoundBack } from 'react-icons/io';
import Select from 'react-select';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
import Input from '../../../components/text_input/Input';
import { ca } from 'date-fns/locale';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
const appliance = [
  {
    name: 'Air Conditioner',
    quantity: 1,
    icon: (color: string) => <AirConditioner color={color} />,
    isOn: false,
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
    isOn: false,
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
    isOn: false,
  },
  {
    name: 'Dishwasher',
    quantity: 1,
    icon: (color: string) => <Dishwasher color={color} />,
    isOn: false,
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
    isOn: false,
  },
];
const months = [
  { label: 'January', value: 'January' },
  { label: 'February', value: 'February' },
  { label: 'March', value: 'March' },
  { label: 'April', value: 'April' },
  { label: 'May', value: 'May' },
  { label: 'June', value: 'June' },
  { label: 'July', value: 'July' },
  { label: 'August', value: 'August' },
  { label: 'September', value: 'September' },
  { label: 'October', value: 'October' },
  { label: 'November', value: 'November' },
  { label: 'December', value: 'December' },
];
export interface Ibattery {
  quantity: number;
  amp: number;
  note: string;
  isOn: boolean;
}
 
const BatteryAmp = () => {
  // const [battery, setBattery] = useState<
  //   { quantity: number; amp: number; note: string }[]
  // >([]);
  const [otherDeatil, setOtherDeatil] = useState<{
    continous_current?: number;
    lra?: number;
  }>({});
  const [requiredBattery, setRequiredBattery] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState({
    label: 'June',
    value: 'June',
  });
  const [initial, setInitial] = useState(0);
  const arrayGen = (battery: Ibattery[]) => {
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
  const { id } = useParams();
  const [appliances, setAppliances] = useState([...appliance]);
  const [batteryPower, setBatteryPower] = useState<Ibattery[]>([]);
  const [initialBattery, setInitialBattery] = useState<Ibattery[]>([]);
  const [mainOn, setMainOn] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [avgConsumption, setAvgConsumption] = useState('');
  const [caluclatedBackup, setCaluclatedBackup] = useState(0);
  const [mainDisabled, setMainDisabled] = useState(true);
  const form = useRef<HTMLDivElement | null>(null);
 
  const exportPdf = () => {
    if (form.current) {
      const doc = new jsPDF();
      const element = form.current;
 
      // Get current scroll position of the div
      const scrollTop = element.scrollTop;
 
      // Calculate total height of the div
      const scrollHeight = element.scrollHeight;

      html2canvas(element, {
        scrollY: -scrollTop, 
        windowHeight: scrollHeight,
        scale:1
      }).then((canvas) => {
        const imageData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imageData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('download.pdf');
       
      });
    }
  };
 
  const toggle = (index: number) => {
    const batteries = [...batteryPower];
    batteries[index].isOn = !batteries[index].isOn;
    setBatteryPower([...batteries]);
  };
 
  const minRequired = (arr:any[],current: number, lra: number) => {
    let totalAmp = 0;
    const base = { amp: 60, lra: 185, current: 48 };
    arr.forEach((item) => {
      totalAmp += item.amp;
    });
 
    const requiredPowerwallsByBreakers = Math.ceil(totalAmp / base.amp);
    const requiredPowerwallsByLRA = Math.ceil(lra / base.lra);
    const requiredPowerwallsByCurrent = Math.ceil(current / base.current);
    return Math.max(
      requiredPowerwallsByBreakers,
      requiredPowerwallsByLRA,
      requiredPowerwallsByCurrent
    );
  };
 
  const required = useMemo(() => {
    let count = 0;
 
    appliances.forEach((battery, index) => {
      if (battery.isOn) {
        count += battery.quantity;
      }
    });
    let init = initial;
    count = count - init;
    const newSum = init + count;
    setRequiredBattery(Math.max(initial, newSum));
    return Math.max(initial, newSum);
  }, [appliances, otherDeatil, initial]);
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
 
  const calculator = () => {
    const consumption = (parseFloat(avgConsumption) / 24) * 6 * 0.6;
    setCaluclatedBackup(consumption);
  };
 
  useEffect(() => {
    const getProspectDetail = async () => {
      try {
        const data = await postCaller('get_prospect_load', {
          prospect_id: parseInt(id!) || 3,
        });
        if (data.status > 201) {
          toast.error((data as Error).message);
        } else {
          const batt = data.data.breakers.map((item: any) => ({
            ...item,
            amp: item.ampere,
            isOn: false,
          })) as Ibattery[];
          setBatteryPower(arrayGen([...batt]));
          setInitialBattery(arrayGen([...batt]));
        const min = minRequired(arrayGen([...batt]),data?.data?.continous_current, data?.data?.lra)
          setOtherDeatil(data?.data);
          setInitial(
            min
          );
       
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    if (id) {
      getProspectDetail();
    }
  }, [id]);
 console.log(initial,"initial");
 
  return (
    <div
      ref={form}
      className="scrollbar   relative"
      style={{ backgroundColor: '#F2F2F2' }}
    >
      <div className="batter-amp-container ">
        <div
          className="py3 items-start batter-amp-wrapper justify-center flex "
          style={{ minHeight: '100vh' }}
        >
          <div
            className="bg-white panel-container p3 flex-grow-1 relative"
            style={{ borderRadius: 20 }}
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
            <div className="battery-amp-wrapper mx-auto">
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
                  <div
                    onClick={() => !mainDisabled && setMainOn((prev) => !prev)}
                    className="batter-amp-switch pointer flex items-center justify-center"
                  >
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
 
              <div className="mt4 grid-amp-container">
                {batteryPower.map((item, index: number) => {
                  return (
                    <div className="flex mb3">
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
                            <span>
                              {' '}
                              {`${item.amp}${item.amp === 70 ? '+' : ''} AMP`}{' '}
                            </span>
                          </div>
                        </div>
                        <div className="batter-amp-switch sm-switch flex items-center justify-center">
                          {item.isOn ? (
                            <img
                              src={on}
                              onClick={() => !mainOn && toggle(index)}
                              width={23}
                              height={27}
                              alt=""
                              className="pointer"
                            />
                          ) : (
                            <img
                              src={off}
                              onClick={() => !mainOn && toggle(index)}
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
 
            <div className="battery-power-calculator-wrapper">
              <div className="flex calc-stats justify-between items-start">
                <div>
                  <div className="flex  items-start">
                    <div className="mr2 mt1">
                      <Clock />
                    </div>
                    <div className="">
                      <h4 className="stats-heading" style={{ fontWeight: 600 }}>
                        {caluclatedBackup
                          ? caluclatedBackup.toFixed(2)
                          : caluclatedBackup || '00'}{' '}
                        Hrs
                      </h4>
                    </div>
                  </div>
                  <p
                    className="mt-0"
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      color: '#7C7C7C',
                    }}
                  >
                    Expected hours of backup
                  </p>
                </div>
                <button className="stats-btn">See details</button>
              </div>
              <div className="mt4 ">
                <div className="flex calc-input-container mb3 items-end">
                  <div className="calc-input-wrapper">
                    <Input
                      type="text"
                      name=""
                      label="Input average daily consumption"
                      placeholder={'00'}
                      value={avgConsumption}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                        setAvgConsumption(e.target.value);
                      }}
                    />
                  </div>
                  <div className="calc-select-wrapper">
                    <label htmlFor="" className="inputLabel">
                      Select hottest month
                    </label>
                    <Select
                      options={months}
                      value={selectedMonth}
                      onChange={(e) => e && setSelectedMonth(e)}
                      styles={{
                        control: (base) => ({
                          ...base,
                          height: 45,
                          width: '100%',
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#7C7C7C',
                          border: '1px solid #EBEBEB',
                          background: 'transparent',
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: '#202020',
                        }),
                        indicatorSeparator: (base) => ({
                          ...base,
                          width: 0,
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          color: '#D9D9D9',
                        }),
                        menuList: (base) => ({
                          ...base,
                          '&::-webkit-scrollbar': {
                            scrollbarWidth: 'thin',
                            display: 'block',
                            scrollbarColor: 'rgb(173, 173, 173) #fff',
                            width: 8,
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: 'rgb(173, 173, 173)',
                            borderRadius: '30px',
                          },
                        }),
                      }}
                    />
                  </div>
                </div>
                <button
                  className={`calc-btn  pointer  text-white ${avgConsumption ? 'calc-bg-navy' : 'calc-disabled-btn'}`}
                  style={{ maxWidth: '100%', color: '#fff' }}
                  onClick={calculator}
                >
                  Calculate
                </button>
              </div>
            </div>
          </div>
          <div className="flex-grow-1" style={{ width: '100%', flexShrink: 0 }}>
            <div className="bg-white flex justify-between battery-watt-wrapper">
              <div>
                <h3 className="battery-watt-heading">
                  {' '}
                  {requiredBattery} Batteries
                </h3>
                <p
                  className="mt2"
                  style={{ color: '#7C7C7C', fontSize: 12, fontWeight: 500 }}
                >
                  Number of batteries required for full home backup
                </p>
              </div>
              <div className="flex counter-btn-wrapper items-center">
                <div
                  role="button"
                  onClick={() => {
                    required && requiredBattery <= required
                      ? setIsOpen(true)
                      : setRequiredBattery((prev) => (prev ? prev - 1 : prev));
                  }}
                  className="watt-counter-btn pointer justify-center flex items-center"
                >
                  <FaMinus color="#fff" size={24} />
                </div>
                <div
                  role="button"
                  onClick={() =>
                    requiredBattery >= required
                      ? undefined
                      : setRequiredBattery((prev) => prev + 1)
                  }
                  className={`watt-counter-btn   pointer justify-center flex items-center ${requiredBattery >= required ? 'disable' : ''}`}
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
                        <span
                          onClick={() => app.isOn && handleQuantity(ind, 'dec')}
                          className="quantity-toggler-btn pointer"
                        >
                          <FaMinus
                            color={app.isOn ? '#000000' : 'rgba(0,0,0,0.3)'}
                            size={10}
                          />
                        </span>
                        <span>{app.quantity}</span>
                        <span
                          onClick={() => app.isOn && handleQuantity(ind, 'inc')}
                          className="quantity-toggler-btn pointer"
                        >
                          <FaPlus
                            color={app.isOn ? '#000000' : 'rgba(0,0,0,0.3)'}
                            size={10}
                          />
                        </span>
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
            <div className="mt4">
              <button
                onClick={exportPdf}
                className="calc-btn text-white pointer calc-green-btn"
                style={{ maxWidth: '100%' }}
              >
                Submit
              </button>
              {/* <button
                  onClick={() => null}
                  className="calc-btn flex items-center justify-center calc-grey-btn pointer"
                >
                  <IoIosArrowRoundBack size={24} className="mr1 " />
 
                  <span>Go Back</span>
                </button> */}
            </div>
          </div>
        </div>
      </div>
 
      {isOpen && (
        <WarningPopup
          setMainOn={setMainOn}
          isOpen={isOpen}
          required={required}
          setBatteryPower={setBatteryPower}
          setRequiredBattery={setRequiredBattery}
          setMainDisabled={setMainDisabled}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};
 
export default BatteryAmp;
 