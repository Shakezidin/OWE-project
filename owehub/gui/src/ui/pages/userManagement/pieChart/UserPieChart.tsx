import React, { useCallback } from 'react';
import './barchart.css';
import { ResponsiveContainer, PieChart, Pie, LabelList } from 'recharts';
import { OnboardingChartModel } from '../../../../core/models/api_models/UserManagementModel';
import DataNotFound from '../../../components/loader/DataNotFound';

interface UserPieChartProps {
  onboardingList: OnboardingChartModel[];
  userPerformanceList: OnboardingChartModel[];
  loading: boolean;
}

const renderCustomizedLabelPercentage = (data: any, total = 32000) => {
  let percentageCalculated = data.value;
  return `${percentageCalculated}`;
};

const UserPieChart: React.FC<UserPieChartProps> = ({
  onboardingList,
  userPerformanceList,
  loading,
}) => {
  const renderLabel = useCallback((piePiece: any) => {
    return piePiece.name;
  }, []);

  console.log('pie chart...', onboardingList);
  return (
    <div className="chart-view">
      <div
        className="pie-section"
        style={{
          width: '50%',
          height: '100%',
          background: 'white',
          borderRadius: '16px',
          padding: '1rem',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="pieChart-section">
          <h2>Onboarding Detail</h2>
        </div>
        <div
          style={{ width: '100%', height: '90%', outline: 'none' }}
          className="pie-chart-container"
        >
          <ResponsiveContainer>
            <PieChart style={{ outline: 'none' }}>
              <Pie
                style={{ outline: 'none' }}
                dataKey="value"
                data={onboardingList}
                label={renderLabel}
                cx="50%"
                cy="50%"
                outerRadius={'85%'}
                nameKey="name"
                fontSize={12}
                labelLine={true}
                textAnchor=""
                dominantBaseline="central"
              >
                <LabelList
                  fill="white"
                  dataKey={renderCustomizedLabelPercentage}
                  position="outside"
                  fontSize={12}
                  stroke="none"
                  className="label-percentage"
                  style={{ outline: 'none' }}
                  offset={-30}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className="pie-section"
        style={{
          width: '50%',
          height: '100%',
          background: 'white',
          borderRadius: '16px',
          padding: '1rem',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="pieChart-section">
          <h2>Performance</h2>
        </div>
        {userPerformanceList && userPerformanceList.length > 0 ? (
          <div style={{ width: '100%', height: '90%' }}>
            <ResponsiveContainer>
              <PieChart style={{ outline: 'none' }}>
                <Pie
                  style={{ outline: 'none' }}
                  dataKey="value"
                  data={userPerformanceList}
                  label={renderLabel}
                  cx="49%"
                  cy="51%"
                  outerRadius={'85%'}
                  nameKey="name"
                  fontSize={12}
                  labelLine={true}
                >
                  <LabelList
                    dy={0}
                    fill="white"
                    dataKey={renderCustomizedLabelPercentage}
                    position="inside"
                    fontSize={12}
                    angle={0}
                    stroke="none"
                    className="label-percentage"
                    offset={-30}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="data-not-found">
            <DataNotFound />
            <h3>{loading ? 'Searching..' : 'No SaleRep Found'}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPieChart;
