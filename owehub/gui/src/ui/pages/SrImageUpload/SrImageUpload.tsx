import React, { useState, useCallback, useRef, ChangeEvent, useEffect } from 'react';
import './srImageUpload.css';
import camera from './lib/camera 1.svg';
import plus from './lib/+.svg';
import { FaArrowRight } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import Webcam from 'react-webcam';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { IoIosReverseCamera } from "react-icons/io";
import { toast } from 'react-toastify';
import { FaArrowLeft } from "react-icons/fa";

const FormComponent: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showCameraLayout, setShowCameraLayout] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [useBackCamera, setUseBackCamera] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);

  const [address, setAddress] = useState<string>('');
  const [prospectName, setProspectName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot() ?? null;
    if (imageSrc) {
      setImageSrc(imageSrc);
      setUploadedImages((prevImages) => [...prevImages, imageSrc]);
    }
    setShowCameraLayout(true);
    setImageSrc(null);
  }, [webcamRef]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prevImages) => [...prevImages, ...fileURLs]);
  };

  const handleCameraClick = () => {
    setShowCameraLayout(true);
    setImageSrc(null);
  };

  const handleBackClick = () => {
    setShowCameraLayout(false);
    setImageSrc(null);
  };

  const handleDeleteImage = (index: number) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } else {
      setEmailError('');
    }

    if (!address || !prospectName || !email) {
      console.log('Please fill in all fields.');
      return;
    }

    setIsUploading(true);

    try {
      const uploadedUrls = await uploadImages(uploadedImages);

      const response = await postCaller('set_prospect_info', {
        prospect_name: prospectName,
        sr_email_id: email,
        panel_images_url: uploadedUrls,
      });

      if (response.status > 201) {
        toast.error((response as Error).message);
      } else {
        emailjs
          .send(
            'service_9h490v9',
            'template_0xz1vie',
            {
              to_name: 'Sales Person',
              from_name: 'owehub',
              url: `${window.location.host}/battery-backup-calulator/${response.data.prospect_id}`,
              email: "rajuraman45@gmail.com",
              reply_to: 'Sales Person',
              message: 'visit the link below to fill the form',
            },
            {
              publicKey: '9zrYKpc6-M02ZEmHn',
            }
          )
          .then(
            (response) => {
              console.log('Email sent successfully:', response);
              toast.success('Email sent successfully');
              setAddress('');
              setProspectName('');
              setEmail('');
              setUploadedImages([]);
            },
            (error) => {
              toast.error(error.text as string);
              console.error('Failed to send email:', error);
            }
          );
      }
    } catch (error) {
      console.error('Error uploading images to Cloudinary:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadImages = async (imageArray: string[]): Promise<string[]> => {
    if (!imageArray || imageArray.length === 0) return [];

    try {
      const uploadResponses = await Promise.all(
        imageArray.map(async (imageSrc) => {
          const blob = await fetch(imageSrc).then(r => r.blob());
          const formData = new FormData();
          formData.append('file', blob);
          formData.append('upload_preset', 'xdfcmcf4');
          formData.append('cloud_name', 'duscqq0ii');
           

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/duscqq0ii/image/upload`,
            formData
          );
          return response.data.secure_url;
        })
      );

      console.log('Images uploaded successfully:', uploadResponses);
      return uploadResponses;
    } catch (error) {
      console.error('Error uploading images to Cloudinary:', error);
      throw error;
    }
  };

  const videoConstraints = {
    facingMode: useBackCamera ? { exact: "environment" } : "user"
  };

  const checkFormValidity = () => {
    if (address && prospectName && email && uploadedImages.length > 0) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    checkFormValidity();
  }, [address, prospectName, email, uploadedImages]);


  console.log(uploadedImages, "upload")
  return (
    <div>
      {showCameraLayout ? (
        <>
        
        <div className="camera-layout">
          <div className="camera-instructions">

          <div className='upper-btns'>
         
          <div className="back-button" onClick={handleBackClick}>
  <FaArrowLeft className='back-icon' /> Back
</div>
         <div>
          <IoIosReverseCamera className='camera-icon' onClick={() => setUseBackCamera(!useBackCamera)}/>
         </div>

          
       </div>
            <div className="camera-part">
              {imageSrc ? (
                <img src={imageSrc} alt="Captured" className="captured-image" />
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="webcam"
                  videoConstraints={videoConstraints}
                />
              )}
            </div>
            <div className="lower-btns">
              <div className="uploaded-images">
                {uploadedImages.length > 0 ? (
                  <div className="thumbnail-container">
                    <img
                      src={uploadedImages[0]}
                      alt="Uploaded"
                      className="uploaded-image"
                    />
                    <div className="image-number">{uploadedImages.length}</div>
                  </div>
                ) : (
                  <div className="thumbnail-container">
                    <img
                      src="https://via.placeholder.com/150"
                      alt="No Image"
                      className="uploaded-image"
                    />
                    <div className="image-number">0</div>
                  </div>
                )}
              </div>
              <div className="circular-button" onClick={capture}>
                <div className="circle-inner"></div>
              </div>
              <button className="next-button" onClick={handleBackClick}>
                Next <FaArrowRight />
              </button>
              {/* <div className="switch-camera" onClick={() => setUseBackCamera(!useBackCamera)}>
               <IoIosReverseCamera className='camera-icon'/>
            </div>
             */}
            </div>
            {/* <div className="add-more" onClick={handleCameraClick}>
              Add More Image
            </div> */}
            
            
          </div>
        </div>
        </>
      ) : (
        <div className="container">
          <div className="form-container">
            <div className="image-buttons">
              <button className="image-button" onClick={handleCameraClick}>
                <img src={camera} alt="Click picture" className="icon" />
                Click picture
              </button>
              <button className="image-button">
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="upload-images"
                />
                <label htmlFor="upload-images" className="icon-label">
                  <img src={plus} alt="Upload image" className="icon" />
                  Upload image
                </label>
              </button>
            </div>

            <div className="uploaded-images">
              {uploadedImages.map((image, index) => (
                <div key={index} className="thumbnail-container">
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="uploaded-image"
                  />
                  <button
                    className="close-icon"
                    onClick={() => handleDeleteImage(index)}
                  >
                    <IoClose />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleFormSubmit}>
              
              <div className="form-group">
                <label htmlFor="prospectName">Prospect name</label>
                <input
                  type="text"
                  id="prospectName"
                  value={prospectName}
                  onChange={(e) => setProspectName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email sent to</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {emailError && <div className="error">{emailError}</div>}
              </div>
              <button type="submit" className={`share-button ${isFormValid ? 'enabled' : ''}`}>
                {isUploading ? 'Uploading...' : 'Share'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormComponent;
