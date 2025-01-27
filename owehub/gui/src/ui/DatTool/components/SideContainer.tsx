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
  const [sortAscending, setSortAscending] = useState<boolean>(true);

  // Sample data - you can replace it with your actual data source
  const dataList: Data[] = [
    { name: 'KinderLand Learning Academy', projectID: 'OUR 13668', address: '11 Bonnabrook Dr, Hermitage, TN 37076, United States' },
    { name: 'GreenTech Innovations', projectID: 'OUR 13669', address: '23 Green Valley, Nashville, TN 37080, United States' },
    { name: 'Bright Future Academy', projectID: 'OUR 13670', address: '45 Future Blvd, Hermitage, TN 37076, United States' },
    // Add more data here
  ];

  // Handle search by projectID
  const filteredData = dataList.filter(item =>
    item.projectID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort data based on sortAscending state
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortAscending) {
      return a.projectID.localeCompare(b.projectID); // Ascending order
    } else {
      return b.projectID.localeCompare(a.projectID); // Descending order
    }
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortAscending(!sortAscending);
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <div className={styles.headingName}>Project List</div>
        <div onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
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
      {sortedData.map((data, index) => (
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
