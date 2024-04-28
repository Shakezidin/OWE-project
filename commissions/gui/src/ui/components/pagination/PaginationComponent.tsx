import React, { useState, useEffect } from 'react';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';
// import '../pagination/page.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  handleItemsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, itemsPerPage, handleItemsPerPageChange }) => {
  const displayPageNumbers: number = 5; // Adjust the number of page numbers to display
  const [activePage, setActivePage] = useState<number>(currentPage);

  useEffect(() => {
    setActivePage(currentPage);
  }, [currentPage]);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const totalPagesToShow: number = Math.min(totalPages, displayPageNumbers);

    if (totalPages <= displayPageNumbers) {
      // If total pages are less than or equal to the displayPageNumbers, show all pages
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }
    } else {
      // Show the first page, ellipsis, current page, and last page
      const firstPage: number = 1;
      const lastPage: number = totalPages;

      let startPage: number = Math.max(activePage - Math.floor(displayPageNumbers / 2), 1);
      let endPage: number = startPage + totalPagesToShow - 1;

      if (endPage > totalPages) {
        startPage -= endPage - totalPages;
        endPage = totalPages;
      }

      if (startPage <= 0) {
        startPage = 1;
        endPage = totalPagesToShow;
      }

      for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
      }

      if (startPage > 1) {
        pages.unshift('...');
        pages.unshift(firstPage);
      }

      if (endPage < totalPages) {
        pages.push('...');
        pages.push(lastPage);
      }
    }

    return pages;
  };

  const pages: (number | string)[] = getPageNumbers();

  return (
    
    <div className="pagination-container">
      <div className='page-per-item'>
        <label className='record-label'>
          Records Per Page:
          </label>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
       
      </div>
      <div className='pagination'>
        <button
        className={currentPage === 1 ? "disabled" : "current-btn"} 
        disabled={currentPage===1}
          onClick={() => {
            onPageChange(activePage - 1);
            setActivePage(activePage - 1);
          }}>
        <MdArrowBackIos  style={{color:currentPage===1?"#d9d9d9":"#667085" ,fontSize:".9rem",marginLeft:'.2rem'}}/>
        </button>
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => {
              if (typeof page === 'number' && page !== activePage) {
                onPageChange(page);
                setActivePage(page);
              }
            }}
           
            className={`current-page ${page === activePage ? 'active-page' : ''} `}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
        <button
         className={ "current-btn"}
          onClick={() => {
            onPageChange(activePage + 1);
            setActivePage(activePage + 1);
          }}
          disabled={currentPage === totalPages}
        >
     <MdArrowForwardIos  style={{color:"#667085",fontSize:".9rem",}}/>
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;