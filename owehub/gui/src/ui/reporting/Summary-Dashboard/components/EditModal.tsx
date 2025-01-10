import React, { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import './table.css'
import { ActionButton } from '../../../components/button/ActionButton';
import { FaPencil } from 'react-icons/fa6';
import { TiTick } from 'react-icons/ti';

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
    const data = [
        { month: "January", projectSold: 1960, mwSold: 213, installCT: 342, mwInstalled: 546, batteriesCT: 456 },
        { month: "February", projectSold: 1500, mwSold: 120, installCT: 300, mwInstalled: 400, batteriesCT: 350 },
        { month: "March", projectSold: 1700, mwSold: 200, installCT: 330, mwInstalled: 500, batteriesCT: 400 },
        { month: "April", projectSold: 1400, mwSold: 180, installCT: 310, mwInstalled: 450, batteriesCT: 380 },
        { month: "May", projectSold: 1800, mwSold: 210, installCT: 340, mwInstalled: 520, batteriesCT: 420 },
        { month: "June", projectSold: 1600, mwSold: 190, installCT: 320, mwInstalled: 480, batteriesCT: 390 },
        { month: "July", projectSold: 1900, mwSold: 220, installCT: 350, mwInstalled: 530, batteriesCT: 430 },
        { month: "August", projectSold: 2000, mwSold: 230, installCT: 360, mwInstalled: 550, batteriesCT: 450 },
        { month: "September", projectSold: 1750, mwSold: 205, installCT: 335, mwInstalled: 505, batteriesCT: 415 },
        { month: "October", projectSold: 1850, mwSold: 215, installCT: 345, mwInstalled: 515, batteriesCT: 425 },
        { month: "November", projectSold: 1650, mwSold: 195, installCT: 325, mwInstalled: 485, batteriesCT: 395 },
        { month: "December", projectSold: 1950, mwSold: 225, installCT: 355, mwInstalled: 545, batteriesCT: 455 }
    ];

    const grandTotal = data.reduce((totals, row) => ({
        projectSold: totals.projectSold + row.projectSold,
        mwSold: totals.mwSold + row.mwSold,
        installCT: totals.installCT + row.installCT,
        mwInstalled: totals.mwInstalled + row.mwInstalled,
        batteriesCT: totals.batteriesCT + row.batteriesCT,
    }), { projectSold: 0, mwSold: 0, installCT: 0, mwInstalled: 0, batteriesCT: 0 });

    const [showInput, setShowInput] = useState<Record<string, InputState>>({});
    console.log(showInput)
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


    return (
        <>
            {true &&
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
                                                <td style={{ color: isPastMonth ? "#888" : "#3E3E3E" }}>

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


                                                <td style={{ color: isPastMonth ? "#888" : "#3E3E3E" }}>
                                                    {!showInput[row.month]?.showprojectSold ? (
                                                        <div onClick={() => handleShow(row.month, 'projectSold', row.projectSold)}>
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

                                                <td style={{ color: isPastMonth ? "#888" : "#3E3E3E" }}>
                                                    {!showInput[row.month]?.showmwSold && (
                                                        <div onClick={() => handleShow(row.month, 'mwSold', row.mwSold)}>
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

                                                <td style={{ color: isPastMonth ? "#888" : "#3E3E3E" }}>
                                                    {!showInput[row.month]?.showinstallCT && (
                                                        <div onClick={() => handleShow(row.month, 'installCT', row.installCT)}>
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

                                                <td style={{ color: isPastMonth ? "#888" : "#3E3E3E" }}>
                                                    {!showInput[row.month]?.showmwInstalled && (
                                                        <div onClick={() => handleShow(row.month, 'mwInstalled', row.mwInstalled)}>
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

                                                <td style={{ color: isPastMonth ? "#888" : "#3E3E3E" }}>
                                                    {!showInput[row.month]?.showbatteriesCT && (
                                                        <div onClick={() => handleShow(row.month, 'batteriesCT', row.batteriesCT)}>
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
                            <ActionButton title={'Save Changes'} onClick={() => { }} type={'submit'} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default EditModal
