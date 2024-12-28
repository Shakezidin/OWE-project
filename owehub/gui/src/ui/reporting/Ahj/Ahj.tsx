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
import { toast } from 'react-toastify';
import DropdownCheckBox from '../../components/DropdownCheckBox';

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

interface SLAData {
  "Out of SLA Count": number;
  "Out of SLA Percentage": number;
  "Within SLA Count": number;
  "Within SLA Percentage": number;
}

interface ApiResponse {
  [key: string]: SLAData;
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
      value: `1`,
    },
    {
      label: `Quarter 2`,
      value: `2`,
    },
    {
      label: `Quarter 3`,
      value: `3`,
    },
    {
      label: `Quarter 4`,
      value: `4`,
    },
  ];

  //API Integration - Saurabh

  const [apiResponse, setApiResponse] = useState<ApiData[]>([]);
  const [totalResponse, setTotalResponse] = useState<ApiData[]>([]);
  const [selectedOffices, setSelectedOffices] = useState<Option[]>([]);
  const [selectedAhj, setSelectedAhj] = useState<Option[]>([]);
  const [selectedState, setSelectedState] = useState<Option[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState<Option[]>([]);

  const [summaryResponse, setSummaryResponse] = useState<ApiResponse | null>(null);


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

  const [isFetch, setIsFetch] = useState(false);



  useEffect(() => {
    setSelectedQuarter(QuarterSet)
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
          setSelectedOffices(officeData);
          const stateData = response.data.states.map((state: any) => ({
            label: state,
            value: state,
          }));
          setSelectedState(stateData)
          setStateSet(stateData)
          const ahjData = response.data.ahj.map((ahj: any) => ({
            label: ahj,
            value: ahj,
          }));
          setSelectedAhj(ahjData)
          setAhj(ahjData)
          setIsFetch(true)
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

  useEffect(() => {
    if (isFetch) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await reportingCaller('get_timeline_ahj_fifteen', {
            "year": selectedYear.value,
            "state": selectedState.map((item) => item.value),
            "office": selectedOffices.map((item) => item.value),
            "ahj": selectedAhj.map((item) => item.value),
            "quarter": selectedQuarter.map((item) => Number(item.value))
          });


          if (response.status === 200) {
            setApiResponse(response.data.data['Percentage AHJ +15 Days SLA']);
            setTotalResponse(response.data.data['Total AHJ +15 Days SLA'])
            setSummaryResponse(response.data.summary)

            setLoading(false);
          } else {
            console.error('Error fetching data:', response.message);
            toast.error(response.message)
            setLoading(false);
          }
        } catch (error) {
          console.error('Error making API request:', error);
          setLoading(false);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [selectedOffices, selectedAhj, selectedState, selectedYear, selectedQuarter]);


  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <BackButtom heading="AHJ +15 Days SLA" />
        <div className="report-header-dropdown flex-wrap">
          {/* <div><DaySelect /></div> */}
          <div>
            <DropdownCheckBox
              label={"Offices"}
              placeholder={'Search Offices'}
              selectedOptions={selectedOffices}
              options={officeSelect}
              onChange={(val) => {
                setSelectedOffices(val);
              }}
              disabled={selectloading|| loading}
            />
          </div>

          <div>
            <DropdownCheckBox
              label={"State"}
              placeholder={'Search States'}
              selectedOptions={selectedState}
              options={stateSet}
              onChange={(val) => {
                setSelectedState(val);
              }}
              disabled={selectloading|| loading}
            />
          </div>

          <div><YearSelect value={selectedYear} onChange={handleYearChange} disabled={selectloading || loading}/></div>

          <div>
            <DropdownCheckBox
              label={"Quarter"}
              placeholder={'Search Quarter'}
              selectedOptions={selectedQuarter}
              options={QuarterSet}
              onChange={(val) => {
                setSelectedQuarter(val);
              }}
              disabled={selectloading || loading}
            />
          </div>

          <div>
            <DropdownCheckBox
              label={`${ahj.length} AHJ's`}
              placeholder={'Search AHJ'}
              selectedOptions={selectedAhj}
              options={ahj}
              onChange={(val) => {
                setSelectedAhj(val);
              }}
              disabled={selectloading || loading}
            />
          </div>
        </div>
      </div>

      <div className="reports-yscroll">
        {(loading || !isFetch) ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <MicroLoader />
          </div>
        ) : totalResponse ? (
          <>
            {/* <div className="ahj-box">
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
            </div> */}

            <div className="ahj-box">
              {summaryResponse && Object.entries(summaryResponse).map(([key, value]) => (
                <div key={key} className="ahj-box-first">
                  <div className="ahj-box-first-green">
                    <p>Within SLA % ({key.toUpperCase()})</p>
                    <h4>{(value['Within SLA Percentage']).toFixed(2)}%</h4>
                  </div>
                  <div className="ahj-box-first-green">
                    <p>Within SLA Count ({key.toUpperCase()})</p>
                    <h4>{(value['Within SLA Count']).toFixed(2)}</h4>
                  </div>
                  <div className="ahj-box-first-red">
                    <p>Out of SLA % ({key.toUpperCase()})</p>
                    <h4>{(value['Out of SLA Percentage']).toFixed(2)}%</h4>
                  </div>
                  <div className="ahj-box-first-red">
                    <p>Out of SLA Count ({key.toUpperCase()})</p>
                    <h4>{(value['Out of SLA Count']).toFixed(2)}</h4>
                  </div>
                </div>
              ))}
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
