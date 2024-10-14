import { useState } from "react";
import classes from "../styles/profile.module.css"
import CrossIcon from '../Modals/Modalimages/crossIcon.png';
import { useNavigate } from "react-router-dom";

interface EditModalProps {
    isOpen1: boolean;
    onClose1: () => void;
    leadId:number
}

const Profile: React.FC<EditModalProps> = ({
    isOpen1,
    onClose1,
    leadId
}) => {
    const navigate = useNavigate()
    const CloseModalhandler = () => {
        onClose1();
    }
    const RedirectMainDashboard = () => {
        navigate('/leadmng-dashboard')
    }
   console.log(leadId, "ghfghfghf")
    return <div>
        {isOpen1 && <div className="transparent-model">
            <div className={classes.customer_wrapper_list}>
                <div className={classes.btnContainer}>
                    <span className={classes.XR} onClick={RedirectMainDashboard}>Lead Info</span>
                    <span className={classes.crossIconImg}> <img src={CrossIcon} onClick={CloseModalhandler} /></span></div>
                <div className={classes.DetailsMcontainer}>
                    <div className={classes.Column1Details}>

                        <table>
                            <tbody>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>


                            </tbody>
                        </table>
                    </div>
                    <div className={classes.Column2Details}>

                        <table>


                            <tbody>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={classes.leftAlign}>Leads Id</td>
                                    <td className={classes.rightAlign}>OWE324</td>
                                </tr>
                                <tr>
                                    <td className={`${classes.rowHeight} ${classes.leftAlign}`}>Leads Id</td>
                                    <td className={`${classes.rowHeight} ${classes.rightAlign}`}>OWE324</td>
                                </tr>


                            </tbody>
                        </table>
                    </div>
                </div></div>
        </div>}
    </div>
}
export default Profile;