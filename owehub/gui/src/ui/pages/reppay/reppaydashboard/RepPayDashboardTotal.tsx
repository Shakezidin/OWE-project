import React from 'react';
import { ICONS } from '../../../icons/Icons';

const RepPayDashboardTotal: React.FC = () => {
  const data = [
    {
      doller: '$120,450',
      paid: 'Amount Prepaid',
      img: ICONS.rep1,
      backgroundColor: '#E9FFE5',
      border: '1px solid #63BC51',
      boxBorder: '0.5px solid #63BC51',
    },
    {
      doller: '$100,320',
      paid: 'Pipeline Remaining',
      img: ICONS.rep2,
      backgroundColor: '#FFE0F2',
      border: '1px solid #D768A8',
      boxBorder: '0.5px solid #D768A8',
    },
    {
      doller: '$100,320',
      paid: 'Current Due',
      img: ICONS.rep3,
      backgroundColor: '#D3EDFF',
      border: '1px solid #3993D0',
      boxBorder: '0.5px solid #3993D0',
    },
  ];
  return (
    <>
      <div className="">
        <div className="commission-section-dash">
          {data.length > 0
            ? data.map((el, i) => (
                <div className="total-rep" style={{ border: el.boxBorder }}>
                  <div className="rep-total-section">
                    <p>{el.paid}</p>
                    <h4>{el.doller}</h4>
                  </div>
                  <div
                    className="rep-teamImg"
                    style={{
                      backgroundColor: el.backgroundColor,
                      border: el.border,
                    }}
                  >
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

export default RepPayDashboardTotal;
