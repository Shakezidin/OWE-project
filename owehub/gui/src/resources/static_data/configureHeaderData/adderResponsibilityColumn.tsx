import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const AdderResponsibilityColumns: Column[] = [
    
    { name: "payscale", displayName: "Pay Scale", type: "string",isCheckbox:true },
    { name: "percentage", displayName: "Percentage", type: "string",isCheckbox:false },
       
  ];