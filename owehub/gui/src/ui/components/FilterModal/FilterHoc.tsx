import React from 'react';
import FilterModal from './FilterModal';
import './filterHoc.css';
interface Column {
  name: string;
  displayName: string;
  type: string;
}
interface TableProps {
  isOpen: boolean;
  handleClose: () => void;
  columns: Column[];
  page_number: number;
  page_size: number;
  fetchFunction: (req: any) => void;
}
const FilterHoc = ({ isOpen = false, ...rest }: TableProps) => {
  console.log(isOpen,"open state");
  
  return (
    <div className={`filter-modal ${isOpen ? 'modal-open' : 'modal-close'} `}>
      <FilterModal {...rest} />
    </div>
  );
};

export default FilterHoc;
