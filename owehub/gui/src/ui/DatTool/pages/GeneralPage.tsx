import { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiArrowRight } from 'react-icons/fi';
import { MdClose, MdDone } from 'react-icons/md';
import { ICONS } from '../../../resources/icons/Icons';
import styles from '../styles/GeneralPage.module.css';
import CommonComponent from './CommonComponent';
import MicroLoader from '../../components/loader/MicroLoader';
 


interface GeneralData {
  project_name: string;
  project_id: string;
  project_address: string;
  phone_number: string;
  email_id: string;
  pv_module: string;
  inverters: string;
  battery: string;
  dc_system_size: number;
  ac_system_size: number;
  battery_capacity: number;
  ahj: string;
  utility: string;
  branch: string;
  lender: string;
  aurora_link: string;
  tape_link: string;
  site_capture_url: string;
  contract_date: string;
  module_qty: number;
  module_type: number;
  inverter_type: string;
  battery_type: string;
  ac_dc_system_size: string;
  total_production: number;
  dat_module_qty: number;
  dat_module_type: string;
  dat_design_version: number;
  dat_designer_name: string;
  dat_aurora_id: string;
  dat_system_size_ac: string;
  dat_system_size_dc: string;
  dat_changes: string;
  dat_change_order: string;
}
interface generalProps {
  generalData:GeneralData| null;
  loading:boolean;
}
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
  value: string | number | undefined;
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
 
const GeneralPage: React.FC <generalProps>= ({generalData,loading}) => {
  // State variables for controlling editing and active tabs
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDatEditing, setIsDatEditing] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
 
  
 
  // Handlers for DAT editing
  const handleDatEdit = (): void => setIsDatEditing(true);
  const handleDatCancel = (): void => setIsDatEditing(false);
  const handleDatSave = (): void => setIsDatEditing(false);
 

 
  
  const contractInfo = [
    { label: 'Module QTY', value: generalData?.module_qty?.toString() || "N/A" },
    {
      label: 'Module Type',
      value: generalData?.module_type?.toString() || "N/A", 
    },
    { label: 'Inverter Type', value: generalData?.inverter_type || "N/A" }, 
    { label: 'Battery Type', value: generalData?.battery_type || "N/A" }, 
    { label: 'AC/DC System Size', value: generalData?.ac_dc_system_size || "N/A" }, 
    { label: 'Total Production', value: generalData?.total_production?.toString() || "0" }, 
  ];
  
  const datFields = [
    { label: 'Module QTY', value: generalData?.module_qty || 0, type: 'number' }, 
    {
      label: 'Module Type',
      value: generalData?.module_type?.toString() || "N/A", 
    },
    { label: 'Inverter Type', value: generalData?.inverter_type || "N/A" }, 
    { label: 'Battery Type', value: generalData?.battery_type || "N/A" }, 
  ];
  
  const datRightFields = [
    { label: 'Design Version', value: generalData?.dat_design_version || 0, type: 'number' }, 
    { label: 'Designer Name', value: generalData?.dat_designer_name || "N/A" }, 
    { label: 'Aurora ID.', value: generalData?.dat_aurora_id || "N/A" }, 
    { label: 'Site Capture URL', value: generalData?.site_capture_url || "N/A", type: 'url' }, 
    { label: 'Change Order Required', value: generalData?.dat_change_order || "N/A" }, 
  ];
  
  console.log(isDatEditing,"fffff");
 
  return (
    <div className={styles.genMain}>
      {/* First Left Section */}
      
 
      {/* Section displaying contract and DAT information */}
      {loading? <div className={styles.loaderContainer}> <MicroLoader/> </div>:<div className={styles.genSecCont}>
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
      </div>}
    </div>
  );
};
 
export default GeneralPage;