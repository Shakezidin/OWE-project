import React, { useEffect, useState } from "react";
import "../configure.css";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { fetchmarketingFees } from "../../../../redux/apiSlice/configSlice/config_get_slice/marketingSlice";
import { CiEdit } from "react-icons/ci";
import CreateMarketingFees from "./CreateMarketingFees";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import FilterMarketing from "./FilterMarketing";
import { MarketingFeeModel } from "../../../../core/models/configuration/create/MarketingFeeModel";
import { FaArrowDown } from "react-icons/fa6";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import { Column } from "../../../../core/models/data_models/FilterSelectModel";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { MarketingFeesColumn } from "../../../../resources/static_data/configureHeaderData/MarketingFeeColumn";
import SortableHeader from "../../../components/tableHeader/SortableHeader";

const MarketingFees: React.FC = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const marketingFeesList = useAppSelector((state) => state.marketing.marketing_fees_list);
  const loading = useAppSelector((state) => state.marketing.loading);
  const error = useAppSelector((state) => state.marketing.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedMarketing, setEditedMarketing] = useState<MarketingFeeModel | null>(null);
  const itemsPerPage = 5;
  const [sortKey, setSortKey] =  useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    dispatch(fetchmarketingFees(pageNumber));
  }, [dispatch, currentPage]);

  const handleAddMarketing = () => {
    setEditMode(false);
    setEditedMarketing(null);
    handleOpen()
  };

  const handleEditMarketing = (marketingData: MarketingFeeModel) => {
    setEditMode(true);
    setEditedMarketing(marketingData);
    handleOpen()
  };
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
    setFilterOpen(true)

  }
  const totalPages = Math.ceil(marketingFeesList?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = marketingFeesList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === marketingFeesList?.length;
  const handleSort = (key:any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  if (sortKey) {
    currentPageData.sort((a:any, b:any) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        // Ensure numeric values for arithmetic operations
        const numericAValue = typeof aValue === 'number' ? aValue : parseFloat(aValue);
        const numericBValue = typeof bValue === 'number' ? bValue : parseFloat(bValue);
        return sortDirection === 'asc' ? numericAValue - numericBValue : numericBValue - numericAValue;
      }
    });
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="comm">
      <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Marketing Fees" />
      <div className="commissionContainer">
        <TableHeader
          title="Marketing Fees"
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onPressViewArchive={() => { }}
          onPressArchive={() => { }}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          onpressExport={() => { }}
          onpressAddNew={() => handleAddMarketing()}
        />
        {filterOPen && <FilterMarketing handleClose={filterClose}
          columns={MarketingFeesColumn}
          page_number={1}
          page_size={5} />}
        {open && <CreateMarketingFees marketingData={editedMarketing}
          editMode={editMode}
          handleClose={handleClose} />}
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
                          marketingFeesList,
                          setSelectedRows,
                          setSelectAllChecked
                        )
                      }
                      indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </div>
                </th>
              {
                MarketingFeesColumn.map((item,key)=>(
                  <SortableHeader
                  key={key}
                  titleName={item.displayName}
                  sortKey={item.name}
                  sortDirection={sortKey === item.name ? sortDirection : undefined}
                  onClick={()=>handleSort(item.name)}
                  />
                ))
              }
                <th>
                  <div className="action-header">
                    <p>Action</p>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {currentPageData?.length > 0
                ? currentPageData?.map((el: any, i: any) => (
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
                      {el.source}
                    </td>
                    <td>{el.dba}</td>
                    <td>{el.state}</td>
                    <td>{el.fee_rate}</td>
                    <td>
                      {el.chg_dlr}
                      {/* <div className="">
                      <img src={img} alt="" />
                    </div> */}
                    </td>
                    <td>{el.pay_src}</td>
                    <td>{el.description}</td>
                    <td>{el.start_date}</td>
                    <td>{el.end_date} </td>
                    <td

                    >
                      <div className="action-icon">
                        <div className="" style={{ cursor: "pointer" }}>
                          <img src={ICONS.ARCHIVE} alt="" />
                        </div>
                        <div className="" style={{ cursor: "pointer" }} onClick={() => handleEditMarketing(el)}>
                          <img src={ICONS.editIcon} alt="" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
                : null}
            </tbody>
          </table>
        </div>
        <div className="page-heading-container">
          <p className="page-heading">
            {currentPage} - {totalPages} of {marketingFeesList?.length} item
          </p>

          {
            marketingFeesList?.length > 0 ? <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
            /> : null
          }
        </div>
      </div>
    </div>
  );
};

export default MarketingFees;
