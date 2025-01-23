import React from 'react';
import styles from '../styles/StructuralPage.module.css'

interface DisplaySelectProps {
  label: string;
  value: string | number;
}

const DisplaySelect: React.FC<DisplaySelectProps> = ({ label, value }) => {
  const containerStyles = {
    padding: '6px 12px',
    borderRadius: '50px',
    backgroundColor: 'transparent', // No background color
    color: '#333',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    minHeight: '36px',
    fontWeight: '400'
  };

  const valueStyles = {
    flex: 1,
  };

  return (
    <div className={styles.selectedContainer}>
      <div className={styles.selectedLabel}>{label}</div>
      <div className={styles.selectedContent}>{value}</div>
    </div>
  );
};

export default DisplaySelect;
