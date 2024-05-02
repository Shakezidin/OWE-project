import React, { useState } from 'react';
import './ChangePassword.css';
import Input from '../../../components/text_input/Input';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../../../redux/hooks';
import { changePasswordAction } from '../../../../redux/apiActions/authActions';
import { unwrapResult } from '@reduxjs/toolkit';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';

interface ChangePasswordProps {
    handleOpenNClose: ()=> void
}
const ChangePassword: React.FC<ChangePasswordProps> = ({handleOpenNClose}) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const dispatch = useAppDispatch();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (currentPassword.length === 0){
            toast.info('Please enter current password.')
        }else if (newPassword.length === 0){
            toast.info('Please enter new password.')
        }
        else if (confirmPassword.length === 0){
            toast.info('Please enter confirm password.')
        }else if (confirmPassword !== newPassword){
            toast.info('Confirm password does not matched with New password.')
        }else{

            const actionResult = await dispatch(changePasswordAction({ new_password: newPassword, current_password: currentPassword }));
            const result = unwrapResult(actionResult);
            if (result.status === HTTP_STATUS.OK) {
               toast.success(result.message);
               localStorage.setItem('is_password_change_required','false')
               window.location.reload()
             
            }else{
              toast.error(result.message);
            }
        }
    };
   

    return (
        <div className="transparent-model">
            <div className="changepass-change-password">
                {/* <div
                    className="changepass-cross-btn"
                    onClick={handleOpenNClose}
                >
                    <img src={ICONS.cross} alt="" />
                </div> */}
                <h2>Change Password</h2>
                <p>Enter the below detail to reset your default password</p>
                <form style={{alignItems:'center', justifyContent:'center'}} onSubmit={handleSubmit}>
                    <div className="changepass-form-group">
                        <Input 
                            type= {showCurrentPassword ? 'text': 'password' }
                            name={'currentPassword'} 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current Password"  
                            isTypePassword={true}   
                            onClickEyeIcon={() => {
                                setShowCurrentPassword(!showCurrentPassword);
                              }}       
                        />
                    </div>
                    <div className="changepass-form-group">
                        <Input 
                            type= {showNewPassword ? 'text': 'password'}
                            name={'newPassword'} 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password" 
                            isTypePassword={true}   
                            onClickEyeIcon={() => {
                                setShowNewPassword(!showNewPassword);
                              }}           
                        />
                        
                    </div>
                    <div className="changepass-form-group">
                         <Input 
                            type={showConfirmPassword ? 'text': 'password'}
                            name={'confirmPassword'} 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"  
                            isTypePassword={true} 
                            onClickEyeIcon={() => {
                                setShowConfirmPassword(!showConfirmPassword);
                              }}              
                        />
                    </div>
                    <button className="changepass-button" style={{width:'100%'}} type="submit">
                        Submit
                    </button>
                   
                </form>
              
            </div>
        </div>
    );
};

export default ChangePassword;