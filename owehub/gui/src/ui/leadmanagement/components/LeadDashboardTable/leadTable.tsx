import React, { useEffect, useRef, useState } from 'react'
import styles from './leadTable.module.css';
import { LeadColumn } from '../../../../resources/static_data/leadData/leadTable';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import ChangeStatus from './Dropdowns/ChangeStatus';
import { IoChevronForward, IoInformationOutline } from 'react-icons/io5';
import { useAppSelector } from '../../../../redux/hooks';
import MicroLoader from '../../../components/loader/MicroLoader';
import DataNotFound from '../../../components/loader/DataNotFound';
import DropDownLeadTable from './Dropdowns/CustomDrop';
import ConfirmaModel from '../../Modals/ConfirmModel';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import Profile from '../../Modals/ProfileInfo';
import { format, parseISO } from 'date-fns';
import { Tooltip } from 'react-tooltip';
import useMatchMedia from '../../../../hooks/useMatchMedia';
import Pagination from '../../../components/pagination/Pagination';
import { createDocuSignRecipientView, createEnvelope, getDocument, getDocuSignUrl } from '../../../../redux/apiActions/leadManagement/LeadManagementAction';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

type ProposalStatus = "In Progress" | "Send Docs" | "CREATED" | "Clear selection";
type DocuStatus = "Complete" | "Sent" | "Viewed" | "Declined";

interface LeadSelectionProps {
  selectedLeads: number[];
  setSelectedLeads: React.Dispatch<React.SetStateAction<number[]>>;
  refresh: number;
  setRefresh: (value: number | ((prevValue: number) => number)) => void;
  onCreateProposal: (leadId: number) => void;
  retrieveWebProposal: (leadId: number) => void;
  generateWebProposal: (leadId: number) => void;
  side: "left" | "right";
  setSide: React.Dispatch<React.SetStateAction<"left" | "right">>;
  currentFilter: string;
  setCurrentFilter: React.Dispatch<React.SetStateAction<string>>;
}

type SSEPayload =
  | {
    is_done: false;
    data: {
      current_step: number;
      total_steps: number;
    };
  }
  | {
    is_done: true;
    data: {
      current_step: number;
      total_steps: number;
      url: string;
    };
    error: null;
  }
  | {
    is_done: true;
    error: string;
    data: null;
  };

