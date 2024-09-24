import React from 'react';
import classes from './styles/leadManagementNew.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validateZipCode } from '../../utiles/Validation';
import Input from '../components/text_input/Input';
import PhoneInput from 'react-phone-input-2';

interface FormInput
  extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> { }
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
  console.log(formData, "form data consoling ")
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Added for validation errors // Added for validation error message
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [zip_codeError, setZip_codeError] = useState('');

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
      errors.first_name = "";
      if (!isValidEmail) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
        errors.first_name = "";
      }
      const trimmedValue = value.replace(/\s/g, '');

      setFormData((prevData) => ({
        ...prevData,
        [name]: trimmedValue,
      }));
    } else if (name === 'zip_code') {
      const isValidZipCode = validateZipCode(value.trim());
      if (!isValidZipCode) {
        setZip_codeError(
          'Please enter a valid ZipCode'
        );
      } else {
        setZip_codeError('');
      }

      const CorrectValue = value.replace(/\s/g, '');
      setFormData((prevData) => ({
        ...prevData,
        [name]: CorrectValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      // Clear any existing error for this field
      const err = { ...errors };
      delete err[name];
      setErrors(err);
    }
  };
  const initialFormData = {
    first_name: '',
    last_name: '',
    email_id: '',
    mobile_number: '',
    address: '',
    zip_code: '',
    notes: '',
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Check if each field is empty and set corresponding error
    if (formData.first_name.trim() === '') {
      newErrors.first_name = 'First name is required';
    }
    if (formData.last_name.trim() === '') {
      newErrors.last_name = 'Last name is required';
    }
    if (formData.email_id.trim() === '') {
      newErrors.email_id = 'Email is required';
    }
    if (formData.mobile_number.trim() === '') {
      newErrors.mobile_number = 'Mobile number is required';
    }
    if (formData.address.trim() === '') {
      newErrors.address = 'Address is required';
    }
    if (formData.zip_code.trim() === '') {
      newErrors.zip_code = 'Zip code is required';
    }
    if (formData.notes.trim() === '') {
      newErrors.notes = 'Notes are required';
    }

    // Update the error state
    setErrors(newErrors);

    // If there are no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      console.log(formData);
      resetFormData();
    }
  };

  const resetFormData = () => {
    setFormData(initialFormData);
  };

  return (
    <>
      <div className={`${classes.main_head} ${classes.form_header}`}>
        Create New Lead
      </div>
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
                            const phoneNumber = value.toString();
                            setFormData((prevData) => ({
                              ...prevData,
                              mobile_number: phoneNumber,
                            }));
                          }}
                        />
                        {phoneNumberError || errors.mobile_number && (
                          <p className="error-message">{phoneNumberError || errors.mobile_number}</p>
                        )}
                      </div>

                      <div className={classes.srs_new_create}>
                        <Input
                          type={'text'}
                          label="Email ID"
                          value={formData.email_id}
                          placeholder={'email@mymail.com'}
                          onChange={(e) => handleInputChange(e)}
                          name={'email_id'}
                        // disabled={formData.isEdit}
                        />
                        {(emailError || errors.email_id) && (
                          <div className="error-message">
                            {emailError || errors.email_id}
                          </div>
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
                          type="number"
                          label="Zip Code"
                          value={formData.zip_code}
                          placeholder="Zip Code"
                          onChange={(e) => handleInputChange(e)}
                          name="zip_code"
                          maxLength={8}
                        />
                        {(zip_codeError || errors.zip_code) && (
                          <div className="error-message">{zip_codeError || errors.zip_code}</div>
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
                          className={`character-count ${formData.notes.trim().length >= 500
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
  );
};

export default LeadManagementNew;
