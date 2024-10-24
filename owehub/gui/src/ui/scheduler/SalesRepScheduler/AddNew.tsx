import React, { useState } from 'react';
import Input from '../../components/text_input/Input';
import { ActionButton } from '../../components/button/ActionButton';
import styles from './styles/addnew.module.css';
import 'react-phone-input-2/lib/style.css';
import SelectOption from '../../components/selectOption/SelectOption';
import CheckboxSlider from './components/Checkbox';
import { validateEmail } from '../../../utiles/Validation';
import { ICONS } from '../../../resources/icons/Icons';
import { useNavigate } from 'react-router-dom';
import SalesRepSchedulePage from './SuccessSales';
import { FaXmark } from 'react-icons/fa6';
import axios from 'axios';
import { toast } from 'react-toastify';
import Select from 'react-select';

interface FormInput
  extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}

const AddNew = () => {
  const [formData, setFormData] = useState({
    description: '',
    first_name: '',
    last_name: '',
    email_id: '',
    mobile_number: '',
    address: '',
    house: '',
    size: '',
    roof_type: '',
    battery_installed: false,
    stories_in_house: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [count, setCount] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  const options1 = [
    { value: 'SHINGLE', label: 'SHINGLE' },
    { value: 'FLAT', label: 'FLAT' },
    { value: 'FLAT ROOF', label: 'FLAT ROOF' },
    { value: 'METAL', label: 'METAL' },
    { value: 'TILE', label: 'TILE' },
    { value: 'COMP SHINGLE', label: 'COMP SHINGLE' },
    { value: 'TRAPEZOIDAL - METAL', label: 'TRAPEZOIDAL - METAL' },
    { value: 'FLAT ROLLED', label: 'FLAT ROLLED' },
    { value: 'FLAT FOAM', label: 'FLAT FOAM' },
    { value: 'FLAT -EPDM', label: 'FLAT -EPDM' },
    { value: 'FLAT TPO', label: 'FLAT TPO' },
    { value: 'METAL ROOF', label: 'METAL ROOOF' },
    { value: 'FLAT-TILE', label: 'FLAT-TILE' },
    { value: 'S-TILE', label: 'S-TILE' },
    { value: 'LOW SLOPE', label: 'LOW SLOPE' },
    { value: 'GROUND MOUNT', label: 'GROUND MOUNT' },
    { value: 'LOW SLOPE - ROLLED', label: 'LOW SLOPE - ROLLED' },
    { value: 'CORRUGATED - METAL', label: 'CORRUGATED - METAL' },
    { value: 'W-TILE', label: 'W-TILE' },
    { value: 'DIMENSIONAL SHINGLE', label: 'DIMENSIONAL SHINGLE' },
    { value: 'FLAT TAR & GRAVEL', label: 'FLAT TAR & GRAVEL' },
    { value: 'LOW SLOPE', label: 'LOW SLOPE' },
    { value: 'STANDING SEAM - METAL', label: 'STANDING SEAM - METAL' },
  ];

  const handleIncrement = () => {
    setFormData((prevData) => ({
      ...prevData,
      stories_in_house: prevData.stories_in_house + 1,
    }));
  };

  const handleDecrement = () => {
    setFormData((prevData) => ({
      ...prevData,
      stories_in_house:
        prevData.stories_in_house > 0 ? prevData.stories_in_house - 1 : 0,
    }));
  };

  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    const lettersAndSpacesPattern = /^[A-Za-z\s]*$/;

    if (name === 'mobile_number') {
      const isValidPhoneNumber = /^[0-9+]*$/.test(value);
      if (!isValidPhoneNumber) {
        setPhoneNumberError('Please enter a valid phone number.');
      } else {
        setPhoneNumberError('');
      }
    } else if (name === 'first_name' || name === 'last_name') {
      if (value === '' || lettersAndSpacesPattern.test(value)) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Only letters and spaces are allowed.',
        }));
      }
    } else if (name === 'email_id') {
      const isValidEmail = validateEmail(value.trim());
      if (!isValidEmail) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption: any) => {
    setFormData((prevData) => ({
      ...prevData,
      roof_type: selectedOption.value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      battery_installed: checked,
    }));
  };

  const filterClose = () => setFilterOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (phoneNumberError || emailError) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      const response = await axios.post(
        'https://staging.owe-hub.com/api/owe-schedule-service/v1/create_sales_rep_proj',
        {
          customer_first_name: formData.first_name,
          customer_last_name: formData.last_name,
          email: formData.email_id,
          phone: formData.mobile_number,
          address: formData.address,
          roof_type: formData.roof_type,
          is_battery_installed: formData.battery_installed,
          house_stories: formData.stories_in_house,
          house_area_sqft: formData.house,
          system_size: formData.size,
        }
      );

      console.log('API response:', response.data);
      toast.success('Form submitted successfully!');

      setFormData({
        description: '',
        first_name: '',
        last_name: '',
        email_id: '',
        mobile_number: '',
        address: '',
        house: '',
        size: '',
        roof_type: '',
        battery_installed: false,
        stories_in_house: 0,
      });

      filterClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting the form. Please try again.');
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // Validate first name
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First Name is required';
      isValid = false;
    }

    // Validate last name
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last Name is required';
      isValid = false;
    }

    // Validate email
    if (!formData.email_id.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(formData.email_id.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate phone number
    if (!formData.mobile_number.trim()) {
      setPhoneNumberError('Phone Number is required');
      isValid = false;
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    // Validate roof type
    if (!formData.roof_type) {
      newErrors.roof_type = 'Roof Type is required';
      isValid = false;
    }

    // Validate house square foot
    if (!formData.house.trim()) {
      newErrors.house = "House's Square Foot is required";
      isValid = false;
    }

    // Validate system size
    if (!formData.size.toString().trim()) {
      newErrors.size = 'System Size is required';
      isValid = false;
    }

    console.log('formData', formData);
    setErrors(newErrors);
    return isValid;
    
  };

  return (
    <>
      <SalesRepSchedulePage isOpen={filterOpen} handleClose={filterClose} />
      <div className={styles.an_top}>Add New Project</div>
      <div className={`flex justify-between mt2 ${styles.h_screen}`}>
        <div className={styles.customer_wrapper_list}>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className={styles.an_head}>
                <p>Enter Customer Information</p>
                <span
                  className={styles.back_button}
                  onClick={handleBack}
                  style={{ cursor: 'pointer' }}
                >
                  <FaXmark className={styles.icon} />
                </span>
              </div>
              <div className={`scroll-user ${styles.scroll_user}`}>
                <div className={`createProfileInputView ${styles.inputView}`}>
                  <div className={`createProfileTextView ${styles.inputView}`}>
                    <div className={styles.salrep_input_container}>
                      <div className={styles.srs_new_create}>
                        <Input
                          type="text"
                          label="First Name"
                          value={formData.first_name}
                          placeholder="Enter First Name"
                          onChange={(e) => {
                            const { value } = e.target;
                            // Regex to allow only letters (a-z, A-Z) and a maximum of 30 characters
                            const regex = /^[A-Za-z\s]{0,30}$/;

                            if (regex.test(value)) {
                              handleInputChange(e);
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                first_name: '',
                              }));
                            } else if (value.trim() === '') {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                first_name: 'First Name is required',
                              }));
                            } else {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                first_name:
                                  'First Name can only contain letters',
                              }));
                            }
                          }}
                          name="first_name"
                          maxLength={30}
                          backgroundColor="#F3F3F3"
                          className={styles.custom_Input}
                          labelClassName={styles.custom_label}
                          innerViewClassName={styles.innerView}
                        />
                        {errors.first_name && (
                          <span className="error">{errors.first_name}</span>
                        )}
                      </div>

                      <div className={styles.srs_new_create}>
                        <Input
                          type="text"
                          label="Last Name"
                          value={formData.last_name}
                          placeholder="Enter Last Name"
                          onChange={(e) => {
                            const { value } = e.target;
                            // Regex to allow only letters (a-z, A-Z) and a maximum of 30 characters
                            const regex = /^[A-Za-z\s]{0,30}$/;

                            if (regex.test(value)) {
                              handleInputChange(e);
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                last_name: '',
                              }));
                            } else if (value.trim() === '') {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                last_name: 'Last Name is required',
                              }));
                            } else {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                last_name: 'Last Name can only contain letters',
                              }));
                            }
                          }}
                          name="last_name"
                          maxLength={30}
                          backgroundColor="#F3F3F3"
                          className={styles.custom_Input}
                          labelClassName={styles.custom_label}
                          innerViewClassName={styles.innerView}
                        />
                        {errors.last_name && (
                          <span className="error">{errors.last_name}</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.salrep_input_container}>
                      <div className={styles.srs_new_create}>
                        <Input
                          type="text"
                          label="Email"
                          value={formData.email_id}
                          placeholder="Enter Email"
                          onChange={handleInputChange}
                          name="email_id"
                          maxLength={30}
                          backgroundColor="#F3F3F3"
                          className={styles.custom_Input}
                          labelClassName={styles.custom_label}
                          innerViewClassName={styles.innerView}
                        />
                        {emailError && (
                          <span className="error">{emailError}</span>
                        )}
                      </div>

                      <div className={styles.srs_new_create}>
                        <Input
                          label="Phone Number"
                          type="number"
                          value={formData.mobile_number}
                          onChange={(e) => {
                            const { value } = e.target;
                            if (value.length <= 20) {
                              handleInputChange(e);
                              if (value.trim() === '') {
                                setPhoneNumberError('Phone Number is required');
                              } else {
                                setPhoneNumberError('');
                              }
                            }
                          }}
                          name="mobile_number"
                          placeholder="Enter phone number"
                          className={styles.custom_Input}
                          backgroundColor="#F3F3F3"
                          labelClassName={styles.custom_label}
                          innerViewClassName={styles.innerView}
                        />
                        {phoneNumberError && (
                          <p className="error-message">{phoneNumberError}</p>
                        )}
                      </div>
                    </div>

                    <div className={styles.salrep_input_container}>
                      <div className={styles.srs_new_create}>
                        <Input
                          type="text"
                          label="Address"
                          value={formData.address}
                          placeholder="Enter Address"
                          onChange={handleInputChange}
                          name="address"
                          maxLength={200}
                          backgroundColor="#F3F3F3"
                          className={styles.custom_Input}
                          labelClassName={styles.custom_label}
                          innerViewClassName={styles.innerView}
                        />
                        {errors.address && (
                          <span className="error">{errors.address}</span>
                        )}
                      </div>

                      <div className={styles.srs_new_create}>
                        <label
                          className={`${styles.custom_label} inputLabel-select selected-fields-onboard`}
                        >
                          Roof Type
                          {/* {' '} */}
                        </label>
                        <Select
                          options={options1}
                          value={
                            formData.roof_type
                              ? {
                                  value: formData.roof_type,
                                  label: formData.roof_type,
                                }
                              : undefined
                          }
                          onChange={handleSelectChange}
                          placeholder="Select Rooftype"
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              backgroundColor: '#F3F3F3',
                              border: 'none',
                              width: '85%',
                              minHeight: '36px',
                              borderRadius: '8px',
                              fontSize:'12px',
                              '@media only screen and (max-width: 600px)': {
                                width: '240%',
                              },
                              '@media only screen and (min-width: 600px) and (max-width: 820px)':
                                {
                                  width: '100%',
                                },
                              boxShadow: 'none',
                              cursor: 'pointer',
                              marginTop: '19px',
                            }),
                            singleValue: (baseStyles) => ({
                              ...baseStyles,
                              color: '#292929',
                              fontWeight: '500',
                            }),
                            placeholder: (baseStyles) => ({
                              ...baseStyles,
                              color: '#777777',
                              fontSize: '12px',
                              padding: '5px',
                            }),
                            dropdownIndicator: (baseStyles) => ({
                              ...baseStyles,
                              color: '#777777',
                              '&:hover': {
                                color: '#292929',
                              },
                            }),
                            indicatorSeparator: () => ({
                              display: 'none',
                            }),
                            option: (baseStyles, state) => ({
                              ...baseStyles,
                              fontSize: '13px',
                              color: state.isSelected ? '#ffffff' : '#000000',
                              backgroundColor: state.isSelected
                                ? '#377CF6'
                                : '#ffffff',
                              '&:hover': {
                                backgroundColor: state.isSelected
                                  ? '#0493CE'
                                  : '#DDEBFF',
                              },
                              cursor: 'pointer',
                            }),
                            menu: (baseStyles) => ({
                              ...baseStyles,
                              width: '85%',
                            }),
                            menuList: (baseStyles) => ({
                              ...baseStyles,
                              maxHeight: '150px',
                            }),
                          }}
                        />
                      </div>
                    </div>

                    <div className={styles.salrep_input_container}>
                      <div className={styles.srs_new_create}>
                        <label
                          className={`${styles.custom_label} inputLabel-select selected-fields-onboard`}
                        >
                          Stories in House
                        </label>
                        <input
                          className={styles.tenst_inp}
                          type="number"
                          min={0}
                          max={100}
                          value={formData.stories_in_house}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value >= 0 && value <= 100) {
                              setFormData((prevData) => ({
                                ...prevData,
                                stories_in_house: value,
                              }));
                            } else if (value > 100) {
                              setFormData((prevData) => ({
                                ...prevData,
                                stories_in_house: 100,
                              }));
                            }
                          }}
                        />

                        <div className={styles.tentaclesicons}>
                          <img
                            src={ICONS.UP}
                            alt="Increase"
                            onClick={() => {
                              setFormData((prevData) => ({
                                ...prevData,
                                stories_in_house: Math.min(
                                  prevData.stories_in_house + 1,
                                  100
                                ),
                              }));
                            }}
                          />
                          <img
                            src={ICONS.DOWN}
                            alt="Decrease"
                            onClick={() => {
                              setFormData((prevData) => ({
                                ...prevData,
                                stories_in_house: Math.max(
                                  prevData.stories_in_house - 1,
                                  0
                                ),
                              }));
                            }}
                          />
                        </div>
                      </div>

                      <div className={styles.srs_new_create}>
                        <Input
                          type="number"
                          label="House's Square Foot"
                          value={formData.house}
                          placeholder="Enter House's Square Foot"
                          onChange={(e) => {
                            const { value } = e.target;
                            if (/^\d{0,20}$/.test(value)) {
                              handleInputChange(e);
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                house: '',
                              }));
                            } else if (value.trim() === '') {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                house: 'House Square Foot is required',
                              }));
                            } else {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                house: 'House Square Foot cannot exceed 20 digits',
                              }));
                            }
                          }}
                          name="house"
                          maxLength={20}
                          backgroundColor="#F3F3F3"
                          labelClassName={styles.custom_label}
                          innerViewClassName={styles.innerView}
                        />
                        {/* {errors.house && (
                          <span className="error">{errors.house}</span>
                        )} */}
                      </div>
                    </div>

                    <div
                      className={` ${styles.reverse_col} ${styles.salrep_input_container}`}
                    >
                      <div className={styles.srs_new_create}>
                        <label
                          className={`${styles.custom_label} inputLabel-select selected-fields-onboard`}
                        >
                          Enable if there is battery installed
                        </label>
                        <span>
                          <CheckboxSlider
                            checked={formData.battery_installed}
                            onChange={handleCheckboxChange}
                          />
                        </span>
                      </div>

                      <div className={styles.srs_new_create}>
                        <Input
                          type="number"
                          label="System Size"
                          value={formData.size}
                          placeholder="Enter System Size"
                          onChange={(e) => {
                            const { value } = e.target;
                            if (/^\d{0,7}$/.test(value)) {
                              handleInputChange(e);
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                house: '',
                              }));
                            } else if (value.trim() === '') {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                house: 'System Size is required',
                              }));
                            } else {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                house: 'System Size cannot exceed 7 digits',
                              }));
                            }
                          }}
                          name="size"
                          backgroundColor="#F3F3F3"
                          labelClassName={styles.custom_label}
                          innerViewClassName={styles.innerView}
                        />
                        {/* {errors.house && (
                          <span className="error">{errors.house}</span>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.srActionButton}>
              <button type="submit" className={styles.submitbut}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNew;
