import React, { useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../../configure/configure.css";
import { CiEdit } from "react-icons/ci";
// import CreateDealer from "./CreateDealer";

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
  const [columns, setColumns] = useState<string[]>([]);
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const itemsPerPage = 5;

  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    dispatch(fetchCommissions(pageNumber));

  }, [dispatch, currentPage]);

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };


  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const getColumnNames = () => {
    if (dealerList.length > 0) {
      const keys = Object.keys(dealerList[0]);
      setColumns(keys);
    }
  };
  
  const filter = () => {
    setFilterOpen(true)
    getColumnNames()
  }
  const handleEditDealer = (dealerData: DealerModel) => {
    setEditMode(true);
    // setEditDealer(dealerData);
    handleOpen()
  };
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === dealerList?.length;
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
    },
    {
      col1: "1234567890",
      col2: "Josh Morton",
      col3: "Josh Morton",
      col4: "Josh Morton",
    },
    {
      col1: "1234567890",
      col2: "Josh Morton",
      col3: "Josh Morton",
      col4: "Josh Morton",
    },
  ]

  return (
    <div className="comm">
      <Breadcrumb head="Data" linkPara="Database Manager" linkparaSecond="Data" />
      <div className="commissionContainer">
        <DataTableHeader
          title="Failed Webhooks"
          onPressFilter={() => filter()}
          onPressImport={() => { }}
        />

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
                    // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Webhook ID</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Item ID</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Error</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Date & Time</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {dataDb?.length > 0
                ? dataDb?.map((el, i) => (
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
                      {el.col1}
                    </td>
                    <td>{el.col2}</td>
                    <td>{el.col3}</td>
                    <td>{el.col4}</td>
                  </tr>
                ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTablle;