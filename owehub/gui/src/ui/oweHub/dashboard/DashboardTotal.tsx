import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ICONS } from '../../../resources/icons/Icons';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getDealerPayTileData } from '../../../redux/apiActions/dealerPayAction';

export interface DashboardTotalProps {
  setPrefferedType: Dispatch<SetStateAction<string>>;
}

const DashboardTotal: React.FC<DashboardTotalProps> = ({ setPrefferedType }) => {
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
      key:"amount_prepaid"
    },
    {
      doller: '$' + tileData?.pipeline_remaining?.toFixed(2),
      paid: 'Pipeline Remaining',
      img: ICONS.rep2,
      border: '1px solid #D768A8',
      boxBorder: '0.5px solid #D768A8',
      background: ICONS.tot2,
      key:"pipeline_remaining"
    },
    {
      doller: '$' + tileData?.current_due?.toFixed(2),
      paid: 'Current Due',
      img: ICONS.rep3,
      border: '1px solid #3993D0',
      boxBorder: '0.5px solid #3993D0',
      background: ICONS.tot3,
      key:"current_due"
    },
  ];

  return (
    <>
      <div className="">
        <div className="commission-section-dash">
          {data1.length > 0
            ? data1.map((el, i) => (
                <div
                onClick={()=>setPrefferedType(el.key)}
                  className="total-commisstion"
                  style={{
                    backgroundImage: `url(${el.background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor:"pointer"
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
                      {el.doller}
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
