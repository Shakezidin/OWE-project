import React, { useEffect, useState } from 'react'
import classes from '../styles/confirmmodal.module.css';
import Input from '../../components/text_input/Input';
import { validateEmail } from '../../../utiles/Validation';
import { ICONS } from '../../../resources/icons/Icons';
import { RiArrowDropDownLine } from 'react-icons/ri';

interface FormInput
    extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> { }

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose }) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [emailError, setEmailError] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email_id: '',
        mobile_number: '',
        address: '',
        zip_code: '',
        notes: '',
    });
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
    const handleConfrm = () => {
        onClose();
    }

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose]);

    return (
        <>
            {(isOpen || isVisible) && (
                <div className={`${classes.editmodal_transparent_model} ${isOpen ? classes.open : classes.close}`}>
                    <div className={classes.customer_wrapper_list_edit}>

                        <div className={classes.Edit_DetailsMcontainer}>
                            <div className={classes.edit_closeicon} onClick={onClose}>
                                <RiArrowDropDownLine style={{ height: "34px", width: "34px", fontWeight: "400" }} />
                            </div>
                            <div className={classes.notEditable}>
                                <div className={classes.Column1Details}>
                                    <span className={classes.main_name}>Adam Samson</span>
                                    <span className={classes.mobileNumber}>+91 8739273728</span>
                                </div>
                                <div className={classes.Column2Details}>
                                    <span className={classes.addresshead}>
                                        12778 Domingo Ct, Parker, COLARDO, 2312
                                    </span>
                                    <span className={classes.emailStyle}>
                                        Sampletest@gmail.com{' '}
                                        <span className={classes.verified}>
                                            <svg
                                                className={classes.verifiedMarked}
                                                width="13"
                                                height="13"
                                                viewBox="0 0 13 13"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_6615_16896)">
                                                    <path
                                                        d="M6.08 0.425781C2.71702 0.425781 0 3.13967 0 6.50578C0 9.87189 2.71389 12.5858 6.08 12.5858C9.44611 12.5858 12.16 9.87189 12.16 6.50578C12.16 3.13967 9.44302 0.425781 6.08 0.425781Z"
                                                        fill="#20963A"
                                                    />
                                                    <path
                                                        d="M8.99542 4.72214C8.8347 4.56137 8.59049 4.56137 8.42668 4.72212L5.30786 7.84096L3.72834 6.26146C3.56762 6.10074 3.32341 6.10074 3.1596 6.26146C2.99888 6.42219 2.99888 6.66637 3.1596 6.8302L5.02346 8.69406C5.10383 8.77443 5.18418 8.81461 5.30784 8.81461C5.42839 8.81461 5.51185 8.77443 5.59222 8.69406L8.99542 5.29088C9.15614 5.13016 9.15614 4.886 8.99542 4.72214Z"
                                                        fill="white"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_6615_16896">
                                                        <rect
                                                            width="12.16"
                                                            height="12.16"
                                                            fill="white"
                                                            transform="translate(0 0.421875)"
                                                        />
                                                    </clipPath>
                                                </defs>
                                            </svg>{' '}
                                            Verified
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <div className={classes.inputFields}>
                                <Input
                                    type="text"
                                    value={formData.first_name}
                                    placeholder="+91 8127577509"
                                    onChange={handleInputChange}
                                    name="first_name"
                                    maxLength={100}
                                // backgroundColor="#9cc3fb"
                                />
                                <Input
                                    type="text"
                                    value={formData.first_name}
                                    placeholder="johndoe1234@gmail.com"
                                    onChange={handleInputChange}
                                    name="first_name"
                                    maxLength={100}
                                // backgroundColor="#9cc3fb"
                                />
                                <Input
                                    type="text"
                                    value={formData.first_name}
                                    placeholder="12778 Domingo Ct, Parker, COLARDO, 2312"
                                    onChange={handleInputChange}
                                    name="first_name"
                                    maxLength={100}
                                // backgroundColor="#9cc3fb"
                                />
                            </div>

                            <div className={classes.survey_button} style={{ paddingBottom: "38px" }}>
                                <button
                                    className={classes.self}
                                    style={{ color: '#fff', border: 'none', fontWeight: "500", fontSize: "14px" }}
                                    onClick={handleConfrm}
                                >
                                    CONFIRM
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EditModal
