import styles from '../styles/GeneralPage.module.css';
import { AiOutlineEdit } from 'react-icons/ai';

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
        <div className={styles.genOneRight}></div>
      </div>
      <div className={styles.genSecCont}>
        <div className={styles.genSecLeft}></div>
        <div className={styles.genSecRight}></div>
      </div>
    </div>
  );
};

export default GeneralPage;
