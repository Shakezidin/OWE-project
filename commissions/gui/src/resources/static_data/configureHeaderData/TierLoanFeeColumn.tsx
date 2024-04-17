import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const TierLoanColumn: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },

    { name: "dealer_tier", displayName: "Dealer Tier", type: "string" },
    { name: "installer", displayName: "Installer", type: "string" },
    { name: "state", displayName: "State", type: "string" },
    { name: "finance_type", displayName: "Finance Type", type: "string" },
    { name: "owe_cost", displayName: "OWE Cost", type: "string" },
    { name: "dlr_mu", displayName: "DLR MU", type: "string" },
    { name: "dlr_cost", displayName: "DLR Cost", type: "string" },
    { name: "start_date", displayName: "Start Date", type: "date" },
    { name: "end_date", displayName: "End Date", type: "date" }
  ];