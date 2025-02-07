import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import Select from '../../components/Select';
import styles from '../../styles/StringInverterConfig.module.css';
import { InverterConfigParent, StringInverterProps, MpptKey, MpptConfig } from './types';

const inverterOptions = [
  { label: 'Tesla Inverter 7.6kW', value: 'Tesla Inverter 7.6kW' },
  { label: 'Other', value: 'Other' },
];

const StringInverterConfig: React.FC<StringInverterProps> = ({
  parentConfig,
  onParentChange,
  onConfigChange,
  inverterOptions = [],
}) => {


  console.log("parentConfig", parentConfig);
  const [isEditing, setIsEditing] = useState(false);

  // Provide a fallback to avoid undefined or null initial state
  const [editedConfig, setEditedConfig] = useState<InverterConfigParent>(() => ({
    inverter: parentConfig?.inverter || '',
    max: parentConfig?.max || '',
    mppt1: parentConfig?.mppt1 || { s1: '', s2: '' },
    mppt2: parentConfig?.mppt2 || { s1: '', s2: '' },
    mppt3: parentConfig?.mppt3 || { s1: '', s2: '' },
    mppt4: parentConfig?.mppt4 || { s1: '', s2: '' },
    mppt5: parentConfig?.mppt5 || { s1: '', s2: '' },
    mppt6: parentConfig?.mppt6 || { s1: '', s2: '' },
    mppt7: parentConfig?.mppt7 || { s1: '', s2: '' },
    mppt8: parentConfig?.mppt8 || { s1: '', s2: '' },
  }));

  useEffect(() => {
    if (parentConfig) {
      setEditedConfig(parentConfig); // Update editedConfig if parentConfig changes
    }
  }, [parentConfig]);

  const handleSave = () => {
    // Ensure both 'inverter' and 'max' are updated correctly
    Object.entries(editedConfig).forEach(([key, value]) => {
      if ((key === 'inverter' || key === 'max') && (typeof value === 'string' || typeof value === 'number')) {
        onParentChange(key, value);
      } else if (key.startsWith('mppt')) {
        const mpptKey = key as MpptKey;
        const mpptValue = value as MpptConfig;
        Object.entries(mpptValue).forEach(([field, val]) => {
          onConfigChange(mpptKey, field as keyof MpptConfig, val);
        });
      }
    });
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
              value={editedConfig.inverter}
              options={inverterOptions.map(opt => ({ label: opt, value: opt }))}
              onChange={(selected) => setEditedConfig((prev) => ({ ...prev, inverter: String(selected || '') }))} // Fixed key
            />
          ) : (
            <div className={styles.value}>{parentConfig.inverter}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max</label>
          {isEditing ? (
            <input
              value={editedConfig.max}
              onChange={(e) => setEditedConfig((prev) => ({ ...prev, max: e.target.value }))} // Fixed key
              className={styles.input}
            />
          ) : (
            <div className={styles.value}>{parentConfig.max || '---'}</div>
          )}
        </div>
      </div>

      <div className={styles.mpptGrid}>
        {Array.from({ length: 8 }, (_, i) => i + 1).map((mppt) => {
          const mpptKey = `mppt${mppt}` as keyof Omit<InverterConfigParent, 'inverter' | 'max'>;
          return (
            <div key={mppt} className={styles.mpptField}>
              <label className={styles.label}>{`MPPT${mppt}`}</label>
              <div className={styles.mpptInputs}>
                <div className={styles.labelContainer}>
                  <div className={styles.subLabel}>S.1</div>
                  <input
                    value={editedConfig[mpptKey]?.s1}
                    onChange={(e) => setEditedConfig((prev) => ({
                      ...prev,
                      [mpptKey]: { ...prev[mpptKey], s1: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className={isEditing ? styles.input : styles.disabledInput}
                  />
                </div>
                <div className={styles.labelContainer}>
                  <div className={styles.subLabel}>S.2</div>
                  <input
                    value={editedConfig[mpptKey]?.s2}
                    onChange={(e) => setEditedConfig((prev) => ({
                      ...prev,
                      [mpptKey]: { ...prev[mpptKey], s2: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className={isEditing ? styles.input : styles.disabledInput}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StringInverterConfig;
