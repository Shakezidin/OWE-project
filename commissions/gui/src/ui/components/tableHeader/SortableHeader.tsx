import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import '../../pages/configure/configure.css'
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
                    <p>{titleName}</p> {sortDirection !== 'desc' ? <FaArrowDown className="arrow-icon-table" /> : <FaArrowUp className="arrow-icon-table" />}
                  </div>
      </th>
    );
  };
export default SortableHeader  