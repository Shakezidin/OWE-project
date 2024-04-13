import React from "react";
import { ICONS } from "../../icons/Icons";
import '../pagination/pagination.css'

import { MdArrowForwardIos,MdArrowBackIos } from "react-icons/md";

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
    
            <button  className={currentPage === 1 ? "disabled" : "current-btn"} onClick={goToPrevPage} disabled={currentPage===1}><MdArrowBackIos  style={{color: "#667085",fontSize:".9rem",marginLeft:'.2rem'}}/></button>
       
          {Array.from({ length: totalPages }, (_, i) => (
            
              <button key={i} className={currentPage === i + 1 ? "active-page" : "current-page"} onClick={() => paginate(i + 1)}>{i + 1}</button>
        
          ))}
         
            <button className={currentPage === totalPages ? "disabled" : "current-btn"} onClick={goToNextPage}><MdArrowForwardIos  style={{color: "#667085",fontSize:".9rem",}}/></button>
          
        </div>
      </div>
    );
  };
  export default Pagination