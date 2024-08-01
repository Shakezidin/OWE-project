import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getDealerPayTileData } from '../../../../redux/apiActions/dealerPayAction';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import useMatchMedia from '../../../../hooks/useMatchMedia';
import './pojpie.css';
import DataNotFound from '../../../components/loader/DataNotFound';
import { Tooltip } from 'react-tooltip';

interface ChartDataItem {
  name: string;
  value: number;
}

const Proj_pie_chart: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tileData, loading } = useAppSelector((state) => state.dealerPaySlice);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    dispatch(getDealerPayTileData({ dealer: 'dealer' }));
  }, [dispatch]);

  useEffect(() => {
    if (tileData) {
      const amountPrepaid = tileData.amount_prepaid || 0;
      const pipelineRemaining = tileData.pipeline_remaining || 0;
      setChartData([
        { name: 'Amount Prepaid', value: amountPrepaid },
        { name: 'Pipeline Remaining', value: pipelineRemaining },
      ]);
    }
  }, [tileData]);

  const COLORS = ['#62aca3', '#FF8042'];
  const isTablet = useMatchMedia('(max-width: 1024px)');

  return (
    <div className="proj-pie">
      {loading ||
      (tileData?.pipeline_remaining === 0 && tileData?.amount_prepaid === 0) ? (
        <div
          className="data-not-found"
          style={{ width: '100%', marginTop: '-98px' }}
        >
          <DataNotFound title={loading ? 'Searching..' : 'No Data Found'} />
        </div>
      ) : (
        <>
          <PieChart width={isTablet ? 210 : 360} height={isTablet ? 200 : 220}>
            <Pie
              data={chartData}
              innerRadius={isTablet ? 60 : 53}
              outerRadius={isTablet ? 85 : 80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>

          <div className="stats-wrapper items-center justify-center pb2">
            <div className="flex items-center">
              <div className="flex items-center">
                <div
                  className="flex items-center mr1"
                  style={{
                    background: '#63ACA3',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: '3px solid #D2FFF9',
                    flexShrink: 0,
                  }}
                />

                <span className="bold h5" style={{ color: '#263747' }}>
                  {Number(tileData?.amount_prepaid).toFixed(2)}
                </span>
              </div>
              <span className='bold' style={{padding: "0 5px"}}>-</span>

              <h3 className="h5" style={{ fontWeight: '500' }}>
                Amount Prepaid
              </h3>
            </div>

            <div className="flex items-center ">
              <div className="flex items-center">
                <div
                  className="flex items-center mr1"
                  style={{
                    background: '#EE824D',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: '3px solid #FFE2D4',
                    flexShrink: 0,
                  }}
                />

                <span className="bold h5" style={{ color: '#263747' }}>
                  {Number(tileData?.pipeline_remaining).toFixed(2)}
                </span>
              </div>
              <span className="mxhalf bold" style={{padding: "0 5px"}}>-</span>

              <h3 className="h5" style={{ fontWeight: '500' }}>
                Pipeline Remaining
              </h3>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Proj_pie_chart;
