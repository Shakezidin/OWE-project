import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const RepPaySettingsColumns: Column[] = [
   
    { name: "name", displayName: "Name", type: "string",isCheckbox:true },
    { name: "state", displayName: "State", type: "string",isCheckbox:false },
    { name: "pay_scale", displayName: "Pay Scale", type: "string",isCheckbox:false },
    { name: "position", displayName: "Position", type: "string",isCheckbox:false },
    { name: "b_e", displayName: "BE", type: "string",isCheckbox:false },
    { name: "start", displayName: "Start", type: "date",isCheckbox:false },
    { name: "end", displayName: "End", type: "date",isCheckbox:false }
  ];