import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const AdderDataColumn: Column[] = [
    
    { name: "uniqueID", displayName: "Unique Id", type: "string",isCheckbox:true },
    { name: "date", displayName: "Date", type: "string",isCheckbox:false },
    { name: "gc", displayName: "GC", type: "string",isCheckbox:false },
    { name: "exact-amount", displayName: "Exact Amt", type: "string",isCheckbox:false },
    { name: "Per Kw Amt", displayName: "Per Kw Amt", type: "string",isCheckbox:false },
    { name: "Rep", displayName: "Rep $ / %", type: "string",isCheckbox:false },   
    { name: "description", displayName: "Description", type: "string",isCheckbox:false },
    { name: "notes", displayName: "Notes", type: "string",isCheckbox:false },
    { name: "type", displayName: "Type ad mktg", type: "string",isCheckbox:false },
    { name: "sys-size", displayName: "Sys Size", type: "string",isCheckbox:false },
    { name: "adder-calc", displayName: "Adder Calc", type: "string",isCheckbox:false },
  ];