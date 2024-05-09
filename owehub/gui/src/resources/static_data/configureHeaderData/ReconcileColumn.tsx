import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const ReconcileColumns: Column[] = [
    { name: "uniqueID", displayName: "Unique ID", type: "string",isCheckbox:true },
    { name: "customer_name", displayName: "Customer Name", type: "string",isCheckbox:false },
    { name: "partner", displayName: "Partner", type: "string",isCheckbox:false },
    { name: "st", displayName: "ST", type: "string",isCheckbox:false },
    { name: "sys.size", displayName: "Sys. Size", type: "string",isCheckbox:false },
    { name: "status", displayName: "Status", type: "string",isCheckbox:false },
    { name: "start_date", displayName: "Start Date", type: "string",isCheckbox:false },
    { name: "end_date", displayName: "End Date", type: "string",isCheckbox:false },
    { name: "amount", displayName: "Amount", type: "string",isCheckbox:false },
    { name: "note", displayName: "Notes", type: "string",isCheckbox:false },
    
  ];