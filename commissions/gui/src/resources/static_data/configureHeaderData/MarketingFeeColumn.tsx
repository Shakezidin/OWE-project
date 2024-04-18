import { Column } from "../../../core/models/data_models/FilterSelectModel";

export const MarketingFeesColumn: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },
    { name: "source", displayName: "Source", type: "string" },
    { name: "dba", displayName: "DBA", type: "string" },
    { name: "state", displayName: "State", type: "string" },
    { name: "fee_rate", displayName: "Fee Rate", type: "string" },
    { name: "chg_dlr", displayName: "Chg Dlr", type: "number" },
    { name: "pay_src", displayName: "Pay Src", type: "number" },
    { name: "description", displayName: "Description", type: "string" },
    { name: "start_date", displayName: "Start Date", type: "date" },
    { name: "end_date", displayName: "End Date", type: "date" }
  ];