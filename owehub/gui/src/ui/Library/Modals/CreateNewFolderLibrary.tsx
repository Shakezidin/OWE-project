import React, { useEffect, useState } from 'react';
import classes from './styles/createfolderlibrary.module.css';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../../../resources/icons/Icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface propGets {
  setIsVisibleNewFolder: (visible: boolean) => void;
  onDelete: () => void;
}

const CreateNewFolderLibrary: React.FC<propGets> = ({
  setIsVisibleNewFolder,
}) => {
  const [folderName, setFolderName] = useState('');
  const handleDelete = () => {
    setIsVisibleNewFolder(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  const createFolder = async () => {
    try {
      const token = Cookies.get('myToken');
      const response = await axios.post(
        'https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/items/root/children',
        { name: folderName, folder: {} },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      toast.success(`Folder "${folderName}" created successfully!`);
      // alert(`Folder Name: ${response}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create folder. Please try again.');
    }

    setIsVisibleNewFolder(false);
  };

  return (
    <div>
      <div className="transparent-model">
        <div className={classes.customer_wrapper_list}>
          <>
            {' '}
            <div className={classes.success_not}>
              <div className={classes.success_header}>
                <h2 className={classes.success_heading}>Create a New Folder</h2>
                <img
                  src={ICONS.cross}
                  alt=""
                  className={classes.success_crossing}
                  onClick={handleDelete}
                />
              </div>
              <div className={classes.success_hrline}></div>

              <div className={classes.succicon}>
                <input
                  type="text"
                  className={classes.succicon_input_box}
                  placeholder="Add your folder Name"
                  value={folderName}
                  onChange={handleInputChange}
                ></input>
              </div>
            </div>
            <div className={classes.survey_button}>
              <button
                id="otherButtonId"
                className={classes.other}
                onClick={createFolder}
              >
                Create
              </button>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default CreateNewFolderLibrary;
