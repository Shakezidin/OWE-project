import React, { useState } from 'react';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import styles from '../../styles/ExistingPVSystemInfo.module.css';


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
  onSave: (fields: {
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
  }) => void;
}


const ExistingPVSystemInfo: React.FC<ExistingPVSystemInfoProps> = ({ fields, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState(fields);

  const handleFieldChange = (field: keyof typeof fields, value: string) => {
    setEditedFields(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>Existing PV System Info</h3>
        {isEditing ? (
          <div className={styles.actions}>
            <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
              <AiOutlineClose />
            </button>
            <button onClick={() => { onSave(editedFields); setIsEditing(false); }} className={styles.saveButton}>
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
            <div>
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
