import React, { useEffect } from 'react'

import '../configure.css'
import arrowDown from "../../../../resources/assets/arrow-down.png";
import { IoAddSharp } from "react-icons/io5";
import imgExport from '../../../../resources/assets/export.png'
import imgimport from '../../../../resources/assets/import.png'

import CreateCommissionRate from './CreateCommissionRate';
import { useAppDispatch, useAppSelector } from '../../../../redux/features/hooks';
import { getCommission } from '../../../../redux/features/commissionSlice';
const CommissionRate: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch()
  // const getData = useAppSelector(state=>state.comm.data)

  const commissionList = useAppSelector(state => state.comm.data);
  const loading = useAppSelector(state => state.comm.loading);
  const error = useAppSelector(state => state.comm.error);

  useEffect(() => {
    const pageNumber = {
      "page_number": 1,
      "page_size": 2
    }
    dispatch(getCommission(pageNumber));
  }, []);
  console.log(commissionList)
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='comm'>
      <div className='commissionContainer'>
        <div className='commissionSection'>
          <div className='rateSection'>
            <h2>Commission Rate</h2>
            <p style={{ color: "#667085", fontSize: "14px" }}>You can view and edit these data as per your requirement</p>
          </div>
          <div className="iconContainer">
            <div className='iconsSection2'>
              <button type='button'> <img src={imgExport} alt='' />View Archive</button>
            </div>
            <div className='iconsSection-filter'>
              <button type='button'> <img src={imgExport} alt='' /></button>
            </div>
            <div className='iconsSection2'>
              <button type='button'> <img src={imgExport} alt='' />Archive</button>
            </div>
            <div className='iconsSection2'>
              <button type='button'> <img src={imgimport} alt='' /> Import</button>
            </div>
            <div className='iconsSection2'>
              <button type='button'> <img src={imgExport} alt='' />Export</button>
            </div>
            <div className='iconsSection2'>
              <button type='button' style={{ background: "black", color: "white", border: "1px solid black" }} onClick={handleOpen}>  <IoAddSharp /> Add New</button>
            </div>
          </div>

          {
            open && (<CreateCommissionRate handleClose={handleClose} />)
          }

        </div>
        <div className='TableContainer' style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
          <table>
            <thead >
              <tr>
                <th>
                  <div>
                    <input value="test" type="checkbox" className='check-box' />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Partner</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Installer</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sales Type</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sales Price</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep.Type</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rate List</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rate</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Dt.</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Dt.</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Action</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody >
              {
                commissionList?.commissions_list?.length > 0 ? commissionList?.commissions_list?.map((el: any, i: any) => (
                  <tr key={i}>
                    <td ><input value="test" type="checkbox" className='check-box' /></td>
                    <td style={{ fontWeight: "500", color: "black" }}>{el.partner}</td>
                    <td>{el.installer}</td>
                    <td>{el.state}</td>
                    <td>{el.sale_type}</td>
                    <td>{el.sale_price}</td>
                    <td>{el.rep_type}</td>
                    <td>{el.rl}</td>
                    <td>{el.rate}</td>
                    <td>{el.start_date}</td>
                    <td>{el.end_date}</td>
                    <td>
                      <div className="action-icon">
                        <div className="" style={{ cursor: "pointer" }}>
                          {el.delete}
                        </div>
                        <div className="" style={{ cursor: "pointer" }}>
                          {el.edit}
                        </div>
                      </div>
                    </td>



                  </tr>
                )) : null
              }


            </tbody>
          </table>
        </div>
      </div>
    </div>

  )
}

export default CommissionRate