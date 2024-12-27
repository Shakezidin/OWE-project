import React, { useEffect, useState } from 'react';
import BackButtom from '../components/BackButtom';
import SelectOption from '../../components/selectOption/SelectOption';
import MicroLoader from '../../components/loader/MicroLoader';
import LineGraph from '../components/LineGraph';
import './ahj.css';
import AhjBarChart from './BarChart';
import BelowUpChartAhj from './LineChart';
import CustomMultiSelect from './CustomMultiSelect';
import { reportingCaller } from '../../../infrastructure/web_api/services/apiUrl';
import YearSelect from '../components/Dropdowns/YearSelect';
import DataNotFound from '../../components/loader/DataNotFound';

interface Option {
  value: string;
  label: string;
}
interface ApiData {
  value: {
    "Out of SLA"?: number;
    "Within SLA"?: number;
  };
}



const Ahj = () => {
  const [reportType, setReportType] = useState<Option>({
    label: 'Install',
    value: 'install',
  });
  const stylesGraph = {
    width: '100%',
    height: '463px',
    padding: "1rem"
  };

  const [officeSelect, setOfficeSelect] = useState([]);

  const [stateSet, setStateSet] = useState([]);
  const [ahj, setAhj] = useState([]);
  const QuarterSet = [
    {
      label: `Quarter 1`,
      value: `qtr1`,
    },
    {
      label: `Quarter 2`,
      value: `qtr2`,
    },
    {
      label: `Quarter 3`,
      value: `qtr3`,
    },
    {
      label: `Quarter 4`,
      value: `qtr4`,
    },
  ];

  //API Integration - Saurabh

  const [apiResponse, setApiResponse] = useState<ApiData[]>([]);
  const [totalResponse, setTotalResponse] = useState<ApiData[]>([]);
  const [selectedOffices, setSelectedOffices] = useState<string[]>(['TXDAL01", "AZTUC01", "NMABQ01", "TXDAL01']);
  const [selectedAhj, setSelectedAhj] = useState<string[]>(["City of Midlothian (TX)", "Sierra Vista, City of (AZ)", "City of Carrizozo (NM)", "Rosenberg, City of (TX)"]);
  const [selectedState, setSelectedState] = useState<string[]>(["TX :: Texas", "AZ :: Arizona", "NM :: New Mexico", "TX :: Texas"]);
  const [selectedQuarter,setSelectedQuarter   ] = useState<string[]>(["qtr1", "qtr2", "qtr3", "qtr4"]);

  const [selectedYear, setSelectedYear] = useState<Option>({
    label: '2024',
    value: '2024',
  });
  const handleYearChange = (value: Option | null) => {
    if (value) {
      setSelectedYear(value);
    }
  };

  const [loading, setLoading] = useState(false);
  const [selectloading, setSelectLoading] = useState(false);


  console.log(totalResponse, "Percentage data")

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await reportingCaller('get_timeline_ahj_fifteen', {
          "year": selectedYear.value,
          "state": selectedState,
          "office": selectedOffices,
          "ahj": selectedAhj,
          "quarter": selectedQuarter
        });


        if (response.status === 200) {
          setApiResponse(response.data.data['Percentage AHJ +15 Days SLA']);
          setTotalResponse(response.data.data['Total AHJ +15 Days SLA'])
          setLoading(false);
        } else {
          console.error('Error fetching data:', response.data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error making API request:', error);
        setLoading(false);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedOffices, selectedAhj, selectedState, selectedYear, selectedQuarter]);

  useEffect(() => {
    setSelectLoading(true);
    const fetchData = async () => {
      try {
        const response = await reportingCaller('get_offices_list', {});


        if (response.status === 200) {

          const officeData = response.data.offices.map((office: any) => ({
            label: office,
            value: office,
          }));
          setOfficeSelect(officeData);
          const stateData = response.data.states.map((state: any) => ({
            label: state,
            value: state,
          }));
          setStateSet(stateData)
          const ahjData = response.data.ahj.map((ahj: any) => ({
            label: ahj,
            value: ahj,
          }));
          setAhj(ahjData)
        } else {
          console.error('Error fetching data:', response.data.message);
          setSelectLoading(false);
        }
      } catch (error) {
        console.error('Error making API request:', error);
        setSelectLoading(false);
      }
      setSelectLoading(false);
    };
    fetchData();
  }, []);



  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <BackButtom heading="AHJ +15 Days SLA" />
        <div className="report-header-dropdown flex-wrap">
          {/* <div><DaySelect /></div> */}
          <div>
            <CustomMultiSelect data={officeSelect} placeholder="Office" onOfficeChange={(values: any) => setSelectedOffices(values)} disable={selectloading}/>
          </div>

          <div>
            <CustomMultiSelect data={stateSet} placeholder="State" onOfficeChange={(values: any) => setSelectedState(values)} disable={selectloading}/>
          </div>

          <div><YearSelect value={selectedYear} onChange={handleYearChange} /></div>

          <div>
            <CustomMultiSelect data={QuarterSet} placeholder="Quarter" onOfficeChange={(values: any) => setSelectedQuarter(values)}/>
          </div>

          <div>
            <CustomMultiSelect data={ahj} placeholder="AHJ" onOfficeChange={(values: any) => setSelectedAhj(values)} disable={selectloading}/>
          </div>
        </div>
      </div>

      <div className="reports-yscroll">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <MicroLoader />
          </div>
        ) : totalResponse ? (
          <>
            <div className="ahj-box">
              <div className="ahj-box-first">
                <div className="ahj-box-first-green">
                  <p>Within SLA % (Q2)</p>
                  <h4>44.6%</h4>
                </div>
                <div className="ahj-box-first-green">
                  <p>Within SLA Count (Q2)</p>
                  <h4>446</h4>
                </div>
                <div className="ahj-box-first-red">
                  <p>Out of SLA % (Q2)</p>
                  <h4>44.6%</h4>
                </div>
                <div className="ahj-box-first-red">
                  <p>Out of SLA Count (Q2)</p>
                  <h4>832</h4>
                </div>
              </div>
              <div className="ahj-box-first">
                <div className="ahj-box-first-green">
                  <p>Within SLA % (Q3)</p>
                  <h4>44.6%</h4>
                </div>
                <div className="ahj-box-first-green">
                  <p>Within SLA Count (Q3)</p>
                  <h4>899</h4>
                </div>
                <div className="ahj-box-first-red">
                  <p>Out of SLA % (Q3)</p>
                  <h4>44.6%</h4>
                </div>
                <div className="ahj-box-first-red">
                  <p>Out of SLA Count (Q3)</p>
                  <h4>838</h4>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="report-graphs" >
                <p className="rep-graph-heading">Percentage</p>
                <div
                  className="report-graph"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '2px 4px 8px -1px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className="main-graph" style={stylesGraph}>
                    <AhjBarChart data={apiResponse} />
                    <p className="chart-info-report">Week</p>
                  </div>
                </div>
              </div>

              <div className="report-graphs">
                <p className="rep-graph-heading">Total</p>
                <div
                  className="report-graph"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '2px 4px 8px -1px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className="main-graph" style={stylesGraph}>
                    <BelowUpChartAhj data={totalResponse} />
                    <p className="chart-info-report">Week Install</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DataNotFound />
          </div>
        )}
      </div>
    </div>
  );
};

export default Ahj;
