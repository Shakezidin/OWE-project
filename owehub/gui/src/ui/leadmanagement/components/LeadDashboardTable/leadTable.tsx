import React, { useEffect, useState } from 'react'
import styles from './leadTable.module.css';
import { LeadColumn } from '../../../../resources/static_data/leadData/leadTable';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import SortingDropdown from './Dropdowns/CustomDrop';
import { PiSortAscendingLight } from 'react-icons/pi';
import { FaAngleRight } from 'react-icons/fa';
import ChangeStatus from './Dropdowns/ChangeStatus';
import { IoIosInformation } from 'react-icons/io';
import { IoChevronForward, IoInformationOutline } from 'react-icons/io5';
import { useAppSelector } from '../../../../redux/hooks';
import MicroLoader from '../../../components/loader/MicroLoader';
import DataNotFound from '../../../components/loader/DataNotFound';
import DropDownLeadTable from './Dropdowns/CustomDrop';
import ConfirmaModel from '../../Modals/ConfirmModel';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';

interface LeadSelectionProps {
  selectedLeads: number[];
  setSelectedLeads: React.Dispatch<React.SetStateAction<number[]>>;
}

const LeadTable = ({ selectedLeads, setSelectedLeads }: LeadSelectionProps) => {

  
  const [selectedType, setSelectedType] = useState('');
  const [selected, setSelected] = useState(-1)
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
  const [refresh, setRefresh] = useState(1);
  const [reschedule, setReschedule] = useState(false);
  const [action, setAction] = useState(false);
  console.log(leadId, "hii dj")
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedType === 'app_sched') {
      handleOpenModal();
      setReschedule(true);
      setSelectedType('');
    }else if (selectedType === 'Deal Loss') {
      handleOpenModal();
      setAction(true);
      setSelectedType('');
    }else if (selectedType === 'Deal Won') {
      handleCloseWon();
      setSelectedType('');
    }
  },[selectedType])

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
      } else if (response.status >= 201) {
        toast.warn(response.message);
      }
      setLoad(false);
    } catch (error) {
      setLoad(false);
      console.error('Error submitting form:', error);
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
      />

      <div className={styles.dashTabTop}>

        <div className={styles.TableContainer1}>
          <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <table>
              <thead>
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
                  <th style={{ fontWeight: '500', color: 'black', backgroundColor: "#d5e4ff", display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} className={styles.FixedColumn}>+4 More <FaAngleRight style={{ marginLeft: '-16px' }} /></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={leadsData.length}>
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
                          <div className={styles.name}>{lead.first_name} {lead.last_name}</div>
                          <div className={styles.ids}>OWE1024</div>
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
                        <div style={{ backgroundColor: '#21BC27' }} className={styles.appointment_status}>
                          Appointment Accepted
                        </div>
                        <div style={{ marginLeft: '24px' }} className={styles.info}>15 Sep 2024</div>
                      </td>
                      <td>
                        <div style={{ backgroundColor: '#21BC27' }} className={styles.appointment_status}>
                          Deal Won
                        </div>
                        <div style={{ marginLeft: '14px' }} className={styles.info}>15 Sep 2024</div>
                      </td>
                      <td>
                        {/* <div style={{ backgroundColor: '#21BC27' }} className={styles.appointment_status}>
                    Complete
                  </div>
                  <div style={{ marginLeft: '14px' }} className={styles.info}>15 Sep 2024</div> */}
                        <div className={styles.progressBar}>
                          <div className={styles.progress} style={{ width: '40%' }}></div>
                        </div>
                        <div style={{ marginLeft: '14px' }} className={styles.info}>2/6</div>
                      </td>
                      <td>Loan</td>
                      <td>Bajaj Finance</td>
                      <td>XYZ</td>
                      <td className={styles.FixedColumn} style={{ zIndex: selected === index ? 101 : 0 }}>
                        <div onClick={() => (setLeadId(lead.leads_id))}>
                          <DropDownLeadTable
                            selectedType={selectedType}
                            onSelectType={(type: string) => {
                              setSelectedType(type);
                              setActiveSection(activeSection);
                            }}
                            cb={() => {
                              setSelected(index)
                            }}
                          />

                          {/* <div className={styles.progress_status}>
                       <span>Last Updated 2 Days Ago</span>
                       <p className={styles.prop_send}>View Proposal <IoChevronForward /><IoChevronForward /></p>
                    </div> */}
                          {/* <button className={styles.create_proposal}>Create Proposal</button> */}
                        </div>
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
                          /></div>
                        <div className={styles.infoIcon}>
                          <IoInformationOutline />
                        </div>
                      </td>
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


{/* <LeadTable selectedLeads={selectedLeads} setSelectedLeads={setSelectedLeads}/> */}
