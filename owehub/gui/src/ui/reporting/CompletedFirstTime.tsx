import React, { useState } from 'react';
// import '../reporting/styles/quality.css';
import styles from './styles/CompletedFirstTime.module.css';
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
import CompletedFirstTimeGraph from './components/CompletedFirstTimeGraph';

interface Option {
  value: string;
  label: string;
}

const CompletedFirstTime = () => {
  const [reportType, setReportType] = useState<Option>({
    label: 'FIN',
    value: 'FIN',
  });
  // const stylesGraph = {
  //   width: '100%',
  //   height: '280px',
  // };
  const stylesGraph = {
    width: '1000px',
    height: '300px',
    marginTop: '10px',
  };

  const data = [
    { week: 1, sales: 200, revenue: 150 },
    { week: 2, sales: 250, revenue: 175 },
    { week: 3, sales: 300, revenue: 200 },
    { week: 4, sales: 350, revenue: 225 },
    { week: 5, sales: 400, revenue: 250 },
  ];

  // Define a formatter for labels (optional)
  const labelFormatter = (value: any) => `${value} units`;

  // Define a formatter for x-axis labels (optional)
  const xAxisFormatter = (value: any) => `Week ${value}`;

  // Define a formatter for tooltips (optional)
  const tooltipFormatter = (value: any) => `${value} USD`;

  const lines = [
    { dataKey: 'sales', color: '#8884d8' },
    { dataKey: 'revenue', color: '#82ca9d' },
  ];

  const dummyData = [
    {
      week: 1,
      'Peoria/Kingman': 10,
      Tucson: 20,
      Colorado: 30,
      'Albuquerque/El Paso': 40,
      Tempe: 50,
      Texas: 60,
      '#N/A': 70,
    },
    {
      week: 2,
      'Peoria/Kingman': 12,
      Tucson: 18,
      Colorado: 32,
      'Albuquerque/El Paso': 42,
      Tempe: 55,
      Texas: 65,
      '#N/A': 75,
    },
    {
      week: 3,
      'Peoria/Kingman': 15,
      Tucson: 22,
      Colorado: 35,
      'Albuquerque/El Paso': 45,
      Tempe: 60,
      Texas: 68,
      '#N/A': 80,
    },
    {
      week: 4,
      'Peoria/Kingman': 18,
      Tucson: 25,
      Colorado: 38,
      'Albuquerque/El Paso': 48,
      Tempe: 62,
      Texas: 70,
      '#N/A': 85,
    },
    {
      week: 5,
      'Peoria/Kingman': 20,
      Tucson: 30,
      Colorado: 40,
      'Albuquerque/El Paso': 50,
      Tempe: 65,
      Texas: 72,
      '#N/A': 90,
    },
    {
      week: 6,
      'Peoria/Kingman': 22,
      Tucson: 28,
      Colorado: 42,
      'Albuquerque/El Paso': 52,
      Tempe: 68,
      Texas: 74,
      '#N/A': 95,
    },
    {
      week: 7,
      'Peoria/Kingman': 25,
      Tucson: 32,
      Colorado: 45,
      'Albuquerque/El Paso': 55,
      Tempe: 70,
      Texas: 77,
      '#N/A': 100,
    },
    {
      week: 8,
      'Peoria/Kingman': 28,
      Tucson: 35,
      Colorado: 48,
      'Albuquerque/El Paso': 58,
      Tempe: 72,
      Texas: 80,
      '#N/A': 105,
    },
    {
      week: 9,
      'Peoria/Kingman': 30,
      Tucson: 40,
      Colorado: 50,
      'Albuquerque/El Paso': 60,
      Tempe: 75,
      Texas: 82,
      '#N/A': 110,
    },
    {
      week: 10,
      'Peoria/Kingman': 32,
      Tucson: 42,
      Colorado: 52,
      'Albuquerque/El Paso': 62,
      Tempe: 78,
      Texas: 85,
      '#N/A': 115,
    },
  ];
  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        {/* <h4 className="reports-title">Quality</h4> */}
        <BackButtom heading="Quality per Office" />
        <div className="report-header-dropdown flex-wrap">
          <div>
            <SelectOption
              options={[
                {
                  label: 'Albuquerque/El Paso',
                  value: 'Albuquerque/El Paso',
                },
                {
                  label: 'Colorado',
                  value: 'Colorado',
                },
                {
                  label: 'Peoria/Kingman',
                  value: 'Peoria/Kingman',
                },
                {
                    label: 'Tempe',
                    value: 'Tempe',
                  },
                  {
                    label: 'Texas',
                    value: 'Texas',
                  },
              ]}
              onChange={(value: any) => setReportType(value)}
              value={reportType}
              controlStyles={{ marginTop: 0, minHeight: 30, minWidth: 150 }}
              menuListStyles={{ fontWeight: 400 }}
              singleValueStyles={{ fontWeight: 400 }}
            />
          </div>
        </div>
      </div>
      <div className="reports-yscroll">
        <div
          style={{
            background: '#ddd',
            height: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            width: '100%',
            margin: '10px 0',
            fontWeight: '700',
          }}
        >
          Completed First Time
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
          }}
          className={`${styles.mainContainer} quality-top-div-wrapper`}
        >
          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                {/* <div className={styles.chartWrapper}>
                <ReusableLineChart
  data={data}
  lines={lines}
  xAxisKey="week" 
  height={240}
  width={600}
  yAxisLabel="Amount ($)"
  xAxisLabel="Week"  
  showGrid={true}
  showLegend={true}
  showTooltip={true}
  margin={{ top: 20, right: 30, bottom: 30, left: 40 }}
  className="my-4"
/>
                </div> */}
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  {/* <LineGraphProd data={dummyData} /> */}
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                {/* <div className={styles.chartWrapper}>
                <ReusableLineChart
  data={data}
  lines={lines}
  xAxisKey="week" 
  height={240}
  width={600}
  yAxisLabel="Amount ($)"
  xAxisLabel="Week"  
  showGrid={true}
  showLegend={true}
  showTooltip={true}
  margin={{ top: 20, right: 30, bottom: 30, left: 40 }}
  className="my-4"
/>
                </div> */}
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                {/* <div className={styles.chartWrapper}>
                <ReusableLineChart
  data={data}
  lines={lines}
  xAxisKey="week" 
  height={240}
  width={600}
  yAxisLabel="Amount ($)"
  xAxisLabel="Week"  
  showGrid={true}
  showLegend={true}
  showTooltip={true}
  margin={{ top: 20, right: 30, bottom: 30, left: 40 }}
  className="my-4"
/>
                </div> */}
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>

                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>

          <div className="qualty-top-div">
            <div className={`${styles.sectionWrapper} qual-sec-1`}>
              <div className="approved-sec">
                <h1>Completed First Time - Overall</h1>
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
                <h1>First Time Completion Rate - Overall </h1>
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
              <div className={styles.graphWrapper}>
                <p> Completed First Time (Weekly)</p>
                <div className={`${styles.chartWrapper} main-graph`}>
                  <h3 style={{ textAlign: 'center' }}>
                    {/* {reportType.label} {graph.title} */}
                  </h3>
                  <CompletedFirstTimeGraph data={dummyData} />
                  {/* <p className="chart-info-report">Week</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedFirstTime;
