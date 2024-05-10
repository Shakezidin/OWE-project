import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const InstallCostColumns: Column[] = [
    { name: "cost", displayName: "Cost", type: "string",isCheckbox:true },
    { name: "start", displayName: "Start", type: "date",isCheckbox:false },
    { name: "end", displayName: "End", type: "date",isCheckbox:false },
   
    
  ];