import React, { useState, useEffect } from 'react';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import Select from '../../components/Select';
import styles from '../../styles/StringInverterConfig.module.css';
import { InverterConfigParent, StringInverterProps, MpptKey, MpptConfig } from './types';
import { useAppDispatch } from '../../../../redux/hooks';
import { toast } from 'react-toastify';
import { updateDatTool } from '../../../../redux/apiActions/DatToolAction/datToolAction';

const inverterOptions = [
  { label: 'Tesla Inverter 7.6kW', value: 'Tesla Inverter 7.6kW' },
  { label: 'Other', value: 'Other' },
];

const StringInverterConfig: React.FC<StringInverterProps> = ({
  parentConfig,
  onParentChange,
  onConfigChange,
  inverterOptions = [],
  currentGeneralId,

}) => {


  console.log("parentConfig", parentConfig);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [initialConfig, setInitialConfig] = useState<InverterConfigParent | null>(null);
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
      setEditedConfig(parentConfig);
      setInitialConfig(JSON.parse(JSON.stringify(parentConfig))); // Store initial config for comparison
    }
  }, [parentConfig]);

  const getChangedFields = (): Partial<InverterConfigParent> => {
    if (!initialConfig) return editedConfig;
    
    const changedFields: Partial<InverterConfigParent> = {};
    
    // Check parent fields
    if (editedConfig.inverter !== initialConfig.inverter) {
      changedFields.inverter = editedConfig.inverter;
    }
    
    // Convert to numbers for comparison to avoid string vs number mismatches
    const currentMax = typeof editedConfig.max === 'string' ? 
      parseInt(editedConfig.max, 10) || 0 : 
      (typeof editedConfig.max === 'number' ? editedConfig.max : 0);
      
    const initialMax = typeof initialConfig.max === 'string' ? 
      parseInt(initialConfig.max, 10) || 0 : 
      (typeof initialConfig.max === 'number' ? initialConfig.max : 0);
    
    if (currentMax !== initialMax) {
      changedFields.max = editedConfig.max;
    }
    
    // Check MPPT fields
    for (let i = 1; i <= 8; i++) {
      const mpptKey = `mppt${i}` as MpptKey;
      const editedMppt = editedConfig[mpptKey] || { s1: '', s2: '' };
      const initialMppt = initialConfig[mpptKey] || { s1: '', s2: '' };
      
      const changedMpptFields: Partial<MpptConfig> = {};
      let hasChanges = false;
      
      if (editedMppt.s1 !== initialMppt.s1) {
        changedMpptFields.s1 = editedMppt.s1 || '';
        hasChanges = true;
      }
      
      if (editedMppt.s2 !== initialMppt.s2) {
        changedMpptFields.s2 = editedMppt.s2 || '';
        hasChanges = true;
      }
      
      if (hasChanges) {
        changedFields[mpptKey] = changedMpptFields as MpptConfig;
      }
    }
    
    return changedFields;
  };

  const handleSave = async () => {
    try {
      // Get only the changed fields for the payload
      const changedFields = getChangedFields();
      
      if (Object.keys(changedFields).length === 0) {
        // No changes to save
        setIsEditing(false);
        return;
      }
  
      // Create a deep copy to avoid modifying the original object
      const payloadFields = JSON.parse(JSON.stringify(changedFields)) as Partial<InverterConfigParent>;
      
      // Convert max to integer if it exists in changed fields
      if ('max' in payloadFields && payloadFields.max !== undefined) {
        const maxValue = typeof payloadFields.max === 'string' ? 
          parseInt(payloadFields.max, 10) : 
          payloadFields.max;
        payloadFields.max = isNaN(Number(maxValue)) ? 0 : Number(maxValue);
      }
  
      const payload = {
        project_id: currentGeneralId,
        string_inverter_configuration: payloadFields
      };
  
      // Dispatch the action and update local state
      await dispatch(updateDatTool(payload)).unwrap();
      
      // Update the local state via callback props
      Object.entries(changedFields).forEach(([key, value]) => {
        if (key === 'inverter' && typeof value === 'string') {
          onParentChange(key, value);
        } else if (key === 'max') {
          const numValue = typeof value === 'string' ? parseInt(value, 10) : Number(value);
          onParentChange(key, isNaN(numValue) ? 0 : numValue);
        } else if (key.startsWith('mppt') && typeof value === 'object' && value !== null) {
          const mpptKey = key as MpptKey;
          const mpptValue = value as Partial<MpptConfig>;
          if (mpptValue.s1 !== undefined) {
            onConfigChange(mpptKey, 's1', mpptValue.s1);
          }
          if (mpptValue.s2 !== undefined) {
            onConfigChange(mpptKey, 's2', mpptValue.s2);
          }
        }
      });
  
      setIsEditing(false);
      // toast.success('String inverter configuration updated successfully');
      
      // Update initial config after successful save
      setInitialConfig(JSON.parse(JSON.stringify(editedConfig)));
    } catch (error) {
      console.error('Failed to update string inverter configuration:', error);
      // toast.error(error instanceof Error ? error.message : 'Failed to update configuration');
    }
  };
  const handleCancel = () => {
    // Reset to original config on cancel
    if (initialConfig) {
      setEditedConfig(initialConfig);
    }
    setIsEditing(false);
  };


  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>String Inverter Configuration</h3>
        {isEditing ? (
          <div className={styles.actions}>
            <button onClick={handleCancel} className={styles.cancelButton}>
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
              onChange={(selected) => setEditedConfig((prev) => ({ ...prev, inverter: String(selected || '') }))}
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
              onChange={(e) => setEditedConfig((prev) => ({ ...prev, max: e.target.value }))}
              className={styles.input}
            />
          ) : (
            <div className={styles.value}>{parentConfig.max || '---'}</div>
          )}
        </div>
      </div>

      <div className={styles.mpptGrid}>
        {Array.from({ length: 8 }, (_, i) => i + 1).map((mppt) => {
          const mpptKey = `mppt${mppt}` as MpptKey;
          return (
            <div key={mppt} className={styles.mpptField}>
              <label className={styles.label}>{`MPPT${mppt}`}</label>
              <div className={styles.mpptInputs}>
                <div className={styles.labelContainer}>
                  <div className={styles.subLabel}>S.1</div>
                  <input
                    value={editedConfig[mpptKey]?.s1 || ''}
                    onChange={(e) => setEditedConfig((prev) => ({
                      ...prev,
                      [mpptKey]: { ...(prev[mpptKey] || {}), s1: e.target.value }
                    }))}
                    disabled={!isEditing}
                    className={isEditing ? styles.input : styles.disabledInput}
                  />
                </div>
                <div className={styles.labelContainer}>
                  <div className={styles.subLabel}>S.2</div>
                  <input
                    value={editedConfig[mpptKey]?.s2 || ''}
                    onChange={(e) => setEditedConfig((prev) => ({
                      ...prev,
                      [mpptKey]: { ...(prev[mpptKey] || {}), s2: e.target.value }
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
