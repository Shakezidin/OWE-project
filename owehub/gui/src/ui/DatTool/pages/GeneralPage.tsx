import { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiArrowRight } from 'react-icons/fi';
import { MdClose, MdDone } from 'react-icons/md';
import { ICONS } from '../../../resources/icons/Icons';
import styles from '../styles/GeneralPage.module.css';
import CommonComponent from './CommonComponent';
 
// Data Tab Component (for tabs on the right Bottom section)
interface DatTabProps {
  id: string;
  isActive: boolean;
  onClick: () => void;
}
 
const DatTab: React.FC<DatTabProps> = ({ id, isActive, onClick }) => (
  <p
    className={`${styles.genSecRightMainTopHeadertxt} ${isActive ? styles.active : ''}`}
    onClick={onClick}
  >
    {id}
  </p>
);
 
// InputField Component (for each editable input field with label)
interface InputFieldProps {
  label: string;
  value: string;
  type?: string;
  isEditing: boolean;
  className?: string;
}
 
const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  type = 'text',
  isEditing,
  className,
}) => (
  <div>
    <label>{label}</label>
    <input
      type={type}
      defaultValue={value}
      className={`${styles.inputFieldDat} ${isEditing ? styles.editable : ''}`}
      disabled={!isEditing} // Disable input when not editing
    />
  </div>
);
 
const GeneralPage: React.FC = () => {
  // State variables for controlling editing and active tabs
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDatEditing, setIsDatEditing] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
 
  
 
  // Handlers for DAT editing
  const handleDatEdit = (): void => setIsDatEditing(true);
  const handleDatCancel = (): void => setIsDatEditing(false);
  const handleDatSave = (): void => setIsDatEditing(false);
 

 
  
  const contractInfo = [
    { label: 'Module QTY', value: '35' },
    {
      label: 'Module Type',
      value: 'Qcells Q.PEAK DUO BLK ML-G10+/ t 400W (Bifacial)',
    },
    { label: 'Inverter Type', value: 'Enphase IQ8M Microinverters' },
    { label: 'Battery Type', value: 'Enphase IQ8M Microinverters' },
    { label: 'AC/DC System Size', value: '12.98 AC 827.65 DC' },
    { label: 'Total Production', value: 'Enphase IQ8M Microinverters' },
  ];
  const datFields = [
    { label: 'Module QTY', value: '35', type: 'number' },
    {
      label: 'Module Type',
      value: 'Qcells Q.PEAK DUO BLK ML-G10+/t 400W (Bifacial)',
    },
    { label: 'Inverter Type', value: '---' },
    { label: 'Battery Type', value: '---' },
  ];
  const datRightFields = [
    { label: 'Design Version', value: '2', type: 'number' },
    { label: 'Designer Name', value: 'Vansh Seedwan' },
    { label: 'Aurora ID.', value: '---' },
    { label: 'Site Capture URL', value: '---', type: 'url' },
    { label: 'Change Order Required', value: '--' },
  ];
  console.log(isDatEditing,"fffff");
 
  return (
    <div className={styles.genMain}>
      {/* First Left Section */}
      
 
      {/* Section displaying contract and DAT information */}
      <div className={styles.genSecCont}>
        {/* Contract Information Left Section */}
        <div className={styles.genSecLeft}>
          <div className={styles.genSecLeftHdr}>
            <p>CONTRACT INFORMATION</p>
            <p>12 Dec 2024</p>
          </div>
          <div className={styles.genSecLeftMain}>
            {contractInfo.map((info, index) => (
              <div
                key={index}
                className={index === 0 ? styles.genSecLeftTxt : undefined}
              >
                <p>{info.label}</p>
                <p>{info.value}</p>
              </div>
            ))}
          </div>
        </div>
 
        {/* DAT Information Right Section */}
        <div className={styles.genSecRight}>
          <div className={styles.genSecRightHdr}>
            <p>DAT Information</p>
            <div>
              {isDatEditing ? (
                <div className={styles.gSecHeaderBtn}>
                  <div className={styles.editUser} onClick={handleDatCancel}>
                    <MdClose color="#434343" />
                  </div>
                  <div className={styles.editUserDone} onClick={handleDatSave}>
                    <MdDone color="white" />
                  </div>
                </div>
              ) : (
                
                <div className={`${styles.editUser} ${isDatEditing ? styles.active : ''}`} onClick={handleDatEdit}>
                  <AiOutlineEdit />
                </div>
              )}
            </div>
          </div>
 
          {/* Render DAT Tabs, Fields, and Changes */}
          <div className={styles.genSecRightMain}>
            
            <div className={styles.genSecRightMainLft}>
              {/* Render DAT fields for left section */}
              {datFields.map((field, index) => (
                <InputField
                  key={index}
                  label={field.label}
                  value={field.value}
                  type={field.type}
                  className={`${styles.inputField} ${isDatEditing ? styles.editable : ''}`}
                  isEditing={isDatEditing}
                />
              ))}
              <div>
                <label>System Size</label>
                <div className={styles.acdc}>
                  {['AC', 'DC'].map((label) => (
                    <div key={label} className={styles.acdcInp}>
                      <input
                        type="text"
                        defaultValue="---"
                        className={`${styles.inputFieldDat} ${isDatEditing ? styles.editable : ''}`}
                        disabled={!isDatEditing}
                      />
                      <label style={{ fontWeight: 500 }}>{label}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p>Total Production</p>
                <p>27835</p>
              </div>
            </div>
 
            <div className={styles.genSecRightMainRht}>
              {/* Render DAT right section fields */}
              {datRightFields.map((field, index) => (
                <InputField
                  key={index}
                  label={field.label}
                  value={field.value}
                  type={field.type}
                  isEditing={isDatEditing}
                />
              ))}
              <div>
                <label>Changes</label>
                <div className={styles.acdc}>
                  {['Layout', 'Production'].map((label) => (
                    <div key={label} className={styles.acdcInp}>
                      <input
                        type="text"
                        defaultValue="---"
                        className={`${styles.inputFieldDat} ${isDatEditing ? styles.editable : ''}`}
                        disabled={!isDatEditing}
                      />
                      <label style={{ fontWeight: 500 }}>{label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default GeneralPage;