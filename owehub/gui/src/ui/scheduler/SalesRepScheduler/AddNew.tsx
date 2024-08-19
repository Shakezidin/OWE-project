import React, { useState } from 'react'
import Input from '../../components/text_input/Input'
import { ActionButton } from '../../components/button/ActionButton'
import styles from './styles/addnew.module.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import SelectOption from '../../components/selectOption/SelectOption';
import CheckboxSlider from './components/Checkbox';
import { validateEmail } from '../../../utiles/Validation';
import { ICONS } from '../../../resources/icons/Icons';

interface FormInput
  extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> { }


const AddNew = () => {
  const [formData, setFormData] = useState({
    description: '',
    first_name: '',
    last_name: '',
    email_id: '',
    mobile_number: '',
    address: '',
    house: '',
    size: ''
  });
  const options1 = [
    { value: 'today', label: 'Table 1 Data' },
    { value: 'this_week', label: 'Table 2 Data' },
    { value: 'all', label: 'Table 3 Data' },
  ];
  const selectedOption = { value: 'Type1', label: 'Type1' };
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Added for validation errors // Added for validation error message
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [count, setCount] = useState(0);

  const handleIncrement = () => { 
      setCount(count + 1);
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    const lettersAndSpacesPattern = /^[A-Za-z\s]+$/;

    if (name === 'first_name' || name === 'last_name') {
      if (value === '' || lettersAndSpacesPattern.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        const err = { ...errors };
        delete err[name];
        setErrors(err);
      }
    } else if (name === 'email_id') {
      const isValidEmail = validateEmail(value.trim());
      if (!isValidEmail) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }
      const trimmedValue = value.replace(/\s/g, '');
      setFormData((prevData) => ({
        ...prevData,
        [name]: trimmedValue,
      }));
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
  return (
    <>
      <div className={styles.an_top}>Add New Project</div>
      <div className={`flex justify-between mt2 ${styles.h_screen}`}>

        <div className={styles.customer_wrapper_list}>
          <form>
            <div className="modal-body">
              <div className={styles.an_head}>Enter Customer Information</div>
              <div className="scroll-user">
                <div className="createProfileInputView">
                  <div className="createProfileTextView">


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
                        />
                        {errors.first_name && (
                          <span
                            style={{
                              display: 'block',
                            }}
                            className="error"
                          >
                            {errors.first_name}
                          </span>
                        )}
                      </div>

                      <div className={styles.srs_new_create}>
                        <Input
                          type="text"
                          label="Last Name"
                          value={formData.last_name}
                          placeholder="Enter Last name"
                          onChange={handleInputChange}
                          name="last_name"
                          maxLength={100}
                          backgroundColor="#F3F3F3"
                        />
                        {errors.last_name && (
                          <span
                            style={{
                              display: 'block',
                            }}
                            className="error"
                          >
                            {errors.last_name}
                          </span>
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
                        />
                        {emailError && (
                          <span
                            style={{
                              display: 'block',
                            }}
                            className="error"
                          >
                            {emailError}
                          </span>
                        )}
                      </div>

                      <div className={styles.srs_new_create} style={{ marginTop: "-4px" }}>
                        <label className="inputLabel">Phone Number</label>
                        <PhoneInput
                          countryCodeEditable={false}
                          country={'us'}
                          disableCountryGuess={true}
                          enableSearch
                          value={formData.mobile_number}
                          onChange={(value: any) => {
                            console.log('date', value);
                          }}
                          placeholder="Enter phone number"
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
                        />
                        {errors.address && (
                          <span
                            style={{
                              display: 'block',
                            }}
                            className="error"
                          >
                            {errors.address}
                          </span>
                        )}
                      </div>

                      <div className={styles.srs_new_create} style={{ marginTop: "-4px" }}>
                        <label className="inputLabel-select selected-fields-onboard">
                          Roof Type
                        </label>

                        <SelectOption
                          options={options1}
                          value={selectedOption}
                          onChange={(data: any) => {
                            console.log(data)
                          }}
                          singleValueStyles={{
                            color: '#292929',
                            fontWeight: '500',

                          }}
                          controlStyles={{
                            backgroundColor: "#F3F3F3", // Add the desired background color here
                          }}

                          enableHoverEffect={false}
                        />

                      </div>

                    </div>

                    <div className={styles.salrep_input_container}>

                      <div className={styles.srs_new_create} style={{marginTop:"4px"}}>
                        <label className="inputLabel-select selected-fields-onboard">
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
                          <img src={ICONS.UP} alt="img" onClick={handleIncrement} />
                          <img src={ICONS.DOWN} alt="img" onClick={handleDecrement} />

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
                        />
                        {errors.house && (
                          <span
                            style={{
                              display: 'block',
                            }}
                            className="error"
                          >
                            {errors.house}
                          </span>
                        )}
                      </div>



                    </div>

                    <div className={styles.salrep_input_container}>

                      <div className={styles.srs_new_create} style={{marginTop:"4px"}}>
                        <label className="inputLabel-select selected-fields-onboard">
                          Enable if there is battery installed
                        </label>
                        <span><CheckboxSlider /></span>




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
                        />
                        {errors.house && (
                          <span
                            style={{
                              display: 'block',
                            }}
                            className="error"
                          >
                            {errors.house}
                          </span>
                        )}
                      </div>



                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className="tm-createUserActionButton">
              <button className={styles.submitbut}>Submit</button>
            </div>
          </form>
        </div>
      </div>

    </>

  )
}

export default AddNew