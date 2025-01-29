import { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiArrowRight } from 'react-icons/fi';
import { MdClose, MdDone } from 'react-icons/md';
import { ICONS } from '../../../resources/icons/Icons';
import styles from '../styles/GeneralPage.module.css';
 
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
 
  // Handlers for controlling edit/save/cancel actions
  const handleEdit = (): void => setIsEditing(true);
  const handleSave = (): void => setIsEditing(false);
  const handleCancel = (): void => setIsEditing(false);
 
  // Handlers for DAT editing
  const handleDatEdit = (): void => setIsDatEditing(true);
  const handleDatCancel = (): void => setIsDatEditing(false);
  const handleDatSave = (): void => setIsDatEditing(false);
 
  // Handler for setting active tab
  const handleClick = (index: number): void => setActiveIndex(index);
 
  // Mock data arrays
  const datTabs: string[] = ['7562', '7001', '7002', '7003'];
  const companyInfo = {
    name: 'Kinderland Learning Academy',
    id: 'OUR 13668',
    address: '11 Bonnabrook Dr, Hermitage, TN 37076, United States',
    phone: '+01 27852348',
    email: 'kinderland123@gmail.com',
  };
  const systemSpecs = [
    {
      title: 'Qcells Q.PEAK DUO BLK ML-G10+/t 400W (Bifacial)',
      subtitle: 'PV Modules',
    },
    { title: 'Enphase IQ8M Microinverters', subtitle: 'Inverters' },
    { title: 'Enphase IQ5P', subtitle: 'Battery' },
  ];
  const systemMetrics = [
    { value: '123.4 wt', label: 'DC System Size' },
    { value: '87 wt', label: 'AC System Size' },
    { value: '87.34 wt', label: 'Battery Capacity' },
  ];
  const rightSideInfo = [
    { label: 'AHJ', value: 'Greater Salt Lake Municipal Services District' },
    { label: 'Utility', value: 'French Broad Electric Membership Corporation' },
  ];
  const bottomInfo = [
    { label: 'Branch', value: 'AZPEO01' },
    { label: 'Lender', value: 'Goodleap' },
  ];
  const integrations = [
    { icon: ICONS.DatAurora, name: 'Aurora' },
    { icon: ICONS.DatTape, name: 'Tape' },
    { icon: ICONS.DatCapture, name: 'Site Capture' },
  ];
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
      <div className={styles.genOneCont}>
        <div className={styles.genOneLeft}>
          <div className={styles.gOneHeader}>
            {/* Header displaying*/}
            <div className={styles.gOneHeaderTitle}>
              <div className={styles.gOneHeaderTitleTxt}>
                <p>{companyInfo.name}</p>
                <p>{companyInfo.id}</p>
              </div>
              {/* Edit buttons: Cancel and Save */}
              <div>
                {isEditing ? (
                  <div className={styles.gOneHeaderBtn}>
                    <div className={styles.editUser} onClick={handleCancel}>
                      <MdClose color="#434343" />
                    </div>
                    <div className={styles.editUserDone} onClick={handleSave}>
                      <MdDone color="white" />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${styles.editUser} ${isEditing ? styles.active : ''}`}
                    onClick={handleEdit}
                  >
                    <AiOutlineEdit />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.gOneHeaderDesc}>
              {[
                { type: 'text', value: companyInfo.address },
                { type: 'tel', value: companyInfo.phone },
                { type: 'email', value: companyInfo.email },
              ].map((input, index) => (
                <input
                  key={index}
                  type={input.type}
                  defaultValue={input.value}
                  className={`${styles.inputField} ${isEditing ? styles.editable : ''}`}
                  disabled={!isEditing}
                />
              ))}
            </div>
 
            <div className={styles.gOneLeftInfo}>
              <div className={styles.gOneLeftInfoTxt}>
                {systemSpecs.map((spec, index) => (
                  <div key={index}>
                    <p>{spec.title}</p>
                    <p>{spec.subtitle}</p>
                  </div>
                ))}
              </div>
              <div className={styles.verticalBorder}></div>
              <div className={styles.gOneLeftInfoTxt}>
                {systemMetrics.map((metric, index) => (
                  <div key={index}>
                    <p>{metric.value}</p>
                    <p>{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
 
        {/* First Right Section - AHJ, Utility, and Integrations */}
        <div className={styles.genOneRight}>
          <div className={styles.gOneRightTop}>
            {rightSideInfo.map((info, index) => (
              <div key={index} className={styles.gOneRightTptxt}>
                <p>{info.label}</p>
                <div className={styles.gOneRightTopDesc}>
                  <p>{info.value}</p>
                  <span>
                    <FiArrowRight />
                  </span>
                </div>
              </div>
            ))}
            <div className={styles.gOneRightBtm}>
              {bottomInfo.map((info, index) => (
                <div key={index} className={styles.gOneRightTBottomTxt}>
                  <p>{info.label}</p>
                  <p>{info.value}</p>
                </div>
              ))}
            </div>
          </div>
 
          <div className={styles.gOneRightBottom}>
            <div className={styles.gOneRightBottomTxtOne}>
              {integrations.slice(0, 2).map((integration, index) => (
                <div key={index} className={styles.gOneRightBottomTxt}>
                  <p className={styles.gOneRightBottomTxtImg}>
                    <img
                      src={integration.icon}
                      alt={`${integration.name} img`}
                    />
                    {integration.name}
                  </p>
                  <span>
                    <FiArrowRight />
                  </span>
                </div>
              ))}
            </div>
            <div
              className={styles.gOneRightBottomTxt}
              style={{ marginTop: '1.2rem' }}
            >
              <p className={styles.gOneRightBottomTxtImg}>
                <img
                  src={integrations[2].icon}
                  alt={`${integrations[2].name} img`}
                />
                {integrations[2].name}
              </p>
              <span>
                <FiArrowRight />
              </span>
            </div>
          </div>
        </div>
      </div>
 
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