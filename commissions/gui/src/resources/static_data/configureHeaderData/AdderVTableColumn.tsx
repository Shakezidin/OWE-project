import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const AdderVColumns: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },
    { name: "adder_name", displayName: "Adder Name", type: "string" },
    { name: "adder_type", displayName: "Adder Type", type: "string" },
    { name: "description", displayName: "Description", type: "string" },
    { name: "price_amount", displayName: "Price Amount", type: "string" },
    { name: "price_type", displayName: "Price Type", type: "string" },
  ];