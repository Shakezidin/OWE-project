import React from "react";
import classes from "../styles/profile.module.css"
const SignDocument=()=>{
    return <>
    <div className={classes.SignDocumentPage}>
    <table>
        <h3>DOCUMENT SIGN PAGE</h3><tbody>
    <tr>
    <td className={classes.leftAlign}>First Name</td>
    <td
       
        className={classes.rightAlign}>RABINDRA</td>
</tr>
<tr>
    <td className={classes.leftAlign}>Last Name</td>
    <td
       
        className={classes.rightAlign}>SHARMA</td>
</tr>
<tr>
    <td className={classes.leftAlign}>Email Id</td>
    <td
       
        className={classes.rightAlign}>gmail.com</td>
</tr>
<tr>
    <td className={classes.leftAlign}>Phone Number</td>
    <td
        
        className={classes.rightAlign}>867983274897</td>
</tr></tbody></table></div></>
}
export default SignDocument;