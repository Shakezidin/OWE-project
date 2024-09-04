import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './styles/index.module.css';
import Input from '../../components/text_input/Input';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { AiFillMinusCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
const PendingQueue = () => {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<'all' | 'ntp' | 'co' | 'qc'>('qc');
  const [loading, setLoading] = useState(false);
  const [dataPending, setDataPending] = useState<any>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await postCaller('get_pendingqueuesdata', {
          page_size: 25,
          page_number: page,
          selected_pending_stage: 'qc',
        });

        if (data.status > 201) {
          toast.error(data.message);
          return;
        }
        console.log(data.data);
        setDataPending(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
      }
    })();
  }, [page]);

  const getStatusColor = (status: string) => {
    if (status === 'Pending (Action Required)') {
      return styles.action_required_card;  
    }

    switch (status) {
      case 'Pending':
        return styles.warning_card;
      case 'Completed':
        return styles.success_card;
      default:
        return styles.default_card;
    }
  };

  return (
    <>
      <h2 className={`my2 ${styles.pending_queue_title}`}>Pending projects</h2>
      <div className={styles.pending_card_wrapper}>
        <div className={styles.pending_card} onClick={() => setActive('qc')}>
          <div
            className={` ${active === 'qc' ? styles.active_card : styles.pending_card_hover} ${styles.pending_card_inner}`}
          >
            <h5 className={styles.pending_stats}>134</h5>
            <div>
              <h5
                className={styles.pending_card_title}
                style={{ fontWeight: 500 }}
              >
                QC Checklist
              </h5>
              <p className={styles.pending_card_desc}>
                Click to see all project in QC
              </p>
            </div>
          </div>
        </div>
        <div className={styles.pending_card} onClick={() => setActive('ntp')}>
          <div
            className={` ${active === 'ntp' ? styles.active_card : styles.pending_card_hover} ${styles.pending_card_inner}`}
          >
            <h5 className={styles.pending_stats}>175</h5>
            <div>
              <h5
                className={styles.pending_card_title}
                style={{ fontWeight: 500 }}
              >
                NTP Checklist
              </h5>
              <p className={styles.pending_card_desc}>
                Click to see all project in NTP
              </p>
            </div>
          </div>
        </div>
        <div className={styles.pending_card} onClick={() => setActive('co')}>
          <div
            className={` ${active === 'co' ? styles.active_card : styles.pending_card_hover} ${styles.pending_card_inner}`}
          >
            <h5 className={styles.pending_stats}>192</h5>
            <div>
              <h5
                className={styles.pending_card_title}
                style={{ fontWeight: 500 }}
              >
                C/O Status
              </h5>
              <p className={styles.pending_card_desc}>
                Click to see all project in C/O
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="project-container"
        style={{ marginTop: '1rem', padding: '0 0 1rem 0' }}
      >
        <div className="performance-table-heading">
          <div
            className={`flex  py2 items-center justify-between ${styles.pending_queue_table_header}`}
          >
            <h3
              className={` ${styles.table_heading}`}
              style={{ fontWeight: 700, fontSize: 20 }}
            >
              QC Checklist
            </h3>

            <div className="performance-box-container">
              <p className="status-indicator">Checklist Indicators</p>
              <div className="progress-box-body">
                <div
                  className="progress-box"
                  style={{ background: '#2EAF71', borderRadius: '2px' }}
                ></div>
                <p>Complete</p>
              </div>
              <div className="progress-box-body">
                <div
                  className="progress-box"
                  style={{ background: '#EBA900', borderRadius: '2px' }}
                ></div>
                <p>Pending</p>
              </div>
              <div className="progress-box-body">
                <div
                  className="progress-box"
                  style={{ background: '#E14514', borderRadius: '2px' }}
                ></div>
                <p>Action Required</p>
              </div>
            </div>

            <div className={styles.search_wrapper}>
              <Input
                type="text"
                placeholder="Search for Unique ID or Name"
                value={search}
                name="Search for Unique ID or Name"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="performance-milestone-table">
            <table>
              <thead>
                <tr>
                  <th style={{ padding: '0px' }}>
                    <div className="milestone-header">
                      <div className="project-info">
                        <p>Project Info</p>
                      </div>
                      <div className="header-milestone">
                        <p> Checklist Details</p>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tbody>
                  {dataPending.map((item: any, index: number) => (
                    <tr key={index}>
                      <td style={{ padding: '0px' }}>
                        <div className="milestone-data">
                          <div className="project-info-details">
                            <h3 className={`customer-name ${styles.no_hover}`}>
                              {item.home_owner}
                            </h3>
                            <p className={`install-update ${styles.no_hover}`}>
                              {item.uninque_id}
                            </p>
                          </div>
                          <div
                            style={{ gap: 20 }}
                            className="flex flex-auto items-center"
                          >
                            {item[active] ? (
                              Object.keys(item[active]).map((key) => {
                                
                                if (
                                  (active === 'ntp' &&
                                    key === 'action_required_count') ||
                                  (active === 'qc' &&
                                    key === 'qc_action_required_count') ||
                                  item[active][key] === ''
                                ) {
                                  return null;
                                }

                                return (
                                  <div
                                    key={key}
                                    className={`items-center ${getStatusColor(item[active][key])} ${styles.outline_card_wrapper}`}
                                  >
                                    <AiFillMinusCircle
                                      size={24}
                                      className="mr1"
                                      color={
                                        item[active][key] ===
                                        'Pending (Action Required)'
                                          ? '#E14514'  
                                          : item[active][key] === 'Pending'
                                            ? '#EBA900'
                                            : '#2EAF71'
                                      }
                                    />
                                    <span
                                      style={{ fontWeight: 500, fontSize: 14 }}
                                    >
                                      {key.replace(/_/g, ' ')}
                                    </span>
                                   
                                  </div>
                                );
                              })
                            ) : (
                              <p>No data available</p>  
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* <tr>
                  <td style={{ padding: '0px' }}>
                    <div className="milestone-data">
                      <div className="project-info-details">
                        <h3 className={`customer-name ${styles.no_hover}`}>
                          Johnson Martin
                        </h3>
                        <p className={`install-update ${styles.no_hover}`}>
                          OUR62532
                        </p>
                      </div>
                      <div
                        style={{ gap: 20 }}
                        className="flex flex-auto items-center "
                      >
                        <div
                          className={`items-center ${styles.warning_card} ${styles.outline_card_wrapper}`}
                        >
                          <AiFillMinusCircle
                            size={24}
                            className="mr1"
                            color="#EBA900"
                          />
                          <span style={{ fontWeight: 500, fontSize: 14 }}>
                            Powerclerk
                          </span>
                        </div>

                        <div
                          className={`items-center ${styles.warning_card} ${styles.outline_card_wrapper}`}
                        >
                          <AiFillMinusCircle
                            size={24}
                            className="mr1"
                            color="#EBA900"
                          />
                          <span style={{ fontWeight: 500, fontSize: 14 }}>
                            Powerclerk
                          </span>
                        </div>

                        <div
                          className={`items-center relative relative ${styles.danger_card} ${styles.outline_card_wrapper}`}
                        >
                          <AiFillMinusCircle
                            size={24}
                            className="mr1"
                            color="#E14514"
                          />
                          <span style={{ fontWeight: 500, fontSize: 14 }}>
                            OWE Documents
                          </span>
                          <span className={styles.mandatory}>*</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: '0px' }}>
                    <div className="milestone-data">
                      <div className="project-info-details">
                        <h3 className={`customer-name ${styles.no_hover}`}>
                          Johnson Martin
                        </h3>
                        <p className={`install-update ${styles.no_hover}`}>
                          OUR62532
                        </p>
                      </div>
                      <div
                        style={{ gap: 20 }}
                        className="flex flex-auto items-center "
                      >
                        <div
                          className={`items-center ${styles.warning_card} ${styles.outline_card_wrapper}`}
                        >
                          <AiFillMinusCircle
                            size={24}
                            className="mr1"
                            color="#EBA900"
                          />
                          <span style={{ fontWeight: 500, fontSize: 14 }}>
                            Powerclerk
                          </span>
                        </div>

                        <div
                          className={`items-center ${styles.warning_card} ${styles.outline_card_wrapper}`}
                        >
                          <AiFillMinusCircle
                            size={24}
                            className="mr1"
                            color="#EBA900"
                          />
                          <span style={{ fontWeight: 500, fontSize: 14 }}>
                            Powerclerk
                          </span>
                        </div>

                        <div
                          className={`items-center relative ${styles.danger_card} ${styles.outline_card_wrapper}`}
                        >
                          <AiFillMinusCircle
                            size={24}
                            className="mr1"
                            color="#E14514"
                          />
                          <span style={{ fontWeight: 500, fontSize: 14 }}>
                            OWE Documents
                          </span>
                          <span className={styles.mandatory}>*</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: '0px' }}>
                    <div className="milestone-data">
                      <div className="project-info-details">
                        <h3 className={`customer-name ${styles.no_hover}`}>
                          Johnson Martin
                        </h3>
                        <p className={`install-update ${styles.no_hover}`}>
                          OUR62532
                        </p>
                      </div>
                      <div
                        style={{ gap: 20 }}
                        className="flex flex-auto items-center "
                      >
                        <div
                          className={`items-center relative ${styles.danger_card} ${styles.outline_card_wrapper}`}
                        >
                          <AiFillMinusCircle
                            size={24}
                            className="mr1"
                            color="#E14514"
                          />
                          <span style={{ fontWeight: 500, fontSize: 14 }}>
                            Green Area
                          </span>
                          <span className={styles.mandatory}>*</span>
                        </div>
                        <div
                          className={`items-center ${styles.warning_card} ${styles.outline_card_wrapper}`}
                        >
                          <AiFillMinusCircle
                            size={24}
                            className="mr1"
                            color="#EBA900"
                          />
                          <span style={{ fontWeight: 500, fontSize: 14 }}>
                            Powerclerk
                          </span>
                        </div>

                        <div
                          className={`items-center ${styles.warning_card} ${styles.outline_card_wrapper}`}
                        >
                          <AiFillMinusCircle
                            size={24}
                            className="mr1"
                            color="#EBA900"
                          />
                          <span style={{ fontWeight: 500, fontSize: 14 }}>
                            Powerclerk
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingQueue;
