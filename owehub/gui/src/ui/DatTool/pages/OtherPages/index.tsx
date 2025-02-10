import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import StringInverterConfig from './StringInverterConfig';
import ExistingPVSystemInfo from './ExistingPVSystemInfo';
import Select from '../../components/Select';
import styles from '../../styles/OtherPage.module.css';
import { InverterConfigParent, MpptKey, MpptConfig } from './types';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getDropdownList, getOtherInfo } from '../../../../redux/apiActions/DatToolAction/datToolAction';
import MicroLoader from '../../../components/loader/MicroLoader';
import style2 from '../../styles/AdderssPage.module.css'
import DataNotFound from '../../../components/loader/DataNotFound';

interface CardProps {
  title: string;
  fields: Record<string, string>;
  onSave: (fields: Record<string, string>) => void;
  options?: Partial<Record<string, string[]>>;  // Changed to Partial
}

interface StringInverterProps {
  parentConfig: InverterConfigParent;
  onParentChange: (field: "inverter" | "max", value: string | number) => void;
  onConfigChange: (mppt: MpptKey, field: keyof MpptConfig, value: string) => void;
  inverterOptions?: string[];  // Add this line
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

  const getOptionsForField = (key: string): { label: string; value: string; }[] => {
    const fieldOptions = options?.[key];
    if (!fieldOptions) return [];
    return fieldOptions.map((opt) => ({
      label: opt,
      value: opt,
    }));
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
                options={getOptionsForField(key)}
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
interface DropdownData {
  new_or_existing: string[];
  panel_brand: string[];
  busbar_rating: string[];
  main_breaker_rating: string[];
  system_phase: string[];
  system_voltage: string[];
  service_entrance: string[];
  service_rating: string[];
  meter_enclosure_type: string[];
  pv_conduct_run: string[];
  drywall_cut_needed: string[];
  number_of_stories: string[];
  trenching_required: string[];
  points_of_interconnection: string[];
  inverter: string[];
}
const OtherInfoPage: React.FC <OtherInfoPageProps>= ({currentGeneralId}) => {

  const [loading, setLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState<DropdownData>({
    new_or_existing: [],
    panel_brand: [],
    busbar_rating: [],
    main_breaker_rating: [],
    system_phase: [],
    system_voltage: [],
    service_entrance: [],
    service_rating: [],
    meter_enclosure_type: [],
    pv_conduct_run: [],
    drywall_cut_needed: [],
    number_of_stories: [],
    trenching_required: [],
    points_of_interconnection: [],
    inverter: []
  });
     const dispatch = useAppDispatch();
     const { othersData } = useAppSelector((state) => state.datSlice);
     useEffect(()=>{
      dispatch(getOtherInfo({ project_id: currentGeneralId }));
      console.log(othersData,"Others data ");
    },[currentGeneralId]);
    const [equipment, setEquipment] = useState({});

    const [system, setSystem] = useState({});
  
    const [siteInfo, setSiteInfo] = useState({});
    
    const [pvInterconnection, setPvInterconnection] = useState({});
    
    const [essInterconnection, setEssInterconnection] = useState({});
    
  const [inverterConfigParent, setInverterConfigParent] = useState<InverterConfigParent>({
    inverter: othersData?.inverterConfigParent?.inverter ?? 'N/A',
    max: Number(othersData?.inverterConfigParent?.max) || 0,
    mppt1: {
      s1: '---',
      s2: '---'
    },
    mppt2: {
      s1:'---',
      s2: '---'
    },
    mppt3: {
      s1:'---',
      s2:'---'
    },
    mppt4: {
      s1:'---',
      s2:'---'
    },
    mppt5: {
      s1:'---',
      s2:'---'
    },
    mppt6: {
      s1:'---',
      s2:'---'
    },
    mppt7: {
      s1:'---',
      s2:'---'
    },
    mppt8: {
      s1: '---',
      s2:'---'
    }
  });
  
  const [roofCoverage, setRoofCoverage] = useState({});
  
  const [measurement, setMeasurement] = useState({});
  
  const [existingPV, setExistingPV] = useState({
    'Module Quantity': '---',
    'Model#': '---',
    'Wattage': '---',
    'Module Area':'---',
    'Inverter 1 Quantity': '---',
    'Inverter 1 Model#': '---',
    'Inverter 1 Output(A)':'---',
    'Inverter 2 Quantity':'---',
    'Inverter 2 Model#':  '---',
    'Inverter 2 Output(A)': '---',
    'Backfeed': '---',
  });


  useEffect(() => {
    // Start loading
    setLoading(true);
  
    // If currentGeneralId exists, fetch other info
    // if (currentGeneralId) {
    //   // Fetch additional info for project
    //   dispatch(getOtherInfo({ project_id: currentGeneralId }))
    //     .unwrap()
    //     .then((data: any) => {
    //       if (data) {
    //         setEquipment(data.equipment || { ...equipment });
    //         setSystem(data.system || { ...system });
    //         setSiteInfo(data.siteInfo || { ...siteInfo });
    //         setPvInterconnection(data.pvInterconnection || { ...pvInterconnection });
    //         setEssInterconnection(data.essInterconnection || { ...essInterconnection });
    //         setInverterConfigParent(data.inverterConfigParent || { ...inverterConfigParent });
    //         setRoofCoverage(data.roofCoverage || { ...roofCoverage });
    //         setMeasurement(data.measurement || { ...measurement });
    //         setExistingPV(data.existingPV || { ...existingPV });
    //       }
    //     })
    //     .catch((error: any) => {
    //       console.error("Error fetching data:", error);
    //     });
    // }
  
    // Fetch dropdown list data
    dispatch(getDropdownList({
      drop_down_list: [
        "new_or_existing", "panel_brand", "busbar_rating", "main_breaker_rating",
        "system_phase", "system_voltage", "service_entrance", "service_rating",
        "meter_enclosure_type", "pv_conduct_run", "drywall_cut_needed",
        "number_of_stories", "trenching_required", "points_of_interconnection", "inverter"
      ]
    }))
      .unwrap()
      .then((data: DropdownData) => {
        setDropdownData(data);
      })
      .catch((error: any) => {
        console.error("Error fetching dropdown list data:", error);
      })
      .finally(() => {
        // Stop loading after all async tasks are complete
        setLoading(false);
      });
  
  }, [currentGeneralId, dispatch]);
  


  const getOptionsForCard = (cardType: string): Partial<Record<string, string[]>> => {
    switch (cardType) {
      case 'equipment':
        return {
          'New Or Existing': dropdownData.new_or_existing || [],
          'Panel Brand': dropdownData.panel_brand || [],
          'Busbar Rating': dropdownData.busbar_rating || [],
          'Main Breaker Rating': dropdownData.main_breaker_rating || [],
        };
      case 'system':
        return {
          'System Phase': dropdownData.system_phase || [],
          'System Voltage': dropdownData.system_voltage || [],
          'Service Entrance': dropdownData.service_entrance || [],
          'Service Rating': dropdownData.service_rating || [],
          'Meter Enclosure Type': dropdownData.meter_enclosure_type || [],
        };
      case 'siteInfo':
        return {
          'PV Conduit Run': dropdownData.pv_conduct_run || [],
          'Drywall Cut Needed': dropdownData.drywall_cut_needed || [],
          'Number of Stories': dropdownData.number_of_stories || [],
          'Trenching Required': dropdownData.trenching_required || [],
          'Points of Interconnection': dropdownData.points_of_interconnection || [],
        };
      default:
        return {};
    }
  };
  
  useEffect(() => {
    if (othersData) {
      setEquipment({
        'New Or Existing': othersData?.equipment?.new_or_existing ?? 'N/A',
        'Panel Brand': othersData?.equipment?.panel_brand ?? 'N/A',
        'Busbar Rating': othersData?.equipment?.busbar_rating?.toString() ?? 'N/A',
        'Main Breaker Rating': othersData?.equipment?.main_breaker_rating?.toString() ?? 'N/A',
        'Available Backfeed': othersData?.equipment?.available_backfeed?.toString() ?? 'N/A',
        'Required Backfeed': othersData?.equipment?.required_backfeed ?? 'N/A',
      });
  
      setSystem({
        'System Phase': othersData?.system?.system_phase ?? 'N/A',
        'System Voltage': othersData?.system?.system_voltage ?? 'N/A',
        'Service Entrance': othersData?.system?.service_entrance ?? 'N/A',
        'Service Rating': othersData?.system?.service_rating ?? 'N/A',
        'Meter Enclosure Type': othersData?.system?.meter_enclosure_type ?? 'N/A',
      });
  
      setSiteInfo({
        'PV Conduit Run': othersData?.siteInfo?.pv_conduct_run ?? 'N/A',
        'Drywall Cut Needed': othersData?.siteInfo?.drywall_cut_needed ?? 'N/A',
        'Number of Stories': othersData?.siteInfo?.number_of_stories?.toString() ?? 'N/A',
        'Trenching Required': othersData?.siteInfo?.trenching_required ?? 'N/A',
        'Points of Interconnection': othersData?.siteInfo?.points_of_interconnection?.toString() ?? 'N/A',
      });
  
      setPvInterconnection({
        Type: othersData?.pvInterconnection?.type ?? 'N/A',
        'Supply/Load Side': othersData?.pvInterconnection?.supply_load_side ?? 'N/A',
        Location: othersData?.pvInterconnection?.location ?? 'N/A',
        'Sub - Location Tap Details': othersData?.pvInterconnection?.sub_location_tap_details ?? 'N/A',
      });
  
      setEssInterconnection({
        'Backup Type': othersData?.essInterconnection?.backup_type ?? 'N/A',
        'Transfer Switch': othersData?.essInterconnection?.transfer_switch ?? 'N/A',
        'Fed By': othersData?.essInterconnection?.fed_by ?? 'N/A',
      });
  
      setInverterConfigParent({
        inverter: othersData?.inverterConfigParent?.inverter ?? 'N/A',
        max: Number(othersData?.inverterConfigParent?.max) || 0,
        mppt1: {
          s1: othersData?.inverterConfigParent?.mppt1?.s1 ?? '---',
          s2: othersData?.inverterConfigParent?.mppt1?.s2 ?? '---',
        },
        mppt2: {
          s1: othersData?.inverterConfigParent?.mppt2?.s1 ?? '---',
          s2: othersData?.inverterConfigParent?.mppt2?.s2 ?? '---',
        },
        mppt3: {
          s1: othersData?.inverterConfigParent?.mppt3?.s1 ?? '---',
          s2: othersData?.inverterConfigParent?.mppt3?.s2 ?? '---',
        },
        mppt4: {
          s1: othersData?.inverterConfigParent?.mppt4?.s1 ?? '---',
          s2: othersData?.inverterConfigParent?.mppt4?.s2 ?? '---',
        },
        mppt5: {
          s1: othersData?.inverterConfigParent?.mppt5?.s1 ?? '---',
          s2: othersData?.inverterConfigParent?.mppt5?.s2 ?? '---',
        },
        mppt6: {
          s1: othersData?.inverterConfigParent?.mppt6?.s1 ?? '---',
          s2: othersData?.inverterConfigParent?.mppt6?.s2 ?? '---',
        },
        mppt7: {
          s1: othersData?.inverterConfigParent?.mppt7?.s1 ?? '---',
          s2: othersData?.inverterConfigParent?.mppt7?.s2 ?? '---',
        },
        mppt8: {
          s1: othersData?.inverterConfigParent?.mppt8?.s1 ?? '---',
          s2: othersData?.inverterConfigParent?.mppt8?.s2 ?? '---',
        },
      });
  
      setRoofCoverage({
        'Total Roof Area': othersData?.roofCoverage?.total_roof_area ?? 'N/A',
        'Area of New Modules': othersData?.roofCoverage?.area_of_new_modules ?? '---',
        'Area of EXST Modules': othersData?.roofCoverage?.area_of_exst_modules ?? '---',
        'Coverage Percentage': othersData?.roofCoverage?.coverage_percentage ?? '50%',
      });
  
      setMeasurement({
        Length: othersData?.measurement?.length ?? '---',
        Width: othersData?.measurement?.width ?? '---',
        Height: othersData?.measurement?.height ?? '---',
        Other: othersData?.measurement?.other ?? '---',
      });
  
      setExistingPV({
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
    }
  }, [othersData]);

  return (
    <div className={styles.wrapper}>
      {loading ? (
        <div className={style2.loaderContainer}>
          <MicroLoader />
        </div>
      ) : othersData ? (
        <div className={styles.container}>
          <div className={styles.column}>
            <Card
              title="Electrical Equipment Info"
              fields={equipment}
              onSave={(fields) => setEquipment(fields as typeof equipment)}
              options={getOptionsForCard('equipment')}
            />
            <Card
              title="Electrical System Info"
              fields={system}
              onSave={(fields) => setSystem(fields as typeof system)}
              options={getOptionsForCard('system')}
            />
            <Card
              title="Site Info"
              fields={siteInfo}
              onSave={(fields) => setSiteInfo(fields as typeof siteInfo)}
              options={getOptionsForCard('siteInfo')}
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
              inverterOptions={dropdownData.inverter}
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
      ): <div style={{ display: 'flex', justifyContent: 'center' }}>
      <DataNotFound />
    </div>}
    </div>
  );
};

export default OtherInfoPage;
