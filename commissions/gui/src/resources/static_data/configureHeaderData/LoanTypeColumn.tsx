import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const LoanTypeColumns: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },

    { name: "product_code", displayName: "Product Code", type: "string" },
    {name:"active",displayName:"Active",type:"number"},
    { name: "adder", displayName: "Adder", type: "number" },
    { name: "description", displayName: "Description", type: "string" },

  ];