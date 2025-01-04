import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { validateEmail } from '../../utiles/Validation';
import Input from '../scheduler/SaleRepCustomerForm/component/Input/Input';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import { reportingCaller } from '../../infrastructure/web_api/services/apiUrl';


interface FormInput
    extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> { }





const ReportFormModal = ({
    isOpen, handleClose
}: any) => {

    const [formData, setFormData] = useState({
        title: '',
        dashboard_id: '',
        subTitle: '',
        category: ''
    });
    const initialFormData = {
        title: '',
        dashboard_id: '',
        subTitle: '',
        category: ''
    };

    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Added for validation errors // Added for validation error message
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [setterError, setSetterError] = useState('');
    const [load, setLoad] = useState(false);
    const handleInputChange = (e: FormInput) => {
        const { name, value } = e.target;
        const allowedPattern = /^[A-Za-z\s]+$/;

        if (name === 'title' || name === 'subTitle' || name === 'category') {
            // Only allow letters, spaces, $ and _
            const sanitizedValue = value.replace(/[^A-Za-z\s$_]/g, '');

            if (sanitizedValue === value) { // Only update if no characters were stripped
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
                const err = { ...errors };
                delete err[name];
                setErrors(err);
            }
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

        if (formData.title.trim() === '') {
            errors.title = 'Title is required';
        }
        if (formData.dashboard_id.trim() === '') {
            errors.dashboard_id = 'Dashboard Id is required';
        }
        if (formData.subTitle.trim() === '') {
            errors.subTitle = 'Subtitle is required';
        }
        if (formData.category.trim() === '') {
            errors.category = 'Category is required';
        }
        return errors;
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const errors = validateForm(formData);
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            setLoad(true);
            try {
                const response = await reportingCaller(
                    'create_superset_report',
                    {
                        "title": formData.title,
                        "category": formData.category,
                        "subtitle": formData.subTitle,
                        "dashboard_id": formData.dashboard_id
                    },
                );
                if (response.status === 200) {
                    toast.success('Report Created Succesfully');
                    handleClose();
                    setFormData(initialFormData);
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
    return (
        <>
            {isOpen &&
                <div className="transparent-model">
                    <div className='rep-mod-top'>
                        <div className='ahj-header'>
                            <p>Create New Report</p>
                            <RxCross2 size={20} onClick={handleClose} style={{ cursor: "pointer" }} />
                        </div>
                        <div className='rep-inp-container'>
                            <div className="reportContainerModal">
                                <p className='title-label-report'>Title</p>
                                <input
                                    type="text"
                                    placeholder="Please Enter Title"
                                    onChange={handleInputChange}
                                    value={formData.title}
                                    name="title"
                                    maxLength={100}
                                    autoComplete="off"
                                />
                                {errors.title && (
                                    <span
                                        style={{
                                            display: 'block',
                                        }}
                                        className="error"
                                    >
                                        {errors.title}
                                    </span>
                                )}
                            </div>

                            <div className="reportContainerModal">
                                <p className='title-label-report'>Dashboard Id</p>
                                <input
                                    type="text"
                                    placeholder="Please Enter dashboard id"
                                    onChange={handleInputChange}
                                    value={formData.dashboard_id}
                                    name="dashboard_id"
                                    maxLength={100}
                                    autoComplete="off"
                                />
                                {errors.dashboard_id && (
                                    <span
                                        style={{
                                            display: 'block',
                                        }}
                                        className="error"
                                    >
                                        {errors.dashboard_id}
                                    </span>
                                )}
                            </div>

                            <div className="reportContainerModal">
                                <p className='title-label-report'>Subtitle</p>
                                <input
                                    type="text"
                                    value={formData.subTitle}
                                    placeholder="Please Enter Subtitle"
                                    onChange={handleInputChange}
                                    name="subTitle"
                                    maxLength={100}
                                    autoComplete="off"
                                />
                                {errors.subTitle && (
                                    <span
                                        style={{
                                            display: 'block',
                                        }}
                                        className="error"
                                    >
                                        {errors.subTitle}
                                    </span>
                                )}
                            </div>

                            <div className="reportContainerModal">
                                <p className='title-label-report'>Category</p>
                                <input
                                    type="text"
                                    placeholder="Please Enter Category"
                                    onChange={handleInputChange}
                                    value={formData.category}
                                    name="category"
                                    maxLength={100}
                                    autoComplete="off"
                                />
                                {errors.category && (
                                    <span
                                        style={{
                                            display: 'block',
                                        }}
                                        className="error"
                                    >
                                        {errors.category}
                                    </span>
                                )}
                            </div>

                            <div className='modal-submit-report'>
                                <button onClick={handleSubmit} style={{ backgroundColor: "rgb(62, 62, 208)", cursor: load ? "not-allowed" : "pointer" }}
                                    disabled={load}
                                >Submit</button>
                            </div>

                        </div>

                    </div>

                </div>
            }
        </>

    );
};

export default ReportFormModal;
