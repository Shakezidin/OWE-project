import React, { useState } from 'react';
import classes from './sortby.module.css';




const SortByLibrary = () =>  {
   
    const [isVisible, setIsVisible] = useState(false);

    const handleClick = () => {
      setIsVisible(!isVisible); // Toggle visibility of the <p> tag
    };
  

    return (
        <div>
        <div className="transparent-model">
          <div className={classes.customer_wrapper_list}>
            
           
              <>
                {' '}

                <div className={classes.sortby_container}>
                        <button onClick={handleClick}  className={classes.logo_sortby_botton}>Sort by</button>
                        {isVisible && <div className={classes.sortlibrary_inner_div}>
                                <div className={classes.sortbylibrary_allone}>Name</div>
                                <div className={classes.sortbylibrary_all}>Date</div>
                                <div className={classes.sortbylibrary_all}>size</div>
                              
                                        
                            
                         </div>}
                </div>
              </>
           
         
          </div>
        </div>
      </div>
   
    );
  };

export default SortByLibrary;

