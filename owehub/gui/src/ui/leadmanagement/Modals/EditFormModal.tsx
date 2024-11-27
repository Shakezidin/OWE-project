import { useEffect, useState } from "react";
import classes from "../styles/profile.module.css"
import CrossIcon from '../Modals/Modalimages/crossIcon.png';
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { postCaller } from "../../../infrastructure/web_api/services/apiUrl";
import { toast } from "react-toastify";
import MicroLoader from "../../components/loader/MicroLoader";
import DataNotFound from "../../components/loader/DataNotFound";
import { format, parseISO } from "date-fns";
import { Tooltip } from "react-tooltip";
import { } from "date-fns-tz";
import { useLocation } from 'react-router-dom';
import LeadManagementNew from "../LeadManagementNew";
import FormModal from "./FormModal";

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
    qc_audit: boolean;
    proposal_pdf_url: string;
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
    proposal_created_date: string | null;
    sales_rep_name: string | null;
    lead_source: string | null;
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
    const location = useLocation();
    const showDownloadProposal = location.pathname.includes('leadmng-records');

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

    useEffect(() => {
        const handleEscapeKey = (event: any) => {
            if (event.key === 'Escape') {
                onClose1();
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);


    return <div>
        {isOpen1 && <div className="transparent-model">
            <div className={classes.customer_wrapper_list_mob_inner}>
                <div className={`   ${classes.customer_wrapper_list} `}>
                <div className={classes.btnContainerNew}>
                        <span className={classes.XR} onClick={RedirectMainDashboard}>Edit Lead</span>
                        <span className={classes.crossIconImg}> <img src={CrossIcon} onClick={CloseModalhandler} /></span></div>

                  <FormModal/>
                    
                  
                </div>
            </div>
        </div>
        }
    </div>
}
export default Profile;
