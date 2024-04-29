import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const RateAdjustmentsColumns: Column[] = [
    
    { name: "payscale", displayName: "PayScale", type: "string",isCheckbox:true },
    { name: "position", displayName: "Position", type: "string",isCheckbox:false },
    { name: "adjustment", displayName: "Adjustment", type: "string",isCheckbox:false },
    { name: "min_rate", displayName: "MIN Rate", type: "string",isCheckbox:false },
    { name: "max_rate", displayName: "Max Rate", type: "string",isCheckbox:false },
    
  ];