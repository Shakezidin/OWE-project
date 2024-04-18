import React from 'react'
import CheckBox from '../../../components/chekbox/CheckBox'
import { ICONS } from '../../../icons/Icons'
import { CiEdit } from "react-icons/ci";
import { FaArrowDown } from 'react-icons/fa6';
import Pagination from "../../../components/pagination/Pagination";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";

const UserTable:React.FC= () => {
    const dataUser = [
        {
          code: "323223",
          name: "Voltaic Power LLC",
          role: "Regional Manager",
          reporting: "Hanery",
          email: "hanery@gmail.com",
          pn: "123456789",
          des: "Implementing solar system commission"
        },
        {
          code: "323223",
          name: "Voltaic Power LLC",
          role: "Regional Manager",
          reporting: "Hanery",
          email: "hanery@gmail.com",
          pn: "123456789",
          des: "Implementing solar system commission"
        },
        {
          code: "323223",
          name: "Voltaic Power LLC",
          role: "Regional Manager",
          reporting: "Hanery",
          email: "hanery@gmail.com",
          pn: "123456789",
          des: "Implementing solar system commission"
        },
      ];
      const dispatch = useAppDispatch();
      const currentPage = useAppSelector((state) => state.paginationType.currentPage);
      const itemsPerPage = 10;
      
      const paginate = (pageNumber: number) => {
        dispatch(setCurrentPage(pageNumber));
      };
      
      
      const goToNextPage = () => {
        dispatch(setCurrentPage(currentPage + 1));
      };
      
      const goToPrevPage = () => {
        dispatch(setCurrentPage(currentPage - 1));
      };
      const totalPages = Math.ceil(dataUser?.length / itemsPerPage);
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentPageData = dataUser?.slice(startIndex, endIndex);
    return (
<>
{/* <UserHeaderSection name="Admin Users"/> */}
        <div
            className="UserManageTable"
            style={{ overflowX: "auto", whiteSpace: "nowrap" }} >
            <table>
                <thead > 
                    <tr style={{backgroundColor:"#F5F5F5"}}>
                        <th>
                            <div>
                                <CheckBox
                                    checked={true}
                                    onChange={() => { }
                                    }
                                // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                                />
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Code</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Name</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Role</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        
                        <th>
                            <div className="table-header">
                                <p>Reporting To</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Email ID</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Phone Number</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        <th>
                            <div className="table-header">
                                <p>Description</p> <FaArrowDown style={{color:"#667085"}}/>
                            </div>
                        </th>
                        <th>
                            <div className="action-header">
                                <p>Action</p>
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {dataUser?.length > 0 ? dataUser?.map((el, i) => (   
                     <tr key={i}>
                                <td>
                                    <CheckBox
                                        checked={true}
                                        onChange={() => { }
                                        }
                                    // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                                    />
                                </td>
                                <td style={{ fontWeight: "500", color: "black" }}>{el.code}</td>
                                <td style={{color: "var( --fade-gray-black)"}}>{el.name}</td>
                                <td style={{ fontWeight: "500"}}>{el.role}</td>
                                <td style={{ fontWeight: "500"}}>{el.reporting}</td>
                                <td style={{ fontWeight: "500"}}>{el.email}</td>
                                <td style={{ fontWeight: "500"}}>{el.pn}</td>
                                <td>{el.des}</td>
                                <td>
                                <div className="action-icon">
                        <div className="" style={{ cursor: "pointer" }}>
                          <img src={ICONS.deleteIcon} alt="" />
                        </div>
                        <div className="" style={{ cursor: "pointer" }} >
                        <img src={ICONS.editIcon} alt="" />
                        </div>
                      </div>
                                </td>
                            </tr>
                        ))
                        : null}
                </tbody>
            </table>
            <div className="page-heading-container">
      
      <p className="page-heading">
       {currentPage} - {totalPages} of {dataUser?.length} item
      </p>
 
   {
    dataUser?.length > 0 ? <Pagination
      currentPage={currentPage}
      totalPages={totalPages} // You need to calculate total pages
      paginate={paginate}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
    /> : null
  }
   </div>
        </div>
        </>
    )
}

export default UserTable