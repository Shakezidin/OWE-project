import { Column } from "../../../core/models/data_models/FilterSelectModel";

export  const DealerTierColumn: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },

    { name: "dealer_name", displayName: "Dealer Name", type: "string" },
    { name: "tier", displayName: "Tier", type: "string" },
    { name: "start_date", displayName: "Start Date", type: "date" },
    { name: "end_date", displayName: "End Date", type: "date" }
  ];