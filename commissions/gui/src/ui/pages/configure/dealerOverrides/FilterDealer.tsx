import { IoAddSharp } from "react-icons/io5";
import Select,{ ActionMeta, OnChangeValue, StylesConfig} from "react-select";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { useEffect, useState } from "react";

interface TableProps {
  handleClose: () => void,
   columns: string[],
   page_number:number,
   page_size:number
}
interface FilterModel{
  Column: string, Operation: string, Data: string
}
// Filter component
const FilterDealer: React.FC<TableProps>=({handleClose,columns,page_number,page_size}) => {
  const [filters, setFilters] = useState<FilterModel[]>([
    { Column: columns.length > 0 ? columns[0]:"", Operation:"",Data:""}
  ]);

  const applyFilter = async () => {
    const formattedFilters = filters.map(filter => ({
      Column: filter.Column,
      Operation: filter.Operation,
      Data: filter.Data
    }));
    const req={
      page_number:page_number,
      page_size:page_size,
      filters:formattedFilters
    }
    console.log(req)
  };
  const handleAddRow = () => {
    setFilters([...filters, { Column: '', Operation: '', Data: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };
  const handleOperationChange = (selectedOption: any, index: number) => {
    const updatedFilters = [...filters];
    updatedFilters[index].Operation = selectedOption?.value || '';
    setFilters(updatedFilters);
  };
  const handleColumnChange = (selectedOption: any, index: number) => {
    const updatedFilters = [...filters];
    updatedFilters[index].Column = selectedOption?.value || '';
    setFilters(updatedFilters);
  };
  useEffect(() => {
    if (filters.length > 0) {
      const updatedFilters = [...filters];
      updatedFilters[0].Operation = 'equals';
      setFilters(updatedFilters);
    }
  }, []);
 
  return (

<div className="transparent-model">
<div className="filter-modal">
  <div className="createUserContainer">
    <div className="filter-section">
    <h3 className="createProfileText">Filter</h3>
      <div className="iconsSection2">
      <div className="iconsSection2">
          <button
            type="button"
            style={{
              color: "black",
              border: "1px solid #ACACAC",
             
            }}
            onClick={handleAddRow}
          >
            <IoAddSharp /> Add New
          </button>
        </div>
      
      </div>
    </div>
    <div className="createProfileInputView">
      <div className="createProfileTextView">
      {filters?.map((filter, index) => (
        <div className="create-input-container" key={index}>
          <div className="create-input-field">
            <label className="inputLabel">Column Name</label>
            <div className="">
            <Select
            options={columns?.map((col) => ({ value: col, label: col }))}
            value={{ value: filter?.Column, label: filter.Column }}
            onChange={(selectedOption) => handleColumnChange(selectedOption, index)}
            placeholder="Select Column"
         
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                marginTop: "4.5px",
                borderRadius: "8px",
                outline: "none",
                height: "2.8rem",
                border: "1px solid #d0d5dd",
                
              }),
            }}
      //       className="basic-multi-select"
      // classNamePrefix="select"
          />
            </div>
          </div>
          <div className="create-input-field">
            <label className="inputLabel">Operation</label>
            <div className="">
            <Select
            options={[
              { value: '=', label: 'Equals' },
              { value: 'contains', label: 'Contains' },
              { value: '>', label: 'Greater Than' },
              { value: '<', label: 'Less Than' },
            ]}
            value={{ value: filter.Operation, label: filter.Operation }}
            onChange={(selectedOption) => handleOperationChange(selectedOption, index)}
            placeholder="Select Operation"
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                marginTop: "4.5px",
                borderRadius: "8px",
                outline: "none",
                height: "2.8rem",
                border: "1px solid #d0d5dd",
              }),
            }}
          />
            </div>
          </div>

          <div className="create-input-field">
            <Input
              type={"text"}
              label="Value"
         
              name=""
            
              value={filter.Data}
              onChange={(e) => {
                const updatedFilters = [...filters];
                updatedFilters[index].Data = e.target.value;
                setFilters(updatedFilters);
              }}
              placeholder={"Enter"}
            
            />
          </div>
          <div className="cross-btn">
            <button type="button" onClick={()=>handleRemoveRow(index)}>X</button>
          </div>
        </div>
      ))}
      </div>
    </div>
    <div className="createUserActionButton" style={{ gap: "2rem" }}>
      <ActionButton title={"Apply"} type="submit" onClick={() =>applyFilter()} />

      <ActionButton
        title={"cancel"}
        type="reset"
        onClick={handleClose}
      />
    </div>
  </div>
</div>
</div>
  );
};
export default FilterDealer