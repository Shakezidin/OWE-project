import React from "react";
import { ICONS } from "../../icons/Icons";
import { IoAddSharp } from "react-icons/io5";
import "../../pages/configure/configure.css";
import { BiSearch, BiChevronDown } from 'react-icons/bi';
import '../tableHeader/dataTableHeader.css'
import Select from "react-select"; interface TableProps {
    title: string;
    onPressFilter: () => void;
    onPressImport: () => void;
    showImportIcon: boolean;
    showSelectIcon: boolean;
}
interface OptionType {
    value: string;
    label: string;
}

const DataTableHeader = (props: TableProps) => {
    const {
        title,
        onPressFilter,
        onPressImport,

    } = props;



    const options: OptionType[] = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'orange', label: 'Orange' },
    ];
    return (
        <div className="commissionSection">
            <div className="rateSection">
                <h2>{title}</h2>
            </div>
            <div className="data-header-section">
                <div className="search-container-data">
                {props.showSelectIcon && (
                    <Select

                        isSearchable

                        value={""}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                marginTop: "px",
                                borderRadius: "8px",
                                outline: "none",
                                // height: "2rem",
                                width: "200px",
                                fontSize: "13px",
                                border: "1px solid #d0d5dd",
                            }),
                            indicatorSeparator: () => ({
                                display: 'none' // Hide the indicator separator
                            }),
                        }}
                    />
                )}
                </div>

                <div className="iconsSection-filter">
                    <button type="button" onClick={onPressFilter}>
                        <img src={ICONS.filtercomm} alt="" style={{ width: "15px", height: "15px" }} />
                    </button>
                </div>
                <div className="iconsSection2">
                    {props.showImportIcon && (
                        <button type="button" onClick={onPressImport}>
                            <img src={ICONS.importIcon} alt="" /> Import
                        </button>
                    )}
                </div>
            </div>

        </div >
    );
};

export default DataTableHeader;