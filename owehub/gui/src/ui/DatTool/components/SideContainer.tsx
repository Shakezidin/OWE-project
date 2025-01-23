import React, { useState } from 'react';
import { TbArrowsSort } from 'react-icons/tb';
import styles from '../styles/SideContainer.module.css'

interface Data {
  name: string;
  projectID: string;
  address: string;
}

const SideContainer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const data: Data = {
    name: 'KinderLand Learning Academy',
    projectID: 'OUR 13668',
    address: '11 Bonnabrook Dr, Hermitage, TN 37076, United States',
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <div className={styles.headingName}>Project List</div>
        <div>
          <TbArrowsSort size={18} />
        </div>
      </div>
      <div className={styles.searchBox}>
        <input 
          placeholder="Search by project ID." 
          type="text" 
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {Array.from({ length: 10 }).map((_, index) => (
      <div key={index} className={styles.dataBox}>
        <p className={styles.content_one}>{data.name}</p>
        <p className={styles.content_two}>{data.projectID}</p>
        <p className={styles.content_three}>{data.address}</p>
      </div>
    ))}
    </div>
  );
};

export default SideContainer;
