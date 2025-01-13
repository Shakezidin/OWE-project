import React, { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import './table.css'
import { ActionButton } from '../../../components/button/ActionButton';
import { FaPencil } from 'react-icons/fa6';
import { TiTick } from 'react-icons/ti';
import useAuth from '../../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { reportingCaller } from '../../../../infrastructure/web_api/services/apiUrl';



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


const EditModal = ({ open, handleClose }: any) => {
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
    const [ref, setRef] = useState(0);
    useEffect(() => {
        const isPasswordChangeRequired =
            authData?.isPasswordChangeRequired?.toString();
        setAuthenticated(isPasswordChangeRequired === 'false');
    }, [authData]);

    useEffect(() => {
        if (isAuthenticated && open) {
            const fetchData = async () => {

                try {
                    setIsLoading(true);
                    const response = await reportingCaller(
                        'get_production_targets_by_year',
                        { "year": 2024 },
                    );
                    if (response.status === 200) {
                        setSalesData(response?.data)
                    } else if (response.status > 201) {
                        toast.error(response.data.message);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [isAuthenticated, open, ref]);

    const data = salesData.map(item => ({
        month: item.month,
        projectSold: item.projects_sold,
        mwSold: item.mw_sold,
        installCT: item.install_ct,
        mwInstalled: item.mw_installed,
        batteriesCT: item.batteries_ct,
    }));


    const grandTotal = data.reduce((totals, row) => ({
        projectSold: totals.projectSold + row.projectSold,
        mwSold: totals.mwSold + row.mwSold,
        installCT: totals.installCT + row.installCT,
        mwInstalled: totals.mwInstalled + row.mwInstalled,
        batteriesCT: totals.batteriesCT + row.batteriesCT,
    }), { projectSold: 0, mwSold: 0, installCT: 0, mwInstalled: 0, batteriesCT: 0 });

    const [showInput, setShowInput] = useState<Record<string, InputState>>({});

    const handleShow = (month: string, key: keyof InputState, value: number) => {
        setShowInput((prevState) => {
            const currentMonthState = prevState[month] || {};
            return {
                ...prevState,
                [month]: {
                    ...currentMonthState,
                    [`show${key.charAt(0).toLowerCase()}${key.slice(1)}`]: true,
                    [key]: value,
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

    const year = 2024;

    const convertData = () => {
        const convertedData = Object.entries(showInput).map(([month, data]) => {
            const {
                showprojectSold,
                projectSold,
                showmwSold,
                mwSold,
                showinstallCT,
                installCT,
                showmwInstalled,
                mwInstalled,
                showbatteriesCT,
                batteriesCT,
            } = data;

            const monthNumber = new Date(Date.parse(month + " 1")).getMonth() + 1;

            const result = {
                year,
                month: monthNumber,
                projects_sold: showprojectSold ? projectSold : undefined,
                mw_sold: showmwSold ? mwSold : undefined,
                install_ct: showinstallCT ? installCT : undefined,
                mw_installed: showmwInstalled ? mwInstalled : undefined,
                batteries_ct: showbatteriesCT ? batteriesCT : undefined,
            };

            // Remove fields with undefined values
            Object.keys(result).forEach((key) => {
                if ((result as any)[key] === undefined) {
                    delete (result as any)[key];
                }
            });

            return result;
        });

        return convertedData;
    };

   const dataTarget = convertData()

   console.log(dataTarget)


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await reportingCaller(
                'update_production_targets',
                {
                    "targets": dataTarget
                },
            );
            if (response.status === 200) {
                toast.success('Target Updated Succesfully');
                setRef(ref+1);
                handleClose();
            } else if (response.status >= 201) {
                toast.warn(response.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }

    };


    return (
        <>
            {open &&
                <div className="transparent-model">
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

                                                    {isCurrentMonth && (
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


                                                <td className={`${isPastMonth ? 'viraj' : ''}`}>
                                                    {!showInput[row.month]?.showprojectSold ? (
                                                        <div style={{ cursor: isPastMonth ? "" : "pointer" }} onClick={() => {
                                                            if (!isPastMonth) {
                                                                handleShow(row.month, 'projectSold', row.projectSold)
                                                            }
                                                        }}
                                                        >
                                                            {row.projectSold}
                                                        </div>
                                                    ) : (
                                                        <div className="edit_input">
                                                            <input
                                                                type="number"
                                                                value={showInput[row.month]?.projectSold || row.projectSold}
                                                                onChange={(e) =>
                                                                    setShowInput((prevState) => ({
                                                                        ...prevState,
                                                                        [row.month]: {
                                                                            ...prevState[row.month],
                                                                            projectSold: Number(e.target.value),
                                                                        },
                                                                    }))
                                                                }
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

                                                <td className={`${isPastMonth ? 'viraj' : ''}`}>
                                                    {!showInput[row.month]?.showmwSold && (
                                                        <div style={{ cursor: isPastMonth ? "" : "pointer" }}
                                                            onClick={() => {
                                                                if (!isPastMonth) {
                                                                    handleShow(row.month, 'mwSold', row.mwSold)
                                                                }
                                                            }}

                                                        >
                                                            {row.mwSold}
                                                        </div>
                                                    )}
                                                    {showInput[row.month]?.showmwSold && (
                                                        <div className="edit_input">
                                                            <input
                                                                type="number"
                                                                value={showInput[row.month]?.mwSold || row.mwSold}
                                                                onChange={(e) =>
                                                                    setShowInput((prevState) => ({
                                                                        ...prevState,
                                                                        [row.month]: {
                                                                            ...prevState[row.month],
                                                                            mwSold: Number(e.target.value),
                                                                        },
                                                                    }))
                                                                }
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

                                                <td className={`${isPastMonth ? 'viraj' : ''}`}>
                                                    {!showInput[row.month]?.showinstallCT && (
                                                        <div style={{ cursor: isPastMonth ? "" : "pointer" }} onClick={() => { if (!isPastMonth) { handleShow(row.month, 'installCT', row.installCT) } }}>
                                                            {row.installCT}
                                                        </div>
                                                    )}
                                                    {showInput[row.month]?.showinstallCT && (
                                                        <div className="edit_input">
                                                            <input
                                                                type="number"
                                                                value={showInput[row.month]?.installCT || row.installCT}
                                                                onChange={(e) =>
                                                                    setShowInput((prevState) => ({
                                                                        ...prevState,
                                                                        [row.month]: {
                                                                            ...prevState[row.month],
                                                                            installCT: Number(e.target.value),
                                                                        },
                                                                    }))
                                                                }
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

                                                <td className={`${isPastMonth ? 'viraj' : ''}`}>
                                                    {!showInput[row.month]?.showmwInstalled && (
                                                        <div style={{ cursor: isPastMonth ? "" : "pointer" }} onClick={() => { if (!isPastMonth) { handleShow(row.month, 'mwInstalled', row.mwInstalled) } }}>
                                                            {row.mwInstalled}
                                                        </div>
                                                    )}
                                                    {showInput[row.month]?.showmwInstalled && (
                                                        <div className="edit_input">
                                                            <input
                                                                type="number"
                                                                value={showInput[row.month]?.mwInstalled || row.mwInstalled}
                                                                onChange={(e) =>
                                                                    setShowInput((prevState) => ({
                                                                        ...prevState,
                                                                        [row.month]: {
                                                                            ...prevState[row.month],
                                                                            mwInstalled: Number(e.target.value),
                                                                        },
                                                                    }))
                                                                }
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

                                                <td className={`${isPastMonth ? 'viraj' : ''}`}>
                                                    {!showInput[row.month]?.showbatteriesCT && (
                                                        <div style={{ cursor: isPastMonth ? "" : "pointer" }} onClick={() => { if (!isPastMonth) { handleShow(row.month, 'batteriesCT', row.batteriesCT) } }}>
                                                            {row.batteriesCT}
                                                        </div>
                                                    )}
                                                    {showInput[row.month]?.showbatteriesCT && (
                                                        <div className="edit_input">
                                                            <input
                                                                type="number"
                                                                value={showInput[row.month]?.batteriesCT || row.batteriesCT}
                                                                onChange={(e) =>
                                                                    setShowInput((prevState) => ({
                                                                        ...prevState,
                                                                        [row.month]: {
                                                                            ...prevState[row.month],
                                                                            batteriesCT: Number(e.target.value),
                                                                        },
                                                                    }))
                                                                }
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
                                        <th>{grandTotal.projectSold}</th>
                                        <th>{grandTotal.mwSold}</th>
                                        <th>{grandTotal.installCT}</th>
                                        <th>{grandTotal.mwInstalled}</th>
                                        <th>{grandTotal.batteriesCT}</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className='button-sec-target'>
                            <ActionButton
                                title={'Cancel'}
                                onClick={handleClose}
                                type={'button'}
                            />
                            <ActionButton title={'Save Changes'} onClick={() => {handleSubmit}} type={'submit'} />
                            {/* <button onClick={handleSubmit}>test button</button> */}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default EditModal
