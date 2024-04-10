import { IoAddSharp } from "react-icons/io5";
import Select from "react-select";
import '../../create_profile/CreateUserProfile.css'
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { useEffect, useState } from "react";
import { fetchDealerTier } from "../../../../redux/apiSlice/configSlice/config_get_slice/dealerTierSlice";
import { useAppDispatch } from "../../../../redux/hooks";
interface columnHeader{
Partner:string,
Installer:string,

}
interface TableProps {
  handleClose: () => void,
   columns: string[],
   page_number:number,
   page_size:number
}
interface Option {
  value: string;
  label: string;
}
interface FilterModel{
  Column: string, Operation: string, Data: string
}
const operations = [
  { value: '=', label: 'Equals' },
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: 'contains', label: 'Contains' }
];
// Filter component
const FilterDealerTier: React.FC<TableProps>=({handleClose,columns,page_number,page_size}) => {
    const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<FilterModel[]>([
    { Column: columns.length > 0 ? columns[1]:"", Operation:"",Data:""}
  ]);

const options: Option[] = columns.map((column: string) => ({
  value: column,
  label: column === 'dealer_name' ? 'Dealer Name' : column.replace(/_/g, ' ').toUpperCase()
}));


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
    dispatch(fetchDealerTier(req));
    handleClose()
    
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
 
  const handleColumnChange = (selectedOption: Option | null, index: number) => {
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
      {filters.map((filter, index) => (
        <div className="create-input-container" key={index}>
          <div className="create-input-field">
            <label className="inputLabel">Column Name</label>
            <div className="">
            <Select
            options={options}
            value={options.find(option => option.value === filter.Column) || null}
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
                overflowY: 'auto'
              }),
              menu: provided => ({
                ...provided,
                maxHeight: '200px', // Set a max height for the dropdown menu
                overflowY: 'auto' // Enable vertical scrolling
              })
            }}
          />
            </div>
          </div>
          <div className="create-input-field">
            <label className="inputLabel">Operation</label>
            <div className="">
            <Select
            options={operations}
            value={operations.find(option => option.value === filter.Operation) || null}
            onChange={(selectedOption) => handleOperationChange(selectedOption, index)}
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
            }}
          />
            </div>
          </div>

          <div className="create-input-field">
         
          {
            filter.Column==="start_date" && "end_date"?  <Input
            type={"date"}
            label="Value"
            name=""
            value={filter.Data}
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
export default FilterDealerTier