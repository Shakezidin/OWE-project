import './Modal.css';
import { ICONS } from '../../../icons/Icons';
import { GoUpload } from 'react-icons/go';

import { ChangeEventHandler, useRef, useState } from 'react';
import { ColorpickerIcon } from './Icons';
import { MdCheck } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';
// Adjust the path accordingly

interface EditModalProps {
  onClose: () => void;
}

//
// COLOR PICKER
//
const ColorPicker = ({
  color,
  setColor,
}: {
  color: string;
  setColor: (newVal: string) => void;
}) => {
  const presetColors = [
    '#40A2EC',
    '#B474F5',
    '#8CC152',
    '#4A89DC',
    '#DA4453',
    '#3ACBC2',
    '#FC6E51',
  ];

  const setPresetColor = (presetColor: string) => () => {
    if (colorInputRef.current) {
      colorInputRef.current.value = presetColor;
      setColor(presetColor);
    }
  };

  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const onColorInputChange: ChangeEventHandler<HTMLInputElement> = (ev) => {
    setColor(ev.currentTarget.value);
  };

  return (
    <div className="leader-modal-colorpicker">
      <p>Change background color</p>
      {presetColors.map((presetItem) => (
        <button
          key={presetItem}
          style={{
            backgroundColor: presetItem,
            outlineColor: presetItem === color ? color : 'transparent',
          }}
          onClick={setPresetColor(presetItem)}
        >
          {color === presetItem && <MdCheck size={16} fill="#fff" />}
        </button>
      ))}
      <input type="color" ref={colorInputRef} onChange={onColorInputChange} />
      <button
        onClick={() => colorInputRef.current?.click()}
        style={{
          outlineColor: presetColors.includes(color) ? 'transparent' : color,
        }}
      >
        <ColorpickerIcon />
      </button>
    </div>
  );
};

//
// LOGO PICKER
//

const LogoPicker = ({
  setLogo,
}: {
  setLogo: (newVal: File | null) => void;
}) => {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileInputChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewSrc(reader.result);
        setLogo(file);
      }
    };
  };

  return (
    <>
      {previewSrc ? (
        <img alt="Preview" src={previewSrc} />
      ) : (
        <img
          src={ICONS.BannerLogo}
          width={150}
          alt="banner-logo"
        />
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
    </>
  );
};

const EditModal = ({ onClose }: EditModalProps) => {
  const [color, setColor] = useState('#40A2EC');
  const [logo, setLogo] = useState<File | null>(null);

  // upload "logo"
  console.log(logo);

  const handleUpdate = async () => {
    if (!logo) return;
    try {
      const imageUrl = await uploadImage(logo);
      console.log('Uploaded image URL:', imageUrl);
      // Handle the URL (e.g., save it to your backend or update the state)
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const uploadImage = async (image: File): Promise<string> => {
    if (!image) throw new Error('No image provided');

    try {
      const formData = new FormData();
      formData.append('file', image);
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

  return (
    <div className="edit-modal">
      <div className="leader-modal">
        <h2>Change Picture</h2>
        <div className="modal-center">
          <LogoPicker setLogo={setLogo} />
          <ColorPicker color={color} setColor={setColor} />
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
