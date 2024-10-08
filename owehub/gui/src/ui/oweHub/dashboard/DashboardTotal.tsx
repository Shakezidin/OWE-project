import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from 'react';
import { ICONS } from '../../../resources/icons/Icons';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getDealerPayTileData } from '../../../redux/apiActions/dealerPayAction';

export interface DashboardTotalProps {
  setPrefferedType: Dispatch<SetStateAction<string>>;
}

const DashboardTotal: React.FC<DashboardTotalProps> = ({
  setPrefferedType,
}) => {
  const dispatch = useAppDispatch();

  const { tileData } = useAppSelector((state) => state.dealerPaySlice);

  useEffect(() => {
    dispatch(getDealerPayTileData({ dealer: 'dealer' }));
  }, [dispatch]);

  const data1 = [
    {
      doller: '$' + tileData?.amount_prepaid?.toFixed(2),
      paid: 'Amount Prepaid',
      img: ICONS.rep1,
      border: '1px solid #63BC51',
      boxBorder: '0.5px solid #63BC51',
      background: ICONS.tot1,
      key: 'amount_prepaid',
      color: '#8E81E0',
    },
    {
      doller: '$' + tileData?.pipeline_remaining?.toFixed(2),
      paid: 'Pipeline Remaining',
      img: ICONS.rep2,
      border: '1px solid #D768A8',
      boxBorder: '0.5px solid #D768A8',
      background: ICONS.tot2,
      key: 'pipeline_remaining',
      color: '#63ACA3',
    },
    {
      doller: '$' + tileData?.current_due?.toFixed(2),
      paid: 'Current Due',
      img: ICONS.rep3,
      border: '1px solid #3993D0',
      boxBorder: '0.5px solid #3993D0',
      background: ICONS.tot3,
      key: 'current_due',
      color: '#EE824D',
    },
  ];

  const [activeCard, setActiveCard] = useState(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (key: any) => {
    setActiveCard((prevActiveCard) => (prevActiveCard === key ? null : key));
    setPrefferedType(key);
  };

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
          {data1.length > 0
            ? data1.map((el, i) => (
                <div
                  key={el.key}
                  onClick={() => handleClick(el.key)}
                  className="total-commisstion"
                  style={{
                    backgroundImage: `url(${el.background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    outline:
                      activeCard === el.key ? `4px solid ${el.color}` : 'none',
                    outlineOffset: activeCard === el.key ? '4px' : '0px',
                    transform:
                      activeCard === el.key ? 'scale(1.02)' : 'scale(1)',
                    transition:
                      'transform 0.3s ease, outline 0.3s ease, outline-offset 0.3s ease',
                    boxShadow:
                      activeCard === el.key
                        ? '0px 4px 4px 0px rgba(74, 74, 74, 0.25)'
                        : 'none',
                  }}
                >
                  <div
                    className="total-section"
                    style={{ marginBottom: '8px' }}
                  >
                    <p>{el.paid}</p>
                    <h4
                      style={{
                        wordBreak:
                          el.doller.length > 5 ? 'break-all' : 'normal',
                      }}
                    >
                      {/* {el.doller} */}
                      {"N/A"}
                    </h4>
                  </div>
                  <div className="teamImg">
                    <img src={el.img} alt="" />
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
};

export default DashboardTotal;
