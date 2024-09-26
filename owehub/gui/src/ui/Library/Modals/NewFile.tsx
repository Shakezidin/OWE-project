import React, { useState } from 'react';
// import classes from './sortby.module.css';
import classes from './styles/newfile.module.css';

const NewFile = () => {

    const [isVisible, setIsVisible] = useState(false);

    const handleClick = () => {
        setIsVisible(!isVisible);
    };


    return (
        <>
            <div className={classes.newfile_container}>
                <button onClick={handleClick} className={classes.newfile_botton}>+ New</button>
                {isVisible &&
                    <ul className={classes.newfilelibrary_uploadbutton_container}>
                        <li className={classes.newfilelibrary_uploadbutton_inner}><button className={classes.newfilelibrary_uploadbutton}>+ Uplode file</button></li>
                    </ul>
                }
            </div>
        </>
    );
};

export default NewFile;
