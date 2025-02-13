import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from 'react';
import { ICONS } from '../../../resources/icons/Icons';
import { IoArrowUp, IoArrowDown } from 'react-icons/io5';
import MicroLoader from '../../components/loader/MicroLoader';
export interface DashboardTotalProps {
  setPrefferedType: Dispatch<SetStateAction<string>>;
  tileData: any;
  loading: Boolean;
}

const DashboardTotal: React.FC<DashboardTotalProps> = ({
  tileData,
  loading,
}) => {

  const getArrow = (percent: number) => {
    return percent >= 0 ? <IoArrowUp /> : <IoArrowDown />;
  };

  const data1 = [
    {
      doller: tileData ? '$' + tileData?.amount_prepaid?.toFixed(2) : '',
      paid: 'Amount Prepaid',
      img: ICONS.rep1,
      bar: ICONS.repBar1,
      key: 'amount_prepaid',
      color: '#0493CE',
      bgColor: '#E3F3FC',
      percent: tileData ? tileData?.amount_prepaid_per?.toFixed(2) : '',
      arrow: getArrow(tileData?.amount_prepaid_per),
    },
    {
      doller: tileData ? '$' + tileData?.pipeline_remaining?.toFixed(2) : '',
      paid: 'Pipeline Remaining',
      img: ICONS.rep2,
      bar: ICONS.repBar2,
      key: 'pipeline_remaining',
      color: '#9DD428',
      bgColor: '#EBF4DA',
      percent: tileData ? tileData?.pipeline_remaining_per?.toFixed(2) : '',
      arrow: getArrow(tileData?.pipeline_remaining_per),
    },
    {
      doller: tileData ? '$' + tileData['current_Due ']?.toFixed(2) : '',
      paid: 'Current Due',
      img: ICONS.rep3,
      bar: ICONS.repBar3,
      key: 'current_due',
      color: '#2DC278',
      bgColor: '#E1F6EB',
      percent: tileData ? tileData['current_due_per ']?.toFixed(2) : '',
      arrow: getArrow(tileData['current_due_per ']),
    },
  ];

  const [activeCard, setActiveCard] = useState(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setActiveCard(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="">
        <div className="commission-section-dash" ref={ref}>
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 'auto',
              }}
            >
              <MicroLoader />
            </div>
          ) : (
            <>
              {data1.length > 0
                ? data1.map((el, i) => (
                    <div
                      className="total-commisstion"
                    >
                      <div
                        key={el.key}
                        className="dealer-tot-amt"
                        style={{ width: '100%', gap: '10px' }}
                      >
                        <div className="total-section">
                          <div
                            className="flex items-center"
                            style={{ gap: '10px' }}
                          >
                            <div className="flex items-center">
                              <img src={el.img} height={32} width={32} alt="" />
                            </div>
                            <p>{el.paid}</p>
                          </div>
                        </div>
                        <h4
                        >
                          {el?.doller || '$0'}
                        </h4>
                      </div>
                      <div className="total-section-desc">
                        <img src={el.bar} alt="bars-image" />
                        <p
                          className="tsd-percent"
                          style={{ background: el.bgColor }}
                        >
                          <span
                            className="flex items-center"
                            style={{ color: el.color }}
                          >
                            {el.arrow}&nbsp;{el.percent}%
                          </span>
                        </p>
                        <p className="tsd-text">From the last month</p>
                      </div>
                    </div>
                  ))
                : null}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardTotal;
