import React, { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import './table.css'
import { ActionButton } from '../../../components/button/ActionButton';
import { FaPencil } from 'react-icons/fa6';
import { TiTick } from 'react-icons/ti';
import useAuth from '../../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { reportingCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import MicroLoader from '../../../components/loader/MicroLoader';
import DataNotFound from '../../../components/loader/DataNotFound';
import useWindowWidth from '../../../../hooks/useWindowWidth';



interface InputState {
    showprojectSold: boolean;
    projectSold?: number;
    showmwSold: boolean;
    mwSold?: number;
    showinstallCT: boolean;
    installCT?: number;
    showmwInstalled: boolean;
    mwInstalled?: number;
    showbatteriesCT: boolean;
    batteriesCT?: number;
}



const EditModal = ({ refre, setRefre, year, open, handleClose }: any) => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const { authData, saveAuthData } = useAuth();
    const [loading, setIsLoading] = useState(false)
    const [salesData, setSalesData] = useState([
        {
            month: "",
            projects_sold: 0,
            mw_sold: 0,
            install_ct: 0,
            mw_installed: 0,
            batteries_ct: 0,
        },
    ]);

    useEffect(() => {
        const isPasswordChangeRequired =
            authData?.isPasswordChangeRequired?.toString();
        setAuthenticated(isPasswordChangeRequired === 'false');
    }, [authData]);
    const [loadinged, setLoadingEd] = useState(false)

    useEffect(() => {
        setLoadingEd(true)
        if (isAuthenticated && open) {
            const fetchData = async () => {

                try {
                    setIsLoading(true);
                    const response = await reportingCaller(
                        'get_production_targets_by_year',
                        { "year": year },
                    );
                    if (response.status === 200) {
                        setSalesData(response?.data)
                        setLoadingEd(false)
                    } else if (response.status > 201) {
                        toast.error(response.data.message);
                        setLoadingEd(false)
                    }
                } catch (error) {
                    console.error(error);
                    setLoadingEd(false)
                } finally {
                    setIsLoading(false);
                    setLoadingEd(false)
                }
            };

            fetchData();
        }
    }, [isAuthenticated, year, open, refre]);



    const data = salesData.map(item => ({
        month: item.month,
        projectSold: item.projects_sold,
        mwSold: item.mw_sold,
        installCT: item.install_ct,
        mwInstalled: item.mw_installed,
        batteriesCT: item.batteries_ct,
    }));

    const [showInput, setShowInput] = useState<Record<string, InputState>>({});
    const grandTotal = data.reduce((totals, row) => ({
        projectSold: totals.projectSold + (showInput[row.month]?.projectSold ?? row.projectSold),
        mwSold: totals.mwSold + (showInput[row.month]?.mwSold ?? row.mwSold),
        installCT: totals.installCT + (showInput[row.month]?.installCT ?? row.installCT),
        mwInstalled: totals.mwInstalled + (showInput[row.month]?.mwInstalled ?? row.mwInstalled),
        batteriesCT: totals.batteriesCT + (showInput[row.month]?.batteriesCT ?? row.batteriesCT),
    }), { projectSold: 0, mwSold: 0, installCT: 0, mwInstalled: 0, batteriesCT: 0 });



    const handleShow = (month: string, key: keyof InputState, value: number) => {
        setShowInput((prevState) => {
            const currentMonthState = prevState[month] || {};
            return {
                ...prevState,
                [month]: {
                    ...currentMonthState,
                    [`show${key.charAt(0).toLowerCase()}${key.slice(1)}`]: true,
                    [key]: currentMonthState[key] ?? value,
                },
            };
        });
    };

    const handleHide = (month: string, key: keyof InputState) => {
        setShowInput((prevState) => ({
            ...prevState,
            [month]: {
                ...prevState[month],
                [`show${key.charAt(0).toLowerCase()}${key.slice(1)}`]: false,
            },
        }));
    };

    const [showInputTest, setShowInputTest] = useState<Record<string, InputState>>({});





    const convertData = () => {

        const convertedData = Object.entries(showInput).map(([month, data]) => {
            const {
                projectSold,
                mwSold,
                installCT,
                mwInstalled,
                batteriesCT,
            } = data;

            const monthNumber = new Date(Date.parse(month + " 1")).getMonth() + 1;

            const result = {
                year,
                month: monthNumber,
                projects_sold: projectSold,
                mw_sold: mwSold,
                install_ct: installCT,
                mw_installed: mwInstalled,
                batteries_ct: batteriesCT
            };

            const importantKeys = ["projects_sold", "mw_sold", "install_ct", "mw_installed", "batteries_ct"];

            const cleanedResult = Object.fromEntries(
                Object.entries(result).filter(([key, value]) =>
                    importantKeys.includes(key) ? value !== undefined : true
                )
            );

            if (importantKeys.some(key => cleanedResult[key] !== undefined)) {
                return cleanedResult;
            }


        });

        return convertedData;
    };

    const convertData2 = () => {

        const convertedData = Object.entries(showInputTest).map(([month, data]) => {
            const {
                projectSold,
                mwSold,
                installCT,
                mwInstalled,
                batteriesCT,
            } = data;

            const monthNumber = new Date(Date.parse(month + " 1")).getMonth() + 1;

            const result = {
                year,
                month: monthNumber,
                projects_sold: projectSold,
                mw_sold: mwSold,
                install_ct: installCT,
                mw_installed: mwInstalled,
                batteries_ct: batteriesCT
            };

            const importantKeys = ["projects_sold", "mw_sold", "install_ct", "mw_installed", "batteries_ct"];

            const cleanedResult = Object.fromEntries(
                Object.entries(result).filter(([key, value]) =>
                    importantKeys.includes(key) ? value !== undefined : true
                )
            );

            if (importantKeys.some(key => cleanedResult[key] !== undefined)) {
                return cleanedResult;
            }


        });

        return convertedData;
    };








    const mergeArraysByIndex = (data1: any[], data2: any[]) => {
        return data1.map((item, index) => ({
            ...item,
            ...(data2[index] || {}) // Merge if index exists in data2
        }));
    };

    const dataTarget = convertData();
    const dataTarget2 = convertData2();

    const mergeArrayData = (data1: any, data2: any) => {
        if (!data1?.length || !data2?.length) return [];

        return data1.map((firstObj:any, index:any) => {
            const secondObj = data2[index];

            if (!secondObj) return firstObj;

            // Merge objects, taking new keys from secondObj
            return {
                ...firstObj,
                ...Object.fromEntries(
                    Object.entries(secondObj).filter(([key]) => !(key in firstObj))
                )
            };
        });
    };




    const mergedData = React.useMemo(() => {
        return mergeArrayData(dataTarget, dataTarget2);
    }, [dataTarget, dataTarget2]);

   





    const [load, setLoad] = useState(false)

    const handleSubmit = async () => {
        setLoad(true)
        try {
            const response = await reportingCaller(
                'update_production_targets',
                {
                    "targets": mergedData
                },
            );
            if (response.status === 200) {
                toast.success('Target Updated Succesfully');
                setRefre(refre + 1);
                handleClose();
                setLoad(false)
            } else if (response.status >= 201) {
                toast.warn(response.message);
                setLoad(false)
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setLoad(false)
        }

    };

    const currentYear = new Date().getFullYear();
    const prevYear = currentYear > parseInt(year);

    useEffect(() => {
        setShowInput({});
        setShowInputTest({});
    }, [open, refre]);

    const width = useWindowWidth();
    const isMobile = width <= 767;
    const isTablet = width <= 1024;
    useEffect(() => {
        const handleEscapeKey = (event: any) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);




    return (
        <>
            {open &&
                <div className="transparent-model">
                    <div className='ed-top-div'>
                        <div className="edittar_mod_top">
                            <div className='editTar-header'>
                                <p>Edit Target</p>
                                <RxCross2 className="edit-report-cross-icon" size={20} onClick={handleClose} style={{ cursor: "pointer" }} />
                            </div>
                            <div className="editTarget-table-container" style={{ height: "450px" }}>
                                <table className="editTarget-custom-table" >
                                    <thead>
                                        <tr>
                                            <th>Months</th>
                                            <th>Project Sold</th>
                                            <th>mw Sold</th>
                                            <th>Install CT</th>
                                            <th>mw Installed</th>
                                            <th>Batteries CT</th>
                                        </tr>
                                    </thead>
                                    {(loadinged) ? (
                                        <tbody>
                                            <tr>
                                                <td colSpan={8}>
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <MicroLoader />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    ) : data ? (
                                        <>
                                            <tbody>

                                                {data.map((row, index) => {
                                                    const currentMonth = new Date().getMonth();
                                                    const isPastMonth = index < currentMonth;
                                                    const isCurrentMonth = index === currentMonth;

                                                    return (
                                                        <tr
                                                            key={index}
                                                            className={isPastMonth ? "pastMonth" : ""}
                                                            style={{ cursor: isPastMonth ? "not-allowed" : "default" }}
                                                        >
                                                            <td>

                                                                {(isCurrentMonth && !prevYear) && (
                                                                    <span
                                                                        style={{
                                                                            display: "inline-block",
                                                                            width: "8px",
                                                                            height: "8px",
                                                                            borderRadius: "50%",
                                                                            backgroundColor: "#377CF6",
                                                                            marginRight: "5px",
                                                                        }}
                                                                    ></span>
                                                                )}
                                                                {row.month}
                                                            </td>


                                                            <td className={`${(isPastMonth || prevYear) ? 'viraj' : ''}`}>
                                                                {!showInput[row.month]?.showprojectSold && (
                                                                    <div
                                                                        style={{ cursor: (isPastMonth || prevYear) ? "" : "pointer" }}
                                                                        onClick={() => {
                                                                            if (!(isPastMonth || prevYear)) {
                                                                                handleShow(row.month, 'projectSold', row.projectSold);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {showInput[row.month]?.projectSold ?? row.projectSold}
                                                                    </div>
                                                                )}
                                                                {showInput[row.month]?.showprojectSold && (
                                                                    <div className="edit_input">
                                                                        <input
                                                                            type="number"
                                                                            maxLength={6}

                                                                            value={showInput[row.month]?.projectSold !== undefined ? showInput[row.month]?.projectSold : row.projectSold}
                                                                            onChange={(e) => {
                                                                                setShowInputTest((prevState) => ({
                                                                                    ...prevState,
                                                                                    [row.month]: {
                                                                                        ...prevState[row.month],
                                                                                        projectSold: row.projectSold,
                                                                                        mwSold: row.mwSold,
                                                                                        mwInstalled: row.mwInstalled,
                                                                                        batteriesCT: row.batteriesCT,
                                                                                        installCT: row.installCT
                                                                                    },
                                                                                }));
                                                                                const value = e.target.value;
                                                                                const beforeDecimal = value.split('.')[0];
                                                                                if (beforeDecimal.length <= 8) {
                                                                                    setShowInput((prevState) => ({
                                                                                        ...prevState,
                                                                                        [row.month]: {
                                                                                            ...prevState[row.month],
                                                                                            projectSold: Number(value),

                                                                                        },
                                                                                    }));
                                                                                }
                                                                            }}
                                                                        />
                                                                        <TiTick
                                                                            onClick={() => handleHide(row.month, 'projectSold')}
                                                                            size={25}
                                                                            style={{
                                                                                height: "20px",
                                                                                width: "20px",
                                                                                cursor: "pointer",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </td>

                                                            <td className={`${(isPastMonth || prevYear) ? 'viraj' : ''}`}>
                                                                {!showInput[row.month]?.showmwSold && (
                                                                    <div
                                                                        style={{ cursor: (isPastMonth || prevYear) ? "" : "pointer" }}
                                                                        onClick={() => {
                                                                            if (!(isPastMonth || prevYear)) {
                                                                                handleShow(row.month, 'mwSold', row.mwSold);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {showInput[row.month]?.mwSold ?? row.mwSold}
                                                                    </div>
                                                                )}
                                                                {showInput[row.month]?.showmwSold && (
                                                                    <div className="edit_input">
                                                                        <input
                                                                            type="number"
                                                                            maxLength={6}

                                                                            value={showInput[row.month]?.mwSold !== undefined ? showInput[row.month]?.mwSold : row.mwSold}
                                                                            onChange={(e) => {
                                                                                setShowInputTest((prevState) => ({
                                                                                    ...prevState,
                                                                                    [row.month]: {
                                                                                        ...prevState[row.month],
                                                                                        projectSold: row.projectSold,
                                                                                        mwSold: row.mwSold,
                                                                                        mwInstalled: row.mwInstalled,
                                                                                        batteriesCT: row.batteriesCT,
                                                                                        installCT: row.installCT
                                                                                    },
                                                                                }));
                                                                                const value = e.target.value;
                                                                                const beforeDecimal = value.split('.')[0];
                                                                                if (beforeDecimal.length <= 8) {
                                                                                    setShowInput((prevState) => ({
                                                                                        ...prevState,
                                                                                        [row.month]: {
                                                                                            ...prevState[row.month],
                                                                                            mwSold: Number(value),
                                                                                        },
                                                                                    }));
                                                                                }
                                                                            }}
                                                                        />
                                                                        <TiTick
                                                                            onClick={() => handleHide(row.month, 'mwSold')}
                                                                            size={25}
                                                                            style={{
                                                                                height: "20px",
                                                                                width: "20px",
                                                                                cursor: "pointer",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </td>


                                                            <td className={`${(isPastMonth || prevYear) ? 'viraj' : ''}`}>
                                                                {!showInput[row.month]?.showinstallCT && (
                                                                    <div
                                                                        style={{ cursor: (isPastMonth || prevYear) ? "" : "pointer" }}
                                                                        onClick={() => {
                                                                            if (!(isPastMonth || prevYear)) {
                                                                                handleShow(row.month, 'installCT', row.installCT);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {showInput[row.month]?.installCT ?? row.installCT}
                                                                    </div>
                                                                )}
                                                                {showInput[row.month]?.showinstallCT && (
                                                                    <div className="edit_input">
                                                                        <input
                                                                            type="number"
                                                                            maxLength={6}

                                                                            value={showInput[row.month]?.installCT !== undefined ? showInput[row.month]?.installCT : row.installCT}

                                                                            onChange={(e) => {
                                                                                setShowInputTest((prevState) => ({
                                                                                    ...prevState,
                                                                                    [row.month]: {
                                                                                        ...prevState[row.month],
                                                                                        projectSold: row.projectSold,
                                                                                        mwSold: row.mwSold,
                                                                                        mwInstalled: row.mwInstalled,
                                                                                        batteriesCT: row.batteriesCT,
                                                                                        installCT: row.installCT
                                                                                    },
                                                                                }));
                                                                                const value = e.target.value;
                                                                                const beforeDecimal = value.split('.')[0];
                                                                                if (beforeDecimal.length <= 8) {
                                                                                    setShowInput((prevState) => ({
                                                                                        ...prevState,
                                                                                        [row.month]: {
                                                                                            ...prevState[row.month],
                                                                                            installCT: Number(value),
                                                                                        },
                                                                                    }));
                                                                                }
                                                                            }}
                                                                        />
                                                                        <TiTick
                                                                            onClick={() => handleHide(row.month, 'installCT')}
                                                                            size={25}
                                                                            style={{
                                                                                height: "20px",
                                                                                width: "20px",
                                                                                cursor: "pointer",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </td>



                                                            <td className={`${(isPastMonth || prevYear) ? 'viraj' : ''}`}>
                                                                {!showInput[row.month]?.showmwInstalled && (
                                                                    <div
                                                                        style={{ cursor: (isPastMonth || prevYear) ? "" : "pointer" }}
                                                                        onClick={() => {
                                                                            if (!(isPastMonth || prevYear)) {
                                                                                handleShow(row.month, 'mwInstalled', row.mwInstalled);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {showInput[row.month]?.mwInstalled ?? row.mwInstalled}
                                                                    </div>
                                                                )}
                                                                {showInput[row.month]?.showmwInstalled && (
                                                                    <div className="edit_input">
                                                                        <input
                                                                            type="number"

                                                                            value={showInput[row.month]?.mwInstalled !== undefined ? showInput[row.month]?.mwInstalled : row.mwInstalled}

                                                                            onChange={(e) => {
                                                                                setShowInputTest((prevState) => ({
                                                                                    ...prevState,
                                                                                    [row.month]: {
                                                                                        ...prevState[row.month],
                                                                                        projectSold: row.projectSold,
                                                                                        mwSold: row.mwSold,
                                                                                        mwInstalled: row.mwInstalled,
                                                                                        batteriesCT: row.batteriesCT,
                                                                                        installCT: row.installCT
                                                                                    },
                                                                                }));
                                                                                const value = e.target.value;
                                                                                const beforeDecimal = value.split('.')[0];
                                                                                if (beforeDecimal.length <= 8) {
                                                                                    setShowInput((prevState) => ({
                                                                                        ...prevState,
                                                                                        [row.month]: {
                                                                                            ...prevState[row.month],
                                                                                            mwInstalled: Number(value),
                                                                                        },
                                                                                    }));
                                                                                }
                                                                            }}
                                                                        />
                                                                        <TiTick
                                                                            onClick={() => handleHide(row.month, 'mwInstalled')}
                                                                            size={25}
                                                                            style={{
                                                                                height: "20px",
                                                                                width: "20px",
                                                                                cursor: "pointer",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </td>

                                                            <td className={`${(isPastMonth || prevYear) ? 'viraj' : ''}`}>
                                                                {!showInput[row.month]?.showbatteriesCT && (
                                                                    <div
                                                                        style={{ cursor: (isPastMonth || prevYear) ? "" : "pointer" }}
                                                                        onClick={() => {
                                                                            if (!(isPastMonth || prevYear)) {
                                                                                handleShow(row.month, 'batteriesCT', row.batteriesCT);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {showInput[row.month]?.batteriesCT ?? row.batteriesCT}
                                                                    </div>
                                                                )}
                                                                {showInput[row.month]?.showbatteriesCT && (
                                                                    <div className="edit_input">
                                                                        <input
                                                                            type="number"

                                                                            maxLength={6}
                                                                            value={showInput[row.month]?.batteriesCT !== undefined ? showInput[row.month]?.batteriesCT : row.batteriesCT}

                                                                            onChange={(e) => {

                                                                                setShowInputTest((prevState) => ({
                                                                                    ...prevState,
                                                                                    [row.month]: {
                                                                                        ...prevState[row.month],
                                                                                        projectSold: row.projectSold,
                                                                                        mwSold: row.mwSold,
                                                                                        mwInstalled: row.mwInstalled,
                                                                                        batteriesCT: row.batteriesCT,
                                                                                        installCT: row.installCT
                                                                                    },
                                                                                }));
                                                                                const value = e.target.value;
                                                                                const beforeDecimal = value.split('.')[0];
                                                                                if (beforeDecimal.length <= 8) {
                                                                                    setShowInput((prevState) => ({
                                                                                        ...prevState,
                                                                                        [row.month]: {
                                                                                            ...prevState[row.month],
                                                                                            batteriesCT: Number(value),
                                                                                        },
                                                                                    }));
                                                                                }
                                                                            }}

                                                                        />
                                                                        <TiTick
                                                                            onClick={() => handleHide(row.month, 'batteriesCT')}
                                                                            size={25}
                                                                            style={{
                                                                                height: "20px",
                                                                                width: "20px",
                                                                                cursor: "pointer",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </td>


                                                        </tr>
                                                    );
                                                })}

                                            </tbody>
                                            <tfoot>
                                                <tr style={{ position: "sticky", bottom: "0" }}>
                                                    <th>Total</th>
                                                    <th>{(grandTotal.projectSold).toFixed(2)}</th>
                                                    <th>{(grandTotal.mwSold).toFixed(2)}</th>
                                                    <th>{(grandTotal.installCT).toFixed(2)}</th>
                                                    <th>{(grandTotal.mwInstalled).toFixed(2)}</th>
                                                    <th>{(grandTotal.batteriesCT).toFixed(2)}</th>
                                                </tr>
                                            </tfoot>
                                        </>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <DataNotFound />
                                        </div>
                                    )}
                                </table>
                            </div>
                            <div className='button-sec-target'>
                                <ActionButton
                                    title={'Cancel'}
                                    onClick={handleClose}
                                    type={'button'}
                                />
                                <ActionButton
                                    style={{
                                        backgroundColor: (load || !(dataTarget.length > 0)) ? "#4062CA" : "",
                                        transform: (load || !(dataTarget.length > 0)) ? "none" : "",
                                        cursor: (load || !(dataTarget.length > 0)) ? "not-allowed" : "",
                                    }}
                                    disabled={load || !(dataTarget.length > 0)} title={isMobile ? 'Save' : 'Save Changes'} onClick={handleSubmit} type={'submit'} />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default EditModal
