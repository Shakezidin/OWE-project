import React, { useRef, useState } from 'react';
import Input from '../../components/text_input/Input';
import { ICONS } from '../../icons/Icons';
import './support.css';
import emailjs from '@emailjs/browser';
import SelectOption from '../../components/selectOption/SelectOption';
import { toast } from 'react-toastify';
import { FormInput } from '../../../core/models/data_models/typesModel';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import MicroLoader from '../../components/loader/MicroLoader';
import axios from 'axios';

const TechnicalSupport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const form = useRef<HTMLFormElement>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<any>('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedFileName, setSelectedFileName] = useState('');
  const [fileSizeError, setFileSizeError] = useState('');




  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    if (!file) return '';
  
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'xdfcmcf4');
      formData.append('cloud_name', 'duscqq0ii');
  
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/duscqq0ii/auto/upload`,
        formData
      );
  
      console.log('File uploaded successfully:', response.data.secure_url);
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      throw error;
    }
  };
  
  // Modify your handleFileInputChange function to use the uploadFile function
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
  
    if (file) {
      const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
      if (!allowedExtensions.includes(fileExtension)) {
        setSelectedFileName('');
        setFileSizeError('Only PNG, JPG, and PDF files are allowed');
        return;
      }
  
      if (file.size <= maxSize) {
        setSelectedFileName(file.name);
        setFileSizeError('');
        setSelectedFile(file);
  
        try {
          const uploadedFileUrl = await uploadFile(file);
          console.log('Uploaded file URL:', uploadedFileUrl);
          // You can use the uploadedFileUrl as needed, e.g., save it to state or send it to your backend
        } catch (error) {
          console.error('Error uploading file:', error);
          setFileSizeError('Error uploading file. Please try again.');
        }
      } else {
        setSelectedFileName('');
        setFileSizeError('File size exceeds the limit of 10 MB');
      }
    } else {
      setSelectedFileName('');
      setFileSizeError('');
      setSelectedFile(null);
    }
  };
 






  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: '',
  });


  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  const [prevCont, setPrevCont] = useState('us')



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(selectedFile, "isuuee")
    // Validation logic
    const newErrors = {
      firstName: firstName ? '' : 'First name is required',
      lastName: lastName ? '' : 'Last name is required',
      email: emailRegex.test(email) ? '' : 'Email address is required',
      phoneNumber: phoneNumber.slice(prevCont.length).trim() ? '' : 'Phone number is required',
      message: message ? '' : 'Message is required',
    };
    setErrors(newErrors);
    if (form.current && Object.values(newErrors).every((err) => !err)) {
      setIsSubmitting(true);
      const file = fileInputRef.current?.files?.[0];
      const formData = new FormData(form.current);
      if (file) {
        formData.append('attachment', file);
      }
      emailjs
        .sendForm('service_1lawvxm', 'template_wfoo6zc', form.current, {
          publicKey: 'XGFM59HCeodn-jEDl',
        })
        .then(
          (response: any) => {
            console.log('SUCCESS!', response);
            toast.success('Your form has been submitted!');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhoneNumber(prevCont);
            setMessage('');
            setSelectedFileName(''); // Clear the selected file name
            setSelectedIssue(''); // Clear the selected issue
            if (fileInputRef.current) {
              fileInputRef.current.value = ''; // Clear the file input value
            }
            setIsSubmitting(false);
          },
          (error: any) => {
            console.error('FAILED...', error);
            setIsSubmitting(false);
          }
        );
    }
  };




  const handleStateChange = (selectedOption: any) => {
    setSelectedIssue(selectedOption.value);
  };

  const options = [
    { value: 'OWE', label: 'OWE' },
    { value: 'OWE 2', label: 'OWE 2' },
    { value: 'OWE 3', label: 'OWE 3' },
  ];

  // const handleFileInputChange = (e: FormInput) => {
  //   const file = e.target.files?.[0];
  //   const maxSize = 10 * 1024 * 1024; // 10 MB in bytes

  //   if (file) {
  //     const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf'];
  //     const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

  //     if (!allowedExtensions.includes(fileExtension)) {
  //       setSelectedFileName('');
  //       setFileSizeError('Only PNG, JPG, and PDF files are allowed');
  //       return;
  //     }

  //     if (file.size <= maxSize) {
  //       setSelectedFileName(file.name);
  //       setFileSizeError('');
  //       // Perform further actions with the selected file
  //     } else {
  //       setSelectedFileName('');
  //       setFileSizeError('File size exceeds the limit of 10 MB');
  //     }
  //   } else {
  //     setSelectedFileName('');
  //     setFileSizeError('');
  //   }
  // };

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Trigger file input click event
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.replace(/\s/g, ''); // Trim the input value

    if (name === 'email') {
      if (trimmedValue.length > 0) {
        setEmail(trimmedValue); // Update the email state with the trimmed value

        if (!emailRegex.test(trimmedValue)) {
          setErrors({ ...errors, email: 'Please enter a valid email address.' });
        } else {
          setErrors({ ...errors, email: '' });
        }
      } else {
        setEmail(''); // Clear the email state if the trimmed value is empty
        setErrors({ ...errors, email: 'Please enter an email address.' });
      }
    }
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
                  name="firstName"
                  placeholder={'Enter First Name'}
                  maxLength={100}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                      setFirstName(inputValue);
                      setErrors({ ...errors, firstName: '' });
                    } else {
                      setErrors({ ...errors, firstName: 'Only letters are allowed' });
                    }
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
                  maxLength={100}
                  placeholder={'Enter Last Name'}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                      setLastName(inputValue);
                      setErrors({ ...errors, lastName: '' });
                    } else {
                      setErrors({
                        ...errors,
                        lastName: 'Only letters are allowed',
                      });
                    }
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
                  placeholder={'email@mymail.com'}
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    if (e.key === ' ') {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="create-input-field-support" style={{ marginTop: '-10px' }}>
                <label className="inputLabel">Phone Number</label>
                <PhoneInput
                  countryCodeEditable={false}
                  disableCountryGuess={true}
                  enableSearch
                  country={"us"}
                  value={phoneNumber}
                  onChange={(value, prevCont) => {
                    setPhoneNumber(value || '');
                    //@ts-ignore
                    setPrevCont(prevCont.dialCode as string)
                    setErrors({ ...errors, phoneNumber: '' });
                  }}
                  placeholder="Enter phone number"
                />
                <input
                  type="hidden"
                  name="phoneNumber"
                  value={phoneNumber}
                />
                {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
              </div>
            </div>

            <div className="create-input-container-support" >
              <div className="create-input-field-support">
                <label className="inputLabel-select select-type-label" style={{ marginTop: "1px" }}>
                  Issue
                </label>
                <SelectOption
                  marginTop="17px"
                  onChange={handleStateChange}
                  options={options}
                  value={options?.find(
                    (option) => option.value === selectedIssue
                  )}
                />
                <input
                  type="hidden"
                  name="selectedIssue"
                  value={selectedIssue}
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
                    className="file-input"
                    onChange={handleFileInputChange}
                  //  name="attachment"
                    />
                  <div className="custom-button-container">
                    <span className="file-input-placeholder">
                      {selectedFileName || '.jpg .jpeg .png .pdf'}
                    </span>
                    <button className="custom-button" onClick={handleButtonClick}>
                      Browse
                    </button>
                  </div>
                </div>
                {fileSizeError && <span className="error">{fileSizeError}</span>}
              </div>
            </div>

            <div className="create-input-field-note-support">
              <label htmlFor="" className="inputLabel-support" >Message</label>
              <br />
              <textarea
                name="message"
                id=""
                rows={4}
                value={message}
                placeholder="Type here..."
                style={{ marginTop: '0.3rem' }}
                maxLength={300}
                onChange={(e) => {
                  const trimmedValue = e.target.value.trimStart();
                  // const singleSpaceValue = trimmedValue.replace(/\s+/g, ' ');
                  setMessage(trimmedValue);
                  setErrors({ ...errors, message: '' });
                }}
              ></textarea>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: message.length === 300 ? 'red' : 'inherit' }}>
                  {message.length}/300 characters
                </span>
                {errors.message && <span className="error">{errors.message}</span>}
              </div>
            </div>

            <div className="reset-Update-support">
              <button type="submit" disabled={isSubmitting}>Submit</button>
              {/* <ActionButton title={"Submit"} type="submit" onClick={() => {handleSubmit}} /> */}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default TechnicalSupport;
