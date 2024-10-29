import React, { useState } from 'react';
import Styles from './scheduledActivity.module.css';
import { TbChevronDown } from 'react-icons/tb';
import { CiMail } from 'react-icons/ci';
import { BiPhone } from 'react-icons/bi';
import Select, {
  SelectOption,
} from '../../SalesRepScheduler/components/Select';
import { FaXmark } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import useEscapeKey from '../../../../hooks/useEscape';
import useMatchMedia from '../../../../hooks/useMatchMedia';

interface Appointment {
  name: string;
  email: string;
  contact_number: string;
  scheduled_time: string;
  status: 'Pending' | 'Approved';
}

interface AppointmentData {
  date: string;
  appointment: Appointment[];
}

interface ScheduledActivityProps {
  onClose: () => void;
}

function ScheduledActivity({ onClose }: ScheduledActivityProps) {
  const [selectedDate, setSelectedDate] = useState<number>(-1);
  const [collapse, setCollapse] = useState<number>(-1);
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);
  const navigate = useNavigate();
  const isMobile = useMatchMedia('(max-width:600px)');

  const appointmentsData: AppointmentData[] = [
    {
      date: '28 Oct 2024',
      appointment: [
        {
          name: 'Jacob Martin',
          email: 'Alexsimon322@gmail.com',
          contact_number: '(831) 544-1235',
          scheduled_time: '9:45 AM',
          status: 'Pending',
        },
        {
          name: 'Jacob Martin',
          email: 'Alexsimon322@gmail.com',
          contact_number: '(831) 544-1235',
          scheduled_time: '11:45 AM',
          status: 'Pending',
        },
        {
          name: 'Jacob Martin',
          email: 'Alexsimon322@gmail.com',
          contact_number: '(831) 544-1235',
          scheduled_time: '2:45 PM',
          status: 'Approved',
        },
      ],
    },
    {
      date: '29 Oct 2024',
      appointment: [
        {
          name: 'Jacob Martin',
          email: 'Alexsimon322@gmail.com',
          contact_number: '(831) 544-1235',
          scheduled_time: '9:45 AM',
          status: 'Pending',
        },
        {
          name: 'Jacob Martin',
          email: 'Alexsimon322@gmail.com',
          contact_number: '(831) 544-1235',
          scheduled_time: '11:45 AM',
          status: 'Approved',
        },
      ],
    },
    {
      date: '30 Oct 2024',
      appointment: [
        {
          name: 'Jacob Martin',
          email: 'Alexsimon322@gmail.com',
          contact_number: '(831) 544-1235',
          scheduled_time: '9:45 AM',
          status: 'Pending',
        },
      ],
    },
    {
      date: '31 Oct 2024',
      appointment: [],
    },
  ];

  const stateOptions: SelectOption[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Arizona', value: 'AZ' },
    { label: 'Texas', value: 'TX' },
    { label: 'New Mexico', value: 'NM' },
  ];

  const handleSelectChange = (options: SelectOption[]) => {
    setSelectedOptions(options);
    console.log(options);
  };

  const handleEdit = (appointment: Appointment) => {
    console.log('Edit:', appointment);
  };

  const handleCancel = (appointment: Appointment) => {
    console.log('Cancel:', appointment);
  };

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  useEscapeKey(() => setCollapse(-1));

  return (
    <div className={Styles.main_container}>
      <div className={Styles.header}>
        <div className={Styles.title}>Scheduled Activity</div>
        <div className={Styles.header_right}>
          <Select
            options={stateOptions}
            selectedOptions={selectedOptions}
            onChange={handleSelectChange}
            placeholder="State"
          />
          <span onClick={onClose} className={Styles.back_button}>
            <FaXmark className={Styles.icon} />
          </span>
        </div>
      </div>
      <div className={Styles.appointment_container}>
        {appointmentsData.map((data, index) => {
          const appointmentDate = new Date(data.date);
          const dateLabel =
            appointmentDate.toDateString() === today.toDateString()
              ? `Today ${data.date}`
              : appointmentDate.toDateString() === tomorrow.toDateString()
                ? `Tomorrow ${data.date}`
                : data.date;

          return (
            <div key={index}>
              <div
                onClick={() => {
                  setSelectedDate(index);
                  setCollapse(collapse === index ? -1 : index);
                }}
                className={`${Styles.date_container} ${selectedDate === index ? Styles.open : ''}`}
              >
                <div>
                  {data.appointment.length > 0
                    ? `${data.appointment.length} Appointment${data.appointment.length > 1 ? 's' : ''}`
                    : 'No Appointments'}
                </div>

                <div className={Styles.date_button}>
                  <div>{dateLabel}</div>

                  <div className={Styles.chevron_button}>
                    <TbChevronDown
                      size={18}
                      style={{
                        transform:
                          collapse === index ? 'rotate(180deg)' : undefined,
                        transition: 'all 500ms',
                      }}
                    />
                  </div>
                </div>
              </div>
              {selectedDate === index && collapse === index && (
                <div className={Styles.appointments_list}>
                  {data.appointment.length > 0 ? (
                    data.appointment.map((appointment, apptIndex) => (
                      <div key={apptIndex} className={Styles.appointment_item}>
                        <div className={Styles.left_container}>
                          <div className={Styles.name_container}>
                            <span
                              style={{
                                backgroundColor: '#FFEAEA',
                                borderRadius: '50%',
                              }}
                            >
                              {appointment.name
                                .split(' ')
                                .map((name) => name[0])
                                .join('')
                                .toUpperCase()}{' '}
                            </span>
                            <div className={Styles.name}>
                              {appointment.name}
                            </div>
                          </div>
                          <div className={Styles.mail_and_number}>
                            <div className={Styles.mail_container}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <CiMail size={15} />
                              </div>
                              <div>{appointment.email}</div>
                            </div>
                            <div className={Styles.phone_container}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <BiPhone size={15} />
                              </div>
                              <div>{appointment.contact_number}</div>
                            </div>
                          </div>
                        </div>
                        <div
                        className={`${isMobile ? Styles.hide : Styles.second_container}`}
                        >
                          <div className={Styles.scheduled_date}>
                            Scheduled Date & Time{' '}
                          </div>
                          <div
                            className={`${Styles.dateAndTime}`}
                            
                          >
                            {' '}
                            <div>{data.date}</div>
                            <div> {appointment.scheduled_time}</div>
                          </div>
                          <div>
                            {appointment.status === 'Pending' ? (
                              <div className={Styles.button_container}>
                                <button
                                  className={Styles.button_cancel}
                                  onClick={() => handleEdit(appointment)}
                                >
                                  Cancel site survey
                                </button>
                                <button
                                  className={Styles.button_edit}
                                  onClick={() => handleCancel(appointment)}
                                >
                                  Edit
                                </button>
                              </div>
                            ) : (
                              <div className={Styles.approved}>
                                <span>Approved</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* ////////////////////////////////Phone Layout//////////////////////////// */}

                        <div className={isMobile ? Styles.mobile_view : Styles.hide} >
                            <div className={Styles.scheduled_date}>
                            Scheduled Date & Time{' '}
                          </div>
                          <div className={Styles.viewMobile}>
                          <div
                            className={`${Styles.dateAndTime}`}
                            
                          >
                            {' '}
                            <div className={Styles.time}> {appointment.scheduled_time}</div>
                            <div className={Styles.date}>{data.date}</div>
                          </div>
                          <div>
                            {appointment.status === 'Pending' ? (
                              <div className={Styles.button_container}>
                                <button
                                  className={Styles.button_cancel}
                                  onClick={() => handleEdit(appointment)}
                                >
                                  Cancel site survey
                                </button>
                                <button
                                  className={Styles.button_edit}
                                  onClick={() => handleCancel(appointment)}
                                >
                                  Edit
                                </button>
                              </div>
                            ) : (
                              <div className={Styles.approved}>
                                <span>Approved</span>
                              </div>
                            )}
                          </div>


                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={Styles.appointment_item}>
                      <div className={Styles.no_appointment}>
                        No Appointments
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ScheduledActivity;
