import React from 'react'
import classes from "./styles/leadManagementNew.module.css"
// import SalesRepSchedulePage from '../scheduler/SalesRepScheduler/SuccessSales';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utiles/Validation';
import Input from '../components/text_input/Input';
import PhoneInput from 'react-phone-input-2';

interface FormInput
  extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}
const LeadManagementNew = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email_id: '',
    mobile_number: '',
    address: '',
    zip_code: '',
    notes: '',
  });
  const navigate = useNavigate();
  const options1 = [
    { value: 'today', label: 'Table 1 Data' },
    { value: 'this_week', label: 'Table 2 Data' },
    { value: 'all', label: 'Table 3 Data' },
  ];
  const selectedOption = { value: 'Type1', label: 'Type1' };
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Added for validation errors // Added for validation error message
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [emailError, setEmailError] = useState('');

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

  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  // const filterClose = () => setFilterOpen(false);

  // const filter = () => {
  //   setFilterOpen(true);
  // };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(formData)
    // filter();
  };


  return (
    <><div className={classes.main_head}>Create New Lead</div>

      
      {/* <SalesRepSchedulePage isOpen={filterOPen} handleClose={filterClose}/> Filter Modal */}
      <div className={`flex justify-between mt2 ${classes.h_screen}`}>
        <div className={classes.customer_wrapper_list}>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className={classes.an_head}>Fill the Form</div>
              <div className="scroll-user">
                <div className={classes.createProfileInputView}>
                  <div className={classes.createProfileTextView}>
                    <div className={classes.salrep_input_container}>
                      <div className={classes.srs_new_create}>
                        <Input
                          type="text"
                          label="First Name"
                          value={formData.first_name}
                          placeholder="Enter First Name"
                          onChange={handleInputChange}
                          name="first_name"
                          maxLength={100}
                          // backgroundColor="#F3F3F3"
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

                      <div className={classes.srs_new_create}>
                        <Input
                          type="text"
                          label="Last Name"
                          value={formData.last_name}
                          placeholder="Enter Last name"
                          onChange={handleInputChange}
                          name="last_name"
                          maxLength={100}
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
                    <div className={classes.salrep_input_container}>
                      <div
                        className={classes.srs_new_create}
                        // style={{ marginTop: '-4px' }}
                      >
                        <label className="inputLabel">Phone Number</label>
                        <PhoneInput 
                          countryCodeEditable={false}
                          country={'us'}
                          disableCountryGuess={true}
                          enableSearch
                          placeholder="+91 8739273728"
                          value={formData.mobile_number}
                          onChange={(value: any) => {
                            console.log('date', value);
                          }}
                        />
                        {phoneNumberError && (
                          <p className="error-message">{phoneNumberError}</p>
                        )}
                      </div>

                      <div className={classes.srs_new_create}>
                        <Input
                          type="email"
                          label="Email"
                          value={formData.email_id}
                          placeholder="Adam Samson76_1@gmail.com"
                          onChange={handleInputChange}
                          name="email_id"
                          maxLength={100}
                        />
                        {errors.emailError && (
                          <span
                            style={{
                              display: 'block',
                            }}
                            className="error"
                          >
                            {errors.emailError}
                          </span>
                        )}
                      </div>
                      </div>
                      <div className={classes.salrep_input_container}>
                      <div className={classes.srs_new_create}>
                        <Input
                          type="text"
                          label="Address"
                          value={formData.address}
                          placeholder="Address"
                          onChange={handleInputChange}
                          name="address"
                          maxLength={100}
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
                    <div className={classes.srs_new_create}>
                        <Input
                          type="text"
                          label="Zip Code"
                          value={formData.zip_code}
                          placeholder="Zip Code"
                          onChange={handleInputChange}
                          name="zip_code"
                          maxLength={100}
                        />
                        {errors.zip_code && (
                          <span
                            style={{
                              display: 'block',
                            }}
                            className="error"
                          >
                            {errors.zip_code}
                          </span>
                        )}
                      </div>
                      
                      <div className={classes.create_input_field_note}>
                  <label htmlFor="" className="inputLabel">
                    Notes
                  </label>{' '}
                  <br />
                  <textarea
                    name="notes"
                    id=""
                    rows={3}
                    maxLength={500}
                    value={formData.notes}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="Write"
                  ></textarea>
                  <p
                    className={`character-count ${
                      formData.notes.trim().length >= 500
                        ? 'exceeded'
                        : ''
                    }`}
                  >
                    {/* {formData.notes.trim().length}/500 characters */}
                  </p>
                </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.srActionButton}>
              <button className={classes.submitbut}>Submit</button>
            </div>
          </form>
        </div>
      </div>
      
    </>
  )
}

export default LeadManagementNew;