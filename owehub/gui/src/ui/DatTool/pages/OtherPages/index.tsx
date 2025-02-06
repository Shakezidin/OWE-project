import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import StringInverterConfig from './StringInverterConfig';
import ExistingPVSystemInfo from './ExistingPVSystemInfo';
import Select from '../../components/Select';
import styles from '../../styles/OtherPage.module.css';
import { InverterConfigParent, MpptKey, MpptConfig } from './types';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getOtherInfo } from '../../../../redux/apiActions/DatToolAction/datToolAction';
import MicroLoader from '../../../components/loader/MicroLoader';
import style2 from '../../styles/AdderssPage.module.css'

interface CardProps {
  title: string;
  fields: Record<string, string>;
  onSave: (fields: Record<string, string>) => void;
  options?: Record<string, string[]>;
}

const Card: React.FC<CardProps> = ({ title, fields, onSave, options }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState(fields);

  useEffect(() => {
    setEditedFields(fields);
  }, [fields]);

  const handleFieldChange = (field: string, value: string) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{title}</h3>
        {isEditing ? (
          <div className={styles.actions}>
            <button
              className={`${styles.cancelButton}`}
              onClick={() => setIsEditing(false)}
            >
              <AiOutlineClose />
            </button>
            <button
              className={styles.saveButton}
              onClick={() => {
                onSave(editedFields);
                setIsEditing(false);
              }}
            >
              <AiOutlineCheck />
            </button>
          </div>
        ) : (
          <button
            className={`editButton ${styles.editButton}`}
            onClick={() => setIsEditing(true)}
          >
            <AiOutlineEdit />
          </button>
        )}
      </div>

      <div className={styles.grid}>
        {Object.entries(fields).map(([key, value]) => (
          <div key={key} className={!isEditing ? styles.field : undefined}>
            <label className={styles.label}>{key}</label>
            {isEditing ? (
              options?.[key] ? (
                <Select
                  options={options[key].map((opt) => ({
                    label: opt,
                    value: opt,
                  }))}
                  value={editedFields[key]}
                  onChange={(selectedValue) =>
                    handleFieldChange(key, selectedValue.toString())
                  }
                />
              ) : (
                <input
                  className={styles.input}
                  value={editedFields[key]}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                />
              )
            ) : (
              <div className={styles.value}>{value || '---'}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface OtherInfoPageProps {
  currentGeneralId: string;
  loading?:boolean;
}
const OtherInfoPage: React.FC <OtherInfoPageProps>= ({currentGeneralId}) => {

  const [loading, setLoading] = useState(false);
     const dispatch = useAppDispatch();
     const { othersData } = useAppSelector((state) => state.datSlice);
    //  useEffect(()=>{
    //   dispatch(getOtherInfo({ project_id: currentGeneralId }));
    //   console.log(othersData?.equipment.new_or_existing)
    // },[currentGeneralId]);
    const [equipment, setEquipment] = useState({
      'New Or Existing': othersData?.equipment?.new_or_existing ?? 'N/A',  // Default to 'N/A' if not found
      'Panel Brand': othersData?.equipment?.panel_brand ?? 'N/A',        // Default to 'N/A' if not found
      'Busbar Rating': othersData?.equipment?.busbar_rating?.toString() ?? 'N/A',      // Default to 'N/A' if not found
      'Main Breaker Rating': othersData?.equipment?.main_breaker_rating?.toString() ?? 'N/A',  // Default to 'N/A' if not found
      'Available Backfeed': othersData?.equipment?.available_backfeed?.toString() ?? 'N/A',  // Default to 'N/A' if not found
      'Required Backfeed': othersData?.equipment?.required_backfeed ?? 'N/A',  // Default to 'N/A' if not found
    });

    const [system, setSystem] = useState({
      'System Phase': othersData?.system?.system_phase ?? 'N/A',
      'System Voltage': othersData?.system?.system_voltage ?? 'N/A',
      'Service Entrance': othersData?.system?.service_entrance ?? 'N/A',
      'Service Rating': othersData?.system?.service_rating ?? 'N/A',
      'Meter Enclosure Type': othersData?.system?.meter_enclosure_type ?? 'N/A',
    });
  
    const [siteInfo, setSiteInfo] = useState({
      'PV Conduit Run': othersData?.siteInfo?.pv_conduct_run ?? 'N/A',
      'Drywall Cut Needed': othersData?.siteInfo?.drywall_cut_needed ?? 'N/A',
      'Number of Stories': othersData?.siteInfo?.number_of_stories?.toString() ?? 'N/A',
      'Trenching Required': othersData?.siteInfo?.trenching_required ?? 'N/A',
      'Points of Interconnection': othersData?.siteInfo?.points_of_interconnection?.toString() ?? 'N/A',
    });
    
    const [pvInterconnection, setPvInterconnection] = useState({
      Type: othersData?.pvInterconnection?.type ?? 'N/A',
      'Supply/Load Side': othersData?.pvInterconnection?.supply_load_side ?? 'N/A',
      Location: othersData?.pvInterconnection?.location ?? 'N/A',
      'Sub - Location Tap Details': othersData?.pvInterconnection?.sub_location_tap_details ?? 'N/A',
    });
    
    const [essInterconnection, setEssInterconnection] = useState({
      'Backup Type': othersData?.essInterconnection?.backup_type ?? 'N/A',
      'Transfer Switch': othersData?.essInterconnection?.transfer_switch ?? 'N/A',
      'Fed By': othersData?.essInterconnection?.fed_by ?? 'N/A',
    });
    
  const [inverterConfigParent, setInverterConfigParent] = useState<InverterConfigParent>({
    inverter: othersData?.inverterConfigParent?.inverter ?? 'N/A',
    max: Number(othersData?.inverterConfigParent?.max) || 0,
    mppt1: {
      s1: othersData?.inverterConfigParent?.mppt1?.s1 ?? '---',
      s2: othersData?.inverterConfigParent?.mppt1?.s2 ?? '---'
    },
    mppt2: {
      s1: othersData?.inverterConfigParent?.mppt2?.s1 ?? '---',
      s2: othersData?.inverterConfigParent?.mppt2?.s2 ?? '---'
    },
    mppt3: {
      s1: othersData?.inverterConfigParent?.mppt3?.s1 ?? '---',
      s2: othersData?.inverterConfigParent?.mppt3?.s2 ?? '---'
    },
    mppt4: {
      s1: othersData?.inverterConfigParent?.mppt4?.s1 ?? '---',
      s2: othersData?.inverterConfigParent?.mppt4?.s2 ?? '---'
    },
    mppt5: {
      s1: othersData?.inverterConfigParent?.mppt5?.s1 ?? '---',
      s2: othersData?.inverterConfigParent?.mppt5?.s2 ?? '---'
    },
    mppt6: {
      s1: othersData?.inverterConfigParent?.mppt6?.s1 ?? '---',
      s2: othersData?.inverterConfigParent?.mppt6?.s2 ?? '---'
    },
    mppt7: {
      s1: othersData?.inverterConfigParent?.mppt7?.s1 ?? '---',
      s2: othersData?.inverterConfigParent?.mppt7?.s2 ?? '---'
    },
    mppt8: {
      s1: othersData?.inverterConfigParent?.mppt8?.s1 ?? '---',
      s2: othersData?.inverterConfigParent?.mppt8?.s2 ?? '---'
    }
  });
  
  const [roofCoverage, setRoofCoverage] = useState({
    'Total Roof Area': othersData?.roofCoverage?.total_roof_area ?? 'N/A',
    'Area of New Modules': othersData?.roofCoverage?.area_of_new_modules ?? '---',
    'Area of EXST Modules': othersData?.roofCoverage?.area_of_exst_modules ?? '---',
    'Coverage Percentage': othersData?.roofCoverage?.coverage_percentage ?? '50%',  // Default to '50%' if not found
  });
  
  const [measurement, setMeasurement] = useState({
    Length: othersData?.measurement?.length ?? '---',
    Width: othersData?.measurement?.width ?? '---',
    Height: othersData?.measurement?.height ?? '---',
    Other: othersData?.measurement?.other ?? '---',
  });
  
  const [existingPV, setExistingPV] = useState({
    'Module Quantity': othersData?.existingPV?.module_quantity?.toString() ?? '---',
    'Model#': othersData?.existingPV?.model_number ?? '---',
    'Wattage': othersData?.existingPV?.wattage ?? '---',
    'Module Area': othersData?.existingPV?.module_area ?? '---',
    'Inverter 1 Quantity': othersData?.existingPV?.inverter1_info.quantity?.toString() ?? '---',
    'Inverter 1 Model#': othersData?.existingPV?.inverter1_info.model_number ?? '---',
    'Inverter 1 Output(A)': othersData?.existingPV?.inverter1_info.output_a ?? '---',
    'Inverter 2 Quantity': othersData?.existingPV?.inverter2_info.quantity?.toString() ?? '---',
    'Inverter 2 Model#': othersData?.existingPV?.inverter2_info.model_number ?? '---',
    'Inverter 2 Output(A)': othersData?.existingPV?.inverter2_info.output_a ?? '---',
    'Backfeed': othersData?.existingPV?.existing_calculated_backfeed_without_125?.toString() ?? '---',
  });


  useEffect(() => {
    setLoading(true);
    if (currentGeneralId) { 
      dispatch(getOtherInfo({ project_id: currentGeneralId }))
        .unwrap()
        .then((data:any) => {
          if (data) {
            setEquipment(data.equipment || { ...equipment }); // Use spread for fallback
            setSystem(data.system || { ...system });
            setSiteInfo(data.siteInfo || { ...siteInfo });
            setPvInterconnection(data.pvInterconnection || { ...pvInterconnection });
            setEssInterconnection(data.essInterconnection || { ...essInterconnection });
            setInverterConfigParent(data.inverterConfigParent || { ...inverterConfigParent });
            setRoofCoverage(data.roofCoverage || { ...roofCoverage });
            setMeasurement(data.measurement || { ...measurement });
            setExistingPV(data.existingPV || { ...existingPV });
          }
          setLoading(false);
        })
        .catch((error:any) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    } else {
      setLoading(false); 
    }
  }, [currentGeneralId]);
  

  return (
    <div className={styles.wrapper}>
      {loading ? (
        <div className={style2.loaderContainer}>
          <MicroLoader />
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.column}>
            <Card
              title="Electrical Equipment Info"
              fields={equipment}
              onSave={(fields) => setEquipment(fields as typeof equipment)}
              options={{
                'New Or Existing': ['New', 'Existing'],
                'Panel Brand': ['Eaton', 'Other'],
                'Busbar Rating': ['200', '400'],
                'Main Breaker Rating': ['200', '400'],
              }}
            />
            <Card
              title="Electrical System Info"
              fields={system}
              onSave={(fields) => setSystem(fields as typeof system)}
              options={{
                'System Phase': ['---', 'Single', 'Three'],
                'System Voltage': ['---', 'Single', 'Three'],
                'Service Entrance': ['---', 'Overhead', 'Underground'],
                'Service Rating': ['---', 'Single', 'Three'],
                'Meter Enclosure Type': ['Meter Combo'],
              }}
            />
            <Card
              title="Site Info"
              fields={siteInfo}
              onSave={(fields) => setSiteInfo(fields as typeof siteInfo)}
              options={{
                'PV Conduit Run': ['---', 'Interior', 'Exterior'],
                'Drywall Cut Needed': ['Yes', 'No'],
                'Number of Stories': ['---', '1', '2'],
                'Trenching Required': ['Yes', 'No'],
                'Points of Interconnection': ['---', '1', '2'],
              }}
            />
            <Card
              title="PV only Interconnection"
              fields={pvInterconnection}
              onSave={(fields) =>
                setPvInterconnection(fields as typeof pvInterconnection)
              }
            />
            <Card
              title="ESS Interconnection"
              fields={essInterconnection}
              onSave={(fields) =>
                setEssInterconnection(fields as typeof essInterconnection)
              }
            />
          </div>

          <div className={styles.column}>
            <StringInverterConfig
              parentConfig={inverterConfigParent}
              onParentChange={(field, value) =>
                setInverterConfigParent((prev) => ({
                  ...prev,
                  [field]: value,
                }))
              }
              onConfigChange={(mppt: MpptKey, field: keyof MpptConfig, value: string) =>
                setInverterConfigParent((prev) => ({
                  ...prev,
                  [mppt]: {
                    ...(prev[mppt] as MpptConfig),
                    [field]: value,
                  },
                }))
              }
            />
            <Card
              title="Roof Coverage Calculator"
              fields={roofCoverage}
              onSave={(fields) => setRoofCoverage(fields as typeof roofCoverage)}
            />
            <Card
              title="Measurement Conversion"
              fields={measurement}
              onSave={(fields) => setMeasurement(fields as typeof measurement)}
            />
            <ExistingPVSystemInfo fields={existingPV} onSave={setExistingPV} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherInfoPage;
