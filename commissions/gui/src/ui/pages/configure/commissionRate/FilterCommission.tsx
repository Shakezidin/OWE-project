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
import CustomAlert from "./CustomAlert";
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
interface ErrorState {
  [key: string]: string;
}
// Filter component
const FilterCommission: React.FC<TableProps>=({handleClose,columns,page_number,page_size}) => {
    const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<FilterModel[]>([
    { Column:"", Operation:"",Data:""}
  ]);
  const [errors, setErrors] = useState<ErrorState>({});
  const options: Option[] = columns.map((column) => ({
    value: column.name,
    label:column.displayName
  }));
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleAlertClose = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };
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
    const options = [];
    if (columnType === 'string') {
      options.push({ value: 'eqs', label: 'Equals To' });
      options.push({ value: 'stw', label: 'Start With' });
      options.push({ value: 'edw', label: 'End With' });
      options.push({ value: 'cont', label: 'Contains' });
    }
    if (columnType === 'number') {
      options.push({ value: 'eqs', label: 'Equals' });
      options.push({ value: 'grt', label: 'Greater Than' });
      options.push({ value: 'grteqs', label: 'Greater Than Equals To' });
      options.push({ value: 'lst', label: 'Less Than' });
      options.push({ value: 'lsteqs', label: 'Less Than Equals To' });
    }
   return options;
 
  };
  const getInputType = (columnName:string) => {
    if (columnName === 'rate' || columnName === 'rl') {
      return 'number';
    } else if (columnName === 'start_date' || columnName === 'end_date') {
      return 'date';
    } else {
      return 'text';
    }
  };


 
  const applyFilter = async () => {

setErrors({});

// Perform validation
const newErrors: ErrorState = {};

filters.forEach((filter, index) => {
  if (!filter.Operation) {
    newErrors[`operation${index}`] = `Please provide Operation Name for Row ${index + 1}`;
  }
  if (!filter.Data) {
    newErrors[`data${index}`] = `Please provide Data for Filter ${index + 1}`;
  }
});

// Update state with new errors
setErrors(newErrors);

// If no errors, proceed with API call
if (Object.keys(newErrors).length === 0) {
  const formattedFilters = filters.map(filter => ({
    Column: filter.Column,
    Operation: filter.Operation,
    Data: typeof filter.Data === 'string' ? parseInt(filter.Data, 10) : filter.Data,
  }));
  console.log(formattedFilters)
  const req={
    page_number:page_number,
    page_size:page_size,
    filters:formattedFilters
  }
  dispatch(fetchCommissions(req));
  handleClose()
}

}
 
 console.log(errors)
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
           options={[  { value: '', label: 'Select' },...options]}
            isSearchable
            value={options.find(option => option.value === filter.Column) || null}
            onChange={(selectedOption:any) => {
              handleChange(index, 'Column', selectedOption.value);
              setErrors({ ...errors, [`column${index}`]: '' });
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
             onChange={(selectedOption:any) => {handleChange(index, 'Operation', selectedOption.value);
             setErrors({ ...errors, [`operation${index}`]: '' });
             }}
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
              //  height:"200px"
                
              }),
            }}
          />
            {errors[`operation${index}`] && <span style={{color:"red",fontSize:"12px"}}>{errors[`operation${index}`]}</span>}
            </div>
          </div>

          <div className="create-input-field">
         
         <Input
           type={getInputType(filter.Column)}
          label="Data"
          name="Data"
          value={filter.Data}
          onChange={(e) => {
            const updatedFilters = [...filters];
            updatedFilters[index].Data = e.target.value;
            setFilters(updatedFilters);
            setErrors({ ...errors, [`data${index}`]: '' });
          }}
          placeholder={"Enter"}
        
        />
         {errors[`data${index}`] && <span style={ {color:"red",fontSize:"12px"}}>{errors[`data${index}`]}</span>}
          
          
          </div>
          <div className="cross-btn"  onClick={()=>handleRemoveRow(index)}>
            <img src={ICONS.cross} alt="" />
          </div>
        </div>
      ))}
      </div>
    </div>
    <div className="createUserActionButton" >
     <div className="" style={{ gap: "2rem",display:"flex",marginTop:"14rem"}}>
     <ActionButton title={"Apply"} type="submit" onClick={() =>applyFilter()} />

<ActionButton
  title={"cancel"}
  type="reset"
  onClick={handleClose}
/>
     </div>
    </div>
    {showAlert && <CustomAlert message={alertMessage} onClose={handleAlertClose} />}
  </div>
</div>
</div>
  );
};
export default FilterCommission