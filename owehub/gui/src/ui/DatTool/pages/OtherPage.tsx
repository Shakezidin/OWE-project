import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import StringInverterConfig from './StringInverterConfig';
import ExistingPVSystemInfo from './ExistingPVSystemInfo';
import Select from '../components/Select';
import styles from '../styles/OtherPage.module.css';

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
          <button className={`editButton ${styles.editButton}`} onClick={() => setIsEditing(true)}>
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
                  options={options[key].map((opt) => ({ label: opt, value: opt }))}
                  value={editedFields[key]}
                  onChange={(selectedValue) => handleFieldChange(key, selectedValue.toString())}
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

const OtherInfoPage: React.FC = () => {
  const [equipment, setEquipment] = useState({
    'New Or Existing': 'New',
    'Panel Brand': 'Eaton',
    'Busbar Rating': '200',
    'Main Breaker Rating': '200',
    'Available Backfeed': '40',
    'Required Backfeed': '---',
  });

  const [system, setSystem] = useState({
    'System Phase': '---',
    'System Voltage': 'Single',
    'Service Entrance': 'Overhead',
    'Service Rating': 'Three',
    'Meter Enclosure Type': 'Meter Combo',
  });

  const [siteInfo, setSiteInfo] = useState({
    'PV Conduit Run': 'Exterior',
    'Drywall Cut Needed': 'Yes',
    'Number of Stories': '2',
    'Trenching Required': 'Yes',
    'Points of Interconnection': '2',
  });

  const [pvInterconnection, setPvInterconnection] = useState({
    Type: 'Lug Connection',
    'Supply/Load Side': 'Supply Side',
    Location: 'Meter',
    'Sub - Location Tap Details': '---',
  });

  const [essInterconnection, setEssInterconnection] = useState({
    'Backup Type': 'Full Home',
    'Transfer Switch': 'Tesla Backup Gateway 2',
    'Fed By': 'Breaker',
  });

  // Right Column States
  const [inverterConfigParent, setInverterConfigParent] = useState({
    Inverter: 'Tesla Inverter 7.5kW',
    Max: '---',
  });

  const [inverterConfig, setInverterConfig] = useState(() => {
    const config: Record<string, string> = {};
    Array.from({ length: 8 }, (_, i) => i + 1).forEach((mppt) => {
      config[`MPPT${mppt} S.1`] = mppt === 1 ? '5.2' : '---';
      config[`MPPT${mppt} S.2`] = '---';
    });
    return config;
  });

  const [roofCoverage, setRoofCoverage] = useState({
    'Total Roof Area': '---',
    'Area of New Modules': '---',
    'Area of EXST Modules': '---',
    'Coverage Percentage': '50%',
  });

  const [measurement, setMeasurement] = useState({
    Length: '---',
    Width: '---',
    Height: '---',
    Other: '---',
  });

  const [existingPV, setExistingPV] = useState({
    'Module Quantity': '40',
    'Model#': 'LonGi LR5-60HPH-320M',
    'Wattage': '320 W DC',
    'Module Area': '18.64 sqft',
    'Inverter 1 Quantity': '1',
    'Inverter 1 Model#': 'Solar Edge SE5000H-US',
    'Inverter 1 Output(A)': '21A AC',
    'Inverter 2 Quantity': '1',
    'Inverter 2 Model#': 'Solar Edge SE5000H-US',
    'Inverter 2 Output(A)': '21A AC',
    'Backfeed': '1',
  });

  return (
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
          onSave={(fields) => setPvInterconnection(fields as typeof pvInterconnection)}
        />

        <Card
          title="ESS Interconnection"
          fields={essInterconnection}
          onSave={(fields) => setEssInterconnection(fields as typeof essInterconnection)}
        />
      </div>

      <div className={styles.column}>
        <StringInverterConfig
          parentConfig={inverterConfigParent}
          config={inverterConfig}
          onUpdateParent={setInverterConfigParent}
          onUpdate={setInverterConfig}
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
  );
};

export default OtherInfoPage;