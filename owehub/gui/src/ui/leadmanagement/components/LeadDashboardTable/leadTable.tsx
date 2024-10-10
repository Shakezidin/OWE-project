import React, { useState } from 'react'
import styles from './leadTable.module.css';
import { LeadColumn } from '../../../../resources/static_data/leadData/leadTable';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import SortingDropdown from './Dropdowns/CustomDrop';
import { PiSortAscendingLight } from 'react-icons/pi';
import { FaAngleRight } from 'react-icons/fa';
import ChangeStatus from './Dropdowns/ChangeStatus';
import { IoIosInformation } from 'react-icons/io';
import { IoChevronForward } from 'react-icons/io5';
import { useAppSelector } from '../../../../redux/hooks';
import MicroLoader from '../../../components/loader/MicroLoader';
import DataNotFound from '../../../components/loader/DataNotFound';
import DropDownLeadTable from './Dropdowns/CustomDrop';
const LeadTable = () => {

  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [selectedType, setSelectedType] = useState('All');
  const [selected,setSelected]  = useState(-1)
  const [activeSection, setActiveSection] = useState<
    'files' | 'folders' | 'dropdown' | null
  >('files');



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
console.log(selected,"slecteddd")
  return (
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
                    <td className={styles.FixedColumn} style={{zIndex:selected===index?101:0}}>
                      <div>
                        <DropDownLeadTable
                          selectedType={selectedType}
                          onSelectType={(type: string) => {
                            setSelectedType(type);
                            setActiveSection(activeSection);
                          }}
                          cb={()=>{
                            setSelected(index)
                          }}
                          />
                        {/* <div className={styles.progress_status}>
                       <span>Last Updated 2 Days Ago</span>
                       <p className={styles.prop_send}>View Proposal <IoChevronForward /><IoChevronForward /></p>
                    </div> */}
                        {/* <button className={styles.create_proposal}>Create Proposal</button> */}
                      </div>
                      <div><ChangeStatus /></div>
                      <div className={styles.infoIcon}>
                        <IoIosInformation />
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
  )
}

export default LeadTable
