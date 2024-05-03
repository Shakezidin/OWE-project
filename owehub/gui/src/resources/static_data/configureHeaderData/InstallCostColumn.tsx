import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const InstallCostColumns: Column[] = [
  { name: "uniqueid", displayName: "uniqueId", type: "string",isCheckbox:true },
    { name: "cost", displayName: "Cost", type: "string",isCheckbox:false },
    { name: "start", displayName: "Start", type: "date",isCheckbox:false },
    { name: "end", displayName: "End", type: "date",isCheckbox:false },
   
    
  ];