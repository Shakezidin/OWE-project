import React, { useEffect, useRef } from 'react';
import classes from '../Modals/FormModal.module.css';
import { useState } from 'react';
import { validateEmail } from '../../../utiles/Validation';
import Input from '../../components/text_input/Input';
import PhoneInput from 'react-phone-input-2';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { RiMapPinLine } from 'react-icons/ri';
import MicroLoader from '../../components/loader/MicroLoader';
import { TYPE_OF_USER } from '../../../resources/static_data/Constant';
import CustomSelect from '../components/CustomSelect';

interface SaleData {
  id: number;
  name: string;
  role: string;
}
interface SetterData {
  id: number;
  name: string;
  role: string;
}
interface LocationInfo {
  lat: number;
  lng: number;
  unique_id: string;
  home_owner: string;
  project_status: string;
}
interface FormInput
  extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}

interface EditModalProps {
  leadData: any;
  loading: boolean;
  onClose: () => void;
  refresh: number;
  setRefresh: (value: number | ((prevValue: number) => number)) => void;
}

const FormModal: React.FC<EditModalProps> = ({
  leadData,
  loading,
  onClose,
  refresh,
  setRefresh,
}) => {
  const [saleData, setSaleData] = useState<SaleData[]>([]);
  const [setterData, setSetterData] = useState<SetterData[]>([]);
  const [selectedSale, setSelectedSale] = useState<SaleData | null>(null);
  const [selectedSetter, setSelectedSetter] = useState<SetterData | null>(null);
  const [saleId, setSaleId] = useState<number | string>(0);
  const [setterId, setSetterId] = useState<number | string>(0);
  console.log(saleId, 'dhsghgfdsfghdsfdhsghfdhs');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email_id: '',
    mobile_number: '',
    address: '',
    notes: '',
    lead_source: '',
  });
  console.log(setterData, 'form data consoling ');
  useEffect(() => {
    if (leadData && setterData) {
      const salesRepId =
        saleData.find((setter) => setter.name === leadData.sales_rep_name)
          ?.id || '';

      const setterId =
        setterData.find((setter) => setter.name === leadData.setter_name)?.id ||
        '';

      console.log(salesRepId, 'show this');

      setFormData({
        first_name: leadData.first_name || '',
        last_name: leadData.last_name || '',
        email_id: leadData.email_id || '',
        mobile_number: leadData.phone_number || '',
        address: leadData.street_address || '',
        notes: leadData.notes || '',
        lead_source: leadData.lead_source || '',
      });
      setSaleId(salesRepId);
      setSetterId(setterId);
    }
  }, [leadData, setterData]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Added for validation errors // Added for validation error message
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [setterError, setSetterError] = useState('');
  const [load, setLoad] = useState(false);
  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    const allowedPattern = /^[A-Za-z\s]+$/;

    if (name === 'first_name' || name === 'last_name') {
      // Only allow letters, spaces, $ and _
      const sanitizedValue = value.replace(/[^A-Za-z\s$_]/g, '');

      if (sanitizedValue === value) {
        // Only update if no characters were stripped
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
    } else if (name === 'address') {
      const regex = /^[a-zA-Z0-9,\s]*$/;
      const consecutiveSpacesRegex = /\s{2,}/;

      if (regex.test(value) && !consecutiveSpacesRegex.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        errors.address = '';
      }
    } else if (name === 'lead_source') {
      if (value === '' || allowedPattern.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
        const err = { ...errors };
        delete err[name];
        setErrors(err);
      }
    } else if (name === 'notes') {
      const sanitizedValue = value.replace(/\s+/g, ' ');
      setFormData((prevData) => ({
        ...prevData,
        [name]: sanitizedValue,
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
  const validateForm = (formData: any) => {
    const errors: { [key: string]: string } = {};

    if (formData.first_name.trim() === '') {
      errors.first_name = 'First Name is required';
    }
    if (formData.last_name.trim() === '') {
      errors.last_name = 'Last Name is required';
    }
    if (formData.email_id.trim() === '') {
      errors.email_id = 'Email is required';
    }
    if (formData.mobile_number.trim() === '') {
      errors.mobile_number = 'Phone number is required';
    }
    if (formData.address.trim() === '') {
      errors.address = 'Address is required';
    }
    if (formData.lead_source.trim() === '') {
      errors.lead_source = 'Lead Source is required';
    }
    if (!selectedSale && saleId == '') {
      errors.sales_rep = 'Sales Rep is required';
    }
    if (!selectedSetter && setterId == '') {
      errors.setterError = 'Setter is required';
    }
    return errors;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const errors = validateForm(formData);
    setErrors(errors);

    if (
      Object.keys(errors).length === 0 &&
      emailError === '' &&
      phoneNumberError === ''
    ) {
      setLoad(true);

      try {
        const response = await postCaller(
          'edit_leads',
          {
            leads_id: leadData.leads_id,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.mobile_number,
            email_id: formData.email_id,
            street_address: formData.address,
            notes: formData.notes,
            lead_source: formData.lead_source,
            salerep_id: selectedSale ? selectedSale?.id : saleId,
            setter_id: selectedSetter ? selectedSetter?.id : setterId,
          },
          true
        );

        if (response.status === 200) {
          toast.success('Lead Updated Successfully');
          setRefresh((val) => val + 1);
          onClose(); // Close the modal on successful submission
        } else if (response.status >= 201) {
          toast.warn(response.message);
        }
        setLoad(false);
      } catch (error) {
        setLoad(false);
        console.error('Error submitting form:', error);
      }
    }
  };
  const [isAuthenticated, setAuthenticated] = useState(false);
  const { authData, saveAuthData } = useAuth();
  const [loadselect, setIsLoadSelect] = useState(false);
  useEffect(() => {
    const isPasswordChangeRequired =
      authData?.isPasswordChangeRequired?.toString();
    setAuthenticated(isPasswordChangeRequired === 'false');
  }, [authData]);
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          setIsLoadSelect(true);
          const response = await postCaller(
            'get_users_under',
            {
              roles: ['Sale Representative', 'Appointment Setter'],
            },
            true
          );

          if (response.status === 200) {
            setSaleData(response.data['Sale Representative']);
            setSetterData(response.data['Appointment Setter']);
          } else if (response.status > 201) {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadSelect(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);
  const handleSaleChange = (selectedOption: SaleData | null) => {
    setSelectedSale(selectedOption);
    errors.sales_rep = '';
  };
  const handleSetterChange = (selectedOption: SaleData | null) => {
    setSelectedSetter(selectedOption);
    errors.setterError = '';
  };
  console.log(selectedSale, 'sdaghfgfhdsa');
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDestipqgaIX-VsZUuhDSGbNk_bKAV9dX0',
    libraries: ['places'],
  });
  const [searchValue, setSearchValue] = useState<any>('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isInputFocused, setInputFocused] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [locations, setLocations] = useState<LocationInfo[]>([]);
  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.geometry || !place.geometry.location) {
      console.log('No details available for the selected place.');
      return;
    }

    const selectedAddress = place.formatted_address || place.name || '';
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: selectedAddress,
    }));
    setSearchValue(selectedAddress);
  };
  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    console.log(autocomplete, '');
    autocompleteRef.current = autocomplete;
  };
  const [role, setRole] = useState('');
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);
  return (
    <div className={classes.ScrollableDivRemove}>
      <div
        style={{ paddingRight: '12px' }}
        className={`flex justify-between ${classes.h_screen}`}
      >
        <div className={classes.customer_wrapper_list}>
          {loading ? (
            <div
              style={{ height: '50vh' }}
              className="flex items-center justify-center"
            >
              <MicroLoader />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
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
                            maxLength={18}
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
                            maxLength={17}
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
                        <div className={classes.srs_new_create}>
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
                              const numberLength = value.toString();
                              const numberWithoutCountryCode =
                                phoneNumber.replace(/^\+?\d{1,3}/, '');
                              if (/^0{8}/.test(numberWithoutCountryCode)) {
                                setPhoneNumberError(
                                  'Invalid number, number cannot consist of consecutive zeros.'
                                );
                              }
                              else if (
                                numberLength.length > 0 &&
                                numberLength.length < 11
                              ) {
                                setPhoneNumberError(
                                  'Please enter at least 10 digits.'
                                );
                              } else {
                                setPhoneNumberError('');
                              }
                              setFormData((prevData) => ({
                                ...prevData,
                                mobile_number: phoneNumber,
                              }));
                              if (phoneNumber.trim() !== '') {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  mobile_number: '',
                                }));
                              }
                            }}
                          />
                          {(phoneNumberError || errors.mobile_number) && (
                            <p className="error">
                              {phoneNumberError || errors.mobile_number}
                            </p>
                          )}
                        </div>
                        <div className={classes.srs_new_create}>
                          <Input
                            type="email"
                            label="Email"
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
                            <div className="error">
                              {emailError || errors.email_id}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={classes.salrep_input_container}>
                        <div className={classes.srs_new_create}>
                          <div className={classes.custom_label_newlead}>
                            Address
                          </div>
                          {isLoaded && (
                            <Autocomplete
                              onLoad={onLoad}
                              onPlaceChanged={onPlaceChanged}
                            >
                              <div className={classes.inputWrap}>
                                <input
                                  type="text"
                                  placeholder="Enter address"
                                  maxLength={100}
                                  className={`${classes.inputsearch} ${isInputFocused ? classes.focused : ''}`}
                                  style={{
                                    width: '100%',
                                    padding: '8px 2rem',
                                  }}
                                  onFocus={() => setInputFocused(true)}
                                  onBlur={() => setInputFocused(false)}
                                  onChange={handleInputChange}
                                  value={formData.address}
                                  name="address"
                                />
                                {searchValue && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSearchValue('');
                                      setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        address: '',
                                      }));
                                      if (mapRef.current) {
                                        const bounds =
                                          new google.maps.LatLngBounds();
                                        locations.forEach((location) => {
                                          bounds.extend(
                                            new google.maps.LatLng(
                                              location.lat,
                                              location.lng
                                            )
                                          );
                                        });
                                        mapRef.current.fitBounds(bounds);
                                      }
                                    }}
                                    style={{
                                      position: 'absolute',
                                      right: '8px',
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                      background: 'transparent',
                                      border: 'none',
                                      cursor: 'pointer',
                                    }}
                                  ></button>
                                )}
                                <RiMapPinLine
                                  className={`${classes.inputMap} ${isInputFocused ? classes.focused : ''}`}
                                />
                              </div>
                            </Autocomplete>
                          )}
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
                        {/* Setter Field */}
                        <div className={classes.srs_new_create}>
                          <div className={classes.custom_label_newlead}>
                            Setter
                          </div>
                          <CustomSelect<SetterData>
                            value={
                              selectedSetter ||
                              setterData.find(
                                (option) => option.name === leadData.setter_name
                              ) ||
                              null
                            }
                            onChange={handleSetterChange}
                            options={setterData}
                            isVisible={true}
                            placeholder="Select Setter"
                            width="100%"
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id.toString()}
                          />
                          {(setterError || errors.setterError) && (
                            <div className="error">
                              {setterError || errors.setterError}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={classes.salrep_input_container}>
                        <div className={classes.srs_new_create}>
                          <Input
                            type="text"
                            label="Lead Source"
                            value={formData.lead_source}
                            placeholder="Enter About Lead Source"
                            onChange={handleInputChange}
                            name="lead_source"
                            maxLength={30}
                          />
                          {errors.lead_source && (
                            <span
                              style={{
                                display: 'block',
                              }}
                              className="error"
                            >
                              {errors.lead_source}
                            </span>
                          )}
                        </div>
                        {/* Sales Rep Field */}
                        <div className={classes.srs_new_create}>
                          <div className={classes.custom_label_newlead}>
                            Sales Rep
                          </div>
                          <CustomSelect<SaleData>
                            value={
                              selectedSale ||
                              saleData.find(
                                (option) =>
                                  option.name === leadData.sales_rep_name
                              ) ||
                              null
                            }
                            onChange={(newValue) => handleSaleChange(newValue)}
                            options={saleData}
                            isVisible={
                              role === TYPE_OF_USER.ADMIN ||
                              role === TYPE_OF_USER.DEALER_OWNER ||
                              role === TYPE_OF_USER.SUB_DEALER_OWNER ||
                              role === TYPE_OF_USER.REGIONAL_MANGER ||
                              role === TYPE_OF_USER.SALE_MANAGER
                            }
                            placeholder="Select Sales Rep"
                            width="100%"
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id.toString()}
                          />
                          {errors.sales_rep && (
                            <span
                              style={{
                                display: 'block',
                              }}
                              className="error"
                            >
                              {errors.sales_rep}
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
                            maxLength={300}
                            value={formData.notes}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Write"
                          ></textarea>
                          <p
                            className={`character-count ${
                              formData.notes.trim().length >= 300
                                ? 'exceeded'
                                : ''
                            }`}
                          >
                            {formData.notes.trim().length}/300 characters
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.srActionButton}>
                <button
                  className={classes.submitbut}
                  disabled={load}
                  onClick={handleSubmit}
                  style={{ pointerEvents: load ? 'none' : 'auto' }}
                >
                  {load ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormModal;
