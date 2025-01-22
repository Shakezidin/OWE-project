import React, { useState } from 'react';
import SideContainer from '../components/SideContainer';
import { VscDebugRestart } from 'react-icons/vsc';
import styles from '../styles/StructuralPage.module.css';
import { AiOutlineEdit } from 'react-icons/ai';
import { IoMdAdd } from 'react-icons/io';
import Select from '../components/Select';
import DisplaySelect from '../components/DisplaySelect';

function StructuralPage() {
  const [selectedValue, setSelectedValue] = useState<string | number>(0); // Set the default value to 0 (Option 0)
  const [isEditable, setIsEditable] = useState(false);

  const options = [
    { value: 0, label: 'Select' },
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
    { value: 3, label: 'Option 3' },
  ];

  const handleSelectChange = (value: string | number) => {
    setSelectedValue(value);
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const renderSelectComponent = () => {
    if (isEditable) {
      return (
        <Select
          label="Structure"
          options={options}
          value={selectedValue}
          onChange={handleSelectChange}
        />
      );
    }
    return (
      <DisplaySelect
        label="Structure"
        value={options.find((opt) => opt.value === selectedValue)?.label || ''}
      />
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '18px' }}>
      <div>
        <SideContainer />
      </div>
      <div className={styles.container}>
        <div className={styles.titleContainer}></div>
        <div className={styles.flexContainer}>
          <div className={styles.boxOne}>
            <div className={styles.headingContainer}>
              <div>
                <p>Structural Info</p>
              </div>
              <div className={styles.headingIcon}>
                <div className={styles.wordContainer}>MP1</div>
                <div className={styles.iconContainer}>
                  <IoMdAdd />
                </div>
                <div
                  className={styles.iconContainer}
                  onClick={toggleEdit}
                  style={{ cursor: 'pointer' }}
                >
                  <AiOutlineEdit />
                </div>
              </div>
            </div>
            <div className={styles.leftWrapper}>
              <Select
                label="Structure"
                options={options}
                value={selectedValue}
                onChange={handleSelectChange}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridTemplateRows: 'repeat(3, auto)',
                  gap: '15px',
                }}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index}>{renderSelectComponent()}</div>
                ))}
              </div>
              {/* container 2 */}

              <div className={styles.pvContainer}>
                <p className={styles.selectedContent}>PV MOUNTING HARDWARE</p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gridTemplateRows: 'repeat(3, auto)',
                    gap: '15px',
                  }}
                >
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index}>{renderSelectComponent()}</div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridTemplateRows: 'repeat(3, auto)',
                  gap: '15px',
                }}
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index}>{renderSelectComponent()}</div>
                ))}
              </div>
            </div>
            <div className={styles.endContainerWrapper}>
              <div
                className={styles.endContainerOne}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridTemplateRows: 'repeat(3, auto)',
                  gap: '30px',
                }}
              >
                <div style={{ borderRight: '1px solid #ccc' }}>
                  <p className={styles.selectedContent}>Quantity</p>{' '}
                  <p className={styles.selectedLabel}>25</p>
                </div>
                <div>
                  <p className={styles.selectedContent}>Azim</p>{' '}
                  <p className={styles.selectedLabel}>345</p>
                </div>
                <div style={{ borderRight: '1px solid #ccc' }}>
                  <p className={styles.selectedContent}>pitch</p>{' '}
                  <p className={styles.selectedLabel}>23</p>
                </div>
                <div>
                  <p className={styles.selectedContent}>TSRF</p>{' '}
                  <p className={styles.selectedLabel}>124</p>
                </div>
                <div style={{ borderRight: '1px solid #ccc' }}>
                  <p className={styles.selectedContent}>Area (sqft)</p>{' '}
                  <p className={styles.selectedLabel}>1500sqft</p>
                </div>
                <div>
                  <p className={styles.selectedContent}>kW DC</p>{' '}
                  <p className={styles.selectedLabel}>24</p>
                </div>
              </div>
              <div className={styles.endContainertwo}>
                <p>Spacing</p>
                <div className={styles.endContainerWrapper}>
                <div >
                  <p className={styles.selectedContent}>P</p>
                  <p className={styles.selectedLabel}>48</p>
                </div>
                <div >
                  <p className={styles.selectedContent}>L</p>
                  <p className={styles.selectedLabel}>--</p>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.boxTwo}></div>
        </div>
      </div>
    </div>
  );
}

export default StructuralPage;
