import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const NonCommDlrColumn: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },
    { name: "customer", displayName: "Customer", type: "string" ,isCheckbox:true},
    { name: "dealer_code", displayName: "Dealer Code", type: "string" ,isCheckbox:false},
    { name: "dealer_dba", displayName: "Dealer DBA", type: "string" ,isCheckbox:false},
    { name: "exct_amt", displayName: "Exact Amt.", type: "string" ,isCheckbox:false},
    { name: "per_kw_amt", displayName: "Per kW Amt.", type: "string" ,isCheckbox:false},
    { name: "approved_by", displayName: "Approved By", type: "string" ,isCheckbox:false},
    { name: "notes", displayName: "Notes", type: "string" ,isCheckbox:false}, 
    { name: "total_amt", displayName: "Total Amt.", type: "string" ,isCheckbox:false},
    { name: "sys_size", displayName: "Sys Size", type: "string" ,isCheckbox:false},
    { name: "start_date", displayName: "Start Date", type: "date" ,isCheckbox:false},
    { name: "end_date", displayName: "End Date", type: "date",isCheckbox:false }

  ];
