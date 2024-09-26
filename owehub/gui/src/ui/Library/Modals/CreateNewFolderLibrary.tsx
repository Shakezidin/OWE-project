import React, { useState } from 'react';
import classes from './styles/createfolderlibrary.module.css';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../../../resources/icons/Icons';

const CreateNewFolderLibrary = () =>
  {
    const navigate = useNavigate();
   
    const [visibleDiv, setVisibleDiv] = useState(1);

  

    return (
       <div>
        <div className="transparent-model">
          <div className={classes.customer_wrapper_list}>
            
           
              <>
                {' '}

                <div className={classes.success_not}>
                    <div className={classes.success_header}>
                        <h2 className={classes.success_heading}>Create a New Folder</h2>
                        <img src={ICONS.cross} alt="" className={classes.success_crossimg} />
                    </div>
                    <div className={classes.success_hrline}>

                    </div>

                        
                  <div className={classes.succicon}>
                   <input type='text' className={classes.succicon_input_box} placeholder='Add your folder Name'></input> 
                                       
                  </div>
               
                </div>
                <div className={classes.survey_button}>
                  <button id="otherButtonId" className={classes.other}>
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
