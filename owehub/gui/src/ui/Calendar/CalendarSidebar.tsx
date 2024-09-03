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

    const calendarData = [
        { id: "OUR8636", name: "David Miller", status: "scheduled", title: "Survey", category: "ID", color: "#57B3F1" },
        { id: "OUR8346", name: "John Robert", status: "completed", title: "Electric", category: "ID", color: "#8E81E0" },
        { id: "OUR8634", name: "Bratt Mark", status: "scheduled", title: "Install PV", category: "Info", color: "#C470C7" },
        { id: "OUR6454", name: "David Miller", status: "scheduled", title: "Survey", category: "ID", color: "#57B3F1" },
        { id: "OUR4453", name: "John Robert", status: "completed", title: "Electric", category: "ID", color: "#8E81E0" },
        { id: "OUR7453", name: "Bratt Mark", status: "scheduled", title: "Install PV", category: "Info", color: "#C470C7" },
        { id: "OUR7454", name: "David Miller", status: "scheduled", title: "Survey", category: "ID", color: "#57B3F1" },
        { id: "OUR2342", name: "John Robert", status: "completed", title: "Electric", category: "ID", color: "#8E81E0" },
        { id: "OUR5432", name: "Bratt Mark", status: "scheduled", title: "Install PV", category: "Info", color: "#C470C7" },
        { id: "OUR6343", name: "David Miller", status: "scheduled", title: "Survey", category: "ID", color: "#57B3F1" },
        { id: "OUR7464", name: "John Robert", status: "completed", title: "Electric", category: "ID", color: "#8E81E0" },
        { id: "OUR3453", name: "Bratt Mark", status: "scheduled", title: "Install PV", category: "Info", color: "#C470C7" },
    ]

    return (
        <div className="sidebar-wrapper">
            <div className="user-sidebar scrollbar">
                <div className='upper-section'>
                    <div className="close-icon" onClick={onClose}><FaArrowRight /></div>
                    <p>{formattedDate}</p>
                </div>
                <div className="main-section">
                    <div className='sidebar-cards'>
                        {calendarData.map((data) => (
                            <div className="card">
                                <p className='card-title' style={{color: data.color}}><span style={{background: data.color}}></span>{data.title} Date</p>
                                <p className='card-id'>Project {data.category}</p>
                                <p className='our-id'>{data.id}</p>
                                <p className='card-name'>{data.name}</p>
                                <button className='card-status' style={{backgroundColor: data.status === "completed" ? "#63ACA3" : "#3C7AF1"}}>{data.status}</button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CalendarSidebar;
