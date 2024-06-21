import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import dummy from './lib/dummy_img.png';
import Input from '../../components/text_input/Input';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TbMinus, TbPlus } from 'react-icons/tb';
import { TfiTrash } from 'react-icons/tfi';
import BatteryAmp from './components/BatteryAmp';
const apms = [
  '15 AMP',
  '20 AMP',
  '25 AMP',
  '30 AMP',
  '35 AMP',
  '40 AMP',
  '45 AMP',
  '50 AMP',
  '60 AMP',
  '70+ AMP',
];
const Index = () => {
  const [inputDetails, setInputDetails] = useState({
    prospectName: '',
    lra: '',
    continuousCurrent: '',
  });
  type TError = typeof inputDetails;
  const [errors, setErrors] = useState<TError>({} as TError);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [batter, setBattery] = useState<
    {
      quantity: number;
      amp: string;
      note: string;
    }[]
  >([]);
  const form = useRef<HTMLDivElement | null>(null);
  const exportPdf = () => {
    if (form.current) {
      html2canvas(form.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        let imgWidth = pdfWidth;
        let imgHeight = pdfWidth / 2;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('download.pdf');
      });
    }
  };
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const elm = e.target as HTMLElement;
      if (!elm.closest('.unit-wrapper') && !isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  }, []);
  const handleValidation = () => {
    const error: TError = {} as TError;
    for (const key in inputDetails) {
      if (!inputDetails[key as keyof typeof inputDetails]) {
        error[key as keyof typeof inputDetails] =
          `${key} is required`;
      }
    }
    setErrors({ ...error });
    return Object.keys(error).length ? false : true;
  };
  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'continuousCurrent') {
      value = value.replace(/[^0-9.]/g, '');
    }
    setInputDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (type: 'inc' | 'dec', ind: number) => {
    const battery = [...batter];
    if (type === 'inc') {
      batter[ind].quantity += 1;
    } else {
      if (batter[ind].quantity > 1) {
        batter[ind].quantity -= 1;
      }
    }
    setBattery(battery);
  };
  if (step === 1) return <BatteryAmp battery={batter} />;
 
  
  return (
    <div className="p3" style={{backgroundColor:"#F2F2F2",minHeight:"100vh"}}>
    <div className="bg-white battery-wrapper p3" ref={form}>
      <div className="wrapper-header">
        <h4 className="h4" style={{ fontWeight: 500 }}>
          Breakers Details Form
        </h4>
        <p
          className="mt1"
          style={{ color: '#7F7F7F', fontSize: 12, fontWeight: 500 }}
        >
          {' '}
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.{' '}
        </p>
      </div>

      <div className="flex  ">
        <div className="col-3 px-2 ">
          <div className="inline-block mt3">
            <img src={dummy} alt="" />
            <p style={{ fontSize: 12, color: '#919191', textAlign: 'center' }}>
              Electrical Panel .IMG
              <br />
              18/06/2024
            </p>
          </div>
        </div>
        <div className="col-9">
          <div className="flex mxn2 " style={{ height: '95%' }}>
            <div
              className="col-4 pl2"
              style={{ borderRight: '2px dashed #EBEBEB ', marginTop: 25 }}
            >
              <div className="pr3">
                <div className="mb3 calc-input">
                  <Input
                    onChange={inputHandler}
                    value={inputDetails.prospectName}
                    name="prospectName"
                    type="text"
                    placeholder=""
                    label="Prospect name"
                  />
                  {errors.prospectName && (
                    <span className="error">
                      {' '}
                      {errors.prospectName.replaceAll(
                        'prospectName',
                        'Prospect name'
                      )}{' '}
                    </span>
                  )}
                </div>

                <div className="mb3 calc-input">
                  <Input
                    onChange={inputHandler}
                    value={inputDetails.lra}
                    name="lra"
                    type="text"
                    placeholder=""
                    label="Locked Rotor Amps (LRA)"
                  />

                  {errors.lra && (
                    <span className="error">
                      {' '}
                      {errors.lra.replaceAll(
                        'lra',
                        'Locked Rotor Amps (LRA)'
                      )}{' '}
                    </span>
                  )}
                </div>

                <div className="mb3 calc-input">
                  <Input
                    onChange={inputHandler}
                    value={inputDetails.continuousCurrent}
                    name="continuousCurrent"
                    type="text"
                    placeholder=""
                    label="Continuous Current"
                  />
                  {errors.continuousCurrent && (
                    <span className="error">
                      {' '}
                      {errors.continuousCurrent.replaceAll(
                        'continuousCurrent',
                        'Continuous Current'
                      )}{' '}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="col-8 calc-container">
              <div className="flex items-center" style={{ marginTop: 25 }}>
                <div style={{ flexBasis: '25%' }}>
                  <span className="calc-label">Breakers size</span>
                </div>
                <div>
                  <span className="calc-label">Quantity</span>
                </div>
              </div>

              {batter.map((battery, ind) => {
                return (
                  <div
                    className="calc-row"
                    key={ind}
                    style={{ marginBlock: 10 }}
                  >
                    <div className="calc-border amp-p calc-caret">
                      {' '}
                      {battery.amp}{' '}
                    </div>
                    <div className="calc-border flex items-center justify-center calc-caret">
                      <div style={{ gap: 24 }} className="flex items-center">
                        <TbPlus
                          size={16}
                          className="pointer"
                          onClick={() => handleToggle('inc', ind)}
                        />

                        <span> {battery.quantity} </span>
                        <TbMinus
                          size={16}
                          className="pointer"
                          onClick={() => handleToggle('dec', ind)}
                        />
                      </div>
                    </div>
                    <div className="calc-border calc-caret flex items-center justify-center">
                      <input
                        type="text"
                        onChange={(e) => {
                          const battery = [...batter];
                          battery[ind].note = e.target.value;
                          setBattery([...battery]);
                        }}
                        value={battery.note}
                        placeholder="Add Note +"
                      />
                    </div>
                    <div className=" flex items-center justify-center">
                      <TfiTrash
                        className="pointer"
                        size={18}
                        onClick={() =>
                          setBattery((prev) =>
                            prev.filter((_, index) => index !== ind)
                          )
                        }
                      />
                    </div>
                  </div>
                );
              })}
              <div className="unit-wrapper calc-border ">
                {!isOpen ? (
                  <p className="text-center" onClick={() => setIsOpen(true)}>
                    Add more breakres +
                  </p>
                ) : (
                  <p>Add Breaker Size</p>
                )}
                {isOpen && (
                  <div className="mt2 unit-grid">
                    {apms.map((item, index) => {
                      return (
                        <div
                          onClick={() => {
                            setBattery((prev) => [
                              ...prev,
                              { note: '', amp: item, quantity: 1 },
                            ]);
                            setIsOpen(false);
                          }}
                          className="flex items-center justify-center"
                          key={index}
                        >
                          {item}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex mt4 justify-center calc-btn-wrapper items-center">
        <button
          onClick={() => {
            setBattery([]);
          }}
          className="calc-btn calc-grey-btn pointer"
        >
          Reset All
        </button>
        <button
          className="calc-btn text-white pointer text-white calc-yellow-btn"
          onClick={exportPdf}
        >
          Export PDF
        </button>

        <button
          onClick={() => handleValidation() && setStep((prev) => prev + 1)}
          className="calc-btn text-white pointer calc-green-btn"
        >
          Generate
        </button>
      </div>
    </div>
    </div>
  );
};

export default Index;
