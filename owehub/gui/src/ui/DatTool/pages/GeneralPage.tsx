import { useEffect, useState, ChangeEvent } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiArrowRight } from 'react-icons/fi';
import { MdClose, MdDone } from 'react-icons/md';
import { ICONS } from '../../../resources/icons/Icons';
import styles from '../styles/GeneralPage.module.css';
import CommonComponent from './CommonComponent';
import MicroLoader from '../../components/loader/MicroLoader';
import { useAppDispatch } from '../../../redux/hooks';
import { getDatGeneralInfo, updateDatTool } from '../../../redux/apiActions/DatToolAction/datToolAction';
import DataNotFound from '../../components/loader/DataNotFound';
 


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
  currentGeneralId:string;
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
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
 
const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  type = 'text',
  isEditing,
  className,
  onChange,
}) => (
  <div>
    <label>{label}</label>
    <input
      type={type}
      value={value}
      className={`${styles.inputFieldDat} ${isEditing ? styles.editable : ''}`}
      disabled={!isEditing} // Disable input when not editing
      onChange={onChange}
    />
  </div>
);
 
const GeneralPage: React.FC<generalProps> = ({ generalData, loading, currentGeneralId }) => {
  type GeneralDatInfoKeys = keyof typeof generalDatInfo;
  // State variables for controlling editing and active tabs
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDatEditing, setIsDatEditing] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const dispatch = useAppDispatch();
  
 
  // Handlers for DAT editing
  const handleDatEdit = (): void => setIsDatEditing(true);
  const handleDatCancel = (): void => setIsDatEditing(false);
  
  
 
  
 
  
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
    { label: 'Module QTY', value: generalData?.dat_module_qty || 0, type: 'number' }, 
    {
      label: 'Module Type',
      value: generalData?.dat_module_type || "N/A", 
    },
    { label: 'Inverter Type', value: generalData?.inverter_type || "N/A" }, 
    { label: 'Battery Type', value: generalData?.battery_type || "N/A" }, 
  ];
  
  const datRightFields = [
    { label: 'Design Version', value: generalData?.dat_design_version || 0, type: 'number' }, 
    { label: 'Designer Name', value: generalData?.dat_designer_name || "N/A" }, 
    { label: 'Aurora ID', value: generalData?.dat_aurora_id || "N/A" }, 
    { label: 'Site Capture URL', value: generalData?.site_capture_url || "N/A", type: 'url' }, 
    { label: 'Change Order Required', value: generalData?.dat_change_order || "N/A" }, 
  ];
  const [generalDatInfo,setGeneralDatInfo]=useState({
        datModuleQTY: datFields[0].value,
        datModuleType: datFields[1].value,
        datDesignVersion: datRightFields[0].value,
        datDesignerName:datRightFields[1].value,
        datAuroraID: datRightFields[2].value,
        datSystemSizeAc: "",
        datSystemSizeDc: "",
        datChanges: "",
        datChangeOrderRequired: datRightFields[4].value
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, label: string) => {
    const { value } = e.target;
    console.log(value, "Typed value");
  
    setGeneralDatInfo((prevState) => {
      console.log(prevState, "Original Value");
  
      // Make sure the value is being updated correctly
      const updatedState = { ...prevState };
  
      switch (label) {
        case 'Module QTY':
          updatedState.datModuleQTY = Number(value);
          break;
        case 'Module Type':
          updatedState.datModuleType = value;
          break;
        case 'Design Version':
          updatedState.datDesignVersion = Number(value);
          break;
        case 'Designer Name':
          updatedState.datDesignerName = value;
          break;
        // case 'Inverter Type':
        //   updatedState.datModuleQty = value;
        //   break;
        case 'Aurora ID':
          updatedState.datAuroraID = value;
          break;
        // case 'System Size AC':
        //   updatedState.datSystemSizeAc = value;
        //   break;
        // case 'System Size DC':
        //   updatedState.datSystemSizeDc = value;
        //   break;
        // case 'Changes':
        //   updatedState.datChanges = value;
        //   break;
        case 'Change Order':
          updatedState.datChangeOrderRequired = value;
          break;
        default:
          return prevState;
      }
  
      console.log(updatedState, "Updated State");  // Log the new state
  
      return updatedState;
    });
  };
  
  useEffect(() => {
    console.log(generalDatInfo, "generalDatInfo updated");
  }, [generalDatInfo]); // This will run every time generalDatInfo changes
  
 const handleDatSave = async(): Promise<void> => {setIsDatEditing(false);

    
    await dispatch(updateDatTool(
      {
        project_id: currentGeneralId,
        general_dat_information: {
          dat_module_qty: generalDatInfo.datModuleQTY,
          dat_module_type: generalDatInfo.datModuleType,
          dat_design_version: generalDatInfo.datDesignVersion,
          dat_designer_name:generalDatInfo.datDesignerName,
          dat_aurora_id: generalDatInfo.datAuroraID,
          dat_system_size_ac: generalDatInfo.datSystemSizeAc,
          dat_system_size_dc: generalDatInfo.datSystemSizeDc,
          dat_changes: generalDatInfo.datChanges,
          dat_change_order: generalDatInfo.datChangeOrderRequired
        }
      }
    ));
    
  };
  return (
    <div className={styles.genMain}>
      {/* First Left Section */}
      
 
      {/* Section displaying contract and DAT information */}
      {loading? <div className={styles.loaderContainer}> <MicroLoader/> </div>: generalData  ? <div className={styles.genSecCont}>
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
                  value={generalDatInfo[`dat${field.label.replace(' ', '')}` as GeneralDatInfoKeys]}
                  // value={generalDatInfo[`dat${field.label.replace(' ', '')}`]}
                  type={field.type}
                  onChange={(e:ChangeEvent<HTMLInputElement>) => handleInputChange(e, field.label)}
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
                  value={generalDatInfo[`dat${field.label.replace(' ', '')}` as GeneralDatInfoKeys]}
                  type={field.type}
                  isEditing={isDatEditing}
                  onChange={(e:ChangeEvent<HTMLInputElement>) => handleInputChange(e, field.label)}
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
                        onChange={(e:ChangeEvent<HTMLInputElement>) => handleInputChange(e, label)}
                      />
                      <label style={{ fontWeight: 500 }}>{label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>: <div style={{ display: 'flex', justifyContent: 'center' ,height:"70vh"  }}>
          <DataNotFound />
        </div>}
    </div>
  );
};
 
export default GeneralPage;