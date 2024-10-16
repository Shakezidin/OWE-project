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
import { IoArrowUp, IoArrowDown } from "react-icons/io5";

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
      bar: ICONS.repBar1,
      key: 'amount_prepaid',
      color: "#0493CE",
      bgColor: "#E3F3FC",
      percent: "+12",
      arrow: <IoArrowUp  />
    },
    {
      doller: '$' + tileData?.pipeline_remaining?.toFixed(2),
      paid: 'Pipeline Remaining',
      img: ICONS.rep2,
      bar: ICONS.repBar2,
      key: 'pipeline_remaining',
      color: "#9DD428",
      bgColor: "#EBF4DA",
      percent: "-9",
      arrow: <IoArrowDown />
    },
    {
      doller: '$' + tileData?.current_due?.toFixed(2),
      paid: 'Current Due',
      img: ICONS.rep3,
      bar: ICONS.repBar3,
      key: 'current_due',
      color: "#2DC278",
      bgColor: "#E1F6EB",
      percent: "+12",
      arrow: <IoArrowUp  />
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
              <div className="total-commisstion"  
              // style={{
              //   cursor: 'pointer',
              //   outline:
              //     activeCard === el.key ? `2px solid ${el.color}` : 'none',
              //   outlineOffset: activeCard === el.key ? '2px' : '0px',
              //   transform:
              //     activeCard === el.key ? 'scale(1.02)' : 'scale(1)',
              //   transition:
              //     'transform 0.3s ease, outline 0.3s ease, outline-offset 0.3s ease',
              //   boxShadow:
              //     activeCard === el.key
              //       ? '2px 4px 4px 0px rgba(74, 74, 74, 0.25)'
              //       : 'none',
              // }}
              >
                <div
                  key={el.key}
                  onClick={() => handleClick(el.key)}
                  className="dealer-tot-amt"
                  style={{width: "100%", gap: "10px"}}
                >
                  <div
                    className="total-section"
                  >
                    <div className='flex items-center' style={{ gap: "10px" }}>
                      <div className="flex items-center">
                        <img src={el.img} height={32} width={32} alt="" />
                      </div>
                      <p>{el.paid}</p>
                    </div>
                  </div>
                  <h4
                    style={{
                      wordBreak:
                        el.doller.length > 5 ? 'break-all' : 'normal',
                    }}
                  >
                    {/* {el.doller} */}
                    {"$462394623946923864923469782364237964"}
                  </h4>
                </div>
                <div className='total-section-desc'>
                  <img src={el.bar} alt="bars-image"/>
                  <p className='tsd-percent' style={{background: el.bgColor}}><span className='flex items-center' style={{color: el.color}}>{el.arrow}&nbsp;{el.percent}%</span></p>
                  <p className='tsd-text'>From the last month</p>
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
