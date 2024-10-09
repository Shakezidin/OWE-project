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
  uploadPath?: string;
  handleSuccess?: () => void
}

const CreateNewFolderLibrary: React.FC<propGets> = ({ setIsVisibleNewFolder, uploadPath, handleSuccess }) => {

  const [folderName, setFolderName] = useState('');
  const [isPending,setIsPending] = useState(false)
  const handleDelete = () => {
    setIsVisibleNewFolder(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const validCharacters = /^[a-zA-Z0-9._-]*$/;
    if (!validCharacters.test(inputValue.slice(-1))) {
      return;
    }
    setFolderName(event.target.value);
  };


  const createFolder = async () => {
    try {
      const token = Cookies.get("myToken");
      setIsPending(true)
      const url = uploadPath
        ? `https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/root:/${uploadPath}:/children`
        : `https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/root/children`;
      const response = await axios.post(url, { "name": folderName, 
        "folder": {},
         "@microsoft.graph.conflictBehavior": "fail"
         }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      await handleSuccess?.()
      toast.success(`Folder created successfully!`);
     
      // alert(`Folder Name: ${response}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create folder, Please try again.');
    }
    finally{
      setIsPending(false)
      setIsVisibleNewFolder(false);
    }

  }




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
              <button disabled={isPending} id="otherButtonId" className={classes.other} onClick={createFolder}>
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
