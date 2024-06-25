import React, { useState, useCallback, useRef, ChangeEvent } from 'react';
import './srImageUpload.css';
import camera from './lib/camera 1.svg';
import plus from './lib/+.svg';
import { FaArrowRight } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Webcam from 'react-webcam';

const FormComponent: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showCameraLayout, setShowCameraLayout] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showImageList, setShowImageList] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);

  const [address, setAddress] = useState<string>('');
  const [prospectName, setProspectName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot() ?? null;
    if (imageSrc) {
      setImageSrc(imageSrc);
      setUploadedImages(prevImages => [...prevImages, imageSrc]);
    }
    setShowCameraLayout(true);
    setImageSrc(null);
  }, [webcamRef]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const fileURLs = files.map(file => URL.createObjectURL(file));
    setUploadedImages(prevImages => [...prevImages, ...fileURLs]);
  };

  const handleCameraClick = () => {
    setShowCameraLayout(true);
    setImageSrc(null);
    setShowImageList(false);
  };

  const handleBackClick = () => {
    setShowCameraLayout(false);
    setImageSrc(null)
  };

  const handleNextClick = () => {
    setShowCameraLayout(false);
    setShowImageList(true);
  };

  const handleDeleteImage = (index: number) => {
    setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
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

    console.log({
      address,
      prospectName,
      email,
      uploadedImages
    });

    // Reset form
    setAddress('');
    setProspectName('');
    setEmail('');
    setUploadedImages([]);
  };
  const isFormValid = address && prospectName && email && uploadedImages.length > 0;
  return (
    <div>
      {showImageList ? (
        <div className='container'>
          <div className="form-container">
            <div className="uploaded-images-list">
              {uploadedImages.map((image, index) => (
                <div key={index} className="uploaded-image-item">
                  <img src={image} alt={`Uploaded ${index + 1}`} className="uploaded-image-list" />
                  <div className="image-details">
                    <div className="image-filename">Example.JPG</div>
                    <div className="image-date">12/6/2024</div>
                  </div>
                  <button className="delete-button" onClick={() => handleDeleteImage(index)}>
                    <IoClose className='close-icon' />
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="prospect-name">Prospect name</label>
                <input
                  type="text"
                  id="prospect-name"
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
                Share
              </button>
            </form>
            <div className='add-moree' onClick={handleCameraClick}>
              Add more pictures
            </div>
          </div>
        </div>
      ) : (
        <div>
          {showCameraLayout ? (
            <div className="camera-layout">
              <div className="camera-instructions">
                <div className="camera-part">
                  {imageSrc ? (
                    <img src={imageSrc} alt="Captured" className="captured-image" />
                  ) : (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="webcam"
                    />
                  )}
                </div>
                <div className="flex justify-center items-center lower-btns">
                  <div className="uploaded-images">
                    <div className="thumbnail-container">
                      <img
                        src={uploadedImages[0]}
                        alt={`Uploaded`}
                        className="uploaded-image"
                      />
                      <div className="image-number">{uploadedImages.length}</div>
                    </div>
                  </div>
                  <div className="circular-button" onClick={capture}>
                    <div className="circle-inner"></div>
                  </div>
                  <button className="next-button" onClick={handleNextClick}>
                    Next <FaArrowRight />
                  </button>
                </div>
                <div className='add-more' onClick={handleCameraClick}>
                  Add More Image
                </div>
              </div>
            </div>
          ) : (
            <div className='container'>
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
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prospect-name">Prospect name</label>
                    <input
                      type="text"
                      id="prospect-name"
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
                  <button type="submit" className="share-button">Share</button>
                </form>
                <div className="uploaded-images">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="thumbnail-container">
                      <img
                        src={image}
                        alt={`Uploaded ${index + 1}`}
                        className="uploaded-image"
                      />
                      <div className="image-number">{index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormComponent;
