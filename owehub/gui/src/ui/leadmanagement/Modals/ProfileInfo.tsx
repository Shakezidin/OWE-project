import { useEffect, useState } from "react";
import classes from "../styles/profile.module.css"
import CrossIcon from '../Modals/Modalimages/crossIcon.png';
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { postCaller } from "../../../infrastructure/web_api/services/apiUrl";
import { toast } from "react-toastify";
import MicroLoader from "../../components/loader/MicroLoader";
import DataNotFound from "../../components/loader/DataNotFound";

interface EditModalProps {
    isOpen1: boolean;
    onClose1: () => void;
    leadId: number
}

interface LeadData {
    leads_id: number;
    first_name: string;
    last_name: string;
    email_id: string;
    phone_number: string;
    street_address: string;
    city: string;
    proposal_type: string;
    finance_type: string;
    finance_company: string;
    sale_submission_triggered: boolean;
    qc_audit: string;
    proposal_signed: boolean;
    appointment_disposition: string;
    appointment_accepted_date: string | null;
    appointment_date: string | null;
    appointment_declined_date: string | null;
    appointment_disposition_note: string;
    appointment_scheduled_date: string | null;
    created_at: string;
    created_by: string;
    lead_lost_date: string | null;
    lead_won_date: string | null;
    notes: string;
    status_id: number;
    updated_at: string;
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

    const [isAuthenticated, setAuthenticated] = useState(false);
    const { authData, saveAuthData } = useAuth();

    const [loading, setIsLoading] = useState(false);
    const [leadData, setLeadData] = useState<LeadData | null>(null);
    useEffect(() => {
        const isPasswordChangeRequired =
            authData?.isPasswordChangeRequired?.toString();
        setAuthenticated(isPasswordChangeRequired === 'false');
    }, [authData]);

    useEffect(() => {
        if (isAuthenticated && isOpen1) {
            const fetchData = async () => {
                try {
                    setIsLoading(true);
                    const response = await postCaller(
                        'get_lead_info',
                        {
                            leads_id: leadId,
                        },
                        true
                    );

                    if (response.status === 200) {
                        setLeadData(response.data);

                    } else if (response.status >= 201) {
                        toast.warn(response.data.message);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [isAuthenticated, leadId, isOpen1]);

    console.log(leadData, "ghfghfghf")
    return <div>
        {isOpen1 && <div className="transparent-model">
            <div className={classes.customer_wrapper_list}>
                <div className={classes.btnContainer}>
                    <span className={classes.XR} onClick={RedirectMainDashboard}>Lead Info</span>
                    <span className={classes.crossIconImg}> <img src={CrossIcon} onClick={CloseModalhandler} /></span></div>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <MicroLoader />
                    </div>
                ) : leadData ? (
                    <div className={classes.DetailsMcontainer}>
                        <div className={classes.Column1Details}>

                            <table>
                                <tbody>
                                    <tr>
                                        <td className={classes.leftAlign}>Leads Id</td>
                                        <td className={classes.rightAlign}>OWE{leadData?.leads_id}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>First Name</td>
                                        <td className={classes.rightAlign}>{leadData?.first_name}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Last Name</td>
                                        <td className={classes.rightAlign}>{leadData?.last_name}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Email Id</td>
                                        <td className={classes.rightAlign}>{leadData?.email_id}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Phone Number</td>
                                        <td className={classes.rightAlign}>{leadData?.phone_number}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Street Address</td>
                                        <td
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                overflowWrap: 'break-word',
                                                maxWidth: '200px',
                                                lineHeight:"16px"
                                            }}
                                            className={classes.rightAlign}
                                        >
                                            {leadData?.street_address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>City</td>
                                        <td className={classes.rightAlign}>{leadData?.city}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Proposal type</td>
                                        <td className={classes.rightAlign}>{leadData?.proposal_type}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Finance Type</td>
                                        <td className={classes.rightAlign}>{leadData?.finance_type}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Finance Company</td>
                                        <td className={classes.rightAlign}>{leadData?.finance_company}</td>
                                    </tr>



                                </tbody>
                            </table>
                        </div>
                        <div className={classes.Column2Details}>

                            <table>


                                <tbody>
                                    <tr>
                                        <td className={classes.leftAlign}>Sale Submission triggered</td>
                                        <td className={classes.rightAlign}>{leadData?.sale_submission_triggered ? 'Yes' : 'No'}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>QC Audit</td>
                                        <td className={classes.rightAlign}>{leadData?.qc_audit}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Proposal Signed</td>
                                        <td className={classes.rightAlign}>{leadData?.proposal_signed ? 'Yes' : 'No'}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Appointment Disposition</td>
                                        <td className={classes.rightAlign}>{leadData?.appointment_disposition}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Appointment Accepted Date</td>
                                        <td className={classes.rightAlign}>{leadData?.appointment_accepted_date || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Appointment Date</td>
                                        <td className={classes.rightAlign}>{leadData?.appointment_date || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Appointment Declined Date</td>
                                        <td className={classes.rightAlign}>{leadData?.appointment_declined_date || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Appointment Disposition Note</td>
                                        <td className={classes.rightAlign}>{leadData?.appointment_disposition_note || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className={classes.leftAlign}>Appointment Scheduled Date</td>
                                        <td className={classes.rightAlign}>{leadData?.appointment_scheduled_date || 'N/A'}</td>
                                    </tr>


                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <DataNotFound />
                    </div>
                )}
            </div>
        </div>
        }
    </div>
}
export default Profile;