import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const AutoAdderColumn: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },
    { name: "type", displayName: "Type", type: "string" ,isCheckbox:true},
    { name: "gc", displayName: "GC", type: "string" ,isCheckbox:false},
    { name: "exact", displayName: "Exact", type: "string" ,isCheckbox:false},
    { name: "per_kw_amt", displayName: "Per KW Amt", type: "string" ,isCheckbox:false},
    { name: "rep", displayName: "REP $ / %", type: "string" ,isCheckbox:false},
    { name: "description", displayName: "Description", type: "string" ,isCheckbox:false},
    { name: "notes", displayName: "Notes", type: "string" ,isCheckbox:false}, 
    { name: "type", displayName: "Type", type: "string" ,isCheckbox:false},
    { name: "rep_1", displayName: "Rep1", type: "string" ,isCheckbox:false},
     { name: "rep_2", displayName: "Rep2", type: "string" ,isCheckbox:false},
    { name: "sys_size", displayName: "Sys Size", type: "string" ,isCheckbox:false},
    { name: "state", displayName: "State", type: "string" ,isCheckbox:false},
    { name: "rep_count", displayName: "Rep Count", type: "string" ,isCheckbox:false},
    { name: "per_rep_addr", displayName: "Per Rep Addr", type: "string" ,isCheckbox:false},
    { name: "per_rep_ovrd", displayName: "Per Rep Ovrd", type: "string" ,isCheckbox:false},
    { name: "share", displayName: "Share", type: "string" ,isCheckbox:false},
    { name: "r1_pay_scale", displayName: "R1 Pay Scale", type: "string" ,isCheckbox:false},
    { name: "rep1_def_resp", displayName: "Rep 1 Def Resp", type: "string" ,isCheckbox:false},
    { name: "r1_addr_resp", displayName: "R1 Addr Resp", type: "string" ,isCheckbox:false},
    { name: "r2_pay_scale", displayName: "R2 Pay Scale", type: "string" ,isCheckbox:false},
    { name: "rep2_def_resp", displayName: "Rep 2 Def Resp", type: "string" ,isCheckbox:false},
    { name: "r2_addr_resp", displayName: "R2 Addr Resp", type: "string" ,isCheckbox:false},
    { name: "contract_amount", displayName: "Contract Amount", type: "number" ,isCheckbox:false},
    { name: "project_base", displayName: "Project Base", type: "string" ,isCheckbox:false},
    { name: "cr1_addr", displayName: "CR1 ADDR", type: "string" ,isCheckbox:false},
    { name: "r1_loan_fee", displayName: "R1 Loan Fee", type: "string" ,isCheckbox:false},
    { name: "r1_rebate", displayName: "R1 Rebate", type: "string" ,isCheckbox:false},
    { name: "r1_referral", displayName: "R1 Referral", type: "string" ,isCheckbox:false},
    { name: "r1_r+r", displayName: "R1 R+R", type: "string" ,isCheckbox:false},
    { name: "total_comm", displayName: "Total Comm", type: "string" ,isCheckbox:false},

    { name: "start_date", displayName: "Start Date", type: "date" ,isCheckbox:false},
    { name: "end_date", displayName: "End Date", type: "date",isCheckbox:false }

  ];

















  