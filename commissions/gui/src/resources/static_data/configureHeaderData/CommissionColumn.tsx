import { Column } from "../../../core/models/data_models/FilterSelectModel";

export const Commissioncolumns: Column[] = [
    { name: "partner", displayName: "Partner", type: "string" },
    { name: "installer", displayName: "Installer", type: "string" },
    { name: "state", displayName: "State", type: "string" },
    { name: "sale_type", displayName: "Sale Type", type: "string" },
    { name: "sale_price", displayName: "Sale Price", type: "number" },
    { name: "rep_type", displayName: "Rep Type", type: "string" },
    { name: "rl", displayName: "RL", type: "number" },
    { name: "rate", displayName: "Rate", type: "number" },
    { name: "start_date", displayName: "Start Date", type: "date" },
    { name: "end_date", displayName: "End Date", type: "date" }
  ];