const LeadTable = ({ selectedLeads, currentFilter, setCurrentFilter, setSelectedLeads, refresh, setRefresh, onCreateProposal, retrieveWebProposal, generateWebProposal, side, setSide }: LeadSelectionProps) => {

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    console.log("Component mounted, checking for query params...");
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const state = queryParams.get('state');

    if (code) {
      console.log("Authorization code found:", code);
      handleCodeExchange(code); // Call the function to exchange the code for a token
    }
  }, [location]);

  const handleCodeExchange = async (code: string) => {
    console.log("Signing Document...handleCodeExchange");
  
    const params = {
      action: "gettoken" as const,
      authorization_code: code,
      redirect_uri: "http://localhost:3000/leadmng-dashboard",
    };
  
    try {
      const response = await dispatch(getDocuSignUrl(params) as any);
      console.log('Full response from getDocuSignUrl:', response); // Log entire response structure
      
      // Check if payload is defined in the response
      const payload = response.payload;
      if (!payload) {
        console.error('No payload found in response.');
        return;
      }
  
      // Check if the access token is present in payload
      const accessToken = payload.access_token; // Access token inside response.payload
      if (accessToken) {
        console.log('Access Token:', accessToken);
        await fetchUserInfo(accessToken); // Call the fetchUserInfo function with the token
      } else {
        console.error('Access token not found in payload.');
      }
  
    } catch (error) {
      console.error("Error exchanging authorization code:", error);
    }
  };
  

  const fetchUserInfo = async (accessToken: string) => {
    console.log("Signing Document...fetchUserInfo");

    const params = {
      action: "getuserinfo" as const,
      authorization_code: accessToken, // Include the access token in the params if required by your backend
    };
  
    try {
      const response = await dispatch(getDocuSignUrl(params) as any);
      
      // Check if the response is successful
      if (response.error) {
        console.error('Failed to retrieve user info:', response.error);
        return;
      }
  
      // Process the user info data
      const userInfo = response.data; // Adjust based on your response structure
      console.log('User Info:', userInfo);
      
      // Store user info in your state or context as needed
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  
  

  const [selectedType, setSelectedType] = useState('');
  const [selected, setSelected] = useState(-1)
  const isMobile = useMatchMedia('(max-width: 767px)');
  const [activeSection, setActiveSection] = useState<
    'Deal Won' | 'Deal Loss' | 'Appointment Not Required' | null
  >('Deal Won');

  const [leadId, setLeadId] = useState(0);
  const [leadProposalLink, setLeadPropsalLink] = useState('');
  const [proposalPdfLink, setProposalPdfLink] = useState('');
  const [downloadingLeadId, setDownloadingLeadId] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0); // Track download percentage
  const scrollWrapper = useRef<HTMLDivElement>(null);

  const { isLoading, leadsData, totalcount } = useAppSelector(
    (state) => state.leadManagmentSlice
  );

  const handleLeadSelection = (leadId: number) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };
  const navigate=useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reschedule, setReschedule] = useState(false);
  const [action, setAction] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const downloadProposalWithSSE = (leadId: number) => {
    setDownloadingLeadId(leadId); // Set downloading state for this row
    setDownloadProgress(0); // Reset the progress initially

    const eventSource = new EventSource(
      `https://staging.owe-hub.com/api/owe-leads-service/v1/aurora_generate_pdf?leads_id=${leadId}`
    );

    eventSource.onmessage = (event) => {
      const payload: SSEPayload = JSON.parse(event.data);

      if (!payload.is_done) {
        const progressPercentage = (payload.data.current_step / payload.data.total_steps) * 100;
        setDownloadProgress(progressPercentage); // Update the progress state
        console.log(`PDF generation in progress: Step ${payload.data.current_step} of ${payload.data.total_steps}`);
      } else if (payload.is_done) {
        setDownloadingLeadId(null); // Reset downloading state once done
        setDownloadProgress(0); // Reset progress

        if (payload.error === null) {
          // PDF generation successful, trigger download
          const pdfUrl = payload.data.url;
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = 'Proposal.pdf';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Handle generation error
          console.error(`Error during PDF generation: ${payload.error}`);
        }

        eventSource.close(); // Close the connection once the PDF is ready or an error occurs
      }
    };

    eventSource.onerror = (error) => {
      console.error('Error with SSE connection', error);
      setDownloadingLeadId(null); // Reset downloading state on error
      setDownloadProgress(0); // Reset progress on error
      eventSource.close();
    };
  };
  const [won, setWon] = useState(false);

  interface DocuSignResponse {
    url?: string; // Make it optional if it might not be present
    // Add other properties if needed
  }

  useEffect(() => {
    if (selectedType === 'app_sched') {
      handleOpenModal();
      setAction(false);
      setWon(false);
      setReschedule(true);
      setSelectedType('');
    } else if (selectedType === 'Deal Loss') {
      handleOpenModal();
      setReschedule(false);
      setWon(false);
      setAction(true);
      setSelectedType('');
    } else if (selectedType === 'Deal Won') {
      // handleCloseWon();
      handleOpenModal();
      setAction(false);
      setReschedule(false);
      setWon(true);
      setSelectedType('');
    } else if (selectedType === 'new_proposal') {
      onCreateProposal(leadId)
      setSelectedType('');
    } else if (selectedType === 'viewProposal') {
      retrieveWebProposal(leadId)
      setSelectedType('');
      // if (proposalPdfLink) {
      //   window.open(proposalPdfLink, '_blank'); 
      // }
    } else if (selectedType === 'editProposal') {
      if (leadProposalLink) {
        window.open(leadProposalLink, '_blank');
      }
      setSelectedType('');
    } else if (selectedType === 'renew_proposal') {
      generateWebProposal(leadId)
      setSelectedType('');
    } else if (selectedType === 'download') {
      downloadProposalWithSSE(leadId);
      setSelectedType('');
    } else if (selectedType === 'signature') {
      OpenSignDocument();
      // handleSignAndCreateRecipientView(); 
      //RABINDRA KUMAR SHARMA
      setSelectedType('');
    }
    else if (selectedType === 'Appointment Not Required') {
      handleAppNotReq();
      setSelectedType('');
    }
  }, [selectedType])

  const handleSignAndCreateRecipientView = async () => {
    try {
      await handleSignDocument(); 
      await handleCreateRecipientView(); 
      await handleGetDocument();
    } catch (error) {
      console.error("Error in signing and creating recipient view:", error);
    }
  };

