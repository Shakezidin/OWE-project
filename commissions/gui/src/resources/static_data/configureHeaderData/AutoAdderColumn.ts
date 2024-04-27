import { Column } from "../../../core/models/data_models/FilterSelectModel";

export   const AutoAdderColumn: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },
    { name: "type", displayName: "Type", type: "string" ,isCheckbox:true},
    { name: "gc", displayName: "GC", type: "string" ,isCheckbox:false},
    { name: "exact", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false}, 
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
     { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},

    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
    { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},
     { name: "adder_name", displayName: "Adder Name", type: "string" ,isCheckbox:false},

  ];





//   <th style={{paddingRight:0}}>
//   <div>
//     <CheckBox
//       checked={selectAllChecked}
//       onChange={() =>
//         toggleAllRows(
//           selectedRows,
//           commissionList,
//           setSelectedRows,
//           setSelectAllChecked
//         )
//       }
//       indeterminate={isAnyRowSelected && !isAllRowsSelected}
//     />
//   </div>
// </th>
// <th style={{paddingLeft:"10px"}}>
//   <div className="table-header" >
//     <p>Type</p> <FaArrowDown style={{color: "#667085", fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>GC</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Exact Amt.</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Per KW Amt.</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>REP $ / %</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Description</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Notes</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Type</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Rep1</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Rep2</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Sys Size</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>State</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Rep Count</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Per Rep Addr</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Per Rep Ovrd</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Share</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>R1 Pay Scale</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Rep 1 Def Resp</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>R1 Addr Resp</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>R2 Pay Scale</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Rep 2 Def Resp</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>R1 Addr Resp</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Contract Amount</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Project Base</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>CR1 ADDR</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>R1 Loan Fee</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>R1 Rebate</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>R1 Referral </p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>R1 R+R</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Total Comm</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>Start Dt.</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>
// <th>
//   <div className="table-header">
//     <p>End Dt.</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
//   </div>
// </th>