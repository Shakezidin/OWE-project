import { IoAddSharp } from "react-icons/io5";
import Select from "react-select";
import '../../create_profile/CreateUserProfile.css'
// import "../commissionRate/Filter.css";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { useEffect, useState } from "react";
import { fetchDealerTier } from "../../../../redux/apiSlice/configSlice/config_get_slice/dealerTierSlice";
import { useAppDispatch } from "../../../../redux/hooks";
import { fetchCommissions } from "../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice";
import { ICONS } from "../../../icons/Icons";
interface columnHeader{
Partner:string,
Installer:string,

}
interface Column {
  name: string;
  displayName: string;
  type: string;
}
interface TableProps {
  handleClose: () => void,
   columns: Column[],
   page_number:number,
   page_size:number
}
interface FilterModel{
  Column: string, Operation: string, Data: string
}
interface Option {
  value: string;
  label: string;
}
const operations = [
  { value: '=', label: 'Equals' },
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: 'contains', label: 'Contains' }
];
// Filter component
const FilterCommission: React.FC<TableProps>=({handleClose,columns,page_number,page_size}) => {
    const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<FilterModel[]>([
    { Column:"", Operation:"",Data:""}
  ]);
  const options: Option[] = columns.map((column) => ({
    value: column.name,
    label:column.displayName
  }));
  
  const handleAddRow = () => {
    setFilters([...filters, { Column: '', Operation: '', Data: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };
 
 
  const handleChange = (index: number, field: keyof FilterModel, value: any) => {
    const newRules = [...filters];
    newRules[index][field] = value;
    setFilters(newRules);
  };
  const getOperationsForColumnType = (columnType: string) => {
    if (columnType === 'string') {
      return [
        { value: '=', label: 'Equals' },
        { value: 'contains', label: 'Contains' }
      ];
    } else if (columnType === 'number') {
      return [
        { value: '=', label: 'Equals' },
        { value: '<', label: 'Less Than' },
        { value: '>', label: 'Greater Than' }
      ];
    }
    return [];
  };
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
    dispatch(fetchCommissions(req));
    // handleClose()
    
  };
  return (

<div className="transparent-model">
<div className="filter-modal">
  <div className="createUserContainer">
    <div className="filter-section">
    <h3 className="createProfileText">Filter</h3>
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
    <div className="createProfileInputView">
      <div className="createProfileTextView">
      {filters?.map((filter, index) => (
        <div className="create-input-container" key={index}>
          <div className="create-input-field">
            <label className="inputLabel">Column Name</label>
            <div className="">
            <Select
           options={options}
            isSearchable
            value={options.find(option => option.value === filter.Column) || null}
            onChange={(selectedOption:any) => {
              handleChange(index, 'Column', selectedOption.value);
              handleChange(index, 'Operation', '');
              handleChange(index, 'Data', '');
            }}
            
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                marginTop: "4.5px",
                borderRadius: "8px",
                outline: "none",
                height: "2.8rem",
                border: "1px solid #d0d5dd",
                overflowY: 'auto'
              }),
              
           
             
            }}
          />
            </div>
          </div>
          <div className="create-input-field">
            <label className="inputLabel">Operation</label>
            <div className="">
            <Select
             options={getOperationsForColumnType(columns.find(column => column.name === filter.Column)?.type || '')}
             value={{ value: filter.Operation, label: filter.Operation}}
             onChange={(selectedOption:any) => handleChange(index, 'Operation', selectedOption.value)}
            // placeholder="Select Operation"
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                marginTop: "4.5px",
                borderRadius: "8px",
                outline: "none",
                height: "2.8rem",
                border: "1px solid #d0d5dd",
                
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
               height:"200px"
                
              }),
            }}
          />
            </div>
          </div>

          <div className="create-input-field">
         
          {
            filter.Column==="start_date" || filter.Column==="end_date"?  <Input
            type={"date"}
            label="Value"
            name="Data"
            value={"2024-04-04"}
            onChange={(e) => {
              const updatedFilters = [...filters];
              updatedFilters[index].Data = e.target.value;
              setFilters(updatedFilters);
            }}
            placeholder={"Enter"}
          
          />: <Input
          type={"text"}
          label="Data"
          name="Data"
          value={filter.Data}
          onChange={(e) => {
            const updatedFilters = [...filters];
            updatedFilters[index].Data = e.target.value;
            setFilters(updatedFilters);
          }}
          placeholder={"Enter"}
        
        />
          }
          
          </div>
          <div className="cross-btn"  onClick={()=>handleRemoveRow(index)}>
            <img src={ICONS.cross} alt="" />
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
export default FilterCommission