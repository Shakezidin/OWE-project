import React, { useState } from 'react'
import classes from './summary.module.css'
import SelectOption from '../../components/selectOption/SelectOption'
import RadialChart from './components/RadialChart';
import RadarChartComponenet from './components/RadarChart';
import BarChartComp from './components/BarChart';
import LineChartComp from './components/LineChart';
import { MdBarChart } from 'react-icons/md';
import { FaChartLine } from 'react-icons/fa';
import EditModal from './components/EditModal';
import { ICONS } from '../../../resources/icons/Icons';
interface Option {
    value: string;
    label: string;
}

const Summary_Dashboard = () => {
    const [reportType, setReportType] = useState<Option>(
        {
            label: 'November',
            value: 'November',
        }
    );
    const [year, setYear] = useState<Option>(
        {
            label: '2024',
            value: '2024',
        }
    );
    const years = [
        {
            label: '2022',
            value: '2022',
        },
        {
            label: '2023',
            value: '2023',
        },
        {
            label: '2024',
            value: '2024',
        },
        {
            label: '2025',
            value: '2025',
        }
    ]
    const options = [
        {
            label: 'January',
            value: 'January',
        },
        {
            label: 'February',
            value: 'February',
        },
        {
            label: 'March',
            value: 'March',
        },
        {
            label: 'April',
            value: 'April',
        },
        {
            label: 'May',
            value: 'May',
        },
        {
            label: 'June',
            value: 'June',
        },
        {
            label: 'July',
            value: 'July',
        },
        {
            label: 'August',
            value: 'August',
        },
        {
            label: 'September',
            value: 'September',
        },
        {
            label: 'October',
            value: 'October',
        },
        {
            label: 'November',
            value: 'November',
        },
        {
            label: 'December',
            value: 'December',
        },
    ];
    const stylesGraph = {
        width: '100%',
        height: '463px',
        padding: "1rem",
        borderRight: "1px dotted #D7D9DC"

    };
    const stylesGraph2 = {
        width: '100%',
        height: '500px',
        padding: "1rem",

    };

    const [activeButton, setActiveButton] = useState('Project Sold');

    const handleButtonClick = (buttonName: any) => {
        setActiveButton(buttonName);
    };
    const [line, setLine] = useState(false)
    const handleChartClick = () => {
        setLine(!line);
    }

    const [activePerc, setActivePerc] = useState('100');
    const handlePercButtonClick = (buttonName: any) => {
        setActivePerc(buttonName);
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <EditModal open={open} handleClose={handleClose} />
            <div className={classes.top_dashboard}>
                <div className={classes.top_box}>
                    <div className={classes.top_box_heading}>
                        <p>Summary</p>
                        <div className={classes.top_box_drop}>
                            <div className={classes.bottom_box_chart2_head_buttons_sec}>
                                <div
                                    className={`${classes.bottom_box_button_sec} ${activePerc === '100' ? classes.active : ''}`}
                                    // style={{ borderBottomLeftRadius: "10px", borderTopLeftRadius: "10px" }}
                                    onClick={() => handlePercButtonClick('100')}
                                >
                                    100%
                                </div>
                                <div
                                    className={`${classes.bottom_box_button_sec} ${activePerc === '75' ? classes.active : ''}`}
                                    // style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}
                                    onClick={() => handlePercButtonClick('75')}
                                >
                                    75%
                                </div>
                            </div>

                            <SelectOption
                                options={options}
                                onChange={(value: any) => setReportType(value)}
                                value={reportType}
                                controlStyles={{ marginTop: 0, minHeight: 30, minWidth: 150 }}
                                menuListStyles={{ fontWeight: 400 }}
                                singleValueStyles={{ fontWeight: 400 }}
                            />
                            <SelectOption
                                options={years}
                                onChange={(value: any) => setYear(value)}
                                value={year}
                                controlStyles={{ marginTop: 0, minHeight: 30, minWidth: 150 }}
                                menuListStyles={{ fontWeight: 400 }}
                                singleValueStyles={{ fontWeight: 400 }}
                            />
                        </div>
                    </div>
                    <div className={classes.top_box_boxes}>
                        <div className={classes.top_box_box}>
                            <div className={classes.top_box_top}>
                                <div className={classes.top_box_head}>
                                    <p>Project Sold</p>
                                </div>
                                <div className={classes.top_box_divs}>
                                    <div className={classes.top_box_head_left}>
                                        <h1>18,250</h1>
                                        <p>Archives</p>
                                    </div>
                                    <div className={classes.top_box_head_right}>
                                        <h1>20,250</h1>
                                        <p>Target</p>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.top_box_bottom}>
                                <p>last month target</p>
                                <h3 style={{ color: "#ABDB42" }}>100%</h3>
                            </div>
                        </div>
                        <div className={classes.top_box_box}>
                            <div className={classes.top_box_top}>
                                <div className={classes.top_box_head}>
                                    <p>mw Sold</p>
                                </div>
                                <div className={classes.top_box_divs}>
                                    <div className={classes.top_box_head_left}>
                                        <h1>18,250</h1>
                                        <p>Archives</p>
                                    </div>
                                    <div className={classes.top_box_head_right}>
                                        <h1>20,250</h1>
                                        <p>Target</p>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.top_box_bottom}>
                                <p>last month target</p>
                                <h3 style={{ color: "#ABDB42" }}>100%</h3>
                            </div>
                        </div>
                        <div className={classes.top_box_box}>
                            <div className={classes.top_box_top}>
                                <div className={classes.top_box_head}>
                                    <p>Install CT</p>
                                </div>
                                <div className={classes.top_box_divs}>
                                    <div className={classes.top_box_head_left}>
                                        <h1>18,250</h1>
                                        <p>Archives</p>
                                    </div>
                                    <div className={classes.top_box_head_right}>
                                        <h1>20,250</h1>
                                        <p>Target</p>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.top_box_bottom}>
                                <p>last month target</p>
                                <h3 style={{ color: "#EE4A3F" }}>100%</h3>
                            </div>
                        </div>
                        <div className={classes.top_box_box}>
                            <div className={classes.top_box_top}>
                                <div className={classes.top_box_head}>
                                    <p>mw Installed</p>
                                </div>
                                <div className={classes.top_box_divs}>
                                    <div className={classes.top_box_head_left}>
                                        <h1>18,250</h1>
                                        <p>Archives</p>
                                    </div>
                                    <div className={classes.top_box_head_right}>
                                        <h1>20,250</h1>
                                        <p>Target</p>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.top_box_bottom}>
                                <p>last month target</p>
                                <h3 style={{ color: "#ABDB42" }}>100%</h3>
                            </div>
                        </div>
                        <div className={classes.top_box_box}>
                            <div className={classes.top_box_top}>
                                <div className={classes.top_box_head}>
                                    <p>Batteries Ct</p>
                                </div>
                                <div className={classes.top_box_divs}>
                                    <div className={classes.top_box_head_left}>
                                        <h1>18,250</h1>
                                        <p>Archives</p>
                                    </div>
                                    <div className={classes.top_box_head_right}>
                                        <h1>20,250</h1>
                                        <p>Target</p>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.top_box_bottom}>
                                <p>last month target</p>
                                <h3 style={{ color: "#EE4A3F" }}>100%</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.bottom_box}>
                    <div className={classes.bottom_box_chart1} >
                        <p>Monthly Progress</p>
                        <div className={classes.bottom_box_chart1_sec} style={stylesGraph}>
                            <div className={classes.bottom_box_chart_rad} style={stylesGraph}><RadialChart /></div>
                            <RadarChartComponenet />
                        </div>

                    </div>
                    <div className={classes.bottom_box_chart2} style={stylesGraph2}>
                        <div className={classes.bottom_box_chart2_head}>
                            <h1>Overview</h1>
                            <div style={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "center", alignItems: "center" }}>
                                <div className={classes.editModal} onClick={handleOpen}>
                                    <img src={ICONS.ReportEdit} alt="Edit" />
                                </div>
                                <div className={classes.bottom_box_chart2_head_buttons}>
                                    <div
                                        className={`${classes.bottom_box_button} ${activeButton === 'Project Sold' ? classes.active : ''}`}
                                        style={{ borderBottomLeftRadius: "10px", borderTopLeftRadius: "10px" }}
                                        onClick={() => handleButtonClick('Project Sold')}
                                    >
                                        Project Sold
                                    </div>
                                    <div
                                        className={`${classes.bottom_box_button} ${activeButton === 'mW Sold' ? classes.active : ''}`}
                                        onClick={() => handleButtonClick('mW Sold')}
                                    >
                                        mW Sold
                                    </div>
                                    <div
                                        className={`${classes.bottom_box_button} ${activeButton === 'Install Ct' ? classes.active : ''}`}
                                        onClick={() => handleButtonClick('Install Ct')}
                                    >
                                        Install Ct
                                    </div>
                                    <div
                                        className={`${classes.bottom_box_button} ${activeButton === 'mW Installed' ? classes.active : ''}`}
                                        onClick={() => handleButtonClick('mW Installed')}
                                    >
                                        mW Installed
                                    </div>
                                    <div
                                        className={`${classes.bottom_box_button} ${activeButton === 'Batteries CT' ? classes.active : ''}`}
                                        style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}
                                        onClick={() => handleButtonClick('Batteries CT')}
                                    >
                                        Batteries CT
                                    </div>
                                </div>
                            </div>
                        </div>


                        {line ? <LineChartComp /> : <BarChartComp />}



                        <div className={classes.bottom_graphchange_div}>
                            <div className={classes.bottom_graphchange} onClick={handleChartClick}>
                                {line ? <FaChartLine size={15} style={{ marginRight: "-2px" }} color="#377CF6" /> : <MdBarChart size={15} style={{ marginRight: "-2px" }} color="#377CF6" />}
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}

export default Summary_Dashboard
