import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/appointmentScheduler.css';

interface AppointmentSchedulerProps {
  setVisibleDiv: (div: number) => void;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  setVisibleDiv,
  onDateChange,
  onTimeChange,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date('2024-08-25'));
  const [selectedTime, setSelectedTime] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(true);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    onTimeChange(time);
  };

  const timeSlots = [
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
  ];

  return (
    <div className="appointmentSchedulerContainer">
      <div className="selectorButtons">
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
      </div>

      {isDatePickerOpen ? (
        <div className="calendarContainer">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
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
        </div>
      ) : (
        <div className="timeSlotContainer">
          {timeSlots.map((time) => (
            <button
              key={time}
              className={`timeSlot ${selectedTime === time ? 'active' : ''}`}
              onClick={() => handleTimeChange(time)}
            >
              {time}
            </button>
          ))}
        </div>
      )}

      <div className="selectedDateDisplay">
        {selectedDate
          .toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
          .toUpperCase()}
        {selectedTime && `, ${selectedTime}`}
      </div>

      <div className="sendAppointmentBtn">
      <button 
    onClick={() => {
      if (selectedTime) {
        setVisibleDiv(1);
      } else {
        console.log('Please select a time before proceeding.');
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

