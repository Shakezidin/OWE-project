import React, { useState } from 'react';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import styles from '../../styles/ExistingPVSystemInfo.module.css';
import { useAppDispatch } from '../../../../redux/hooks';
import { toast } from 'react-toastify';
import { updateDatTool } from '../../../../redux/apiActions/DatToolAction/datToolAction';

interface ExistingPVSystemInfoProps {
  fields: {
    'Module Quantity': string;
    'Model#': string;
    'Wattage': string;
    'Module Area': string;
    'Inverter 1 Quantity': string;
    'Inverter 1 Model#': string;
    'Inverter 1 Output(A)': string;
    'Inverter 2 Quantity': string;
    'Inverter 2 Model#': string;
    'Inverter 2 Output(A)': string;
    'Backfeed': string;
  };
  onSave: (fields: ExistingPVSystemInfoProps['fields']) => void;
  currentGeneralId: string;
}

const ExistingPVSystemInfo: React.FC<ExistingPVSystemInfoProps> = ({ fields, onSave, currentGeneralId }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState(fields);
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());

  const handleFieldChange = (field: keyof typeof fields, value: string) => {
    setEditedFields(prev => ({ ...prev, [field]: value }));
    setModifiedFields(prev => new Set(prev).add(field));
  };

  const createPayload = () => {
    const payload: any = {
      project_id: currentGeneralId,
      existing_pv_system_info: {}
    };

    // Helper function to convert field names to API format
    const getApiFieldName = (field: string) => {
      const mapping: { [key: string]: string } = {
        'Module Quantity': 'module_quantity',
        'Model#': 'model_number',
        'Wattage': 'wattage',
        'Module Area': 'module_area',
        'Inverter 1 Quantity': 'inverter1.quantity',
        'Inverter 1 Model#': 'inverter1.model_number',
        'Inverter 1 Output(A)': 'inverter1.output_a',
        'Inverter 2 Quantity': 'inverter2.quantity',
        'Inverter 2 Model#': 'inverter2.model_number',
        'Inverter 2 Output(A)': 'inverter2.output_a',
        'Backfeed': 'existing_calculated_backfeed_without_125'
      };
      return mapping[field];
    };

    // Helper function to set nested object value
    const setNestedValue = (obj: any, path: string, value: string | number) => {
      const parts = path.split('.');
      if (parts.length === 1) {
        obj[parts[0]] = value;
      } else {
        const [first, ...rest] = parts;
        obj[first] = obj[first] || {};
        setNestedValue(obj[first], rest.join('.'), value);
      }
    };

    modifiedFields.forEach(field => {
      const apiField = getApiFieldName(field);
      if (apiField) {
        const rawValue = editedFields[field as keyof typeof fields];
        
        // Convert numeric fields to numbers, keep others as strings
        let processedValue: string | number = rawValue;
        if (['Module Quantity', 'Inverter 1 Quantity', 'Inverter 2 Quantity', 'Backfeed'].includes(field)) {
          processedValue = parseInt(rawValue) || 0;
        }

        setNestedValue(payload.existing_pv_system_info, apiField, processedValue);
      }
    });

    return payload;
  };

  const handleSave = async () => {
    if (modifiedFields.size === 0) {
      setIsEditing(false);
      return;
    }

    try {
      const payload = createPayload();
      await dispatch(updateDatTool(payload)).unwrap();
      onSave(editedFields);
      setIsEditing(false);
      setModifiedFields(new Set());
      // toast.success('Existing PV System Info updated successfully');
    } catch (error) {
      console.error('Error updating Existing PV System Info:', error);
      // toast.error('Failed to update Existing PV System Info');
    }
  };

  // Rest of the component remains the same...
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>Existing PV System Info</h3>
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
        <div className={styles.field}>
          <label className={styles.label}>Module Quantity</label>
          {isEditing ? (
            <input
              value={editedFields['Module Quantity']}
              onChange={(e) => handleFieldChange('Module Quantity', e.target.value)}
              className={styles.input}
            />
          ) : (
            <div className={styles.value}>{fields['Module Quantity']}</div>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Model#</label>
          {isEditing ? (
            <input
              value={editedFields['Model#']}
              onChange={(e) => handleFieldChange('Model#', e.target.value)}
              className={styles.input}
            />
          ) : (
            <div className={styles.value}>{fields['Model#']}</div>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Wattage</label>
          {isEditing ? (
            <input
              value={editedFields['Wattage']}
              onChange={(e) => handleFieldChange('Wattage', e.target.value)}
              className={styles.input}
            />
          ) : (
            <div className={styles.value}>{fields['Wattage']}</div>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Module Area</label>
          {isEditing ? (
            <input
              value={editedFields['Module Area']}
              onChange={(e) => handleFieldChange('Module Area', e.target.value)}
              className={styles.input}
            />
          ) : (
            <div className={styles.value}>{fields['Module Area']}</div>
          )}
        </div>
      </div>

      <div className={styles.inverterSection}>
        <div className={styles.inverterGroup}>
          <h4 className={styles.subheading}>Inverter 1</h4>
          <div className={styles.inverterGrid}>
            <div className={styles.labelContainer}>
              <label className={styles.label}>Quantity</label>
            {isEditing ? (
              <input
                  value={editedFields['Inverter 1 Quantity']}
                  onChange={(e) => handleFieldChange('Inverter 1 Quantity', e.target.value)}
                  className={styles.input}
              />
            ) : (
                <div className={styles.value}>{fields['Inverter 1 Quantity']}</div>
              )}
            </div>
            <div className={styles.labelContainer}>
              <label className={styles.label}>Model#</label>
              {isEditing ? (
                <input
                  value={editedFields['Inverter 1 Model#']}
                  onChange={(e) => handleFieldChange('Inverter 1 Model#', e.target.value)}
                  className={styles.input}
                />
              ) : (
                <div className={styles.value}>{fields['Inverter 1 Model#']}</div>
              )}
            </div>
            <div className={styles.labelContainer}>
              <label className={styles.label}>Output(A)</label>
              {isEditing ? (
                <input
                  value={editedFields['Inverter 1 Output(A)']}
                  onChange={(e) => handleFieldChange('Inverter 1 Output(A)', e.target.value)}
                  className={styles.input}
                />
              ) : (
                <div className={styles.value}>{fields['Inverter 1 Output(A)']}</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.inverterGroup}>
          <h4 className={styles.subheading}>Inverter 2</h4>
          <div className={styles.inverterGrid}>
          <div className={styles.labelContainer}>
              <label className={styles.label}>Quantity</label>
              {isEditing ? (
                <input
                  value={editedFields['Inverter 2 Quantity']}
                  onChange={(e) => handleFieldChange('Inverter 2 Quantity', e.target.value)}
                  className={styles.input}
                />
              ) : (
                <div className={styles.value}>{fields['Inverter 2 Quantity']}</div>
              )}
            </div>
            <div className={styles.labelContainer}>
              <label className={styles.label}>Model#</label>
              {isEditing ? (
                <input
                  value={editedFields['Inverter 2 Model#']}
                  onChange={(e) => handleFieldChange('Inverter 2 Model#', e.target.value)}
                  className={styles.input}
                />
              ) : (
                <div className={styles.value}>{fields['Inverter 2 Model#']}</div>
              )}
            </div>
            <div className={styles.labelContainer}>
              <label className={styles.label}>Output(A)</label>
              {isEditing ? (
                <input
                  value={editedFields['Inverter 2 Output(A)']}
                  onChange={(e) => handleFieldChange('Inverter 2 Output(A)', e.target.value)}
                  className={styles.input}
                />
              ) : (
                <div className={styles.value}>{fields['Inverter 2 Output(A)']}</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className={styles.label}>Existing Calculated Backfeed(w/o 125%)</label>
          <div className={styles.backfeedGrid}>
            <div className={styles.backfeedInput} >
              <label className={styles.label}>Backfeed</label>
              {isEditing ? (
                <input
                  value={editedFields['Backfeed']}
                  onChange={(e) => handleFieldChange('Backfeed', e.target.value)}
                  className={styles.input}
                />
              ) : (
                <div className={styles.value}>{fields['Backfeed'] || '---'}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExistingPVSystemInfo;
