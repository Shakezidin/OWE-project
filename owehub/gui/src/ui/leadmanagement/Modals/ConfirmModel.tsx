import React, { useEffect, useState } from 'react';
import classes from '../styles/confirmmodal.module.css';
import ConfirmationICON from './Modalimages/ConfirmationICON.svg';
import ThumbsSucess from './Modalimages//Thumbs.svg';
import SignatureICON from './Modalimages/CorrectSign.png';
import QuestionMarks from './Modalimages/SignOfIntrogation.png';
import failledLogo from './Modalimages/FAILLED.png';
import DoneLogo from './Modalimages/DoneLogo.png';
import FileAttach from './Modalimages/FileAttach.png';
import EditModal from './EditModal';
import AppointmentScheduler from './AppointmentScheduler';
import CrossIcon from '../Modals/Modalimages/crossIcon.png';
import Pen from '../Modals/Modalimages/Vector.png';
import { toast } from 'react-toastify';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { format } from 'date-fns';
import CreateProposal from './CreateProposal'; // Import the new component
import axios from 'axios';
import {
  getLeadById,
  getLeads,
} from '../../../redux/apiActions/leadManagement/LeadManagementAction';
import { useDispatch } from 'react-redux';
import useAuth from '../../../hooks/useAuth';
import MicroLoader from '../../components/loader/MicroLoader';
import DataNotFound from '../../components/loader/DataNotFound';
interface EditModalProps {
  isOpen1: boolean;
  onClose1: () => void;
  leadId?: number;
  refresh?: number;
  setRefresh?: (value: number) => void;
  reschedule?: boolean
  action?:boolean
}
interface LeadData {
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
  street_address: string;
  status_id: number;
  created_at: string;
  appointment_date: string;
  appointment_scheduled_date: string;
  appointment_accepted_date: string;
}
const ConfirmaModel: React.FC<EditModalProps> = ({
  isOpen1,
  onClose1,
  leadId,
  reschedule,
  action
}) => {
  const [visibleDiv, setVisibleDiv] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOpen, setModalClose] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [load, setLoad] = useState(false);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [loadingProposal, setLoadingProposal] = useState(false);
  const [error, setError] = useState('');
  const [proposalLink, setProposalLink] = useState<string | null>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null); // State for iframe source

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };
  const HandleModal = () => {
    setModalClose(false);
    onClose1();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const dispatch = useDispatch();

  const handleSendAppointment = async () => {
    setLoad(true);
    try {
      const response = await postCaller(
        'update_lead_status',
        {
          leads_id: leadId,
          status_id: 1,
          appointment_date: selectedDate
            ? format(selectedDate, 'dd-MM-yyyy')
            : '',
          appointment_time: selectedTime ? selectedTime : '',
        },
        true
      );

      if (response.status === 200) {
        toast.success('Appointment Sent Successfully');
        setVisibleDiv(1);
      } else if (response.status >= 201) {
        toast.warn(response.message);
      }
      setLoad(false);
    } catch (error) {
      setLoad(false);
      console.error('Error submitting form:', error);
    }
  };

  const [isAuthenticated, setAuthenticated] = useState(false);
  const { authData, saveAuthData } = useAuth();
  const [loading, setIsLoading] = useState(false);
  useEffect(() => {
    const isPasswordChangeRequired =
      authData?.isPasswordChangeRequired?.toString();
    setAuthenticated(isPasswordChangeRequired === 'false');
  }, [authData]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await postCaller(
            'get_lead_info',
            {
              leads_id: leadId,
            },
            true
          );

          if (response.status === 200) {
            setLeadData(response.data);
            if (reschedule === true) {
              setVisibleDiv(0);
            }else if(action == true){
               setVisibleDiv(67);
            } else {
              setVisibleDiv(response.data?.status_id);
            }
          } else if (response.status >= 201) {
            toast.warn(response.data.message);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated, leadId, isModalOpen]);

  console.log(reschedule, "asgdhgfsdghf")

  useEffect(() => {
    const handleEscapeKey = (event: any) => {
      if (event.key === 'Escape') {
        onClose1();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

    // Function to create project, design, and proposal in sequence

  const handleCreateProposal = async () => {
    if (!leadData) {
      toast.error('Lead data not available. Please try again.');
      return;
    }

    setLoadingProposal(true);
    setError('');

    try {
      // Generate a timestamp
      const timestamp = new Date().getTime();
    
      // Create Project
      const projectResponse = await axios.post('http://localhost:5000/api/create-project', {
        project: {
          location: {
            property_address: leadData.street_address,
          },
          external_provider_id: leadId?.toString() || 'YourId123',
          name: `Project for ${leadData.first_name} ${leadData.last_name} - ${timestamp}`,
          customer_salutation: 'Mr./Mrs.',
          customer_first_name: leadData.first_name,
          customer_last_name: leadData.last_name,
          mailing_address: leadData.street_address,
          customer_email: leadData.email_id,
          customer_phone: leadData.phone_number,
          status: 'Remote Assessment Completed',
          preferred_solar_modules: ['5b8c975b-b114-4d31-9d40-c44a6cfbe383'],
          tags: ['third_party_1'],
        },
      });
      console.log('Project created:', projectResponse.data);
      const projectId = projectResponse.data.project.id;
    
      // Create Design
      const designResponse = await axios.post('http://localhost:5000/api/create-design', {
        design: {
          external_provider_id: leadId?.toString() || 'YourId123',
          project_id: projectId,
          name: `Design for ${leadData.first_name} ${leadData.last_name} - ${timestamp}`,
        },
      });
      console.log('Design created:', designResponse.data);
      const designId = designResponse.data.design.id;
    
      // Create Proposal
      const proposalResponse = await axios.post('http://localhost:5000/api/create-proposal', { designId });
      console.log('Proposal created:', proposalResponse.data);
      setProposalLink(proposalResponse.data.proposal.proposal_link);
      toast.success('Proposal created successfully');
    
      // Open the proposal in a new tab
      window.open(proposalResponse.data.proposal.proposal_link, '_blank');
    
    } catch (error) {
      const err = error as any;
      console.error('Error during proposal creation:', err.response?.data || err.message);
      setError(`Error during proposal creation: ${err.response?.data?.message || err.message}`);
      toast.error('Failed to create proposal. Please try again.');
    } finally {
      setLoadingProposal(false);
      HandleModal();
    }
  };

    // const handleCreateProposal = async () => {
    //   setLoadingProposal(true);
    //   setError('');
  
    //   try {
    //     // Create Project
    //     const projectResponse = await axios.post('http://localhost:5000/api/create-project', {
    //       project: {
    //         location: {
    //           latitude: 37.77960043,
    //           longitude: -122.39530086,
    //         },
    //         external_provider_id: 'YourId123',
    //         name: 'My first test project',
    //         customer_salutation: 'Mrs.',
    //         customer_first_name: 'Jane',
    //         customer_last_name: 'Doe',
    //         mailing_address: '434 Brannan St, San Francisco, CA, USA',
    //         customer_email: 'jane@example.com',
    //         customer_phone: '(555) 111-5151',
    //         status: 'Remote Assessment Completed',
    //         preferred_solar_modules: ['5b8c975b-b114-4d31-9d40-c44a6cfbe383'],
    //         tags: ['third_party_1'],
    //       },
    //     });
    //     console.log('Project created:', projectResponse.data);
    //     const projectId = projectResponse.data.project.id;
  
    //     // Create Design
    //     const designResponse = await axios.post('http://localhost:5000/api/create-design', {
    //       design: {
    //         external_provider_id: 'YourId123',
    //         project_id: projectId,
    //         name: `Mydesign${projectId}`,
    //       },
    //     });
    //     console.log('Design created:', designResponse.data);
    //     const designId = designResponse.data.design.id;
  
    //     // Create Proposal
    //     const proposalResponse = await axios.post('http://localhost:5000/api/create-proposal', { designId });
    //     console.log('Proposal created:', proposalResponse.data);
    //     setProposalLink(proposalResponse.data.proposal.proposal_link);
    //     // setIframeSrc(proposalResponse.data.proposal.proposal_link); // Set the iframe source here
    //     toast.success('Proposal created successfully'); // Notify success
  
    //     // Optionally, you can redirect to the proposal URL in an iframe or a new tab
    //     window.open(proposalResponse.data.proposal.proposal_link, '_blank');
        
    //     // Close the component/modal after success
    //     // setShowCreateProposal(false);
  
    //   } catch (error) {
    //     const err = error as any; // Type assertion to 'any'
    //     console.error('Error during proposal creation:', err.response?.data || err.message);
    //     setError(`Error during proposal creation: ${err.response?.data?.message || err.message}`);
    //   } finally {
    //     setLoadingProposal(false);
    //   }
    // };

  return (
    <div>
      {isOpen1 && (
        <div className="transparent-model">
          <div className={classes.customer_wrapper_list}>
            <div className={classes.DetailsMcontainer}>
              <div className={classes.parentSpanBtn} onClick={HandleModal}>
                <img
                  className={classes.crossBtn}
                  src={CrossIcon}
                  onClick={HandleModal}
                />
              </div>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <MicroLoader />
                </div>
              ) : leadData ? (
                <div className={classes.pers_det_top}>
                  <div className={classes.Column1Details}>
                    <div className={classes.main_name}>
                      {leadData?.first_name} {leadData?.last_name}{' '}
                      <img
                        onClick={HandleModal}
                        className={classes.crossIconImg}
                        src={CrossIcon}
                      />
                    </div>
                    <span className={classes.mobileNumber}>
                      {leadData?.phone_number}
                    </span>
                  </div>
                  <div className={classes.Column2Details}>
                    <span className={classes.addresshead}>
                      {leadData?.street_address
                      ? leadData.street_address.length > 20
                          ? `${leadData.street_address.slice(0, 30)}...`
                        : leadData.street_address
                        : 'N/A'}
                    </span>
                    <span className={classes.emailStyle}>
                      {leadData?.email_id}{' '}
                      {/* <span className={classes.verified}> */}
                        {/* <svg
                          className={classes.verifiedMarked}
                          width="13"
                          height="13"
                          viewBox="0 0 13 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_6615_16896)">
                            <path
                              d="M6.08 0.425781C2.71702 0.425781 0 3.13967 0 6.50578C0 9.87189 2.71389 12.5858 6.08 12.5858C9.44611 12.5858 12.16 9.87189 12.16 6.50578C12.16 3.13967 9.44302 0.425781 6.08 0.425781Z"
                              fill="#20963A"
                            />
                            <path
                              d="M8.99542 4.72214C8.8347 4.56137 8.59049 4.56137 8.42668 4.72212L5.30786 7.84096L3.72834 6.26146C3.56762 6.10074 3.32341 6.10074 3.1596 6.26146C2.99888 6.42219 2.99888 6.66637 3.1596 6.8302L5.02346 8.69406C5.10383 8.77443 5.18418 8.81461 5.30784 8.81461C5.42839 8.81461 5.51185 8.77443 5.59222 8.69406L8.99542 5.29088C9.15614 5.13016 9.15614 4.886 8.99542 4.72214Z"
                              fill="white"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_6615_16896">
                              <rect
                                width="12.16"
                                height="12.16"
                                fill="white"
                                transform="translate(0 0.421875)"
                              />
                            </clipPath>
                          </defs>
                        </svg>{' '} */}
                        {/* <span className={classes.verifyLetter}> Verified</span>
                      </span> */}
                    </span>
                    <div>
                      {visibleDiv === 0 ||
                        (visibleDiv === 11 && (
                          <div
                            className={classes.edit_modal_openMediaScreen}
                            onClick={handleOpenModal}
                          >
                            <span className={classes.edit_modal_button2}>
                              <img
                                className={classes.editPenStyle}
                                src={Pen}
                              ></img>{' '}
                              Edit
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  "No Data Found"
                </div>
              )}
              <div>
                {(visibleDiv === 0 || visibleDiv === 11) && (
                  <div
                    className={classes.edit_modal_open}
                    onClick={handleOpenModal}
                  >
                    <span className={classes.edit_modal_button}>
                      <img
                        className={classes.editPenStyle}
                        src={Pen}
                        alt="Edit Pen"
                      />{' '}
                      Edit
                    </span>
                  </div>
                )}
              </div>
            </div>
            <EditModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              leadData={leadData}
            />
            {visibleDiv === 0 && (
              <AppointmentScheduler
                setVisibleDiv={setVisibleDiv}
                onDateChange={handleDateChange}
                onTimeChange={handleTimeChange}
              />
            )}
            {visibleDiv === 11 && (
              <>
                {' '}
                <div>
                  {/* className={classes.customer_wrapper_list} class of above div */}
                  <div className={classes.success_not}>
                    <div>
                      <img
                        height="111px"
                        width="111px"
                        src={ConfirmationICON}
                      />{' '}
                    </div>
                    <h2>Please confirm customer details </h2>
                    <p>
                      Ensure the email address and phone number are correct
                      before sending the appointment
                    </p>
                  </div>
                  <div className={classes.survey_button}>
                    <button
                      className={classes.self}
                      style={{
                        color: '#fff',
                        border: 'none',
                        cursor: load ? 'not-allowed' : 'pointer',
                      }}
                      onClick={handleSendAppointment}
                      disabled={load}
                    >
                      {load ? 'Sending...' : 'CONFIRM, SENT APPOINTMENT'}
                    </button>
                    <button
                      id="otherButtonId"
                      className={classes.other}
                      onClick={handleOpenModal}
                    >
                      Edit customer details
                    </button>
                  </div>
                </div>
              </>
            )}
            {/* FROM HERE  WE DO NOT NEED EDIT BUTTON */}
            {visibleDiv === 1 && (
              <>
                <div className={classes.success_not}>
                  <div>
                    <img
                      className={classes.thumbsImg}
                      // onClick={() => setVisibleDiv(3)}
                      height="111px"
                      width="111px"
                      src={ThumbsSucess}
                    />{' '}
                  </div>
                  <span className={classes.ApptSentConfirm}>
                    Appointment sent successfully{' '}
                  </span>
                  <span className={classes.ApptSentDate}>
                    {selectedDate ? format(selectedDate, 'dd MMM, yyyy') : ''}{' '}
                    {selectedTime}
                  </span>
                </div>
                <div className={classes.survey_button}>
                  <span className={classes.AppSentDate2}>
                    Appointment sent on {format(new Date(), 'dd MMM, yyyy')}
                  </span>
                  <span className={classes.AppSentDate2}>
                    Waiting for confirmation
                  </span>
                </div>
              </>
            )}
            {visibleDiv === 2 && (
              <>
                <div className={classes.success_not}>
                  <div>
                    <img
                      className={classes.thumbsImg}
                      // onClick={() => setVisibleDiv(4)}
                      height="140px"
                      width="140px"
                      src={SignatureICON}
                    />{' '}
                  </div>
                  <span className={classes.ApptSentSuccess}>
                    Appointment Accepted{' '}
                  </span>
                  <span className={classes.ApptSentDate}>
                    27 Aug ,2024. 12:00 PM
                  </span>
                  <span className={classes.remaningDate}>6 Days Left</span>
                </div>

                <div className={classes.AfterAppointment}>
                  <span className={classes.getConfirmation}>
                    You will receive a reminder{' '}
                    <span className={classes.hoursBefore}>24 hrs</span> before
                  </span>
                  <span className={classes.getDate}>
                    scheduled appointment date.
                  </span>
                </div>
              </>
            )}
            {visibleDiv === 67 && (
              <>
                <div className={classes.success_not}>
                  <div>
                    <img height="110.23px" width="156px" src={QuestionMarks} />{' '}
                  </div>
                </div>

                <div className={classes.closedButtonQuestionmark}>
                  <button
                    className={classes.self}
                    onClick={() => setVisibleDiv(4)}
                    style={{
                      backgroundColor: '#3AC759',
                      color: '#FFFFFF',
                      border: 'none',
                    }}
                  >
                    CLOSED WON
                  </button>
                  <button
                    onClick={() => setVisibleDiv(5)}
                    id="otherButtonId"
                    style={{
                      backgroundColor: '#CD4040',
                      color: '#FFFFFF',
                      border: 'none',
                    }}
                    className={classes.other}
                  >
                    CLOSED LOST
                  </button>
                  <button
                    id="otherButtonId"
                    style={{
                      backgroundColor: '#D3D3D3',
                      color: '#888888',
                      border: 'none',
                    }}
                    className={classes.other}
                  >
                    Reschedule Appointment
                  </button>
                  <span className={classes.getAppointment}>
                    
                  </span>
                  <span className={classes.notAvailableCtmr}>
                    
                  </span>
                </div>
              </>
            )}
            {visibleDiv === 3 && (
              <>
                <div className={classes.customer_wrapper_list_Edited2}>
                  <div className={classes.success_not_Edited4Model}>
                    <div>
                      <img
                        className={classes.Questmarks}
                        height="160px"
                        width="160px"
                        src={failledLogo}
                      />{' '}
                    </div>
                    <span className={classes.ohNo}>Oh No!</span>
                    <span className={classes.deniedCust}>Customer denied</span>
                  </div>
                  <div className={classes.whydeniedDiv}>
                    <span className={classes.whydenied}>
                      Why did customer denied?
                    </span>
                  </div>
                  <div className={classes.dropdownContainerModal}>
                    <select className={classes.dropdownModal}>
                      <option value="option1">
                        Moving to different city in few months
                      </option>
                      <option value="option2">Rabindra Kumar </option>
                      <option value="option3">Sharma</option>
                    </select>
                  </div>

                  <div className={classes.survey_button}>
                    <button
                      className={classes.self}
                      style={{
                        backgroundColor: '#377CF6',
                        color: '#FFFFFF',
                        border: 'none',
                      }}
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
              </>
            )}
            {visibleDiv === 5 && (
              <>
                <div className={classes.customer_wrapper_list_Edited}>
                  <div className={classes.success_not_Edited4Model}>
                    <div>
                      <img
                        className={classes.HandShakeLogo}
                        height="154px"
                        width="154px"
                        src={DoneLogo}
                      />{' '}
                    </div>
                  </div>
                  <div className={classes.congratulationLetter}>
                    <span className={classes.congratulations}>
                      Congratulations!
                    </span>
                  </div>
                  <br />
                  <div className={classes.ctmracquiredDiv}>
                    <span className={classes.ctmracquired}>
                      Customer acquired
                    </span>
                  </div>
                  <div className={classes.suceesButtonAfterProposal}>
                    <button
                      className={classes.self}
                      style={{
                        backgroundColor: `${loadingProposal ? '#FFFFFF' :'#3AC759'}`,
                        color: '#FFFFFF',
                        border:'none'
                      }}
                      onClick={handleCreateProposal} 
                      disabled={loadingProposal}
                    >
                      {loadingProposal ? (
                        <div style={{display:'flex',justifyContent: 'center', alignItems:'center', color:'#3AC759',
                          border:'1px solid #3AC759', borderRadius:10
                        }}>
                          Creating Proposal...
                          <div style={{ display: 'flex', justifyContent: 'center',transform:'scale(0.5)' }}>
                            <MicroLoader />
                          </div>
                        </div>
                      ) : 'Create Proposal'}
                    </button>
                      {/* <button
                        className={classes.self}
                        style={{
                          backgroundColor: '#3AC759',
                          color: '#FFFFFF',
                          border: 'none',
                        }}
                        onClick={() => setShowCreateProposal(true)} // Show the create proposal component
                      >
                        CREATE PROPOSAL
                      </button> */}
                    <span className={classes.n}>
                      {' '}
                      <img src={FileAttach} /> Attach proposal
                    </span>
                  </div>
                </div>
              </>
            )}{' '}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display iframe if proposal link exists */}
            {iframeSrc && (
              <iframe
                src={iframeSrc}
                style={{ width: '100%', height: '600px', border: 'none' }}
                title="Proposal"
              ></iframe>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmaModel;
