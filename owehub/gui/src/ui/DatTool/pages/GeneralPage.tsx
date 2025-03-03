import { useEffect, useState, ChangeEvent } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiArrowRight } from 'react-icons/fi';
import { MdClose, MdDone } from 'react-icons/md';
import { ICONS } from '../../../resources/icons/Icons';
import styles from '../styles/GeneralPage.module.css';
import CommonComponent from './CommonComponent';
import MicroLoader from '../../components/loader/MicroLoader';
import { useAppDispatch } from '../../../redux/hooks';
import {
  getDatGeneralInfo,
  updateDatTool,
} from '../../../redux/apiActions/DatToolAction/datToolAction';
import DataNotFound from '../../components/loader/DataNotFound';
import { toast } from 'react-toastify';

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
  total_production_tape: string;
  dat_module_qty: number;
  dat_module_type: string;
  dat_design_version: number;
  dat_designer_name: string;
  dat_aurora_id: string;
  dat_system_size_ac: number; // Changed to number for consistency
  dat_system_size_dc: number; // Changed to number for consistency
  // dat_changes: {
  //   layout: string; // Replaces dat_change_layout
  //   production: string; // Replaces dat_change_production
  //   order_required: string; // Replaces dat_change_order_required
  // };
  dat_change_layout: string;
  dat_change_production: string;
  dat_change_order_required: string;
  dat_inverter_type: string; // Added based on API response
  dat_battery_type: string; // Added based on API response
  dat_total_production: number; // Added based on API response
}

interface generalProps {
  generalData: GeneralData | null;
  loading: boolean;
  currentGeneralId: string;
}

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

interface InputFieldProps {
  label: string;
  value: string | number | undefined;
  type?: string;
  isEditing: boolean;
  className?: string;
  placeholder?: string;
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
      disabled={!isEditing}
      onChange={onChange}
      placeholder={value === '' ? '---' : ''}
    />
  </div>
);

