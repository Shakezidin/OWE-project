import React from 'react';
import "./CalendarSidebar.css";
import { FaArrowRight } from "react-icons/fa6";


interface CalendarSidebarProps {
    onClose?: () => void;
    selectedDate: Date | null;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({ onClose, selectedDate }) => {
    const formatDate = (date: Date | null) => {
        if (!date) return 'No date selected';
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        return formatter.format(date).replace(',', '');
    };

    const formattedDate = formatDate(selectedDate);

    return (
        <div className="sidebar-wrapper">
            <div className="user-sidebar scrollbar">
                <div className='upper-section'>
                    <div className="close-icon" onClick={onClose}><FaArrowRight /></div>
                    <p>{formattedDate}</p>
                </div>
               
            </div>
        </div>
    );
};

export default CalendarSidebar;
