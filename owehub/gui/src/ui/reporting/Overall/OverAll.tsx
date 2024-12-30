import React, { useEffect, useState } from 'react'
import YearSelect from '../components/Dropdowns/YearSelect'
import WeekSelect from '../components/Dropdowns/WeekSelect'
import DaySelect from '../components/Dropdowns/DaySelect'
import SelectOption from '../../components/selectOption/SelectOption'
import CompanySelect from '../components/Dropdowns/CompanySelect'
import MicroLoader from '../../components/loader/MicroLoader'
import TableCustom from '../components/Tables/CustomTable'
import LineGraph from '../components/LineGraph'
import BelowUpChart from './BelowUpChart'
import OverAllBarGraph from './OverAllBarGraph'

interface DataPoint {
    name: string;
    pv: number;
}

interface GraphProps {
    title: string;
    stopColor: string;
    borderColor: string;
    data: DataPoint[];
}
interface Option {
    value: string;
    label: string;
}


const OverAll = () => {
    const [graphs, setGraphs] = useState<GraphProps[]>([
        { title: 'Sale to', stopColor: '#0096D3', borderColor: '#0096D3', data: [] },
    ]);

    const [reportType, setReportType] = useState<Option>(
        {
            label: 'Install Complete',
            value: 'Install Complete',
        }
    );


    const [data, setData] = useState([
        { column1: 'Tucson', column2: '0' },
        { column1: 'Texas', column2: '0' },
        { column1: 'Tempe', column2: '0' },
        { column1: 'Peoria/Kingman', column2: '0' },
        { column1: 'Colarado', column2: '0' },
        { column1: 'Albuquerque/El Paso', column2: '0' },
        { column1: '#N/A', column2: '0' },
      ]);

    const stylesGraph = {
        width: '100%',
        height: '325px',
    };

    return (
        <div className="total-main-container">
            <div className="headingcount flex justify-between items-center">
                <h4 className="reports-title">Overall</h4>
                <div className="report-header-dropdown flex-wrap">
                    <div><YearSelect /></div>
                    <div><WeekSelect /></div>
                    <div>
                        <SelectOption
                            options={[
                                {
                                    label: 'Install Complete',
                                    value: 'Install Complete',
                                },
                                {
                                    label: 'Battery',
                                    value: 'battery',
                                },
                                {
                                    label: 'MPU',
                                    value: 'mpu',
                                },
                            ]}
                            onChange={(value: any) => setReportType(value)}
                            value={reportType}
                            controlStyles={{ marginTop: 0, minHeight: 30, minWidth: 150 }}
                            menuListStyles={{ fontWeight: 400 }}
                            singleValueStyles={{ fontWeight: 400 }}
                        />
                    </div>
                    <div><CompanySelect /></div>
                </div>
            </div>
            <div
                style={{
                    background: '#ddd',
                    height: 50,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    width: '100%',
                    margin: '10px 0'
                }}
            >
                {reportType.label}
            </div>

            <div className="report-graphs">
                {graphs.map((graph, index) => (

                    <div
                        key={index}
                        className="report-graph"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 50,
                        }}
                    >

                        {false ? (
                            <div
                                className="flex items-center"
                                style={{ justifyContent: 'center' }}
                            >
                                {' '}
                                <MicroLoader />{' '}
                            </div>
                        ) : (
                            <>
                                <TableCustom
                                    reportType={reportType}
                                    th2="Sale to Install Complete"
                                    data={data}
                                    setData={setData}
                                />
                                <div className="main-graph" style={stylesGraph}>
                                    <h3 style={{ textAlign: 'center' }}>{graph.title} {reportType.label}</h3>
                                    <LineGraph />
                                    <p className='chart-info-report'>Week</p>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>


            <div className="report-graphs">
               

                    <div
                        className="report-graph"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 50,
                        }}
                    >

                        {false ? (
                            <div
                                className="flex items-center"
                                style={{ justifyContent: 'center' }}
                            >
                                {' '}
                                <MicroLoader />{' '}
                            </div>
                        ) : (
                            <>
                                <TableCustom
                                    reportType={reportType}
                                    th2="Sale to Install Complete"
                                    data={data}
                                    setData={setData}
                                />
                                <div className="main-graph" style={stylesGraph}>
                                    <h3 style={{ textAlign: 'center' }}>Install Scheduled to AR Approved</h3>
                                    <BelowUpChart />
                                    
                                    <p className='chart-info-report'>Week</p>
                                </div>
                            </>
                        )}
                    </div>
              
            </div>

            <div className="report-graphs">
               

               <div
                   className="report-graph"
                   style={{
                       display: 'flex',
                       justifyContent: 'center',
                       alignItems: 'center',
                       marginBottom: 50,
                   }}
               >

                   {false ? (
                       <div
                           className="flex items-center"
                           style={{ justifyContent: 'center' }}
                       >
                           {' '}
                           <MicroLoader />{' '}
                       </div>
                   ) : (
                       <>
                           <div className="main-graph" style={stylesGraph}>
                               <h3 style={{ textAlign: 'center' }}>Install Scheduled to AR Approved- Colorado</h3>
                               <OverAllBarGraph />
                               {/* <p className='chart-info-report'>Week</p> */}
                           </div>
                       </>
                   )}
               </div>
         
       </div>

        </div>
    )
}

export default OverAll
