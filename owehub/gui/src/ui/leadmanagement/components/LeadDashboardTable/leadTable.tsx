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
import { toZonedTime } from 'date-fns-tz'
import useMatchMedia from '../../../../hooks/useMatchMedia';

type ProposalStatus = "In Progress" | "Send Docs" | "CREATED" | "Clear selection";

interface LeadSelectionProps {
  selectedLeads: number[];
  setSelectedLeads: React.Dispatch<React.SetStateAction<number[]>>;
  refresh: number;
  setRefresh: (value: number | ((prevValue: number) => number)) => void;
  onCreateProposal: (leadId: number) => void;
  retrieveWebProposal: (leadId: number) => void;
  generateWebProposal: (leadId: number) => void;
}

const LeadTable = ({ selectedLeads, setSelectedLeads, refresh, setRefresh, onCreateProposal, retrieveWebProposal, generateWebProposal }: LeadSelectionProps) => {


  const [selectedType, setSelectedType] = useState('');
  const [selected, setSelected] = useState(-1)
  const isMobile = useMatchMedia('(max-width: 767px)');
  const [activeSection, setActiveSection] = useState<
    'Deal Won' | 'Deal Loss' | 'Appointment Not Required' | null
  >('Deal Won');

  const [leadId, setLeadId] = useState(0);

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reschedule, setReschedule] = useState(false);
  const [action, setAction] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedType === 'app_sched') {
      handleOpenModal();
      setAction(false);
      setReschedule(true);
      setSelectedType('');
    } else if (selectedType === 'Deal Loss') {
      handleOpenModal();
      setReschedule(false);
      setAction(true);
      setSelectedType('');
    } else if (selectedType === 'Deal Won') {
      handleCloseWon();
      setSelectedType('');
    } else if (selectedType === 'new_proposal') {
      onCreateProposal(leadId)
      setSelectedType('');
    } else if (selectedType === 'viewProposal') {
      retrieveWebProposal(leadId)
      setSelectedType('');
    } else if (selectedType === 'renew_proposal') {
      generateWebProposal(leadId)
      setSelectedType('');
    }

    else if (selectedType === 'Appointment Not Required') {
      handleAppNotReq();
      setSelectedType('');
    }
  }, [selectedType])

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
  const [side, setSide] = useState('left');


  const handleMoreClick = () => {
    const elm = document.getElementById("tes-table") as HTMLDivElement
    elm.scroll({ left: 700, behavior: "smooth" })
    if (side == 'left') {
      // if (tableContainerRef.current) {
      //   tableContainerRef.current.scrollLeft += 800;
      //   setSide('right');
      // }
      elm.scroll({ left: 700, behavior: "smooth" })
      setSide('right');
    } else if (side == 'right') {
      elm.scroll({ left: -700, behavior: "smooth" })
      setSide('left');
    }
  };

  const statusStyles = {
    "In Progress": {
      backgroundColor: "#21BC27",
      color: "#fff"
    },
    "Send Docs": {
      backgroundColor: "#EC9311",
      color: "#fff"
    },
    "CREATED": {
      backgroundColor: "#B459FC",
      color: "#fff"
    },
    "Clear selection": {
      backgroundColor: "#808080",
      color: "#fff"
    }
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
      />

      <Profile
        isOpen1={isProfileOpen}
        onClose1={handleCloseProfileModal}
        leadId={leadId}
      />

      <div className={styles.dashTabTop}>

        <div className={styles.TableContainer1} id='tes-table'>
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
                        background: isMobile ? 'linear-gradient(to right, #CADCFA 40%, #d5e4ff 100%)': 'linear-gradient(to right, #CADCFA 40%, #d5e4ff 40%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        cursor: 'pointer',
                        minWidth: isMobile ? '65px' : "200px",
                        zIndex: "102",

                      }}
                      className={styles.FixedColumn}

                    >
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
                                          : 'inherit',
                              }}
                              className={styles.appointment_status}
                            >
                              {lead.appointment_status_label}
                            </div>
                            <div style={{ marginLeft: '29px', marginTop: "4px" }} className={styles.info}>
                              {lead.appointment_status_date ? format(toZonedTime(parseISO(lead.appointment_status_date), 'UTC'), 'dd-MM-yyyy') : ""}
                            </div>
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
                                {lead.won_lost_date ? format(toZonedTime(parseISO(lead.won_lost_date), 'UTC'), 'dd-MM-yyyy') : ""}

                              </div>
                            )}
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
                            lead.proposal_status
                          ) : (
                            <span style={{ color: "black" }}>_____</span>
                          )}
                        </div>
                      </td>


                      <td>{lead.finance_company ? lead.finance_company : "_____"}</td>
                      <td>{lead.finance_type ? lead.finance_type : "_____"}</td>
                      <td>{lead.qc_audit ? lead.qc_audit : "_____"}</td>
                      {selectedLeads.length === 0 && isMobile ? <td className={styles.FixedColumnMobile}  style={{ backgroundColor: "#fff", zIndex: selected === index ? 101 : 0 }} >
                        <div className={styles.RowMobile} onClick={() => (setLeadId(lead.leads_id))}>
                          {lead?.appointment_status_label === "No Response" || lead.appointment_status_label === "Appointment Declined" ? (
                            <button className={styles.create_proposal} onClick={handleReschedule}>Reschedule</button>
                          ) :
                            (lead.appointment_status_label === "Not Required" || (lead.proposal_id === "" && lead.appointment_status_label !== "")) ? (
                              <button className={styles.create_proposal} onClick={() => (onCreateProposal(lead.leads_id))}>Create Proposal</button>
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
                                  lead?.appointment_status_label === "Appointment Sent" && lead.proposal_id === ''
                                    ? [
                                      { label: 'Reschedule Appointment', value: 'app_sched' },
                                      { label: 'Create Proposal', value: 'new_proposal' },
                                    ]
                                    : lead && lead.proposal_status && lead.proposal_status.toLowerCase() === 'completed' && lead.proposal_id !== ''
                                      ? [
                                        { label: 'View Proposal', value: 'viewProposal' },
                                        { label: 'Recreate Proposal', value: 'renew_proposal' },
                                        { label: 'Download Proposal', value: 'download' },
                                        { label: 'Reschedule Appointment', value: 'app_sched' },
                                      ] : lead && lead.proposal_id !== ''
                                        ? [
                                          { label: 'View Proposal', value: 'viewProposal' },
                                          { label: 'Recreate Proposal', value: 'renew_proposal' },
                                        ]
                                        : [
                                          { label: 'Create Proposal', value: 'new_proposal' },
                                          { label: 'Schedule Appointment', value: 'app_sched' },
                                        ]
                                }
                              />
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
                                lead.appointment_status_label !== ''
                                  ? lead.won_lost_label !== ''
                                    ? ['Appointment Not Required', 'Deal Won']
                                    : ['Appointment Not Required']
                                  : lead.won_lost_label !== ''
                                    ? ['Deal Won']
                                    : []
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
                      </td> : <td className={styles.FixedColumn} style={{ backgroundColor: "#fff", zIndex: selected === index ? 101 : 0 }}>
                        {/* FIRST ROW FIRST COLUMNS STARTED*/}
                        <div onClick={() => (setLeadId(lead.leads_id))}>
                          {lead?.appointment_status_label === "No Response" || lead.appointment_status_label === "Appointment Declined" ? (
                            <button className={styles.create_proposal} onClick={handleReschedule}>Reschedule</button>
                          ) :
                            (lead.appointment_status_label === "Not Required" || (lead.proposal_id === "" && lead.appointment_status_label !== "")) ? (
                              <button className={styles.create_proposal} onClick={() => (onCreateProposal(lead.leads_id))}>Create Proposal</button>
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
                                  lead?.appointment_status_label === "Appointment Sent" && lead.proposal_id === ''
                                    ? [
                                      { label: 'Reschedule Appointment', value: 'app_sched' },
                                      { label: 'Create Proposal', value: 'new_proposal' },
                                    ]
                                    : lead && lead.proposal_status && lead.proposal_status.toLowerCase() === 'completed' && lead.proposal_id !== ''
                                      ? [
                                        { label: 'View Proposal', value: 'viewProposal' },
                                        { label: 'Recreate Proposal', value: 'renew_proposal' },
                                        { label: 'Download Proposal', value: 'download' },
                                        { label: 'Reschedule Appointment', value: 'app_sched' },
                                      ] : lead && lead.proposal_id !== ''
                                        ? [
                                          { label: 'View Proposal', value: 'viewProposal' },
                                          { label: 'Recreate Proposal', value: 'renew_proposal' },
                                        ]
                                        : [
                                          { label: 'Create Proposal', value: 'new_proposal' },
                                          { label: 'Schedule Appointment', value: 'app_sched' },
                                        ]
                                }
                              />
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
                              lead.appointment_status_label !== ''
                                ? lead.won_lost_label !== ''
                                  ? ['Appointment Not Required', 'Deal Won']
                                  : ['Appointment Not Required']
                                : lead.won_lost_label !== ''
                                  ? ['Deal Won']
                                  : []
                            }
                          />

                        </div>
                        {/* SECOND ROW SECOND COLUMNS STARTED */}
                        <div className={styles.infoIcon} onClick={() => handleOpenProfileModal(lead.leads_id)} data-tooltip-id="info">
                          <IoInformationOutline />
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
      </div>
    </>
  )
}

export default LeadTable


// Status - won = Won - dis
//st- sched, any status - not req - disable     <LeadTable selectedLeads={selectedLeads} setSelectedLeads={setSelectedLeads} refresh={refresh} setRefresh={setRefresh}/>
