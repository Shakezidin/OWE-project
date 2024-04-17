import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

interface SortableHeaderProps {
    titleName: string;
    sortKey: string;
  

    sortDirection?: 'asc' | 'desc';
    onClick: (key: string) => void;
  }
  
  const SortableHeader: React.FC<SortableHeaderProps> = ({ titleName, sortKey, sortDirection, onClick }) => {
    const handleClick = () => {
      onClick(sortKey);
    };
  
    return (
      <th onClick={handleClick}>
         <div className="table-header" >
                    <p>{titleName}</p> {sortDirection !== 'desc' ? <FaArrowDown style={{ color: "#667085", fontSize:"12px"}} /> : <FaArrowUp style={{ color: "#667085",fontSize:"12px" }} />}
                  </div>
      </th>
    );
  };
export default SortableHeader  