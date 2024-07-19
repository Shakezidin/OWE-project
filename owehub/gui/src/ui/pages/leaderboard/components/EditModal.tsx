import './Modal.css';
import { ICONS } from '../../../icons/Icons';
import { GoUpload } from 'react-icons/go';
import { useRef, useState } from 'react';

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
          <button className="update-button">Update</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
