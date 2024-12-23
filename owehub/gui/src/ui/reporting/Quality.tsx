import React, { useState } from 'react'
import './styles/quality.css'
import SelectOption from '../components/selectOption/SelectOption'
import TableGrey from './components/Tables/LeftGreyTable';
import LineGraph from './components/LineGraph';
import TableCustom from './components/Tables/CustomTable';
import QualityTable from './components/Tables/QualityTable';
import QualityTable2 from './components/Tables/QualityTable2';

interface Option {
  value: string;
  label: string;
}

const Quality = () => {
  const [reportType, setReportType] = useState<Option>(
    {
      label: 'FIN',
      value: 'FIN',
    }
  );
  const stylesGraph = {
    width: '100%',
    height: '280px',
  };
  return (
    <div className="total-main-container">
      <div className="headingcount flex justify-between items-center">
        <h4 className="reports-title">Production</h4>
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
          margin: '10px 0',
          fontWeight: "700"
        }}
      >
        {reportType.label}
      </div>

      <div className='qualty-top-div'>
        <div className='qual-sec-1'>
          <div className='approved-sec'>
            <h1>{reportType.label} Approved</h1>
            <TableGrey data={[
              { column1: 'Tucson', column2: '44' },
              { column1: 'India', column2: '45' },
              { column1: 'USA', column2: '1' },
              { column1: 'Tucson', column2: '44' },
              { column1: 'India', column2: '45' },
              { column1: 'USA', column2: '1' },
            ]} /></div>
          <div className='approved-sec'>
            <h1>{reportType.label} Pass Rate</h1>
            <TableGrey data={[
              { column1: 'Tucson', column2: '44' },
              { column1: 'India', column2: '45' },
              { column1: 'USA', column2: '1' },
              { column1: 'India', column2: '45' },
              { column1: 'USA', column2: '1' },
              { column1: 'India', column2: '45' },
              { column1: 'USA', column2: '1' },
            ]} />
          </div>
          <div className='approved-sec'>
            <h1>{reportType.label} Pending</h1>
            <QualityTable
              reportType=""
              middleName=""
              data={[
                { column1: 'Tucson', column2: '44', column3: '44' },
                { column1: 'India', column2: '45', column3: '44' },
                { column1: 'USA', column2: '1', column3: '44' },
              ]}
            />
          </div>
          <div className="main-graph" style={stylesGraph}>
            <h1>{reportType.label} Approved</h1>
            <LineGraph />
          </div>
        </div>
        <div className='qual-sec-2'>
          <div className='approved-sec'>
            <h1>{reportType.label} Failed</h1>
            <TableGrey data={[
              { column1: 'Tucson', column2: '44' },
              { column1: 'India', column2: '45' },
              { column1: 'USA', column2: '1' },
              { column1: 'Tucson', column2: '44' },
              { column1: 'India', column2: '45' },
              { column1: 'USA', column2: '1' },
            ]} />
          </div>
          <div className='approved-sec'>
            <h1>{reportType.label} Source of Fail</h1>
            <QualityTable2
              reportType=""
              middleName=""
              data={[
                { column1: 'Tucson', column2: '44', column3: '44', column4: 'Tucson', column5: '44', column6: '44' },
                { column1: 'India', column2: '45', column3: '44', column4: 'Tucson', column5: '44', column6: '44' },
                { column1: 'USA', column2: '1', column3: '44', column4: 'Tucson', column5: '44', column6: '44' },
              ]}
            />
          </div>
          <div className="main-graph" style={stylesGraph}>
            <h1>{reportType.label} Failed</h1>
            <LineGraph />
          </div>
        </div>
      </div>

    </div>
  )
}

export default Quality
