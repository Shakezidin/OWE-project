import React, { useState } from 'react'
import BackButtom from '../components/BackButtom'
import SelectOption from '../../components/selectOption/SelectOption'
import MicroLoader from '../../components/loader/MicroLoader';
import LineGraph from '../components/LineGraph';
import './ahj.css'
import AhjBarChart from './BarChart';
import BelowUpChartAhj from './LineChart';
import CustomMultiSelect from './CustomMultiSelect';

interface Option {
    value: string;
    label: string;
}
const Ahj = () => {
    const [reportType, setReportType] = useState<Option>({
        label: 'Install',
        value: 'install',
    });
    const stylesGraph = {
        width: '100%',
        height: '463px',
        marginTop: '10px'
    };

    const officeSelect =
        [
            {
                label: `AZPEO01`,
                value: `AZPEO01`,
            },
            {
                label: `AZTUC01`,
                value: `AZTUC01`,
            },
            {
                label: 'CODEN1',
                value: 'CODEN1'
            },
            {
                label: `COGJT1`,
                value: `COGJT1`,
            },
            {
                label: 'NMABQ01',
                value: 'NMABQ01'
            },
            {
                label: `TXDAL01`,
                value: `TXDAL01`,
            },
            {
                label: 'TXELP01',
                value: 'TXELP01'
            }
        ]

    const stateSet = [
        {
            label: `AZ`,
            value: `AZ`,
        },
        {
            label: `CO`,
            value: `CO`,
        },
        {
            label: `NM`,
            value: `NM`,
        },
        {
            label: `TX`,
            value: `TX`,
        },
    ]
    const QuarterSet = [
        {
            label: `Q1 2024`,
            value: `Q1 2024`,
        },
        {
            label: `Q2 2024`,
            value: `Q2 2024`,
        },
        {
            label: `Q3 2024`,
            value: `Q3 2024`,
        },
        {
            label: `Q4 2024`,
            value: `Q4 2024`,
        },
    ]

    return (
        <div className="total-main-container">
            <div className="headingcount flex justify-between items-center">
                <BackButtom heading="AHJ +15 Days SLA" />
                <div className="report-header-dropdown flex-wrap">
                    {/* <div><DaySelect /></div> */}
                    <div>
                        <CustomMultiSelect data={officeSelect} placeholder="Office"/>
                    </div>

                    <div>
                        <CustomMultiSelect data={stateSet} placeholder="State"/>
                    </div>

                    <div>
                        <CustomMultiSelect data={QuarterSet} placeholder="Quarter"/>
                    </div>

                    <div>
                        <CustomMultiSelect data={QuarterSet} placeholder="AHJ"/>
                    </div>

                </div>
            </div>

            <div className='ahj-box'>
                <div className='ahj-box-first'>
                    <div className='ahj-box-first-green'>
                        <p>Within SLA % (Q2)</p>
                        <h4>44.6%</h4>
                    </div>
                    <div className='ahj-box-first-green'>
                        <p>Within SLA Count (Q2)</p>
                        <h4>446</h4>
                    </div>
                    <div className='ahj-box-first-red'>
                        <p>Out of SLA % (Q2)</p>
                        <h4>44.6%</h4>
                    </div>
                    <div className='ahj-box-first-red'>
                        <p>Out of SLA Count (Q2)</p>
                        <h4>832</h4>
                    </div>
                </div>
                <div className='ahj-box-first'>
                    <div className='ahj-box-first-green'>
                        <p>Within SLA % (Q3)</p>
                        <h4>44.6%</h4>
                    </div>
                    <div className='ahj-box-first-green'>
                        <p>Within SLA Count (Q3)</p>
                        <h4>899</h4>
                    </div>
                    <div className='ahj-box-first-red'>
                        <p>Out of SLA % (Q3)</p>
                        <h4>44.6%</h4>
                    </div>
                    <div className='ahj-box-first-red'>
                        <p>Out of SLA Count (Q3)</p>
                        <h4>838</h4>
                    </div>
                </div>
            </div>


            <div className="report-graphs" style={{ paddingInline: "50px" }}>
                <h3 className='rep-graph-heading'>Percentage</h3>
                <div
                    className="report-graph"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 50,
                        boxShadow: '2px 4px 8px -1px rgba(0, 0, 0, 0.1)',
                        border: "1px solid rgba(0, 0, 0, 0.1)"
                    }}
                >

                    <div className="main-graph" style={stylesGraph}>
                        <AhjBarChart />
                        <p className="chart-info-report">Week</p>
                    </div>
                </div>

            </div>

            <div className="report-graphs" style={{ paddingInline: "50px" }}>
                <h3 className='rep-graph-heading'>Total</h3>
                <div
                    className="report-graph"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 50,
                        boxShadow: '2px 4px 8px -1px rgba(0, 0, 0, 0.1)',
                        border: "1px solid rgba(0, 0, 0, 0.1)"
                    }}
                >

                    <div className="main-graph" style={stylesGraph}>
                        <BelowUpChartAhj />
                        <p className="chart-info-report">Week Install</p>
                    </div>
                </div>

            </div>


        </div>
    )
}

export default Ahj
