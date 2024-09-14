import React, { useRef, useState } from 'react'
import './index.css'

const LeadCalender = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const calendarRef = useRef<HTMLDivElement>(null);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const yearRange = 75
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: yearRange * 2 + 1 }, (_, i) => currentYear - yearRange + i);

    return (
        <div>
            <div className="lead-cal-content">
                <div className="lead-calc-container">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    >
                        {months.map((month, index) => (
                            <option key={month} value={index}>{month}</option>
                        ))}
                    </select>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="lead-cal-btns">
                    <button className="lead-reset-calender" >
                        Reset
                    </button>
                    <button className="lead-apply-calender">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LeadCalender
