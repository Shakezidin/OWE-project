import React, { SetStateAction } from 'react';
import { WarningIcon } from '../icons';
import { Ibattery } from './BatteryAmp';
interface IPopPupProps {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<SetStateAction<boolean>>;
  setMainOn: React.Dispatch<SetStateAction<boolean>>;
  setRequiredBattery: React.Dispatch<SetStateAction<number>>;
  setMainDisabled: React.Dispatch<SetStateAction<boolean>>;
  required: number;
  setBatteryPower: React.Dispatch<SetStateAction<Ibattery[]>>;
}
const WarningPopup = ({
  isOpen,
  setIsOpen,
  setMainOn,
  setMainDisabled,
  setRequiredBattery,
  required,
  setBatteryPower,
}: IPopPupProps) => {
  const handleClose = () => {
    setIsOpen?.((prev) => !prev);
  };
  return (
    <div className="transparent-model scrollbar">
      <div className="scrollbar modal py3 px4 ">
        <div className="mx-auto flex justify-center">
          <WarningIcon />
        </div>

        <div className="text-center mt2">
          <h3 className="text-center text-dark" style={{ fontWeight: 700 }}>
            Important Information
          </h3>
          <p className="text-dark mt1" style={{ fontWeight: 500 }}>
            You are attempting to reduce the total number of batteries below our
            recommendation. Reducing the total number of batteries will
            significantly affect the duration in which your whole home can be
            powered by the remaining configuration. We cannot guarantee the
            duration in which this battery configuration can support your whole
            home. If you would like to maximize the back-up duration of your
            system we advise you remain at the recommended battery quantity or
            switch to a partial home back-up
          </p>
        </div>
        <div className="mt4">
          <button
            onClick={() => {
              setMainOn(false);
              setMainDisabled(true);
              setRequiredBattery((prev) => (prev ? prev - 1 : prev));
              handleClose();
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
              setRequiredBattery(required);
              setBatteryPower((prev) =>
                prev.map((battery) => ({ ...battery, isOn: true }))
              );
            }}
            className="calc-green-btn pointer warning-popup-btn"
          >
            I would like to remain with the recommended configuration.
          </button>
          <button
            onClick={() => {
              setMainDisabled(false);
              handleClose();
            }}
            className="outline-btn warning-popup-btn pointer"
          >
            I would like to reduce the total number of batteries.
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningPopup;
