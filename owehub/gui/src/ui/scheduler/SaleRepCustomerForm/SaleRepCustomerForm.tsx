import React, { useState } from 'react'
import styles from './styles/index.module.css'
import Input from './component/Input/Input'
import DayPickerCalendar from '../components/ProgressCalendar/ProgressCalendar'
import shardeStyles from '../SalesRepScheduler/styles/customerlist.module.css'
import { IoIosInformationCircle } from 'react-icons/io'
import { format } from 'date-fns'
const timeSlots = [
    { id: 1, time: "6:00 Am - 9:00 Am", uniqueId: 1 },
    { id: 2, time: "9:30 Am - 12:30 Pm", uniqueId: 2 },
    { id: 3, time: "1:00 Pm - 4:00 Pm", uniqueId: 3 },
    { id: 1, time: "4:30 Pm - 7:30 Pm", uniqueId: 4 },
    { id: 2, time: "8:00 Pm - 11:00 Pm", uniqueId: 5 },
];

const dayWithProgress = [
    { id: 1, date: new Date(2024, 8, 20), progress: 75 },
    { id: 2, date: new Date(2024, 8, 23), progress: 35 },
    { id: 3, date: new Date(2024, 8, 24), progress: 70 },
    { id: 4, date: new Date(2024, 8, 25), progress: 63 },
    { id: 5, date: new Date(2024, 8, 26), progress: 79 },
    { id: 6, date: new Date(2024, 8, 27), progress: 20 },
    { id: 7, date: new Date(2024, 8, 30), progress: 95 },
];
interface ITimeSlot {
    id: number;
    time: string;
    uniqueId: number
}
const SaleRepCustomerForm = () => {
    const [step, setStep] = useState(1)
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [availableSlots, setAvailableSlots] = useState<ITimeSlot[]>([])
    const [selectedTime, setSelectedTime] = useState<ITimeSlot>()

    return (
        <div className={`py4 ${styles.form_wrapper}`}>
            <div className={styles.form_conatiner}>
                <div className={` flex items-center justify-center ${styles.form_header}`}>
                    {
                        step < 3 &&

                        <>
                            <div style={{ flexBasis: step === 2 ? "40%" : undefined }}>
                                <div className={step===1?"flex flex-column items-center justify-center ":"mx-auto"} style={{ width: step === 2 ? "fit-content" : undefined }}>
                                    <h3>Customer Information</h3>
                                    <p >
                                        Change the customer information if incorrect
                                    </p>
                                </div>
                            </div>

                            {step === 2 && <div style={{ flexBasis: "60%" }}>
                                <div className='flex items-center justify-center'>
                                    <h3 className='text-white text-center'>Select Date & Time</h3>
                                </div>
                            </div>}

                        </>
                    }

                </div>
                {
                    step === 3 && <div className='flex items-center flex-column justify-center' style={{ width: "100%", height: "500px" }} >
                        <h3 className={shardeStyles.survey_success_message}>Site survey scheduled 👍</h3>
                        <h5 className={shardeStyles.selected_time}>{selectedDate && format(selectedDate, "EEEE, dd MMM")}  {selectedTime?.time} </h5>
                    </div>
                }
                <div className="flex">
                    {step <= 2 && <div style={{ flexBasis: step === 1 ? "50%" : "40%" }} className={`${styles.form_content} py3 px4`}>
                        <div className='mb2'>
                            <Input label='Prospect ID' value={"48594"} />
                        </div>

                        <div className='mb2'>
                            <Input label='Name' value={"Peter Parket"} />
                        </div>
                        <div className='mb2'>
                            <Input label='Phone no.' value={"983 4785 9298"} />
                        </div>

                        <div className='mb2'>
                            <Input label='Email' value={"john@gmail.com"} />
                        </div>

                        <div className='mb2'>
                            <Input label='Email' value={"103, avenue street, Colorado, 267531"} />
                        </div>

                        <div className=''>
                            <Input showIsEditing={false} label='Sales Rep' value={"Ajay Negi"} />
                        </div>




                    </div>}
                    {step === 2 &&
                        <div className={styles.date_time_wrapper}>

                            <div className={` flex items-start  py3  ${selectedDate ? "justify-between px3" : "justify-center"} `}>
                                <DayPickerCalendar onClick={(e) => {
                                    setSelectedDate(e.date)
                                    setSelectedTime(undefined)
                                    setAvailableSlots([...timeSlots.filter(slot => slot.id === e.event.id)])
                                }} dayWithProgress={dayWithProgress} />
                                {selectedDate ? <div className='flex flex-column  justify-center'>
                                    <h5 className=' my2' style={{ fontSize: 14, fontWeight: 500 }}> Select time slot</h5>
                                    <div className='flex flex-column items-center justify-center'>
                                        {!!availableSlots.length ? availableSlots.map((slot) => {
                                            return <button onClick={() => setSelectedTime(slot)} key={slot.uniqueId} className={`${shardeStyles.time_slot_pill} ${selectedTime?.uniqueId === slot.uniqueId ? shardeStyles.active_time_slot : shardeStyles.inactive_time_slot} `}>
                                                {slot.time}
                                            </button>
                                        }) : <h5>No Slot Available</h5>}
                                    </div>
                                </div> : ""}
                            </div>

                            {selectedTime && selectedDate &&
                                <div className='mt2'>
                                    <div className="flex mb2 items-center justify-center">
                                        <h5 className={shardeStyles.selected_time}>{format(selectedDate, "EEEE, dd MMM")}  {selectedTime.time} </h5>
                                        <IoIosInformationCircle className='ml1' color='#1F2937' size={17} />
                                    </div>
                                    <button onClick={() => setStep(3)} className={`mx-auto ${shardeStyles.calendar_schedule_btn}`} >
                                        Submit
                                    </button>
                                </div>
                            }
                        </div>
                    }

                </div>

                {step === 1 && <div className='bg-white mt3' >
                    <p style={{ fontSize: 12 }} className='text-center mb2'>Make sure all the information is correct before confirming</p>
                    <button onClick={() => setStep(2)} className={` mx-auto  ${styles.submit_btn}`}>Confirm</button>
                </div>}
            </div>

        </div>
    )
}

export default SaleRepCustomerForm