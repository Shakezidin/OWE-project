import React, { useState } from 'react';
import './ChangePassword.css';
import { ICONS } from '../../../icons/Icons';

const ChangePassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Current Password:', currentPassword);
        console.log('New Password:', newPassword);
        console.log('Confirm Password:', confirmPassword);
        console.log('Remember Me:', rememberMe);
    };
    const handleClose = () => {
        setIsOpen(false);
      };
    
      if (!isOpen) {
        return null;
      }
    

    return (
        <div className="transparent-model">
            <div className="changepass-change-password">
                <div
                    className="changepass-cross-btn"
                    onClick={handleClose}
                >
                    <img src={ICONS.cross} alt="" />
                </div>
                <h2>Change Password</h2>
                <p>Enter the below detail to reset your default password</p>
                <form onSubmit={handleSubmit}>
                    <div className="changepass-form-group">
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current Password"
                        />
                    </div>
                    <div className="changepass-form-group">
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                        />
                    </div>
                    <div className="changepass-form-group">
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                        />
                    </div>
                    <div className="changepass-form-group">
             
                    </div>
                    <button className="changepass-button" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;