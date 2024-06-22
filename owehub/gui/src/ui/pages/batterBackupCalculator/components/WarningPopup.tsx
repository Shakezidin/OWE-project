import React, { SetStateAction } from 'react';
import { WarningIcon } from '../icons';
interface IPopPupProps {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<SetStateAction<boolean>>;
}
const WarningPopup = ({ isOpen, setIsOpen }: IPopPupProps) => {
  const handleClose = () => {
    setIsOpen?.((prev) => !prev);
  };
  return (
    <div className="transparent-model scrollbar">
      <div className=" modal py3 px4 ">
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
            powered by the remaining configuration. We cannot gaurentee the
            duration in which this battery configuration can support your whole
            home. If you would like to maximize the back-up duration of your
            system we advise you remain at the recommended battery quantity or
            switch to a partial home back-up
          </p>
        </div>
        <div className="mt4">
          <button
            onClick={handleClose}
            className="calc-grey-btn warning-popup-btn pointer"
          >
            I would like to switch to a partial home back-up.
          </button>
          <button
            onClick={handleClose}
            className="calc-green-btn pointer warning-popup-btn"
          >
            I would like to remain with the recommended configuration.
          </button>
          <button
            onClick={handleClose}
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