const GeneralPage: React.FC<generalProps> = ({
  generalData,
  loading,
  currentGeneralId,
}) => {
  type GeneralDatInfoKeys = keyof typeof generalDatInfo;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDatEditing, setIsDatEditing] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const dispatch = useAppDispatch();

  const handleDatEdit = (): void => setIsDatEditing(true);
  const handleDatCancel = (): void => setIsDatEditing(false);

  const contractInfo = [
    {
      label: 'Module QTY',
      value: generalData?.module_qty?.toString() || '',
    },
    {
      label: 'Module Type',
      value: generalData?.module_type?.toString() || '',
    },
    { label: 'Inverter Type', value: generalData?.inverter_type || '---' },
    { label: 'Battery Type', value: generalData?.battery_type || '---' },
    {
      label: 'AC/DC System Size',
      value: generalData?.ac_dc_system_size || '---',
    },
    {
      label: 'Total Production',
      value: generalData?.total_production_tape?.toString() || '0',
    },
  ];
  const datFields = [
    {
      label: 'Module QTY',
      value: generalData?.dat_module_qty || 0,
      type: 'number',
    },
    {
      label: 'Module Type',
      value: generalData?.dat_module_type || '',
    },
    { label: 'Inverter Type', value: generalData?.dat_inverter_type || '' },
    { label: 'Battery Type', value: generalData?.dat_battery_type || '' },
  ];

  const datRightFields = [
    {
      label: 'Design Version',
      value: generalData?.dat_design_version || 0,
      type: 'number',
    },
    { label: 'Designer Name', value: generalData?.dat_designer_name || '' },
    { label: 'Aurora ID', value: generalData?.dat_aurora_id || '' },
    // {
    //   label: 'Site Capture URL',
    //   value: generalData?.site_capture_url || '',
    //   type: 'url',
    // },
    // {
    //   label: 'Change Order Required',
    //   value: generalData?.dat_change_order || 'N/A',
    // },
  ];
  const [generalDatInfo, setGeneralDatInfo] = useState({
    datModuleQTY: { value: datFields[0].value, changed: false },
    datModuleType: { value: datFields[1].value, changed: false },
    datDesignVersion: { value: datRightFields[0].value, changed: false },
    datDesignerName: { value: datRightFields[1].value, changed: false },
    datAuroraID: { value: datRightFields[2].value, changed: false },
    datSystemSizeAC: { value: '', changed: false },
    datSystemSizeDC: { value: '', changed: false },
    datChanges: { value: '', changed: false },
    datChangeOrderRequired: { value: '', changed: false },
    datInverterType: { value: datFields[2].value, changed: false },
    datBatteryType: { value: datFields[3].value, changed: false },
    // datSiteCaptureURL: { value: datRightFields[3].value, changed: false },
    datChangeLayout: { value: '', changed: false },
    datChangeProduction: { value: '', changed: false },
    datTotalProduction: {
      value: generalData?.dat_total_production || 0,
      changed: false,
    },
  });
  useEffect(() => {
    setGeneralDatInfo({
      datModuleQTY: { value: datFields[0].value, changed: false },
      datModuleType: { value: datFields[1].value, changed: false },
      datDesignVersion: { value: datRightFields[0].value, changed: false },
      datDesignerName: { value: datRightFields[1].value, changed: false },
      datAuroraID: { value: datRightFields[2].value, changed: false },
      datSystemSizeAC: {
        value: generalData?.dat_system_size_ac?.toString() || '0',
        changed: false,
      },
      datSystemSizeDC: {
        value: generalData?.dat_system_size_dc?.toString() || '0',
        changed: false,
      },
      datChanges: { value: '', changed: false },
      datChangeOrderRequired: {
        value: generalData?.dat_change_order_required || '',
        changed: false,
      },
      datInverterType: { value: datFields[2].value, changed: false },
      datBatteryType: { value: datFields[3].value, changed: false },
      // datSiteCaptureURL: { value: datRightFields[3].value, changed: false },
      datChangeLayout: {
        value: generalData?.dat_change_layout || '',
        changed: false,
      },
      datChangeProduction: {
        value: generalData?.dat_change_production || '',
        changed: false,
      },
      datTotalProduction: {
        value: generalData?.dat_total_production || 0,
        changed: false,
      },
    });
  }, [generalData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    label: string
  ) => {
    const { value } = e.target;

    setGeneralDatInfo((prevState) => {
      const updatedState = { ...prevState };

      switch (label) {
        case 'Module QTY':
          updatedState.datModuleQTY.value = value;
          updatedState.datModuleQTY.changed = true;
          break;
        case 'Module Type':
          updatedState.datModuleType.value = value;
          updatedState.datModuleType.changed = true;
          break;
        case 'Design Version':
          updatedState.datDesignVersion.value = value;
          updatedState.datDesignVersion.changed = true;
          break;
        case 'Designer Name':
          updatedState.datDesignerName.value = value;
          updatedState.datDesignerName.changed = true;
          break;
        case 'Aurora ID':
          updatedState.datAuroraID.value = value;
          updatedState.datAuroraID.changed = true;
          break;
        case 'AC':
          updatedState.datSystemSizeAC.value = value;
          updatedState.datSystemSizeAC.changed = true;
          break;
        case 'DC':
          updatedState.datSystemSizeDC.value = value;
          updatedState.datSystemSizeDC.changed = true;
          break;
        case 'Change Order Required':
          updatedState.datChangeOrderRequired.value = value;
          updatedState.datChangeOrderRequired.changed = true;
          break;
        case 'Inverter Type':
          updatedState.datInverterType.value = value;
          updatedState.datInverterType.changed = true;
          break;
        case 'Battery Type':
          updatedState.datBatteryType.value = value;
          updatedState.datBatteryType.changed = true;
          break;
        // case 'Site Capture URL':
        //   updatedState.datSiteCaptureURL.value = value;
        //   updatedState.datSiteCaptureURL.changed = true;
        //   break;
        case 'Layout':
          updatedState.datChangeLayout.value = value;
          updatedState.datChangeLayout.changed = true;
          break;
        case 'Production':
          updatedState.datChangeProduction.value = value;
          updatedState.datChangeProduction.changed = true;
          break;
        default:
          return prevState;
      }

      return updatedState;
    });
  };
  const handleDatSave = async (): Promise<void> => {
    setIsDatEditing(false);

    await dispatch(
      updateDatTool({
        project_id: currentGeneralId,
        general_dat_information: {
          ...(generalDatInfo.datModuleQTY.changed && {
            dat_module_qty: Number(generalDatInfo.datModuleQTY.value),
          }),
          ...(generalDatInfo.datModuleType.changed && {
            dat_module_type: generalDatInfo.datModuleType.value,
          }),
          ...(generalDatInfo.datDesignVersion.changed && {
            dat_design_version: Number(generalDatInfo.datDesignVersion.value),
          }),
          ...(generalDatInfo.datDesignerName.changed && {
            dat_designer_name: generalDatInfo.datDesignerName.value,
          }),
          ...(generalDatInfo.datAuroraID.changed && {
            dat_aurora_id: generalDatInfo.datAuroraID.value,
          }),
          ...(generalDatInfo.datSystemSizeAC.changed && {
            dat_system_size_ac: Number(generalDatInfo.datSystemSizeAC.value),
          }),
          ...(generalDatInfo.datSystemSizeDC.changed && {
            dat_system_size_dc: Number(generalDatInfo.datSystemSizeDC.value),
          }),
          ...(generalDatInfo.datChangeOrderRequired.changed && {
            dat_change_order_required:
              generalDatInfo.datChangeOrderRequired.value,
          }),
          ...(generalDatInfo.datInverterType.changed && {
            dat_inverter_type: generalDatInfo.datInverterType.value,
          }),
          ...(generalDatInfo.datBatteryType.changed && {
            dat_battery_type: generalDatInfo.datBatteryType.value,
          }),
          // ...(generalDatInfo.datSiteCaptureURL.changed && {
          //   dat_site_capture_url: generalDatInfo.datSiteCaptureURL.value,
          // }),
          ...(generalDatInfo.datChangeLayout.changed && {
            dat_change_layout: generalDatInfo.datChangeLayout.value,
          }),
          ...(generalDatInfo.datChangeProduction.changed && {
            dat_change_production: generalDatInfo.datChangeProduction.value,
          }),
        },
      })
    ).then(() => {
      toast.success('Data Updated Successfully');
    });
    setGeneralDatInfo((prevState) => ({
      ...prevState,
      datModuleQTY: { ...prevState.datModuleQTY, changed: false },
      datModuleType: { ...prevState.datModuleType, changed: false },
      datDesignVersion: { ...prevState.datDesignVersion, changed: false },
      datDesignerName: { ...prevState.datDesignerName, changed: false },
      datAuroraID: { ...prevState.datAuroraID, changed: false },
      datSystemSizeAC: { ...prevState.datSystemSizeAC, changed: false },
      datSystemSizeDC: { ...prevState.datSystemSizeDC, changed: false },
      datChangeOrderRequired: {
        ...prevState.datChangeOrderRequired,
        changed: false,
      },
      datInverterType: { ...prevState.datInverterType, changed: false },
      datBatteryType: { ...prevState.datBatteryType, changed: false },
      // datSiteCaptureURL: { ...prevState.datSiteCaptureURL, changed: false },
      datChangeLayout: { ...prevState.datChangeLayout, changed: false },
      datChangeProduction: { ...prevState.datChangeProduction, changed: false },
    }));
  };
  return (
    <div className={styles.genMain}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <MicroLoader />
        </div>
      ) : generalData ? (
        <div className={styles.genSecCont}>
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

          <div className={styles.genSecRight}>
            <div className={styles.genSecRightHdr}>
              <p>DAT Information</p>
              <div>
                {isDatEditing ? (
                  <div className={styles.gSecHeaderBtn}>
                    <div className={styles.editUser} onClick={handleDatCancel}>
                      <MdClose color="#434343" />
                    </div>
                    <div
                      className={styles.editUserDone}
                      onClick={handleDatSave}
                    >
                      <MdDone color="white" />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${styles.editUser} ${isDatEditing ? styles.active : ''}`}
                    onClick={handleDatEdit}
                  >
                    <AiOutlineEdit />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.genSecRightMain}>
              <div className={styles.genSecRightMainLft}>
                {datFields.map((field, index) => (
                  <InputField
                    key={index}
                    label={field.label}
                    value={
                      generalDatInfo[
                        `dat${field.label.replaceAll(' ', '')}` as GeneralDatInfoKeys
                      ].value
                    }
                    type={field.type}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(e, field.label)
                    }
                    className={`${styles.inputField} ${isDatEditing ? styles.editable : ''}`}
                    isEditing={isDatEditing}
                  />
                ))}
                <div>
                  <label>System Size</label>
                  <div className={styles.acdc}>
                    {['AC', 'DC'].map((label) => (
                      <div
                        key={label}
                        className={styles.acdcInp}
                        style={{
                          backgroundColor: isDatEditing ? '#f5f5fd' : '',
                          borderRadius: isDatEditing ? '28px' : '',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="---"
                          value={
                            generalDatInfo[
                              `datSystemSize${label}` as GeneralDatInfoKeys
                            ].value
                          }
                          className={`${styles.inputFieldDatt} ${isDatEditing ? styles.editablee : ''}`}
                          disabled={!isDatEditing}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleInputChange(e, label)
                          }
                        />
                        <label style={{ fontWeight: 500 }}>{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p>Total Production</p>
                  <p>{generalData?.dat_total_production || '---'}</p>
                </div>
              </div>

              <div className={styles.genSecRightMainRht}>
                {datRightFields.map((field, index) => (
                  <InputField
                    key={index}
                    label={field.label}
                    placeholder="---"
                    value={
                      generalDatInfo[
                        `dat${field.label.replaceAll(' ', '')}` as GeneralDatInfoKeys
                      ].value
                    }
                    type={field.type}
                    isEditing={isDatEditing}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(e, field.label)
                    }
                  />
                ))}
                <div>
                  <label>Changes</label>
                  <div className={styles.acdc}>
                    {['Layout', 'Production'].map((label) => (
                      <div
                        key={label}
                        className={styles.acdcInp}
                        style={{
                          backgroundColor: isDatEditing ? '#f5f5fd' : '',
                          borderRadius: isDatEditing ? '28px' : '',
                          paddingTop: isDatEditing ? '0px' : '',
                          paddingBottom: isDatEditing ? '0px' : '',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="---"
                          value={
                            generalDatInfo[
                              `datChange${label}` as GeneralDatInfoKeys
                            ].value
                          }
                          className={`${styles.inputFieldDatt} ${isDatEditing ? styles.editablee : ''}`}
                          disabled={!isDatEditing}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleInputChange(e, label)
                          }
                        />
                        <label
                          style={{ fontWeight: 500, paddingRight: '0.8rem' }}
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label> change Order Required</label>
                  <div className={styles.genSecRightMainRht}>
                    <input
                      type="text"
                      placeholder="---"
                      value={
                        generalDatInfo[
                          `datChangeOrderRequired` as GeneralDatInfoKeys
                        ].value
                      }
                      className={`${styles.inputFieldDat} ${isDatEditing ? styles.editable : ''}`}
                      disabled={!isDatEditing}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, 'Change Order Required')
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{ display: 'flex', justifyContent: 'center', height: '70vh' }}
        >
          <DataNotFound />
        </div>
      )}
    </div>
  );
};

export default GeneralPage;
