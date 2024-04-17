import { Column } from "../../../core/models/data_models/FilterSelectModel";

export const PayScheduleColumns: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },

    { name: "partner", displayName: "Partner", type: "string" },
    { name: "partner_name", displayName: "Partner Name", type: "string" },
    { name: "installer_name", displayName: "Installer Name", type: "string" },
    { name: "sale_type", displayName: "Partner", type: "string" },
    { name: "state", displayName: "State", type: "string" },
    { name: "rl", displayName: "Rate List", type: "string" },
    { name: "draw", displayName: "Draw", type: "string" },
    { name: "draw_max", displayName: "Draw Max", type: "string" },
    { name: "rep_draw", displayName: "rep_draw", type: "string" },
    { name: "rep_draw_max", displayName: "rep_draw_max", type: "string" },
    { name: "rep_pay", displayName: "rep_pay", type: "string" },
    { name: "start_date", displayName: "Start Date", type: "date" },
    { name: "end_date", displayName: "End Date", type: "date" }
  ];