const SignDocument=async () =>{
  navigate('/drop-sign-document')
}

const OpenSignDocument = async () => {
  try {
    await SignDocument();
  }
  catch (error) {
    console.error("Error in Data Incoming", error);
  }
}


const handleSignDocument = async () => {
  console.log("Creating DocuSign Envelope...");

  const params = {
    document_base64: "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",
    leads_id: leadId,
    email_subject: "Please sign this document",
    document_name: "DocumentName.pdf",
    access_token: "your_access_token",
    base_uri: "https://demo.docusign.net"
  };

  try {
    const response = await dispatch(createEnvelope(params) as any);
    const result = response.payload;

    if (result && result.data && result.data.envelopeId) {
      console.log("Envelope created successfully:", result.data.envelopeId);
      // If needed, redirect or perform another action based on the envelope data
    } else {
      console.log("Envelope creation failed or no envelope ID returned.");
    }
  } catch (error) {
    console.error("Error creating DocuSign envelope:", error);
  }
};

const handleCreateRecipientView = async () => {
  console.log("Creating DocuSign Recipient View...");

  const params = {
    leads_id: leadId, // Replace with the actual lead ID
    return_url: "http://localhost:3000/leadmng-dashboard",
  };

  try {
    const response = await dispatch(createDocuSignRecipientView(params) as any);
    const result = response.payload;

    if (result && result.data && result.data.url) {
      console.log("Recipient view created successfully:", result.data.url);
      window.open(result.data.url, '_blank'); // Open the recipient view in a new tab
    } else {
      console.log("Recipient view creation failed or no URL returned.");
    }
  } catch (error) {
    console.error("Error creating DocuSign recipient view:", error);
    throw error; // Rethrow the error to be caught by the parent function
  }
};

