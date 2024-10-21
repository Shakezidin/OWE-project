import React, { useState, useRef } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/appointmentScheduler.css';
import { timeSlots } from '../../../resources/static_data/Constant';
import { toast } from 'react-toastify';
import classes from "./AppoitnmentSchedular.module.css"

interface AppointmentSchedulerProps {
  setVisibleDiv: (div: number) => void;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
}

const today = new Date();
const CurrentDate = today.toISOString().split('T')[0];
 



const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  setVisibleDiv,
  onDateChange,
  onTimeChange,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date(CurrentDate));
  const [selectedTime, setSelectedTime] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(true);
  const [time, setTime] = useState(new Date());
  const [isManualInput, setIsManualInput] = useState(false);
  const manualInputTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  console.log(selectedTime, "doner soem")
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  var newTime = new Date(time);

  // const handleDigitalTimeChange = (e: any) => {
  //   setIsManualInput(true);

  //   if (manualInputTimeoutRef.current) {
  //     clearTimeout(manualInputTimeoutRef.current);
  //   }

  //   const [hours, minutes] = e.target.value.split(':').map(Number);

  //   newTime.setHours(hours);
  //   newTime.setMinutes(minutes);
  //   newTime.setSeconds(0);
  //   setTime(newTime);




  //   console.log(`Selected time: ${selectedTime}`);
  //   setSelectedTime(newTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
  //   onTimeChange(newTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
  // };


  const handleDigitalTimeChange = (e: any) => {
    setIsManualInput(true);
  
    if (manualInputTimeoutRef.current) {
      clearTimeout(manualInputTimeoutRef.current);
    }
  
    const inputValue = e.target.value;
    let hours = 0;
    let minutes = 0;
  
    if (inputValue) {
      const [inputHours, inputMinutes] = inputValue.split(':').map(Number);
      hours = isNaN(inputHours) ? 0 : inputHours;
      minutes = isNaN(inputMinutes) ? 0 : inputMinutes;
    }
  
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    newTime.setSeconds(0);
    setTime(newTime);
  
    console.log(`Selected time: ${selectedTime}`);
  
    const formattedTime = inputValue
      ? newTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : '00:00';
  
    setSelectedTime(formattedTime);
    onTimeChange(formattedTime);
  };

  
  return (
    <div className="appointmentSchedulerContainer">
      {/* <div className="selectorButtons">
        <button
          className={`selectorButton ${isDatePickerOpen ? 'active' : ''}`}
          onClick={() => setIsDatePickerOpen(true)}
        >
          Date
        </button>
        <button
          className={`selectorButton ${!isDatePickerOpen ? 'active' : ''}`}
          onClick={() => setIsDatePickerOpen(false)}
        >
          Time
        </button>
      </div> */}

      {isDatePickerOpen ? (
        <div className="calendarContainer">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            inline
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className="custom-header">
                <button
                  className="prev-month"
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                >
                  {'<'}
                </button>
                <span className="custom-header-text">
                  {date.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <button
                  className="next-month"
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                >
                  {'>'}
                </button>

              </div>

            )}
          />
          <div className={classes.DigitalInput}>
            <input
              type="time"
              id="time-input"
              value={`${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`}
              onChange={handleDigitalTimeChange}
            />
          </div>
        </div>
      ) : (
        <div className="timeSlotContainer">


          {/* {timeSlots.map((time) => (
            <button
              key={time}
              className={`timeSlot ${selectedTime === time ? 'active' : ''}`}
              onClick={() => handleTimeChange(time)}
            >
              {time}
            </button>
          ))} */}
        </div>
      )}

      <div className="selectedDateDisplay">
        <span className={classes.TimeDisplay}>
          {newTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
        </span> <span style={{ paddingRight: '10px', paddingLeft: '0px', marginLeft: '0px' }}>-</span>
        {selectedDate
          .toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
          .toUpperCase()}

      </div>

      <div
        className={`sendAppointmentBtn ${
          selectedTime && selectedDate ? '' : 'sendAppointmentBtnDisabled'
        }`}
      >
        <button
          onClick={() => {
            if (selectedTime && selectedDate) {
              setVisibleDiv(11);
            } else {
              toast.warn('Please select date & time before proceeding.');
            }
          }}
        >
          SEND APPOINTMENT
        </button>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
