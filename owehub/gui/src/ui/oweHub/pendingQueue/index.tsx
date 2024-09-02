import React, { useState } from 'react';
import styles from './styles/index.module.css';
import Input from '../../components/text_input/Input';
import { AiFillMinusCircle } from 'react-icons/ai';
const PendingQueue = () => {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<'all' | 'ntp' | 'co' | 'qc'>('qc');

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
                Click to see all project in QC
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
                CO Status
              </h5>
              <p className={styles.pending_card_desc}>
                Click to see all project in QC
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
          <div className="flex items-center justify-between">
            <h3 className="ml3 " style={{ fontWeight: 700, fontSize: 20 }}>
              QC Checklist
            </h3>
            <div className="proper-top">
              <div className="proper-select">
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
                          className={`items-center relative ${styles.warning_card} ${styles.outline_card_wrapper}`}
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
                          className={`items-center  relative ${styles.danger_card} ${styles.outline_card_wrapper}`}
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
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingQueue;
