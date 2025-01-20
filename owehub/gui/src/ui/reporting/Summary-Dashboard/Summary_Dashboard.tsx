import React, { useEffect, useState } from 'react'
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
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchSummaryData } from '../../../redux/apiActions/reportingAction/reportingAction';
import MicroLoader from '../../components/loader/MicroLoader';
import DataNotFound from '../../components/loader/DataNotFound';
import { Tooltip } from 'react-tooltip';
import useWindowWidth from '../../../hooks/useWindowWidth';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../infrastructure/web_api/api_client/EndPoints';
import useAuth from '../../../hooks/useAuth';
interface Option {
    value: string;
    label: string;
}
interface DynamicSummaryData {
    [key: string]: {
        target: number;
        achieved: number;
        last_month_acheived: number;
    };
}

interface ProgressData {
    [key: string]: {
        target: number;
        achieved: number;
        percentage_achieved: number;
    };
}

interface MonthlyOverviewItem {
    month: string;
    target: number;
    achieved: number;
}
interface MonthlyStatsItem {
    month: string;
    target: number;
    [key: string]: number | string;
}

const Summary_Dashboard = () => {
    const { authData, getUpdatedAuthData } = useAuth();
    const role = authData?.role;

    const tableData = {
        tableNames: [
            'states',
        ],
    };

    const [newFormData, setNewFormData] = useState<any>([]);

    const [states, setStates] = useState<Option[]>([]);

    const isShowDropdown = (role === 'Admin')
    useEffect(() => {
        if (
            role === 'Admin' ||
            isShowDropdown
        ) {
            getNewFormData();
        }
    }, [role]);
    const getNewFormData = async () => {
        const res = await postCaller(EndPoints.get_newFormData, tableData);
        if (res.status > 200) {
            return;
        }
        setNewFormData(res.data);



        const statesData: Option[] = (res.data.states as string[]).map((state) => ({
            label: state,
            value: state
        }));
        setStates(statesData);
    };

    const [selectedState, setSelectedState] = useState<Option>(
        { label: 'All States', value: 'All' }
    );

    const [selectedAM, setSelectedAm] = useState<Option>(
        { label: "All AM's", value: 'All' }
    );

    console.log(selectedState, "selectedState")






    const [reportType, setReportType] = useState<Option>(
        {
            label: 'January',
            value: 'January',
        }
    );
    const [year, setYear] = useState<Option>(
        {
            label: '2025',
            value: '2025',
        }
    );
    const years = [
        {
            label: '2025',
            value: '2025',
        },
        {
            label: '2026',
            value: '2026',
        },
        {
            label: '2027',
            value: '2027',
        },
        {
            label: '2028',
            value: '2028',
        },
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
        borderRight: "1px dotted #D7D9DC",

    };
    const stylesGraph2 = {
        width: '100%',
        height: '500px',
        padding: "1rem",
        "@media screen and (max-width: 767px)": {
            height: 'auto',
            borderRight: 'none',
            borderBottom: "1px dotted #D7D9DC",
            paddingBottom: "2rem",
            marginBottom: "2rem"
        }
    };

    const data = [
        {
            label: 'Projects Sold',
            value: 'projects_sold',
        },
        {
            label: 'MW Sold',
            value: 'mw_sold',
        },
        {
            label: 'Install Count',
            value: 'install_ct',
        },
        {
            label: 'MW Installed',
            value: 'mw_installed',
        },
        {
            label: 'Batteries Count',
            value: 'batteries_ct',
        },
    ];
    const [datas, setDatas] = useState<Option>(
        {
            label: 'Projects Sold',
            value: 'projects_sold',
        }
    );

    const [activeButton, setActiveButton] = useState('projects_sold');

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

    //Api Integration
    const dispatch = useAppDispatch();

    const [refre, setRefre] = useState(0);

    useEffect(() => {
        dispatch(fetchSummaryData({
            "target_percentage": parseInt(activePerc),
            "target_type": activeButton,
            "month": reportType.value,
            "year": year.value
        }));
    }, [reportType, year, activePerc, refre, activeButton]);

    const { summaryData, loading } = useAppSelector(
        (state) => state.reportingSlice
    );
    const [summaryDataState, setSummaryDataState] = useState<DynamicSummaryData>({});
    const [progressData, setProgressData] = useState<ProgressData>({});
    const [monthlyOverviewData, setMonthlyOverviewData] = useState<MonthlyOverviewItem[]>([]);
    const [monthlyStatsData, setMonthlyStatsData] = useState<MonthlyStatsItem[]>([]);

    useEffect(() => {
        setSummaryDataState(summaryData?.data?.data?.summary)
        setProgressData(summaryData?.data?.data?.progress)
        setMonthlyOverviewData(summaryData?.data?.data?.monthly_overview)
        setMonthlyStatsData(summaryData?.data?.data?.monthly_stats)
    }, [summaryData])

    const width = useWindowWidth();
    const isMobile = width <= 767;
    const desiredOrder = ["Projects Sold", "mW Sold", "Install Ct", "mW Installed", "Batteries Ct"];



    return (
        <>
            <EditModal selectedState={selectedState} selectedAM={selectedAM} activePerc={activePerc} refre={refre} setRefre={setRefre} year={parseInt(year.value)} open={open} handleClose={handleClose} />
            <div className={classes.top_dashboard}>
                <div className={classes.top_box}>
                    <div className={classes.top_box_heading}>
                        <p>Summary</p>
                        <div className={classes.top_box_drop}>

                            <div className={classes.ed_perc}>
                                <div className={classes.bottom_box_chart2_head_buttons_sec}>
                                    <div
                                        className={`${classes.bottom_box_button_sec} ${activePerc === '100' ? classes.active : ''}`}
                                        // style={{ borderBottomLeftRadius: "10px", borderTopLeftRadius: "10px" }}
                                        onClick={() => handlePercButtonClick('100')}
                                    >
                                        100
                                    </div>
                                    <div
                                        className={`${classes.bottom_box_button_sec} ${activePerc === '75' ? classes.active : ''}`}
                                        // style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}
                                        onClick={() => handlePercButtonClick('75')}
                                    >
                                        75
                                    </div>
                                </div>

                                <div className={classes.editModal} onClick={handleOpen} data-tooltip-id={isMobile ? "N/A" : "downip"}>
                                    <img src={ICONS.ReportEdit} alt="Edit" />
                                    <Tooltip
                                        style={{
                                            zIndex: 20,
                                            background: '#f7f7f7',
                                            color: '#000',
                                            fontSize: 12,
                                            paddingBlock: 4,
                                            fontWeight: "400"
                                        }}
                                        offset={8}
                                        delayShow={800}
                                        id="downip"
                                        place="bottom"
                                        content={"Edit Target"}

                                    />
                                </div>
                                {isShowDropdown &&
                                    <SelectOption
                                        options={states}
                                        onChange={(value: any) => { setSelectedState(value); setSelectedState({ label: 'All States', value: 'All' }) }}
                                        value={selectedAM}
                                        controlStyles={{ marginTop: 0, minHeight: 30, minWidth: isMobile ? 67 : 150 }}
                                        menuWidth={isMobile ? "120px" : "150px"}
                                        menuListStyles={{ fontWeight: 400 }}
                                        singleValueStyles={{ fontWeight: 400 }}
                                    />
                                }
                            </div>

                            <div className={classes.sel_opt}>
                                {isShowDropdown &&
                                    <SelectOption
                                        options={states}
                                        onChange={(value: any) => { setSelectedState(value); setSelectedAm({ label: "All AM's", value: 'All' }) }}
                                        value={selectedState}
                                        controlStyles={{ marginTop: 0, minHeight: 30, minWidth: isMobile ? 67 : 150 }}
                                        menuWidth={isMobile ? "120px" : "150px"}
                                        menuListStyles={{ fontWeight: 400 }}
                                        singleValueStyles={{ fontWeight: 400 }}
                                    />
                                }
                                <SelectOption
                                    options={options}
                                    onChange={(value: any) => setReportType(value)}
                                    value={reportType}
                                    controlStyles={{ marginTop: 0, minHeight: 30, minWidth: isMobile ? 67 : 150 }}
                                    menuWidth={isMobile ? "120px" : "150px"}
                                    menuListStyles={{ fontWeight: 400 }}
                                    singleValueStyles={{ fontWeight: 400 }}
                                />
                                <SelectOption
                                    options={years}
                                    onChange={(value: any) => { setYear(value) }}
                                    value={year}
                                    controlStyles={{ marginTop: 0, minHeight: 30, minWidth: isMobile ? 67 : 150 }}
                                    menuWidth={isMobile ? "80px" : "150px"}
                                    menuListStyles={{ fontWeight: 400 }}
                                    singleValueStyles={{ fontWeight: 400 }}
                                />
                            </div>



                        </div>
                    </div>
                    <div className={classes.top_box_boxes}>

                        {(summaryData.loading) ? (
                            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: "18px" }}>
                                <MicroLoader />
                            </div>
                        ) : progressData ? (
                            <>
                                <div className={classes.top_box_boxes}>

                                    {summaryDataState && Object.entries(summaryDataState)
                                        .filter(([key]) => desiredOrder.includes(key))
                                        .sort(([a], [b]) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b))
                                        .map(([key, data]) => (
                                            <div className={classes.top_box_box} key={key}>
                                                <div className={classes.top_box_top}>
                                                    <div className={classes.top_box_head}>
                                                        <p>{key}</p>
                                                    </div>
                                                    {data && (
                                                        <>
                                                            <div className={classes.top_box_divs}>
                                                                <div className={classes.top_box_head_left}>
                                                                    <h1>
                                                                        {Number.isInteger(data.achieved)
                                                                            ? data.achieved
                                                                            : data.achieved.toFixed(2)}
                                                                    </h1>
                                                                    <p>Achieved</p>
                                                                </div>
                                                                <div className={classes.top_box_head_right}>
                                                                    <h1>
                                                                        {Number.isInteger(data.target)
                                                                            ? data.target
                                                                            : data.target.toFixed(2)}
                                                                    </h1>
                                                                    <p>Target</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                {data && (
                                                    <div className={classes.top_box_bottom}>
                                                        <p>Last Month Achieved</p>
                                                        <h3 style={{ color: "#ABDB42" }}>
                                                            {Number.isInteger(data.last_month_acheived)
                                                                ? data.last_month_acheived
                                                                : data.last_month_acheived.toFixed(2)}%
                                                        </h3>
                                                    </div>
                                                )}
                                            </div>
                                        ))}


                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <DataNotFound />
                            </div>
                        )}
                    </div>
                </div>
                <div className={classes.bottom_box}>
                    <div className={classes.bottom_box_chart1} >
                        <p>Monthly Progress</p>
                        {(summaryData.loading) ? (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "60px", paddingTop: "18px" }}>
                                <MicroLoader />
                            </div>
                        ) : progressData ? (
                            <>
                                <div className={classes.bottom_box_chart1_sec}>
                                    <div className={classes.bottom_box_chart_rad}><RadialChart year={reportType} radData={progressData} /></div>
                                    <div className={classes.bottom_box_chart_rad1}><RadarChartComponenet radData={progressData} /></div>
                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <DataNotFound />
                            </div>
                        )}

                    </div>
                    <div className={classes.bottom_box_chart2} style={stylesGraph2}>
                        <div className={classes.bottom_box_chart2_head}>
                            <h1>Overview</h1>
                            <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", justifyContent: "center", alignItems: "center" }}>
                                <div className={classes.bottom_graphchange} onClick={handleChartClick} data-tooltip-id={isMobile ? "N/A" : "down"}>
                                    {!line ? <FaChartLine size={15} style={{ marginRight: "-2px" }} color="#377CF6" /> : <MdBarChart size={15} style={{ marginRight: "-2px" }} color="#377CF6" />}
                                </div>
                                <Tooltip
                                    style={{
                                        zIndex: 20,
                                        background: '#f7f7f7',
                                        color: '#000',
                                        fontSize: 12,
                                        paddingBlock: 4,
                                        fontWeight: "400"
                                    }}
                                    offset={8}
                                    delayShow={800}
                                    id="down"
                                    place="bottom"
                                    content={"Change View"}

                                />
                                {!isMobile ?
                                    <div className={classes.bottom_box_chart2_head_buttons}>
                                        <div
                                            className={`${classes.bottom_box_button} ${activeButton === 'projects_sold' ? classes.active : ''}`}
                                            style={{ borderBottomLeftRadius: "10px", borderTopLeftRadius: "10px" }}
                                            onClick={() => handleButtonClick('projects_sold')}
                                        >
                                            Project Sold
                                        </div>
                                        <div
                                            className={`${classes.bottom_box_button} ${activeButton === 'mw_sold' ? classes.active : ''}`}
                                            onClick={() => handleButtonClick('mw_sold')}
                                        >
                                            mW Sold
                                        </div>
                                        <div
                                            className={`${classes.bottom_box_button} ${activeButton === 'install_ct' ? classes.active : ''}`}
                                            onClick={() => handleButtonClick('install_ct')}
                                        >
                                            Install Ct
                                        </div>
                                        <div
                                            className={`${classes.bottom_box_button} ${activeButton === 'mw_installed' ? classes.active : ''}`}
                                            onClick={() => handleButtonClick('mw_installed')}
                                        >
                                            mW Installed
                                        </div>
                                        <div
                                            className={`${classes.bottom_box_button} ${activeButton === 'batteries_ct' ? classes.active : ''}`}
                                            style={{ borderBottomRightRadius: "10px", borderTopRightRadius: "10px" }}
                                            onClick={() => handleButtonClick('batteries_ct')}
                                        >
                                            Batteries CT
                                        </div>
                                    </div>
                                    :
                                    <SelectOption
                                        options={data}
                                        onChange={(value: any) => { setDatas(value); handleButtonClick(value?.value) }}
                                        value={datas}
                                        controlStyles={{ marginTop: 0, minHeight: 30, minWidth: isMobile ? 67 : 150 }}
                                        menuWidth={isMobile ? "130px" : "150px"}
                                        menuListStyles={{ fontWeight: 400 }}
                                        singleValueStyles={{ fontWeight: 400 }}
                                    />
                                }
                            </div>
                        </div>

                        {(summaryData.loading) ? (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "38px" }}>
                                <MicroLoader />
                            </div>
                        ) : progressData ? (
                            <>
                                {line ? <LineChartComp monthData={monthlyOverviewData} /> : <BarChartComp monthlyStatsData={monthlyStatsData} />}




                                <div className={classes.bottom_graphchange_div}>

                                </div>
                            </>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <DataNotFound />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Summary_Dashboard
