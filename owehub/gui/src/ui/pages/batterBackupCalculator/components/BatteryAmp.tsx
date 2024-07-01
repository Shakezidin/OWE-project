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
import { FaCircleCheck, FaPlus } from 'react-icons/fa6';
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
import { IoCloseCircle } from 'react-icons/io5';
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
  amp: number;
  note: string;
  isOn: boolean;
  category_ampere: number;
  category_name: string;
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
  // const arrayGen = (battery: Ibattery[]) => {
  //   const arr = [];
  //   for (let index = 0; index < battery.length; index++) {
  //     let count = 0;
  //     if (battery[index].quantity > 1) {
  //       while (battery[index].quantity > count) {
  //         arr.push({ ...battery[index], isOn: true });
  //         count++;
  //       }
  //     } else {
  //       arr.push({ ...battery[index], isOn: true });
  //     }
  //   }
  //   return arr;
  // };
  const { id } = useParams();
  const [appliances, setAppliances] = useState([...appliance]);
  const [batteryPower, setBatteryPower] = useState<Ibattery[]>([]);
  const [initialBattery, setInitialBattery] = useState<Ibattery[]>([]);
  const [mainOn, setMainOn] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [avgConsumption, setAvgConsumption] = useState('');
  const [caluclatedBackup, setCaluclatedBackup] = useState(-1);
  const [mainDisabled, setMainDisabled] = useState(true);
  const [mssg, setMssg] = useState('');
  const [btnText, setBtnText] = useState({
    primaryText: '',
    secondaryText: '',
  });
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
        scale: 1,
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

  const minRequired = (arr: any[], current: number, lra: number) => {
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
    return initial;
  }, [initial]);

  const calculator = () => {
    const consumption = (parseFloat(avgConsumption) / 365 / 24) * 0.6;
    if (consumption >= 6) {
      setCaluclatedBackup((prev) => (prev !== 1 ? prev + 1 : prev));
    } else {
      setCaluclatedBackup(0);
      setMssg(`Your annual usage exceeds what is possible to back-up with the current battery 
        configuration. In-order for your 
        house to remain eligible for a Full 
        Home Back-up we will be adding x batteries to your system.`);
      setIsOpen(true);
      setBtnText({
        primaryText: 'Proceed with Full Home Back-up',
        secondaryText: `I would like to downgrade
to a Partial Home Back-up`,
      });
    }
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
            isOn: true,
          })) as Ibattery[];
          setBatteryPower([...batt]);
          setInitialBattery([...batt]);
          const min = minRequired(
            [...batt],
            data?.data?.continous_current,
            data?.data?.lra
          );
          setOtherDeatil(data?.data);
          setInitial(min);
          setRequiredBattery(min);
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    if (id) {
      getProspectDetail();
    }
  }, [id]);

  useEffect(() => {
    if (requiredBattery >= required) {
      setMainOn(true);
    }
  }, [required, requiredBattery]);

  return (
    <div
      ref={form}
      className="scrollbar   relative"
      style={{ backgroundColor: '#F2F2F2', paddingBottom: 100 }}
    >
      <div className="batter-amp-container ">
        <div className="wrapper-header mt0">
          <h4 className="h4" style={{ fontWeight: 500 }}>
          Electrical Panel
          </h4>
          <p
            className="mt1"
            style={{ color: '#7F7F7F', fontSize: 12, fontWeight: 500 }}
          >
            {' '}
            Customise panel as per requirement
          </p>
        </div>
        <div className="py3  batter-amp-wrapper  ">
          <div
            className="battery-watt-wrapper bg-white"
            style={{ width: '100%' }}
          >
            <p
              className="mb2"
              style={{ color: '#7C7C7C', fontSize: 12, fontWeight: 500 }}
            >
              Total number of batteries required
            </p>
            <div className=" flex justify-between ">
              <div>
                <h3 className="battery-watt-heading">
                  {' '}
                  {requiredBattery} Batteries
                </h3>
              </div>
              <div className="flex counter-btn-wrapper items-center">
                <div
                  role="button"
                  onClick={() => {
                    if (required && requiredBattery <= required) {
                      setIsOpen(true);
                      setMssg(
                        `You are attempting to reduce the total number of batteries below our recommended minimum for a Full Home Back-Up.We cannot gaurentee the effectiveness in which this battery configuration can support your home. Would you like to remain at the recommended battery quantity for a Full Home Back-Up or reduce the number of batteries in this system and switch to a Partial Home Back-up`
                      );
                      setBtnText({
                        primaryText: `I would like to remain with the recommended configuration.`,
                        secondaryText: `I would like to switch to a partial home back-up.`,
                      });
                    } else {
                      setRequiredBattery((prev) => (prev ? prev - 1 : prev));
                    }
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
          </div>
          <div
            style={{ width: '100%' }}
            className="mt3 battery-watt-wrapper justify-between flex items-center bg-white"
          >
            <div
              className="calc-input-wrapper relative"
              style={{ flexBasis: 168 }}
            >
              <Input
                type="text"
                name=""
                label="Enter annual Usage"
                placeholder={'Annual Usage'}
                style={{
                  border:
                    caluclatedBackup === 1
                      ? '1px solid #129537'
                      : caluclatedBackup === 0
                        ? '1px solid #F44336'
                        : undefined,
                }}
                value={avgConsumption}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                  setAvgConsumption(e.target.value);
                }}
              />
              {!!(caluclatedBackup === 0) && (
                <IoCloseCircle
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(30%)',
                    right: 5,
                  }}
                  size={17}
                  color="#F44336"
                />
              )}
              {!!(caluclatedBackup === 1) && (
                <FaCircleCheck
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(30%)',
                    right: 5,
                  }}
                  size={17}
                  color="#129537"
                />
              )}
            </div>

            <span
              onClick={calculator}
              style={{ fontSize: 12, fontWeight: 600 }}
              className="pointer mt2 underline"
            >
              check
            </span>
          </div>
          <div
            className="bg-white mt3 panel-container p3 flex-grow-1 relative"
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
                    <div
                      key={index}
                      style={{ border: '1px solid #D1D1D1' }}
                      className={` flex items-center relative `}
                    >
                      <div className="battery flex items-center flex-grow-1">
                        <div className=" flex-grow-1  ">
                          <span
                            className={`block text-center py1`}
                            style={{
                              backgroundColor: item.isOn
                                ? '#129537'
                                : '#F44336',
                              fontSize: 10,
                              color: '#fff',
                            }}
                          >
                            {' '}
                            {`${item.amp}${item.amp === 70 ? '+' : ''} AMP`}{' '}
                          </span>
                          <div
                            className="breaker-category text-center flex items-center justify-center py-1"
                            style={{ backgroundColor: '#EEEEEE', height: 32 }}
                          >
                            <span
                              className="block"
                              style={{ fontSize: 10, lineHeight: 1.2 }}
                            >
                              {item.category_name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="batter-amp-switch sm-switch flex items-center justify-center">
                        {item.isOn ? (
                          <img
                            src={on}
                            onClick={() => !mainOn && toggle(index)}
                            width={26}
                            height={31}
                            alt=""
                            className="pointer"
                          />
                        ) : (
                          <img
                            src={off}
                            onClick={() => !mainOn && toggle(index)}
                            width={26}
                            height={31}
                            alt=""
                            className="pointer"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="calc-btn-wrapper">
            <button
              onClick={exportPdf}
              disabled={caluclatedBackup !== 1}
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

      {isOpen && (
        <WarningPopup
          setMainOn={setMainOn}
          btnText={btnText}
          popUpMsg={mssg}
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
