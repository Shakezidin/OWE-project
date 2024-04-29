import React, { useEffect, useState } from "react";
import "../../configure/configure.css";
import { FaArrowDown } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchCommissions } from "../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { DealerModel } from "../../../../core/models/configuration/create/DealerModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import DataTableHeader from "../../../components/tableHeader/DataTableHeader";
import CheckBox from "../../../components/chekbox/CheckBox";
import { toggleAllRows, toggleRowSelection } from "../../../components/chekbox/checkHelper";
import FilterData from "./FilterData";
import { Column } from "../../../../core/models/data_models/FilterSelectModel";
import Pagination from "../../../components/pagination/Pagination";
import { DataTableColumn } from "../../../../resources/static_data/DataTableColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";




const DataTablle: React.FC = () => {
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
      col1: "1234567890",
      col2: "Josh Morton",
      col3: "Josh Morton",
      col4: "Josh Morton",
      col5: "$120,450",
      col6: "$100,320",
      col7: "$100,320"
    },
    {
      col1: "1234567890",
      col2: "Josh Morton",
      col3: "Josh Morton",
      col4: "Josh Morton",
      col5: "$120,450",
      col6: "$100,320",
      col7: "$100,320"
    },
    {
      col1: "1234567890",
      col2: "Josh Morton",
      col3: "Josh Morton",
      col4: "Josh Morton",
      col5: "$120,450",
      col6: "$100,320",
      col7: "$100,320"
    },
    {
      col1: "1234567890",
      col2: "Josh Morton",
      col3: "Josh Morton",
      col4: "Josh Morton",
      col5: "$120,450",
      col6: "$100,320",
      col7: "$100,320"
    },
    {
      col1: "1234567890",
      col2: "Josh Morton",
      col3: "Josh Morton",
      col4: "Josh Morton",
      col5: "$120,450",
      col6: "$100,320",
      col7: "$100,320"
    },
    {
      col1: "1234567890",
      col2: "Josh Morton",
      col3: "Josh Morton",
      col4: "Josh Morton",
      col5: "$120,450",
      col6: "$100,320",
      col7: "$100,320"
    },
    {
      col1: "1234567890",
      col2: "Josh Morton",
      col3: "Josh Morton",
      col4: "Josh Morton",
      col5: "$120,450",
      col6: "$100,320",
      col7: "$100,320"
    },
    {
      col1: "1234567890",
      col2: "Josh Morton",
      col3: "Josh Morton",
      col4: "Josh Morton",
      col5: "$120,450",
      col6: "$100,320",
      col7: "$100,320"
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
      <Breadcrumb head="" linkPara="Database Manager" route={""} linkparaSecond="Data" />
      <div className="commissionContainer">
        <DataTableHeader
          title="Table Name"
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          showImportIcon={false}
          showSelectIcon={true}
          showFilterIcon={true}
        />


             {filterOPen && <FilterModal handleClose={filterClose}  
               columns={DataTableColumn} 
               fetchFunction={fetchFunction}
               page_number = {currentPage}
               page_size = {itemsPerPage}
             />}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
                <th style={{paddingRight:0}}>
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
                <th style={{paddingLeft:"10px"}}>
                  <div className="table-header">
                    <p>Column 1</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                
                <th>
                  <div className="table-header">
                    <p>Column 2</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Column 3</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Column 4</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Column 5</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Column 6</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Column 7</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody >
              {currentPageData?.length > 0
                ? currentPageData?.map((el, i) => (
                  <tr key={i} className={selectedRows.has(i) ? "selected" : ""} >
                    <td style={{textAlign: "left",paddingRight:0 }}>
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
                    <td style={{ fontWeight: "500", color: "black", textAlign: "left",paddingLeft:"10px"}}>
                      {el.col1}
                    </td>
                    <td style={{ textAlign: "left" }}>{el.col2}</td>
                    <td style={{ textAlign: "left" }}>{el.col3}</td>
                    <td style={{ textAlign: "left" }}>{el.col4}</td>
                    <td style={{ textAlign: "left"}}>{el.col5}</td>
                    <td style={{ textAlign: "left"}}>{el.col6}</td>
                   <td style={{ textAlign: "left"}}>{el.col7}</td>
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

export default DataTablle;