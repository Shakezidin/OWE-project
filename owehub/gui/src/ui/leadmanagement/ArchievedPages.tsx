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

// shams start
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { postCaller } from '../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';


interface HistoryRedirectProps {
  setArchive: (value: boolean) => void;

}

export type DateRangeWithLabel = {
  label?: string;
  start: Date;
  end: Date;
};



// shams end

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: string;
};



const leads = [
  {
    id: '1',
    name: 'Adam Samson',
    phone: '+00 876472822',
    email: 'adamsamson8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Pending',
  },
  {
    id: '2',
    name: 'Kilewan dicho',
    phone: '+00 876472822',
    email: 'Kilewanditcho8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Adam Samson',
    phone: '+00 876472822',
    email: 'Paul mark8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Pending',
  },
  {
    id: '4',
    name: 'Kilewan dicho',
    phone: '+00 876472822',
    email: 'Paul mark8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Pending',
  },
  {
    id: '5',
    name: 'Adam Samson',
    phone: '+00 876472822',
    email: 'adamsamson8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Sent',
  },
  {
    id: '6',
    name: 'Adam Samson',
    phone: '+00 876472822',
    email: 'adamsamson8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Sent',
  },
  {
    id: '7',
    name: 'Kilewan dicho',
    phone: '+00 876472822',
    email: 'Kilewanditcho8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Sent',
  },
  {
    id: '8',
    name: 'Adam Samson',
    phone: '+00 876472822',
    email: 'Paul mark8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Sent',
  },
  {
    id: '9',
    name: 'Rabindra Kumar Sharma',
    phone: '+00 876472822',
    email: 'rabindr718@gmail.com',
    address: 'Patel Nagar, Dehradun, UK',
    status: 'Accepted',
  },
  {
    id: '10',
    name: 'Adam',
    phone: '+00 876472822',
    email: 'adam8772@gmail.com',
    address: '12778 Domingo Ct',
    status: 'Declined',
  },
  {
    id: '11',
    name: 'Adam',
    phone: '+00 876472822',
    email: 'adam8772@gmail.com',
    address: '12778 Domingo Ct',
    status: 'Action Needed',
  },
  {
    id: '12',
    name: 'Kilewan dicho',
    phone: '+00 876472822',
    email: 'Paul mark8772@gmail.com',
    address: '12778 Domingo Ct, 1233Parker, CO',
    status: 'Accepted',
  },
  {
    id: '13',
    name: 'XYZ Name',
    phone: '+00 876472822',
    email: 'xyz8772@gmail.com',
    address: '12778 Domingo Ct',
    status: 'Action Needed',
  },
  {
    id: '14',
    name: 'Virendra Sehwag',
    phone: '+00 876472822',
    email: 'sehwag8772@gmail.com',
    address: '12333 Domingo Ct',
    status: 'Action Needed',
  },
  {
    id: '15',
    name: 'Bhuvneshwar Kumar',
    phone: '+00 876472822',
    email: 'bhuvi8772@gmail.com',
    address: '12333 Domingo Ct',
    status: 'No Response',
  },
  {
    id: '16',
    name: 'Jasprit Bumrah',
    phone: '+00 876472822',
    email: 'jasprit8772@gmail.com',
    address: '12333 Domingo Ct',
    status: 'Update Status',
  },
  {
    id: '17',
    name: 'Risabh Pant',
    phone: '+00 876472822',
    email: 'rp8772@gmail.com',
    address: 'haridwar, Delhi',
    status: 'No Response',
  },
  {
    id: '18',
    name: 'Virat Kohli',
    phone: '+00 876472822',
    email: 'king8772@gmail.com',
    address: '12333 Domingo Ct',
    status: 'Deal Won',
  },
];




