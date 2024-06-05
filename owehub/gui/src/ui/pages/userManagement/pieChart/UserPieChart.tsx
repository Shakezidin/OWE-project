import React, { useCallback, useEffect, useRef, useState } from 'react';
import './barchart.css';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  LabelList,
  Tooltip,
  Cell,
} from 'recharts';
import { OnboardingChartModel } from '../../../../core/models/api_models/UserManagementModel';
import DataNotFound from '../../../components/loader/DataNotFound';
import perfomance_mask from '../lib/perfomance_mask.png';
import onboarding_mask from '../lib/onboarding_mask.png';
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
  const [active, setActive] = useState({ x: 0, y: 0, index: -1 });
  console.log(userPerformanceList);
  const tooltip = useRef<null | HTMLDivElement>(null);

  const randomHsl = () => `hsla(${Math.random() * 360}, 100%, 50%, 1)`;
  const total =
    onboardingList?.reduce?.((accu, item) => (accu += item.value), 0) || 0;
  const getPercentage = (val: number) => {
    return Math.round((val / total) * 100);
  };
  const timer = useRef<null | NodeJS.Timeout>(null);
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const elm = e.target as HTMLElement;
      if (!(elm.closest('.dougnout') && elm.contains(tooltip.current))) {
        timer.current = setTimeout(() => {
          setActive({ x: 0, y: 0, index: -1 });
        }, 1000);
      }
    };
    window.addEventListener('mousemove', listener);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      window.removeEventListener('mousemove', listener);
    };
  }, []);
  return (
    <div className="chart-view">
      <div
        className="pie-section"
        style={{
          width: '50%',
          height: '100%',
          background: 'white',
          borderRadius: '18px',
          padding: '1.5rem',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="pieChart-section">
          <h2>Onboarding Detail</h2>
        </div>
        <div className="mt2">
          <div className="flex items-start">
            {!!onboardingList.length ? (
              <div style={{ width: 'fit-content' }} className="relative">
                <PieChart width={360} height={300}>
                  <Pie
                    data={onboardingList}
                    cx="40%"
                    cy="50%"
                    className="onboarding-pie"
                    innerRadius={90} // Adjust the inner radius for the doughnut thickness
                    outerRadius={130}
                    fill="#8884d8"
                    paddingAngle={0.1}
                    dataKey="value"
                    strokeWidth={3}
                    // label={()=><img src={onboarding_mask} alt="" className='onboarding-mask-img' />}
                  >
                    {onboardingList.map((entry, index) => (
                      <Cell
                        id={`${index}`}
                        key={`cell-${index}`}
                        fill={entry.fill}
                      />
                    ))}
                  </Pie>
                </PieChart>
                <img
                  src={onboarding_mask}
                  alt=""
                  className="onboarding-mask-img"
                />
                {/* <ResponsiveContainer width={'100%'} height={300}>
              </ResponsiveContainer> */}
              </div>
            ) : (
              <div className="data-not-found">
                <DataNotFound />
                <h3>{loading ? 'Searching..' : 'No SaleRep Found'}</h3>
              </div>
            )}

            <div className="flex-auto">
              {!!onboardingList.length && (
                <h4 className="h4 mb2 text-dark" style={{ fontWeight: '600' }}>
                  Number of users
                </h4>
              )}
              {onboardingList.map((user) => {
                return (
                  <div key={user.fill} className="flex mb1 items-center">
                    <div
                      className="pie-circle-denote mr1"
                      style={{ backgroundColor: user.fill }}
                    />
                    <div className="flex h5 text-dark items-center">
                      <span style={{ fontWeight: 600 }}> {user.value} </span>
                      <span className="mx1"> - </span>
                      <span style={{ fontWeight: 500 }}> {user.name} </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        className="pie-section"
        style={{
          width: '50%',
          height: '100%',
          background: 'white',
          borderRadius: '18px',
          padding: '1.5rem',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="pieChart-section">
          <h2>Performance</h2>
        </div>
        {userPerformanceList && userPerformanceList.length > 0 ? (
          <div
            style={{ width: '100%', height: '90%', outline: 'none' }}
            className="pie-chart-container relative"
          >
            <ResponsiveContainer width={'100%'} height={300}>
              <PieChart>
                <Pie
                  data={userPerformanceList}
                  cx="50%"
                  className="dougnout"
                  cy="50%"
                  innerRadius={90} // Adjust the inner radius for the doughnut thickness
                  outerRadius={130}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={3}
                >
                  {userPerformanceList.map((entry, index) => (
                    <Cell
                      onMouseOver={(data) => {
                        const elm = data.target as SVGElement;
                        const cords = elm.getBoundingClientRect();
                        if (timer.current) {
                          clearTimeout(timer.current);
                        }
                        setActive({
                          x: cords.x,
                          y: cords.y,
                          index: parseInt(elm.id),
                        });
                      }}
                      id={`${index}`}
                      key={`cell-${index}`}
                      fill={entry.fill}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <img src={perfomance_mask} alt="" className="mask-chart-img" />
          </div>
        ) : (
          <div className="data-not-found">
            <DataNotFound />
            <h3>{loading ? 'Searching..' : 'No SaleRep Found'}</h3>
          </div>
        )}

        <div
          ref={tooltip}
          className="fixed bg-white"
          style={{
            top:active.index === 1? active.y+40:active.y,
            left: active.index === 1 ? active.x - 40 : active.x,
            transition: 'opacity 1s',
            borderRadius: 24,
            padding: '5px 20px',
            opacity: active.index >= 0 ? 1 : 0,
            boxShadow:"0 4px 4px rgba(0, 0, 0, 0.25)"
          }}
        >
          {userPerformanceList[active.index]?.value}
        </div>

        <div className="flex items-center justify-center pb2">
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
                }}
              />

              <span className="bold" style={{ color: '#263747' }}>
                {userPerformanceList?.[1]?.value}
              </span>
            </div>
            <span className="mx1">-</span>

            <h3 className="h4" style={{ fontWeight: '500' }}>
              Active Users
            </h3>
          </div>

          <div className="flex items-center ml3">
            <div className="flex items-center">
              <div
                className="flex items-center mr1"
                style={{
                  background: '#EE824D',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: '3px solid #FFE2D4',
                }}
              />

              <span className="bold" style={{ color: '#263747' }}>
                {userPerformanceList?.[0]?.value}
              </span>
            </div>
            <span className="mx1">-</span>

            <h3 className="h4" style={{ fontWeight: '500' }}>
              Inactive Users
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPieChart;
