import React, { useEffect, useState } from 'react';
import classes from '../styles/LeadManagementSucess.module.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import useAuth from '../../../hooks/useAuth';
import MicroLoader from '../../components/loader/MicroLoader';

interface EditModalProps {
  isArcOpen: boolean;
  onArcClose: () => void;
  leadId?: number;
  activeIndex: number;
  setActiveIndex: (value: number | ((prev: number) => number)) => void;
}

interface LeadData {
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
  street_address: string;
  status_id: number;
  created_at: string;
  appointment_date: string;
  appointment_scheduled_date: string;
  appointment_accepted_date: string;
}

const LeadManamentSucessModel: React.FC<EditModalProps> = ({
  isArcOpen,
  onArcClose,
  leadId,
  activeIndex,
  setActiveIndex,
}) => {
  const NoDeleteData = () => {
    onArcClose();
  };

  const [load, setLoad] = useState(false);

  const handleArchiveSelected = async () => {
    setLoad(true);
    try {
      const response = await postCaller(
        'toggle_archive',
        {
          ids: [leadId],
          is_archived: true,
        },
        true
      );
      if (response.status === 200) {
        toast.success('Leads Archieved successfully');
        setActiveIndex((prev) => prev + 1);
        onArcClose();
      } else {
        toast.warn(response.message);
      }
    } catch (error) {
      console.error('Error deleting leads:', error);
    }
    setLoad(false);
  };

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
    if (isAuthenticated) {
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
  }, [isAuthenticated, leadId]);

  return (
    <div>
      {isArcOpen && (
        <div className="transparent-model">
          <div className={classes.customer_wrapper_list}>
            {loading ? (
              <div
                style={{
                  marginTop: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <MicroLoader />
              </div>
            ) : leadData ? (
              <div className={classes.DetailsMcontainer}>
                <div className={classes.Column1Details}>
                  <span className={classes.main_name}>
                    {' '}
                    {leadData?.first_name} {leadData?.last_name}{' '}
                  </span>
                  <span className={classes.mobileNumber}>
                    {leadData?.phone_number}
                  </span>
                </div>
                <div className={classes.Column2Details}>
                  <span className={classes.addresshead}>
                    {leadData?.street_address
                      ? leadData.street_address.length > 20
                        ? `${leadData.street_address.slice(0, 20)}...`
                        : leadData.street_address
                      : 'N/A'}
                  </span>
                  <span className={classes.emailStyle}>
                    {leadData?.email_id}{' '}
                    {/* <span className={classes.verified}> */}
                    {/* <svg
                        className={classes.verifiedMarked}
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_6615_16896)">
                          <path
                            d="M6.08 0.425781C2.71702 0.425781 0 3.13967 0 6.50578C0 9.87189 2.71389 12.5858 6.08 12.5858C9.44611 12.5858 12.16 9.87189 12.16 6.50578C12.16 3.13967 9.44302 0.425781 6.08 0.425781Z"
                            fill="#20963A"
                          />
                          <path
                            d="M8.99542 4.72214C8.8347 4.56137 8.59049 4.56137 8.42668 4.72212L5.30786 7.84096L3.72834 6.26146C3.56762 6.10074 3.32341 6.10074 3.1596 6.26146C2.99888 6.42219 2.99888 6.66637 3.1596 6.8302L5.02346 8.69406C5.10383 8.77443 5.18418 8.81461 5.30784 8.81461C5.42839 8.81461 5.51185 8.77443 5.59222 8.69406L8.99542 5.29088C9.15614 5.13016 9.15614 4.886 8.99542 4.72214Z"
                            fill="white"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_6615_16896">
                            <rect
                              width="12.16"
                              height="12.16"
                              fill="white"
                              transform="translate(0 0.421875)"
                            />
                          </clipPath>
                        </defs>
                      </svg>{' '} */}
                    {/* Verified
                    </span> */}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                "No Data Found"
              </div>
            )}

            <>
              {' '}
              <div className={classes.success_not}>
                <div className={classes.succicon}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.70247 31.9919C2.01419 31.9919 1.32591 31.7301 0.802979 31.2033C-0.246826 30.1534 -0.246826 28.4515 0.802979 27.4016L27.409 0.795658C28.4594 -0.254803 30.1614 -0.254803 31.2112 0.795658C32.261 1.84546 32.261 3.54746 31.2112 4.59726L4.60458 31.2033C4.07443 31.7301 3.38681 31.9919 2.70247 31.9919Z"
                        fill="white"
                      />
                    </svg>
                    <path
                      d="M29.3005 31.9919C28.6129 31.9919 27.9246 31.7301 27.4016 31.2033L0.795658 4.59726C-0.254803 3.54746 -0.254803 1.84546 0.795658 0.795658C1.84546 -0.254803 3.54746 -0.254803 4.59726 0.795658L31.2033 27.4016C32.2537 28.4515 32.2537 30.1534 31.2033 31.2033C30.677 31.7301 29.9888 31.9919 29.3005 31.9919Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h2>Are You Sure? </h2>
                <p>Do you really want to archived this lead</p>
              </div>
              <div className={classes.survey_button}>
                <button
                  className={classes.self}
                  style={{
                    color: '#fff',
                    border: 'none',
                    pointerEvents: load ? 'none' : 'auto',
                    opacity: load ? 0.6 : 1,
                    cursor: load ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleArchiveSelected}
                >
                  {load ? 'Archiving...' : 'Yes'}
                </button>
                <button
                  id="otherButtonId"
                  className={classes.other}
                  onClick={NoDeleteData}
                >
                  No
                </button>
              </div>
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManamentSucessModel;