const handleGetDocument = async () => {
  const params = {
    leads_id: leadId,
    base_url: 'https://demo.docusign.net',
  };

  try {
    const response = await dispatch(getDocument(params) as any);
    const result = response.payload;

    if (result && result.data) {
      console.log('Document retrieved successfully:', result.data);
      // Perform any additional actions needed with the document data
    } else {
      console.log('Document retrieval failed or no data returned.');
    }
  } catch (error) {
    console.error('Error retrieving document:', error);
  }
};

  const [load, setLoad] = useState(false);
  const handleCloseWon = async () => {
    setLoad(true);
    try {
      const response = await postCaller(
        'update_lead_status',
        {
          leads_id: leadId,
          status_id: 5,
        },
        true
      );
      if (response.status === 200) {
        toast.success('Status Updated Successfully');
        setRefresh((prev) => prev + 1);
      } else if (response.status >= 201) {
        toast.warn(response.message);
      }
      setLoad(false);
    } catch (error) {
      setLoad(false);
      console.error('Error submitting form:', error);
    }
  };

  const handleAppNotReq = async () => {
    setLoad(true);
    try {
      const response = await postCaller(
        'update_lead_status',
        {
          leads_id: leadId,
          is_appointment_required: false
        },
        true
      );
      if (response.status === 200) {
        toast.success('Status Updated Successfully');
        setRefresh((prev) => prev + 1);
      } else if (response.status >= 201) {
        toast.warn(response.message);
      }
      setLoad(false);
    } catch (error) {
      setLoad(false);
      console.error('Error submitting form:', error);
    }
  };

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleOpenProfileModal = (leadsId: number) => {
    setIsProfileOpen(true);
    setLeadId(leadsId);
  };

  const handleCloseProfileModal = () => {
    setIsProfileOpen(false);
  };




  const handleReschedule = () => {
    setSelectedType("app_sched");
  }



  const handleMoreClick = () => {
    const elm = scrollWrapper.current
    if (!elm) return;
    if (side == 'left') {
      elm.scroll({ left: elm.scrollWidth, behavior: "smooth" })
      setSide('right');
    } else if (side == 'right') {
      elm.scroll({ left: 0, behavior: "smooth" })
      setSide('left');
    }
  };

  const statusStyles = {
    "In Progress": {
      backgroundColor: "#B459FC",
      color: "#fff"
    },
    "Send Docs": {
      backgroundColor: "#EC9311",
      color: "#fff"
    },
    "CREATED": {
      backgroundColor: "#21BC27",
      color: "#fff"
    },
    "Clear selection": {
      backgroundColor: "#808080",
      color: "#fff"
    }
  };


  const docusignStyles = {
    "Complete": {
      backgroundColor: "#21BC27",
      color: "#fff"
    },
    "Sent": {
      backgroundColor: "#EC9311",
      color: "#fff"
    },
    "Viewed": {
      backgroundColor: "#4999E3",
      color: "#fff"
    },
    "Declined": {
      backgroundColor: "#D91515",
      color: "#fff"
    }
  };


  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = page * itemsPerPage;
  const totalPage = Math.ceil(totalcount / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setPage(pageNumber);
  };


  const goToNextPage = () => {
    setPage(page + 1);
  };

  const goToPrevPage = () => {
    setPage(page - 1);
  };
  const handlePerPageChange = (selectedPerPage: number) => {
    setItemPerPage(selectedPerPage);
    setPage(1);
  };


  return (
    <>
      <ConfirmaModel
        isOpen1={isModalOpen}
        onClose1={handleCloseModal}
        leadId={leadId}
        refresh={refresh}
        setRefresh={setRefresh}
        reschedule={reschedule}
        action={action}
        setReschedule={setReschedule}
        won={won}
        setWon={setWon}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />

      <Profile
        isOpen1={isProfileOpen}
        onClose1={handleCloseProfileModal}
        leadId={leadId}
      />

      <div className={styles.dashTabTop}>

        <div className={styles.TableContainer1} ref={scrollWrapper} >
          <div
            // style={{ overflowX: 'auto', whiteSpace: 'nowrap', minHeight: "400px" }}
            // ref={tableContainerRef}
            style={{ width: '100%', whiteSpace: 'nowrap', minHeight: "400px", scrollBehavior: 'smooth' }}
            className={styles.scrolly}
          >
            <table>
              <thead
              >
                <tr>
                  {LeadColumn.map((item, key) => (
                    <th key={key}>
                      <div className="flex-check">
                        <div className="table-header">
                          <p>{item.displayName}</p>
                        </div>
                      </div>
                    </th>
                  ))}
                  {selectedLeads.length === 0 &&
                    <th
                      onClick={handleMoreClick}
                      style={{
                        fontWeight: '500',
                        color: 'black',
                        background: isMobile ? 'linear-gradient(to right, #CADCFA 40%, #d5e4ff 100%)' : 'linear-gradient(to right, #CADCFA 40%, #d5e4ff 40%)',

                        cursor: 'pointer',
                        minWidth: isMobile ? '65px' : "200px",
                        zIndex: "102",

                      }}
                      className={styles.FixedColumn}

                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: "100%"
                      }}>
                        <div className={styles.slidebutton}>
                          {side === 'left' ? (
                            <>
                              More
                              <FaAngleRight />
                            </>
                          ) : side === 'right' ? (
                            <>
                              <FaAngleLeft />
                              More
                            </>
                          ) : null}
                        </div>
                      </div>
                    </th>
                  }
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={30}>
                      <div
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <MicroLoader />
                      </div>
                    </td>
                  </tr>
                ) : leadsData.length > 0 ? (
                  leadsData.map((lead: any, index: number) => (
                    <tr>

                      <td style={{ fontWeight: '500', color: 'black', display: 'flex', flexDirection: 'row', gap: '10px', alignItems: "center" }}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead['leads_id'])}
                            onChange={() =>
                              handleLeadSelection(lead['leads_id'])
                            }
                          />
                        </label>
                        <div style={{}}>
                          <div
                            style={{
                              whiteSpace: 'pre-wrap',
                              overflowWrap: 'break-word',
                              width: '155px',
                              lineHeight: "16px"
                            }}
                            className={styles.name}>{lead.first_name} {lead.last_name}</div>

                          <div className={styles.ids}>OWE{lead.leads_id}</div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.info}>{lead.email_id}</div>
                        <div className={styles.info}>{lead.phone_number}</div>
                      </td>
                      <td>
                        <div className={styles.info}>{lead?.street_address
                          ? lead.street_address.length >= 100
                            ? `${lead.street_address.slice(0, 100)}...`
                            : lead.street_address
                          : 'N/A'}</div>
                      </td>
                      <td>
                        {lead.appointment_status_label ? (
                          <>
                            <div
                              style={{
                                backgroundColor: lead.appointment_status_label === 'Not Required'
                                  ? '#B459FC'
                                  : lead.appointment_status_label === 'Appointment Accepted'
                                    ? '#21BC27'
                                    : lead.appointment_status_label === 'No Response'
                                      ? '#777777'
                                      : lead.appointment_status_label === 'Appointment Sent'
                                        ? '#EC9311'
                                        : lead.appointment_status_label === 'Appointment Declined'
                                          ? '#D91515'
                                          : lead.appointment_status_label === 'Appointment Date Passed'
                                            ? '#3B70A1'
                                            : 'inherit',
                              }}
                              className={styles.appointment_status}
                            >
                              {lead.appointment_status_label}
                            </div>
                            <div style={{ marginLeft: '29px', marginTop: "4px" }} className={styles.info}>
                              {lead.appointment_status_date ? format((parseISO(lead.appointment_status_date)), 'dd-MM-yyyy') : ""}
                            </div>
                            {((lead.appointment_status_label === 'No Response' && lead.proposal_status !== '') || (lead.appointment_status_label === 'No Response' && lead.won_lost_label !== '')) &&
                              <div style={{ marginLeft: '20px', color: "#D91515" }} className={styles.info}>
                                Update Status!
                              </div>}
                          </>
                        ) : (
                          <div>____</div>
                        )}
                      </td>
                      <td>
                        {lead.won_lost_label ? (
                          <>
                            <div
                              style={{ backgroundColor: '#21BC27' }}
                              className={styles.appointment_status}
                            >
                              {lead.won_lost_label}
                            </div>
                            {lead.won_lost_date && (
                              <div style={{ marginLeft: '29px' }} className={styles.info}>
                                {lead.won_lost_date ? format((parseISO(lead.won_lost_date)), 'dd-MM-yyyy') : ""}

                              </div>
                            )}
                            {(false) &&
                              <div style={{ marginLeft: '20px', color: "#D91515" }} className={styles.info}>
                                48hrs passed
                              </div>}
                          </>
                        ) : (
                          <div>______</div>
                        )}
                      </td>


                      <td>
                        <div
                          style={lead.proposal_status in statusStyles
                            ? statusStyles[lead.proposal_status as ProposalStatus]
                            : { backgroundColor: "inherit", color: "black" }}
                          className={styles.appointment_status}
                        >
                          {lead.proposal_status ? (
                            (lead.proposal_status === "CREATED" ? "Completed" : "")
                          ) : (
                            <span style={{ color: "black" }}>_____</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div
                          style={lead.proposal_status in statusStyles
                            ? docusignStyles[lead.proposal_status as DocuStatus]
                            : { backgroundColor: "inherit", color: "black" }}
                          className={styles.appointment_status}
                        >
                          {lead.proposal_status ? (
                            (lead.proposal_status)
                          ) : (
                            <span style={{ color: "black" }}>_____</span>
                          )}
                        </div>
                      </td>


                      <td>{lead.finance_company ? lead.finance_company : "_____"}</td>
                      <td>{lead.finance_type ? lead.finance_type : "_____"}</td>
                      <td>{lead.qc_audit ? lead.qc_audit : "_____"}</td>
                      {(selectedLeads.length === 0 && isMobile) &&
                        <td className={styles.FixedColumnMobile} style={{ backgroundColor: "#fff", zIndex: selected === index ? 101 : 0 }} >
                          <div className={styles.RowMobile}
                            onClick={() => {
                              (setLeadId(lead.leads_id));
                              setLeadPropsalLink(lead.proposal_link);
                              setProposalPdfLink(lead.proposal_pdf_link)
                            }}>
                            {(lead?.appointment_status_label === "No Response" && lead.proposal_id === "") || (lead.appointment_status_label === "Appointment Declined" && lead.proposal_id === "") ? (
                              <button className={styles.create_proposal} onClick={handleReschedule}>Reschedule</button>
                            ) :
                              ((lead.appointment_status_label === "Not Required" && lead.proposal_id === "") || (lead.proposal_id === "" && lead.appointment_status_label !== "")) ? (
                                <button className={styles.create_proposal} onClick={() => (onCreateProposal(lead.leads_id))}>Create Proposal</button>
                              ) : (
                                <>
                                  {downloadingLeadId === lead.leads_id ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                      <MicroLoader />
                                      <span style={{ marginLeft: 8 }}>{Math.round(downloadProgress)}%</span>
                                    </div>
                                  ) : (
                                    <DropDownLeadTable
                                      selectedType={selectedType}
                                      onSelectType={(type: string) => {
                                        setSelectedType(type);
                                        setActiveSection(activeSection);
                                      }}
                                      cb={() => {
                                        setSelected(index);
                                      }}
                                      options={
                                        (lead?.appointment_status_label === "Appointment Sent" && lead.proposal_id === '') || (lead.appointment_status_label === 'Appointment Date Passed' && lead.proposal_id === '')
                                          ? [
                                            { label: 'Reschedule Appointment', value: 'app_sched' },
                                            { label: 'Create Proposal', value: 'new_proposal' },
                                          ]
                                          : lead && lead.proposal_status && lead.proposal_status === 'CREATED' && lead.proposal_id !== ''
                                            ? [
                                              { label: 'Send Proposal', value: 'sendtocust' },
                                              { label: 'View Proposal', value: 'viewProposal' },
                                              { label: 'Edit Proposal', value: 'editProposal' },
                                              { label: 'Download Proposal', value: 'download' },
                                              { label: 'Sign Document ', value: 'signature' },
                                              { label: 'Reschedule Appointment', value: 'app_sched' },
                                              { label: 'Refresh Url', value: 'renew_proposal' },
                                            ] : lead && lead.proposal_id !== '' && lead.proposal_status !== 'CREATED'
                                              ? [
                                                { label: 'View Proposal', value: 'viewProposal' },
                                                { label: 'Edit Proposal', value: 'editProposal' },
                                                { label: 'Sign Document ', value: 'signature' },
                                                { label: 'Refresh Url', value: 'renew_proposal' },
                                              ]
                                              : [
                                                { label: 'Create Proposal', value: 'new_proposal' },
                                                { label: 'Schedule Appointment', value: 'app_sched' },
                                              ]
                                      }
                                    />
                                  )}
                                </>
                              )}
                          </div>
                          <div className={styles.RowMobileTwo}>
                            <div className={styles.RowMobileColumns} onClick={() => (setLeadId(lead.leads_id))}>
                              <ChangeStatus
                                selectedType={selectedType}
                                onSelectType={(type: string) => {
                                  setSelectedType(type);
                                  setActiveSection(activeSection);
                                }}
                                cb={() => {
                                  setSelected(index)
                                }}
                                disabledOptions={
                                  (lead.appointment_status_label !== '' && lead.appointment_status_label !== 'No Response')
                                    ? lead.won_lost_label !== ''
                                      ? ['Appointment Not Required', 'Deal Won', 'Complete as Won']
                                      : ['Appointment Not Required', 'Complete as Won']
                                    : lead.won_lost_label !== ''
                                      ? ['Deal Won', 'Complete as Won']
                                      : ['Complete as Won']
                                }
                              />

                            </div>
                            <div className={`${styles.RowMobileColumns} ${styles.infoIcon}`} onClick={() => handleOpenProfileModal(lead.leads_id)} data-tooltip-id="info">
                              <IoInformationOutline />
                            </div>
                            <Tooltip
                              style={{
                                zIndex: 20,
                                background: '#f7f7f7',
                                color: '#000',
                                fontSize: 12,
                                paddingBlock: 4,

                              }}
                              offset={8}
                              id="info"
                              place="bottom"
                              content="Lead Info"
                            />
                          </div>
                        </td>
                      }
                      {(selectedLeads.length === 0 && !isMobile) &&

                        <td className={styles.FixedColumn} style={{ backgroundColor: "#fff", zIndex: selected === index ? 101 : 0 }}>
                          {/* FIRST ROW FIRST COLUMNS STARTED*/}
                          <div style={{
                            display: 'flex',
                            gap: "20px",
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: "100%"
                          }}>
                            <div onClick={() => {
                              (setLeadId(lead.leads_id));
                              setLeadPropsalLink(lead.proposal_link);
                              setProposalPdfLink(lead.proposal_pdf_link)
                            }}>
                              {(lead?.appointment_status_label === "No Response" && lead.proposal_id === "") || (lead.appointment_status_label === "Appointment Declined" && lead.proposal_id === "") ? (
                                <button className={styles.create_proposal} onClick={handleReschedule}>Reschedule</button>
                              ) :
                                ((lead.appointment_status_label === "Not Required" && lead.proposal_id === "") || (lead.appointment_status_label !== 'Appointment Date Passed' && lead.proposal_id === "" && lead.appointment_status_label !== "")) ? (
                                  <button className={styles.create_proposal} onClick={() => (onCreateProposal(lead.leads_id))}>Create Proposal</button>
                                ) : (
                                  <>
                                    {downloadingLeadId === lead.leads_id ? (
                                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <MicroLoader />
                                        <span style={{ marginLeft: 8 }}>{Math.round(downloadProgress)}%</span>
                                      </div>
                                    ) : (
                                      <DropDownLeadTable
                                        selectedType={selectedType}
                                        onSelectType={(type: string) => {
                                          setSelectedType(type);
                                          setActiveSection(activeSection);
                                        }}
                                        cb={() => {
                                          setSelected(index);
                                        }}
                                        options={
                                          (lead?.appointment_status_label === "Appointment Sent" && lead.proposal_id === '') || (lead.appointment_status_label === 'Appointment Date Passed' && lead.proposal_id === '')
                                            ? [
                                              { label: 'Reschedule Appointment', value: 'app_sched' },
                                              { label: 'Create Proposal', value: 'new_proposal' },
                                            ]
                                            : lead && lead.proposal_status && lead.proposal_status === 'CREATED' && lead.proposal_id !== ''
                                              ? [
                                                { label: 'Send Proposal', value: 'sendtocust' },
                                                { label: 'View Proposal', value: 'viewProposal' },
                                                { label: 'Edit Proposal', value: 'editProposal' },
                                                { label: 'Download Proposal', value: 'download' },
                                                { label: 'Sign Document ', value: 'signature' },
                                                { label: 'Reschedule Appointment', value: 'app_sched' },
                                                { label: 'Refresh Url', value: 'renew_proposal' },
                                              ] : lead && lead.proposal_id !== '' && lead.proposal_status !== 'CREATED'
                                                ? [
                                                  { label: 'View Proposal', value: 'viewProposal' },
                                                  { label: 'Edit Proposal', value: 'editProposal' },
                                                  { label: 'Sign Document ', value: 'signature' },
                                                  { label: 'Refresh Url', value: 'renew_proposal' },
                                                ]
                                                : [
                                                  { label: 'Create Proposal', value: 'new_proposal' },
                                                  { label: 'Schedule Appointment', value: 'app_sched' },
                                                ]
                                        }
                                      />
                                    )}
                                  </>
                                )}
                            </div>
                            {/* FIRST ROW FIRST COLUMNS ENDED */}
                            {/* SECOND ROW FIRST COLUMNS STARTED */}
                            <div onClick={() => (setLeadId(lead.leads_id))}>
                              <ChangeStatus
                                selectedType={selectedType}
                                onSelectType={(type: string) => {
                                  setSelectedType(type);
                                  setActiveSection(activeSection);
                                }}
                                cb={() => {
                                  setSelected(index)
                                }}
                                disabledOptions={
                                  (lead.appointment_status_label !== '' && lead.appointment_status_label !== 'No Response')
                                    ? lead.won_lost_label !== ''
                                      ? ['Appointment Not Required', 'Deal Won', 'Complete as Won']
                                      : ['Appointment Not Required', 'Complete as Won']
                                    : lead.won_lost_label !== ''
                                      ? ['Deal Won', 'Complete as Won']
                                      : ['Complete as Won']
                                }
                              />

                            </div>
                            {/* SECOND ROW SECOND COLUMNS STARTED */}
                            <div className={styles.infoIcon} onClick={() => handleOpenProfileModal(lead.leads_id)} data-tooltip-id="info">
                              <IoInformationOutline />
                            </div>
                          </div>
                          {/* SECOND ROW SECOND COLUMNS ENDED */}
                          <Tooltip
                            style={{
                              zIndex: 20,
                              background: '#f7f7f7',
                              color: '#000',
                              fontSize: 12,
                              paddingBlock: 4,

                            }}
                            offset={8}
                            id="info"
                            place="bottom"
                            content="Lead Info"
                          />
                        </td>
                      }

                    </tr>
                  ))
                ) : (
                  <tr style={{ border: 0 }}>
                    <td colSpan={10}>
                      <DataNotFound />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>

        </div>
        {/* {leadsData.length > 0 && !isLoading && (
          <div className="page-heading-container">

            <p className="page-heading">
              {startIndex} -  {endIndex > totalcount! ? totalcount : endIndex} of {totalcount} item
            </p>



            <Pagination
              currentPage={page}
              totalPages={totalPage}
              paginate={paginate}
              currentPageData={[]}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
              perPage={itemsPerPage}
              onPerPageChange={handlePerPageChange}
            />
          </div>

        )} */}
      </div>
    </>
  )
}

export default LeadTable


// Status - won = Won - dis
//st- sched, any status - not req - disable     <LeadTable selectedLeads={selectedLeads} setSelectedLeads={setSelectedLeads} refresh={refresh} setRefresh={setRefresh}/>

