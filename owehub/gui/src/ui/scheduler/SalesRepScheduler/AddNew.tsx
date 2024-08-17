import React, { useState } from 'react'
import Input from '../../components/text_input/Input'
import { ActionButton } from '../../components/button/ActionButton'
import styles from './styles/addnew.module.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface FormInput
  extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> { }


const AddNew = () => {
  const [formData, setFormData] = useState({
    description: '',
    first_name: '',
    last_name: '',
    email:'',
    mobile_number:'',
    address:''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Added for validation errors // Added for validation error message
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const err = { ...errors };
    delete err['first_name'];
    setErrors(err);
  };
  const handleSubmit = () => {
    console.log("Submitted")
  }
  return (
    <div className={`flex justify-between mt2 ${styles.h_screen}`}>
      <div className={styles.customer_wrapper_list}>
        <form>
          <div className="modal-body">
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
                        value={formData.email}
                        placeholder="Enter Email"
                        onChange={handleInputChange}
                        name="email"
                        maxLength={100}
                        backgroundColor="#F3F3F3"
                      />
                      {errors.email && (
                        <span
                          style={{
                            display: 'block',
                          }}
                          className="error"
                        >
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div className={styles.srs_new_create} style={{marginTop:"-4px"}}>
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

                    <div className={styles.srs_new_create} style={{marginTop:"-4px"}}>
                     
                     
                     
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="tm-createUserActionButton">
            <ActionButton
              title="Create"
              type="submit"
              onClick={handleSubmit}
            />
          </div>
        </form>
      </div>
    </div>

  )
}

export default AddNew