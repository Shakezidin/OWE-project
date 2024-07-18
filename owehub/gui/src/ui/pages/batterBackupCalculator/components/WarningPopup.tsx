import React, { SetStateAction } from 'react';
import { WarningIcon } from '../icons';
import { Ibattery } from './BatteryAmp';
import { CgClose } from 'react-icons/cg';
interface IPopPupProps {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<SetStateAction<boolean>>;
  setMainOn: React.Dispatch<SetStateAction<boolean>>;
  setRequiredBattery: React.Dispatch<SetStateAction<number>>;
  setMainDisabled: React.Dispatch<SetStateAction<boolean>>;
  required: number;
  setBatteryPower: React.Dispatch<SetStateAction<Ibattery[]>>;
  popUpMsg: string;
  btnText: {
    primaryText: string;
    secondaryText: string;
  };
}
const WarningPopup = ({
  isOpen,
  setIsOpen,
  setMainOn,
  setMainDisabled,
  setRequiredBattery,
  required,
  setBatteryPower,
  popUpMsg,
  btnText,
}: IPopPupProps) => {
  const handleClose = () => {
    setIsOpen?.((prev) => !prev);
  };
  return (
    <div className="transparent-model px2 scrollbar">
      <div
        style={{ border: '2px solid #D3D3D3' }}
        className="scrollbar modal py3 px2 relative "
      >
        <div
          className="absolute pointer"
          onClick={handleClose}
          style={{ right: 20, top: 17 }}
        >
          <CgClose size={16} color="#0000004d" />
        </div>
        <div className="mx-auto flex justify-center">
          <WarningIcon />
        </div>

        <div className="text-center mt2">
          <h3 className="text-center text-dark" style={{ fontWeight: 700 }}>
            Important Information
          </h3>
          <p
            className="text-dark mt1"
            style={{ fontWeight: 500, fontSize: 14 }}
          >
            You are attempting to reduce the total number of batteries below our
            recommended minimum for a Full Home Back-Up.We cannot gaurentee the
            effectiveness in which this battery configuration can support your
            home. Would you like to remain at the recommended battery quantity
            for a Full Home Back-Up or reduce the number of batteries in this
            system and switch to a Partial Home Back-up
          </p>
        </div>
        <div className="mt4">
          <button
            onClick={() => {
              setMainOn(false);
              setMainDisabled(false);

              setRequiredBattery((prev) => (prev ? prev - 1 : prev));

              handleClose();
              setBatteryPower((prev) =>
                prev.map((battery) => ({ ...battery, isOn: false }))
              );
            }}
            className="calc-grey-btn warning-popup-btn pointer"
          >
           I would like to switch to a partial home back-up.
          </button>
          <button
            onClick={() => {
              setMainDisabled(true);
              handleClose();
              setMainOn(true);
              setBatteryPower((prev) =>
                prev.map((battery) => ({ ...battery, isOn: true }))
              );
              setRequiredBattery(required);
            }}
            className="calc-green-btn pointer warning-popup-btn"
          >
           I would like to remain with the recommended configuration.
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningPopup;
