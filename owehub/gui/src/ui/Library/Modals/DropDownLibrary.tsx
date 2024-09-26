import React, { useState } from 'react';
import classes from './styles/dropdownlibrary.module.css';
import { BsThreeDotsVertical } from 'react-icons/bs';

const DropDownLibrary = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible); // Toggle visibility of the <p> tag
  };

  return (
    <div>
      <div>
        <div>
          <>
            {' '}
            <div className={classes.dropdown_container}>
              <button
                onClick={handleClick}
                className={classes.logo_dropdown_botton}
              >
                <div className={classes.logo_dropdown}>
                  <BsThreeDotsVertical
                    color="#8C8C8C"
                    style={{ height: '18px', width: '18px' }}
                  />
                </div>
              </button>
              {isVisible && (
                <div className={classes.dropdownlibrary_inner_div}>
                  <div className={classes.dropdownlibrary_allone}>All</div>
                  <div className={classes.dropdownlibrary_all}>Excel</div>
                  <div className={classes.dropdownlibrary_all}>PowerPoint</div>
                  <div className={classes.dropdownlibrary_all}>PDF Format</div>
                  <div className={classes.dropdownlibrary_all}>Images</div>
                  <div className={classes.dropdownlibrary_all_last}>Videos</div>
                </div>
              )}
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default DropDownLibrary;
