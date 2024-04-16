import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

interface SortableHeaderProps {
    label: string;
    sortKey: string;
    sortDirection?: 'asc' | 'desc';
    onClick: (key: string) => void;
  }
  
  const SortableHeader: React.FC<SortableHeaderProps> = ({ label, sortKey, sortDirection, onClick }) => {
    const handleClick = () => {
      onClick(sortKey);
    };
  
    return (
      <th onClick={handleClick}>
        {label}
        {sortDirection && (
            
          <>{sortDirection === 'asc' ? <FaArrowDown style={{ color: "#667085" }} /> : <FaArrowUp style={{ color: "#667085" }} />}</>
        )}
      </th>
    );
  };
export default SortableHeader  