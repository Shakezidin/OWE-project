import React, { useRef, useState } from 'react';
import Input from '../../components/text_input/Input';
import { ICONS } from '../../icons/Icons';
import './support.css';
import emailjs from '@emailjs/browser';

import Select from 'react-select';
import { ActionButton } from '../../components/button/ActionButton';
import SelectOption from '../../components/selectOption/SelectOption';
import { toast } from 'react-toastify';

const TechnicalSupport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [stateOptions, setStateOptions] = useState<any[]>([]);
  const form = useRef<HTMLFormElement>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const phoneRegex =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic
    const newErrors = {
      firstName: firstName ? '' : 'First name is required',
      lastName: lastName ? '' : 'Last name is required',
      email: emailRegex.test(email) ? '' : 'Invalid email address',
      phoneNumber: phoneRegex.test(phoneNumber) ? '' : 'Invalid phone number',
      message: message ? '' : 'Message is required',
    };
    setErrors(newErrors);
    // if (!Object.values(newErrors).some((error) => error)) {
    //   console.log("Form submitted successfully");
    // }
    if (form.current && Object.values(newErrors).every((err) => !err)) {
      emailjs
        .sendForm('service_nof7okz', 'template_y3qbqr8', form.current, {
          publicKey: 'iVTsTUymXutcfakaX',
        })
        .then(
          (response: any) => {
            console.log('SUCCESS!', response);
            toast.success('Your form has been submitted!');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhoneNumber('');
            setMessage('');
          },
          (error: any) => {
            console.error('FAILED...', error);
          }
        );
    }
  };

  const handleStateChange = (selectedOption: any) => {
    setSelectedState(selectedOption.value);
  };

  const options = [
    { value: 'option1', label: 'OWE' },
    { value: 'option2', label: 'OWE 2' },
    { value: 'option3', label: 'OWE 3' },
  ];
  const handleSelectChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };
  const handleFileInputChange = (e: any) => {
    const file = e.target.files?.[0];
    console.log(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Trigger file input click event
  };

  return (
    <>
      <form ref={form} onSubmit={handleSubmit}>
        <div className="support-cont-section">
          <div className="support-container">
            <div className="support-section">
              <h3>Support</h3>
            </div>
            <div className="supportImage">
              {/* <img src={ICONS.supportImage} alt="" /> */}
              <object
                type="image/svg+xml"
                data={ICONS.supportImage}
                aria-label="support-icon"
              ></object>
            </div>
          </div>

          <div className="vertical-support"></div>

          <div className="touch-container">
            <div className="touch-info">
              <p>Get In Touch with us for more Information</p>
            </div>

            <div className="create-input-container-support">
              <div className="create-input-field-support">
                <Input
                  type={'text'}
                  label="First Name"
                  value={firstName}
                  name="user_name"
                  placeholder={'Enter'}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setErrors({ ...errors, firstName: '' });
                  }}
                />
                {errors.firstName && (
                  <span className="error">{errors.firstName}</span>
                )}
              </div>
              <div className="create-input-field-support">
                <Input
                  type={'text'}
                  label="Last Name"
                  value={lastName}
                  name="lastName"
                  placeholder={'Enter'}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setErrors({ ...errors, lastName: '' });
                  }}
                />
                {errors.lastName && (
                  <span className="error">{errors.lastName}</span>
                )}
              </div>
            </div>
            <div className="create-input-container-support">
              <div className="create-input-field-support">
                <Input
                  type={'text'}
                  label="Email"
                  value={email}
                  name="email"
                  placeholder={'Enter'}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: '' });
                  }}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="create-input-field-support">
                <Input
                  type={'number'}
                  label="Phone Number"
                  value={phoneNumber}
                  name="phoneNum"
                  placeholder={'Enter'}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setErrors({ ...errors, phoneNumber: '' });
                  }}
                />
                {errors.phoneNumber && (
                  <span className="error">{errors.phoneNumber}</span>
                )}
              </div>
            </div>

            <div className="create-input-container-support">
              <div className="create-input-field-support">
                <label className="inputLabel-select">Issue</label>
                <SelectOption
                  onChange={handleStateChange}
                  options={stateOptions}
                  value={stateOptions?.find((option) => option.value === ' ')}
                />
              </div>

              <div className="create-input-field-support">
                <label className="inputLabel">
                  <p>Attach File</p>
                </label>
                <div className="file-input-container">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    className="file-input"
                  />
                  <div className="custom-button-container">
                    <span className="file-input-placeholder">Select File</span>
                    <button
                      className="custom-button"
                      onClick={handleButtonClick}
                    >
                      {/* <img src={ICONS.browserIcon} alt="" /> */}
                      Browse
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="create-input-field-note-support"
              style={{ marginTop: '0.3rem' }}
            >
              <label htmlFor="" className="inputLabel-support">
                Message
              </label>
              <br />
              <textarea
                name="message"
                id=""
                rows={4}
                value={message}
                placeholder="Type here..."
                style={{ marginTop: '0.3rem' }}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setErrors({ ...errors, message: '' });
                }}
              ></textarea>
              {errors.message && (
                <span className="error">{errors.message}</span>
              )}
            </div>

            <div className="reset-Update-support">
              <button type="submit">Submit</button>
              {/* <ActionButton title={"Submit"} type="submit" onClick={() => {handleSubmit}} /> */}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default TechnicalSupport;
