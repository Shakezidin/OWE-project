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

import { postCaller } from '../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import MicroLoader from '../components/loader/MicroLoader';
import DataNotFound from '../components/loader/DataNotFound';
import { IoInformationOutline } from 'react-icons/io5';
import LeadManamentSucessModel from './Modals/LeaderManamentSucessModel';
import { getLeads } from '../../redux/apiActions/leadManagement/LeadManagementAction';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import useAuth from '../../hooks/useAuth';
import Profile from './Modals/ProfileInfo';





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



const ArchivedPages = () => {
  // const [isAuthenticated, setAuthenticated] = useState(false);
  // const [loading, setIsLoading] = useState(false);

  const leads = [
    {
      id: '1',
      name: 'Adam Samson',
      phone: '+00 876472822',
      email: 'adamsamson8772@gmail.com',
      address: '12778 Domingo Ct, 1233Parker, CO',
      status: 'Pending',
    },

  ];

  const [currentFilter, setCurrentFilter] = useState('Pending');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [leadId, setLeadId] = useState(0);
  console.log(leadId, "ka malik")

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const width = useWindowWidth();
  const isTablet = width <= 1024;
  const isMobile = width <= 767;

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
  const handleOpenProfileModal = (leadId: number) => {
    setIsProfileOpen(true);
    setLeadId(leadId);
  };
  const handleCloseProfileModal = () => {
    setIsProfileOpen(false);

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
    // setArchive(false);
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
  console.log(leadsData)




  const [pending1, setPending1] = useState(false)
  const unArchiveLeads = async () => {
    setPending1(true);
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
        setActiveIndex((prev) => prev + 1);
        toast.success('Leads Unarcived successfully');
      } else {
        toast.warn(response.message);
      }
    } catch (error) {
      console.error('Error deleting leads:', error);
    }
    setPending1(false);
  };

  const deleteLead = async (leadId: number) => {
    // setPending2(true);
    // try {
    //   const response = await postCaller(
    //     'delete_lead',
    //     {
    //       ids: [leadId],
    //     },
    //     true
    //   );

    //   if (response.status === 200) {
    //     // setActiveIndex((prev) => prev + 1);
    //     setSelectedLeads((prevSelectedLeads) =>
    //       prevSelectedLeads.filter((id) => id !== leadId)
    //     );
    //     toast.success('Lead deleted successfully');
    //   } else {
    //     toast.warn(response.message);
    //   }
    // } catch (error) {
    //   console.error('Error deleting lead:', error);
    // }
    // setPending2(false);
  };

  const [pending3, setPending3] = useState(false);

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
        setActiveIndex((prev) => prev + 1);
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
  const [isArcOpen, setIsArcOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(10);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = page * itemsPerPage;
  const totalPage = Math.ceil(totalCount / itemsPerPage);

  const handleArcClose = () => {
    setIsArcOpen(false);
  };

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

  const [isAuthenticated, setAuthenticated] = useState(false);
  const { authData, saveAuthData } = useAuth();
  useEffect(() => {
    const isPasswordChangeRequired =
      authData?.isPasswordChangeRequired?.toString();
    setAuthenticated(isPasswordChangeRequired === 'false');
  }, [authData]);

  const dispatch = useAppDispatch()


  useEffect(() => {
    if (isAuthenticated) {
      const data = {
        "progress_filter": "ALL",
        "is_archived": true,
        page_size: itemsPerPage,
        page_number: page,
      };

      dispatch(getLeads(data));
    }
  }, [isAuthenticated,itemsPerPage, dispatch, page, activeIndex]);

  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/leadmng-dashboard')
  }
  const resetSelection = () => {
    setSelectedLeads([])
  }

  return (
    <>
      <Profile
        isOpen1={isProfileOpen}
        onClose1={handleCloseProfileModal}
        leadId={leadId}
      />
      <div>

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
                      onClick={resetSelection}
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
                        <button
                          className={styles.archieveButtonA}
                          onClick={unArchiveLeads}
                          style={{
                            pointerEvents: pending1 ? 'none' : 'auto',
                            opacity: pending1 ? 0.6 : 1,
                            cursor: pending1 ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {pending1 ? 'Unarchiving...' : 'Unarchive'}
                        </button>
                      </div>{' '}
                      {/* <div>
                      <button
                        className={styles.archieveButtonX}
                        onClick={deleteLeads}
                        style={{
                          pointerEvents: pending ? 'none' : 'auto',
                          opacity: pending ? 0.6 : 1,
                          cursor: pending ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {false ? 'Removing...' : 'Remove'}
                      </button>
                    </div> */}
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
                    </div>
                  )}
                </div>

                {/* HERE NOT NEED TO EDITED */}
                <div>
                  {selectedLeads.length === 0 ? (
                    <img
                      className={styles.CrossICONBTNHover}
                      src={CrossICONBtn}
                      onClick={handleHome}
                      style={{ visibility: 'visible' }}
                    />
                  ) : (
                    <img
                      className={styles.CrossICONBTNHover}
                      src={CrossICONBtn}
                      // onClick={onClickCrossIconBotton}
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
                    <td colSpan={leads.length}>
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
                          className={`${lead.status === 'Declined' ||
                            lead.status === 'Action Needed'
                            ? styles.history_list_inner
                            : selectedLeads.length > 0 && isMobile
                              ? styles.history_list_inner_Mobile_View
                              : selectedLeads.length > 0 && isTablet
                                ? styles.history_list_inner_Tablet_View
                                : styles.history_list_inner
                            }`}
                        // onClick={handleOpenModal}
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
                            <span>{lead.email_id}</span>
                          </div>
                          <div className={styles.address}>
                            {/* {lead.street_address ? lead.street_address : 'N/A'} */}

                            {lead?.street_address
                              ? lead.street_address.length > 60
                                ? `${lead.street_address.slice(0, 60)}...`
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
                                {/* {pending3 ? 'Unarchiving...' : 'Unarchive'} */}
                                Unarchive</button>
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
                          {/* isProfileOpen */}
                          <div className={styles.infoIcon} onClick={() => handleOpenProfileModal(lead.leads_id)}>
                            <IoInformationOutline />
                          </div>
                        </td>

                      </tr>
                      {toggledId.includes(lead['leads_id']) && (
                        <tr>
                          <td colSpan={5} className={styles.detailsRow}>
                            <div className={''}>{lead.phone_number}</div>
                            <div className={''}>
                              <span>{lead.email_id}</span>
                            </div>
                            <div className={''}>
                              {/* {lead.street_address ? lead.street_address : 'N/A'} */}

                              {lead?.street_address
                                ? lead.street_address.length > 60
                                  ? `${lead.street_address.slice(0, 60)}...`
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
                              <span>{lead.email_id}</span>
                            </div>
                            <div className={''}>
                              {lead?.street_address
                                ? lead.street_address.length > 60
                                  ? `${lead.street_address.slice(0, 60)}...`
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
          {leadsData.length > 0 && (
            <div className={styles.leadpagination}>
              <div className={styles.leftitem}>
                <p className={styles.pageHeading}>
                  {startIndex} - {endIndex} of {totalcount} item
                </p>
              </div>

              <div className={styles.rightitem}>
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArchivedPages;