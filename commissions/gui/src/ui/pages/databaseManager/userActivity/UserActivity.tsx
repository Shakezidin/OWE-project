import React, { useEffect, useState } from "react";
import "../../configure/configure.css";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import CheckBox from "../../../components/chekbox/CheckBox";
import { toggleAllRows, toggleRowSelection } from "../../../components/chekbox/checkHelper";
import { FaArrowDown } from "react-icons/fa6";
import { DealerModel } from "../../../../core/models/configuration/create/DealerModel";
import { fetchCommissions } from "../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice";
import Pagination from "../../../components/pagination/Pagination";
import UserActivityFilter from "./UserActivityFilter";
import { UserActivityColumn } from "../../../../resources/static_data/UserActivityColumn";
import DataTableHeader from "../../../components/tableHeader/DataTableHeader";
import FilterModal from "../../../components/FilterModal/FilterModal";


const UserActivity: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const dealerList = useAppSelector((state) => state.dealer.Dealers_list);
  const loading = useAppSelector((state) => state.dealer.loading);
  const error = useAppSelector((state) => state.dealer.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  // const [columns, setColumns] = useState<string[]>([]);
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
const itemsPerPage = 5;



  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    dispatch(fetchCommissions(pageNumber));

  }, [dispatch, currentPage]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };


  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };

  const handleAddDealer = () => {
    setEditMode(false);
    // setEditDealer(null);
    handleOpen()
  };
  // const getColumnNames = () => {
  //   if (dealerList.length > 0) {
  //     const keys = Object.keys(dealerList[0]);
  //     setColumns(keys);
  //   }
  // };
  // const filter = () => {
  //   setFilterOpen(true)
  //   getColumnNames()
  // }


  const filter = () => {
    setFilterOpen(true);
  }
  const handleEditDealer = (dealerData: DealerModel) => {
    setEditMode(true);
    // setEditDealer(dealerData);
    handleOpen()
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const dataDb = [
    {
      uname: "Roi William",
      dbname: "DB_Name",
      date: "10/04/2024  3:00AM",
      query: "Data not found in server",
    },
    {
        uname: "Roi William",
        dbname: "DB_Name",
        date: "10/04/2024  3:00AM",
        query: "Data not found in server",
      },
      {
        uname: "Roi William",
        dbname: "DB_Name",
        date: "10/04/2024  3:00AM",
        query: "Data not found in server",
      },
      {
        uname: "Roi William",
        dbname: "DB_Name",
        date: "10/04/2024  3:00AM",
        query: "Data not found in server",
      },
      {
          uname: "Roi William",
          dbname: "DB_Name",
          date: "10/04/2024  3:00AM",
          query: "Data not found in server",
        },
        {
          uname: "Roi William",
          dbname: "DB_Name",
          date: "10/04/2024  3:00AM",
          query: "Data not found in server",
        },
        {
          uname: "Roi William",
          dbname: "DB_Name",
          date: "10/04/2024  3:00AM",
          query: "Data not found in server",
        },
        {
            uname: "Roi William",
            dbname: "DB_Name",
            date: "10/04/2024  3:00AM",
            query: "Data not found in server",
          },
          {
            uname: "Roi William",
            dbname: "DB_Name",
            date: "10/04/2024  3:00AM",
            query: "Data not found in server",
          },
  ]


  const totalPages = Math.ceil(dataDb.length / itemsPerPage );

  const currentPageData = dataDb.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === dataDb.length;
  const fetchFunction = (req: any) => {
    // dispatch(fetchPaySchedule(req));
   };


  return (
    <div className="comm">
      <Breadcrumb head="User Activity" linkPara="Database Manager" linkparaSecond="User Activity" />
      <div className="commissionContainer">
        <DataTableHeader
          title="Activity List"
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          
        />
        {filterOPen && <FilterModal handleClose={filterClose}
          columns={UserActivityColumn}
          fetchFunction={fetchFunction}
          page_number={currentPage}
          page_size={itemsPerPage} />}


        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }} >
          <table>
            <thead>
              <tr>
                <th>
                  <div>
                    <CheckBox
                      checked={selectAllChecked}
                      onChange={() =>
                        toggleAllRows(
                          selectedRows,
                          dealerList,
                          setSelectedRows,
                          setSelectAllChecked
                        )
                      }
                    indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>User Name</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DB Name</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Time & Date</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Query Details</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                
              </tr>
            </thead>

            <tbody>
            {currentPageData?.length > 0
                ? currentPageData?.map((el, i) => (
                  <tr key={i}>
                    <td>
                      <CheckBox
                        checked={selectedRows.has(i)}
                        onChange={() =>
                          toggleRowSelection(
                            i,
                            selectedRows,
                            setSelectedRows,
                            setSelectAllChecked
                          )
                        }
                      />
                    </td>
                    <td style={{ fontWeight: "500", color: "black" }}>
                      {el.uname}
                    </td>
                    <td>{el.dbname}</td>
                    <td>{el.date}</td>
                    <td>{el.query}</td>
                    
                  </tr>
                ))
                : null}
            </tbody>
          </table>
        </div>
        <div className="page-heading-container">
      
      <p className="page-heading">
       {currentPage} - {totalPages} of {currentPageData?.length} item
      </p>
 
   {
    dataDb?.length > 0 ? <Pagination
      currentPage={currentPage}
      totalPages={totalPages} // You need to calculate total pages
      paginate={paginate}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
      currentPageData={currentPageData}
    /> : null
  }
   </div>
      </div>
    
    </div>
  );
};

export default UserActivity;