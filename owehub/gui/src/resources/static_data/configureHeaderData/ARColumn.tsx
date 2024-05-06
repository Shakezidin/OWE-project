import { Column } from "../../../core/models/data_models/FilterSelectModel";

export const ARColumns: Column[] = [
  { name: "uniqueID", displayName: "UniqueID", type: "string",isCheckbox:true }, 
    { name: "customer_name", displayName: "Customer Name", type: "string",isCheckbox:false },
    { name: "Date", displayName: "Date", type: "string",isCheckbox:false },
    { name: "amount", displayName: "Amount", type: "string",isCheckbox:false },
    { name: "note", displayName: "Notes", type: "string",isCheckbox:false },
    
    
  ];