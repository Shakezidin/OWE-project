import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const LoanFeeAdderColumns: Column[] = [
    { name: "uniqueID", displayName: "Unique ID", type: "string",isCheckbox:false },
    { name: "date", displayName: "Date", type: "string",isCheckbox:false },
    { name: "type", displayName: "Type", type: "string",isCheckbox:true },
    { name: "dealer", displayName: "Dealer", type: "string",isCheckbox:false },
    { name: "installer", displayName: "Installer", type: "string",isCheckbox:false },
    { name: "state", displayName: "State", type: "string",isCheckbox:false },
    { name: "contract", displayName: "Contract$$", type: "string",isCheckbox:false },
    { name: "dlr-tier", displayName: "Dlr Tier", type: "string",isCheckbox:false },
    { name: "owe-cost", displayName: "Owe Cost", type: "string",isCheckbox:false },
    { name: "addr-amt", displayName: "Addr Amt", type: "string",isCheckbox:false },
    { name: "per kW Amt", displayName: "Per Kw Amt", type: "string",isCheckbox:false },
    { name: "rep", displayName: "Rep $ / %", type: "string",isCheckbox:false },
    { name: "Description", displayName: "Per Kw Amt", type: "string",isCheckbox:false },
  ];