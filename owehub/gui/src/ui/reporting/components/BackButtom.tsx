import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const BackButtom = ({ heading }: any) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/reporting');
  };
  return (
    <div className="backButton-reporting" >
      <BiArrowBack style={{
        height: '20px',
        width: '20px',
        cursor: "pointer"
      }}
        onClick={handleClick}
      />
      <h4 onClick={handleClick} style={{ fontWeight: "600", fontSize: "14px", cursor: "pointer" }} className="reports-title">{heading ? heading : ''}</h4>
    </div>
  );
};

export default BackButtom;
