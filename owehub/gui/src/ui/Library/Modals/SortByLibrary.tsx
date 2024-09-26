import React, { useState } from 'react';
// import classes from './sortby.module.css';
import classes from './styles/sortby.module.css';




const SortByLibrary = () =>  {
   
    const [isVisible, setIsVisible] = useState(false);

    const handleClick = () => {
      setIsVisible(!isVisible); 
    };
  

    return (
      <>


                <div className={classes.sortby_container}>
                        <button onClick={handleClick}  className={classes.logo_sortby_botton}>Sort by</button>
                        {isVisible && <ul className={classes.sortlibrary_inner_div}>
                                <li className={`${classes.sortbylibrary_all} ${classes.sortbylibrary_name}`}>Name</li>
                                <li className={`${classes.sortbylibrary_all} ${classes.sortbylibrary_date}`}>Date</li>
                                <li className={`${classes.sortbylibrary_all} ${classes.sortbylibrary_size}`}>size</li>
                              
                                        
                            
                         </ul>}
                </div>
              </>
           
         
        
     
   
    );
  };

export default SortByLibrary;