import React from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const BackButtom = ({ heading }: any) => {

    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/reporting')
    }
  return (
    <div className='backButton-reporting'>
  <IoMdArrowRoundBack style={{cursor: "pointer", fontSize: "17px"}} onClick={handleClick} />
  <h4 className="reports-title">{heading ? heading : ""}</h4>
    </div>
  )
}

export default BackButtom
