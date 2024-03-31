import React from "react";
import '../pagination/pagination.css'
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    paginate: (pageNumber: number) => void;
    goToNextPage: () => void;
    goToPrevPage: () => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    paginate,
    goToNextPage,
    goToPrevPage,
  }) => {
    return (
      <div className="pagination-container">
        <div className="pagination">
    
            <button  className={currentPage === 1 ? "disabled" : "current-btn"} onClick={goToPrevPage} disabled={currentPage===1}>Previous</button>
       
          {Array.from({ length: totalPages }, (_, i) => (
            
              <button key={i} className={currentPage === i + 1 ? "active-page" : "current-page"} onClick={() => paginate(i + 1)}>{i + 1}</button>
        
          ))}
         
            <button className={currentPage === totalPages ? "disabled" : "current-btn"} onClick={goToNextPage}>Next</button>
          
        </div>
      </div>
    );
  };
  export default Pagination