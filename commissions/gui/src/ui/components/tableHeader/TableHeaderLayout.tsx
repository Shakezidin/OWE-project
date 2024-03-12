import React from 'react'
import '../tableHeader/tblHeaderLayout.css'
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from '../../../resources/assets/export.png'
import imgimport from '../../../resources/assets/import.png'
import Modal from '@mui/material/Modal';

import CreateDealer from '../../pages/configure/dealerOverrides/CreateDealer';

const TableHeaderLayout:React.FC = () => {
    const [open, setOpen] = React.useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  return (
    <div className='commissionSection'>
    <div className='rateSection'>
      <h2>Dealer Overrides</h2>
      <p style={{ color: "#667085",fontSize:"14px" }}>You can view and edit these data as per your requirement</p>
    </div>
    <div className="iconContainer">
      <div className='iconsSection'>
        <button type='button'> <RiDeleteBin5Line /> Delete</button>
      </div>
      <div className='iconsSection'>
        <button type='button'>  <MdFilterList /> Filter</button>
      </div>
      <div className='iconsSection2'>
        <button type='button'> <img src={imgimport} alt='' /> Import</button>
      </div>
      <div className='iconsSection2'>
        <button type='button'> <img src={imgExport} alt='' />Export</button>
      </div>
      <div className='iconsSection2'>

        <button type='button' style={{ background: "black", color: "white" }} onClick={handleOpen}>  <IoAddSharp /> Add New</button>
      </div>
    </div>
    <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <CreateDealer handleClose={handleClose}  />
        </Modal>
  </div>
  )
}

export default TableHeaderLayout