import React from "react";
import { ICONS } from "../../icons/Icons";
import "../pagination/pagination.css";

import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import ReactPaginate from "react-paginate";
interface PaginationProps {
  currentPage: number;
  currentPageData: any[];
  totalPages: number;
  paginate: (pageNumber: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  perPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  paginate,
  goToNextPage,
  currentPageData,
  goToPrevPage,
  perPage,
}) => {
  console.log(currentPage, "current");

  return (
    <div className="pagination-container">
      <ReactPaginate
        breakLabel="..."
        nextLabel={
          <button
            disabled={totalPages <= currentPage}
            className={"current-btn"}
          >
            <MdArrowForwardIos
              style={{ color: "#667085", fontSize: ".9rem" }}
            />
          </button>
        }
        onPageChange={({ selected }) => paginate(selected+1)}
        containerClassName="pagination"
        pageRangeDisplayed={1}
        forcePage={currentPage-1}
        pageClassName="current-btn"
        pageCount={totalPages}
        activeClassName="active-page"
        previousLabel={
          <button
            className={currentPage === 1 ? "disabled" : "current-btn"}
            disabled={currentPage === 1}
          >
            <MdArrowBackIos
              style={{
                color: currentPage === 1 ? "#d9d9d9" : "#667085",
                fontSize: ".9rem",
                marginLeft: ".2rem",
              }}
            />
          </button>
        }
        renderOnZeroPageCount={null}
      />
    </div>
  );
};
export default Pagination;
