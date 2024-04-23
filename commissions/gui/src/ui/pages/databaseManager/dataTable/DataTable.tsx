import React, { useEffect, useState } from "react";
import "../../configure/configure.css";
import { FaArrowDown } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchCommissions } from "../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { DealerModel } from "../../../../core/models/configuration/create/DealerModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import DataTableHeader from "../../../components/tableHeader/DataTableHeader";
import FilterDealer from "../../configure/dealerOverrides/FilterDealer";
import CheckBox from "../../../components/chekbox/CheckBox";
import { toggleAllRows, toggleRowSelection } from "../../../components/chekbox/checkHelper";
import FilterData from "./FilterData";
import { Column } from "../../../../core/models/data_models/FilterSelectModel";
import Pagination from "../../../components/pagination/Pagination";




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

  const columns: Column[] = [
    { name: "col1", displayName: "Column1", type: "string" },
    { name: "col2", displayName: "Column2", type: "string" },
    { name: "col3", displayName: "Column3", type: "string" },
    { name: "col4", displayName: "Column4", type: "string" },
    { name: "col5", displayName: "Column5", type: "number" },
    { name: "col6", displayName: "Column6", type: "number" },
    { name: "col7", displayName: "Column7", type: "number" },
  ];


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

  return (
    <div className="comm">
      <Breadcrumb head="Data" linkPara="Database Manager" linkparaSecond="Data" />
      <div className="commissionContainer">
        <DataTableHeader
          title="Table Name"
          onPressFilter={() => filter()}
          // onPressImport={() => { }}
        />


             {filterOPen && <FilterData handleClose={filterClose}  
               columns={columns} 
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

            <tbody>
              {currentPageData?.length > 0
                ? currentPageData?.map((el, i) => (
                  <tr key={i} className={selectedRows.has(i) ? "selected" : ""}>
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
                      {el.col1}
                    </td>
                    <td style={{ fontWeight: "500", color: "black" }}>{el.col2}</td>
                    <td style={{ fontWeight: "500", color: "black" }}>{el.col3}</td>
                    <td style={{ fontWeight: "500", color: "black" }}>{el.col4}</td>
                    <td style={{fontWeight: "500", color:"#0493CE"}}>{el.col5}</td>
                    <td style={{fontWeight: "500", color:"#0493CE"}}>{el.col6}</td>
                   <td style={{ fontWeight: "500", color:"#0493CE"}}>{el.col7}</td>
                  </tr>
                ))
                : null}
            </tbody>
          </table>
        </div>
        {
       <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          goToNextPage={goToNextPage}
          goToPrevPage={goToPrevPage}
        />
      }
      </div>
    </div>
  );
};

export default DataTablle;