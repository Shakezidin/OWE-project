import './Modal.css';
import { ICONS } from '../../../icons/Icons';
import { GoUpload } from 'react-icons/go';

//@ts-ignore
const EditModal = ({onClose}) => {
  return (
    <div className="edit-modal">
      <div className="leader-modal">
        <h2>Change Picture</h2>
        <div className="modal-center">
          <object
            type="image/svg+xml"
            data={ICONS.BannerLogo}
            width={150}
            aria-label="banner-logo"
          ></object>
          <div className='upload'>
            <GoUpload />
            <span>Upload</span>
          </div>
        </div>
        <div className='leader-buttons'>
                <button className='cancel-button' onClick={onClose}>Cancel</button>
                <button className='update-button'>Update</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
