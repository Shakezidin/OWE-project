import React, { useState } from 'react';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import Select from '../components/Select';
import styles from '../styles/StringInverterConfig.module.css';

interface StringInverterProps {
  parentConfig: { Inverter: string; Max: string };
  config: Record<string, string>;
  onUpdateParent: (config: { Inverter: string; Max: string }) => void;
  onUpdate: (config: Record<string, string>) => void;
}

const inverterOptions = [
  { label: 'Tesla Inverter 7.6kW', value: 'Tesla Inverter 7.6kW' },
  { label: 'Other', value: 'Other' },
];

const StringInverterConfig: React.FC<StringInverterProps> = ({
  parentConfig,
  config,
  onUpdateParent,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedParentConfig, setEditedParentConfig] = useState({
    Inverter: parentConfig.Inverter || 'Tesla Inverter 7.6kW',
    Max: parentConfig.Max || '',
  });
  const [editedConfig, setEditedConfig] = useState(config);

  const handleParentChange = (field: string, value: string) => {
    setEditedParentConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (mppt: string, input: string, value: string) => {
    setEditedConfig((prev) => ({
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
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>String Inverter Configuration</h3>
        {isEditing ? (
          <div className={styles.actions}>
            <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
              <AiOutlineClose />
            </button>
            <button onClick={handleSave} className={styles.saveButton}>
              <AiOutlineCheck />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className={styles.editButton}>
            <AiOutlineEdit />
          </button>
        )}
      </div>

      <div className={styles.grid}>
        <div>
          <label className={styles.label}>Inverter</label>
          {isEditing ? (
            <Select
              value={editedParentConfig.Inverter}
              options={inverterOptions}
              onChange={(selected) => handleParentChange('Inverter', String(selected || ''))}
            />
          ) : (
            <div className={styles.value}>{parentConfig.Inverter}</div>
          )}
        </div>
        <div>
          <label className={styles.label}>Max</label>
          {isEditing ? (
            <input
              value={editedParentConfig.Max}
              onChange={(e) => handleParentChange('Max', e.target.value)}
              className={styles.input}
            />
          ) : (
            <div className={styles.value}>{parentConfig.Max || '---'}</div>
          )}
        </div>
      </div>

      <div className={styles.mpptGrid}>
        {Array.from({ length: 8 }, (_, i) => i + 1).map((mppt) => (
          <div key={mppt} className={styles.mpptField}>
            <label className={styles.label}>{`MPPT${mppt}`}</label>
            <div className={styles.mpptInputs}>
              <div className={styles.labelContainer}>
                <div className={styles.subLabel}>S.1</div>
                <input
                  value={editedConfig[`MPPT${mppt} S.1`] || ''}
                  onChange={(e) => handleInputChange(`MPPT${mppt}`, 'S.1', e.target.value)}
                  disabled={!isEditing}
                  placeholder="---"
                  className={isEditing ? styles.input : styles.disabledInput}
                />
              </div>
              <div className={styles.labelContainer}>
                <div className={styles.subLabel}>S.2</div>
                <input
                  value={editedConfig[`MPPT${mppt} S.2`] || ''}
                  onChange={(e) => handleInputChange(`MPPT${mppt}`, 'S.2', e.target.value)}
                  disabled={!isEditing}
                  placeholder="---"
                  className={isEditing ? styles.input : styles.disabledInput}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StringInverterConfig;
