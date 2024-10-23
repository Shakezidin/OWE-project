import React, { useState, useRef } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/appointmentScheduler.css';
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
  // const [selectedTime, setSelectedTime] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(true);
  const [time, setTime] = useState(new Date());
  const [isManualInput, setIsManualInput] = useState(false);
  const manualInputTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // console.log(selectedTime, "doner soem")
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  var newTime = new Date(time);





  //   console.log(`Selected time: ${selectedTime}`);
  //   setSelectedTime(newTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
  //   onTimeChange(newTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
  // };

  const [selectedTime, setSelectedTime] = useState('');

  const handleTimeChange = (time: any) => {
    setSelectedTime(time);
    if (time) {
      const formattedTime = new Date(time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).replace(/^(\d):/, (match, hour) => (hour.length === 1 ? `0${hour}:` : match));
      onTimeChange(formattedTime);
    } else {
      onTimeChange('');
    }
  };

  console.log(selectedTime, "comdloeb ")







  return (
    <div className="appointmentSchedulerContainer">
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
            {/* <input
              type="time"
              id="time-input"
              value={`${(time.getHours() % 12 || 12).toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`}
              onChange={handleDigitalTimeChange}
            /> */}
            <DatePicker
              selected={selectedTime ? new Date(selectedTime) : new Date()}
              onChange={handleTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={1}
              timeCaption="Time"
              dateFormat="h:mm aa"
            />
          </div>
        </div>
      ) : (
        <div className="timeSlotContainer">
        </div>
      )}

      <div className="selectedDateDisplay">
        <span className={classes.TimeDisplay}>
          {selectedTime ?
            new Date(selectedTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            }).replace(/^(\d):/, (match, hour) => (hour.length === 1 ? `0${hour}:` : match))
            :
            new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            }).replace(/^(\d):/, (match, hour) => (hour.length === 1 ? `0${hour}:` : match))
          }
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
        className={`sendAppointmentBtn ${selectedTime && selectedDate ? '' : 'sendAppointmentBtnDisabled'
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
