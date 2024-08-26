// Calendar.js
import React, { useState } from 'react';
import {
  format,
  addDays,
  startOfWeek,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfDay,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import './OldCalendar.css';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample event data with colors
  const [events] = useState([
    { date: new Date(2024, 7, 1), color: 'red', title: 'Meeting' },
    { date: new Date(2024, 7, 1), color: 'green', title: 'Conference' },
    { date: new Date(2024, 7, 1), color: 'blue', title: 'Workshop' },
    { date: new Date(2024, 7, 5), color: 'red', title: 'Meeting' },
    { date: new Date(2024, 7, 5), color: 'green', title: 'Conference' },
    { date: new Date(2024, 7, 5), color: 'blue', title: 'Workshop' },
    { date: new Date(2024, 7, 24), color: 'red', title: 'Meeting' },
    { date: new Date(2024, 7, 24), color: 'green', title: 'Conference' },
    { date: new Date(2024, 7, 24), color: 'blue', title: 'Workshop' },
    { date: new Date(2024, 7, 20), color: 'red', title: 'Meeting' },
    { date: new Date(2024, 7, 20), color: 'green', title: 'Conference' },
    { date: new Date(2024, 7, 20), color: 'blue', title: 'Workshop' },
    { date: new Date(2024, 8, 20), color: 'red', title: 'Meeting' },
    { date: new Date(2024, 8, 20), color: 'green', title: 'Conference' },
    { date: new Date(2024, 8, 20), color: 'blue', title: 'Workshop' },
    { date: new Date(2024, 6, 31), color: 'red', title: 'Meeting' },
    { date: new Date(2024, 6, 31), color: 'green', title: 'Conference' },
    { date: new Date(2024, 6, 31), color: 'blue', title: 'Workshop' },
  ]);

  // creating header here
  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={prevMonth}>
            {'<'}
          </div>
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon">{'>'}</div>
        </div>
      </div>
    );
  };

  // render numbers of days
  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEE';
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  };

  // creating cells
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = addDays(startOfWeek(monthEnd), 6);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;

        // Filter events for the current day
        const dayEvents = events.filter((event) => isSameDay(day, event.date));

        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? 'non-month'
                : isSameDay(day, selectedDate)
                  ? 'selected'
                  : ''
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="number">{formattedDate}</span>

            {dayEvents.map((event, index) => (
              <div  key={index} className={`event-box event-${event.color}`}>
            
            <span className='event-icon'>1</span>  {event.title}
          </div>
              
            ))}
          </div>
        );
        day = addDays(day, 1);
      }
      console.log(rows);
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
    // Handle scheduling modal or form here
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
