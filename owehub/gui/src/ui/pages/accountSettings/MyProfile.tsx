import React, { useState, useEffect } from 'react';
import Input from '../../components/text_input/Input';
import { ICONS } from '../../icons/Icons';
import { ActionButton } from '../../components/button/ActionButton';
import SelectOption from '../../components/selectOption/SelectOption';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  getUser,
  updateUser,
} from '../../../redux/apiActions/GetUser/getUserAction';
import { stateOption } from '../../../core/models/data_models/SelectDataModel';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../infrastructure/web_api/api_client/EndPoints';
import { toast } from 'react-toastify';
 
const MyProfile = () => {
  const [stateOptions, setStateOptions] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { userDetail, userUpdate } = useAppSelector((state) => state.userSlice);
  const [name, setName] = useState<String>(userDetail?.name);
  const userRole = userDetail?.role_name;
  const userName = userDetail?.name;
  const [isEditMode, setIsEditMode] = useState(true);
  const [newFormData, setNewFormData] = useState<any>([]);
 
  const tableData = {
    tableNames: [
      'partners',
      'states',
      'installers',
      'owe_cost',
      'loan_type',
      'tier',
    ],
  };
 
  useEffect(() => {
    dispatch(getUser({ page_number: 1, page_size: 10 }));
    fetchStateOptions()
      .then((options) => {
        setStateOptions(options);
      })
      .catch((error) => {
        console.error('Error fetching state options:', error);
      });
  }, []);
 
  useEffect(() => {
    if (userDetail) {
      setStreet(userDetail?.street_address || '');
      setState(userDetail?.state || '');
      setCity(userDetail?.city || '');
      // setZipCode(userDetail?.zipcode || '');
      setCountry(userDetail?.country || '');
    }
  }, [userDetail]);
 
  useEffect(() => {
    if (userName) {
      const firstLetter = userName.charAt(0).toUpperCase();
      setName(firstLetter);
    }
  }, [userName]);
 
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);
 
  const updateSubmit = () => {
    const data = {
      user_code: userDetail.user_code,
      name: userDetail.name,
      street_address: street,
      // zipcode: zipCode,
      country: country,
      city: city,
      state: state,
    };
    Promise.resolve(dispatch(updateUser(data))).then(() => {
      toast.success('Successfully Updated');
      setIsEditMode(!isEditMode);
    });
  };
 
  const handleReset = () => {
    setCity(userDetail.city);
    setStreet(userDetail.street_address);
    // setZipCode('');
    setCountry(userDetail.country);
    setState(userDetail.state);
  };

  const handleStreetChange = (e:any) => {
    const value = e.target.value;
    const streetRegex = /^[a-zA-Z0-9\s,.'-]{0,100}$/
    if(streetRegex.test(value)){
      setStreet(value);
      setErrors({...errors, street: ''})
    }else{
      setErrors({...errors, street: "Enter valid street"})
    }
  }

  const handleCityChange = (e:any) => {
    const value = e.target.value;
    const cityRegex = /^[a-zA-Z\u0080-\u024F\s'-]{0,100}$/;

    if (cityRegex.test(value)) {
      setCity(value);
      setErrors({ ...errors, city: '' });
    } else {
      setErrors({ ...errors, city: 'Enter valid city' });
    }
  };

  const handleCountryChange = (e:any) => {
    const value = e.target.value;
    const countryRegex = /^[a-zA-Z\u0080-\u024F\s'-]{0,100}$/;

    if (countryRegex.test(value)) {
      setCountry(value);
      setErrors({ ...errors, country: '' });
    } else {
      setErrors({ ...errors, country: 'Enter valid country' });
    }
  };
 
  const fetchStateOptions = async () => {
    const response = await fetch('https://api.example.com/states');
    const data = await response.json();
    return data.map((state: string) => ({ value: state, label: state }));
  };
 
  const handleStateChange = (selectedOption: any) => {
    setSelectedState(selectedOption.value);
  };
 
  const [city, setCity] = useState(userDetail?.city || '');
  const [street, setStreet] = useState(userDetail?.street_address || '');
  // const [zipCode, setZipCode] = useState(userDetail?.zipcode || '');
  const [country, setCountry] = useState(userDetail?.country || '');
  const [state, setState] = useState(userDetail?.state || '');
 
  const [errors, setErrors] = useState({
    street: '',
    country: '',
    city: '',
    state: '',
  });
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditMode) {
      const newErrors = {
        city: city ? '' : 'City is required',
        street: street ? '' : 'Street is required',
        country: country ? '' : 'Country is required',
        state: state ? '' : 'State is required',
      };
      setErrors(newErrors);
      // @ts-ignore
      if(Object.keys(newErrors).every(it=>!newErrors[it])){
        updateSubmit()
      }
       // @ts-ignore
      console.log(Object.keys(newErrors).every(it=>!newErrors[it]),"errr")
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="myProf-section">
          <div className="">
            <p>My Profile</p>
          </div>
          <div className="admin-section">
            <div className="profile-img">{name}</div>
 
            <div className="caleb-container">
              <div className="caleb-section">
                <h3>{userName}</h3>
                <p>{userRole}</p>
              </div>
            </div>
          </div>
 
          <div className="Personal-container">
            <div className="personal-section">
              <div className="">
                <p>Personal Information</p>
              </div>
              {/* <div className="edit-section">
                <img src={ICONS.editIcon} alt="" />
                <p>Edit</p>
              </div> */}
            </div>
 
            <div
              className="create-input-container"
              style={{ padding: '0.5rem', marginLeft: '1rem' }}
            >
              <div className="create-input-field-profile">
                <Input
                  type={'text'}
                  label="Name"
                  value={userDetail?.name}
                  name="fee_rate"
                  placeholder={'Enter'}
                  onChange={(e) => {}}
                  disabled
                />
              </div>
              <div className="create-input-field-profile">
                <Input
                  type={'text'}
                  label="Email"
                  value={userDetail?.email_id}
                  name="fee_rate"
                  placeholder={'Enter'}
                  onChange={(e) => {}}
                  disabled
                />
              </div>
              <div className="create-input-field-profile">
                <Input
                  type={'text'}
                  label="Phone Number"
                  value={userDetail?.mobile_number}
                  name="fee_rate"
                  placeholder={'Enter'}
                  onChange={(e) => {}}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="Personal-container-detail">
            <div className="personal-section">
              <div className="">
                <p>Address Detail</p>
              </div>
              <div
                className={`edit-section ${!isEditMode ? 'active-edit-section' : ''}`}
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  setErrors({
                    street: '',
                    country: '',
                    city: '',
                    state: '',
                  });
                }}
              >
                <img src={ICONS.editIcon} alt="" />
                <p>Edit</p>
              </div>
            </div>
            <div
              className="create-input-container"
              style={{ padding: '0.5rem', marginLeft: '1rem', gap: '2.8%' }}
            >
              <div className="create-input-field-address">
                <Input
                  type={'text'}
                  label="Street"
                  value={street}
                  name=""
                  placeholder={'Enter'}
                  onChange={handleStreetChange}
                  disabled={isEditMode}
                />
                {errors.street && (
                  <span className="error">{errors.street}</span>
                )}
              </div>
              <div className="create-input-field-address">
                <label className="inputLabel-select prof-fields-onboard">
                  State
                </label>
                <SelectOption
                  options={stateOption(newFormData)}
                  onChange={(newValue) => {
                    setState(newValue?.value)
                    setErrors(prev=>({...prev,state:""}))
                  }}
                  value={stateOption(newFormData)?.find(
                    (option) => option.value === state
                  )}
                  disabled={isEditMode}
                />
                {errors.state && (
                  <span className="error">{errors.state}</span>
                )}
              </div>
              <div className="create-input-field-address">
                <Input
                  type={'text'}
                  label="City"
                  value={city}
                  name=""
                  placeholder={'Enter'}
                  onChange={handleCityChange}
                  disabled={isEditMode}
                />
                {errors.city && <span className="error">{errors.city}</span>}
              </div>
            </div>
            <div
              className="create-input-container"
              style={{ padding: '0.5rem', marginLeft: '1rem', gap: '24px' }}
            >
              {/* <div className="create-input-field-address">
                <Input
                  type={'text'}
                  label="Zip Code"
                  value={zipCode}
                  name=""
                  placeholder={'Enter'}
                  onChange={(e) => {
                    setZipCode(e.target.value);
                    setErrors({ ...errors, zipCode: '' });
                  }}
                  disabled={isEditMode}
                />
                {errors.zipCode && (
                  <span className="error">{errors.zipCode}</span>
                )}
              </div> */}
              <div className="create-input-field-address">
                <Input
                  type={'text'}
                  label="Country"
                  value={country}
                  name=""
                  placeholder={'Enter'}
                  onChange={handleCountryChange}
                  disabled={isEditMode}
                />
                {errors.country && (
                  <span className="error">{errors.country}</span>
                )}
              </div>
            </div>
          </div>
          <div className="">
            <div className="profile-reset">
              <ActionButton
                title={'Reset'}
                type="reset"
                onClick={() => {
                  !isEditMode && handleReset();
                }}
              />
              <ActionButton
                title={'Update'}
                type="submit"
                onClick={() => {
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
 
export default MyProfile;