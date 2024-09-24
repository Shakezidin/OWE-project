import React, { useState } from 'react';
import classes from './deletefile.module.css';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../../resources/icons/Icons';

const DeleteFileModal = () =>
  {
    const navigate = useNavigate();
    // const [confirmModal, setConfirmModal]=useState(false);
    const [visibleDiv, setVisibleDiv] = useState(1);

  

    return (
      // <div className={`filter-modal ${isOpen ? 'modal-open' : 'modal-close'} `}>
      <div>
        <div className="transparent-model">
          <div className={classes.customer_wrapper_list}>
            
           
              <>
                {' '}
                <div className={classes.success_not}>
                  <div className={classes.succicon}>
                     <img src={ICONS.deleteFileLibrary} alt="" />
                  </div>
                  <div className={classes.heading}>
                        <h2>Are You Sure? </h2>
                        <p>Do you really want to delete this?</p>
                  </div>
                </div>
                <div className={classes.survey_button}>
                  <button
                    className={classes.self}
                  
                  >
                    Cancel
                  </button>
                  <button id="otherButtonId" className={classes.other}>
                    Delete
                  </button>
                </div>
              </>
           
         
          </div>
        </div>
      </div>
    );
  };

export default DeleteFileModal;
