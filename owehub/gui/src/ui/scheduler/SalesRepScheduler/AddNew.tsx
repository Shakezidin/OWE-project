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
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [count, setCount] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const navigate = useNavigate();

  const options1 = [
    { value: 'today', label: 'Table 1 Data' },
    { value: 'this_week', label: 'Table 2 Data' },
    { value: 'all', label: 'Table 3 Data' },
  ];
  const selectedOption = { value: 'Type1', label: 'Type1' };

  const handleIncrement = () => setCount(count + 1);
  const handleDecrement = () => count > 0 && setCount(count - 1);

  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    const lettersAndSpacesPattern = /^[A-Za-z\s]*$/;

    if (name === 'mobile_number') {
      const isValidPhoneNumber = /^[0-9+]*$/.test(value); // Allow digits and '+'
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

  const filterClose = () => setFilterOpen(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumberError || emailError) {
      return;
    }
    filterClose();
  };

  const handleBack = () => {
    navigate(-1);
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
                <span onClick={handleBack} style={{ cursor: 'pointer' }}>
                  <FaXmark
                    style={{
                      height: '20px',
                      width: '27px',
                      color: '#000000',
                      fontWeight: '600',
                    }}
                  />
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
                          onChange={handleInputChange}
                          name="first_name"
                          maxLength={100}
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
                          onChange={handleInputChange}
                          name="last_name"
                          maxLength={100}
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
                          maxLength={100}
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
                          onChange={handleInputChange}
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
                          maxLength={100}
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
                        </label>
                        <SelectOption
                          options={options1}
                          value={selectedOption}
                          onChange={(data: any) => console.log(data)}
                          singleValueStyles={{
                            color: '#292929',
                            fontWeight: '500',
                          }}
                          controlStyles={{
                            backgroundColor: '#F3F3F3',
                            width: '80%',
                            borderStyle: 'none',
                            '@media only screen and (max-width: 750px)': {
                              width: '240%',
                            },
                          }}
                          enableHoverEffect={false}
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
                          id="tentacles"
                          name="tentacles"
                          min={0}
                          value={count}
                          onChange={(e) => setCount(Number(e.target.value))}
                        />
                        <div className={styles.tentaclesicons}>
                          <img
                            src={ICONS.UP}
                            alt="Increase"
                            onClick={handleIncrement}
                          />
                          <img
                            src={ICONS.DOWN}
                            alt="Decrease"
                            onClick={handleDecrement}
                          />
                        </div>
                      </div>

                      <div className={styles.srs_new_create}>
                        <Input
                          type="text"
                          label="House's Square Foot"
                          value={formData.house}
                          placeholder="Enter House's Square Foot"
                          onChange={handleInputChange}
                          name="house"
                          maxLength={100}
                          backgroundColor="#F3F3F3"
                          labelClassName={styles.custom_label}
                          innerViewClassName={styles.innerView}
                        />
                        {errors.house && (
                          <span className="error">{errors.house}</span>
                        )}
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
                          <CheckboxSlider />
                        </span>
                      </div>

                      <div className={styles.srs_new_create}>
                        <Input
                          type="number"
                          label="System Size"
                          value={formData.size}
                          placeholder="Enter System Size"
                          onChange={handleInputChange}
                          name="size"
                          maxLength={100}
                          backgroundColor="#F3F3F3"
                          labelClassName={styles.custom_label}
                          innerViewClassName={styles.innerView}
                        />
                        {errors.house && (
                          <span className="error">{errors.house}</span>
                        )}
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
