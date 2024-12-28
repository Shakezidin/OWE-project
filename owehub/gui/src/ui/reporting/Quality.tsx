import React, { useState } from 'react';
import './styles/quality.css';
import SelectOption from '../components/selectOption/SelectOption';
import TableGrey from './components/Tables/LeftGreyTable';
import LineGraph from './components/LineGraph';
import TableCustom from './components/Tables/CustomTable';
import QualityTable from './components/Tables/QualityTable';
import QualityTable2 from './components/Tables/QualityTable2';
import QualityTable3 from './components/Tables/QualityTable3';
import BarChartQuality from './components/BarChartQuality';
import YearSelect from './components/Dropdowns/YearSelect';
import WeekSelect from './components/Dropdowns/WeekSelect';
import BackButtom from './components/BackButtom';

interface Option {
  value: string;
  label: string;
}

const Quality = () => {
  const [reportType, setReportType] = useState<Option>({
    label: 'FIN',
    value: 'FIN',
  });
  const [selectedYear, setSelectedYear] = useState<Option>({
    label: '2024',
    value: '2024',
  });
  const handleYearChange = (value: Option | null) => {
    if (value) {
      setSelectedYear(value);
    }
  };
  const [selectedWeek, setSelectedWeek] = useState<Option>({
    label: 'Week 1',
    value: '1',
  });
  const handleWeekChange = (value: Option | null) => {
    if (value) {
      setSelectedWeek(value);
    }
  };
  // const stylesGraph = {
  //   width: '100%',
  //   height: '280px',
  // };
  const stylesGraph = {
    width: '1000px',
    height: '300px',
    marginTop: '10px',
  };
  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        {/* <h4 className="reports-title">Quality</h4> */}
        <BackButtom heading="Quality" />
        <div className="report-header-dropdown flex-wrap">
          <div>
            <SelectOption
              options={[
                {
                  label: 'FIN',
                  value: 'FIN',
                },
                {
                  label: 'PTO',
                  value: 'PTO',
                },
                {
                  label: 'Install Funding',
                  value: 'Install Funding',
                },
                {
                  label: 'Final Funding',
                  value: 'Final Funding',
                },
              ]}
              onChange={(value: any) => setReportType(value)}
              value={reportType}
              controlStyles={{ marginTop: 0, minHeight: 30, minWidth: 150 }}
              menuListStyles={{ fontWeight: 400 }}
              singleValueStyles={{ fontWeight: 400 }}
            />
          </div>

          <div>
            <YearSelect value={selectedYear} onChange={handleYearChange} />
          </div>
          <div>
            <WeekSelect value={selectedWeek} onChange={handleWeekChange} />
          </div>
        </div>
      </div>
      <div
        style={{
          background: '#e0e0e0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 4,
          width: '97%',
          fontSize: '1rem',
          fontWeight: '600',
          padding: '8px',
          margin: '1.2rem 1.2rem 1rem',
        }}
      >
        {reportType.label}
      </div>
      <div
        className="reports-yscroll"
        style={{ height: 'calc(-245px + 100vh)' }}
      >
        <div className="quality-top-div-wrapper">
          <div className="qualty-top-div">
            <div className="quality-1">
              <div className="qual-sec-1">
                <div className="approved-sec">
                  <h1>{reportType.label} Approved</h1>
                  <TableGrey
                    data={[
                      { column1: 'Peoria/Kingman', column2: '4400' },
                      { column1: 'Tempe', column2: '45' },
                      { column1: 'Tucson', column2: '1' },
                      { column1: 'Albuquerque/El Paso', column2: '44' },
                      { column1: 'Texas', column2: '45' },
                      { column1: 'Colorado', column2: '1' },
                    ]}
                  />
                </div>
                <div className="approved-sec">
                  <h1>{reportType.label} Pass Rate</h1>
                  <TableGrey
                    data={[
                      { column1: 'Peoria/Kingman', column2: '445' },
                      { column1: 'Tempe', column2: '45' },
                      { column1: 'Tucson', column2: '1' },
                      { column1: 'Albuquerque/El Paso', column2: '44' },
                      { column1: 'Texas', column2: '45' },
                      { column1: 'Colorado', column2: '1' },
                    ]}
                  />
                </div>
                <div className="approved-sec">
                  <h1>{reportType.label} Pending</h1>
                  <QualityTable
                    reportType=""
                    middleName=""
                    data={[
                      {
                        column1: 'Peoria/Kingman',
                        column2: '44',
                        column3: '10',
                      },
                      { column1: 'Tempe', column2: '45', column3: '10' },
                      { column1: 'Tucson', column2: '1', column3: '10' },
                      {
                        column1: 'Albuquerque/El Paso',
                        column2: '44',
                        column3: '44',
                      },
                      { column1: 'Texas', column2: '45', column3: '10' },
                      { column1: 'Colorado', column2: '1', column3: '10' },
                    ]}
                  />
                </div>
              </div>
              <div className="main-graph" style={stylesGraph}>
                <h1>{reportType.label} Approved</h1>
                <LineGraph />
                <p className="chart-info-report">Week</p>
              </div>
            </div>
            <div className="quality-2">
              <div className="qual-sec-2">
                <div className="approved-sec">
                  <h1>{reportType.label} Failed</h1>
                  <TableGrey
                    data={[
                      { column1: 'Peoria/Kingman', column2: '44' },
                      { column1: 'Tempe', column2: '45' },
                      { column1: 'Tucson', column2: '1' },
                      { column1: 'Albuquerque/El Paso', column2: '44' },
                      { column1: 'Texas', column2: '45' },
                      { column1: 'Colorado', column2: '1' },
                    ]}
                  />
                </div>
                <div className="approved-sec">
                  <h1>{reportType.label} Source of Fail</h1>
                  <QualityTable2
                    reportType=""
                    middleName=""
                    data={[
                      {
                        column1: 'Peoria/Kingman',
                        column2: '44',
                        column3: '44',
                        column4: 'Tucson',
                        column5: '44',
                        column6: '44',
                      },
                      {
                        column1: 'Tempe',
                        column2: '45',
                        column3: '44',
                        column4: 'Tucson',
                        column5: '44',
                        column6: '44',
                      },
                      {
                        column1: 'Tucson',
                        column2: '1',
                        column3: '44',
                        column4: 'Tucson',
                        column5: '44',
                        column6: '44',
                      },
                      {
                        column1: 'Albuquerque/El Paso',
                        column2: '44',
                        column3: '44',
                        column4: 'Tucson',
                        column5: '44',
                        column6: '44',
                      },
                      {
                        column1: 'Texas',
                        column2: '45',
                        column3: '44',
                        column4: 'Tucson',
                        column5: '44',
                        column6: '44',
                      },
                      {
                        column1: 'Colorado',
                        column2: '1',
                        column3: '44',
                        column4: 'Tucson',
                        column5: '44',
                        column6: '44',
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="main-graph" style={stylesGraph}>
                <h1>{reportType.label} Failed</h1>
                <LineGraph />
                <p className="chart-info-report">Week</p>
              </div>
            </div>
            {(reportType.label === 'Install Funding' ||
              reportType.label === 'Final Funding') && (
              <div className="qual-sec-2">
                <div className="approved-sec">
                  <h1>{reportType.label} - Pass Rate</h1>
                  <QualityTable3
                    reportType=""
                    middleName=""
                    data={[
                      {
                        column1: 'Week 1',
                        column2: '44',
                        column3: '44',
                        column4: 'Tucson',
                        column5: '44',
                        column6: '44',
                        column7: '90',
                      },
                      {
                        column1: 'Week 2',
                        column2: '45',
                        column3: '44',
                        column4: 'Tucson',
                        column5: '44',
                        column6: '44',
                        column7: '90',
                      },
                      {
                        column1: 'Week 3',
                        column2: '1',
                        column3: '44',
                        column4: 'Tucson',
                        column5: '44',
                        column6: '44',
                        column7: '90',
                      },
                    ]}
                  />
                </div>
                <div className="main-graph" style={stylesGraph}>
                  <h1>{reportType.label} - Pass Rate</h1>
                  <BarChartQuality />
                  <p className="chart-info-report">Week</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quality;
