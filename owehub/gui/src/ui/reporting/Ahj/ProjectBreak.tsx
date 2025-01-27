import React from 'react';
import './drop.css';
import { RxCross2 } from 'react-icons/rx';

const ProjectBreak = ({ isOpen1, handleClose, breakdownData }: any) => {
  return (
    <div>
      {isOpen1 && (
        <div className="transparent-model">
          <div className="ahj_wrapper_list">
            <div className="ahj-header">
              <p>{breakdownData ? breakdownData : ''}</p>
              <RxCross2
                size={20}
                onClick={handleClose}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectBreak;
