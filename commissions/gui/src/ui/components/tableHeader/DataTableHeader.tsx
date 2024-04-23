import React from "react";
import { ICONS } from "../../icons/Icons";
import { IoAddSharp } from "react-icons/io5";
import "../../pages/configure/configure.css";
import { BiSearch, BiChevronDown } from 'react-icons/bi';
import '../tableHeader/dataTableHeader.css'
interface TableProps {
    title: string;

    onPressFilter: () => void;
    // onPressImport: () => void;


}

const DataTableHeader = (props: TableProps) => {
    const {
        title,
        onPressFilter,
        // onPressImport,

    } = props;
    return (
        <div className="commissionSection">
            <div className="rateSection">
                <h2>{title}</h2>

            </div>
            <div className="data-header-section">
                <div className="search-container-data">
                    <input
                        type="text"
                        placeholder="Select Table"
                        className="search-input-data"
                    />
                    <BiChevronDown className="dropdown-icon" />

                </div>


                <div className="iconsSection-filter">
                    <button type="button" onClick={onPressFilter}>
                        <img src={ICONS.FILTER} alt="" />
                    </button>
                </div>
                {/* <div className="iconsSection-filter">
                    <button type="button" onClick={onPressImport}>
                        <img src={ICONS.IMAGE_IMPORT} alt="" /> Import
                    </button>
                </div> */}
            </div>
         
        </div >
    );
};

export default DataTableHeader;