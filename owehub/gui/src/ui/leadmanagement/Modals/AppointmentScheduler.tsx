import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/appointmentScheduler.css';

interface AppointmentSchedulerProps {
  setVisibleDiv: (div: number) => void;
}

    // Update the AppointmentScheduler component definition
const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ setVisibleDiv }) => {

    const [selectedDate, setSelectedDate] = useState(new Date('2024-08-25'));
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        setIsDatePickerOpen(false);
    };
    const CustomInput = ({ value, onClick }: { value: string; onClick: () => void }) => (
        <button className="text-lg font-semibold" onClick={onClick}>
            {value}
        </button>
    );

    return (
        <div className={'appointmentSchedulerContainer'}>
            {/* Date/Time Selector */}
            <div className={'selectorButtons'}>
                <button
                    className={'dateButton'}
                    onClick={() => setIsDatePickerOpen(true)}
                >
                    Date
                </button>
                <button
                    className={'timeButton'}
                    onClick={() => setIsDatePickerOpen(true)}
                >
                    Time
                </button>
            </div>

            {/* Calendar */}
            <div className={'calendarContainer'}>
                <div className={'calendarWrapper'}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        customInput={
                            <CustomInput
                                value={selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                onClick={() => setIsDatePickerOpen(true)}
                            />
                        }
                        dateFormat="dd MMM, yyyy"
                        open={isDatePickerOpen}
                        onClickOutside={() => setIsDatePickerOpen(false)}
                        inline
                    />
                </div>
            </div>

            {/* Selected Date Display */}
            <div className={'selectedDateDisplay'}>
                <span>
                    {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
            </div>

            {/* Send Appointment Button */}
            <div className={'sendAppointmentBtn'} onClick={() => setVisibleDiv(1)}>
                <button>SEND APPOINTMENT</button>
            </div>
        </div>
    );
};

export default AppointmentScheduler;
