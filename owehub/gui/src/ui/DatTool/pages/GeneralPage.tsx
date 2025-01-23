import styles from '../styles/GeneralPage.module.css';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiArrowRight } from 'react-icons/fi';
import { ICONS } from '../../../resources/icons/Icons';

const GeneralPage = () => {
  return (
    <div className={styles.genMain}>
      <div className={styles.genOneCont}>
        <div className={styles.genOneLeft}>
          <div className={styles.gOneHeader}>
            <div className={styles.gOneHeaderTitle}>
              <div className={styles.gOneHeaderTitleTxt}>
                <p>Kinderland Learning Academy</p>
                <p>OUR 13668</p>
              </div>
              <div className={styles.editUser}>
                <AiOutlineEdit />
              </div>
            </div>
            <div className={styles.gOneHeaderDesc}>
              <p>11 Bonnabrook Dr, Hermitage, TN 37076, United States</p>
              <p>+01 27852348</p>
              <p>kinderland123@gmail.com</p>
            </div>
            <div className={styles.gOneLeftInfo}>
              <div className={styles.gOneLeftInfoTxt}>
                <div>
                  <p>Qcells Q.PEAK DUO BLK ML-G10+/t 400W (Bifacial)</p>
                  <p>PV Modules</p>
                </div>
                <div>
                  <p>Enphase IQ8M Microinverters</p>
                  <p>Inverters</p>
                </div>
                <div>
                  <p>Enphase IQ5P</p>
                  <p>Battery</p>
                </div>
              </div>
              {/* <hr /> */}
              <div className={styles.gOneLeftInfoTxt}>
                <div>
                  <p>123.4 wt</p>
                  <p>DC System Size</p>
                </div>
                <div>
                  <p>87 wt</p>
                  <p>AC System Size</p>
                </div>
                <div>
                  <p>87.34 wt</p>
                  <p>Battery Capacity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.genOneRight}>
          <div className={styles.gOneRightTop}>
            <div className={styles.gOneRightTptxt}>
              <p>AHJ</p>
              <div className={styles.gOneRightTopDesc}>
                <p>Greater Salt Lake Municipal Services District</p>
                <span>
                  <FiArrowRight />
                </span>
              </div>
            </div>
            <div className={styles.gOneRightTptxt}>
              <p>Utility</p>
              <div className={styles.gOneRightTopDesc}>
                <p>French Broad Electric Membership Corporation</p>
                <span>
                  <FiArrowRight />
                </span>
              </div>
            </div>
            <div className={styles.gOneRightBtm}>
              <div className={styles.gOneRightTBottomTxt}>
                <p>Branch</p>
                <p>AZPEO01</p>
              </div>
              <div className={styles.gOneRightTBottomTxt}>
                <p>Lender</p>
                <p>Goodleap</p>
              </div>
            </div>
          </div>
          <div className={styles.gOneRightBottom}>
            <div className={styles.gOneRightBottomTxtOne}>
              <div className={styles.gOneRightBottomTxt}>
                <p className={styles.gOneRightBottomTxtImg}>
                  <img src={ICONS.DatAurora} alt="aurora img" />
                  Aurora
                </p>
                <span>
                  <FiArrowRight />
                </span>
              </div>
              <div className={styles.gOneRightBottomTxt}>
                <p className={styles.gOneRightBottomTxtImg}>
                  <img src={ICONS.DatTape} alt="Tape img" />
                  Tape
                </p>
                <span>
                  <FiArrowRight />
                </span>
              </div>
            </div>
            <div
              className={styles.gOneRightBottomTxt}
              style={{ marginTop: '1.2rem' }}
            >
              <p className={styles.gOneRightBottomTxtImg}>
                <img src={ICONS.DatCapture} alt="Site Capture img" />
                Site Capture
              </p>
              <span>
                <FiArrowRight />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.genSecCont}>
        <div className={styles.genSecLeft}>
          <div className={styles.genSecLeftHdr}>
            <p>CONTRACT INFORMATION</p>
            <p>12 Dec 2024</p>
          </div>
          <div className={styles.genSecLeftMain}>
            <div className={styles.genSecLeftTxt}>
              <p>Module QTY</p>
              <p>35</p>
            </div>
            <div>
              <p>Module Type</p>
              <p>Qcells Q.PEAK DUO BLK ML-G10+/
              t 400W (Bifacial)</p>
            </div>
            <div>
              <p>Inverter Type</p>
              <p>Enphase IQ8M Microinverters</p>
            </div>
            <div>
              <p>battery Type</p>
              <p>Enphase IQ8M Microinverters</p>
            </div>
            <div>
              <p>AC/DC System Size</p>
              <p>12.98 AC     827.65 DC</p>
            </div>
            <div>
              <p>Total Production</p>
              <p>Enphase IQ8M Microinverters</p>
            </div>
          </div>
        </div>
        <div className={styles.genSecRight}>
          <p>DAT Information</p>
        </div>
      </div>
    </div>
  );
};

export default GeneralPage;
