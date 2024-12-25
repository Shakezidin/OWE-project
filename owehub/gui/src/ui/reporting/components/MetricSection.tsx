import React, { useEffect } from 'react';
import TableCustom from './Tables/CustomTable2';
import { TransformedGraphData, TableData } from '../types/speedTypes';
import LineGraph from './LineGraph2';

interface MetricSectionProps {
  title: string;
  graphData: TransformedGraphData[];
  tableData: TableData[];
}

const MetricSection: React.FC<MetricSectionProps> = ({ title, graphData, tableData }) => {
  useEffect(() => {
    console.log(`MetricSection - ${title} Data:`, {
      graphData,
      tableData
    });
  }, [title, graphData, tableData]);

  return (
    <div className="metric-section mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/2">
          <TableCustom
            middleName={title}
            data={tableData}
            setData={() => {}}
          />
        </div>
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow p-4" style={{ minHeight: '400px' }}>
          <LineGraph data={graphData} />
        </div>
      </div>
    </div>
  );
};

export default MetricSection;