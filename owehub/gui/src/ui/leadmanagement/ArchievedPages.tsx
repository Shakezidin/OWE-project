import React, { useState, useEffect, useRef } from 'react';
import styles from './styles/Archive.module.css';
import './styles/mediaQuery.css';
import CrossICONBtn from './Modals/Modalimages/CrossBTNICON.png';

import { Navigate, useNavigate } from 'react-router-dom';
import Pagination from '../components/pagination/Pagination';
import ArchiveModal from './Modals/LeaderManamentSucessModel';
import ConfirmModel from './Modals/ConfirmModel';
import useWindowWidth from '../../hooks/useWindowWidth';
import { ICONS } from '../../resources/icons/Icons';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { postCaller } from '../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import MicroLoader from '../components/loader/MicroLoader';
import DataNotFound from '../components/loader/DataNotFound';

interface HistoryRedirectProps {
  setArchive: (value: boolean) => void;
  activeIndex: number;
  setActiveIndex: (value: number | ((prev: number) => number)) => void;
}

export type DateRangeWithLabel = {
  label?: string;
  start: Date;
  end: Date;
};

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: string;
};



const ArchivedPages = ({ activeIndex, setActiveIndex, setArchive }: HistoryRedirectProps) => {
  const [selectedMonth, setSelectedMonth] = useState('Aug');
  const [currentFilter, setCurrentFilter] = useState('Pending');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);


  const width = useWindowWidth();
  const isTablet = width <= 1024;
  const isMobile = width <= 767;

  // shams start
  const [expandedLeads, setExpandedLeads] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] =
    useState<DateRangeWithLabel | null>(null);
  const [selectedRanges, setSelectedRanges] = useState([
    { startDate: new Date(), endDate: new Date(), key: 'selection' },
  ]);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const [toggledId, setToggledId] = useState<number[]>([]);

  const handleClickOutside = (event: Event) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node) &&
      toggleRef.current &&
      !toggleRef.current.contains(event.target as Node)
    ) {
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const onClickCrossIconBotton = () => {
    setArchive(false);
  };


  const handleChevronClick = (itemId: number) => {
    console.log(itemId);
    setToggledId((prevToggledId) =>
      prevToggledId.includes(itemId) ? [] : [itemId]
    );
  };



  const handleLeadSelection = (leadId: number) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleDetailModal = (lead: Lead) => {
    setShowConfirmModal(true); // Show detail modal
  };


  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { isLoading, leadsData, totalcount } = useAppSelector(
    (state) => state.leadManagmentSlice
  );

  const [pending, setPending] = useState(false);
  const [pending1, setPending1] = useState(false);
  const [pending2, setPending2] = useState(false);
  const [pending3, setPending3] = useState(false);

  const deleteLeads = async () => {
    setPending(true)
    try {
      const response = await postCaller(
        'delete_lead',
        {
          ids: selectedLeads,
        },
        true
      );

      if (response.status === 200) {
        setSelectedLeads([]);
        setActiveIndex((prev) => (prev + 1));
        toast.success('Leads deleted successfully');
      } else {
        toast.warn(response.message);
      }
    } catch (error) {
      console.error('Error deleting leads:', error);
    }
    setPending(false);
  };

  const unArchiveLeads = async () => {
    setPending1(true)
    try {
      const response = await postCaller(
        'toggle_archive',
        {
          ids: selectedLeads,
          is_archived: false,
        },
        true
      );

      if (response.status === 200) {
        setSelectedLeads([]);
        setActiveIndex((prev) => (prev + 1));
        toast.success('Leads Unarcived successfully');
      } else {
        toast.warn(response.message);
      }
    } catch (error) {
      console.error('Error deleting leads:', error);
    }
    setPending1(false)
  };

  const deleteLead = async (leadId: number) => {
    setPending2(true)
    try {
      const response = await postCaller(
        'delete_lead',
        {
          ids: [leadId],
        },
        true
      );

      if (response.status === 200) {
        setActiveIndex((prev) => (prev + 1));
        setSelectedLeads(prevSelectedLeads =>
          prevSelectedLeads.filter(id => id !== leadId)
        );
        toast.success('Lead deleted successfully');
      } else {
        toast.warn(response.message);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
    setPending2(false)
  };

  const handleUnArchiveSelected = async (leadId: number) => {
    setPending3(true);
    try {
      const response = await postCaller(
        'toggle_archive',
        {
          ids: [leadId],
          is_archived: false,
        },
        true
      );
      if (response.status === 200) {
        setActiveIndex((prev) => (prev + 1));
        toast.success('Leads UnArchieved successfully');
        setSelectedLeads([]);
      } else {
        toast.warn(response.message);
      }
    } catch (error) {
      console.error('Error deleting leads:', error);
    }
    setPending3(false);
  };

  return (
    <div>
      {showConfirmModal && (
        <ConfirmModel isOpen1={isModalOpen} onClose1={handleCloseModal} />
      )}

      {/* {showArchiveModal && <ArchiveModal />} */}

      <div className={styles.card}>
        <div className={`${styles.cardHeader} ${styles.tabs_setting}`}>
          <div className={styles.selectionHeader}>
            <div className={styles.selectionInfo}>
              <span
                className={styles.closeIcon}
                onClick={() => setSelectedLeads([])}
              >
                {selectedLeads.length === 0 ? (
                  ''
                ) : (
                  <img
                    src={CrossICONBtn}
                    alt=""
                    className={styles.CrossICONBTNHover1}
                  />
                )}
              </span>
              <span>
                {selectedLeads.length === 0 ? '' : <>{selectedLeads.length} </>}
                Archived
              </span>
            </div>

            {/* HERE CONDITIONAL BUTTONS AFTER 2 ITEMS SELECTED */}

            <div className={styles.SecondChildContain}>
              <div className={styles.ConditionButtonArea}>
                {selectedLeads.length > 0 ? (
                  <div
                    className={styles.ConditionalButtons}
                    style={{ visibility: 'visible' }}
                  >
                    <div className={styles.selectionHeader}>
                      <button className={styles.archieveButtonA} onClick={unArchiveLeads} style={{
                        pointerEvents: pending1 ? 'none' : 'auto',
                        opacity: pending1 ? 0.6 : 1,
                        cursor: pending1 ? 'not-allowed' : 'pointer',
                      }}>
                        {pending1 ? "Unarchiving..." : "Unarchive"}
                      </button>
                    </div>{' '}
                    <div>
                      <button
                        className={styles.archieveButtonX}
                        onClick={deleteLeads}
                        style={{
                          pointerEvents: pending ? 'none' : 'auto',
                          opacity: pending ? 0.6 : 1,
                          cursor: pending ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {pending ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={styles.ConditionalButtons}
                    style={{ visibility: 'hidden' }}
                  >
                    <div className={styles.selectionHeader}>
                      <button className={styles.archieveButtonA}>
                        Archive
                      </button>
                    </div>{' '}
                    <div>
                      <button className={styles.archieveButtonX}>Remove</button>
                    </div>
                  </div>
                )}
              </div>

              {/* HERE NOT NEED TO EDITED */}
              <div>
                {selectedLeads.length === 0 ? (
                  <img
                    className={styles.CrossICONBTNHover}
                    src={CrossICONBtn}
                    onClick={onClickCrossIconBotton}
                    style={{ visibility: 'visible' }}
                  />
                ) : (
                  <img
                    className={styles.CrossICONBTNHover}
                    src={CrossICONBtn}
                    onClick={onClickCrossIconBotton}
                    style={{ display: 'none' }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cardContent}>
          <table className={styles.table}>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={leadsData.length}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : leadsData.length > 0 ? (
                leadsData.map((lead: any, index: number) => (
                  <React.Fragment key={index}>
                    <tr className={styles.history_lists}>
                      <td
                      //WORKING CODE RIGHT For MOBILE && PCs
                        // className={`${
                        //   lead.status === 'Declined' ||
                        //   lead.status === 'Action Needed'
                        //     ? styles.history_list_inner_declined
                        //     : selectedLeads.length > 0 && isMobile 
                        //       ?
                        //         styles.history_list_inner_Mobile_View
                        //       : styles.history_list_inner
                        // }`}
                        // NEED FOR TABLET EDIT
                        className={`${
                          lead.status === 'Declined' ||             
                          lead.status === 'Action Needed'           
                            ? styles.history_list_inner_declined 

                            : (selectedLeads.length > 0 && isMobile ?
                              styles.history_list_inner_Mobile_View 
                               :(selectedLeads.length > 0 && 
                              isTablet?styles.history_list_inner_Tablet_View :styles.history_list_inner ))
                        }`}
                        onClick={handleOpenModal}
                      >
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead['leads_id'])}
                            onChange={() =>
                              handleLeadSelection(lead['leads_id'])
                            }
                          />
                        </label>
                        <div
                          className={styles.user_name}
                          onClick={() =>
                            currentFilter == 'Pending' &&
                            handleDetailModal(lead)
                          }
                        >
                          <h2>
                            {lead.first_name} {lead.last_name}
                          </h2>
                          <p>{lead.leads_status ? lead.leads_status : 'N/A'}</p>
                        </div>
                        <div className={styles.phone_number}>
                          {lead.phone_number}
                        </div>
                        <div className={styles.email}>
                          <span>
                            {lead.email_id}
                            
                          </span>
                        </div>
                        <div className={styles.address}>
                          {/* {lead.street_address ? lead.street_address : 'N/A'} */}
                       
                                 {lead?.street_address
                          ? lead.street_address.length > 20
                            ? `${lead.street_address.slice(0, 20)}...`
                            : lead.street_address
                          : 'N/A'}
                        </div>
                        {selectedLeads.length > 0 ? (
                          ' '
                        ) : (
                          <div>
                            <button
                              className={styles.UnArchiveButton}
                              onClick={() => {
                                handleUnArchiveSelected(lead.leads_id);
                              }}
                              disabled={selectedLeads.length > 1}
                              style={{
                                pointerEvents: pending3 ? 'none' : 'auto',
                                opacity: pending3 ? 0.6 : 1,
                                cursor: pending3 ? 'not-allowed' : 'pointer',
                              }}
                            >
                              {pending3 ? "Unarchiving..." : "Unarchive"}
                            </button>
                          </div>
                        )}
                        {selectedLeads.length > 0 ? (
                          ' '
                        ) : (
                          <div>
                            {isMobile || isTablet ? (
                              <div className={styles.BOXDelete}
                                onClick={() => {
                                  deleteLead(lead.leads_id);
                                }}
                                style={{
                                  pointerEvents: pending2 ? 'none' : 'auto',
                                  opacity: pending2 ? 0.6 : 1,
                                  cursor: pending2 ? 'not-allowed' : 'pointer',
                                }}
                              >
                                <img src={ICONS.DeleteICONBOX} />
                              </div>
                            ) : (
                              <button
                                className={styles.removeButton}
                                onClick={() => {
                                  deleteLead(lead.leads_id);
                                }}
                                style={{
                                  pointerEvents: pending2 ? 'none' : 'auto',
                                  opacity: pending2 ? 0.6 : 1,
                                  cursor: pending2 ? 'not-allowed' : 'pointer',
                                }}
                              >
                                {' '}
                                {pending2 ? "Removing..." : "Remove"}
                              </button>
                            )}
                          </div>
                        )}
                        {isMobile || isTablet ? (
                          <div
                            className={styles.chevron_down}
                            onClick={() => handleChevronClick(lead['leads_id'])}
                          >
                            <img
                              src={
                                toggledId.includes(lead['leads_id'])
                                  ? ICONS.chevronUp
                                  : ICONS.chevronDown
                              }
                              alt={
                                toggledId.includes(lead['leads_id'])
                                  ? 'chevronUp-icon'
                                  : 'chevronDown-icon'
                              }
                            />
                          </div>
                        ) : (
                          ''
                        )}
                      </td>
                    </tr>
                    {toggledId.includes(lead['leads_id']) && (
                      <tr>
                        <td colSpan={5} className={styles.detailsRow}>
                          <div className={''}>{lead.phone_number}</div>
                          <div className={''}>
                            <span>
                              {lead.email_id}
                              
                            </span>
                          </div>
                          <div className={''}>
                            {/* {lead.street_address ? lead.street_address : 'N/A'} */}
                            
                                 {lead?.street_address
                          ? lead.street_address.length > 20
                            ? `${lead.street_address.slice(0, 20)}...`
                            : lead.street_address
                          : 'N/A'}
                          </div>
                        </td>
                      </tr>
                    )}
                    {toggledId === lead.id && (
                      <tr>
                        <td colSpan={5} className={styles.detailsRow}>
                          <div className={''}>{lead.phone}</div>
                          <div className={''}>
                            <span>
                              {lead.email_id}
                              
                            </span>
                          </div>
                          <div className={''}>
                         
                                 {lead?.street_address
                          ? lead.street_address.length > 20
                            ? `${lead.street_address.slice(0, 20)}...`
                            : lead.street_address
                          : 'N/A'}
                            {/* {lead.street_address} */}
                            </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
  );
};

export default ArchivedPages;
