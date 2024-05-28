import React, { useState } from 'react';
import './ResetPassword.css';
import { ReactComponent as LOGO_SMALL } from '../../../resources/assets/commisson_small_logo.svg';
import { ReactComponent as UNDER_LINE } from '../../../resources/assets/BlueAndGreenUnderline.svg';
import { ICONS } from '../../icons/Icons';

import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/text_input/Input';
import { ActionButton } from '../../components/button/ActionButton';
import { resetPassword } from '../../../core/models/api_models/AuthModel';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { generateOTP } from '../../../redux/apiActions/auth/authActions';
import { HTTP_STATUS } from '../../../core/models/api_models/RequestModel';
import { toast } from 'react-toastify';
import { updateEmail } from '../../../redux/apiSlice/authSlice/resetPasswordSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import Loading from '../../components/loader/Loading';
import { FaArrowLeft } from 'react-icons/fa';
import { ROUTES } from '../../../routes/routes';
import {
  FormEvent,
  FormInput,
} from '../../../core/models/data_models/typesModel';

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [credentials, setCredentials] = useState<resetPassword>({
    email_id: '',
  });
  const { loading } = useAppSelector((state) => state.resetPassword);

  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  /** on submit  */
  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (credentials.email_id.length === 0) {
      toast.warning('Please enter email Id.');
    } else {
      const actionResult = await dispatch(
        generateOTP({ email_id: credentials.email_id })
      );
      const result = unwrapResult(actionResult);
      if (result.status === HTTP_STATUS.OK) {
        dispatch(updateEmail(credentials.email_id));
        toast.success(result.message);
        navigate('/otp');
      } else {
        toast.error(result.message);
      }
    }
  };
  return (
    <div className="mainContainer">
      <div className={'overlay'} />
      <div className={'container'}>
        <div className={'loginBox'}>
          <span id="loginNormalText">
            {'Our World Revolves'}
            <br />
            Around
            <span id="loginColorText">{' Powering '}</span>
            Yours
          </span>
          <div className={'hrLine'}></div>
          <span className={'loginNormalTextDescription'}>
            {'YOUR TRUSTED SOLAR EXPERTS'}
          </span>
        </div>

        <div className={'loginBox2'}>
          <form onSubmit={(e) => handleEmailSubmit(e)}>
            <div className="loginTextView">
              <object
                type="image/svg+xml"
                className="loginImageLogo"
                data={ICONS.LOGO}
                aria-label="login-icon"
                height={60}
              ></object>
              <br />
              <div className="loginLogowithText">
                <LOGO_SMALL />
                <span className={'loginHeader'}>OWE HUB</span>
              </div>
              <div className="loginUnderLine">
                <UNDER_LINE />
              </div>
              <span className="loginLogText">Enter Your Email Address</span>
              <br />
              <Input
                type={'text'}
                value={credentials.email_id}
                name="email_id"
                placeholder={'Enter Email'}
                onChange={handleInputChange}
              />

              <br />
              <button
                className="login-button"
                title="Request OTP"
                type="submit"
                onClick={() => {}}
              >
                Request OTP
              </button>
              <Link to={ROUTES.LOGIN} className="loginGoBackLink">
                <FaArrowLeft />
                <span>Go back to login screen</span>
              </Link>
            </div>
          </form>
        </div>
        {loading && (
          <div>
            <Loading /> {loading}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
