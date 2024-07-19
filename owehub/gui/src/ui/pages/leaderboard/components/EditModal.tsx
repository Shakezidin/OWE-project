import './Modal.css';
import { ICONS } from '../../../icons/Icons';
import { GoUpload } from 'react-icons/go';
import { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
 // Adjust the path accordingly

interface EditModalProps {
  onClose: () => void;
}

const EditModal = ({ onClose }: EditModalProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{
    src: string;
    file: File;
  } | null>(null);

  const handleFileInputChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string')
        setUploadedImage({ src: reader.result, file });
    };
  };

  const uploadImage = async (imageSrc: string): Promise<string> => {
    if (!imageSrc) throw new Error('No image source provided');
  
    try {
      const blob = await fetch(imageSrc).then((r) => r.blob());
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('upload_preset', 'xdfcmcf4');
      formData.append('cloud_name', 'duscqq0ii');
  
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/duscqq0ii/image/upload`,
        formData
      );
      const imageUrl = response.data.secure_url;
  
      toast.success('Logo uploaded successfully:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  };
  
 

  const handleUpdate = async () => {
    if (!uploadedImage?.src) return;
    try {
      const imageUrl = await uploadImage(uploadedImage.src);
      console.log('Uploaded image URL:', imageUrl);
      // Handle the URL (e.g., save it to your backend or update the state)
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="edit-modal">
      <div className="leader-modal">
        <h2>Change Picture</h2>
        <div className="modal-center">
          {uploadedImage ? (
            <img alt="Preview" src={uploadedImage.src} />
          ) : (
            <object
              type="image/svg+xml"
              data={ICONS.BannerLogo}
              width={150}
              aria-label="banner-logo"
            ></object>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileInputChange}
          />
          <button
            className="leader-modal-upload"
            onClick={() => fileInputRef.current?.click()}
          >
            <GoUpload size={16} />
            <span>Upload</span>
          </button>
        </div>
        <div className="leader-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="update-button" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
