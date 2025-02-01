import React, { useState } from 'react';
import { TbArrowsSort } from 'react-icons/tb';
import styles from '../styles/SideContainer.module.css'

interface Data {
  name: string;
  projectID: string;
  address: string;
}
interface SideContainerProps {

  data: any[];

}

const SideContainer: React.FC<SideContainerProps> = ({data}:any) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortAscending, setSortAscending] = useState<boolean>(true);

  console.log(data, "myData");
  const mappedDataList = data.map((apiItem:any) => ({
    name: apiItem.project_name.trim() || 'Unnamed Project', // You can provide a default name if it's empty
    projectID: apiItem.project_id.trim() || 'No ID Provided', // Default ID if empty
    address: apiItem.project_address.trim() || 'No Address Provided', // Default address if empty
  }));
  console.log(mappedDataList, "mappedDataList");
  // Sample data
  const dataList: Data[] = [
    { name: 'KinderLand Learning Academy', projectID: 'OUR 13668', address: '11 Bonnabrook Dr, Hermitage, TN 37076, United States' },
    { name: 'GreenTech Innovations', projectID: 'OUR 13669', address: '23 Green Valley, Nashville, TN 37080, United States' },
    { name: 'Bright Future Academy', projectID: 'OUR 13670', address: '45 Future Blvd, Hermitage, TN 37076, United States' },
    { name: 'KinderLand Learning Academy', projectID: 'OUR 13668', address: '11 Bonnabrook Dr, Hermitage, TN 37076, United States' },
    { name: 'GreenTech Innovations', projectID: 'OUR 13669', address: '23 Green Valley, Nashville, TN 37080, United States' },
    { name: 'Bright Future Academy', projectID: 'OUR 13670', address: '45 Future Blvd, Hermitage, TN 37076, United States' },
    { name: 'KinderLand Learning Academy', projectID: 'OUR 13668', address: '11 Bonnabrook Dr, Hermitage, TN 37076, United States' },
    { name: 'GreenTech Innovations', projectID: 'OUR 13669', address: '23 Green Valley, Nashville, TN 37080, United States' },
    { name: 'Bright Future Academy', projectID: 'OUR 13670', address: '45 Future Blvd, Hermitage, TN 37076, United States' },
    { name: 'KinderLand Learning Academy', projectID: 'OUR 13668', address: '11 Bonnabrook Dr, Hermitage, TN 37076, United States' },
    { name: 'GreenTech Innovations', projectID: 'OUR 13669', address: '23 Green Valley, Nashville, TN 37080, United States' },
    { name: 'Bright Future Academy', projectID: 'OUR 13670', address: '45 Future Blvd, Hermitage, TN 37076, United States' },
  ];

 

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortAscending(!sortAscending);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
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
      </div>
      <div className={styles.wrapperBox}>
      <div className={styles.dataBoxWrapper}>
      {mappedDataList.map((data:any, index:any) => (
        <div key={index} className={styles.dataBox}>
          <p className={styles.content_one}>{data.name}</p>
          <p className={styles.content_two}>{data.projectID}</p>
          <p className={styles.content_three}>{data.address}</p>
        </div>
      ))}
      </div>
      </div>
    </div>
  );
};

export default SideContainer;
