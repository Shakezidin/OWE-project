import React, { useState } from 'react';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import Select from '../components/Select';

interface StringInverterProps {
  parentConfig: {
    Inverter: string;
    Max: string;
  };
  config: Record<string, string>;
  onUpdateParent: (config: { Inverter: string; Max: string }) => void;
  onUpdate: (config: Record<string, string>) => void;
}

const inverterOptions = [
  { label: 'Tesla Inverter 7.6kW', value: 'Tesla Inverter 7.6kW' },
  { label: 'Other', value: 'Other' }
];

const StringInverterConfig: React.FC<StringInverterProps> = ({
  parentConfig,
  config,
  onUpdateParent,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedParentConfig, setEditedParentConfig] = useState<{
    Inverter: string;
    Max: string;
  }>({
    Inverter: parentConfig.Inverter || 'Tesla Inverter 7.6kW', // Default to Tesla Inverter 7.6kW
    Max: parentConfig.Max || ''
  });  
  const [editedConfig, setEditedConfig] = useState(config);

  const handleParentChange = (field: string, value: string) => {
    setEditedParentConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (mppt: string, input: string, value: string) => {
    setEditedConfig(prev => ({
      ...prev,
      [`${mppt} ${input}`]: value,
    }));
  };

  const handleSave = () => {
    onUpdateParent(editedParentConfig);
    onUpdate(editedConfig);
    setIsEditing(false);
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.title}>String Inverter Configuration</h3>
        {isEditing ? (
          <div style={styles.actions}>
            <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>
              <AiOutlineClose size={16} />
            </button>
            <button onClick={handleSave} style={styles.saveButton}>
              <AiOutlineCheck size={16} />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} style={styles.editButton}>
            <AiOutlineEdit size={16} />
          </button>
        )}
      </div>

      <div style={styles.grid}>
        <div>
          <label style={styles.label}>Inverter</label>
          {isEditing ? (
           <Select
           value={editedParentConfig.Inverter} // Ensure it uses the current state value
           options={inverterOptions}
           onChange={(selected) => handleParentChange('Inverter', String(selected || ''))}
         />         
          ) : (
            <div style={styles.value}>{parentConfig.Inverter}</div>
          )}
        </div>
        <div>
          <label style={styles.label}>Max</label>
          {isEditing ? (
            <input
              value={editedParentConfig.Max}
              onChange={(e) => handleParentChange('Max', e.target.value)}
              style={styles.input}
            />
          ) : (
            <div style={styles.value}>{parentConfig.Max || '---'}</div>
          )}
        </div>
      </div>

      <div style={styles.mpptGrid}>
        {Array.from({ length: 8 }, (_, i) => i + 1).map((mppt) => (
          <div key={mppt} style={styles.mpptField}>
            <label style={styles.label}>{`MPPT${mppt}`}</label>
            <div style={styles.mpptInputs}>
              <div style={styles.labelContainer}>
                <div style={styles.subLabel}>S.1</div>
                <input
                  value={editedConfig[`MPPT${mppt} S.1`] || ''}
                  onChange={(e) => handleInputChange(`MPPT${mppt}`, 'S.1', e.target.value)}
                  disabled={!isEditing}
                  placeholder="---"
                  style={isEditing ? styles.input : styles.disabledInput}
                />
              </div>
              <div style={styles.labelContainer}>
                <div style={styles.subLabel}>S.2</div>
                <input
                  value={editedConfig[`MPPT${mppt} S.2`] || ''}
                  onChange={(e) => handleInputChange(`MPPT${mppt}`, 'S.2', e.target.value)}
                  disabled={!isEditing}
                  placeholder="---"
                  style={isEditing ? styles.input : styles.disabledInput}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '28px',
    padding: '16px',
    marginBottom: '20px',
    // boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: '#f3f4f6',
  },
  saveButton: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  cancelButton: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: '#f3f4f6',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0 10px',
    marginBottom: '10px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '6px',
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  subLabel: {
    fontSize: '12px',
    color: '#6b7280',
    // marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '24px',
    fontSize: '12px',
    backgroundColor: '#F5F5FD',
    color: '#1f2937',
  },
  disabledInput: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid transparent',
    borderRadius: '8px',
    fontSize: '12px',
    backgroundColor: 'transparent',
    color: '#1f2937',
  },
  value: {
    // padding: '8px 0',
    fontSize: '12px',
    fontWeight: '550',
    color: '#1f2937',
  },
  mpptGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0 15px',
  },
  mpptField: {
    marginBottom: '10px',
  },
  mpptInputs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
};

export default StringInverterConfig;