const ArchivedPages = ({ setArchive }: HistoryRedirectProps) => {
  const [selectedMonth, setSelectedMonth] = useState('Aug');
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('Pending');
  const [filteredLeads, setFilteredLeads] = useState(leads);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const width = useWindowWidth();
  const isTablet = width <= 1024;

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
  const [toggledId, setToggledId] = useState<string | null>(null);



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
  // shams end
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const onClickCrossIconBotton = () => {
    setArchive(false);
  };

  const Unarchived = () => {
    setArchive(false);
  };

  const RemoveArchived = () => {
    navigate('/lead-mgmt-success-modal');
  };

  const handleLeadSelection = (leadId: number) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  console.log(selectedLeads, "wtf i am doing")


  const handleDetailModal = (lead: Lead) => {
    setShowConfirmModal(true); // Show detail modal
  };
  console.log('currentFilter', currentFilter);

  const toggleLeadExpansion = (leadId: string) => {
    setExpandedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
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

  const deleteLeads = async () => {
    try {
      const response = await postCaller('delete_lead', {
         ids: selectedLeads,
      },true);
  
      if (response.status === 200) {
        toast.success("Leads deleted successfully");
      } else {
        toast.warn(response.message);
      }
    } catch (error) {
      console.error('Error deleting leads:', error);
    }
  };



  return (
    <div>
      {showConfirmModal && (
        <ConfirmModel isOpen1={isModalOpen} onClose1={handleCloseModal} />
      )}

      {showArchiveModal && <ArchiveModal />}

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
                  <div className={styles.ConditionalButtons} style={{ visibility: 'visible' }}>
                    <div className={styles.selectionHeader}>

                      <button
                        className={styles.archieveButtonA}

                      >
                        Unarchive
                      </button>
                    </div> <div >

                      <button
                        className={styles.archieveButtonX}
                        onClick={deleteLeads}
                      >
                        Remove
                      </button>
                    </div></div>

                ) : (


                  <div className={styles.ConditionalButtons} style={{ visibility: 'hidden' }}>
                    <div className={styles.selectionHeader}>


                      <button
                        className={styles.archieveButtonA}

                      >
                        Archived
                      </button>
                    </div> <div >

                      <button
                        className={styles.archieveButtonX}

                      >
                        Remove
                      </button>
                    </div></div>
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

          {/* HERE THE BUTTONS FOR FILTERING ENDED */}
        </div>

        <div className={styles.cardContent}>
          <table className={styles.table}>
            <tbody>
              {leadsData?.map((lead: any, index: number) => (
                <React.Fragment key={index}>
                  <tr className={styles.history_lists}>
                    <td
                      className={`${lead.status === 'Declined' || lead.status === 'Action Needed' ? styles.history_list_inner_declined : styles.history_list_inner}`}
                      onClick={handleOpenModal}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead["leads_id "])}
                          onChange={() => handleLeadSelection(lead["leads_id "])}
                        />
                      </label>
                      <div
                        className={styles.user_name}
                        onClick={() =>
                          currentFilter == 'Pending' && handleDetailModal(lead)
                        }
                      >
                        <h2>{lead.first_name} {lead.last_name}</h2>
                        <p>
                          {lead.leads_status ? lead.leads_status : 'N/A'}
                        </p>
                      </div>
                      <div className={styles.phone_number}>{lead.phone_number}</div>
                      <div className={styles.email}>
                        <span>
                          {lead.email_id}
                          <img
                            className="ml1"
                            height={15}
                            width={15}
                            src={ICONS.complete}
                            alt="verified"
                          />
                        </span>
                      </div>
                      <div className={styles.address}>{lead.street_address ? lead.street_address : "N/A"}</div>
                      {selectedLeads.length > 0 ? " " : <div>
                        <button
                          className={styles.UnArchiveButton}
                          onClick={Unarchived} disabled={selectedLeads.length > 1}
                        >
                          Unarchive
                        </button>
                      </div>}



                      {selectedLeads.length > 0 ? " " : <div><button
                        className={styles.removeButton}
                        onClick={deleteLeads}
                        // disabled={selectedLeads.length > 1}
                      >
                        Remove
                      </button></div>}
                    </td>
                  </tr>
                  {toggledId === lead.id && (
                    <tr>
                      <td colSpan={5} className={styles.detailsRow}>
                        <div className={''}>{lead.phone}</div>
                        <div className={''}>
                          <span>
                            {lead.email_id}
                            <img
                              className="ml1"
                              height={15}
                              width={15}
                              src={ICONS.complete}
                              alt="verified"
                            />
                          </span>
                        </div>
                        <div className={''}>{lead.street_address}</div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default ArchivedPages;
