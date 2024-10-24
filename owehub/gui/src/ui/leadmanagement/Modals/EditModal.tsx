import React, { useEffect, useState, useRef, useCallback } from 'react';
import classes from '../styles/confirmmodal.module.css';
import Input from '../../components/text_input/Input';
import { validateEmail } from '../../../utiles/Validation';
import { ICONS } from '../../../resources/icons/Icons';
import { RiArrowDropDownLine } from 'react-icons/ri';
import useAuth from '../../../hooks/useAuth';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import MicroLoader from '../../components/loader/MicroLoader';

interface FormInput
  extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> { }

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData: any;
  refresh: number;
  setRefresh: (value: number | ((prevValue: number) => number)) => void;
}

const EditModal: React.FC<EditModalProps> = ({ refresh, setRefresh, isOpen, onClose, leadData }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [emailError, setEmailError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [load, setLoad] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState('');


  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const [formData, setFormData] = useState({
    email_id: '',
    mobile_number: '',
    address: '',
  });

  useEffect(() => {
    if (leadData) {
      setFormData({
        email_id: leadData.email_id || '',
        mobile_number: leadData.phone_number || '',
        address: leadData.street_address || '',
      });
    }
  }, [leadData]);

  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    if (name === 'email_id') {
      const isOnlyNumbers = /^\d+$/.test(value.trim());
      const isValidEmail = validateEmail(value.trim());
      if (isOnlyNumbers) {
        setEmailError('Email cannot consist of only numbers.');
        setErrors((prevErrors) => ({
          ...prevErrors,
          email_id: 'Email cannot consist of only numbers.',
        }));
      }
      else if (!isValidEmail) {
        setEmailError('Please enter a valid email address.');
        setErrors((prevErrors) => ({
          ...prevErrors,
          email_id: 'Please enter a valid email address.',
        }));
      }
      else {
        setEmailError('');
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.email_id;
          return newErrors;
        });
      }




      const trimmedValue = value.replace(/\s/g, '');
      setFormData((prevData) => ({
        ...prevData,
        [name]: trimmedValue,
      }));
    } else if (name === 'mobile_number') {
      if (value.length <= 16) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      const err = { ...errors };
      delete err[name];
      setErrors(err);
    }
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);



  const validateForm = (formData: any) => {
    const errors: { [key: string]: string } = {};
    if (formData.email_id.trim() === '') {
      errors.email_id = 'Email is required';
    }
    if (formData.mobile_number.trim() === '') {
      errors.mobile_number = 'Phone number is required';
    }
    if (formData.address.trim() === '') {
      errors.address = 'Address is required';
    }
    return errors;
  };




  const handleConfrm = async (e: any) => {
    setLoad(true);
    e.preventDefault();
    const errors = validateForm(formData);
    setErrors(errors);
    if (Object.keys(errors).length === 0 && emailError === '') {
      try {
        const response = await postCaller(
          'edit_leads',
          {
            leads_id: leadData?.leads_id,
            email_id: formData.email_id,
            phone_number: formData.mobile_number,
            street_address: formData.address,
          },
          true
        );
        if (response.status === 200) {
          toast.success('Lead Updated Succesfully');
          setRefresh((prev) => prev + 1);
          onClose();
        } else if (response.status >= 201) {
          toast.warn(response.message);
        }
        setLoad(false);
      } catch (error) {
        setLoad(false);
        console.error('Error submitting form:', error);
      }
    }
    setLoad(false);
  };
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfrm(e);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  // const containerRef = useRef<HTMLDivElement>(null);
  
  // const checkZoomLevel = useCallback(() => {
  //   const zoomLevel = Math.round(window.devicePixelRatio * 100);
    
  //   if (containerRef.current) {
  //     if (zoomLevel > 138) {
  //       containerRef.current.style.marginTop = "0";
  //     } else if (zoomLevel > 100) {
  //       containerRef.current.style.marginTop = "-310px"; 
  //     } else {
  //       containerRef.current.style.marginTop = "-317px"; 
  //     }
  //     console.log(`Zoom Level: ${zoomLevel}, Margin Top: ${containerRef.current.style.marginTop}`);
  //     console.log("Rabindra");
  //   }
  // }, []);

  // useEffect(() => {
  //       checkZoomLevel();
  //   window.addEventListener('resize', checkZoomLevel);
  //   return () => {
  //     window.removeEventListener('resize', checkZoomLevel);
  //   };
  // }, [checkZoomLevel]);

  return (

    <>
      {(isOpen || isVisible) && (
        <div
          className={`${classes.editmodal_transparent_model} ${isOpen ? classes.open : classes.close}`}
        >

          <div  className={classes.customer_wrapper_list_edit}>
            <div className={classes.Edit_DetailsMcontainer}>
              <div className={classes.edit_closeicon} onClick={onClose}>
                <RiArrowDropDownLine
                  style={{ height: '34px', width: '34px', fontWeight: '400' }}
                />
              </div>


              <div className={classes.notEditable}>
                <div className={classes.Column1DetailsEdited_Mode}>
                  <span className={classes.main_name}>
                    {`${leadData?.first_name} ${leadData?.last_name}`.length > 15
                      ? `${`${leadData?.first_name} ${leadData?.last_name}`.slice(0, 15)}...`
                      : `${leadData?.first_name} ${leadData?.last_name}`}{' '}
                  </span>
                  <span className={classes.mobileNumber}>
                    {leadData?.phone_number}
                  </span>
                </div>
                <div className={classes.Column2Details_Edited_Mode}>
                  <span className={classes.addresshead}>
                    {leadData?.street_address
                      ? leadData.street_address.length > 20
                        ? `${leadData.street_address.slice(0, 30)}...`
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
                        <g clipPath="url(#clip0_6615_16896)">
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

              <div className={classes.inputFields}>
                <div>
                  <Input
                    type="number"
                    value={formData.mobile_number}
                    placeholder="+91 8127577509"
                    onChange={(e) => {
                      const { value } = e.target;
                      handleInputChange(e);
                      if (value.trim() !== '') {
                        setErrors((prevErrors) => {
                          const newErrors = { ...prevErrors };
                          delete newErrors.mobile_number;
                          return newErrors;
                        });
                      }
                    }}
                    name="mobile_number"
                    maxLength={15}
                  />
                  {errors.mobile_number && (
                    <p className="error-message">{errors.mobile_number}</p>
                  )}

                </div>
                <div>
                  <Input
                    type="email"
                    value={formData.email_id}
                    placeholder={'email@mymail.com'}
                    maxLength={40}
                    onChange={(e) => {
                      const { value } = e.target;
                      handleInputChange(e);
                      if (value.trim() !== '') {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          email_id: '',
                        }));
                      }
                    }}
                    name={'email_id'}
                  />

                  {(emailError || errors.email_id) && (
                    <div className="error-message">
                      {emailError || errors.email_id}
                    </div>
                  )}
                </div>
                <div> <Input
                  type="text"
                  value={formData.address}
                  placeholder="Address"
                  onChange={handleInputChange}
                  name="address"
                  maxLength={80}
                />
                  {errors.address && (
                    <span
                      style={{
                        display: 'block',
                      }}
                      className="error-message"
                    >
                      {errors.address}
                    </span>
                  )}</div>
              </div>

              <div
                className={classes.survey_button}
                style={{ paddingBottom: '18px' }}
              >
                <button
                  id='EnterKeys'
                  className={classes.self}
                  style={{
                    color: '#fff',
                    border: 'none',
                    fontWeight: '500',
                    fontSize: '14px',
                    pointerEvents: load ? 'none' : 'auto',
                    opacity: load ? 0.6 : 1,
                    cursor: load ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleConfrm}
                  tabIndex={0}
                >
                  {load ? 'Updating....' : 'CONFIRM'}
                </button>
              </div>
            </div>
          </div>
        </div>

      )}
    </>
  );
};

export default EditModal;
