import React, { useState } from 'react';
import { AiOutlineEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

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
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.title}>Existing PV System Info</h3>
        {isEditing ? (
          <div style={styles.actions}>
            <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>
              <AiOutlineClose size={16} />
            </button>
            <button onClick={() => { onSave(editedFields); setIsEditing(false); }} style={styles.saveButton}>
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
        <div style={styles.field}>
          <label style={styles.label}>Module Quantity</label>
          {isEditing ? (
            <input
              value={editedFields['Module Quantity']}
              onChange={(e) => handleFieldChange('Module Quantity', e.target.value)}
              style={styles.input}
            />
          ) : (
            <div style={styles.value}>{fields['Module Quantity']}</div>
          )}
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Model#</label>
          {isEditing ? (
            <input
              value={editedFields['Model#']}
              onChange={(e) => handleFieldChange('Model#', e.target.value)}
              style={styles.input}
            />
          ) : (
            <div style={styles.value}>{fields['Model#']}</div>
          )}
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Wattage</label>
          {isEditing ? (
            <input
              value={editedFields['Wattage']}
              onChange={(e) => handleFieldChange('Wattage', e.target.value)}
              style={styles.input}
            />
          ) : (
            <div style={styles.value}>{fields['Wattage']}</div>
          )}
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Module Area</label>
          {isEditing ? (
            <input
              value={editedFields['Module Area']}
              onChange={(e) => handleFieldChange('Module Area', e.target.value)}
              style={styles.input}
            />
          ) : (
            <div style={styles.value}>{fields['Module Area']}</div>
          )}
        </div>
      </div>

      <div style={styles.inverterSection}>
        <div style={styles.inverterGroup}>
          <h4 style={styles.subheading}>Inverter 1</h4>
          <div style={styles.inverterGrid}>
            <div style={styles.labelContainer}>
              <label style={styles.label}>Quantity</label>
              {isEditing ? (
                <input
                  value={editedFields['Inverter 1 Quantity']}
                  onChange={(e) => handleFieldChange('Inverter 1 Quantity', e.target.value)}
                  style={styles.input}
                />
              ) : (
                <div style={styles.value}>{fields['Inverter 1 Quantity']}</div>
              )}
            </div>
            <div style={styles.labelContainer}>
              <label style={styles.label}>Model#</label>
              {isEditing ? (
                <input
                  value={editedFields['Inverter 1 Model#']}
                  onChange={(e) => handleFieldChange('Inverter 1 Model#', e.target.value)}
                  style={styles.input}
                />
              ) : (
                <div style={styles.value}>{fields['Inverter 1 Model#']}</div>
              )}
            </div>
            <div style={styles.labelContainer}>
              <label style={styles.label}>Output(A)</label>
              {isEditing ? (
                <input
                  value={editedFields['Inverter 1 Output(A)']}
                  onChange={(e) => handleFieldChange('Inverter 1 Output(A)', e.target.value)}
                  style={styles.input}
                />
              ) : (
                <div style={styles.value}>{fields['Inverter 1 Output(A)']}</div>
              )}
            </div>
          </div>
        </div>

        <div style={styles.inverterGroup}>
          <h4 style={styles.subheading}>Inverter 2</h4>
          <div style={styles.inverterGrid}>
          <div style={styles.labelContainer}>
              <label style={styles.label}>Quantity</label>
              {isEditing ? (
                <input
                  value={editedFields['Inverter 2 Quantity']}
                  onChange={(e) => handleFieldChange('Inverter 2 Quantity', e.target.value)}
                  style={styles.input}
                />
              ) : (
                <div style={styles.value}>{fields['Inverter 2 Quantity']}</div>
              )}
            </div>
            <div style={styles.labelContainer}>
              <label style={styles.label}>Model#</label>
              {isEditing ? (
                <input
                  value={editedFields['Inverter 2 Model#']}
                  onChange={(e) => handleFieldChange('Inverter 2 Model#', e.target.value)}
                  style={styles.input}
                />
              ) : (
                <div style={styles.value}>{fields['Inverter 2 Model#']}</div>
              )}
            </div>
            <div style={styles.labelContainer}>
              <label style={styles.label}>Output(A)</label>
              {isEditing ? (
                <input
                  value={editedFields['Inverter 2 Output(A)']}
                  onChange={(e) => handleFieldChange('Inverter 2 Output(A)', e.target.value)}
                  style={styles.input}
                />
              ) : (
                <div style={styles.value}>{fields['Inverter 2 Output(A)']}</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label style={styles.label}>Existing Calculated Backfeed(w/o 125%)</label>
          <div style={styles.backfeedGrid}>
            <div>
              <label style={styles.label}>Backfeed</label>
              {isEditing ? (
                <input
                  value={editedFields['Backfeed']}
                  onChange={(e) => handleFieldChange('Backfeed', e.target.value)}
                  style={styles.input}
                />
              ) : (
                <div style={styles.value}>{fields['Backfeed'] || '---'}</div>
              )}
            </div>
          </div>
        </div>
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
    gap: 5,
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
  },
  field: {
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#6b7280',
    // marginBottom: '6px',
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
  value: {
    // padding: '8px 0',
    fontSize: '12px',
    fontWeight: '550',
    color: '#1f2937',
  },
  inverterSection: {
    // marginTop: '24px',
  },
  inverterGroup: {
    marginBottom: '5px',
  },
  subheading: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '12px',
  },
  inverterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '5px 10px',
  },
  backfeedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
};

export default ExistingPVSystemInfo;