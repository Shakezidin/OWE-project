import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const DealerTableData: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },
    { name: "sub_dealer", displayName: "Sub Dealer", type: "string" },
    { name: "dealer", displayName: "Dealer", type: "string" },
    { name: "pay_rate", displayName: "Pay Rate", type: "string" },
    { name: "start_date", displayName: "Start Date", type: "date" },
    { name: "end_date", displayName: "End Date", type: "date" }
  ];